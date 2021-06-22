var fragmentShader = 
`#version 300 es
    precision highp float;
    in vec3 v_color;
    in vec3 v_viewDirection;
    in vec3 v_normal;
    in vec3 v_lightDirection;

    in vec3 shadowVertex;
    uniform sampler2D shadowMap;

    const vec3 lightColor = vec3(1.0,1.0,1.0);
    const float ambientCoeff = 0.08;
    const float diffuseCoeff = 0.5;
    const float specularCoeff = 0.5;
    const float shininessCoeff = 50.0;

    const float bias = 0.005;

    const float gamma = 1.8;

    out vec4 out_color;

    void main(){
        float shadowing = 0.0;
        vec2 fetchPosition = 0.5 * shadowVertex.xy + vec2(0.5);
        float shadow_map_depth = texture(shadowMap,fetchPosition).r;
        float depth = shadowVertex.z / 2.0 + 0.5;
        if (shadow_map_depth < depth - bias ) {
            shadowing = 1.0;
        }

        vec3 V = normalize(v_viewDirection);
        vec3 N = normalize(v_normal);
        vec3 L = normalize(v_lightDirection.xyz);
        vec3 R = normalize(reflect(-L,N));

        vec3 ambient = ambientCoeff * v_color;
        vec3 diffuse = vec3(diffuseCoeff) * lightColor * v_color * vec3(max(dot(N,L), 0.0));
        vec3 specular = vec3(specularCoeff) * vec3(pow(max(dot(R,V), 0.0), shininessCoeff));

        vec3 color = ambient + (1.0 - shadowing) * (diffuse + specular);
        
        color = pow(color,vec3(1.0/gamma));
        //color = (1.0 - shadowing) * color;//effecto of shadow???
        //color = vec3(shadowVertex.z);
        out_color = vec4(color, 1.0);
    }
`