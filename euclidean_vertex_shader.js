var euclideanVertexShader = 
`#version 300 es
    layout(location=0) in vec3 a_position;
    layout(location=1) in vec3 a_color;
    layout(location=2) in vec3 a_normal;

    out vec3 v_color;
    out vec3 v_normal;
    out vec3 v_lightDirection;
    out vec3 v_viewDirection;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    //shadow computation
    uniform mat4 lightViewMatrix;
    uniform mat4 lightProjectionMatrix;

    out vec3 shadowVertex;

    //out float depth_test;//for testing

    uniform vec3 lightDirection;

    void main(){
        //shadow
        vec4 tmp = lightProjectionMatrix * lightViewMatrix * modelMatrix * vec4(a_position,1.0);
        shadowVertex = tmp.xyz / tmp.w;
        
        v_normal = vec3(viewMatrix * modelMatrix * vec4(a_normal, 0.0));

        v_lightDirection = vec3(viewMatrix * vec4(lightDirection, 0.0));
        
        v_viewDirection = -vec3(viewMatrix * modelMatrix * vec4(a_position, 1.0));// ?? should I apply here the transpose of the inverse? and should the vector have a 1 at the end?

        v_color = a_color;

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position,1.0);

        //depth_test = (2.0 - (1.0 + gl_Position.z))/2.0;
        //depth_test = abs(gl_Position.z/gl_Position.w) ;
    }`;