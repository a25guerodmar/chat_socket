const socket = io();

socket.on('connect', () => {
    console.log('Connectat', socket.id);
    console.log('Recuperat?', socket.recovered);
});

socket.on('disconnect', () => {
    console.log('Desconnectat');
});

const form = document.querySelector('#form');
const nomInput = document.querySelector('#nom');
const input = document.querySelector('#text');

form.addEventListener('submit', (event) => {

    event.preventDefault();

    if (!socket.connected) return;

    const nom = nomInput.value.trim();
    const text = input.value.trim();

    if (!nom || !text) return;

    socket.emit('chat:send', { nom, text });

    input.value = '';
});

socket.on('chat:message', (msg) => {

    const li = document.createElement('li');

    li.textContent = `${msg.nom}: ${msg.text}`;

    document.querySelector('#messages').append(li);

});