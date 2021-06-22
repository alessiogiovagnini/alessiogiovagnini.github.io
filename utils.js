// initialize webgl canvas
function initWebGL(){
    var canvas = document.getElementById("webgl-canvas");

    gl = canvas.getContext("webgl2");

    const ext = gl.getExtension("EXT_color_buffer_float");
    if (!ext) {
        alert("need EXT_color_buffer_float");
        return;
      }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    if(gl){
        console.log("initialization successfull");
    } else {
        console.log("failed to initialize!");
    }
}

function compileShader(shader, source, type, name=""){
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(name + " shader compiled successfully");
    } else {
        console.log(name + " error in compiling shader");
        console.log(gl.getShaderInfoLog(shader));
    }
}

function linkProgram(program, vShader, fShader) {
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);

    if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("shaders initialized");
    } else {
        console.log("fail to initialized shaders");
    }
}