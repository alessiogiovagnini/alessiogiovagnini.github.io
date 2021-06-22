var vertexObjectShader = 
`#version 300 es
    layout(location=0) in vec3 a_position;
    layout(location=2) in vec3 a_normal;
    layout(location=3) in vec2 a_uv;

    out vec2 v_uv;
    out vec3 v_normal;
    out vec3 v_lightDirection;
    out vec3 v_viewDirection;

    out vec3 shadowVertex;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    uniform mat4 correction;

    //for shadow computation
    uniform mat4 lightViewMatrix;
    uniform mat4 lightProjectionMatrix;

    uniform vec3 lightDirection;

    void main(){
        // //mat4(mat3(m))
        mat4 it_modelMatrix = transpose(inverse(modelMatrix));
        mat4 it_viewMatrix = transpose(inverse(viewMatrix));//it do not seem to work
        v_uv = a_uv;
        
        //NOTE -> need to make a shader for euclidean geometry
        //!!NOTE!!: transpose(inverse(viewMatrix * modelMatrix)) * vec4(a_normal, 0.0); seem to still work in third person.
        //NOTE_2!!: it_viewMatrix * it_modelMatrix * vec4(a_normal, 0.0); also seem to work in third person.
        //NOTE_3!! it seem that normalizing the vec4 before removing the 4th element make the lighting works in first and third person
        vec4 tmp_normal = viewMatrix * modelMatrix * vec4(a_normal, 0.0);
        
        v_normal = vec3(normalize(tmp_normal));

        vec4 tmp_ld = viewMatrix * vec4(lightDirection, 0.0); //tmp_light_direction
        
        v_lightDirection = vec3(normalize(tmp_ld));
        
        vec4 tmp_view = viewMatrix * modelMatrix * vec4(a_position, 1.0);// ?? should I apply here the transpose of the inverse? and should the vector have a 1 at the end?
        
        v_viewDirection = -vec3( normalize(tmp_view));

        vec4 tmp = lightProjectionMatrix * lightViewMatrix * modelMatrix * vec4(a_position,1.0);
        shadowVertex = tmp.xyz / tmp.w;

        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(a_position,1.0);
    }
`
var fragmentObjectShader = 
`#version 300 es
    precision highp float;
    in vec2 v_uv;
    in vec3 v_viewDirection;
    in vec3 v_normal;
    in vec3 v_lightDirection;

    in vec3 shadowVertex;
    uniform sampler2D shadowMap;

    uniform sampler2D textureObject;

    const vec3 lightColor = vec3(1.0,1.0,1.0);
    const float ambientCoeff = 0.08;
    const float diffuseCoeff = 0.5;
    const float specularCoeff = 0.5;
    const float shininessCoeff = 50.0;

    const float bias = 0.005;

    const float gamma = 1.8;

    out vec4 out_color;

    void main(){
        float plusAmbient = 0.0;
        float shadowing = 0.0;
        vec2 fetchPosition = 0.5 * shadowVertex.xy + vec2(0.5);
        float shadow_map_depth = texture(shadowMap,fetchPosition).r;
        float depth = shadowVertex.z / 2.0 + 0.5;
        if (shadow_map_depth < depth - bias ) {
            shadowing = 1.0;
            plusAmbient = 0.05;
        }

        vec3 V = normalize(v_viewDirection);
        vec3 N = normalize(v_normal);
        vec3 L = normalize(v_lightDirection.xyz);
        vec3 R = normalize(reflect(-L,N));

        vec3 textureColor = texture(textureObject, v_uv).rgb;

        vec3 ambient = (ambientCoeff + plusAmbient) * textureColor;
        vec3 diffuse = vec3(diffuseCoeff) * lightColor * textureColor * vec3(max(dot(N,L), 0.0));
        vec3 specular = vec3(specularCoeff) * vec3(pow(max(dot(R,V), 0.0), shininessCoeff));

        vec3 color = ambient + (1.0 - shadowing) * (diffuse + specular);
        
        color = pow(color,vec3(1.0/gamma));

        out_color = vec4(color, 1.0);
    }
`