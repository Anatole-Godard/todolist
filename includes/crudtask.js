$(document).ready(function () {
    var idUser = localStorage.getItem('user');

    var db = firebase.firestore();

    $("#create").click(function () {

        db.collection("user").doc(idUser).get().then(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.data().nbTask + 1);
            lastTask = doc.data().nbTask + 1;


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
                    }).then(function () {
                        $("#modalLoginForm").attr('class', 'modal fade').attr('style', 'display: none;').attr('aria-hidden', 'true');
                        $("body").attr('class', '');
                        $(".modal-backdrop").remove();

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
});




