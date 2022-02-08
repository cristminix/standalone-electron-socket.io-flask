$(document).ready(function() {
    namespace = 'http://127.0.0.1:5000/test';
    var socket = io(namespace);

    socket.on('connect', function() {
        socket.emit('my_event', {data: 'connected to the SocketServer...'});
    });

    socket.on('my_response', function(msg, cb) {
        $('#log').append('<br>' + $('<div/>').text('logs #' + msg.count + ': ' + msg.data).html());
        if (cb)
            cb();
    });
    $('form#emit').submit(function(event) {
        socket.emit('my_event', {data: $('#emit_data').val()});
        return false;
    });
    $('form#broadcast').submit(function(event) {
        socket.emit('my_broadcast_event', {data: $('#broadcast_data').val()});
        return false;
    });
    $('form#disconnect').submit(function(event) {
        socket.emit('disconnect_request');
        return false;
    });
});

/**
 * Sending messages to Main
 * `data` can be a boolean, number, string, object, or array
 */
api.send( 'custom-endpoint', {'data':'This is from renderer.js'} )

/**
 * Receiving messages from Main
 */
api.handle( 'custom-endpoint', ( event, data ) => function( event, data ) {
    console.log( data )
    socket.emit('my_broadcast_event', {data: data});
}, event);