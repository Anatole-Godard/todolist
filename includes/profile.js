// quand on click sur le boutton de deconnection
$('#Deco').click(function () {
    signOut();
});

// Connection a la database 'firebase'
var db = firebase.firestore();

// Quand on click sur le bouton cahnger d'avatar
$('#editURL').click(function () {
    let newUrl = $('#newImg').val();
    // si l'input n'est pas vide
    if (newUrl !== '') {
        firebase.auth().currentUser.updateProfile({
            photoURL: newUrl
        }).then(function() { // Quand ca ce passe bien
            // on met a jour dans database/user
            db.collection("user").doc(firebase.auth().currentUser.uid).collection("userInfo").doc('userInfo').set({
                pseudo:localStorage.getItem('displayName'),
                photoURL:newUrl
            });

            localStorage.setItem('photoURL',newUrl);

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
    } else { // si l'input est vide
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
            // Update reussi.
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
            let lastphotoURL = localStorage.getItem('photoURL');
            db.collection("user").doc(firebase.auth().currentUser.uid).collection("userInfo").doc('userInfo').set({
                pseudo:newPseudo,
                photoURL:lastphotoURL
            });

            localStorage.setItem('displayName',newPseudo);

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
            // Update reussi.
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
                // Update reussi.
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
    // on supprimer les varibles du localstorage
    localStorage.clear('user');
    localStorage.clear('photoURL');
    localStorage.clear('displayName');
    localStorage.clear('myCollab');

    firebase.auth().signOut().then(function() {
        // Sign-out reussi.
        document.location.reload();
    });
}

// on récupère la liste des utilisateus
db.collection("user").get().then((querySnapshot) => {
    let userIdList = [];

    // On recupère chaque ID d'utilisateur
    querySnapshot.forEach((doc) => {
        userIdList.push(doc.id)
    });

    // Sur chaque ID d'utilisateur
    userIdList.forEach(idUser => {
        let inMyuCollab;
        // Si on a la variable dans le localstorage
        if (localStorage.getItem('myCollab') !== null){
            // Si l'iduser est dans la variable
            if (localStorage.getItem('myCollab').includes(idUser)){
                inMyuCollab = 0;
            } else {
                inMyuCollab = 1;
            }

        } else {
            inMyuCollab = 1;
        }
        // Si ce n'est pas l'utilisateur connecté et que si il n'est pas dans le localstorage
        if (idUser !== localStorage.getItem('user') && inMyuCollab === 1) {
            // On récupère les données
            db.collection("user").doc(idUser).collection('userInfo').doc('userInfo').get().then((querySnapshot) => {
                let photoURL = querySnapshot.data().photoURL;
                let pseudo = querySnapshot.data().pseudo;

                // On définie l'element html
                let cardUser = '<div id="'+idUser+'" class="user my-1 col-md-12 border border-danger row p-0 m-0 bg-light" style="z-index: 1;">' +
                    '<div class="col-2 ml-3 p-0 pt-1">' +
                    '<img id=\'imgNavbar\' src="'+photoURL+'" style="max-width: 2em;" class="rounded-circle mr-2" alt="">' +
                    '</div>' +
                    '<div class="col-9">' +
                    '<p class="text-primary mb-2 pt-2">'+pseudo+'</p>' +
                    '</div>' +
                    '</div>';

                // on injecte l'element html a la liste des utilisateurs
                $("#listUser").append(cardUser);
                // rendre draggable l'element ajouté
                $( ".user" ).draggable({ revert: true });
            });
        } else { // si il est dans le localstorage
            // Si l'iduser est different que celle connecté
            if (idUser !== localStorage.getItem('user')){
                // On va chercher les infos de l'iduser
                db.collection("user").doc(idUser).collection('userInfo').doc('userInfo').get().then((querySnapshot) => {
                    let photoURL = querySnapshot.data().photoURL;
                    let pseudo = querySnapshot.data().pseudo;

                    // On définie l'element html
                    let cardUser = '<div id="'+idUser+'" class="my-1 col-md-12 border border-danger row p-0 m-0 bg-light" style="z-index: 1;">' +
                        '<div class="col-2 ml-3 p-0 pt-1">' +
                        '<img id=\'imgNavbar\' src="'+photoURL+'" style="max-width: 2em;" class="rounded-circle mr-2" alt="">' +
                        '</div>' +
                        '<div class="col-9">' +
                        '<p class="text-primary mb-2 pt-2">'+pseudo+'<i class="removeColabo text-danger fa mt-1 float-right fa-trash-o" aria-hidden="true"></i></p>' +
                        '</div>' +
                        '</div>';

                    // on injecte l'element html a la liste des utilisateurs
                    $("#myColab").append(cardUser);
                    // function pour supprimer un collaborateur
                    $('.removeColabo').click(function () {
                        // on recup l'id de l'utilisateur
                        let idDelete = $(this).parent().parent().parent()[0].id;
                        let uid = localStorage.getItem('user');

                        // on recup nos donnée
                        db.collection("user").doc(uid).collection('userInfo').doc('userInfo').get().then((querySnapshot) => {
                            let arrayCollab = querySnapshot.data().myCollab;

                            // si on a le champ myCollab
                            if (arrayCollab !== undefined) {
                                for (let i = 0;i<arrayCollab.length;i++){
                                    if (arrayCollab[i] === idDelete){
                                        // on supprime l'id de notre tableau
                                        arrayCollab.splice(i,1);
                                    }
                                }

                                // si le tableau a aucune données
                                if (arrayCollab.length > 0){
                                    localStorage.setItem('myCollab',arrayCollab);
                                } else {
                                    localStorage.removeItem('myCollab');
                                }

                                // on met a jours les données en database
                                db.collection("user").doc(firebase.auth().currentUser.uid).collection("userInfo").doc('userInfo').update({
                                    myCollab:arrayCollab
                                }).then(function () {
                                    // on recupere la div
                                    let newCard = $('#'+idDelete);

                                    // on efface la div
                                    $('#'+idDelete).remove();

                                    // on injecte la nouvelle
                                    $('#listUser').append(newCard);

                                    // on ajoute la class user
                                    $('#'+idDelete).addClass('user');

                                    // on effacer la poubelle de la div
                                    $('#'+idDelete).find('i').remove();

                                    // on rend draggable la class user
                                    $( ".user" ).draggable({ revert: true });

                                    // Notfication
                                    $('#alertNotif').addClass('alert-success')
                                        .html('<i class="fa fa-thumbs-up fa-2x" aria-hidden="true"></i> Collaborateur supprimé.')
                                        .slideToggle();

                                    // après 3s (3000ms)
                                    setTimeout(function () {
                                        $('#alertNotif').removeClass('alert-success')
                                            .html('')
                                            .fadeOut();
                                    },3000);
                                });
                            }
                        });
                    });
                });
            }
        }
    });
});

// rendre myColab droppable
$( "#myColab" ).droppable({
    classes: {
        "ui-droppable-hover": "bg-success"
    },
    drop: function( event, ui ) {
        // on recupere l'id de l'element 'dropé' qui correspond a l'id du user
        let idNewCollab= ui.draggable.prop('id');
        console.log(idNewCollab);

        let newCard = $('#'+idNewCollab);
        $('#'+idNewCollab).remove();

        $('#myColab').append(newCard);
        $('#'+idNewCollab).removeClass('user');
        $('#'+idNewCollab).find('p').append('<i class="removeColabo text-danger fa mt-1 float-right fa-trash-o" aria-hidden="true"></i>');
        // on initialise event pour la suppression
        $('.removeColabo').click(function () {
            // on recup l'id de l'utilisateur
            let idDelete = $(this).parent().parent().parent()[0].id;
            let uid = localStorage.getItem('user');

            // on recup nos donnée
            db.collection("user").doc(uid).collection('userInfo').doc('userInfo').get().then((querySnapshot) => {
                let arrayCollab = querySnapshot.data().myCollab;

                // si on a le champ myCollab
                if (arrayCollab !== undefined) {
                    for (let i = 0;i<arrayCollab.length;i++){
                        if (arrayCollab[i] === idDelete){
                            // on supprime l'id de notre tableau
                            arrayCollab.splice(i,1);
                        }
                    }

                    // si le tableau a aucune données
                    if (arrayCollab.length > 0){
                        localStorage.setItem('myCollab',arrayCollab);
                    } else {
                        localStorage.removeItem('myCollab');
                    }

                    // on met a jours les données en database
                    db.collection("user").doc(firebase.auth().currentUser.uid).collection("userInfo").doc('userInfo').update({
                        myCollab:arrayCollab
                    }).then(function () {
                        // on recupere la div
                        let newCard = $('#'+idDelete);

                        // on efface la div
                        $('#'+idDelete).remove();

                        // on injecte la nouvelle
                        $('#listUser').append(newCard);

                        // on ajoute la class user
                        $('#'+idDelete).addClass('user');

                        // on effacer la poubelle de la div
                        $('#'+idDelete).find('i').remove();

                        // on rend draggable la class user
                        $( ".user" ).draggable({ revert: true });

                        // Notfication
                        $('#alertNotif').addClass('alert-success')
                            .html('<i class="fa fa-thumbs-up fa-2x" aria-hidden="true"></i> Collaborateur supprimé.')
                            .slideToggle();

                        // après 3s (3000ms)
                        setTimeout(function () {
                            $('#alertNotif').removeClass('alert-success')
                                .html('')
                                .fadeOut();
                        },3000);
                    });
                }
            });
        });

        // liste des collab
        let collabList = [];

        // on ajoute l'id du nouveau collaborateur
        collabList.push(idNewCollab);

        // Si la variable est renseigné dans le localStorage
        if (localStorage.getItem('myCollab') !== null){
            collabList.push(localStorage.getItem('myCollab'));
        }

        // On ajoute en database
        db.collection("user").doc(firebase.auth().currentUser.uid).collection("userInfo").doc('userInfo').set({
            pseudo:localStorage.getItem('displayName'),
            photoURL:localStorage.getItem('photoURL'),
            myCollab:collabList
        });

        // On ajoute/update dans le localstorage
        localStorage.setItem('myCollab',collabList);

        // Notfication
        $('#alertNotif').addClass('alert-success')
            .html('<i class="fa fa-thumbs-up fa-2x" aria-hidden="true"></i> Collaborateur ajouté.')
            .slideToggle();

        // après 3s (3000ms)
        setTimeout(function () {
            $('#alertNotif').removeClass('alert-success')
                .html('')
                .fadeOut();
        },3000);
    }
});