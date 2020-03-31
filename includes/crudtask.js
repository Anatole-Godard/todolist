$(document).ready(function () {

    var idUser = localStorage.getItem('user');

    var db = firebase.firestore();

    db.collection("user").doc(idUser).get().then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.data().nbTask + 1);
        return lastTask = doc.data().nbTask + 1;
    });

    $("#create").click(function () {


        let nameTask = $("#nametask").val();
        let descriptiontask = $("#descriptiontask").val();
        let datetask = $("#datetask").val();
        let dateremindertask = $("#dateremindertask").val();
        let categorytask = $("#category").val();

        db.collection("user").doc(idUser).collection('tasks').doc(lastTask.toString()).set({
            name: nameTask,
            description: descriptiontask,
            date: datetask,
            datereminder: dateremindertask,
            category: categorytask,
        })
            .then(function (docRef) {
                db.collection("user").doc(idUser).set({
                    nbTask: lastTask
                }).then(function (docRef) {
                    console.log(docRef)
                })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

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