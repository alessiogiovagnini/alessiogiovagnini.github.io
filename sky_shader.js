var skyVertexShader = 
`#version 300 es
    layout(location=0) in vec3 a_position;

    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    uniform mat4 modelMatrix;

    out vec3 coord;

    void main() {
        coord = a_position;
        vec4 tmp = projectionMatrix * mat4(mat3(viewMatrix)) * modelMatrix * vec4(a_position, 1.0);
        gl_Position = tmp.xyzw;
        //gl_Position.z = 10.0;
        
    }
`;
var skyFragmentShader = 
`#version 300 es
    precision highp float;
    in vec3 coord;

    uniform samplerCube skyTexture;

    out vec4 color;

    void main() {
        color = texture(skyTexture, coord);
    }
`;