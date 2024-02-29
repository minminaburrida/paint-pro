// Obtenemos el canvas y su contexto
const canvas = document.getElementById('paintCanvas');
const context = canvas.getContext('2d');

// Variables para el dibujo
let fileName = document.getElementById('textDisplay').value;
let isDrawing = false;
let startX = 0;
let startY = 0;
let endX = 0; // Se agregó endX y endY
let endY = 0;
let tool = 'pen'; // Puede ser 'pen', 'line', 'rectangle', 'circle'
let thickness = document.getElementById('thickness').value;
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


// Validador de herramientas validas
const invalidTools = ['mouse'];
isValidTool = (t) => !invalidTools.includes(t)

// Función para empezar a dibujar
function startDrawing(e) {
    // Si anda con el mouse, mandela alv mi compa
    if (!isValidTool(tool)) return;
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
    drawShapes();

    switch (tool) {
        case 'pen':
        case 'eraser':
        case 'line':
            drawLine(startX, startY, endX, endY, thickness); break;
        case 'rectangle':
            context.fillStyle = strokeColor;
            if (!e.shiftKey) {
                // Solo dibujar el rectángulo si la tecla Shift no está presionada
                drawRectangle({ startX, startY, endX, endY, thickness, strokeColor, fillColor });
                // drawRectangle(startX, startY, endX, endY, thickness);
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
                //const x1 = s.startX, y1 =  s.startY, x2 =  s.endX, y2 = s.endY, t = s.thickness,
                //stroke = s.strokeColor, fill = s.fillColor
                drawRectangle({ startX, startY, endX: endX - startX, endY: endY - startY, thickness, strokeColor, fillColor });
            }
            break;
        case 'circle':
            // Dibujar círculo
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            drawCircle({ startX, startY, radius, fillColor, thickness, strokeColor });
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
const toolButtons = document.querySelectorAll('#toolsLeft button');
// Función para cambiar la herramienta de dibujo
function setTool(tag, ntool) {
    // Iterar sobre cada botón y establecer su estilo
    toolButtons.forEach(button => {
        button.style.backgroundColor = '#ffffff'; // Establecer todos los botones a blanco
        button.style.color = '#000000'; // Establecer el color de texto de todos los botones a negro
    });

    // Establecer el botón seleccionado a verde
    tag.style.backgroundColor = '#00ff00'; // Fondo verde
    tag.style.color = '#000000'; // Texto negro
    tool = ntool
}

setTool(toolButtons[0], 'pen')
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
function drawShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const shape of shapes) {
        context.strokeStyle = shape.strokeColor;
        context.fillStyle = shape.fillColor;
        context.lineWidth = shape.thickness;

        switch (shape.tool) {
            case 'pen':
            case 'line':
                drawLine(shape.startX, shape.startY, shape.endX, shape.endY, shape.thickness, shape.strokeColor); break;
            case 'eraser':
                drawLine(shape.startX, shape.startY, shape.endX, shape.endY, shape.thickness, erasing = true); break;
            case 'rectangle':
                drawRectangle(shape); break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2));
                shape.radius = radius
                drawCircle(shape)
                break;
            default:
                break;
        }
    }
}

function drawPen(e) {
    if (!isDrawing || (tool !== 'pen' && tool !== 'eraser')) return;

    const canvasRect = canvas.getBoundingClientRect();
    endX = e.clientX - canvasRect.left;
    endY = e.clientY - canvasRect.top;

    context.fillStyle = fillColor;
    drawLine(startX, startY, endX, endY, thickness, color = canvas.fillStyle, erasing = tool == 'eraser');

    // Almacenar el trazo actual en el array de formas
    shapes.push({ tool, startX, startY, endX, endY, fillColor, strokeColor, thickness, idforma });

    // Actualizar las coordenadas iniciales para el próximo trazo
    startX = endX;
    startY = endY;
}


