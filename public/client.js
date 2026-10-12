const socket = io();

// Estat de la connexió
const estatConnexio = document.querySelector('#estat-connexio');

// Formulari d'entrada
const formEntrada = document.querySelector('#form-entrada');
const nomInput = document.querySelector('#nom');

// Elements del xat
const chat = document.querySelector('#chat');
const nomUsuari = document.querySelector('#nom-usuari');
const form = document.querySelector('#form');
const input = document.querySelector('#text');
const messages = document.querySelector('#messages');
const btnEnviar = form.querySelector('button[type="submit"]');

// Nom de l'usuari
let nom = '';

// Estat inicial
estatConnexio.textContent = 'Connectant...';
btnEnviar.disabled = !socket.connected;

// Quan es connecta al servidor
socket.on('connect', () => {
    console.log('Connectat:', socket.id);

    estatConnexio.textContent = 'Connectat';
    btnEnviar.disabled = false;
});

// Quan es desconnecta del servidor
socket.on('disconnect', () => {
    console.log('Desconnectat');

    estatConnexio.textContent = 'Desconnectat';
    btnEnviar.disabled = true;
});

// Entrar al xat
formEntrada.addEventListener('submit', (event) => {
    event.preventDefault();

    const nomIntroduit = nomInput.value.trim();

    // Comprovar que el nom no estigui buit
    if (!nomIntroduit) {
        alert('Has d’introduir un nom');
        return;
    }

    // Comprovar que el nom no superi els 20 caràcters
    if (nomIntroduit.length > 20) {
        alert('El nom no pot superar els 20 caràcters');
        return;
    }

    // Guardar el nom
    nom = nomIntroduit;

    // Mostrar el nom a la capçalera
    nomUsuari.textContent = `Estàs participant com: ${nom}`;

    // Mostrar el xat
    formEntrada.hidden = true;
    chat.hidden = false;
});

// Enviar missatges
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Comprovar que hagi entrat i estigui connectat
    if (!nom || !socket.connected) return;

    const text = input.value.trim();

    // No enviar missatges buits
    if (!text) return;

    // Enviar el missatge al servidor
    socket.emit('chat:send', { nom, text });

    // Buidar el camp després d'enviar
    input.value = '';
});

// Rebre missatges (registrat una sola vegada)
socket.on('chat:message', (msg) => {
    const li = document.createElement('li');

    // Convertir l'hora a hores i minuts
    const hora = new Date(msg.hora).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Mostrar el nom, l'hora i el text de manera segura
    li.textContent = `${msg.nom} (${hora}): ${msg.text}`;

    // Afegir el missatge a la llista
    messages.append(li);

    // Desplaçar-se fins a l'últim missatge
    const zonaMissatges = document.querySelector('.zona-missatges');
    zonaMissatges.scrollTop = zonaMissatges.scrollHeight;
});