const firebaseConfig = {
    apiKey: "AIzaSyCV-wNJSxErdo_HxtbtzEQhj3FeaahfI00",
    authDomain: "invitx-3805a.firebaseapp.com",
    projectId: "invitx-3805a",
    storageBucket: "invitx-3805a.appspot.com",
    messagingSenderId: "1043923030574",
    appId: "1:1043923030574:web:774d2619d8d92a452305bf",
    measurementId: "G-G7NPPRZ9GS"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

$(document).ready(function () {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Fetch the user's profile
            db.collection("profiles").where("userId", "==", user.uid).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const profile = querySnapshot.docs[0].data();
                        const docId = querySnapshot.docs[0].id;

                        // Populate the form with existing data
                        $('#full-name').val(profile.fullName);
                        $('#about').val(profile.about);
                        $('#profession').val(profile.profession);
                        $('#education').val(profile.education);
                        $('#phone-no').val(profile.phoneNo);
                        $('#whatsapp-no').val(profile.whatsappNo);
                        $('#email').val(profile.email);
                        $('#instagram-id').val(profile.instagramId);
                        $('#facebook-id').val(profile.facebookId);
                        $('#twitter-id').val(profile.twitterId);
                        $('#location').val(profile.location);
                        $('#google-location').val(profile.googleLocation);

                        if (profile.profilePictureUrl) {
                            $('#profile-preview').attr('src', profile.profilePictureUrl);
                        }

                        // Handle form submission
                        $('#edit-profile-form').submit(function (e) {
                            e.preventDefault();

                            $('#loading-text').show(); // Show loading text

                            const updatedData = {
                                fullName: $('#full-name').val(),
                                about: $('#about').val(),
                                profession: $('#profession').val(),
                                education: $('#education').val(),
                                phoneNo: $('#phone-no').val(),
                                whatsappNo: $('#whatsapp-no').val(),
                                email: $('#email').val(),
                                instagramId: $('#instagram-id').val(),
                                facebookId: $('#facebook-id').val(),
                                twitterId: $('#twitter-id').val(),
                                location: $('#location').val(),
                                googleLocation: $('#google-location').val()
                            };

                            const fileInput = $('#profile-picture')[0];
                            const file = fileInput.files[0];

                            if (file) {
                                const storageRef = firebase.storage().ref();
                                const profilePicRef = storageRef.child(`profile_pictures/${user.uid}/${file.name}`);

                                profilePicRef.put(file)
                                    .then(() => profilePicRef.getDownloadURL())
                                    .then((url) => {
                                        updatedData.profilePictureUrl = url;

                                        // Update Firestore with the new data
                                        db.collection("profiles").doc(docId).update(updatedData)
                                            .then(() => {
                                                alert("Profile updated successfully!");
                                            })
                                            .catch((error) => {
                                                console.error("Error updating profile:", error);
                                                alert("Error updating profile. Please try again.");
                                            })
                                            .finally(() => {
                                                $('#loading-text').hide(); // Hide loading text
                                            });
                                    })
                                    .catch((error) => {
                                        console.error("Error uploading profile picture:", error);
                                        alert("Error uploading profile picture. Please try again.");
                                        $('#loading-text').hide();
                                    });
                            } else {
                                // Update without profile picture
                                db.collection("profiles").doc(docId).update(updatedData)
                                    .then(() => {
                                        window.location.href = "index.html";
                                    })
                                    .catch((error) => {
                                        console.error("Error updating profile:", error);
                                        alert("Error updating profile. Please try again.");
                                    })
                                    .finally(() => {
                                        $('#loading-text').hide(); // Hide loading text
                                    });
                            }
                        });
                    } else {
                        console.error("Profile not found for the current user.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching profile:", error);
                });
        } else {
            console.error("User not authenticated.");
        }
    });

    // Function to get the current location and set it in the Google Location field
    $('#get-current-location').click(function () {
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
