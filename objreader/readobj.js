var ivec3 = {
    i : 0,
    j : 0,
    k : 0,

    Init : function(i, j, k) {
        this.i = i;
        this.j = j;
        this.k = k;

        return this;
    },
    toHash : function(v) {
        return v.i.toString() + "-" + v.j.toString() + "-" + v.k.toString();
    }
}

function readobj(contents) {
    // create variables to store obj file
    var verts = new Array();
    var normals = new Array();
    var uvs = new Array();
    var vert_ids = new Array();
    var indices = new Array();
    // read the obj file into javascript
    var lines = contents.split("\n");
    for (let i = 0; i < lines.length; i++) {
        var arguments = lines[i].split(" ");
        switch (arguments[0]) {
            case "v":
                verts.push(glMatrix.vec3.fromValues(
                    parseFloat(arguments[1]),
                    parseFloat(arguments[2]),
                    parseFloat(arguments[3])
                ));
                break;
            case "vn":
                normals.push(glMatrix.vec3.fromValues(
                    parseFloat(arguments[1]),
                    parseFloat(arguments[2]),
                    parseFloat(arguments[3])
                ));
                break;
            case "vt":
                uvs.push(glMatrix.vec2.fromValues(
                    parseFloat(arguments[1]),
                    1-parseFloat(arguments[2])
                ));
                break;
            case "f":
                for (let i = 1; i <= 3; i++) {
                    let index = arguments[i].split("/");
                    indices.push(new ivec3.Init(// we need to adjust from obj to javascript indexing
                        parseInt(index[0])-1,
                        parseInt(index[1])-1,
                        parseInt(index[2])-1
                    ));
                }
                // if mesh is composed of quads convert it to triangular mesh
                if (arguments.length == 5) {
                    for (let i = 3; i >= 3 && i <= 5; i++) {
                        if (i == 5) i = 1;
                        let index = arguments[i].split("/");
                        indices.push(new ivec3.Init(// we need to adjust from obj to javascript indexing
                            parseInt(index[0])-1,
                            parseInt(index[1])-1,
                            parseInt(index[2])-1
                        ));
                    }
                }
                break;
            default:
                break;
        }
    }
    // create variables to store WebGL buffers
    var linearVerts = new Array();
    var linearNormals = new Array();
    var linearUVs = new Array();
    var linearTangents = new Array();
    var linearBitangents = new Array();
    var tris = new Array();
    var hashtable = {};
    var numVerts = 0;
    // linearize the obj file by not creating unnecessary duplicates of vertices
    for (let i = 0; i < indices.length; i+=3) {
        // compute tangents and bitangents
        let v1 = verts[indices[i+0].i];
        let v2 = verts[indices[i+1].i];
        let v3 = verts[indices[i+2].i];

        let w1 = uvs[indices[i+0].j];
        let w2 = uvs[indices[i+1].j];
        let w3 = uvs[indices[i+2].j];

        let x1 = v2[0] - v1[0];
        let x2 = v3[0] - v1[0];
        let y1 = v2[1] - v1[1];
        let y2 = v3[1] - v1[1];
        let z1 = v2[2] - v1[2];
        let z2 = v3[2] - v1[2];

        let s1 = w2[0] - w1[0];
        let s2 = w3[0] - w1[0];
        let t1 = w2[1] - w1[1];
        let t2 = w3[1] - w1[1];

        let r = 1.0 / (s1*t2 - s2*t1);
        let face_tangent = glMatrix.vec3.fromValues(
          (t2*x1 - t1*x2)*r,
          (t2*y1 - t1*y2)*r,
          (t2*z1 - t1*z2)*r
        );
        let face_bitangent = -glMatrix.vec3.fromValues(
          (s1*x2 - s2*x1)*r,
          (s1*y2 - s2*y1)*r,
          (s1*z2 - s2*z1)*r
        );
        // add triangle
        for (let j = 0; j < 3; j++) {
            let P = indices[i+j];
            //let key = ivec3.toHash(P);
            //if (key in hashtable) {
            //    tris.push(hashtable[key]);
            //} else {
                if (verts[P.i] == undefined) {
                    console.log(i + " " + P.i + " " + verts.length);
                }
                let normal = normals[P.k];
                // correct tangent and bitangent using the normal
                // Graham-Schmidt ortogonalize
                let tangent = glMatrix.vec3.fromValues(1, 0, 0);
                glMatrix.vec3.scale(tangent, normal, glMatrix.vec3.dot(normal, face_tangent))
                glMatrix.vec3.subtract(tangent, face_tangent, tangent);
                glMatrix.vec3.normalize(tangent,tangent);
                // calculate handedness
                let bitangent = glMatrix.vec3.fromValues(0, 1, 0);
                glMatrix.vec3.cross(bitangent, normal, tangent);
                let handedness = glMatrix.vec3.dot(bitangent, face_bitangent) < 0 ? -1 : 1;
                // set bitangent
                glMatrix.vec3.cross(bitangent, normal, tangent);
                glMatrix.vec3.scale(bitangent, bitangent, handedness);
                glMatrix.vec3.normalize(bitangent,bitangent);

                linearVerts.push(verts[P.i][0]);
                linearVerts.push(verts[P.i][1]);
                linearVerts.push(verts[P.i][2]);

                linearNormals.push(normals[P.k][0]);
                linearNormals.push(normals[P.k][1]);
                linearNormals.push(normals[P.k][2]);

                linearTangents.push(tangent[0]);
                linearTangents.push(tangent[1]);
                linearTangents.push(tangent[2]);

                linearBitangents.push(bitangent[0]);
                linearBitangents.push(bitangent[1]);
                linearBitangents.push(bitangent[2]);

                linearUVs.push(uvs[P.j][0]);
                linearUVs.push(uvs[P.j][1]);

                tris.push(numVerts);
                //hashtable[key] = numVerts;
                numVerts++;
            //}
        }
    }

    //return [linearVerts, linearNormals, linearUVs, tris];
    return [linearVerts, linearNormals, linearUVs, linearTangents, linearBitangents, tris];
}
