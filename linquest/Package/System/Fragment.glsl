
uniform sampler2D textures[MAX_TEXTURE_SLOTS];
varying vec2 varying_vertex_uv;
varying float varying_vertex_texture;
varying vec4 varying_vertex_color;
void main(void){
    if(varying_vertex_texture == 0.0){
        gl_FragColor = texture2D(textures[0], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
    }
    #if MAX_TEXTURE_SLOTS > 1
        else if(varying_vertex_texture == 1.0){
            gl_FragColor = texture2D(textures[1], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 2
        else if(varying_vertex_texture == 2.0){
            gl_FragColor = texture2D(textures[2], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 3
        else if(varying_vertex_texture == 3.0){
            gl_FragColor = texture2D(textures[3], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 4
        else if(varying_vertex_texture == 4.0){
            gl_FragColor = texture2D(textures[4], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 5
        else if(varying_vertex_texture == 5.0){
            gl_FragColor = texture2D(textures[5], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 6
        else if(varying_vertex_texture == 6.0){
            gl_FragColor = texture2D(textures[6], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 7
        else if(varying_vertex_texture == 7.0){
            gl_FragColor = texture2D(textures[7], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 8
        else if(varying_vertex_texture == 8.0){
            gl_FragColor = texture2D(textures[8], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 9
        else if(varying_vertex_texture == 9.0){
            gl_FragColor = texture2D(textures[9], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 10
        else if(varying_vertex_texture == 10.0){
            gl_FragColor = texture2D(textures[10], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 11
        else if(varying_vertex_texture == 11.0){
            gl_FragColor = texture2D(textures[11], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 12
        else if(varying_vertex_texture == 12.0){
            gl_FragColor = texture2D(textures[12], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 13
        else if(varying_vertex_texture == 13.0){
            gl_FragColor = texture2D(textures[13], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 14
        else if(varying_vertex_texture == 14.0){
            gl_FragColor = texture2D(textures[14], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 15
        else if(varying_vertex_texture == 15.0){
            gl_FragColor = texture2D(textures[15], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 16
        else if(varying_vertex_texture == 16.0){
            gl_FragColor = texture2D(textures[16], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 17
        else if(varying_vertex_texture == 17.0){
            gl_FragColor = texture2D(textures[17], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 18
        else if(varying_vertex_texture == 18.0){
            gl_FragColor = texture2D(textures[18], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 19
        else if(varying_vertex_texture == 19.0){
            gl_FragColor = texture2D(textures[19], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 20
        else if(varying_vertex_texture == 20.0){
            gl_FragColor = texture2D(textures[20], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 21
        else if(varying_vertex_texture == 21.0){
            gl_FragColor = texture2D(textures[21], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 22
        else if(varying_vertex_texture == 22.0){
            gl_FragColor = texture2D(textures[22], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 23
        else if(varying_vertex_texture == 23.0){
            gl_FragColor = texture2D(textures[23], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 24
        else if(varying_vertex_texture == 24.0){
            gl_FragColor = texture2D(textures[24], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 25
        else if(varying_vertex_texture == 25.0){
            gl_FragColor = texture2D(textures[25], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 26
        else if(varying_vertex_texture == 26.0){
            gl_FragColor = texture2D(textures[26], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 27
        else if(varying_vertex_texture == 27.0){
            gl_FragColor = texture2D(textures[27], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 28
        else if(varying_vertex_texture == 28.0){
            gl_FragColor = texture2D(textures[28], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 29
        else if(varying_vertex_texture == 29.0){
            gl_FragColor = texture2D(textures[29], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 30
        else if(varying_vertex_texture == 30.0){
            gl_FragColor = texture2D(textures[30], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    #if MAX_TEXTURE_SLOTS > 31
        else if(varying_vertex_texture == 31.0){
            gl_FragColor = texture2D(textures[31], vec2(varying_vertex_uv.x, varying_vertex_uv.y));
        }
    #endif
    else{
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    gl_FragColor.r *= varying_vertex_color.r;
    gl_FragColor.g *= varying_vertex_color.g;
    gl_FragColor.b *= varying_vertex_color.b;
    gl_FragColor.a *= varying_vertex_color.a;
}
