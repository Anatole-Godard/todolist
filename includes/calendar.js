$(document).ready(function () {
    var calendar = new tui.Calendar(document.getElementById('calendar'), {
        calendarId: '1',
        defaultView: 'week',
        taskView: false,
        scheduleView: true,
        useCreationPopup: false,
        useDetailPopup: true,
        template: {
            time: function (schedule) {
                return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.start;
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
            daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            startDayOfWeek: 0,
            narrowWeekend: true
        }, week: {
            daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            startDayOfWeek: 0,
            narrowWeekend: true
        }
    });

    date = new Date();


    var db = firebase.firestore();
    var idUser = localStorage.getItem('user');


    db.collection("user").doc(idUser).collection('tasks').get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {

                console.log(doc.id, " => ", doc.data());

                datenewdate = moment(doc.data().date);
                console.log(doc.data().date);
                console.log(datenewdate.format());

                if (datenewdate.format !== 'Invalid date') {
                    datenewdate = datenewdate.format();


                    calendar.createSchedules([
                        {
                            id: doc.id,
                            calendarId: '1',
                            title: doc.data().name,
                            body: doc.data().description,
                            category: 'time',
                            dueDateClass: '',
                            goingDuration: 120,
                            start: datenewdate,
                            bgColor: '#dc3545',
                            dragBgColor: '#dc3545'
                        },
                    ])
                }
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });


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
            response[i].date

            calendar.createSchedules([
                {
                    id: response[i].localName,
                    calendarId: '1',
                    title: 'Jour férier',
                    body: response[i].localName,
                    category: 'allday',
                    isAllDay: true,
                    goingDuration: 120,
                    start: datenewdate,
                    bgColor: '#133154',
                    dragBgColor: '#dc3545'
                },
            ])
        }
    });

    $('.js-calendar-next').on('click', function() {
        calendar.next();
        setCalendarTitleText();
    });

    $('.js-calendar-prev').on('click', function() {
        calendar.prev();
        setCalendarTitleText();
    });

    $('.js-calendar-today').on('click', function() {
        calendar.today();
        setCalendarTitleText();
    });
});