// Obtenemos el canvas y su contexto
const canvas = document.getElementById('paintCanvas');
const context = canvas.getContext('2d');

// Variables para el dibujo
let isDrawing = false;
let startX = 0;
let startY = 0;
let tool = 'pen'; // Puede ser 'pen', 'line', 'rectangle', 'circle'
let thickness = 1;
let shapes = []; // Array para almacenar todas las formas dibujadas
// ...

// Variables para el dibujo
let strokeColor = document.querySelector('#strokeColor').value;
let fillColor = document.querySelector('#fillColor').value;

// ...

// Función para cambiar el color del borde
function setStrokeColor(newColor) {
    strokeColor = newColor;
    context.strokeStyle = newColor;
}

// Función para cambiar el color de relleno
function setFillColor(newColor) {
    fillColor = newColor;
    context.fillStyle = newColor;
}

// ...

// Configurar el ancho de línea
context.lineWidth = thickness;

// Configurar el color de trazo y de relleno
context.strokeStyle = '#000'; // Cambia '#000' al color que prefieras
context.fillStyle = '#000';

// Configurar el fondo blanco
context.fillStyle = '#fff';
context.fillRect(0, 0, canvas.width, canvas.height);

// Configurar el área de dibujo
const drawArea = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// Función para empezar a dibujar
function startDrawing(e) {
    console.log('Dibujando');
    isDrawing = true;

    // Obtener la posición del canvas en relación con la ventana
    const canvasRect = canvas.getBoundingClientRect();

    // Ajustar las coordenadas del mouse en relación con el canvas
    startX = e.clientX - canvasRect.left;
    startY = e.clientY - canvasRect.top;
}


// Función para dibujar formas
function drawShape(e) {
    if (!isDrawing) return;

    const endX = e.clientX - canvas.offsetLeft;
    const endY = e.clientY - canvas.offsetTop;
    // Limpiar el canvas
    // context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar todas las formas almacenadas
    for (const shape of shapes) {
        switch (shape.tool) {
            case 'pen':
                context.beginPath();
                context.moveTo(shape.startX, shape.startY);
                context.lineTo(shape.endX, shape.endY);
                context.stroke();
                break;
            case 'line':
                context.beginPath();
                context.fillStyle=
                context.moveTo(shape.startX, shape.startY);
                context.lineTo(shape.endX, shape.endY);
                context.stroke();
                break;
            case 'rectangle':
                context.fillRect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY);
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2));
                context.beginPath();
                context.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
                context.fill();
                break;
            default:
                break;
        }
    }

    // Dibujar la nueva forma
    switch (tool) {
        case 'pen':
            context.strokeStyle=strokeColor
            context.fillStyle=fillColor
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            break;
        case 'line':
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            break;
        case 'rectangle':
            context.fillRect(startX, startY, endX - startX, endY - startY);
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            context.beginPath();
            context.arc(startX, startY, radius, 0, 2 * Math.PI);
            context.fill();
            break;
        default:
            break;
    }
}

// Función para dejar de dibujar
function stopDrawing() {
    isDrawing = false;
    // Almacenar la nueva forma en el array
    shapes.push({ tool, startX, startY, endX: startX, endY: startY });
    // drawShape(e)
}

// Función para cambiar la herramienta de dibujo
function setTool(newTool) {
    tool = newTool;
}

// Función para cambiar el grosor de la línea
function setThickness(newThickness) {
    thickness = newThickness;
    context.lineWidth = thickness;
}

// Función para limpiar el canvas
function clearCanvas() {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Limpiar el array de formas
    shapes = [];
    context.fillStyle = fillColor
}

// Función para guardar el estado del canvas en el almacenamiento local
function saveCanvas() {
    const imageDataURL = canvas.toDataURL();
    localStorage.setItem('canvasData', imageDataURL);
    localStorage.setItem('shapesData', JSON.stringify(shapes));
}

// Función para cargar el estado del canvas desde el almacenamiento local
function loadCanvas() {
    const savedCanvasData = localStorage.getItem('canvasData');
    const savedShapesData = localStorage.getItem('shapesData');

    if (savedCanvasData) {
        const image = new Image();
        image.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
        };
        image.src = savedCanvasData;
    }

    if (savedShapesData) {
        shapes = JSON.parse(savedShapesData);
        drawShape(); // Dibujar las formas almacenadas
    }
}

// Event listeners para empezar, dibujar y dejar de dibujar
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawShape);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Cargar el canvas guardado al cargar la página
window.addEventListener('load', loadCanvas);
