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
        $('#signInSubmit').click(function () {
            let email = $('#signInEmail').val();
            let password = $('#signInPassword').val();
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                // Si connection reussi
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

    if (user) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
        localStorage.setItem('user', uid);
        $('#mainContent').fadeIn();
        $('#signinDiv').hide();
        $('#mainContent').load('includes/mainTask.html',function () {
            $('#mainSubTitle').html('Taches de '+name);
        });
        $('#account').html("<i class=\"fa fa-user-circle\" aria-hidden=\"true\"></i> Mon compte");
        // User is signed in.
    }


    firebase.auth().onAuthStateChanged(function(userData) {
        console.log(userData);
        if (userData) {
            user = userData;
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;
            localStorage.setItem('user', uid);
            $('#mainContent').fadeIn();
            $('#signinDiv').hide();
            $('#mainContent').load('includes/mainTask.html',function () {
                $('#mainSubTitle').html('Taches de '+name);
            });
            $('#account').html("<i class=\"fa fa-user-circle\" aria-hidden=\"true\"></i> Mon compte");
            // User is signed in.
        } else {
            $('#account').html("");
            // No user is signed in.
        }
    });

    $("#account").click(function () {
       $("#mainContent").load('includes/profile.html', function () {
           $('#accountInfo').append("<p>"+firebase.auth().currentUser.displayName+"</p>");
           $('#accountInfo').append("<p>"+firebase.auth().currentUser.email+"</p>");
           $('#accountInfo').append("<p>"+firebase.auth().currentUser.photoURL+"</p>");
           $('#accountInfo').append("<p>"+firebase.auth().currentUser.uid+"</p>");
           $('#Deco').append("<i class=\"fa fa-sign-out\" aria-hidden=\"true\"></i> Déconnection");
       });
    });

    $('#home').click(function () {
        $("#mainContent").load('includes/mainTask.html',function () {
            $('#mainSubTitle').html('Taches de '+name);
        });
    });

});