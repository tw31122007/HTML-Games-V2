let requesting = false;
window.createVideoAd = (e => {
    if (requesting) return console.log("前一个广告正在加载中");
    requesting = false;
    console.log("即将播放广告");
    if (e) {
        window.__adErrorCallback = window.__adFinishedCallback = (() => {
            setTimeout(() => {
                e()
            }, 100)
        })
    }
    gdsdk.showBanner()
});
window["GD_OPTIONS"] = {
    gameId: "9faec663ce9b4b1ba4fa6bee4abc53cd",
    onEvent: function(e) {
        console.log("event,name", e.name);
        switch (e.name) {
            case "SDK_GAME_START":
                setTimeout(() => {
                    requesting = false;
                    (window.__adFinishedCallback || (() => {
                        console.log("adFinished")
                    }))();
                    window.__adErrorCallback = null
                }, 100);
                break;
            case "SDK_GAME_PAUSE":
                break;
            case "SDK_GDPR_TRACKING":
                break;
            case "SDK_GDPR_TARGETING":
                break;
            case "STARTED":
                (window.__adStartCallback || (() => {
                    console.log("adStarted")
                }))();
                break;
            case "AD_SDK_FINISHED":
                setTimeout(() => {
                    requesting = false;
                    (window.__adFinishedCallback || (() => {
                        console.log("adFinished")
                    }))();
                    window.__adErrorCallback = null
                }, 100);
                break;
            case "AD_SDK_CANCEL":
            case "AD_CANCELED":
                setTimeout(() => {
                    (window.__adErrorCallback || (() => {
                        console.log("adError")
                    }))();
                    window.__adErrorCallback = null
                }, 100);
                break
        }
    }
};
(function(e, a, o) {
    var n, l = e.getElementsByTagName(a)[0];
    if (e.getElementById(o)) return;
    n = e.createElement(a);
    n.id = o;
    n.src = "main.js?1";
    n.onload = (() => {
        console.log("jsloaded")
    });
    e.head.appendChild(n)
})(document, "script", "gamedistribution-jssdk");