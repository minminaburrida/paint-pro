// /modules/my-module.js
// import {cagada as cpe}  from "./asd";
// console.log(cpe)
// Obtenemos el canvas y su contexto
const canvas = document.getElementById('paintCanvas');
const context = canvas.getContext('2d');

// Variables para el dibujo
let isDrawing = false;
let startX = 0;
let startY = 0;
let endX = 0; // Se agregó endX y endY
let endY = 0;
let tool = 'pen'; // Puede ser 'pen', 'line', 'rectangle', 'circle'
let thickness = 1;
let shapes = []; // Array para almacenar todas las formas dibujadas
let lastShapes = [];
// let layers = [];
let idforma = 1;
const btnRedo = document.getElementById('btnRedo');
const btnUndo = document.getElementById('btnUndo');
canvas.parentElement.style.overflow = 'auto';
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
canvas.style.width = canvas.width + 'px';
canvas.style.height = canvas.height + 'px';

// Variables para el dibujo
let strokeColor = document.querySelector('#strokeColor').value;
let fillColor = document.querySelector('#fillColor').value;

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
    if (!isValidTool(tool))return;
    isDrawing = true;

    // Obtener la posición del canvas en relación con la ventana
    const canvasRect = canvas.getBoundingClientRect();

    // Ajustar las coordenadas del mouse en relación con el canvas
    startX = e.clientX - canvasRect.left;
    startY = e.clientY - canvasRect.top;

    // Inicializar endX y endY
    endX = startX;
    endY = startY;
}

// Función para dibujar formas
function drawShape(e) {
    if (!isDrawing || !isValidTool(tool)) return;

    const canvasRect = canvas.getBoundingClientRect();
    endX = e.clientX - canvasRect.left;
    endY = e.clientY - canvasRect.top;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Aquí, coloca la lógica de dibujo basada en la herramienta actual
    // Asegúrate de considerar la herramienta actual antes de realizar cualquier dibujo

    for (const shape of shapes) {
        switch (shape.tool) {
            case 'pen':
            case 'line':
                drawLine(shape.startX, shape.startY, shape.endX, shape.endY);
                break;
            case 'rectangle':
                // Lógica para dibujar rectángulos
                break;
            case 'circle':
                // Lógica para dibujar círculos
                break;
            default:
                break;
        }
    }

    // Aquí, coloca la lógica de dibujo basada en la herramienta actual
    // Asegúrate de considerar la herramienta actual antes de realizar cualquier dibujo

    switch (tool) {
        case 'pen':
            context.strokeStyle = strokeColor;
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            break;
        case 'line':
            context.strokeStyle = strokeColor;
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
            break;
        case 'rectangle':
            // Lógica para dibujar rectángulos
            break;
        case 'circle':
            // Lógica para dibujar círculos
            break;
        default:
            break;
    }
}
// Array de Herramientas no validas
let notValidTools = ['mouse']

isValidTool = (t)=>!notValidTools.includes(t);

// Función para dejar de dibujar
function stopDrawing() {
    if (isDrawing && isValidTool(tool)) {
        isDrawing = false;
        // Almacenar la nueva forma en el array
        
        shapes.push({ tool, startX, startY, endX, endY, fillColor, strokeColor, thickness, idforma });
        idforma += 1;
        drawShapes();
    }
    btnRedo.disabled = !lastShapes.length
    btnUndo.disabled = !shapes.length
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
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    shapes = [];
    context.fillStyle = fillColor;
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
    if (savedCanvasData && savedShapesData && confirm('Desea cargar el ultimo estado?')) {
        const image = new Image();
        image.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
        };
        image.src = savedCanvasData;

        shapes = JSON.parse(savedShapesData);
        btnRedo.disabled = true;
        btnUndo.disabled = true
        drawShapes();
    }
    else {
        localStorage.removeItem('shapesData');
        localStorage.removeItem('canvasData');
    }

}

// Nueva función para dibujar todas las formas almacenadas
// Nueva función para dibujar todas las formas almacenadas
function drawShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const shape of shapes) {
        context.strokeStyle = shape.strokeColor;
        context.fillStyle = shape.fillColor;
        context.lineWidth = shape.thickness;

        switch (shape.tool) {
            case 'pen':
            case 'line':
                context.beginPath();
                // context.moveTo(shape.startX, shape.startY);
                // context.lineTo(shape.endX, shape.endY);
                // context.stroke();
                drawLine(shape.startX, shape.startY, shape.endX, shape.endY)
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
}
function drawPen(e) {
    // console.log(tool)
    if (!isDrawing || tool !== 'pen') return;

    const canvasRect = canvas.getBoundingClientRect();
    endX = e.clientX - canvasRect.left;
    endY = e.clientY - canvasRect.top;

    drawLine(startX, startY, endX, endY);

    shapes.push({ tool: 'pen', startX, startY, endX, endY, fillColor, strokeColor, thickness, idforma });

    startX = endX;
    startY = endY;
    // console.log('dibujade')
}

function undo() {
    // Funcion para deshacer kgda
    console.log(idforma-1);
    if (shapes.length)
        while (idforma - 1 == shapes[shapes.length - 1].idforma) {
            lastShapes.push(shapes.pop());
            console.log(shapes.length)
            if (!shapes.length) break;
        }
    idforma -= 1
    // console.log('undoing')
    btnUndo.disabled = !lastShapes.length
    drawShapes();
}

function redo() {
    // Funcion para rehacer kgda
    while (lastShapes.length > 0 && idforma === lastShapes[lastShapes.length - 1].idforma) {
        shapes.push(lastShapes.pop());
        console.log(shapes.length);
    }
    idforma += 1;
    btnRedo.disabled = !shapes.length;
    drawShapes();
}
function doU(e) {
    // let redraw = false;
    if (e.ctrlKey) {
        // CTRL
        if (e.key == 'Z' || e.key == 'z') {
            // CTRL Z <shift>
            e.shiftKey ? redo() : undo()
            // redraw = true
        }
        else if (e.key == 'y' || e.key == 'Y') redo()//;redraw = true}
        // redraw?drawShapes():null;
    }
}
// Funciones que deseo utilizar en todo el codigo de arriba
function drawPixel(x, y) {
    context.fillRect(x, y, 1, 1);
}
function drawLine(x1, y1, x2, y2) {

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    while (true) {
        drawPixel(x1, y1);
        if (x1 === x2 && y1 === y2) break
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }

}


function newLayer(e){

}
// Event listeners para empezar, dibujar y dejar de dibujar
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawShape);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', drawPen);
document.addEventListener('keydown', doU);
// Cargar el canvas guardado al cargar la página
window.addEventListener('load', loadCanvas);

