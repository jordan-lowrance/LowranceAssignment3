//author: Jordan Lowrance
//date: 3/1/21
//description: provide a brief description of your program
//proposed points (8 out of 10): Finished everything except for the second shader, pressing A will turn it counter-clockwise and pressing D will turn it clockwise.
"use strict";

var canvas;
var gl;

var theta = 0;
var thetaLoc;
var animSpeed = .01;
var stop = false;
var clockwise = false;
var colorRed = [
        vec3(1,0,0),
        vec3(1,0,0),
        vec3(1,0,0),
    ];
var colorPurple = [
        vec3(1,0,1),
        vec3(1,0,1),
        vec3(1,0,1),
    ];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vertices = [
        vec2(0, .5),
        vec2(0, 0),
        vec2(.5, 0),
    ];

    var colors = [
        vec3(1,0,1),
        vec3(.5,0,.5),
        vec3(1,0,0),
    ];
    
        // Initialize event handler (menu), manages start and stop animation buttons
    document.getElementById("Direction" ).onclick = function(event) {
    	if (clockwise == false) {
    	clockwise = true;}
    	else{
    	clockwise = false;}
    }
        
    document.getElementById("Controls" ).onclick = function(event) {
        switch( event.target.index ) {
          case 0:
            console.debug("Start")
            stop = false;
            break;
         case 1:
            console.debug("Stop")
            stop = true;
            break;
       }
    }
    

    
    // sliders for changing rotation speed
    document.getElementById("animSpeed").onchange = function(event) {
        animSpeed = parseFloat (event.target.value);
    };


    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    let colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "utheta");
    
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'd':
          case 'D':
            clockwise = true;
            break;
          case 'a':
          case 'A':
            clockwise = false;
            break;
        }
    };
    
    render();
};


function render() {
	//sets a static angle for the rotation on stop command
    if (stop != true){
    	if (clockwise == true){
    		theta -= animSpeed;
    	}
    	else
    		theta += animSpeed;
    }
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    requestAnimationFrame(render);
}
