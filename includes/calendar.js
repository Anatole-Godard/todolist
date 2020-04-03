$(document).ready(function () {

    //on créer l'objet calendar et on le configure
    var calendar = new tui.Calendar(document.getElementById('calendar'), {
        calendarId: '1',
        defaultView: 'month',
        taskView: false,
        scheduleView: true,
        useCreationPopup: false,
        useDetailPopup: true,
        template: {

            time: function (schedule) {
                return schedule.title;
            },
            popupDetailRepeat: function (schedule) {
                return 'Repeat : ' + schedule.recurrenceRule;
            },
            popupDetailBody: function (schedule) {
                return 'Description : ' + schedule.body;
            },
            popupDelete: function () {
                return 'Delete';
            },
            schedule: function (schedule) {

                return '| ' + schedule.title + ' |';
            },

        },
        month: {
            daynames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            startDayOfWeek: 1,
            narrowWeekend: true
        }, week: {
            daynames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            startDayOfWeek: 1,
            narrowWeekend: true
        }
    });

    //on récupère la connéxion à firebase
    var db = firebase.firestore();
    //on récupère l'Id de l'utilisateur connecté
    var idUser = localStorage.getItem('user');

    //on intéroge la base pour récupérer toutes les tâches créer par l'utilisateur connecté
    db.collection("user").doc(idUser).collection('tasks').get()
        .then(function (querySnapshot) {
            //on fait un foreach sur la reponse de firebase
            querySnapshot.forEach(function (doc) {


                let statement = doc.data().statement;
                let Taskcategory = doc.data().category;

                //on commence par vérifier que la tâche à une date
                if (doc.data().date !== '') {
                    //puis que son statut ne soit pas supprimé ou archivé
                    if (!(statement === 'supprimé' || statement === 'archivé')) {
                        //ensuite on créer la tache dans le calendrier, selon sa catégorie sa couleur va changer
                        switch (Taskcategory) {
                            case 'loisir':
                                templateSchedule(calendar, doc, 'loisir');
                                break;
                            case 'perso':
                                templateSchedule(calendar, doc, 'perso');
                                break;
                            case 'Travail':
                                templateSchedule(calendar, doc, 'Travail');
                                break;
                            case 'anniversaire':
                                templateSchedule(calendar, doc, 'anniversaire');
                                break;
                            case 'sport':
                                templateSchedule(calendar, doc, 'sport');
                                break;
                            default:
                                console.log('Sorry, we are out of ' + expr + '.');
                        }
                    }
                }
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

    //on change met à jour le mois qui est affiché dans le titre
    getMyCalendarMonth(calendar);

    //on commence une requette ajax pour intérroger l'api 'Holyday'
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://public-holiday.p.rapidapi.com/2020/FR",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "public-holiday.p.rapidapi.com",
            "x-rapidapi-key": "05ed0c2bf0msh19229d1b8a57317p128556jsnf227c9a1810a"
        }
    };

    $.ajax(settings).done(function (response) {
        //on fait un foreach sur la reponse de l'api
        for (let i = 0; i < response.length; i++) {
            //on créer une date
            datenewdate = moment(response[i].date).format();

            //puis on créer notre tâche dans le calendrier avec les infos de l'api
            calendar.createSchedules([
                {
                    id: response[i].localName,
                    calendarId: '1',
                    title: 'Jour férié',
                    body: response[i].localName,
                    start: datenewdate,
                    category: 'milestone',
                    color: "#ffffff",
                    bgColor: '#133154',
                    dragBgColor: '#133154',

                },
            ])
        }
    });

    //on assigne des events sur les boutons 'flêche' et 'Aujourd'hui'
    $('.js-calendar-next').on('click', function () {
        calendar.next();
        // setCalendarTitleText();
        getMyCalendarMonth(calendar)
    });

    $('.js-calendar-prev').on('click', function () {
        calendar.prev();
        // setCalendarTitleText();
        getMyCalendarMonth(calendar)
    });

    $('.js-calendar-today').on('click', function () {
        calendar.today();
        getMyCalendarMonth(calendar)
        // setCalendarTitleText();
    });

});

//fonction de template de tâche créé par l'utilisateur
function templateSchedule(calendar, doc, color) {

    datenewdate = moment(doc.data().date).format();

    var colorhexa = $("span .bg-" + color).css("background-color");
    calendar.createSchedules([
        {
            id: doc.id,
            calendarId: '1',
            title: doc.data().name,
            body: doc.data().description,
            category: 'task',
            user: doc.data().category,
            goingDuration: 120,
            start: datenewdate,
            dueDateClass: '',
            color: "#ffffff",
            bgColor: colorhexa,
            dragBgColor: '#dc3545',

        },
    ])


}

//on change met à jour le mois qui est affiché dans le titre
function getMyCalendarMonth(calendar) {

    //on créer une date selon le mois affiché par le calendrier
    month = new Date(calendar.getDate());

    //on formate la date pour avoir juste le mois en Français et en Majuscule
    let options = {month: 'long'};
    formatedMonth = month.toLocaleDateString('fr', options).toUpperCase();
    //Enfin on met à jour le Titre :)
    $(".current-month-in-calendar").html(formatedMonth);
}
