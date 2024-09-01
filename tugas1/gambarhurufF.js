// Get the canvas element and create a WebGL context
var canvas = document.getElementById("webgl-canvas");
var gl = canvas.getContext("webgl");

// Vertex shader program
var vertCode = `
    attribute vec4 coordinates;
    void main(void) {
        gl_Position = coordinates;
    }`;

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

// Fragment shader program
var fragCode = `
    void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color
    }`;

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragment shader
gl.compileShader(fragShader);

// Create a shader program object to store the combined shader program
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both programs
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

// Vertices to draw the letter "F" with more accurate proportions
var vertices = [
    // Garis Vertical F
    -0.5,  0.8, 0.0, //titik kiri atas batang vertikal
    -0.3,  0.8, 0.0, //titik kanan atas batang vertikal
    -0.5, -0.8, 0.0, //titik kiri bawah batang vertikal
    -0.3, -0.8, 0.0, //titik kanan bawah batang vertikal

    // Garis Horizontal F bagian atas
    -0.3,  0.8, 0.0, //titik kiri atas garis horizontal atas (bertemu dengan batang vertikal)
     0.5,  0.8, 0.0, //titik kanan atas garis horizontal atas
    -0.3,  0.6, 0.0, //titik kiri bawah garis horizontal atas
     0.5,  0.6, 0.0, //titik kanan bawah garis horizontal atas

    // Garis Horizontal F bagian bawah (lebih pendek)
    -0.3,  0.2, 0.0, //titik kiri atas garis horizontal tengah
     0.3,  0.2, 0.0, //titik kanan atas garis horizontal tengah
    -0.3,  0.0, 0.0, //titik kiri bawah garis horizontal tengah
     0.3,  0.0, 0.0  //titik kanan bawah garis horizontal tengah
];

// Create a new buffer object
var vertex_buffer = gl.createBuffer();

// Bind an empty array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertices data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Get the attribute location, enable it
var coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

// Clear the canvas
gl.clearColor(0.5, 0.5, 0.5, 0.9);

// Enable the depth test
gl.enable(gl.DEPTH_TEST);

// Clear the color and depth buffer
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Draw the letter F using triangles
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Vertical bar of F
gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4); // Top horizontal bar of F
gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4); // Middle horizontal bar of F
