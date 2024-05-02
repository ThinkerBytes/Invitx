
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


    
        // Function to extract the username from the URL query parameters
        function getUsernameFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get("username");
        }
    $(document).ready(function() {
        

        const username = getUsernameFromUrl(); // Get the username from the URL
        
        if (!username) {
            $('#error-text').show(); // Show error if username is not in the URL
            return;
        }

        $('#loading-text').show(); // Show loading text while fetching profile data

        // Fetch the user profile data from Firestore
        db.collection("profiles").doc(username).get()
            .then((doc) => {
                $('#loading-text').hide(); // Hide loading text

                if (doc.exists) {
                    const profileData = doc.data();

                    // Update OG meta tags with dynamic content
                    $('#og-title').attr("content", `${profileData.fullName} | Profile`);
                    $('#og-description').attr("content", profileData.about);
                    $('#og-image').attr("src", profileData.profilePictureUrl);

                    // Populate the profile page with user data
                    $('#profile-card').show(); // Show the profile card
                    $('#profile-picture').attr('src', profileData.profilePictureUrl);
                    $('#full-name').text(profileData.fullName);
                    $('#profession').text(profileData.profession);
                    
                    // Show About section only if it has content
                    if (profileData.about) {
                        $('#about').text(profileData.about);
                        $('#about-section').show(); // Display About section
                    }

                    // Set up clickable phone number for calling
                if (profileData.phoneNo) {
                    $('#phone-no').attr('href', `tel:${profileData.phoneNo.replace(/[^0-9]/g, '')}`);
                    $('#phone-no').text(profileData.phoneNo);
                    $('#phone-section').show(); // Display the phone section
                }
                
                    // Show WhatsApp, Email, Instagram, and other contact details only if they have data
                    if (profileData.whatsappNo) {
                        $('#whatsapp-no').attr('href', `https://wa.me/${profileData.whatsappNo.replace(/[^0-9]/g, '')}`);
                        $('#whatsapp-no').text(profileData.whatsappNo);
                        $('#whatsapp-section').show(); // Display WhatsApp section
                    }

                    if (profileData.email) {
                        $('#email').attr('href', `mailto:${profileData.email}`);
                        $('#email').text(profileData.email);
                        $('#email-section').show(); // Display Email section
                    }

                    if (profileData.instagramId) {
                        $('#instagram-id').attr('href', `https://www.instagram.com/${profileData.instagramId}/`);
                        $('#instagram-id').text(profileData.instagramId);
                        $('#instagram-section').show(); // Display Instagram section
                    }

                    if (profileData.facebookId) {
                        $('#facebook-id').attr('href', `https://www.facebook.com/${profileData.facebookId}/`);
                        $('#facebook-id').text(profileData.facebookId);
                        $('#facebook-section').show(); // Display Facebook section
                    }

                    if (profileData.location) {
                        $('#location').text(profileData.location);
                        $('#location-section').show(); // Display Location section
                    }

                    if (profileData.education) {
                        $('#education').text(profileData.education);
                        $('#education-section').show(); // Display Education section
                    }

                     // Twitter section if Twitter handle is available
                     if (profileData.twitter) {
                        const twitterUrl = `https://twitter.com/${profileData.twitter}`;
                        $('#twitter-id').attr('href', twitterUrl);
                        $('#twitter-id').text(profileData.twitter);
                        $('#twitter-section').show(); // Display Twitter section
                    }

                    // If Google location is provided, create a link to Google Maps for directions
                    if (profileData.googleLocation) {
                        const [latitude, longitude] = profileData.googleLocation.replace("Latitude: ", "").replace("Longitude: ", "").split(',');
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude.trim()},${longitude.trim()}`;
                        $('#google-location').attr('href', mapsUrl);
                        $('#google-location-section').show(); // Display Get Directions section
                    }

                    // Display the share button
                    $('#share-button').show();
                    $('#create-profile-button').show();

                    // Share button functionality
                    $('#share-button').click(function() {
                        const url = window.location.href;
                        if (navigator.share) {
                            navigator.share({
                                title: 'Invitx Profile',
                                text: 'Check out this profile!',
                                url: url
                            });
                        } else {
                            prompt('Copy this link to share:', url);
                        }
                    });
                    $('#create-profile-button').click(function() {
                        window.location.href = 'index.html'; // Redirect to the index page
                    });

                } else {
                    $('#error-text').show(); // Show error if the user profile is not found
                }
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
                $('#error-text').show(); // Show error message if there's an issue
            });
    });
  