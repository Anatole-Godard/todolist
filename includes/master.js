// Quand on click sur le bouton mon compte
$("#account").click(function () {
    // On charge la page profile.html dans la div contenu
    $("#mainContent").load('includes/profile.html', function () {
        // on injecte les variables de pseudo, mail, si mail verifié et l'url de l'avatar
        $('#profilePseudo').html("Pseudo actuel : <span class='float-right h2'>"+firebase.auth().currentUser.displayName+"</span>");
        $('#profileEmail').html("Email actuel : <span class='float-right h2'>"+firebase.auth().currentUser.email+"</span>");
        if (firebase.auth().currentUser.emailVerified === false) {
            $('#profileEmailVerified').html("<span class='float-right text-warning'>Adresse mail non vérifiée.</span>");
        } else {
            $('#profileEmailVerified').html("<span class='float-right text-success'>Adresse mail vérifiée.</span>");
        }
        $('#imgProfile').attr('src',firebase.auth().currentUser.photoURL);

        // On ajoute le button de deconnection
        $('#Deco').append("<i class=\"fa fa-sign-out\" aria-hidden=\"true\"></i> Déconnection");
    });
});

// Quand on click sur le lien Accueil de la navBar
$('.home').click(function () {
    // On charge la page maintask dans la div contenu
    $("#mainContent").load('includes/mainTask.html',function () {
        let name = localStorage.getItem('displayName');
        // on injecte le titre de la page
        $('#mainSubTitle').html('Taches de '+name);
    });
});

// Quand on click sur le lien Accueil de la navBar
$('.weekly').click(function () {
    // On charge la page maintask dans la div contenu
    $("#mainContent").load('includes/calendar.html');
});


// Quand on click sur le lien Tâches archivées de la navBar
$('.archive').click(function () {
    // On charge la page archivedTask dans la div contenu
    $("#mainContent").load('includes/archivedTask.html',function () {
        let name = localStorage.getItem('displayName');
        // on injecte le titre de la page
        $('#mainSubTitle').html('Taches Archivées de '+name);
    });
});