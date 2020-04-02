//readTaskCreateCard(Type_de_tache[String], ID_de_div[String],db[Object],idUser[String])
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
    let addclass = taskdiv.substr(1,taskdiv.length-1);
    let card;
    let cardbody;
    let mouseover = 'onmouseover="this.style.color = \'black\';this.style.cursor = \'pointer\'" onmouseout="this.style.color = \'white\'"';
    let classdiv = 'class="mx-auto taskBlock card text-white bg-danger mb-3 '+addclass+'"';
    let iconecorbeille = 'fa fa-trash-o' ;
    let modaltype = "#modalDelete" ;
    if(tasktype==="archivé") {

        iconecorbeille = 'fa fa-arrow-circle-up';
        modaltype = "#modalUnarchive" ;
        }
    // $(taskdiv).empty();
    db.collection("user").doc(idUser).collection('tasks').where("statement", "==", tasktype).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //  construction du corps de la carte
            cardbody = '<div id="cardTID_' + doc.id + '" ' + classdiv + ' style="max-width: 20rem;">' +
                '<div class="card-body" id="' + doc.id + '" data-toggle="modal" data-target="#modalUpdate">' +
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
                '<div ' + mouseover + ' id="' + doc.id + '" data-toggle="modal" data-target="'+modaltype+'" class="mx-auto">' +
                '<i class="'+iconecorbeille+'" aria-hidden="true"></i>' +
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
        //Permet de rendre la carte draggable
        if(tasktype!=="archivé") {$(".taskBlock").draggable({revert: true});}

    });
    return true;
}

//DELETE
function updateTaskStatus(taskid, taskstatus) {
    let tid = String(taskid);
    taskstatus = String(taskstatus);
    // on récupère l'id de l'utilisateur qui se trouve en cache 'localStorage'
    let idUser = localStorage.getItem('user');
    let db = firebase.firestore();
    //changement du statement en base + supprime de l'affichage
    db.collection("user").doc(idUser).collection('tasks').doc(tid).update({statement: taskstatus})
        .then(function () {
            $("#cardTID_" + taskid).remove();
        })
        .catch(function (error) {
            //log les erreurs dans la console
            console.error("Error when deleting task: ", error);
        });
}


