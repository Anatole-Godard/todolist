$(function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyD19BbBBS5p0JIeSFB8j8bW-uz1BqUFm5Q",
        authDomain: "todolist-cesi-projet.firebaseapp.com",
        databaseURL: "https://todolist-cesi-projet.firebaseio.com",
        projectId: "todolist-cesi-projet",
        storageBucket: "todolist-cesi-projet.appspot.com",
        messagingSenderId: "227020167507",
        appId: "1:227020167507:web:ddecb0b63ee239f28f69a6",
        measurementId: "G-9E2S2LKH62"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    if (localStorage.getItem('user') === null){
        console.log("pas co la");
        $('#signInSubmit').click(function () {
            let email = $('#signInEmail').val();
            let password = $('#signInPassword').val();
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                firebase.database().ref("/Users/").child(user.user.uid).on("value", (value) => {
                    var idUser = user.user.uid;
                    // var userSurname = value.val().Surname;
                    // var userName = value.val().Name;
                    $('#modalAuthAlert').hide();

                    console.log("on ce log");
                    localStorage.setItem('user', '"'+idUser+'"');
                    sessionStorage.setItem('user', '"'+idUser+'"');
                    document.location.reload();
                })
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
        });
        $('#signUpSubmit').click(function () {
            let email = $('#signUpEmail').val();
            let password2 = $('#signUpPassword2').val();
            let password = $('#signUpPassword').val();
            let name = $('#signUpName').val();
            if (password2 === password) {
                firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
                    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                        // Handle Errors connection here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // ...
                    });
                    localStorage.setItem('user', firebase.auth().currentUser.uid);
                    firebase.auth().currentUser.updateProfile({
                        displayName: name,
                        photoURL: "https://example.com/jane-q-user/profile.jpg"
                    }).then(function() {
                        // Update successful.
                    }).catch(function(error) {
                        // An error happened update profile.
                    });
                }).catch(function(error) {
                    // Handle Errors inscription here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                });
            } else {
                $('#alertSignUp').html('Mot de passe non identique !');
            }

        });
        // Initialize the FirebaseUI Widget using Firebase.

        $('#mainContent').hide();
        $('#signinDiv').fadeIn();
    }
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    firebase.auth().onAuthStateChanged(function(user) {
        console.log(user);
        if (user) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;
            localStorage.setItem('user', uid);
            $('#mainContent').fadeIn();
            $('#signinDiv').hide();
            $('#mainSubTitle').html('Taches de '+name);
            // User is signed in.
        } else {
            // No user is signed in.
        }
    });
    $('#Deco').click(function () {
        signOut();
        localStorage.clear('user');
        document.location.reload();
    })
    function signOut() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // An error happened.
        });
    }
})