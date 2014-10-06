
Required = function() {
  var gl;
  var points;
  var colors;
  var r;
  var g;
  var b;
  var primitiveType;
  var imageNumber;
  var program;
  var rotation;

  var numPoints = 5000;
  var numTimesToDivide = 3;
  var programDict = [null, 
                     generateGasket1, 
                     generateGasket2, 
                     generateGasket3,
                     generateGasket4];

  var baseColors = [
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0),
    vec3(0.0, 0.0, 0.0)
  ];
  var rotationAxis = vec3(1.0, 1.0, 1.0);

  var init = function() {

    // Get the canvas.
    var canvas = document.getElementById("required-canvas");

    // Setup the WebGL context.
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
      alert("WebGL not available!!");
    }

    // Setup viewport.
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set clear color to white
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    rotation = 0.0;

    imageNumber = 1;
    programDict[imageNumber]();

    // Bind keystroke events.
    window.addEventListener("keypress", function (e) {
      if (e.keyCode === 113) { // q
        r + 0.05 <= 1.0 ? r += 0.05 : r = 1.0;
      } else if (e.keyCode === 119) { // w
        g + 0.05 <= 1.0 ? g += 0.05 : g = 1.0;
      } else if (e.keyCode === 101) { // e
        b + 0.05 <= 1.0 ? b += 0.05 : b = 1.0;
      } else if (e.keyCode === 81) { // Q
        r - 0.05 >= 0.0 ? r -= 0.05 : r = 0.0;
      } else if (e.keyCode === 87) { // W
        g - 0.05 >= 0.0 ? g -= 0.05 : g = 0.0;
      } else if (e.keyCode === 69) { // E
        b - 0.05 >= 0.0 ? b -= 0.05 : b = 0.0;
      } else if (e.keyCode === 114) { // r
        rotation += 1;
        var rMat = gl.getUniformLocation(program, "rMat");
        gl.uniformMatrix4fv(rMat, false, flatten(rotate(rotation,rotationAxis)));
      } else if (e.keyCode === 100) {
        imageNumber = 1;
        programDict[imageNumber]();
        return;
      } else if (e.keyCode === 102) {
        imageNumber = 2;
        programDict[imageNumber]();
        return;
      } else if (e.keyCode === 103) {
        imageNumber = 3;
        programDict[imageNumber]();
        return;
      } else if (e.keyCode === 104) {
        imageNumber = 4;
        programDict[imageNumber]();
        return;
      }

      // Pass the new uniform and rerender the image.
      var color = gl.getUniformLocation(program, "color");
      gl.uniform4f(color, r, g, b, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(primitiveType, 0, points.length);
    }, false);
  }

  function generateGasket1() {

    // Start dealing with data
    // Set up the first three vertices.
    var vertices = [
      vec2(-0.5, -0.5),
      vec2(0.5, -0.5),
      vec2(0.0, 0.5)
    ];

    // Push the first point.
    var u = mix(vertices[0], vertices[1], 0,5);
    var v = mix(vertices[0], vertices[2], 0.5);
    var p = mix(u, v, 0.5);

    points = [p];

    // Iteration: compute new points using Sieroinski Gasket Algo.
    for (var i = 0; points.length < numPoints; i++) {
      var rPointIndex = Math.floor(Math.random() * 3);
      p = scale(0.5, add(points[i], vertices[rPointIndex]));
      points.push(p);
    }

    // Load shaders.
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Initiate frame buffer.
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Bind js variable to GSLS attribute.
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Extra credit: passing color;
    r = g = b = 0.5;
    var color = gl.getUniformLocation(program, "color");
    gl.uniform4f(color, r, g, b, 1.0);

    var rMat = gl.getUniformLocation(program, "rMat");
    gl.uniformMatrix4fv(rMat, false, flatten(rotate(rotation, rotationAxis)));

    // Render.
    gl.clear(gl.COLOR_BUFFER_BIT);
    primitiveType = gl.POINTS;
    gl.drawArrays(primitiveType, 0, points.length);
  }

  function generateGasket2() {

    var vertices = [
      vec2(-0.5, -0.5),
      vec2(0.5, -0.5),
      vec2(0.0, 0.5)
    ];

    points = [];

    divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToDivide);

    // Load shaders.
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Initiate frame buffer.
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Bind js variable to GSLS attribute.
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Extra credit: passing color;
    r = g = b = 0.5;
    var color = gl.getUniformLocation(program, "color");
    gl.uniform4f(color, r, g, b, 1.0);

    var rMat = gl.getUniformLocation(program, "rMat");
    gl.uniformMatrix4fv(rMat, false, flatten(rotate(rotation, rotationAxis)));

    // Render.
    gl.clear(gl.COLOR_BUFFER_BIT);
    primitiveType = gl.TRIANGLES;
    gl.drawArrays(primitiveType, 0, points.length);
  }

  function generateGasket3() {

    // Setup initial vertices
    var vertices = [
      vec3(-0.5, -0.5, -0.5),
      vec3(0.5, -0.5, -0.5),
      vec3(0.0, 0.5, 0.0),
      vec3(0.0, -0.5, 0.5)
    ];

    // p is a point inside the tetrahedron.
    var p = vec3(0.0, 0.0, 0.0);

    points = [p];

    for (var i = 0; i < numPoints; i++) {
      p = mix(vertices[Math.floor(Math.random() * 4)], 
              points[i],
              0.5);
      points.push(p);
    }

    // Load shaders.
    program = initShaders(gl, "vertex-shader-3d", "fragment-shader-3d");
    gl.useProgram(program);

    // Initiate buffers.
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Bind js variable to GSLS attribute.
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var rMat = gl.getUniformLocation(program, "rMat");
    gl.uniformMatrix4fv(rMat, false, flatten(rotate(rotation, rotationAxis)));

    // Render.
    gl.clear(gl.COLOR_BUFFER_BIT);
    primitiveType = gl.POINTS;
    gl.drawArrays(primitiveType, 0, points.length);
  }

  function generateGasket4() {

    var vertices = [
        vec3(  0.0000,  0.0000, -1.0000 ),
        vec3(  0.0000,  0.9428,  0.3333 ),
        vec3( -0.8165, -0.4714,  0.3333 ),
        vec3(  0.8165, -0.4714,  0.3333 )
    ];

    points = [];
    colors = [];

    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], numTimesToDivide);

    gl.enable(gl.DEPTH_TEST);

    // Load shaders.
    program = initShaders(gl, "vertex-shader-3d", "fragment-shader-3d");
    gl.useProgram(program);

    // Initiate buffers.
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var rMat = gl.getUniformLocation(program, "rMat");
    gl.uniformMatrix4fv(rMat, false, flatten(rotate(rotation, rotationAxis)));

    // Render.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    primitiveType = gl.TRIANGLES;
    gl.drawArrays(primitiveType, 0, points.length);
  }

  function triangle(a, b, c, color) {
    if (color != undefined) {
      colors.push(baseColors[color]);
    }
    points.push(a);
    if (color != undefined) {
      colors.push(baseColors[color]);
    }
    points.push(b);
    if (color != undefined) {
      colors.push(baseColors[color]);
    }
    points.push(c);
  }

  function tetra(a, b, c, d) {
    triangle(a, b, c, 0);
    triangle(a, b, d, 2);
    triangle(a, c, d, 1);
    triangle(b, c, d, 3);
  }

  function divideTriangle(a, b, c, count) {
    if (count == 0) {
      triangle(a, b, c);
    } else {
      var ab = mix(a, b, 0.5);
      var bc = mix(b, c, 0.5);
      var ca = mix(c, a, 0.5);

      count--;

      divideTriangle(a, ab, ca, count);
      divideTriangle(b, bc, ab, count);
      divideTriangle(c, ca, bc, count);

    }
  }

  function divideTetra(a, b, c, d, count) {
    if (count == 0) {
      tetra(a, b, c, d);
    } else {
      var ab = mix(a, b, 0.5);
      var ac = mix(a, c, 0.5);
      var ad = mix(a, d, 0.5);
      var bc = mix(b, c, 0.5);
      var bd = mix(b, d, 0.5);
      var cd = mix(c, d, 0.5);

      count--;

      divideTetra(a, ab, ac, ad, count);
      divideTetra(ab, b, bc, bd, count);
      divideTetra(ac, bc, c, cd, count);
      divideTetra(ad, bd, cd, d, count);
    }
  }

  return {
    init: init,
    numPoints: numPoints
  };
}();