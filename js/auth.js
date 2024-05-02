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

// Handle Sign-Up
$('#sign-up-form').submit(function(e) {
    e.preventDefault(); // Prevent form submission

        const email = $('#sign-up-email').val();
        const password = $('#sign-up-password').val();
        const reenterPassword = $('#re-enter-password').val();

        if (password !== reenterPassword) {
            alert("Passwords do not match. Please re-enter.");
            return; // Don't proceed if passwords don't match
        }
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Sign-up successful!");
            // Redirect or perform additional actions after successful sign-up
        })
        .catch((error) => {
            console.log(error)
            const errorMessage = getErrorMessage(error); // Get a user-friendly error message
            alert(errorMessage); // Show the error message to the user
        });
});

 // Function to handle sign-in and provide appropriate feedback
$('#sign-in-form').submit(function(e) {
    e.preventDefault(); // Prevent form submission

    const email = $('#sign-in-email').val().trim();
    const password = $('#sign-in-password').val().trim();

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // Redirect to the home page upon successful sign-in
            window.location.href = "index.html";
        })
        .catch((error) => {
            const errorMessage = getErrorMessage(error); // Get a user-friendly error message
            alert(errorMessage); // Show the error message to the user
        });
});

// Function to return a user-friendly error message for Firebase errors
function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-email':
            return "The email address is invalid. Please check and try again.";
        case 'auth/weak-password':
            return "Password should be at least 6 characters.";
        case 'auth/email-already-in-use':
            return "The email address is already in use, please signin.";
        case 'auth/user-disabled':
            return "This account has been disabled. Please contact support.";
        case 'auth/user-not-found':
            return "No account found with this email address.";
        case 'auth/internal-error':
            if (error.message.includes("INVALID_LOGIN_CREDENTIALS")) {
                return "Incorrect email or password. Please check your credentials and try again.";
            }
            return "An internal error occurred. Please try again later.";
        case 'auth/wrong-password':
            return "Incorrect password. Please try again.";
        case 'auth/too-many-requests':
            return "Too many unsuccessful attempts. Please wait a while and try again.";
        default:
            return "Sign-in failed. Please try again.";
    }
}

// Handle "Forgot Password" for password reset
$('#forgot-password').click(function() {
    const email = $('#sign-in-email').val();

    if (!email) {
        alert("Please enter your email address to reset your password.");
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Password reset email sent. Check your inbox.");
        })
        .catch((error) => {
            console.error("Error during password reset:", error);
            alert("Could not send password reset email. Please try again.");
        });
});