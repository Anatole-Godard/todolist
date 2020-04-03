$(function () {
    // configuration Firebase
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
    // Initialisation Firebase
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    // si la variable user du local storage est null
    if (localStorage.getItem('user') === null){
        //Si on click sur le bouton pour se connecter
        $('#signInSubmit').click(function () {
            let email = $('#signInEmail').val();
            let password = $('#signInPassword').val();
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                // Si connection reussi
            });
        });

        //Si on click sur le bouton pour s'inscrire
        $('#signUpSubmit').click(function () {
            let email = $('#signUpEmail').val();
            let password2 = $('#signUpPassword2').val();
            let password = $('#signUpPassword').val();
            let name = $('#signUpName').val();

            // Initialisation a la database de Firebase
            let db = firebase.firestore();

            // Si les inputs de password sont identique
            if (password2 === password) {
                // On créé le user avec sont mail et sont password
                firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {

                    // On ce connecte avec le nouveau compte
                    firebase.auth().signInWithEmailAndPassword(email, password);

                    // On rentre en database le nb de task a 0
                    db.collection("user").doc(firebase.auth().currentUser.uid).set({
                        nbTask: 0
                    });

                    // On enregistre le pseudo et l'url de l'avatar dans la database
                    db.collection("user").doc(firebase.auth().currentUser.uid).collection("userInfo").doc('userInfo').set({
                        pseudo:name,
                        photoURL: "https://i.pravatar.cc/350?u="+email
                    });

                    // On enregistre le pseudo et l'url de l'avatar les données d'authentification
                    firebase.auth().currentUser.updateProfile({
                        displayName: name,
                        photoURL: "https://i.pravatar.cc/350?u="+email
                    });

                    // On enregistre les variables utile dans le localstorage
                    localStorage.setItem('user', firebase.auth().currentUser.uid);
                    localStorage.setItem('photoURL', "https://i.pravatar.cc/350?u="+email);
                    localStorage.setItem('displayName', name);
                });
            } else { // Si les input password ne sont pas identique
                $('#alertSignUp').html('Mot de passe non identique !');
            }
        });
        $('#mainContent').hide();
        $('#signinDiv').fadeIn();
    }

    // On enregistre dans les variable si le user est deja connecté
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    // Si user n'est pas null
    if (user) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;

        // On enregistre les variables utile dans le localstorage
        localStorage.setItem('user', uid);
        localStorage.setItem('photoURL', photoUrl);
        localStorage.setItem('displayName', name);

        // on fait apparaitre la div de contenu
        $('#mainContent').fadeIn();

        // on cache la div de connection/inscription
        $('#signinDiv').hide();

        // on charge la page maintask.html dans la div de contenu
        $('#mainContent').load('includes/mainTask.html',function () {
            // on injecte le titre de la page
            $('#mainSubTitle').html('T&acirc;ches de '+name);
        });

        // on ajoute le bouton mon compte dans la navbar
        $('#account').html("<img id='imgNavbar' src=\""+user.photoURL+"\" style=\"max-width: 2em;\" class=\"rounded-circle mr-2\" alt=\"\"> Mon compte");
    }

    // Quand un changement de connection ce fait (deco et connection)
    firebase.auth().onAuthStateChanged(function(userData) {
        // Si userData n'est pas null
        if (userData) {
            user = userData;
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;

            // On enregistre les variables utile dans le localstorage
            localStorage.setItem('user', uid);
            localStorage.setItem('photoURL', photoUrl);
            localStorage.setItem('displayName', name);
            db.collection("user").doc(uid).collection('userInfo').doc('userInfo').get().then((querySnapshot) => {
                let arrayCollab = querySnapshot.data().myCollab;
                if (arrayCollab !== undefined) {
                    if (arrayCollab.length > 0) {
                        let listCollab = [];

                        for (let i = 0;i<arrayCollab.length;i++){
                            listCollab.push(arrayCollab[i]);
                        }
                        localStorage.setItem('myCollab',listCollab);
                    }
                }
            });
            // on fait apparaitre la div de contenu
            $('#mainContent').fadeIn();

            // on cache la div de connection/inscription
            $('#signinDiv').hide();

            // on charge la page maintask.html dans la div de contenu
            $('#mainContent').load('includes/mainTask.html',function () {
                $('#mainSubTitle').html('T&acirc;ches de '+name);
            })

            // on ajoute le bouton mon compte dans la navbar
            $('#account').html("<img id='imgNavbar' src=\""+user.photoURL+"\" style=\"max-width: 2em;\" class=\"rounded-circle mr-2\" alt=\"\"> Mon compte");
        } else { // Si userData est null
            $('#account').html("");
        }
    });
});