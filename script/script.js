// Obtenemos el canvas y su contexto
const canvas = document.getElementById('paintCanvas');
const context = canvas.getContext('2d');

// Variables para el dibujo
let isDrawing = false;
let startX = 0;
let startY = 0;

// Función para empezar a dibujar
function startDrawing(e) {
    console.log('Dibujando');
    isDrawing = true;
    [startX, startY] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
}

// Función para dibujar la línea recta
function drawLine(e) {
    if (!isDrawing) return;

    const endX = e.clientX - canvas.offsetLeft;
    const endY = e.clientY - canvas.offsetTop;

    context.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas antes de dibujar la nueva línea

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

// Función para dejar de dibujar
function stopDrawing() {
    isDrawing = false;
}

// Event listeners para empezar, dibujar y dejar de dibujar
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawLine);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
