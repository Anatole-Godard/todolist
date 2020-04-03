var idUser = localStorage.getItem('user');

var db = firebase.firestore();

readTaskCreateCard("archivé", "#archiver", db, idUser);
setTimeout(function () {
    $('.taskBlock').addClass('col-md-3');
},200);
//SUPPRIMER UNE TACHE
$("#modalUnarchive").on('show.bs.modal', function (data) {
    let db = firebase.firestore();
    let cardtid = data.relatedTarget.id;
    console.log("Modal : "+cardtid) ;

    $("#btnUnarchive").on('click', function (data) {

        console.log(cardtid) ;
        updateTaskStatus(cardtid, "à faire") ;
        $("#modalUnarchive").attr('class', 'modal fade').attr('style', 'display: none;').attr('aria-hidden', 'true');
        $("body").attr('class', '');
        $(".modal-backdrop").remove();
        // On recharge la page archivedTask dans la div contenu
        $("#mainContent").load('includes/archivedTask.html',function () {
            let name = localStorage.getItem('displayName');
            // on injecte le titre de la page
            $('#mainSubTitle').html('T&acirc;ches Archiv&eacute;es de '+name);
        });
    });

});