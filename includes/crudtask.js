//Document Ready !! C'est parti !
var collabOnTask = [];

function addTaskCollab(idTask, idUser, collabList, idCollabAdd) {
    console.log(idTask);
    console.log(idUser);
    console.log(collabList);
    console.log(idCollabAdd);
    var db = firebase.firestore();
    db.collection("user").doc(idUser).collection('tasks').doc(idTask).get().then((querySnapshot) => {
        let name = querySnapshot.data().name;
        let description = querySnapshot.data().description;
        let statement = querySnapshot.data().statement;
        let datereminder = querySnapshot.data().datereminder;
        let category = querySnapshot.data().category;
        let creationdate = querySnapshot.data().creationdate;
        let date = querySnapshot.data().date;
        let collabOnTask = querySnapshot.data().collabOnTask;

        if (collabOnTask !== undefined) {
            if (collabOnTask.length === 0){
                collabOnTask=[];
            }
        } else {
            collabOnTask=[];
        }
        collabOnTask.push(idCollabAdd);
        db.collection("user").doc(idUser).collection('tasks').doc(idTask).update({
            collabOnTask:collabOnTask
        });

        db.collection("user").doc(idCollabAdd).get().then((querySnapshot) => {
            let lastTask = querySnapshot.data().nbTask+1;
            setTaskCollab(idCollabAdd, lastTask, name, description, date, datereminder, category, creationdate, statement, collabList);
            db.collection("user").doc(idCollabAdd).set({
                nbTask: lastTask
            });
            console.log('crée !');
        });
    });
}

