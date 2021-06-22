//file for testing the shadow map

function test_run() {
    //calculate global light direction since every shader use the same
    let omega_light = document.getElementById("omega_light").value * Math.PI/180;
    let fi_light = document.getElementById("fi_light").value * Math.PI/180;
    let light_x = Math.sin(omega_light) * Math.sin(fi_light);
    let light_y = Math.cos(omega_light);
    let light_z = -Math.sin(omega_light) * Math.cos(fi_light);
    lightDirection = vec3.fromValues(light_x, light_y, light_z);

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    test_draw_shadow();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    test_draw();
    window.requestAnimationFrame(function() {test_run();});
}

function test_draw_geometry (program) {
    let modelMatrixLocation = gl.getUniformLocation(program, "modelMatrix");
    let tr_m = mat4.create();

    gl.bindVertexArray(terrain_vao)
    mat4.identity(tr_m);
    mat4.fromTranslation(tr_m, vec3.fromValues(0,-1,0));

    gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
    gl.drawArrays(gl.TRIANGLES, 0, terrain_vertices.length/3);

    gl.bindVertexArray(cube_vao)
    mat4.fromTranslation(tr_m,vec3.fromValues(1,0,0) )
    gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
    gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);

    mat4.fromTranslation(tr_m,vec3.fromValues(-1,0,0) )
    gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
    gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);

    gl.bindVertexArray(sphere_vao)
    let sc = mat4.create()
    vec3.scale(sc,lightDirection,3)
    mat4.fromTranslation(tr_m, sc)
    gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
    gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length/3);
}

function test_draw_shadow() {
    gl.viewport(0, 0, 2048, 2048);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shadowProgram);

    
    let scaled_light_direction = vec3.create();
    vec3.scale(scaled_light_direction,lightDirection,5)
    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, scaled_light_direction, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))

    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -7.5, 7.5, -7.5, 7.5, 0.1, 10);

   
    let projectionMatrixLocation = gl.getUniformLocation(shadowProgram, "projectionMatrix");
    let viewMatrixLocation = gl.getUniformLocation(shadowProgram, "viewMatrix");

    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    test_draw_geometry(shadowProgram);

    lightViewMatrix = mat4.clone(viewMatrix)
    lightProjectionMatrix = mat4.clone(projectionMatrix);
}

function test_draw() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clearColor(0.8, 0.8, 0.8, 1.0);//background color

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let projectionMatrix = mat4.create();// the projection matrix
    // 90 degree angle opening in radiant for now is constant
    mat4.perspective(projectionMatrix, (90 * Math.PI / 180), 1.0, 0.1, 10);

    let camera_selector = parseInt(document.getElementById("camera_selector").value);

    let viewMatrix = mat4.create();
    let copy_view_matrix = mat4.create();//copy for testing

    //the array call the function to make the view matrix based on the selection input
    camera_selection_arr[camera_selector](viewMatrix,copy_view_matrix);

    //test delete later TODO
    // let scaled_light_direction = vec3.create();
    // vec3.scale(scaled_light_direction,lightDirection,5)
    // mat4.lookAt(viewMatrix, scaled_light_direction, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))
    // mat4.ortho(projectionMatrix, -7.5, 7.5, -7.5, 7.5, 0.1, 100);

    gl.useProgram(euclideanProgram);
    let viewMatrixLocation = gl.getUniformLocation(euclideanProgram, "viewMatrix");
    let projectionMatrixLocation = gl.getUniformLocation(euclideanProgram, "projectionMatrix");
    let lightDirectionLocation = gl.getUniformLocation(euclideanProgram,"lightDirection");
    let lightProjectionMatrixLocation = gl.getUniformLocation(euclideanProgram, "lightProjectionMatrix");
    let lightViewMatrixLocation = gl.getUniformLocation(euclideanProgram, "lightViewMatrix");
    let shadowMapLocation = gl.getUniformLocation(euclideanProgram, "shadowMap");

    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniform3fv(lightDirectionLocation, lightDirection);
    gl.uniformMatrix4fv(lightProjectionMatrixLocation, false, lightProjectionMatrix);
    gl.uniformMatrix4fv(lightViewMatrixLocation, false, lightViewMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
    gl.uniform1i(shadowMapLocation, 0);

    test_draw_geometry(euclideanProgram);

}