var triangle_vertices = [
    -0.5, 0.0, -0.5,
    -0.5, 0.0, 0.5,
    0.0, 0.0, 0.0,
];

var triangle_normals = [
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
];

var triangle_color = [
    1.0, 0.0, 0.0,      //red
    0.0, 1.0, 0.0,      //green
    0.0, 0.0, 1.0,      //blue
]


var cube_vertices = [
    -0.5,  0.5,  0.5, // front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  -0.5,// back face
     -0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5, -0.5, 0.5,// right face
     0.5, -0.5,  -0.5,
     0.5,  0.5,  -0.5,
     0.5, 0.5, 0.5,
     0.5, -0.5, 0.5,
     0.5, 0.5, -0.5,
     -0.5,  0.5,  -0.5,// left face
     -0.5, -0.5,  -0.5,
     -0.5, -0.5, 0.5,
     -0.5, 0.5, -0.5,
     -0.5, -0.5, 0.5,
     -0.5, 0.5, 0.5,
     -0.5, 0.5, 0.5, //top face
     0.5, 0.5, -0.5,
     -0.5, 0.5, -0.5,
     -0.5, 0.5, 0.5,
     0.5, 0.5, 0.5,
     0.5, 0.5, -0.5,
     -0.5, -0.5, 0.5, //bottom face
     -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     -0.5, -0.5, 0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5, 0.5,
];

for (let index = 0; index < cube_vertices.length; index++) {
    cube_vertices[index] = cube_vertices[index] / 2;
}

var cube_colors = [
    0.9,  0.24,  0.24, // front face is red
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.6,  0.15,  0.71, // back face is purple
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.0, 0.61, 0.87, // right face
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    1.0,  0.85,  0.0, // left face
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    0.35,  0.77,  0.0, // top face
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.0,  0.73,  0.49, // bottom face
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
];

var cube_normals = [];

function compute_normals(vertices, normals){
    let vec3 = glMatrix.vec3;
    for(let i = 0; i < 12; i++){
        let v1 = vec3.fromValues(vertices[9*i], vertices[9*i+1], vertices[9*i+2]);
        let v2 = vec3.fromValues(vertices[9*i+3], vertices[9*i+4], vertices[9*i+5]);
        let v3 = vec3.fromValues(vertices[9*i+6], vertices[9*i+7], vertices[9*i+8]);
        let a = vec3.create();
        vec3.subtract(a,v2,v1);
        let b = vec3.create();
        vec3.subtract(b,v3,v1);
        let normal = vec3.create();
        vec3.cross(normal,a,b);
        normals.push(normal[0],normal[1],normal[2]);
        normals.push(normal[0],normal[1],normal[2]);
        normals.push(normal[0],normal[1],normal[2]);
    }
}
compute_normals(cube_vertices,cube_normals);


//---------------------------
// definition of the sphere
//---------------------------
var sphere_vertices = [];
var sphere_colors = [];
function create_sphere(){
    let step = 0.05;
    for(let u = 0; u < 1; u = u + step){
        for(let v = 0; v < 1; v = v + step){
            let t = Math.sin(Math.PI*v);

            let x1 = t*Math.cos(2*Math.PI*u);
            let z1 = t*Math.sin(2*Math.PI*u);
            let y1 = Math.cos(Math.PI*v);

            let x4 = t*Math.cos(2*Math.PI*(u+step));
            let z4 = t*Math.sin(2*Math.PI*(u+step));
            let y4 = Math.cos(Math.PI*v);



            t = Math.sin(Math.PI*(v+step));
            let x2 = t*Math.cos(2*Math.PI*u);
            let z2 = t*Math.sin(2*Math.PI*u);
            let y2 = Math.cos(Math.PI*(v+step));

            let x3 = t*Math.cos(2*Math.PI*(u+step));
            let z3 = t*Math.sin(2*Math.PI*(u+step));
            let y3 = Math.cos(Math.PI*(v+step));

            sphere_vertices.push(x1,y1,z1,x3,y3,z3,x2,y2,z2);
            sphere_vertices.push(x1,y1,z1,x4,y4,z4,x3,y3,z3);

            for(let k = 0; k < 6; k++){
                sphere_colors.push(0,0,0);
            }

        }
    }
    //making the sphere a unit sphere
    for(let i = 0; i < sphere_vertices.length; i++){
        sphere_vertices[i] = sphere_vertices[i]/2;
    }
}

create_sphere();

//unit disc with a ray of 1
var disc_vertices = [];
var disc_colors = [];
var disc_uv = []
var disc_normals = [];

//the input is the number of triangle that the disc is made of
var triangles = 360;
function create_disc(triangles) {
    let y = 0;//disk is on the plane x-z
    let current_angle = 0;
    let step_size = 360 / triangles; //angle of each triangle
    for (let index = 0; index < triangles; index++) {
        let angle_rad = current_angle * Math.PI / 180; //angle in radiant for sin and cos function
        let x2 = Math.cos(angle_rad);
        let z2 = Math.sin(angle_rad);

        let x3 = Math.cos(angle_rad + (step_size * Math.PI / 180));
        let z3 = Math.sin(angle_rad + (step_size * Math.PI / 180));

        disc_vertices.push(0, y, 0, x3, y, z3, x2, y, z2);
        disc_uv.push(0.5, 0.5, 
            x3/2+0.5, z3/2+0.5,
            x2/2+0.5, z2/2+0.5);
        disc_colors.push(0.2, 0.2, 0.8, 0.2, 0.2, 0.8, 0.2, 0.2, 0.8);
        disc_normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);

        current_angle += step_size;
    }
}

create_disc(triangles);

var terrain_vertices = [
    -5,0,-5,
    -5,0,5,
    5,0,5,
    -5,0,-5,
    5,0,5,
    5,0,-5
];
var terrain_normals = [
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0
];

var terrain_colors = [
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0,
    0,1,0
]

const obj_buffer_sphere = readobj(SPHERE);

const obj_sphere_vertex = obj_buffer_sphere[0];
const obj_sphere_normals = obj_buffer_sphere[1];
const obj_sphere_uv = obj_buffer_sphere[2];

const spaceship_obj_buffer = readobj(SPACESHIP);
const spaceship_vertex = spaceship_obj_buffer[0];
const spaceship_normals = spaceship_obj_buffer[1];
const spaceship_uv = spaceship_obj_buffer[2];

console.log("spaceship vertex length: " + spaceship_vertex.length/3)

const cow_obj_buffer = readobj(COW);
const cow_vertex = cow_obj_buffer[0];
const cow_normals = cow_obj_buffer[1];
const cow_uv = cow_obj_buffer[2];

console.log("cow vertex length: " + cow_vertex.length/3)

const taxi_obj_buffer = readobj(TAXI);
const taxi_vertex = taxi_obj_buffer[0];
const taxi_normals = taxi_obj_buffer[1];
const taxi_uv = taxi_obj_buffer[2];

const tree_obj_buffer = readobj(TREE);
const tree_vertex = tree_obj_buffer[0];
const tree_normals = tree_obj_buffer[1];
const tree_uv = tree_obj_buffer[2];

const house_obj_buffer = readobj(HOUSE);
const house_vertex = house_obj_buffer[0];
const house_normals = house_obj_buffer[1];
const house_uv = house_obj_buffer[2]

const dead_tree_buffer = readobj(DEAD_TREE);
const dead_tree_vertex = dead_tree_buffer[0];
const dead_tree_normals = dead_tree_buffer[1];
const dead_tree_uv = dead_tree_buffer[2];