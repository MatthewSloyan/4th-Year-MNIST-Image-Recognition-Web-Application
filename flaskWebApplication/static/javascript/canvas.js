// Get an instance of the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Code mouse drawing is adapted from: https://www.html5canvastutorials.com/labs/html5-canvas-paint-application/

// Initialize the mouse position to 0.
var mouse = {x: 0, y: 0};

// Set up drawing parameters
ctx.lineWidth = 2;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#ff0000';

// Listener which is called when mouse movement is detected.
canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
}, false);

// Listener which is called when mouse button is held down.
canvas.addEventListener('mousedown', function(e) {
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);

  // Call mouse movement listener which will draw a line between each new mouse position.
  canvas.addEventListener('mousemove', onPaint, false);
}, false);

// Listener which is called when mouse button is released.
// Stops drawing by passing false to mousemove.
canvas.addEventListener('mouseup', function() {
  canvas.removeEventListener('mousemove', onPaint, false);
}, false);

// Function to draw line from previous mouse position to new position.
var onPaint = function() {
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
};

// Called when Predict button is clicked.
function predictImage() {
  // To convert the canvas to an image I found a built in method which converts it to base64 binary, 
  // which will allow me to send the image to the flask server using AJAX
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
  var dataURL = canvas.toDataURL();
  var obj = {'data': dataURL};

  // console.log(dataURL); Test printing to console

  // I wanted to create an asynchronous request to the server and from research I found that using 
  // an xhttp AJAX request would work well. This will send the image and return the result when ready.
  // Code adapted from: https://www.w3schools.com/xml/ajax_xmlhttprequest_send.asp

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("result").innerHTML = this.responseText;
    }
  };

  // Open request and sent base64 string, then wait for response above.
  xhttp.open("POST", "/predictImage", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(obj));
}

// To clear the canvas I research and found a simple way to do it using the clearRect function.
// Code adapted from: https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("result").innerHTML = "";
}

// Swap between drawing mode and eraser mode.
// E.g swaps the colour to white or red.
function eraseDraw() {
  if (ctx.strokeStyle == '#ff0000'){
    ctx.strokeStyle = '#ffffff';
    document.getElementById("mode").innerHTML = "Mode: Erase";
  }
  else {
    ctx.strokeStyle = '#ff0000';
    document.getElementById("mode").innerHTML = "Mode: Draw";
  }
}

// Set the size of the pen using the value from the slider.
function setSize() {
  ctx.lineWidth = document.getElementById("size").value;;
}