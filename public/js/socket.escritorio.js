var socket = io();

var searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
} else {
    var escritorio = searchParams.get('escritorio');
    console.log(escritorio);
    $('h1').text('Escritorio ' + escritorio);

    // Listener del botón
    $('button').on('click', function() {
        socket.emit('atenderTicket', { escritorio: escritorio }, function(resp) {

            if (resp === 'No hay tickets') {
                alert(resp);
                $('small').text(resp);
                return;
            } else {
                $('small').text('Ticket ' + resp.numero);
            }
        });
    });
}