// Comando para establecer la conexión
var socket = io();
var label = $('#lblNuevoTicket'); // Hacemos referencia al label del html

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Desonectado del servidor');
});

/**
 * Listener escuchando el estado actual
 */
socket.on('estadoActual', function(resp) {
    label.text(resp.actual);
});

/**
 * Listener del boton
 */
$('button').on('click', function() {
    socket.emit('siguienteTicket', null, function(siguienteTicket) {
        label.text(siguienteTicket);
    });
});