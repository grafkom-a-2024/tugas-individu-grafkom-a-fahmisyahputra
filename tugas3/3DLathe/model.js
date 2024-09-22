let rotation = 0.0;

main();

function main() {
  const canvasEl = document.querySelector("#model-container");
  const gl =
    canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

  if (!gl) {
    alert("Aktiifkan WebGL di browser Anda.");
    return;
  }

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;

    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

      // Hitung pencahayaan
      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 0.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  const fsSource = `
    varying highp vec3 vLighting;

    void main(void) {
      gl_FragColor = vec4(vLighting, 1.0);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(
        shaderProgram,
        "aVertexPosition"
      ),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(
        shaderProgram,
        "uModelViewMatrix"
      ),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
    },
  };

  const buffersLathe = initBuffersLathe(gl);

  let then = 0;

  function render(now) {
    now *= 0.001; // konversi ke detik

    if (!then) {
      then = now;
    }

    const deltaTime = now - then;
    then = now;

    // clear canvas sebelum menggambar frame
    gl.clearColor(0.5, 0.5, 0.5, 1.0); // warna latar belakang abu-abu
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Gambar objek Lathe
    drawScene(gl, programInfo, buffersLathe, [0.0, -1.0, -8.0]);

    // Update rotasi sekali per frame
    rotation += deltaTime;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function initBuffersLathe(gl) {
  const positions = [];
  const normals = [];
  const indices = [];

  // Profil 2D (x, y) untuk gasing
  const profile = [
    [0.0, -1.0],  // dasar
    [0.2, -0.8],
    [0.3, -0.6],
    [0.4, -0.4],
    [0.5, -0.2],
    [0.6, 0.0],   // tengah
    [0.5, 0.2],
    [0.4, 0.4],
    [0.3, 0.6],
    [0.2, 0.8],
    [0.0, 1.0],   // atas
  ];

  const radialSegments = 64;

  for (let i = 0; i < profile.length; i++) {
    const [x0, y0] = profile[i];
    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * 2 * Math.PI;
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      const x = x0 * cosTheta;
      const y = y0;
      const z = x0 * sinTheta;

      positions.push(x, y, z);

      // Hitung normal vektor
      let nx = x0 * cosTheta;
      let ny = 0;
      let nz = x0 * sinTheta;
      const normal = vec3.normalize([], [nx, ny, nz]);
      normals.push(normal[0], normal[1], normal[2]);
    }
  }

  const vertsPerRow = radialSegments + 1;

  for (let i = 0; i < profile.length - 1; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const current = i * vertsPerRow + j;
      const next = current + vertsPerRow;

      indices.push(current, next, current + 1);
      indices.push(current + 1, next, next + 1);
    }
  }

  // Buffer posisi
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW
  );

  // Buffer normal
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(normals),
    gl.STATIC_DRAW
  );

  // Buffer indeks
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    normal: normalBuffer,
    indices: indexBuffer,
    vertexCount: indices.length,
  };
}

function drawScene(gl, programInfo, buffers, translation) {
  // Matriks proyeksi dan model-view
  const fieldOfView = (45 * Math.PI) / 180; // dalam radian
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Matriks model-view
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, translation);

  // Rotasi di sekitar sumbu Y, X, dan Z
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 1, 0]); // Rotasi sumbu Y
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.7, [1, 0, 0]); // Rotasi sumbu X
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.3, [0, 0, 1]); // Rotasi sumbu Z

  // Matriks normal
  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // Atribut posisi
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Atribut normal
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  }

  // Buffer indeks
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Gunakan program shader
  gl.useProgram(programInfo.program);

  // Set uniform matriks
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  );

  // Gambar objek
  {
    const type = gl.UNSIGNED_SHORT;
    gl.drawElements(gl.TRIANGLES, buffers.vertexCount, type, 0);
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Gagal menginisialisasi program shader: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "Terjadi kesalahan saat mengompilasi shader: " +
        gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
