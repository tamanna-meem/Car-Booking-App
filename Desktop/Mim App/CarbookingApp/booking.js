$(document).ready(function () {
    const today = new Date().toISOString().split('T')[0];
    $('#bookingDate').attr('min', today);
    $('#endDate').attr('min', today);

    function createWeeklyCheckboxes() {
        const weeklyDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let checkboxesHTML = "";
        weeklyDays.forEach(function (day, index) {
            checkboxesHTML += `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="day${index}" value="${day}">
                    <label class="form-check-label" for="day${index}">${day}</label>
                </div>
            `;
        });
        $('#weeklyDaysCheckboxes').html(checkboxesHTML);
    }

    function createMonthlyCheckboxes() {
        let checkboxesHTML = "";
        for (let i = 1; i <= 31; i++) {
            checkboxesHTML += `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="monthDay${i}" value="${i}">
                    <label class="form-check-label" for="monthDay${i}">${i}</label>
                </div>
            `;
        }
        $('#monthlyDaysCheckboxes').html(checkboxesHTML);
    }

    $(".weekly-days, .monthly-days").hide();

    $('#repeatOption').change(function () {
        const selectedOption = $(this).val();
        $(".weekly-days, .monthly-days").hide();

        if (selectedOption === "Weekly") {
            $(".weekly-days").show();
            $('#endDate').closest('.mb-3').show();
            createWeeklyCheckboxes();
        } else if (selectedOption === "Monthly") {
            $(".monthly-days").show();
            $('#endDate').closest('.mb-3').show();
            createMonthlyCheckboxes();
        } else if (selectedOption === "None") {
            $('#endDate').closest('.mb-3').hide();
        }
    });

    function getSelectedWeeklyDays() {
        const selectedDays = [];
        $(".weekly-days input:checked").each(function () {
            selectedDays.push($(this).val());
        });
        return selectedDays;
    }

    function getSelectedMonthlyDays() {
        const selectedDays = [];
        $(".monthly-days input:checked").each(function () {
            selectedDays.push($(this).val());
        });
        return selectedDays;
    }

    $('#bookingForm').submit(function (event) {
        event.preventDefault();

        const subject = $('#subject').val();
        const car = $('#car').val();
        const bookingDate = $('#bookingDate').val();
        const startTime = $('#startTime').val();
        const endTime = $('#endTime').val();
        const repeatOption = $('#repeatOption').val();
        //const endDate = $('#endDate').val();
        let endDate = null;
        if (repeatOption !== "None") {
            endDate = $('#endDate').val();
        }
        let repeatDays = [];
        if (repeatOption === "Weekly") {
            repeatDays = getSelectedWeeklyDays();
        } else if (repeatOption === "Monthly") {
            repeatDays = getSelectedMonthlyDays();
        }

        const bookingData = {
            subject,
            car,
            bookingDate,
            startTime,
            endTime,
            repeatOption,
            repeatDays,
            endDate
        };

        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        alert('Booking saved successfully!');

        // Redirect to index.html after saving the data
        window.location.href = "index.html";
    });

    const savedData = JSON.parse(localStorage.getItem('bookingData'));
    console.log(savedData);

    $('#repeatOption').change();
});
