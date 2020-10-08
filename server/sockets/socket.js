const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');
const { json } = require('express');

const ticketControl = new TicketControl();

io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();
        console.log(siguiente);
        callback(siguiente);
    });

    // Emitimos un evento del estado actual
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    // Escuchamos el sig evento
    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                error: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);
        callback(atenderTicket);

        // Actualizar y notificar cambios en los últimos 4 tickets
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });
    });
});