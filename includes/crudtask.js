//READ

//           readTaskCreateCard(Type_de_tache[String], ID_de_div[String],db[Object],idUser[String])
//
//description :
//
//Cette fonction permet de LIRE les taches en fonction de leur type et de l'USERID depuis une BDD.
//Puis les affiches sous forme de CARTES dans la div indiquée.
//Le template des taches est défini dans cette fonction.
//
//Paramètres :
/*
1 - Type_de_tache[String], le type de tache a afficher, obligatoire, chaine de caractères.
2 - ID_de_div[String], l'ID de la div de destination, obligatoire, chaine de caractères. ' +
3 - db[Object], la BDD source. (Firebase object)
4 - idUser[String], l'ID de l'utilisateur dans la BDD
*/
function readTaskCreateCard(tasktype, taskdiv, db, idUser) {
    let card;
    let cardbody;
    let mouseover = 'onmouseover="this.style.color = \'black\';this.style.cursor = \'pointer\'" onmouseout="this.style.color = \'white\'"';
    let classdiv = 'class="mx-auto taskBlock card text-white bg-danger mb-3"';

    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", tasktype).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //  construction du corps de la carte
            cardbody = '<div id="cardTID_' + doc.id + '" ' + classdiv + ' style="max-width: 20rem;">' +
                '<div class="card-body" id="' + doc.id + '" data-toggle="modal" data-target="#modalUpdate"">' +
                '<h4 class="card-title">' + doc.data().name + '</h4>' +
                '<p class="card-text">' + doc.data().description + '</p>' +
                '<p class="card-text float-right"><small>' + doc.data().date + '</small></p>' +
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
            $(taskdiv).append(card);
        });
    });
    //Permet de rendre la carte draggable
    $(".taskBlock").draggable({revert: true});
    return true;
}

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
                creationdate: now,
                statement: 'à faire'
            })
                .then(function () {
                    //une fois créée on incrémente en base le champ qui compte le nombre de tâches créé par l'utilisateur
                    db.collection("user").doc(idUser).set({
                        nbTask: lastTask
                    }).then(function () {
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
                })
                .catch(function (error) {
                    //log les erreurs dans la console
                    console.error("Error adding document: ", error);
                });
        })
    });


    //Execution du templates pour les taches ( à faire, En cours, Terminé).
    readTaskCreateCard("à faire", "#aFaire", db, idUser);
    readTaskCreateCard("en cours", "#enCour", db, idUser);
    readTaskCreateCard("terminé", "#terminer", db, idUser);



    $("#modalUpdate").on('show.bs.modal', function (e) {
        var div = e.relatedTarget;
        var cardtid = div.id;
        console.log(cardtid);
    });

});