let layers = [
    { name: 'Capa 1', visible: true, index:1},
    { name: 'Capa 2', visible: true, index:2},
];

// Función para agregar una nueva capa
function addLayer() {
    const newLayerName = prompt('Ingrese el nombre de la nueva capa:');
    if (newLayerName) {
        layers.push({ name: newLayerName, visible: true });
        renderLayers();
    }
}

// Función para eliminar una capa
async function deleteLayer(layerIndex = false) {
    console.log("Borrando capa ",layerIndex)
    if (!layerIndex && layerIndex!=0) layerIndex = prompt('Ingrese el índice de la capa que desea eliminar:');
    if (layerIndex==0 || layerIndex && layers[layerIndex]) {
        layers.splice(layerIndex, 1);
        renderLayers();
    }
}

// Función para renombrar una capa
function renameLayer() {
    const layerIndex = prompt('Ingrese el índice de la capa que desea renombrar:');
    if (layerIndex && layers[layerIndex]) {
        const newName = prompt('Ingrese el nuevo nombre para la capa:');
        if (newName) {
            layers[layerIndex].name = newName;
            renderLayers();
        }
    }
}

// Función para cambiar la visibilidad de una capa
function toggleLayerVisibility(layerIndex) {
    
    layers[layerIndex].visible = !layers[layerIndex].visible;
    console.log((layers[layerIndex].visible?"mostrando":"ocultando")+' capa '+layerIndex)
    renderLayers();
}

// Función para cambiar el orden de las capas
function changeLayerOrder() {
    const selectElement = document.getElementById('layerOrderSelect');
    const selectedOption = selectElement.options[selectElement.selectedIndex].value;
    if (selectedOption === 'front') {
        // Lógica para traer la capa al frente
        // Por ejemplo, podrías cambiar el orden del array `layers` para que la capa seleccionada esté al final
        // Y luego llamar a renderLayers() para actualizar la visualización
    } else if (selectedOption === 'back') {
        // Lógica para enviar la capa al fondo
        // Por ejemplo, podrías cambiar el orden del array `layers` para que la capa seleccionada esté al principio
        // Y luego llamar a renderLayers() para actualizar la visualización
    }
}

function renderLayers() {
    const layerList = document.getElementById('layerList');
    layerList.innerHTML = ''; // Limpiar la lista antes de renderizar las capas nuevamente
    layers.forEach((layer, index) => {
        layer.index = index
        const listItem = document.createElement('div');
        listItem.textContent = layer.name;
        listItem.style.border = '1px solid';
        listItem.style.width = '100%';
        // Agregar un botón para cambiar la visibilidad de la capa
        const visibilityButton = document.createElement('button');
        visibilityButton.textContent = !layer.visible ? '👁️' : '❌';
        visibilityButton.onclick = () => toggleLayerVisibility(index);
        listItem.appendChild(visibilityButton);

        // Agregar un botón de borrar con un emoji de un bote de basura
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️'; // Emoji de un bote de basura
        deleteButton.onclick = () => {layer.deleting = true; deleteLayer(index)};
        listItem.onclick = () => {layer.deleting = false; selectLayer(layer)};
        listItem.appendChild(deleteButton);

        layerList.appendChild(listItem);
    });
}

async function selectLayer(layer) {
    // Verificar si se está presionando un botón
    const buttonsPressed = document.querySelectorAll('button:active');
    if (buttonsPressed.length > 0) {
        // Si se está presionando un botón, manejar la acción del botón presionado
        buttonsPressed.forEach(button => {
            if (button.onclick) {
                button.onclick();
            }
        });
    } else {
        // Si no se está presionando un botón, seleccionar la capa
        if (layer.deleting) return;
        layerIndex = layers.findIndex(l => l === layer);
        console.log('seleccionando capa ', layerIndex);
        // Des-seleccionar todas las capas
        const layerList = document.getElementById('layerList');
        const layerItems = layerList.children;
        for (let i = 0; i < layerItems.length; i++) {
            if (i === layerIndex) {
                // Seleccionar la capa clickeada
                layerItems[i].classList.add('selected');
            } else {
                // Des-seleccionar las otras capas
                layerItems[i].classList.remove('selected');
            }
        }
    }
}



// Llamar a renderLayers() para renderizar las capas al cargar la página
window.onload = renderLayers;

// Variable para almacenar el número de lados del polígono personalizado
let sides = 3;

// Función para establecer el número de lados del polígono personalizado
function setSides(value) {
    sides = value;
    if (tool === 'custom') {
        drawCustomPolygon();
    }
}