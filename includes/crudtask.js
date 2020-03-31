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

    })

});