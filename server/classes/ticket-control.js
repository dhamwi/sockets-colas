const fs = require('fs');

/**
 * Clase Ticket
 */
class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

/**
 * Clase para la gestión de los tickets
 */
class TicketControl {
    constructor() {
        this.ultimo = 0; // Último ticket
        this.hoy = new Date().getDate();
        this.tickets = []; // Contendrá todos los tickets vacíos pendiente de revisión
        this.ultimos4 = [];

        // Leemos el archivo JSON
        let data = require('../data/data.json');

        // Si estamos en el día actual continuamos
        // en otro caso, reiniciamos los valores
        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo();
        }
    }

    /**
     * Método que incrementa el último ticket
     */
    siguiente() {
        this.ultimo++;

        // Creamos un nuevo ticket
        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${this.ultimo}`
    }

    /**
     * Obtiene el último ticket generado
     */
    getUltimoTicket() {
        return `Ticket ${this.ultimo}`
    }

    /**
     * Obtiene los últimos 4 tickets
     */
    getUltimos4() {
        return this.ultimos4;
    }

    /**
     * Asigna un ticket a un escritorio
     */
    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return 'No hay tickets...'
        } else {
            let numTicket = this.tickets[0].numero;
            // Eliminamos el primer ticket puesto que está siendo atendido
            this.tickets.shift(); // Elimina el primer elemento

            let atenderTicket = new Ticket(numTicket, escritorio);
            // Lo ponemos al inicio del array
            this.ultimos4.unshift(atenderTicket);

            if (this.ultimos4.length > 4) {
                this.ultimos4.splice(-1, 1); // Borra el último elemento
            }
            console.log('Ultimos 4');
            console.log(this.ultimos4);

            // Grabamos en el archivo JSON (o BBDD)
            this.grabarArchivo();

            return atenderTicket;
        }
    }

    /**
     * Método que reinicia los valores de último día y el actual
     */
    reiniciarConteo() {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];

        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();
    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }
}

module.exports = {
    TicketControl
}