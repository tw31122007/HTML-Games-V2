var g_ressources = (function () {
    var retval = [],
        imgs = ["bg", "platform", "bird", "enemy", "sling1", "sling2", "sling3", "ground", "wood1", "wood2", "smoke", "menu_refresh", "menu_back"];

    for (var i = 0; i < imgs.length; i++) {
        retval.push({
            type: "image",
            src: 'sprites/' + imgs[i] + '.png'
        });
    }

    return retval;
}());