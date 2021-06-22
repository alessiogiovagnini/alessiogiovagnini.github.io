//matrix that preserve the minkowski inner product
const minkowski =  glMatrix.mat4.fromValues(1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1);

//=========Special matrix implementation============

        //hyperbolic reflection
        // p is a vec4, is the homogeneus coordinates of a point p
        function hyp_reflection(p) {
            let identity = mat4.create();
            // twoppt is: 2 * p * transpose(p)
            let twoppt = mat4.fromValues(2*p[0]*p[0], 2*p[0]*p[1], 2*p[0]*p[2], 2*p[0]*p[3],
                                         2*p[1]*p[0], 2*p[1]*p[1], 2*p[1]*p[2], 2*p[1]*p[3],
                                         2*p[2]*p[0], 2*p[2]*p[1], 2*p[2]*p[2], 2*p[2]*p[3],
                                         2*p[3]*p[0], 2*p[3]*p[1], 2*p[3]*p[2], 2*p[3]*p[3]);
            let result = mat4.create();
            mat4.multiply(result,twoppt,minkowski);
            mat4.multiplyScalar(result,result,1/hyp_inner_product(p,p));
            mat4.subtract(result,identity,result);

            return result;
        }

        //hyperbolic translation from a to b, the vectors must be inside the unit ball, all the values must be less than 1
        //a and b are hompgeneus coordinat vec4
        function hyp_translation(a, b) {
            let midpoint = hyp_midpoint(a, b);
            let reflection_m = hyp_reflection(midpoint);
            let reflection_a = hyp_reflection(a);
            let result = mat4.create();
            mat4.multiply(result,reflection_m,reflection_a);
            return result;
        }

        //hyperbolic midpoint
        //a and b are two vec 4
        function hyp_midpoint(a, b) {
            let bbh = hyp_inner_product(b, b);
            let abh = hyp_inner_product(a, b);
            let aah = hyp_inner_product(a, a);
            
            let tmp_a = vec4.clone(a);
            let tmp_b = vec4.clone(b);
            let m = vec4.create();
            //TODO it give NAN because the square root of a negative number return NaN, 
            // if (bbh * abh < 0 || aah * abh < 0 || print_val < 0) {
            //     console.log("bbh: " + bbh + " | abh: " + abh + " | aah: " + aah)
            //     console.log(a)
            //     console.log(b)
            // }
            vec4.scale(tmp_a, tmp_a, Math.sqrt(bbh * abh));
            vec4.scale(tmp_b, tmp_b, Math.sqrt(aah * abh));

            vec4.add(m,tmp_a,tmp_b);
            return m
        }

        //TODO delete later
        function hyp_inner_product_print(a, b) {
            return ((a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) - (a[3] * b[3]));
        }

        //hyperbolic rotation around point p on the z axis, rotation is in radian
        function hyp_rotation_z(p, rotation) {
            let T_hyp = hyp_translation(p, vec4.fromValues(0.0,0.0,0.0,1));
            let T_hyp_inv = mat4.create();
            mat4.invert(T_hyp_inv,T_hyp);
            let R_euc = mat4.create();
            mat4.fromZRotation(R_euc, rotation);
            let result = mat4.create();
            mat4.multiply(result, T_hyp_inv, R_euc);
            mat4.multiply(result, result, T_hyp);
            return result;
        }

        //rotation around point p on the x axis, rotation is in rad
        function hyp_rotation_x(p, rotation) {
            let T_hyp = hyp_translation(p, vec4.fromValues(0.0,0.0,0.0,1));
            let T_hyp_inv = mat4.create();
            mat4.invert(T_hyp_inv,T_hyp);
            let R_euc = mat4.create();
            mat4.fromXRotation(R_euc, rotation);
            let result = mat4.create();
            mat4.multiply(result, T_hyp_inv, R_euc);
            mat4.multiply(result, result, T_hyp);
            return result;
        }

        //rotation around point p on the y axis, rotation is in rad
        function hyp_rotation_y(p, rotation) {
            let T_hyp = hyp_translation(p, vec4.fromValues(0.0,0.0,0.0,1));
            let T_hyp_inv = mat4.create();
            mat4.invert(T_hyp_inv,T_hyp);
            let R_euc = mat4.create();
            mat4.fromYRotation(R_euc, rotation);
            let result = mat4.create();
            mat4.multiply(result, T_hyp_inv, R_euc);
            mat4.multiply(result, result, T_hyp);
            return result;
        }

        function hyp_rotation(p, rotation, q) {
            //TODO rotation around line q
        }

        //TODO sometime it return a negative value
        // inner product for hyperbolic space
        // a and b are vec4
        function hyp_inner_product(a, b) {
            let result = ((a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) - (a[3] * b[3]));
            return result
        }
        //=============================


        //==========special matrix implementation with Lorentz matrices============
        //using cosh and sinh

        //hyperbolic translation using the lorentz matrix
        function lorentz_translation_y(rotation) {
            let hyp_sin = Math.sinh(rotation);
            let hyp_cos = Math.cosh(rotation);
            return mat4.fromValues(1,       0, 0,       0,
                                   0, hyp_cos, 0, hyp_sin,
                                   0,       0, 1,       0,
                                   0, hyp_sin, 0, hyp_cos);                    
        }

        function lorentz_translation_z(rotation) {
            let hyp_sin = Math.sinh(rotation);
            let hyp_cos = Math.cosh(rotation);
            return mat4.fromValues(1, 0,        0,       0,
                                   0, 1,        0,       0,
                                   0, 0,  hyp_cos, hyp_sin,
                                   0, 0,  hyp_sin, hyp_cos);
        }

        function lorentz_translation_x(rotation) {
            let hyp_sin = Math.sinh(rotation);
            let hyp_cos = Math.cosh(rotation);
            return mat4.fromValues(hyp_cos, 0, 0, hyp_sin,
                                         0, 1,  0, 0,
                                         0, 0,  1, 0,
                                   hyp_sin, 0,  0, hyp_cos);
        }
        //=============================================================

        //=======another experimental implementation ===================
        //TODO test
        function exp_translation_x(rotation) {
            let rad = rotation * Math.PI / 180;
            let sin = Math.sin(rad);
            let cos = Math.cos(rad);
            return mat4.fromValues(cos, 0, 0, sin,
                                   0, 1, 0,   0,
                                   0, 0, 1,   0,
                                   -sin, 0, 0,   cos);
        }


        //=======================================