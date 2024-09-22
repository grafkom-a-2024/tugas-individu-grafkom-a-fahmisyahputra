let cubeRotation = 0.0;

main();

function main() {
  const canvasEl = document.querySelector("#model-container");

  const wgl =
    canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

  if (!wgl) {
    alert("WebGL tidak dapat diinisialisasi di browser Anda.");
    return;
  }

  // Vertex shader
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      // Transform the normal to eye space
      highp vec3 transformedNormal = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 0.0)));

      // Directional light
      highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp float directional = max(dot(transformedNormal, directionalVector), 0.0);
      vLighting = 0.3 * directionalLightColor + directionalLightColor * directional;
    }
  `;

  // Fragment shader
  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;

  const shaderProgram = initShaderProgram(wgl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: wgl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexNormal: wgl.getAttribLocation(shaderProgram, "aVertexNormal"),
      textureCoord: wgl.getAttribLocation(shaderProgram, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: wgl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: wgl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      normalMatrix: wgl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      uSampler: wgl.getUniformLocation(shaderProgram, "uSampler"),
    },
  };

  const buffers = initBuffers(wgl);

  const texture = loadTexture(wgl, "texture.jpg");

  let then = 0;

  function render(now) {
    now *= 0.001; // konversi ke detik
    const deltaTime = now - then;
    then = now;

    drawScene(wgl, programInfo, buffers, texture, deltaTime);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function initBuffers(wgl) {
  // Buffer posisi
  const positionBuffer = wgl.createBuffer();
  wgl.bindBuffer(wgl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // sisi depan
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // sisi belakang
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // atas
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // bawah
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // kanan
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // kiri
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  wgl.bufferData(
    wgl.ARRAY_BUFFER,
    new Float32Array(positions),
    wgl.STATIC_DRAW
  );

  // Buffer normal
  const normalBuffer = wgl.createBuffer();
  wgl.bindBuffer(wgl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // depan
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // belakang
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // atas
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // bawah
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // kanan
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // kiri
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
  ];

  wgl.bufferData(
    wgl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    wgl.STATIC_DRAW
  );

  // Buffer koordinat tekstur
  const textureCoordBuffer = wgl.createBuffer();
  wgl.bindBuffer(wgl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // depan
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // belakang
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // atas
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // bawah
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // kanan
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // kiri
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  wgl.bufferData(
    wgl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    wgl.STATIC_DRAW
  );

  // Indeks elemen
  const indexBuffer = wgl.createBuffer();
  wgl.bindBuffer(wgl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
     0,  1,  2,      0,  2,  3,    // depan
     4,  5,  6,      4,  6,  7,    // belakang
     8,  9, 10,      8, 10, 11,    // atas
    12, 13, 14,     12, 14, 15,    // bawah
    16, 17, 18,     16, 18, 19,    // kanan
    20, 21, 22,     20, 22, 23,    // kiri
  ];

  wgl.bufferData(
    wgl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    wgl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

function loadTexture(wgl, url) {
  const texture = wgl.createTexture();
  wgl.bindTexture(wgl.TEXTURE_2D, texture);

  // Isi tekstur dengan piksel sementara
  const level = 0;
  const internalFormat = wgl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = wgl.RGBA;
  const srcType = wgl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([255, 255, 255, 255]); // warna putih sementara
  wgl.texImage2D(
    wgl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // load gambar secara asinkron
  const image = new Image();
  image.onload = function () {
    wgl.bindTexture(wgl.TEXTURE_2D, texture);
    wgl.texImage2D(
      wgl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      wgl.generateMipmap(wgl.TEXTURE_2D);
    } else {
      wgl.texParameteri(wgl.TEXTURE_2D, wgl.TEXTURE_WRAP_S, wgl.CLAMP_TO_EDGE);
      wgl.texParameteri(wgl.TEXTURE_2D, wgl.TEXTURE_WRAP_T, wgl.CLAMP_TO_EDGE);
      wgl.texParameteri(wgl.TEXTURE_2D, wgl.TEXTURE_MIN_FILTER, wgl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function drawScene(wgl, programInfo, buffers, texture, deltaTime) {
  wgl.clearColor(0.5, 0.5, 0.5, 1.0); // warna latar belakang abu-abu
  wgl.clearDepth(1.0);
  wgl.enable(wgl.DEPTH_TEST);
  wgl.depthFunc(wgl.LEQUAL);

  wgl.clear(wgl.COLOR_BUFFER_BIT | wgl.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180; // dalam radian
  const aspect = wgl.canvas.clientWidth / wgl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  // Pindahkan kubus sedikit ke belakang
  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    [-0.0, 0.0, -6.0]
  );

  // Rotasi kubus
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    cubeRotation,
    [0, 0, 1]
  ); // Rotasi di sumbu Z
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    cubeRotation * 0.7,
    [0, 1, 0]
  ); // Rotasi di sumbu Y

  // Hitung matriks normal
  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // Atur atribut posisi
  {
    const numComponents = 3;
    const type = wgl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    wgl.bindBuffer(wgl.ARRAY_BUFFER, buffers.position);
    wgl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    wgl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // atribut normal
  {
    const numComponents = 3;
    const type = wgl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    wgl.bindBuffer(wgl.ARRAY_BUFFER, buffers.normal);
    wgl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    wgl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  }

  // atribut koordinat tekstur
  {
    const numComponents = 2;
    const type = wgl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    wgl.bindBuffer(wgl.ARRAY_BUFFER, buffers.textureCoord);
    wgl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    wgl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }

  // bind buffer indeks elemen
  wgl.bindBuffer(wgl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // program shader
  wgl.useProgram(programInfo.program);

  // uniform matriks proyeksi dan model-view
  wgl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  wgl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );
  wgl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  );

  // sampler tekstur
  wgl.activeTexture(wgl.TEXTURE0);
  wgl.bindTexture(wgl.TEXTURE_2D, texture);
  wgl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  {
    const vertexCount = 36;
    const type = wgl.UNSIGNED_SHORT;
    const offset = 0;
    wgl.drawElements(wgl.TRIANGLES, vertexCount, type, offset);
  }

  cubeRotation += deltaTime;
}

function initShaderProgram(wgl, vsSource, fsSource) {
  const vertexShader = loadShader(wgl, wgl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(wgl, wgl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = wgl.createProgram();

  wgl.attachShader(shaderProgram, vertexShader);
  wgl.attachShader(shaderProgram, fragmentShader);
  wgl.linkProgram(shaderProgram);

  if (!wgl.getProgramParameter(shaderProgram, wgl.LINK_STATUS)) {
    alert(
      "Gagal menginisialisasi shader program: " +
        wgl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(wgl, type, source) {
  const shader = wgl.createShader(type);

  wgl.shaderSource(shader, source);

  wgl.compileShader(shader);

  if (!wgl.getShaderParameter(shader, wgl.COMPILE_STATUS)) {
    alert(
      "Terjadi kesalahan saat mengompilasi shader: " +
        wgl.getShaderInfoLog(shader)
    );
    wgl.deleteShader(shader);
    return null;
  }

  return shader;
}
