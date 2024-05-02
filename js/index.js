const firebaseConfig = {
    apiKey: "AIzaSyCV-wNJSxErdo_HxtbtzEQhj3FeaahfI00",
    authDomain: "invitx-3805a.firebaseapp.com",
    projectId: "invitx-3805a",
    storageBucket: "invitx-3805a",
    messagingSenderId: "1043923030574",
    appId: "1:1043923030574:web:774d2619d8d92a452305bf",
    measurementId: "G-G7NPPRZ9GS"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle user authentication and profile button update
auth.onAuthStateChanged((user) => {
    if (user) {
        $('#sign-in-link').hide(); // Hide sign-in if user is authenticated
        $('#sign-up-link').hide(); // Hide sign-up if user is authenticated
        $('#logout-link').show(); // Show logout link
        $('#profile-link').show(); // Show create/edit profile link
        $('#profileview').show();

        // Check if the user has a profile
        db.collection("profiles").where("userId", "==", user.uid).get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // User has a profile, set the profile button to navigate to edit page
                    const profile = querySnapshot.docs[0].data();
                    $('#profile-button').attr('href', `edit_profile.html?username=${profile.username}`);
                    $('#profile-button').text("Edit Your Profile");

                    // Set the action for the "View Profile" button
                    $('#view-profile-button').click(function () {
                        const username = profile.username;
                        window.location.href = `profile.html?username=${encodeURIComponent(username)}`;
                    });
                } else {
                    // No profile, set the button to navigate to create profile page
                    $('#profile-button').attr('href', 'create_profile.html');
                    $('#profile-button').text("Create Your Profile");
                }
            })
            .catch((error) => {
                console.error("Error checking user profile:", error);
            });
    } else {
        $('#sign-in-link').show(); // Show sign-in link
        $('#sign-up-link').show(); // Show sign-up link
        $('#logout-link').hide(); // Hide logout link
        $('#profile-link').hide(); // Hide profile link
    }
});

// Handle logout
$('#logout-button').click(function() {
    auth.signOut()
        .then(() => {
            window.location.href = "index.html"; // Redirect after logout
        })
        .catch((error) => {
            console.error("Error during logout:", error);
        });
});

// Navigate to the profile page based on the username entered
$('#find-profile-button').click(function() {
    const username = $('#username-input').val().trim();

    if (username) {
        const profileUrl = `profile.html?username=${encodeURIComponent(username)}`;
        window.location.href = profileUrl;
    } else {
        alert("Please enter a valid username.");
    }
});