function removeTaskCollab(idTask, idUser, idCollabRemove) {
    console.log(idTask);
    console.log(idUser);
    console.log(idCollabRemove);
    var db = firebase.firestore();
    db.collection("user").doc(idUser).collection('tasks').doc(idTask).get().then((querySnapshot) => {
        let creationdate = querySnapshot.data().creationdate;
        let collabOnTask = querySnapshot.data().collabOnTask;
        let taskstatus = 'supprimé';

        for (let i = 0;i<collabOnTask.length;i++){
            if (collabOnTask[i] === idCollabRemove){
                // on supprime l'id de notre tableau
                collabOnTask.splice(i,1);
            }
        }
        db.collection("user").doc(idUser).collection('tasks').doc(idTask).update({
            collabOnTask:collabOnTask
        });

        db.collection("user").doc(idCollabRemove).collection('tasks').where("creationdate", "==", creationdate).get().then(response => {
                console.log(response);
                response.docs.forEach((doc) => {
                    db.collection("user").doc(idCollabRemove).collection('tasks').doc(doc.id).update({
                            statement: taskstatus
                    }).then(function () {
                        console.log('supprimé');
                    })
                });
        });
    });
}

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
            $.when(setTask(idUser, lastTask, nameTask, descriptiontask, datetask, dateremindertask, categorytask, now, 'à faire', collabOnTask))
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
        // on initialise la variable
        collabOnTask = [];
        let cardtid = data.relatedTarget.id;

        $('#listCollab').html('<div class="spinner-border text-danger" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>' +
            '<p class="text-light">Chargement...</p>');
        let uid = localStorage.getItem('user');
        db.collection("user").doc(uid).collection('userInfo').doc('userInfo').get().then((querySnapshot) => {
            let arrayCollab = querySnapshot.data().myCollab;
            if (arrayCollab !== undefined) {
                if (arrayCollab.length > 0) {
                    let listCollab = [];

                    for (let i = 0;i<arrayCollab.length;i++){
                        listCollab.push(arrayCollab[i]);
                    }
                    $("#listCollab").html('');
                    listCollab.forEach(idUser => {
                        db.collection("user").doc(idUser).collection('userInfo').doc('userInfo').get().then((querySnapshot) => {
                            let photoURL = querySnapshot.data().photoURL;
                            let pseudo = querySnapshot.data().pseudo;

                            db.collection("user").doc(uid).collection('tasks').doc(cardtid).get().then((querySnapshot) => {
                                let taskCollab = querySnapshot.data().collabOnTask;
                                if (taskCollab !== undefined) {
                                    if (taskCollab.length === 0) {
                                        // On définie l'element html
                                        var cardUser = '<div id="'+idUser+'" class="userCollab my-1 col-md-6 border border-danger row p-0 m-0 bg-light" style="z-index: 1;">' +
                                            '<div class="col-2 ml-3 p-0 pt-1">' +
                                            '<img id=\'imgNavbar\' src="'+photoURL+'" style="max-width: 2em;" class="rounded-circle mr-2" alt="">' +
                                            '</div>' +
                                            '<div class="col-9">' +
                                            '<p class="text-primary mb-2 pt-2">'+pseudo+'</p>' +
                                            '</div>' +
                                            '</div>';
                                    } else {
                                        let indic = 0;
                                        for (let i = 0;i<taskCollab.length;i++){
                                            if (taskCollab[i] === idUser){
                                                indic =1;
                                                // On définie l'element html
                                                var cardUser = '<div id="'+idUser+'" class="userCollab my-1 col-md-6 border border-danger row p-0 m-0 bg-success" style="z-index: 1;">' +
                                                    '<div class="col-2 ml-3 p-0 pt-1">' +
                                                    '<img id=\'imgNavbar\' src="'+photoURL+'" style="max-width: 2em;" class="rounded-circle mr-2" alt="">' +
                                                    '</div>' +
                                                    '<div class="col-9">' +
                                                    '<p class="text-light mb-2 pt-2">'+pseudo+'</p>' +
                                                    '</div>' +
                                                    '</div>';
                                                collabOnTask.push(idUser);
                                            }
                                        }
                                        if(indic === 0) {
                                            // On définie l'element html
                                            var cardUser = '<div id="'+idUser+'" class="userCollab my-1 col-md-6 border border-danger row p-0 m-0 bg-light" style="z-index: 1;">' +
                                                '<div class="col-2 ml-3 p-0 pt-1">' +
                                                '<img id=\'imgNavbar\' src="'+photoURL+'" style="max-width: 2em;" class="rounded-circle mr-2" alt="">' +
                                                '</div>' +
                                                '<div class="col-9">' +
                                                '<p class="text-primary mb-2 pt-2">'+pseudo+'</p>' +
                                                '</div>' +
                                                '</div>';
                                        }
                                    }
                                } else {
                                    // On définie l'element html
                                    var cardUser = '<div id="'+idUser+'" class="userCollab my-1 col-md-6 border border-danger row p-0 m-0 bg-light" style="z-index: 1;">' +
                                        '<div class="col-2 ml-3 p-0 pt-1">' +
                                        '<img id=\'imgNavbar\' src="'+photoURL+'" style="max-width: 2em;" class="rounded-circle mr-2" alt="">' +
                                        '</div>' +
                                        '<div class="col-9">' +
                                        '<p class="text-primary mb-2 pt-2">'+pseudo+'</p>' +
                                        '</div>' +
                                        '</div>';

                                }
                                // on injecte l'element html a la liste des utilisateurs
                                $("#listCollab").append(cardUser);
                                $('#'+idUser).click(function () {
                                    console.log($(this)[0].id);
                                    $(this).toggleClass('bg-light').toggleClass('bg-success').find('p').toggleClass('text-primary').toggleClass('text-light');
                                    let idCollab = $(this)[0].id;
                                    if (collabOnTask.length > 0) {
                                        let collabInArray = 0;
                                        for (let i = 0;i<collabOnTask.length;i++){
                                            if (collabOnTask[i] === idCollab){
                                                collabInArray = 1;
                                                // on supprime l'id de notre tableau
                                                collabOnTask.splice(i,1);

                                            }
                                        }
                                        if (collabInArray === 0){
                                            collabOnTask.push(idCollab);

                                            let collabList = [];
                                            collabOnTask.forEach(id => {
                                                if (id !== idUser || id !== idUser){
                                                    collabList.push(id);
                                                }
                                            });
                                            collabList.push(idUser);
                                            addTaskCollab(cardtid, uid, collabList, idCollab);
                                        } else {
                                            removeTaskCollab(cardtid, uid, idCollab);
                                        }
                                    } else {
                                        collabOnTask.push(idCollab);

                                        let collabList = [];
                                        collabOnTask.forEach(id => {
                                            if (id !== idUser || id !== idUser){
                                                collabList.push(id);
                                            }
                                        });
                                        collabList.push(idUser);
                                        addTaskCollab(cardtid, uid, collabList, idCollab);
                                    }
                                });
                            });
                        });
                    })
                } else {
                    $("#listCollab").html('<p class="text-light">Vous n\'avez aucun collaborateurs, veuillez les renseigner dans votre profil.</p>');
                }
            }
        });


        var idUser = localStorage.getItem('user');

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

            setTask(idUser, cardtid, newtitle, newdescription, newdate, newdatereminder, newcategory, creationdate, newstatement, collabOnTask);
        })

    });

});
function setTaskCollab(idUser, idTask, nameTask, descriptiontask, datetask, dateremindertask, categorytask, now, statement, collabOnTask) {
    console.log(collabOnTask);
    let db = firebase.firestore();

    //créer notre nouvelle tâche avec les valeurs données
    db.collection("user").doc(idUser).collection('tasks').doc(idTask.toString()).set({
        name: nameTask,
        description: descriptiontask,
        date: datetask,
        datereminder: dateremindertask,
        category: categorytask,
        creationdate: now,
        statement: statement,
        collabOnTask: collabOnTask
    })
        .catch(function (error) {
            //log les erreurs dans la console
            console.error("Error adding document: ", error);
        });
}

