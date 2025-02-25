$(document).ready(async function () {
    const savedData = JSON.parse(localStorage.getItem('bookingData'));

    function formatBookingData(savedData) {
        const events = [];

        if (savedData) {
            const { subject, bookingDate, startTime, endTime, repeatOption, repeatDays, endDate } = savedData;

            if (repeatOption === "None") {
                events.push({
                    title: subject,
                    start: `${bookingDate}T${startTime}:00`,
                    end: `${bookingDate}T${endTime}:00`,
                });
            } else if (repeatOption === "Weekly") {
                repeatDays.forEach(day => {
                    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(day);
                    events.push({
                        title: subject,
                        startTime: startTime,
                        endTime: endTime,
                        daysOfWeek: [dayIndex],
                        startRecur: bookingDate,
                        endRecur: endDate,
                    });
                });
            } else if (repeatOption === "Monthly") {
                const startDate = new Date(bookingDate);
                const endDateObj = new Date(endDate);

                repeatDays.forEach(day => {
                    let currentDate = new Date(startDate);

                    while (currentDate <= endDateObj) {
                        const eventDate = new Date(currentDate);
                        eventDate.setDate(parseInt(day));

                        if (eventDate >= startDate && eventDate <= endDateObj) {
                            events.push({
                                title: subject,
                                start: `${eventDate.toISOString().split('T')[0]}T${startTime}:00`,
                                end: `${eventDate.toISOString().split('T')[0]}T${endTime}:00`,
                            });
                        }

                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                });
            }
        }

        return events;
    }

    async function fetchHolidays() {
        try {
            let response = await fetch("https://www.gov.uk/bank-holidays.json");
            let data = await response.json();

            const holidays = data["england-and-wales"].events.map(event => ({
                title: event.title,
                start: event.date,
                className: event.bunting ? "event-green" : "event-red"
            }));

            return holidays;
        } catch (error) {
            return [];
        }
    }

    const calendarEvents = formatBookingData(savedData);
    const holidays = await fetchHolidays();
    const allEvents = [...calendarEvents, ...holidays];

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: allEvents,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Today',
            dayGridMonth: 'Month',
            timeGridWeek: 'Week',
            timeGridDay: 'Day'
        },
        eventClick: function(info) {
            alert('Event: ' + info.event.title);
        },
        eventClassNames: function(arg) {
            return arg.event.classNames;
        },
        timeZone: 'local'
    });

    calendar.render();
});

$(document).ready(function () {
    $("#sidebarToggle").on("click", function () {
        $("#sidebar").toggleClass("active");
        $("#content").toggleClass("active");
    });
});
