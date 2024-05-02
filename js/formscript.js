// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCV-wNJSxErdo_HxtbtzEQhj3FeaahfI00",
    authDomain: "invitx-3805a.firebaseapp.com",
    projectId: "invitx-3805a",
    storageBucket: "invitx-3805a.appspot.com",
    messagingSenderId: "1043923030574",
    appId: "1:1043923030574:web:774d2619d8d92a452305bf",
    measurementId: "G-G7NPPRZ9GS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

$(document).ready(function() {

    // Check authentication state and show appropriate sections
    auth.onAuthStateChanged((user) => {
        if (user) {
            // If user is signed in, show the profile creation form and hide sign-in/sign-up
            $('#profile-creation').show();
            
        } else {
            // If user is not signed in, show sign-in and sign-up options
            window.location.href = "signin.html";
            $('#profile-creation').hide();
        }
    });

  


    $('#invitx-form').submit(function(e) {
        e.preventDefault(); // Prevent form from actually submitting
        
        $('#loading-text').show(); // Show loading text
        
        const user = auth.currentUser;
            if (!user) {
                alert("You must be signed in to create a profile.");
                return;
            }

        const username = $('#username').val().trim();
        
        if (!username) {
            alert("Username is required.");
            $('#loading-text').hide(); // Hide loading text on error
            return;
        }

        // Check if the username already exists
        db.collection("profiles").doc(username).get()
            .then((doc) => {
                if (doc.exists) {
                    alert("Username already exists. Please choose a different one.");
                    $('#loading-text').hide(); // Hide loading text on error
                    return;
                }

                // Prepare profile data to save to Firestore
                const data = {
                    userId: user.uid,
                    username: username,
                    fullName: $('#full-name').val(),
                    about: $('#about').val(),
                    phoneNo: $('#phone-no').val(),
                    whatsappNo: $('#whatsapp-no').val(),
                    email: $('#email').val(),
                    instagramId: $('#instagram-id').val(),
                    facebookId: $('#facebook-id').val(),
                    location: $('#location').val(), // Normal location
                    googleLocation: $('#google-location').val(), // Google Location (latitude and longitude)
                    twitter: $('#twitter-id').val(), // Twitter handle
                    education: $('#education').val(),
                    profession: $('#profession').val()
                };

                const fileInput = $('#profile-picture')[0];
                const file = fileInput.files[0];

                if (file) {
                    const storageRef = firebase.storage().ref();
                    const profilePicRef = storageRef.child(`profile_pictures/${username}/${file.name}`);

                    profilePicRef.put(file).then(() => {
                        profilePicRef.getDownloadURL().then((url) => {
                            data.profilePictureUrl = url;

                            // Save profile data to Firestore
                            db.collection("profiles").doc(username).set(data)
                                .then(() => {
                                    $('#loading-text').hide(); // Hide loading text on success
                                    alert("Profile created successfully!");
                                    // Redirect to the newly created profile
                                    window.location.href = `profile.html?username=${encodeURIComponent(username)}`;
                                })
                                .catch((error) => {
                                    console.error("Error creating profile:", error);
                                    $('#loading-text').hide(); // Hide loading text on error
                                    alert("Error creating profile. Please try again.");
                                });
                        });
                    }).catch((error) => {
                        console.error("Error uploading profile picture:", error);
                        $('#loading-text').hide(); // Hide loading text on error
                        alert("Error uploading profile picture. Please try again.");
                    });
                } else {
                    // No profile picture
                    db.collection("profiles").doc(username).set(data)
                        .then(() => {
                            $('#loading-text').hide(); // Hide loading text on success
                            alert("Profile created successfully!");
                            // Redirect to the newly created profile
                            window.location.href = `profile.html?username=${encodeURIComponent(username)}`;
                        })
                        .catch((error) => {
                            console.error("Error creating profile:", error);
                            $('#loading-text').hide(); // Hide loading text on error
                                    alert("Error creating profile. Please try again.");
                                });
                }
            })
            .catch((error) => {
                console.error("Error checking username:", error);
                $('#loading-text').hide(); // Hide loading text on error
                alert("Error checking username. Please try again.");
            });
    });

    // Function to get the current location and set it in the Google Location field
    $('#get-current-location').click(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    $('#google-location').val(`Latitude: ${latitude}, Longitude: ${longitude}`);
                },
                (error) => {
                    alert("Unable to get current location. Please try again.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
});
