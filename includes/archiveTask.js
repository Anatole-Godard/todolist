var idUser = localStorage.getItem('user');

var db = firebase.firestore();

readTaskCreateCard("supprimé", "#archiver", db, idUser);

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

    });

});