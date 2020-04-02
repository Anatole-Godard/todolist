var idUser = localStorage.getItem('user');

var db = firebase.firestore();

readTaskCreateCard("archivé", "#archiver", db, idUser);