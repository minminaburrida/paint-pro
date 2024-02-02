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
    if (!isDrawing) return;

    const canvasRect = canvas.getBoundingClientRect();
    endX = e.clientX - canvasRect.left;
    endY = e.clientY - canvasRect.top;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const shape of shapes) {
        switch (shape.tool) {
            case 'pen':
            case 'line':
                // context.beginPath();
                // context.moveTo(shape.startX, shape.startY);
                // context.lineTo(shape.endX, shape.endY);
                // context.stroke();
                drawLine(shape.startX, shape.startY, shape.endX, shape.endY)
                break;
            case 'rectangle':
                if (shape.shiftPressed) {
                    // Si la tecla Shift estaba presionada, convertir el rectángulo a cuadrado
                    const width = Math.abs(shape.endX - shape.startX);
                    const height = Math.abs(shape.endY - shape.startY);
                    const side = Math.min(width, height);

                    if (shape.endX < shape.startX) {
                        context.fillStyle = shape.fillColor;
                        context.fillRect(shape.startX - side, shape.startY, side, side);
                    } else {
                        context.fillStyle = shape.fillColor;
                        context.fillRect(shape.startX, shape.startY, side, side);
                    }
                } else {
                    // Si la tecla Shift no estaba presionada, dibujar el rectángulo normalmente
                    context.fillStyle = shape.fillColor;
                    context.fillRect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY);
                }
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
            if (!e.shiftKey) {
                // Solo dibujar el rectángulo si la tecla Shift no está presionada
                context.fillStyle = fillColor;
                context.fillRect(startX, startY, endX - startX, endY - startY);
            } else {
                // Si la tecla Shift está presionada, actualizar endX y endY y dibujar el rectángulo
                const width = Math.abs(endX - startX);
                const height = Math.abs(endY - startY);
                const side = Math.min(width, height);
                if (endX < startX) {
                    endX = startX - side;
                } else {
                    endX = startX + side;
                }

                if (endY < startY) {
                    endY = startY - side;
                } else {
                    endY = startY + side;
                }
                context.fillStyle = fillColor;
                context.fillRect(startX, startY, endX - startX, endY - startY);
            }
            break;
        case 'circle':
            context.fillStyle = fillColor;
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
    if (isDrawing) {
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
    if (!isDrawing || tool != 'pen') return;

    const canvasRect = canvas.getBoundingClientRect();
    endX = e.clientX - canvasRect.left;
    endY = e.clientY - canvasRect.top;
    // Refactor porque lloran alv
    // context.beginPath();
    // context.moveTo(startX, startY);
    // context.lineTo(endX, endY);
    // context.stroke();
    drawLine(startX, startY, endX, endY)

    // Almacenar el trazo actual en el array de formas
    shapes.push({ tool: 'pen', startX, startY, endX, endY, fillColor, strokeColor, thickness, idforma });

    // Actualizar las coordenadas iniciales para el próximo trazo
    startX = endX;
    startY = endY;
    // idforma +=1;
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
// Event listeners para empezar, dibujar y dejar de dibujar
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawShape);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', drawPen);
document.addEventListener('keydown', doU);
// Cargar el canvas guardado al cargar la página
window.addEventListener('load', loadCanvas);