function undo() {
    // Funcion para deshacer kgda
    console.log(idforma - 1);
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
function drawLine(x1, y1, x2, y2, thickness, color = strokeColor, erasing = false,) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    const step = thickness / 2; // Define el paso para el grosor
    context.fillStyle = erasing ? '#fff' : color;

    while (true) {
        for (let i = -step; i <= step; i++) { // Itera para dibujar el grosor
            for (let j = -step; j <= step; j++) {
                drawPixel(x1 + i, y1 + j);
            }
        }

        if (x1 === x2 && y1 === y2) break;
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



// Dibujar Formas:
/*
X1Y1,     X2Y1

X1Y2,     X2Y2
*/
function drawRectangle(s) {
    const x1 = s.startX, y1 = s.startY, x2 = s.endX, y2 = s.endY, t = s.thickness,
        stroke = s.strokeColor, fill = s.fillColor
    context.fillStyle = fill
    for (let i = x1 + 1; i < x2; i++) {
        for (let j = y1 + 1; j < y2; j++) {
            drawPixel(i, j);
        }
    }
    context.fillStyle = stroke
    drawLine(x1, y1, x2, y1, t, stroke);
    drawLine(x1, y1, x1, y2, t, stroke);
    drawLine(x2, y1, x2, y2, t, stroke);
    drawLine(x1, y2, x2, y2, t, stroke);
}


function drawCircle(s) {
    const x0 = s.startX;
    const y0 = s.startY;
    const radius = s.radius;
    const fillColor = s.fillColor;
    const thickness = s.thickness;
    const strokeColor = s.strokeColor;

    // Llena el círculo con el color de relleno
    context.fillStyle = fillColor;
    for (let x = x0 - radius; x <= x0 + radius; x++) {
        for (let y = y0 - radius; y <= y0 + radius; y++) {
            if ((x - x0) * (x - x0) + (y - y0) * (y - y0) <= radius * radius) {
                drawPixel(x, y);
            }
        }
    }

    // Dibuja los bordes del círculo
    context.fillStyle = strokeColor;
    for (let x = x0 - radius; x <= x0 + radius; x++) {
        for (let y = y0 - radius; y <= y0 + radius; y++) {
            if ((x - x0) * (x - x0) + (y - y0) * (y - y0) <= (radius + thickness / 2) * (radius + thickness / 2) &&
                (x - x0) * (x - x0) + (y - y0) * (y - y0) >= (radius - thickness / 2) * (radius - thickness / 2)) {
                drawPixel(x, y);
            }
        }
    }
}







// Exportar a PDF y JPG
// Función para exportar el canvas como PNG
function exportAsPNG() {
    html2canvas(document.getElementById('paintCanvas')).then(canvas => {
        let link = document.createElement('a');
        link.download = 'painting.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Función para exportar el canvas como PDF
function exportAsPDF() {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jspdf.jsPDF(
        // Vertical u horizontal
        canvas.width >= canvas.height ? 'l' : 'p',
        // En pixeles
        'px',
        // Anchura y altura
        [canvas.width, canvas.height]);
    //Agregar img al coso ese
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    // Y guardarlo
    pdf.save(fileName + '.pdf');
}


function convertToInput() {
    const divInput = document.getElementById('divInput');
    const textDisplay = document.getElementById('textDisplay');
    const textInput = document.getElementById('textInput');

    divInput.classList.add('active');
    textInput.value = textDisplay.textContent;
    textInput.focus();
    textInput.addEventListener('blur', saveText);
    textInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            saveText();
        }
    });
}

function saveText() {
    const divInput = document.getElementById('divInput');
    const textDisplay = document.getElementById('textDisplay');
    const textInput = document.getElementById('textInput');

    textDisplay.textContent = textInput.value;
    fileName = textInput.value
    divInput.classList.remove('active');
    textInput.removeEventListener('blur', saveText);
}

function erase() {

}