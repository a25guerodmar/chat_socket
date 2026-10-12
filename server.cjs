const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {

    console.log('Client connectat:', socket.id);

    // Rebre i validar missatges
    socket.on('chat:send', (data) => {

        // Comprovar que el nom i el text siguin cadenes
        if (typeof data?.nom !== 'string' ||
            typeof data?.text !== 'string') {
            return;
        }

        const nom = data.nom.trim();
        const text = data.text.trim();

        // Comprovar que no estiguin buits
        if (!nom || !text) {
            return;
        }

        // Comprovar els límits de caràcters
        if (nom.length > 20 || text.length > 500) {
            return;
        }

        // Enviar el missatge a tots els clients
        io.emit('chat:message', {
            nom: nom,
            text: text,
            hora: new Date().toISOString()
        });
    });

    // Quan el client es desconnecta
    socket.on('disconnect', () => {
        console.log('Client desconnectat:', socket.id);
    });

});

server.listen(3000, () => {
    console.log('Servidor iniciat a http://localhost:3000');
});