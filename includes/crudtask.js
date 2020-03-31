$(document).ready(function () {

    var idUser = localStorage.getItem('user');

    var db = firebase.firestore();

    console.log(db);

    $("#create").click(function() {
        let nameTask = $("#nametask").val();
        let descriptiontask = $("#descriptiontask").val();
        let datetask = $("#datetask").val();
        let dateremindertask = $("#dateremindertask").val();
        let categorytask = $("#category").val();

        db.collection("user").doc(idUser).collection('tasks').doc('1').set({
            name: nameTask,
            description: descriptiontask,
            date: datetask,
            datereminder: dateremindertask,
            category: categorytask,
        })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

    })

});