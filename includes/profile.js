$('#Deco').click(function () {
    signOut();
});

var db = firebase.firestore();

// Quand on click sur le bouton cahnger d'avatar
$('#editURL').click(function () {
    let newUrl = $('#newImg').val();
    if (newUrl !== '') {
        firebase.auth().currentUser.updateProfile({
            photoURL: newUrl
        }).then(function() { // Quand ca ce passe bien
            // on met a jour dans database/user
            db.collection("user").doc(firebase.auth().currentUser.uid).set({
                pseudo:localStorage.getItem('displayName'),
                photoURL:newUrl
            });

            // On clear l'input et l'alertImg
            $('#newImg').val('');
            $('#alertImg').html('');

            // Changement des images actuelles
            $('#imgProfile').attr('src',newUrl);
            $('#imgNavbar').attr('src',newUrl);

            // Notfication
            $('#alertNotif').addClass('alert-success')
                .html('<i class="fa fa-thumbs-up fa-2x" aria-hidden="true"></i> Avatar mis a jour.')
                .slideToggle();

            // après 3s (3000ms)
            setTimeout(function () {
                $('#alertNotif').removeClass('alert-success')
                    .html('')
                    .fadeOut();
            },3000);
            // Update successful.
        }).catch(function(error) { // Quand un erreur est arrivée
            // On clear l'input
            $('#newImg').val('');

            // Notfication
            $('#alertNotif').addClass('alert-danger')
                .html('<i class="fa fa-warning fa-2x" aria-hidden="true"></i> Une erreur est survenue, veuillez réessayer plus tard !')
                .slideToggle();
            // après 3s (3000ms)
            setTimeout(function () {
                $('#alertNotif').removeClass('alert-danger')
                    .html('')
                    .fadeOut();
            },3000);
        });
    } else {
        $('#alertImg').html('Veuillez saisir une URL !!');
    }
});

// Quand on click sur le bouton changer de mail
$('#editMail').click(function () {
    let newEmail = $('#newEmail').val();
    // on verifie que c'est bien un mail qui a été entré
    if (isEmail(newEmail)) {
        firebase.auth().currentUser.updateEmail(newEmail)
            .then(function() { // Quand ca ce passe bien
            // On clear l'input et l'alertImg
            $('#newEmail').val('');
            $('#alertMail').html('');

            // Changement des images actuelles
            $('#profileEmail').html("Email actuel : <span class='float-right h2'>"+firebase.auth().currentUser.email+"</span>");

            // Notfication
            $('#alertNotif').addClass('alert-success')
                .html('<i class="fa fa-thumbs-up fa-2x" aria-hidden="true"></i> Email mis a jour.')
                .slideToggle();

            // après 3s (3000ms)
            setTimeout(function () {
                $('#alertNotif').removeClass('alert-success')
                    .html('')
                    .fadeOut();
            },3000);
            // Update successful.
        }).catch(function(error) { // Quand un erreur est arrivée
            // On clear l'input
            $('#newEmail').val('');

            // Notfication
            $('#alertNotif').addClass('alert-danger')
                .html('<i class="fa fa-warning fa-2x" aria-hidden="true"></i> Une erreur est survenue, veuillez vous déconnecter puis reconnecter-vous et réessayer !')
                .slideToggle();
            // après 6s (6000ms)
            setTimeout(function () {
                $('#alertNotif').removeClass('alert-danger')
                    .html('')
                    .fadeOut();
            },6000);
        });
    } else {
        $('#alertMail').html('N\'est pas une adresse mail');
    }
});

// Quand on click sur le bouton cahnger d'avatar
$('#editPseudo').click(function () {
    let newPseudo = $('#newPseudo').val();
    if (newPseudo !== '') {
        firebase.auth().currentUser.updateProfile({
            displayName: newPseudo
        }).then(function() { // Quand ca ce passe bien
            // on met a jour dans database/user
            let lastphotoURL = localStorage.getItem('displayName');
            db.collection("user").doc(firebase.auth().currentUser.uid).set({
                pseudo:newPseudo,
                photoURL:lastphotoURL
            });
            // On clear l'input et l'alertImg
            $('#newPseudo').val('');
            $('#alertPseudo').html('');

            // Changement du pseudo dans la page profil
            $('#profilePseudo').html("Pseudo actuel : <span class='float-right h2'>"+firebase.auth().currentUser.displayName+"</span>");

            // Notfication
            $('#alertNotif').addClass('alert-success')
                .html('<i class="fa fa-thumbs-up fa-2x" aria-hidden="true"></i> Pseudo mis a jour.')
                .slideToggle();

            // après 3s (3000ms)
            setTimeout(function () {
                $('#alertNotif').removeClass('alert-success')
                    .html('')
                    .fadeOut();
            },3000);
            // Update successful.
        }).catch(function(error) { // Quand un erreur est arrivée
            // On clear l'input
            $('#newPseudo').val('');

            // Notfication
            $('#alertNotif').addClass('alert-danger')
                .html('<i class="fa fa-warning fa-2x" aria-hidden="true"></i> Une erreur est survenue, veuillez réessayer plus tard !')
                .slideToggle();
            // après 3s (3000ms)
            setTimeout(function () {
                $('#alertNotif').removeClass('alert-danger')
                    .html('')
                    .fadeOut();
            },3000);
        });
    } else {
        $('#alertPseudo').html('Veuillez saisir un pseudo !!');
    }
});

// Quand on click sur le bouton changer de mot de passe
$('#editPassword').click(function () {
    let newPassword = $('#newPassword').val();
    let newPassword2 = $('#newPassword2').val();
    // on verifie que c'est bien un mail qui a été entré
    if (newPassword === newPassword2) {
        firebase.auth().currentUser.updatePassword(newPassword)
            .then(function() { // Quand ca ce passe bien
                // On clear l'input et l'alertImg
                $('#newPassword').val('');
                $('#newPassword2').val('');
                $('#alertPassword').html('');

                // Notfication
                $('#alertNotif').addClass('alert-success')
                    .html('<i class="fa fa-thumbs-up fa-2x" aria-hidden="true"></i> Mot de passe mis a jour.')
                    .slideToggle();

                // après 3s (3000ms)
                setTimeout(function () {
                    $('#alertNotif').removeClass('alert-success')
                        .html('')
                        .fadeOut();
                },3000);
                // Update successful.
            }).catch(function(error) { // Quand un erreur est arrivée
            // On clear l'input
            $('#newPassword').val('');
            $('#newPassword2').val('');

            // Notfication
            $('#alertNotif').addClass('alert-danger')
                .html('<i class="fa fa-warning fa-2x" aria-hidden="true"></i> Une erreur est survenue, veuillez vous déconnecter puis reconnecter-vous et réessayer !')
                .slideToggle();
            // après 6s (6000ms)
            setTimeout(function () {
                $('#alertNotif').removeClass('alert-danger')
                    .html('')
                    .fadeOut();
            },6000);
        });
    } else {
        // On clear l'input
        $('#newPassword').val('');
        $('#newPassword2').val('');

        $('#alertPassword').html('Mot de passe non identique !!');
    }
});

// fonction verification regEx si email
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

// fonction pour ce deconnecter
function signOut() {
    localStorage.clear('user');
    firebase.auth().signOut().then(function() {
        // An error happened.
    });
    // Sign-out successful.
    document.location.reload();
}