/// <reference path="../FullScreenMario.ts" />
var FullScreenMario;
(function (FullScreenMario) {
    "use strict";
    FullScreenMario.FullScreenMario.settings.collisions = {
        "keyGroupName": "groupType",
        "keyTypeName": "title",
        "globalCheckGenerators": {
            "Character": FullScreenMario.Physics.prototype.generateCanThingCollide,
            "Solid": FullScreenMario.Physics.prototype.generateCanThingCollide
        },
        "hitCheckGenerators": {
            "Character": {
                "Character": FullScreenMario.Physics.prototype.generateIsCharacterTouchingCharacter,
                "Solid": FullScreenMario.Physics.prototype.generateIsCharacterTouchingSolid
            }
        },
        "hitCallbackGenerators": {
            "Character": {
                "Solid": FullScreenMario.Physics.prototype.generateHitCharacterSolid,
                "Character": FullScreenMario.Physics.prototype.generateHitCharacterCharacter
            }
        }
    };
})(FullScreenMario || (FullScreenMario = {}));
