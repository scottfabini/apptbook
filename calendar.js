/**
 * Copyright (c) 2016 Scott Fabini (scott.fabini@gmail.com)
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * README.md file in the root directory of this source tree.
 */
jQuery(document).ready(function() {
    // page is ready
    // enable bootstrap popover
    jQuery(function () {
        jQuery('[data-toggle="popover"]').popover();
    });
    // initialize fullcalendar
    jQuery('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventLimit: 2,
        editable: true,
        selectable: true,
        // Click on a day to generate the popover
        dayClick: function(date, jsEvent, view) {
            jQuery(this).popover({
                html: true,
                placement: 'top',
                container: 'body',
                editable: true,
                selectable: true,
                // create the popover
                title: function() {
                    return jQuery('#popover-head').html();
                },
                content: function() {
                    jQuery('#popover-content').find('#beginDate').attr('value', date.format("YYYY-MM-DD"));
                    jQuery('#popover-content').find('#endDate').attr('value', date.format("YYYY-MM-DD"));
                    return jQuery('#popover-content').html();
                }
            });
            jQuery(this).popover('toggle');





        },
        // Render the event (appointment) to the fullcalendar
        eventRender: function(event, element, view) {
            return element.html(event.start.format("hh:mm a").toUpperCase()
                + "-" + event.end.format("hh:mm a").toUpperCase()
                + ': ' + event.title);
        }
    }); // full calendar initialized

    jQuery.ajax({
        'type': 'GET',
        'url': 'http://localhost:8080/apptbook/read',
        'dataType': 'JSON',
        'timeout': 5000,
        'success': function (data) {
            console.log("Rendering events read from server: ");
            for (var i = 0; i < data.length; ++i) {
                console.log(JSON.stringify(data[i]));
                jQuery('#calendar').fullCalendar('renderEvent', JSON.parse(data[i].event), true);
            }
        },
        'error': function(data) {
            alert("Failed to write appointment data to server. Server returned " + JSON.parse(data) );
        }
    });
    console.log("Loading calendar")

    
    // Create the event (appointment), call fullCalendar to render it, and send it to the server.
    jQuery(document).on('submit', '#calendar-form', function(e) {
        e.preventDefault(); // prevent refresh on submit
        var description = jQuery(this).find("#description").val();
        var beginDateTime = jQuery(this).find("#beginDate").val() + " " + jQuery(this).find("#beginTime").val();
        var endDateTime = jQuery(this).find("#endDate").val() + " " + jQuery(this).find("#endTime").val();
        var beginDateTimeFromEpoch = jQuery.fullCalendar.moment(beginDateTime, 'YYYY-MM-DD hh:mm a').valueOf();
        var endDateTimeFromEpoch = jQuery.fullCalendar.moment(endDateTime, 'YYYY-MM-DD hh:mm a').valueOf();
        var currentDateTime = new moment().valueOf();


        var event = {
            title: description,
            start: jQuery.fullCalendar.moment.utc(beginDateTime, 'YYYY-MM-DD hh:mm a'),
            end: jQuery.fullCalendar.moment.utc(endDateTime, 'YYYY-MM-DD hh:mm a'),
            allDay: false,
            editable: true,
            backgroundColor: 'grey'
        };
        // Do Ajax call.  Render event to calendar if call succeeds; else, don't.
        jQuery.ajax({
            'type': 'POST',
            'url': 'http://localhost:8080/apptbook/create',
            'dataType': 'JSON',
            'data': {
                'hashkey': currentDateTime,
                'event': JSON.stringify(event)
            },
            'timeout': 5000,
            'success': function (event) {
                jQuery('#calendar').fullCalendar('renderEvent', event, true);
                console.log("\nRendering event:\nDescription: " + description + "\nbeginDateTime: " + beginDateTime
                    + "\nendDateTime: " + endDateTime + "\nbeginDateTimeFromEpoch" + beginDateTimeFromEpoch
                    + "\nendDateTimeFromEpoch" + endDateTimeFromEpoch
                    + "\nstart: " + JSON.stringify(event.start) + "\nend: " + JSON.stringify(event.end));
            },
            'error': function(callbackEvent) {
                alert("Failed to write appointment data to server. " + callbackEvent );
                }
        });


    });
});






/*
 select: function (start, end, jsEvent, view) {
 console.log("start: " + start.format("YYYY-MM-DD"));
 console.log("end: " + end.format("YYYY-MM-DD"));
 jQuery(jsEvent.target).popover({

 html: true,
 placement: 'top',
 container: 'body',
 allDay: true,
 editable: true,
 selectable: true,
 //unselectAuto: true,

 // create the popover
 title: function() {
 return jQuery('#popover-head').html();
 },
 content: function() {
 jQuery('#popover-content').find('#beginDate').attr('value', start.format("YYYY-MM-DD"));
 jQuery('#popover-content').find('#endDate').attr('value', end.format("YYYY-MM-DD"));
 return jQuery('#popover-content').html();
 }
 });
 jQuery(jsEvent.target).popover('toggle');
 },
 */