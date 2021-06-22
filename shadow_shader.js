var shadowVertexShader =
`#version 300 es
    layout(location=0) in vec3 a_position;

    out float depth;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    // uniform mat4 correctionMatrix;

    void main(){
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position,1.0);
        depth = gl_Position.z/gl_Position.w;
    }
`;
var shadowFragmentShader = 
`#version 300 es
    precision highp float;

    in float depth;
    out vec4 color;

    void main(){
        color = vec4(vec3(depth / 2.0 + 0.5),1.0);
    }
`;