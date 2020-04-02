//Document Ready !! C'est parti !

$(document).ready(function () {
    // on récupère l'id de l'utilisateur qui se trouve en cache 'localStorage'
    var idUser = localStorage.getItem('user');

    var db = firebase.firestore();
    readTaskCreateCard("à faire", "#aFaire", db, idUser);
    readTaskCreateCard("en cours", "#enCour", db, idUser);
    readTaskCreateCard("terminé", "#terminer", db, idUser);
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


$( "#aFaire" ).droppable({
    accept: ".terminer, .enCour",
    classes: {
        "ui-droppable-hover": "bg-success"
    },
    drop: function( event, ui ) {
        let statut = 'à faire';
        let classStatut;
        let classNewStatut = 'aFaire';
        let idUser = firebase.auth().currentUser.uid;

        // on recupere l'id de la tache
        let taskid= ui.draggable.prop('id').substr(8,ui.draggable.prop('id').length);

        // on recupere les class
        let classTask= ui.draggable.prop('class');
        // on hide la div
        $("#cardTID_" + taskid).hide();

        // si classTask a dans la liste des class aFaire
        if (classTask.search("terminer") !== -1) {
            // on determine le statut d
            classStatut = 'terminer';
        } else {
            classStatut = 'enCour';
        }

        let db = firebase.firestore();
        //changement du statement en base + supprime de l'affichage
        db.collection("user").doc(idUser).collection('tasks').doc(taskid).update({statement: statut})
            .then(function () {
                // on copie l'element
                let copyElement = $("#cardTID_" + taskid);
                // on supprime l'element
                $("#cardTID_" + taskid).remove();
                // on ajoute la copie dans la nouvelle colonne de statut
                $( "#"+classNewStatut ).append(copyElement);
                // on retire l'ancienne class de statut et ajoute la nouvelle
                $("#cardTID_" + taskid).removeClass(classStatut).addClass(classNewStatut);
                $("#cardTID_" + taskid +" .statement").html(statut);
                // on show la div
                $("#cardTID_" + taskid).show();
                // on bout de 1s(1000ms)
                setTimeout(function () {
                    // on rend draggable l'ajout dans la colonne
                    $(".taskBlock").draggable({revert: true});
                },500);
            })
            .catch(function (error) {
                //log les erreurs dans la console
                console.error("Error when updating task: ", error);
            });
    }
});

$( "#enCour" ).droppable({
    accept: ".aFaire, .terminer",
    classes: {
        "ui-droppable-hover": "bg-success"
    },
    drop: function( event, ui ) {
        let statut = 'en cours';
        let classStatut;
        let classNewStatut = 'enCour';
        let idUser = firebase.auth().currentUser.uid;

        // on recupere l'id de la tache
        let taskid= ui.draggable.prop('id').substr(8,ui.draggable.prop('id').length);
        // on hide la div
        $("#cardTID_" + taskid).hide();

        // on recupere les class
        let classTask= ui.draggable.prop('class');

        // si classTask a dans la liste des class aFaire
        if (classTask.search("aFaire") !== -1) {
            // on determine le statut d
            classStatut = 'aFaire';
        } else {
            classStatut = 'terminer';
        }

        let db = firebase.firestore();
        //changement du statement en base + supprime de l'affichage
        db.collection("user").doc(idUser).collection('tasks').doc(taskid).update({statement: statut})
            .then(function () {
                // on copie l'element
                let copyElement = $("#cardTID_" + taskid);
                // on supprime l'element
                $("#cardTID_" + taskid).remove();
                // on ajoute la copie dans la nouvelle colonne de statut
                $( "#"+classNewStatut ).append(copyElement);
                // on retire l'ancienne class de statut et ajoute la nouvelle
                $("#cardTID_" + taskid).removeClass(classStatut).addClass(classNewStatut);
                $("#cardTID_" + taskid +" .statement").html(statut);
                // on show la div
                $("#cardTID_" + taskid).show();
                // on bout de 1s(1000ms)
                setTimeout(function () {
                    // on rend draggable l'ajout dans la colonne
                    $(".taskBlock").draggable({revert: true});
                },500);
            })
            .catch(function (error) {
                //log les erreurs dans la console
                console.error("Error when updating task: ", error);
            });
    }
});

$( "#terminer" ).droppable({
    accept: ".aFaire, .enCour",
    classes: {
        "ui-droppable-hover": "bg-success"
    },
    drop: function( event, ui ) {
        // on récupère l'id de l'utilisateur qui se trouve en cache 'localStorage'

        let statut = 'terminé';
        let classStatut;
        let classNewStatut = 'terminer';
        let idUser = firebase.auth().currentUser.uid;

       // on recupere l'id de la tache
        let taskid= ui.draggable.prop('id').substr(8,ui.draggable.prop('id').length);
        // on hide la div
        $("#cardTID_" + taskid).hide();

        // on recupere les class
        let classTask= ui.draggable.prop('class');

        // si classTask a dans la liste des class aFaire
        if (classTask.search("aFaire") !== -1) {
            // on determine le statut d
            classStatut = 'aFaire';
        } else {
            classStatut = 'enCour';
        }

        let db = firebase.firestore();
        //changement du statement en base + supprime de l'affichage
        db.collection("user").doc(idUser).collection('tasks').doc(taskid).update({statement: statut})
            .then(function () {
                // on copie l'element
                let copyElement = $("#cardTID_" + taskid);
                // on supprime l'element
                $("#cardTID_" + taskid).remove();
                // on ajoute la copie dans la nouvelle colonne de statut
                $( "#"+classNewStatut ).append(copyElement);
                // on retire l'ancienne class de statut et ajoute la nouvelle
                $("#cardTID_" + taskid).removeClass(classStatut).addClass(classNewStatut);
                $("#cardTID_" + taskid +" .statement").html(statut);
                // on show la div
                $("#cardTID_" + taskid).show();
                // on bout de 1s(1000ms)
                setTimeout(function () {
                    // on rend draggable l'ajout dans la colonne
                    $(".taskBlock").draggable({revert: true});
                },500);
            })
            .catch(function (error) {
                //log les erreurs dans la console
                console.error("Error when updating task: ", error);
            });
    }
});