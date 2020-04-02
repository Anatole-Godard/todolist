var idUser = localStorage.getItem('user');

var db = firebase.firestore();

readTaskCreateCard("archivé", "#archiver", db, idUser);

//SUPPRIMER UNE TACHE
$("#modalDelete").on('show.bs.modal', function (data) {
    let db = firebase.firestore();
    let cardtid = data.relatedTarget.id;
    console.log("Modal : "+cardtid) ;

    $("#btnDelete").on('click', function (data) {

        console.log(cardtid) ;
        deletetask(cardtid) ;
        $("#modalDelete").attr('class', 'modal fade').attr('style', 'display: none;').attr('aria-hidden', 'true');
        $("body").attr('class', '');
        $(".modal-backdrop").remove();

    });

});