var vertexShader = 
`#version 300 es
    layout(location=0) in vec3 a_position;
    layout(location=1) in vec3 a_color;
    layout(location=2) in vec3 a_normal;

    out vec3 v_color;
    out vec3 v_normal;
    out vec3 v_lightDirection;
    out vec3 v_viewDirection;

    out vec3 shadowVertex;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    //for shadow computation
    uniform mat4 lightViewMatrix;
    uniform mat4 lightProjectionMatrix;

    uniform vec3 lightDirection;

    void main(){
        // //mat4(mat3(m))
        //mat4 it_modelMatrix = transpose(inverse(modelMatrix));
        //mat4 it_viewMatrix = transpose(inverse(viewMatrix));//it do not seem to work
        v_color = a_color;
        
        //!!NOTE!!: transpose(inverse(viewMatrix * modelMatrix)) * vec4(a_normal, 0.0); seem to still work in third person.
        //NOTE_2!!: it_viewMatrix * it_modelMatrix * vec4(a_normal, 0.0); also seem to work in third person.
        //NOTE_3!! it seem that normalizing the vec4 before removing the 4th element make the lighting works in first and third person
        vec4 tmp_normal = viewMatrix * modelMatrix * vec4(a_normal, 0.0);
        
        v_normal = vec3(normalize(tmp_normal));

        vec4 tmp_ld = viewMatrix * vec4(lightDirection, 0.0); //tmp_light_direction
        
        v_lightDirection = vec3(normalize(tmp_ld));
        
        vec4 tmp_view = viewMatrix * modelMatrix * vec4(a_position, 1.0);// ?? should I apply here the transpose of the inverse? and should the vector have a 1 at the end?
        
        v_viewDirection = -vec3( normalize(tmp_view));

        v_color = a_color;

        vec4 tmp = lightProjectionMatrix * lightViewMatrix * modelMatrix * vec4(a_position,1.0);
        shadowVertex = tmp.xyz / tmp.w;

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position,1.0);
    }
`