(function() {
    "use strict";

    function e() {
        var e = window._CCSettings;
        window._CCSettings = undefined;
        if (!e.debug) {
            var s = e.uuids;
            var c = e.rawAssets;
            var r = e.assetTypes;
            var n = e.rawAssets = {};
            for (var o in c) {
                var i = c[o];
                var a = n[o] = {};
                for (var t in i) {
                    var d = i[t];
                    var u = d[1];
                    if (typeof u === "number") {
                        d[1] = r[u]
                    }
                    a[s[t] || t] = d
                }
            }
            var f = e.scenes;
            for (var v = 0; v < f.length; ++v) {
                var l = f[v];
                if (typeof l.uuid === "number") {
                    l.uuid = s[l.uuid]
                }
            }
            var y = e.packedAssets;
            for (var w in y) {
                var b = y[w];
                for (var p = 0; p < b.length; ++p) {
                    if (typeof b[p] === "number") {
                        b[p] = s[b[p]]
                    }
                }
            }
        }
        var g;
        if (cc.sys.isBrowser) {
            g = document.getElementById("GameCanvas")
        }

        function m() {
            cc.loader.onProgress = function(e, s, c) {
                return;
                var r = 100 * e / s;
                FBInstant.setLoadingProgress(r)
            }
        }
        var A = function() {
            cc.view.resizeWithBrowserSize(true);
            cc.view.enableRetina(true);
            if (cc.sys.isBrowser) {
                m()
            }
            if (cc.sys.isMobile) {
                if (e.orientation === "landscape") {
                    cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE)
                } else if (e.orientation === "portrait") {
                    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT)
                }
                cc.view.enableAutoFullScreen(cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU && cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT && cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ)
            }
            if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
                cc.macro.DOWNLOAD_MAX_CONCURRENT = 2
            }
            cc.AssetLibrary.init({
                libraryPath: "res/import",
                rawAssetsBase: "res/raw-",
                rawAssets: e.rawAssets,
                packedAssets: e.packedAssets,
                md5AssetsMap: e.md5AssetsMap
            });
            var s = e.launchScene;
            cc.director.preloadScene(s, function() {
                cc.director.loadScene(s, function() {
                    console.log("Success to load scene: " + s);
                    cc.loader.onProgress = null
                })
            })
        };
        var O = e.jsList;
        var R = e.debug ? "src/project.d163fedf.js" : "src/project.d163fedf.js";
        if (O) {
            O = O.map(function(e) {
                return "src/" + e
            });
            O.push(R)
        } else {
            O = [R]
        }
        if (cc.sys.isNative && cc.sys.isMobile) {
            O = O.concat(["src/anysdk/jsb_anysdk.js", "src/anysdk/jsb_anysdk_constants.js"])
        }
        var _ = {
            id: "GameCanvas",
            scenes: e.scenes,
            debugMode: e.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
            showFPS: e.debug,
            frameRate: 60,
            jsList: O,
            groupList: e.groupList,
            collisionMatrix: e.collisionMatrix
        };
        cc.game.run(_, A)
    }
    if (window.document) {
        var s = document.createElement("script");
        s.async = true;
        s.src = window._CCSettings.debug ? "cocos2d-js.js" : "cocos2d-js-min.73999.js";
        var c = function() {
            document.body.removeChild(s);
            s.removeEventListener("load", c, false);
            if (typeof VConsole !== "undefined") {
                window.vConsole = new VConsole
            }
            e()
        };
        s.addEventListener("load", c, false);
        document.body.appendChild(s)
    }
})();