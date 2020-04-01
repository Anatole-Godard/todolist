//DELETE
function deletetask(taskid) {
    let tid = String(taskid);
    // on récupère l'id de l'utilisateur qui se trouve en cache 'localStorage'
    let idUser = localStorage.getItem('user');
    let db = firebase.firestore();
    //changement du statement en base + supprime de l'affichage
    db.collection("user").doc(idUser).collection('tasks').doc(tid).update({statement: "supprimé"})
        .then(function () {
            $("#cardTID_" + taskid).remove();
        })
        .catch(function (error) {
            //log les erreurs dans la console
            console.error("Error when deleting task: ", error);
        });
}


//Document Ready !! C'est parti !

$(document).ready(function () {
    // on récupère l'id de l'utilisateur qui se trouve en cache 'localStorage'
    var idUser = localStorage.getItem('user');

    var db = firebase.firestore();

    // ajoute un event sur le bouton pour créer une tâche
    $("#create").click(function () {
        var idUser = localStorage.getItem('user');
        //récupère le Id de la dernière tâche créé par l'utilisateur connécté
        db.collection("user").doc(idUser).get().then(function (doc) {
            console.log(doc.data().nbTask + 1);
             lastTask = doc.data().nbTask + 1;
            console.log(lastTask);

            //récupère les valeurs des inputs
            let nameTask = $("#nametask").val();
            let descriptiontask = $("#descriptiontask").val();
            let datetask = $("#datetask").val();
            let dateremindertask = $("#dateremindertask").val();
            let categorytask = $("#category").val();
            let now = new Date();

            //Créer ma nouvelle tâche
            $.when(setTask(idUser, lastTask, nameTask, descriptiontask, datetask, dateremindertask, categorytask, now, 'à faire'))
                .done(function () {
                    //une fois créée on incrémente en base le champ qui compte le nombre de tâches créé par l'utilisateur
                    db.collection("user").doc(idUser).set({
                        nbTask: lastTask
                    })
                })
                .catch(function (error) {
                    //log les erreurs dans la console
                    console.error("Error adding document: ", error);
                });

        })
    });


//READ
    let card;
    let cardbody;
    let mouseover = 'onmouseover="this.style.color = \'black\';this.style.cursor = \'pointer\'" onmouseout="this.style.color = \'white\'"';
    let classdiv = 'class="mx-auto taskBlock card text-white bg-danger mb-3"';
    //LECTURE ET AFFICHAGE TACHES A FAIRE
    // récupère les taches à faire de l'utilisateur connecté
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "à faire").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //  construction du corps de la carte
            cardbody = '<div id="cardTID_' + doc.id + '" ' + classdiv + ' style="max-width: 20rem;">' +
                '<div class="card-body" id="' + doc.id + '" data-toggle="modal" data-target="#modalUpdate"">' +
                '<h4 class="card-title name">' + doc.data().name + '</h4>' +
                '<p class="card-text description">' + doc.data().description + '</p>' +
                '<p class="card-text date float-right"><small>' + doc.data().date + '</small></p>' +
                '<p class="card-text statement d-none">' + doc.data().statement + '</p>' +
                '<p class="card-text datereminder d-none">' + doc.data().datereminder + '</p>' +
                '<p class="card-text category d-none">' + doc.data().category + '</p>' +
                '<p class="card-text creationdate d-none">' + doc.data().creationdate + '</p>' +
                '</div>';
            //construction du pied de carte
            var cardfooter =
                '<div class="card-footer" xmlns="http://www.w3.org/1999/html">' +
                '<div class="row">' +
                '<div onclick="deletetask(' + doc.id + ')" ' + mouseover + ' class="mx-auto">' +
                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                '</div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-clock-o" aria-hidden="true"></i>' +
                ' </div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-calendar-o" aria-hidden="true"></i>' +
                '</div>' +
                '</div>' +
                '</div>';
            //Assemblage de la carte.
            card = cardbody + cardfooter;
            //  Ajout de la carte à la Div "aFaire"
            $("#aFaire").append(card);
        });
        //Permet de rendre la carte draggable
        $(".taskBlock").draggable({revert: true});
    });

    //LECTURE ET AFFICHAGE des taches en cours
    // récupère les taches en cours de l'utilisateur connecté
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "en cours").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //construction du corps de la carte
            cardbody = '<div id="cardTID_' + doc.id + '" ' + classdiv + ' style="max-width: 20rem;">' +
                '<div class="card-body" id="' + doc.id + '" data-toggle="modal" data-target="#modalUpdate"">' +
                '<h4 class="card-title name">' + doc.data().name + '</h4>' +
                '<p class="card-text description">' + doc.data().description + '</p>' +
                '<p class="card-text date float-right"><small>' + doc.data().date + '</small></p>' +
                '<p class="card-text statement d-none">' + doc.data().statement + '</p>' +
                '<p class="card-text datereminder d-none">' + doc.data().datereminder + '</p>' +
                '<p class="card-text category d-none">' + doc.data().category + '</p>' +
                '<p class="card-text creationdate d-none">' + doc.data().creationdate + '</p>' +
                '</div>';
            //construction du pied de carte
            var cardfooter =
                '<div class="card-footer" xmlns="http://www.w3.org/1999/html">' +
                '<div class="row">' +
                '<div onclick="deletetask(' + doc.id + ')" ' + mouseover + ' class="mx-auto">' +
                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                '</div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-clock-o" aria-hidden="true"></i>' +
                ' </div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-calendar-o" aria-hidden="true"></i>' +
                '</div>' +
                '</div>' +
                '</div>';
            //Assemblage de la carte.
            card = cardbody + cardfooter;
            //  Ajout de la carte à la Div "enCour"
            $("#enCour").append(card);
        });
        //Permet de rendre la carte draggable
        $(".taskBlock").draggable({revert: true});
    });

    //LECTURE ET AFFICHAGE des taches terminées
    // récupère les taches terminées de l'utilisateur connecté
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", "terminé").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // construction du corps de la carte
            cardbody = '<div id="cardTID_' + doc.id + '" ' + classdiv + ' style="max-width: 20rem;">' +
                '<div class="card-body" id="' + doc.id + '" data-toggle="modal" data-target="#modalUpdate">' +
                '<h4 class="card-title name">' + doc.data().name + '</h4>' +
                '<p class="card-text description">' + doc.data().description + '</p>' +
                '<p class="card-text date float-right"><small>' + doc.data().date + '</small></p>' +
                '<p class="card-text statement d-none ">' + doc.data().statement + '</p>' +
                '<p class="card-text datereminder d-none">' + doc.data().datereminder + '</p>' +
                '<p class="card-text category d-none">' + doc.data().category + '</p>' +
                '<p class="card-text creationdate d-none">' + doc.data().creationdate + '</p>' +
                '</div>';
            //construction du pied de carte
            var cardfooter =
                '<div class="card-footer" xmlns="http://www.w3.org/1999/html">' +
                '<div class="row">' +
                '<div onclick="deletetask(' + doc.id + ')" ' + mouseover + ' class="mx-auto">' +
                '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
                '</div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-clock-o" aria-hidden="true"></i>' +
                ' </div>' +
                '<div class="mx-auto">' +
                '<i class="fa fa-calendar-o" aria-hidden="true"></i>' +
                '</div>' +
                '</div>' +
                '</div>';
            //Assemblage de la carte.
            card = cardbody + cardfooter;
            //  Ajout de la carte à la Div "terminer"
            $("#terminer").append(card);
        });
        //Permet de rendre la carte draggable
        $(".taskBlock").draggable({revert: true});
    });


    // Mise à jour d'une tache
    $("#modalUpdate").on('show.bs.modal', function (data) {
        var idUser = localStorage.getItem('user');

        let cardtid = data.relatedTarget.id;

        let title = $("#cardTID_" + cardtid + " .name").html();
        let description = $("#cardTID_" + cardtid + " .description").html();
        let date = $("#cardTID_" + cardtid + " .date small").html();
        let statement = $("#cardTID_" + cardtid + " .statement").html();
        let datereminder = $("#cardTID_" + cardtid + " .datereminder").html();
        let category = $("#cardTID_" + cardtid + " .category").html();
        let creationdate = $("#cardTID_" + cardtid + " .creationdate").html();

        $('#nameUpdate').val(title);
        $('#descriptionUpdate').html(description);
        $('#dateUpdate').val(date);

        $('#datereminderUpdate').val(datereminder);
        $('#categoryUpdate').val(category);
        $('#statementUpdate').val(statement);

        $("#Update").click(function () {

            let newtitle = $('#nameUpdate').val();
            let newdescription = $('#descriptionUpdate').html();
            let newdate = $('#dateUpdate').val();
            let newdatereminder = $('#datereminderUpdate').val();
            let newcategory = $('#categoryUpdate').val();
            let newstatement = $('#statementUpdate').val();

            setTask(idUser, cardtid, newtitle, newdescription, newdate, newdatereminder, newcategory, creationdate, newstatement);
        })

    });

});


function setTask(idUser, idTask, nameTask, descriptiontask, datetask, dateremindertask, categorytask, now, statement) {
    let db = firebase.firestore();

    //créer notre nouvelle tâche avec les valeurs données
    db.collection("user").doc(idUser).collection('tasks').doc(idTask.toString()).set({
        name: nameTask,
        description: descriptiontask,
        date: datetask,
        datereminder: dateremindertask,
        category: categorytask,
        creationdate: now,
        statement: statement
    })

        .then(function () {
            //puis on fait disparaître le modal
            $("#modalcreate").attr('class', 'modal fade').attr('style', 'display: none;').attr('aria-hidden', 'true');
            $("body").attr('class', '');
            $(".modal-backdrop").remove();

            //recharchement de la page
            $("#mainContent").load('includes/mainTask.html', function () {
                // on injecte le titre de la page
                $('#mainSubTitle').html('Taches de ' + name);
            });

        })
        .catch(function (error) {
            //log les erreurs dans la console
            console.error("Error adding document: ", error);
        });


}
