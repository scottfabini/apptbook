/**
 * Created by sfabini on 8/16/16.
 */
$(document).ready(function() {
    // page is ready
    // enable bootstrap popover
    $(function () {
        $('[data-toggle="popover"]').popover();
    });
    // initialize fullcalendar
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventLimit: 2,
        editable: true,
        selectable: true,

        dayClick: function(date, jsEvent, view) {
            $(this).popover({
                html: true,
                placement: 'top',
                container: 'body',
                editable: true,
                selectable: true,
                // create the popover
                title: function() {
                    return $('#popover-head').html();
                },
                content: function() {
                    $('#popover-content').find('#beginDate').attr('value', date.format("YYYY-MM-DD"));
                    $('#popover-content').find('#endDate').attr('value', date.format("YYYY-MM-DD"));
                    return $('#popover-content').html();
                }
            });
            $(this).popover('toggle');
        },

        // Render the event (appointment) to the fullcalendar
        eventRender: function(event, element, view) {
            return element.html(event.start.format("hh:mma").toUpperCase()
                + "-" + event.end.format("hh:mma").toUpperCase()
                + ': ' + event.title);
        }
    }); // full calendar initialized

    // Create the event (appointment), call fullCalendar to render it, and send it to the server.
    $(document).on('submit', '#calendar-form', function(e) {
        e.preventDefault(); // prevent refresh on submit
        var beginDateTime = $(this).find("#beginDate").val() + " " + $(this).find("#beginTime").val();
        var endDateTime = $(this).find("#endDate").val() + " " + $(this).find("#endTime").val();
        var event = {
            title: $(this).find("#description").val(),
            start: $.fullCalendar.moment(beginDateTime, 'YYYY-MM-DD hh:mm a'),
            end: $.fullCalendar.moment(endDateTime, 'YYYY-MM-DD hh:mm a'),
            allDay: false,
            editable: true,
            backgroundColor: 'grey'
        };


        // Do Ajax call

        $('#calendar').fullCalendar('renderEvent', event, true);
    });
});






/*
 select: function (start, end, jsEvent, view) {
 console.log("start: " + start.format("YYYY-MM-DD"));
 console.log("end: " + end.format("YYYY-MM-DD"));
 $(jsEvent.target).popover({

 html: true,
 placement: 'top',
 container: 'body',
 allDay: true,
 editable: true,
 selectable: true,
 //unselectAuto: true,

 // create the popover
 title: function() {
 return $('#popover-head').html();
 },
 content: function() {
 $('#popover-content').find('#beginDate').attr('value', start.format("YYYY-MM-DD"));
 $('#popover-content').find('#endDate').attr('value', end.format("YYYY-MM-DD"));
 return $('#popover-content').html();
 }
 });
 $(jsEvent.target).popover('toggle');
 },
 */