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
    $("#read").click(function() {

        db.collection("user").doc(idUser).collection('tasks').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //   var taskDateReminder = doc.data().datereminder ;
                var ligne = '<tr>' +
                    '<td>'+doc.id+'</td>' +
                    '<td>'+doc.data().name +'</td>' +
                    '<td>'+doc.data().category+'</td>' +
                    '<td>'+doc.data().date+'</td>' +
                    '<td>'+doc.data().datereminder+'</td>' +
                    '<td>'+doc.data().description+'</td>' +
                    '<td><button class="btn btn-default bg-danger rounded text-light" id="btnUpdate">Modifier</button></td>' +
                    '<td><button class="btn btn-default bg-danger rounded text-light" id="delete">Supprimer</button></td>' +
                    '</tr>' ;
                $('#myTableTaskToDo > tbody:last-child').append(ligne);
                // console.log(`${doc.id} => ${doc.data().category}`);
            });
        });
    });



    ;
    $("#update").click(function() {
        db.collection("user").doc(idUser).collection('tasks').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                var taskID = doc.id;
                var taskName = doc.data().name ;
                var taskCategory = doc.data().category;
                var taskDateEcheance = doc.data().date;
                //   var taskDateReminder = doc.data().datereminder ;
                var taskDescription = doc.data().description ;
                var ligne = '<tr>' +
                    '<td>'+taskID+'</td>' +
                    '<td>'+taskName+'</td>' +
                    '<td>'+taskCategory+'</td>' +
                    '<td>'+taskDateEcheance+'</td>' +
                    '<td>'+doc.data().datereminder+'</td>' +
                    '<td>'+taskDescription+'</td>' +
                    '<td><button class="btn btn-default bg-danger rounded text-light" id="update" >Modifier</button></td>' +
                    '<td><button class="btn btn-default bg-danger rounded text-light" id="delete" >Supprimer</button></td>' +
                    '</tr>' ;
                $('#myTableTaskToDo > tbody:last-child').append(ligne);
                // console.log(`${doc.id} => ${doc.data().category}`);
            });
        });
    });
});