$(document).ready(function () {

    var calendar = new tui.Calendar(document.getElementById('calendar'), {
        calendarId: '1',
        defaultView: 'month',
        taskView: false,
        scheduleView: true,
        useCreationPopup: false,
        useDetailPopup: true,
        template: {

            time: function (schedule) {
                return schedule.title + ' :  ' + schedule.body;
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

    date = new Date();


    var db = firebase.firestore();
    var idUser = localStorage.getItem('user');


    db.collection("user").doc(idUser).collection('tasks').get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {

                let statement = doc.data().statement;
                let Taskcategory = doc.data().category;

                if (doc.data().date !== '') {

                    if (!(statement === 'supprimé' || statement === 'archivé')) {
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


    getMyCalendarMonth(calendar);

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
        for (let i = 0; i < response.length; i++) {

            datenewdate = moment(response[i].date).format();

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
                goingDuration: 120,
                start: datenewdate,
                dueDateClass: '',
                color: "#ffffff",
                bgColor: colorhexa,
                dragBgColor: '#dc3545',

            },
        ])


}

function getMyCalendarMonth(calendar) {

    month = new Date(calendar.getDate());

    let options = {month: 'long'};
    formatedMonth = month.toLocaleDateString('fr', options);

    $(".current-month-in-calendar").html(formatedMonth);
}
