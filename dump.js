//some code that I used for testing DELETE at the end


let point1 = vec4.fromValues(-0.5, 0.5, 0,1);//point for a triangle

            let point2 = vec4.fromValues(-0.5, -0.5, 0.0,1);//point for a triangle

            let point3 = vec4.fromValues(0.0, 0.0, 0.0,1);//point for a triangle

            const normal_vector = vec4.fromValues(0,0,1,0);//normal for a triangle

            let new_point1 = vec4.create()//points in the new position
            let new_point2 = vec4.create()
            let new_point3 = vec4.create()

            vec4.transformMat4(new_point1, point1, m_matrix)
            vec4.transformMat4(new_point2, point2, m_matrix)
            vec4.transformMat4(new_point3, point3, m_matrix)

            console.log("new point 1")
            console.log(new_point1)
            console.log("new point 2")
            console.log(new_point2)
            console.log("new point 3")
            console.log(new_point3)

            let true_new_point1 = vec3.fromValues(new_point1[0]/new_point1[3],
                                                  new_point1[1]/new_point1[3],
                                                  new_point1[2]/new_point1[3]);
            let true_new_point2 = vec3.fromValues(new_point2[0]/new_point2[3],
                                                  new_point2[1]/new_point2[3],
                                                  new_point2[2]/new_point2[3]);
            let true_new_point3 = vec3.fromValues(new_point3[0]/new_point3[3],
                                                  new_point3[1]/new_point3[3],
                                                  new_point3[2]/new_point3[3]);

            console.log("true new point 1")
            console.log(true_new_point1)
            console.log("true new point 2")
            console.log(true_new_point2)
            console.log("true new point 3")
            console.log(true_new_point3)

            let vector1 = vec3.create();
            let vector2 = vec3.create();

            vec3.subtract(vector1, true_new_point3, true_new_point1)
            vec3.subtract(vector2, true_new_point2, true_new_point1);
            console.log("vector 1")
            console.log(vector1)

            console.log("vector 2")
            console.log(vector2)

            let cross_p = vec3.create()
            vec3.cross(cross_p,
                        vector2, vector1)

            console.log("cross product")
            vec3.normalize(cross_p,cross_p);
            console.log(cross_p);
            console.log(`length: ${vec3.length(cross_p)}`)

            let new_normal = vec4.create();

            let inv_m_matrix = mat4.create();

            mat4.invert(inv_m_matrix, m_matrix)
            mat4.transpose(inv_m_matrix, m_matrix)
            vec4.transformMat4(new_normal, normal_vector, inv_m_matrix);
            console.log("new normal")
            console.log(new_normal)

            let true_new_normal = vec4.create();
            vec4.normalize(true_new_normal, new_normal);
            
            // if (new_normal[3] == 0) {
            //     true_new_normal = new_normal;
            // } else {
            //     true_new_normal = vec3.fromValues(new_normal[0]/new_normal[3],
            //                                     new_normal[1]/new_normal[3],
            //                                     new_normal[2]/new_normal[3]);
            //}
            

            console.log("true new normal")
            //vec3.normalize(true_new_normal,true_new_normal);
            console.log(true_new_normal)
            console.log(`length: ${vec4.length(true_new_normal)}`)



            //original function draw
            function draw() {
                let projectionMatrix = mat4.create();// the projection matrix
                // 90 degree angle opening in radiant for now is constant
                mat4.perspective(projectionMatrix, (90 * Math.PI / 180), aspect, 0.1, 100);
    
                let camera_selector = parseInt(document.getElementById("camera_selector").value);
    
                let viewMatrix = mat4.create();
                let copy_view_matrix = mat4.create();//copy for testing
            
                //the array call the function to make the view matrix based on the selection input
                camera_selection_arr[camera_selector](viewMatrix,copy_view_matrix);
    
                //light position and direction
                let omega_light = document.getElementById("omega_light").value * Math.PI/180;
                let fi_light = document.getElementById("fi_light").value * Math.PI/180;
                let light_x = Math.sin(omega_light) * Math.sin(fi_light);
                let light_y = Math.cos(omega_light);
                let light_z = -Math.sin(omega_light) * Math.cos(fi_light);
                lightDirection = vec3.fromValues(light_x, light_y, light_z);
    
                gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    
                gl.clearColor(0.8, 0.8, 0.8, 1.0);//background color
                gl.clear(gl.COLOR_BUFFER_BIT);
    
                gl.enable(gl.CULL_FACE);
                gl.enable(gl.DEPTH_TEST);
    
                gl.useProgram(shaderProgram);
                let modelMatrixLocation = gl.getUniformLocation(shaderProgram, "modelMatrix");
                let viewMatrixLocation = gl.getUniformLocation(shaderProgram, "viewMatrix");
                let projectionMatrixLocation = gl.getUniformLocation(shaderProgram, "projectionMatrix");
                let lightDirectionLocation = gl.getUniformLocation(shaderProgram,"lightDirection");
    
                gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
                gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
                gl.uniform3fv(lightDirectionLocation, lightDirection);
    
    
                 //model matrix
                let modelMatrix = hyp_rotation_y(rotation_point, current_rotation * Math.PI/180);
            
                if (current_rotation >= 360) {
                    current_rotation = 0;
                } else {
                    current_rotation = current_rotation + 1;
                }
    
                //draw the cube
                gl.bindVertexArray(cube_vao);
    
                //rotating cube
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
    
    
                //draw some static cubes
                mat4.identity(modelMatrix);
    
                mat4.fromTranslation(modelMatrix,vec3.fromValues(0,0,1))
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
    
                mat4.identity(modelMatrix);
    
                mat4.multiply(modelMatrix,lorentz_translation_x(1),lorentz_translation_y(1));
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
    
                mat4.identity(modelMatrix);
                mat4.multiply(modelMatrix,lorentz_translation_x(1),lorentz_translation_z(1));
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
    
    
                modelMatrix = hyp_translation(vec4.fromValues(0, 0, 0, 1), vec4.fromValues(0.3, 0.2, 0.9, 1));
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
    
    
                //-----------moving cube
                let tmp = parseInt(document.getElementById("obj_position").value)/100;
                modelMatrix = lorentz_translation_z(tmp);
                //mat4.multiply(modelMatrix, modelMatrix, lorentz_translation_x(tmp));
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
                
                modelMatrix = lorentz_translation_x(tmp);
                mat4.multiply(modelMatrix, modelMatrix, lorentz_translation_z(tmp));
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
                //-----------
    
                //draw a sphere in the hyperbolic space
                mat4.identity(modelMatrix);
                mat4.fromScaling(modelMatrix,vec3.fromValues(0.2,0.2,0.2));
                mat4.multiply(modelMatrix, hyp_translation(vec4.fromValues(0,0,0,1),vec4.fromValues(-0.6,0,-0.3,1)), modelMatrix);
                gl.bindVertexArray(sphere_vao)
                gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length/3);
    
    
                //draw the disc
                gl.bindVertexArray(disc_vao);
                let identity = mat4.create();
                gl.uniformMatrix4fv(modelMatrixLocation, false, identity);
                gl.drawArrays(gl.TRIANGLES, 0, disc_vertices.length/3);
    
                //Drawing some ogbject outside the hyperbolic space
                gl.useProgram(euclideanProgram);
                modelMatrixLocation = gl.getUniformLocation(euclideanProgram, "modelMatrix");
                viewMatrixLocation = gl.getUniformLocation(euclideanProgram, "viewMatrix");
                projectionMatrixLocation = gl.getUniformLocation(euclideanProgram, "projectionMatrix");
                lightDirectionLocation = gl.getUniformLocation(euclideanProgram,"lightDirection");
    
                gl.uniformMatrix4fv(viewMatrixLocation, false, copy_view_matrix);
                gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
                gl.uniform3fv(lightDirectionLocation, lightDirection);
    
    
                gl.bindVertexArray(cube_vao);
                let tr_m = mat4.create();
                mat4.fromTranslation(tr_m, vec3.fromValues(2,0,0));
                gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
                gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);
    
    
                //sphere for testing coordinate system
                let tmp_x = parseInt(document.getElementById("x_position").value);
                let tmp_y = parseInt(document.getElementById("y_position").value);
                let tmp_z = parseInt(document.getElementById("z_position").value)
    
                gl.bindVertexArray(sphere_vao);
                mat4.fromTranslation(tr_m, vec3.fromValues(-2,0,0));
               
                gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
                gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length/3);
    
                //==========for counting fps
                // var now = new Date().getTime();
                // frameCount++;
                // elapsedTime += (now - lastTime);
    
                // lastTime = now;
    
                // if(elapsedTime >= 1000) {
                //     fps = frameCount;
                //     frameCount = 0;
                //     elapsedTime -= 1000;
                // document.getElementById('fps').innerHTML = fps;
                // }
                //============================
                window.requestAnimationFrame(function() {draw();});
            }


    // function drawEuclideanGeometry(program) {
        //     let modelMatrixLocation = gl.getUniformLocation(program, "modelMatrix");
        //     gl.bindVertexArray(cube_vao);
        //     let tr_m = mat4.create();
        //     mat4.fromTranslation(tr_m, vec3.fromValues(2,0,0));
        //     gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
        //     gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);

        //     gl.bindVertexArray(sphere_vao);
        //     mat4.fromTranslation(tr_m, vec3.fromValues(-2,0,0));
           
        //     gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
        //     gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length/3);

        //     gl.bindVertexArray(disc_vao)
        //     mat4.identity(tr_m);
        //     mat4.fromTranslation(tr_m, vec3.fromValues(0,-0.5,0));
        //     let sc = mat4.create()
        //     mat4.fromScaling(sc, vec3.fromValues(4,4,4) )
        //     mat4.multiply(tr_m, tr_m, sc);

        //     gl.uniformMatrix4fv(modelMatrixLocation, false, tr_m);
        //     gl.drawArrays(gl.TRIANGLES, 0, disc_vertices.length/3);
        // }