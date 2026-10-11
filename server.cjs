const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000
    }
});

app.use(express.static('public'));

io.on('connection', (socket) => {

    console.log('Client connectat:', socket.id);

    socket.on('chat:send', (data) => {

        const nom = data?.nom;
        const text = data?.text;

        if (typeof nom !== 'string' ||
            typeof text !== 'string') return;

        if (!nom.trim() || !text.trim()) return;

        if (nom.length > 20 || text.length > 500) return;

        io.emit('chat:message', {
            nom: nom.trim(),
            text: text.trim(),
            hora: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log('Client desconnectat:', socket.id);
    });

});

server.listen(3000, () => {
    console.log('Servidor iniciat a http://localhost:3000');
});