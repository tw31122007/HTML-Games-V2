FullScreenMario.FullScreenMario.settings.runner = {
    "games": [
        function () {
            this.DeviceLayer.checkNavigatorGamepads();
            this.DeviceLayer.activateAllGamepadTriggers();
        },
        function () {
            this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants("Text", this.GroupHolder.getTextGroup());
        },
        function () {
            this.maintenance.maintainSolids(this, this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintenance.maintainCharacters(this, this.GroupHolder.getCharacterGroup());
        },
        function () {
            this.maintenance.maintainPlayer(this, this.player);
        },
        function () {
            this.TimeHandler.handleEvents();
        },
        function () {
            this.PixelDrawer.refillGlobalCanvas(this.AreaSpawner.getArea().background);
        }
    ]
};
