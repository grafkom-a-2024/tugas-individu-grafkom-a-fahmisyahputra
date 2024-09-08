var canvas = document.getElementById("webgl-canvas");
var gl = canvas.getContext("webgl");

// vertex shader
var vertCode = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    uniform mat3 u_matrix;
    void main() {
        //matrix transformation
        vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;
        
        //convert pixels to clipspace
        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

// fragment shader
var fragCode = `
    void main() {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
`;

// create vertex and fragment shaders
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile failed with: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

var vertShader = createShader(gl, gl.VERTEX_SHADER, vertCode);
var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragCode);

// create shader program
function createProgram(gl, vertShader, fragShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program failed to link: " + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

var shaderProgram = createProgram(gl, vertShader, fragShader);
gl.useProgram(shaderProgram);

// vertices untuk object "L"
var vertices = [
  // garis vertikal L
  0, 0,   //kiri atas
  20, 0,  //kanan atas
  0, 200, //bawah kiri
  20, 200, //bawah kanan

  // garis horizontal L
  0, 180,  // kiri bawah
  100, 180, //kanan bawah
  0, 200,  //bawah kiri
  100, 200 //bawah kanan
];

// buat buffer
var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// associate shaders to buffer
var coord = gl.getAttribLocation(shaderProgram, "a_position");
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

// set up resolution uniform
var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

function translationMatrix(tx, ty) {
    return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1
    ];
}
function rotationMatrix(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    ];
}
function scaleMatrix(sx, sy) {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
    ];
}
// fungsi untuk multiply dua 3x3 matrices
function multiplyMatrices(a, b) {
    var result = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            result[i * 3 + j] = 0;
            for (var k = 0; k < 3; k++) {
                result[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
            }
        }
    }
    return result;
}
// matrix uniform location
var matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

// inisialisasi 
var translation = [150, 100]; 
var angleInRadians = 0; 
var scale = [1, 1]; 
var centerX = 110; 
var centerY = 100; 

// slider
var xSlider = document.getElementById("x");
var ySlider = document.getElementById("y");
var scaleXSlider = document.getElementById("scaleX"); 
var scaleYSlider = document.getElementById("scaleY"); 
var angleSlider = document.getElementById("angle");

// default value slider
xSlider.value = 100;
ySlider.value = 100; 
scaleXSlider.value = 1;
scaleYSlider.value = 1;
angleSlider.value = 0;

// event listener sliders
xSlider.addEventListener("input", drawScene);
ySlider.addEventListener("input", drawScene);
scaleXSlider.addEventListener("input", drawScene);
scaleYSlider.addEventListener("input", drawScene);
angleSlider.addEventListener("input", drawScene);

function drawScene() {
    // value from sliders
    translation[0] = parseFloat(xSlider.value);
    translation[1] = parseFloat(ySlider.value);
    scale[0] = parseFloat(scaleXSlider.value); 
    scale[1] = parseFloat(scaleYSlider.value);  
    angleInRadians = (parseFloat(angleSlider.value) * Math.PI) / 180; 

    var matrix = translationMatrix(translation[0], translation[1]);

    // translate to origin of rotation
    matrix = multiplyMatrices(matrix, translationMatrix(-centerX, -centerY));
    // rotation
    matrix = multiplyMatrices(matrix, rotationMatrix(angleInRadians));
    // scale 
    matrix = multiplyMatrices(matrix, scaleMatrix(scale[0], scale[1]));
    // translate back to the original position
    matrix = multiplyMatrices(matrix, translationMatrix(centerX, centerY));
    // send transformation matrix to shader
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 8);
}
drawScene();
