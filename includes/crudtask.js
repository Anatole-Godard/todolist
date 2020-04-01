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

   // $("#read").click(function() {
        var card ;
        var cardbody ;
        var cardfooter =
        '<div class="card-footer">' +
             '<div class="row">' +
                '<div class="mx-auto">' +
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

        //LECTURE ET AFFICHAGE TACHES A FAIRE
        // récupère les valeurs données par l'utilisateur lors de la création de la tâche
        db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "à faire").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //  Affichage des données
            cardbody = '<div id="cardTID_'+doc.id+'" class="mx-auto taskBlock card text-white bg-danger mb-3" style="max-width: 20rem;">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+doc.data().name +'</h4>' +
                '<p class="card-text">'+doc.data().description+'</p>' +
                '<p class="card-text float-right"><small>'+doc.data().date+'</small></p>' +
                '</div>';

            card = cardbody+cardfooter ;
                console.log(card);
                $("#aFaire").append(card) ;
                $("#cardTID_"+doc.id).draggable();
            });
            $( ".taskBlock" ).draggable({ revert: true });
        });

        //LECTURE ET AFFICHAGE des taches en cours
    // récupère les valeurs données par l'utilisateur lors de la création de la tâche
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "en cours").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //  Affichage des données
            cardbody = '<div id="cardTID_'+doc.id+'" class="mx-auto taskBlock card text-white bg-danger mb-3" style="max-width: 20rem;">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+doc.data().name +'</h4>' +
                '<p class="card-text">'+doc.data().description+'</p>' +
                '<p class="card-text float-right"><small>'+doc.data().date+'</small></p>' +
                '</div>';

            card = cardbody+cardfooter ;
            console.log(card);
            $("#enCour").append(card);
        });
        $( ".taskBlock" ).draggable({ revert: true });
    });
    //LECTURE ET AFFICHAGE des taches terminées
    // récupère les valeurs données par l'utilisateur lors de la création de la tâche
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "terminé").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //  Affichage des données
            cardbody = '<div id="cardTID_'+doc.id+'" class="mx-auto taskBlock card text-white bg-danger mb-3" style="max-width: 20rem;">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+doc.data().name +'</h4>' +
                '<p class="card-text">'+doc.data().description+'</p>' +
                '<p class="card-text float-right"><small>'+doc.data().date+'</small></p>' +
                '</div>';

            card = cardbody+cardfooter ;
            console.log(card);
            $("#terminer").append(card);
        });
        $( ".taskBlock" ).draggable({ revert: true });
    });



    ;
    $("#update").click(function() {
        db.collection("user").doc(idUser).collection('tasks').get().orderBy("ID").then((querySnapshot) => {
            querySnapshot.forEach((doc) => {



                // console.log(`${doc.id} => ${doc.data().category}`);
            });
        });
    });
});