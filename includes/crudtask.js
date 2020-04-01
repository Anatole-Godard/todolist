//DELETE
function deletetask(taskid) {
    var tid = String(taskid);
    // on récupère l'id de l'utilisateur qui se trouve en cache 'localStorage'
    var idUser = localStorage.getItem('user');
    var db = firebase.firestore();
    //changement du statement en base + supprime de l'affichage
    db.collection("user").doc(idUser).collection('tasks').doc(tid).update({statement: "supprimé"})
    .then(function() {
    $("#cardTID_"+taskid).remove();
    })
    .catch(function (error) {
        //log les erreurs dans la console
        console.error("Error when deleting task: ", error);
    });
}

$(document).ready(function () {
    // on récupère l'id de l'utilisateur qui se trouve en cache 'localStorage'
    var idUser = localStorage.getItem('user');

    var db = firebase.firestore();

    // ajoute un event sur le bouton pour créer une tâche
    $("#create").click(function () {
        //récupère le Id de la dernière tâche créé par l'utilisateur connécté
        db.collection("user").doc(idUser).get().then(function (doc) {
            console.log(doc.data().nbTask + 1);
            lastTask = doc.data().nbTask + 1;

            //récupère les valeurs des inputs
            let nameTask = $("#nametask").val();
            let descriptiontask = $("#descriptiontask").val();
            let datetask = $("#datetask").val();
            let dateremindertask = $("#dateremindertask").val();
            let categorytask = $("#category").val();
            let now = new Date();

            //créer notre nouvelle tâche avec les valeurs données
            db.collection("user").doc(idUser).collection('tasks').doc(lastTask.toString()).set({
                name: nameTask,
                description: descriptiontask,
                date: datetask,
                datereminder: dateremindertask,
                category: categorytask,
            })
                .then(function (docRef) {
                    //une fois créée on incrémente en base le champ qui compte le nombre de tâches créé par l'utilisateur
                    db.collection("user").doc(idUser).set({
                        nbTask: lastTask
                    }).then(function () {
                        //puis on fait disparaître le modal
                        $("#modalLoginForm").attr('class', 'modal fade').attr('style', 'display: none;').attr('aria-hidden', 'true');
                        $("body").attr('class', '');
                        $(".modal-backdrop").remove();

                    })
                        .catch(function (error) {
                            //log les erreurs dans la console
                            console.error("Error adding document: ", error);
                        });
                })
                .catch(function (error) {
                    //log les erreurs dans la console
                    console.error("Error adding document: ", error);
                });
        })
    });



//READ
        var card ;
        var cardbody ;

        //LECTURE ET AFFICHAGE TACHES A FAIRE
        // récupère les taches à faire de l'utilisateur connecté
        db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "à faire").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            //  construction du corps de la carte
            cardbody = '<div id="cardTID_'+doc.id+'" class="mx-auto taskBlock card text-white bg-danger mb-3" style="max-width: 20rem;">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+doc.data().name +'</h4>' +
                '<p class="card-text">'+doc.data().description+'</p>' +
                '<p class="card-text float-right"><small>'+doc.data().date+'</small></p>' +
                '</div>';
            //construction du pied de carte
                var cardfooter =
                    '<div class="card-footer" xmlns="http://www.w3.org/1999/html">' +
                    '<div class="row">' +
                    '<div onclick="deletetask('+doc.id+')" class="mx-auto">' +
                    '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                    '</div>' +
                    '<div class="mx-auto">' +
                    '<i class="fa fa-clock-o" aria-hidden="true"></i>' +
                    ' </div>' +
                    '<div class="mx-auto">' +
                    '<i class="fa fa-calendar-o" aria-hidden="true"></i>' +
                    '</div>' +
                    '</div>' +
                    '</div>' ;
            //Assemblage de la carte.
            card = cardbody+cardfooter ;
            //  Ajout de la carte à la Div "aFaire"
                $("#aFaire").append(card) ;
            });
            //Permet de rendre la carte draggable
            $( ".taskBlock" ).draggable({ revert: true });
        });

        //LECTURE ET AFFICHAGE des taches en cours
      // récupère les taches en cours de l'utilisateur connecté
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "en cours").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //construction du corps de la carte
            cardbody = '<div id="cardTID_'+doc.id+'" class="mx-auto taskBlock card text-white bg-danger mb-3" style="max-width: 20rem;">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+doc.data().name +'</h4>' +
                '<p class="card-text">'+doc.data().description+'</p>' +
                '<p class="card-text float-right"><small>'+doc.data().date+'</small></p>' +
                '</div>';
            //construction du pied de carte
            var cardfooter =
                '<div class="card-footer" xmlns="http://www.w3.org/1999/html">' +
                '<div class="row">' +
                '<div onclick="deletetask('+doc.id+')" class="mx-auto">' +
                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                '</div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-clock-o" aria-hidden="true"></i>' +
                ' </div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-calendar-o" aria-hidden="true"></i>' +
                '</div>' +
                '</div>' +
                '</div>' ;
            //Assemblage de la carte.
            card = cardbody+cardfooter ;
            //  Ajout de la carte à la Div "enCour"
            $("#enCour").append(card);
        });
            //Permet de rendre la carte draggable
        $( ".taskBlock" ).draggable({ revert: true });
    });

    //LECTURE ET AFFICHAGE des taches terminées
   // récupère les taches terminées de l'utilisateur connecté
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "terminé").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // construction du corps de la carte
            cardbody = '<div id="cardTID_'+doc.id+'" class="mx-auto taskBlock card text-white bg-danger mb-3" style="max-width: 20rem;">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+doc.data().name +'</h4>' +
                '<p class="card-text">'+doc.data().description+'</p>' +
                '<p class="card-text float-right"><small>'+doc.data().date+'</small></p>' +
                '</div>';
            //construction du pied de carte
            var cardfooter =
                '<div class="card-footer" xmlns="http://www.w3.org/1999/html">' +
                '<div class="row">' +
                '<div onclick="deletetask('+doc.id+')" class="mx-auto">' +
                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                '</div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-clock-o" aria-hidden="true"></i>' +
                ' </div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-calendar-o" aria-hidden="true"></i>' +
                '</div>' +
                '</div>' +
                '</div>' ;
            //Assemblage de la carte.
            card = cardbody+cardfooter ;
            //  Ajout de la carte à la Div "terminer"
            $("#terminer").append(card);
        });
            //Permet de rendre la carte draggable
        $( ".taskBlock" ).draggable({ revert: true });
    });



    $("#update").click(function() {
        db.collection("user").doc(idUser).collection('tasks').get().orderBy("ID").then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

            });
        });
    });
});