// Créer ou mettre à jour une tâche
function setTask(idUser, idTask, nameTask, descriptiontask, datetask, dateremindertask, categorytask, now, statement, collabOnTask) {
    console.log(collabOnTask);
    let db = firebase.firestore();

    //créer notre nouvelle tâche avec les valeurs données
    db.collection("user").doc(idUser).collection('tasks').doc(idTask.toString()).set({
        name: nameTask,
        description: descriptiontask,
        date: datetask,
        datereminder: dateremindertask,
        category: categorytask,
        creationdate: now,
        statement: statement,
        collabOnTask: collabOnTask
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
        updateTaskStatus(cardtid, "supprimé") ;
        $("#modalDelete").attr('class', 'modal fade').attr('style', 'display: none;').attr('aria-hidden', 'true');
        $("body").attr('class', '');
        $(".modal-backdrop").remove();

    });

});

$( "#toolbar" ).droppable({
    accept: ".terminer, .enCour, .aFaire",
    hoverClass: "translate_toolbar",
    classes: {
        "ui-droppable-hover": "bg-success"
    },
    drop: function( event, ui ) {
        let statut = 'archivé';
        let idUser = firebase.auth().currentUser.uid;

        // on recupere l'id de la tache
        let taskid= ui.draggable.prop('id').substr(8,ui.draggable.prop('id').length);

        // on hide la div
        $("#cardTID_" + taskid).fadeOut();

        let db = firebase.firestore();
        //changement du statement en base + supprime de l'affichage
        db.collection("user").doc(idUser).collection('tasks').doc(taskid).update({statement: statut})
            .then(function () {
                // on supprime l'element
                $("#cardTID_" + taskid).remove();
            })
            .catch(function (error) {
                //log les erreurs dans la console
                console.error("Error when updating task: ", error);
            });
    }
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
                    $(".taskBlock").draggable({revert: true,scroll: false});
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
                    $(".taskBlock").draggable({revert: true,scroll: false});
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
                    $(".taskBlock").draggable({revert: true,scroll: false});
                },500);
            })
            .catch(function (error) {
                //log les erreurs dans la console
                console.error("Error when updating task: ", error);
            });
    }
});