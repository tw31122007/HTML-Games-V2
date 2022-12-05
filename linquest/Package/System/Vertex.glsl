uniform vec2 view_size;
uniform vec2 view_scale;
uniform vec2 camera_position;
uniform int top_left_camera;
uniform int pixel_perfect;
attribute float vertex_pinned;
attribute vec2 vertex_anchor;
attribute vec2 vertex_position;
attribute vec2 vertex_scale;
attribute vec2 vertex_mirror;
attribute float vertex_angle;
attribute vec2 vertex_uv;
attribute float vertex_texture;
attribute vec4 vertex_color;
varying vec2 varying_vertex_uv;
varying float varying_vertex_texture;
varying vec4 varying_vertex_color;
void main(void){
    gl_Position = vec4(vertex_position, 0.0, 1.0);
    gl_Position.x *= vertex_scale.x;
    gl_Position.y *= vertex_scale.y;
    gl_Position.x = vertex_mirror.x == 0.0 ? gl_Position.x : -gl_Position.x;
    gl_Position.y = vertex_mirror.y == 0.0 ? gl_Position.y : -gl_Position.y;
    if(vertex_angle != 0.0){
        float new_x = gl_Position.x * cos(radians(vertex_angle)) - gl_Position.y * sin(radians(vertex_angle));
        float new_y = gl_Position.x * sin(radians(vertex_angle)) + gl_Position.y * cos(radians(vertex_angle));
        gl_Position.x = new_x;
        gl_Position.y = new_y;
    }
    gl_Position += vec4(vertex_anchor, 0.0, 0.0);
    if(vertex_pinned == 0.0){
        gl_Position -= vec4(camera_position, 0.0, 0.0);
    }
    gl_Position.x /= view_size.x / 2.0;
    gl_Position.y /= -view_size.y / 2.0;
    if(vertex_pinned == 0.0){
        gl_Position.x *= view_scale.x;
        gl_Position.y *= view_scale.y;
    }
    if(top_left_camera != 0){
        gl_Position.x -= 1.0;
        gl_Position.y += 1.0;
    }
    varying_vertex_uv = vertex_uv;
    varying_vertex_texture = vertex_texture;
    varying_vertex_color = vertex_color;
}

