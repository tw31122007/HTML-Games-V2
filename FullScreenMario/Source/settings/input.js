FullScreenMario.FullScreenMario.settings.input = {
    "InputWritrArgs": {
        "aliases": {
            // Keyboard aliases
            "left":   [65, 37],     // a,     left
            "right":  [68, 39],     // d,     right
            "up":     [87, 38, 32], // w,     up,    space
            "down":   [83, 40],     // s,     down
            "sprint": [16, 17],     // shift, ctrl
            "pause":  [80],         // p (pause)
            // Mouse aliases
            "rightclick": [3],
        },
        "triggers": {
            "onkeydown": {
                "left": FullScreenMario.Inputs.prototype.keyDownLeft,
                "right": FullScreenMario.Inputs.prototype.keyDownRight,
                "up": FullScreenMario.Inputs.prototype.keyDownUp,
                "down": FullScreenMario.Inputs.prototype.keyDownDown,
                "sprint": FullScreenMario.Inputs.prototype.keyDownSprint,
                "pause": FullScreenMario.Inputs.prototype.keyDownPause,
                "mute": FullScreenMario.Inputs.prototype.keyDownMute,
            },
            "onkeyup": {
                "left": FullScreenMario.Inputs.prototype.keyUpLeft,
                "right": FullScreenMario.Inputs.prototype.keyUpRight,
                "up": FullScreenMario.Inputs.prototype.keyUpUp,
                "down": FullScreenMario.Inputs.prototype.keyUpDown,
                "sprint": FullScreenMario.Inputs.prototype.keyUpSprint,
                "pause": FullScreenMario.Inputs.prototype.keyUpPause
            },
            "onmousedown": {
                "rightclick": FullScreenMario.Inputs.prototype.mouseDownRight
            },
            "oncontextmenu": {},
            "ondevicemotion": {
                "devicemotion": FullScreenMario.Inputs.prototype.deviceMotion
            }
        }
    }
};
