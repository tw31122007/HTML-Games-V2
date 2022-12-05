var POKI_DISPATCHER = function() {
    var a = {};
    return {
        addEventListener: function(b, d) {
            a.hasOwnProperty(b) || (a[b] = []);
            a[b].push(d)
        },
        dispatchEvent: function(b, d) {
            this.debug && console.log(b, d);
            for (var c = Object.keys(a), e = 0; e < c.length; e++) {
                var g = c[e];
                if (b == g)
                    for (var g = a[g], f = 0; f < g.length; f++) g[f](d)
            }
        },
        setDebug: function(a) {
            this.debug = a
        }
    }
}();
var POKI_SCRIPT_LOADER = function(a, b, d) {
    d = d || !1;
    var c = function(a, b, d) {
            var c = {
                host: window.location.host || window.location.hostname,
                href: window.location.href,
                pathname: window.location.pathname,
                referrer: document.referrer,
                ref: function(a) {
                    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    a = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(location.search);
                    return null === a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "))
                }("ref")
            };
            a = "https://publishing-api.poki.com/" + a + "?" + function(a) {
                var b = [],
                    c;
                for (c in a) a.hasOwnProperty(c) &&
                    b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                return b.join("&")
            }(c);
            c = new XMLHttpRequest;
            c.open("GET", a, !0);
            c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            c.onreadystatechange = function() {
                if (4 === this.readyState)
                    if (200 <= this.status && 400 > this.status) {
                        var a = JSON.parse(this.responseText);
                        b(a)
                    } else d(this.responseText)
            };
            c.send();
            c = null
        },
        e = function(c) {
            d && console.log(c);
            if ("undefined" !== typeof c.scripts && c.scripts) {
                c = c.scripts;
                for (var e = 0; e < a.length; e++) c.hasOwnProperty(a[e]) ||
                    (c[a[e]] = a[e]);
                for (var f in c) b(c[f])
            } else g(c)
        },
        g = function(c) {
            d && console.error(c);
            for (c = 0; c < a.length; c++) b(a[c])
        },
        f = {
            init: function() {
                c("game/script", e, g)
            }
        };
    f.init();
    return f
};
var poki = {
    ready: "pokiAppReady",
    uninitialized: "pokiAppUninitialized",
    adblocked: "pokiAppAdblocked",
    ads: {
        completed: "pokiAdsCompleted",
        error: "pokiAdsError",
        adblocked: "pokiAdsAdBlocked",
        impression: "pokiAdsImpression",
        limit: "pokiAdsLimit",
        ready: "pokiAdsReady",
        requested: "pokiAdsRequested",
        skipped: "pokiAdsSkipped",
        started: "pokiAdsStarted",
        update: "pokiAdsUpdate",
        paused: "pokiAdsPaused",
        resumed: "pokiAdsResumed",
        busy: "pokiAdsBusy",
        timers: {
            adTry: {
                key: "pokiAdsAdRequestTry",
                value: 7E3
            },
            adBetween: {
                key: "pokiAdsAdRequestBetween",
                value: 12E4
            },
            startAdsAfter: {
                key: "pokiAdsStartAdsAfter",
                value: 0
            }
        },
        position: {
            preroll: "PP",
            midroll: "PM",
            midrollPositive: "PMP",
            midrollNegative: "PMN",
            rewarded: "PR"
        },
        video: {
            clicked: "pokiVideoAdsClicked",
            firstQuartile: "pokiVideoAdsFirstQuartile",
            midPoint: "pokiVideoAdsMidPoint",
            thirdQuartile: "pokiVideoAdsThirdQuartile",
            userClose: "pokiVideoAdsUserClose",
            error: "pokiVideoAdsError"
        }
    },
    distributorInfo: {
        ready: "pokiDistributorInfoReady"
    },
    info: {
        messages: {
            timeLimit: "The ad-request was not processed, because of a time constraint",
            prerollLimit: "The ad-request was cancelled, because we're not allowed to show a preroll"
        }
    }
};
var POKI_ANALYTICS = function() {
    var a = !1,
        b = true,
        d = !1,
        c = {
            init: function() {
                // (function(a, c, b, d, k, l, n) {
                //     a.GoogleAnalyticsObject = k;
                //     a[k] = a[k] || function() {
                //         (a[k].q = a[k].q || []).push(arguments)
                //     };
                //     a[k].l = 1 * new Date;
                //     l = c.createElement(b);
                //     n = c.getElementsByTagName(b)[0];
                //     l.async = 1;
                //     l.src = d;
                //     n.parentNode.insertBefore(l, n)
                // })(window, document, "script", "//www.google-analytics.com/analytics.js", "PokiAnalytics");
                // PokiAnalytics("create", "UA-68704721-1", "auto");
                // a = !0;
                // "undefined" != typeof window.pokiGameTracker &&
                //     (PokiAnalytics("create", window.pokiGameTracker, "auto", {
                //         name: "second"
                //     }), d = !0)
            },
            setDimensions: function(e) {
                a || c.init();
                122 == e.gameId && (b = !0);
                e.hash = e.hash || "";
                e.referenceId = e.referenceId || "";
                e.gameId = e.gameId || "";
                e.gameStudioId = e.gameStudioId || "";
                e.distributorId = e.distributorId || "";
                // PokiAnalytics("set", "dimension1", e.hash);
                // PokiAnalytics("set", "dimension2", e.referenceId);
                // PokiAnalytics("set", "dimension3", e.gameId);
                // PokiAnalytics("set", "dimension4", e.gameStudioId);
                // PokiAnalytics("set", "dimension5", e.distributorId);
                // PokiAnalytics("send", "pageview");
                // d && PokiAnalytics("second.send", "pageview")
            },
            hit: function(e, g, f) {
                // a || c.init();
                // b && (PokiAnalytics("send", "event", e, g, f), d && PokiAnalytics("second.send", "event", e, g, f))
            },
            valueHit: function(e, g, f, h) {
                // a || c.init();
                // b && (PokiAnalytics("send", "event", e, g, f, h), d && PokiAnalytics("second.send", "event", e, g, f, h))
            }
        };
    return c
}();
var POKI_DISTRIBUTOR_INFO = function() {
    var a = {
        logos: [{
            url: "http://static.gamepilot.com/poki-ingame-logos/poki-logo-small.png",
            width: 250,
            height: 124
        }]
    };
    return {
        init: function(b) {
            b = b || {};
            for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]);
            POKI_DISPATCHER.dispatchEvent(poki.distributorInfo.ready)
        },
        getInfo: function() {
            return a
        }
    }
}();
var POKI_AD_TIMINGS = function(a, b) {
    a = a || {};
    var d = new Date,
        c = {};
    c[poki.ads.timers.adTry.key] = a.timePerTry || poki.ads.timers.adTry.value;
    c[poki.ads.timers.adBetween.key] = a.timeBetweenAds || poki.ads.timers.adBetween.value;
    c[poki.ads.timers.startAdsAfter.key] = a.startAdsAfter || poki.ads.timers.startAdsAfter.value;
    var e = a.preroll || !0,
        g = b || !1,
        f = {};
    f[poki.ads.timers.adTry.key] = !1;
    f[poki.ads.timers.adBetween.key] = !1;
    f[poki.ads.timers.startAdsAfter.key] = !1;
    var h = {
        init: function() {},
        restartTimer: function(a, b) {
            0 <
                c[a] && (g && console.info({
                    message: d + " - Restarting timer",
                    key: a,
                    callback: b,
                    timings: c[a]
                }), f[a] = setTimeout(b, c[a]))
        },
        stopTimer: function(a) {
            g && console.info({
                message: d + " - Stopping timer",
                key: a,
                timer: f
            });
            this.checkTimer(a) && (clearTimeout(f[a]), f[a] = !1)
        },
        checkTimer: function(a) {
            g && console.info({
                message: d + " - Checking timer",
                key: a,
                timers: f,
                "return": f[a]
            });
            return f[a]
        },
        checkPreroll: function() {
            return e && !1 === h.checkTimer(poki.ads.timers.startAdsAfter.key) ? !0 : (POKI_DISPATCHER.dispatchEvent(poki.ads.limit, {
                reason: poki.info.messages.prerollLimit
            }), !1)
        },
        errorEvent: function() {
            POKI_DISPATCHER.dispatchEvent(poki.ads.limit, {
                reason: poki.info.messages.timeLimit
            });
            return !1
        }
    };
    h.init();
    return {
        setTimings: function(a) {
            "undefined" !== typeof a ? (c[poki.ads.timers.adTry.key] = a.timePerTry || poki.ads.timers.adTry.value, c[poki.ads.timers.adBetween.key] = a.timeBetweenAds || poki.ads.timers.adBetween.value, c[poki.ads.timers.startAdsAfter.key] = a.startAdsAfter || poki.ads.timers.startAdsAfter.value, e = !1 !== a.preroll) : (c[poki.ads.timers.adTry.key] = poki.ads.timers.adTry.value,
                c[poki.ads.timers.adBetween.key] = poki.ads.timers.adBetween.value, c[poki.ads.timers.startAdsAfter.key] = poki.ads.timers.startAdsAfter.value, e = !0)
        },
        prerollPossible: function() {
            return h.checkPreroll()
        },
        requestPossible: function() {
            g && console.info({
                message: d + " - Check for ad request",
                key: poki.ads.timers.adBetween.key,
                "return": h.checkTimer(poki.ads.timers.adBetween.key) || h.checkTimer(poki.ads.timers.startAdsAfter.key) ? "not possible" : "running ad"
            });
            return h.checkTimer(poki.ads.timers.adBetween.key) || h.checkTimer(poki.ads.timers.startAdsAfter.key) ?
                h.errorEvent() : !0
        },
        waterfallPossible: function() {
            return h.checkTimer(poki.ads.timers.adTry.key) ? !0 : !1
        },
        startTimer: function(a) {
            h.restartTimer(a, function() {
                h.stopTimer(a)
            })
        },
        startBetweenTimer: function() {
            this.startTimer(poki.ads.timers.adBetween.key)
        },
        startWaterfallTimer: function() {
            this.startTimer(poki.ads.timers.adTry.key)
        },
        startAdsAfterTimer: function() {
            g && console.info({
                message: d + " - Called startAdsAfter timer with",
                time: c[poki.ads.timers.startAdsAfter.key]
            });
            this.startTimer(poki.ads.timers.startAdsAfter.key)
        },
        clearTimer: function(a) {
            h.stopTimer(a)
        }
    }
};
var POKI_ADS = function() {
    var a, b = !1,
        d, c, e = 0,
        g = 0,
        f, h, k, l = {},
        n, r, x, m = !1,
        q = !1,
        y = !1,
        t = 0,
        z = "",
        A = {},
        p, u, v, I = window.location.href.split("?"),
        B = encodeURIComponent(I[0]),
        J = encodeURIComponent(B),
        C = !1;
    Array.isArray || (Array.isArray = function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    });
    var K = function(a, c) {
            // var b = document.createElement("script");
            // b.type = "text/javascript";
            // b.async = "async";
            // b.src = a;
            // b.onload = b.onreadystatechange = function() {
            //     this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState ||
            //         ("object" == typeof window.google.ima ? c() : (q = !0, POKI_DISPATCHER.dispatchEvent(poki.ready)), b.onload = b.onreadystatechange = null)
            // };
            // b.onerror = function() {
            //     y = q = !0;
            //     POKI_DISPATCHER.dispatchEvent(poki.adblocked)
            // };
            // var d = document.getElementsByTagName("head")[0];
            // d.appendChild(b, d)
        },
        D = function() {
            var a;
            a = k - (new Date - C - e);
            POKI_DISPATCHER.dispatchEvent(poki.ads.update, {
                duration: k,
                remaining: Math.max(0, a),
                percentageComplete: Math.min(100, 100 - a / k * 100)
            });
            0 > a && (clearInterval(c), h || POKI_VIDEO_ADS.nonLinearCompleted())
        },
        L =
        function() {
            POKI_DISPATCHER.addEventListener(poki.ads.started, function(a) {
                C = new Date;
                k = (h = a.isLinear) ? a.remainingTime : 15E3;
                b = !0;
                c = setInterval(D, d)
            });
            POKI_DISPATCHER.addEventListener(poki.ads.error, function(a) {
                b = !1
            });
            POKI_DISPATCHER.addEventListener(poki.ads.paused, function() {
                h && clearInterval(c);
                g = new Date;
                f.style.display = "block"
            });
            POKI_DISPATCHER.addEventListener(poki.ads.resumed, function() {
                e += new Date - g;
                h ? c = setInterval(D, d) : e = 0
            });
            POKI_DISPATCHER.addEventListener(poki.ads.completed, function(a) {
                b = !1;
                clearInterval(c);
                m.clearTimer(poki.ads.timers.adTry.key);
                m.startBetweenTimer()
            });
            f.addEventListener("click", function() {
                f.style.display = "none";
                POKI_VIDEO_ADS.resume()
            })
        },
        E = function(a, b) {
            if (m.waterfallPossible()) {
                z = a;
                A = b;
                t++;
                b.waterfall = t;
                var c;
                c = a;
                var d = "",
                    e;
                for (e in b)
                    if (b.hasOwnProperty(e)) {
                        var h = b[e];
                        Array.isArray(h) && (h = h.join());
                        d += e + "=" + h + "&"
                    }
                d = d.replace(/=/g, "%3D");
                d = d.replace(/&/g, "%26");
                d = d.replace(/,/g, "%2C");
                c = (c + ("&cust_params=" + d + "&")).split("{url}").join(B);
                c = c.split("{descriptionUrl}").join(J);
                c = c.split("{timestamp}").join((new Date).getTime());
                POKI_VIDEO_ADS.loadVideoAd(c)
            }
        },
        M = function() {
            var a = navigator.userAgent,
                c, b = a.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(b[1])) return c = /\brv[ :]+(\d+)/g.exec(a) || [], {
                name: "IE",
                version: c[1] || ""
            };
            if ("Chrome" === b[1] && (c = a.match(/\bOPR\/(\d+)/), null != c)) return {
                name: "Opera",
                version: c[1]
            };
            b = b[2] ? [b[1], b[2]] : [navigator.appName, navigator.appVersion, "-?"];
            null != (c = a.match(/version\/(\d+)/i)) && b.splice(1, 1,
                c[1]);
            return {
                name: b[0],
                version: b[1]
            }
        },
        F = function(a) {
            a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            a = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(location.search);
            return null === a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "))
        },
        N = function(a, b, c) {
            if (p) {
                var d = G();
                d.adTiming.startAdsAfter = 1E4;
                b(d)
            } else {
                var e = !1;
                window.XDomainRequest ? d = new XDomainRequest : window.XMLHttpRequest ? (d = new XMLHttpRequest, e = !0) : d = new ActiveXObject("Microsoft.XMLHTTP");
                d.open("POST", a, !0);
                e && d.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                d.onprogress = function() {};
                d.onreadystatechange = function() {
                    if (4 === this.readyState)
                        if (200 <= this.status && 400 > this.status) {
                            var a = JSON.parse(this.responseText);
                            b(a)
                        } else c()
                };
                a = {
                    host: window.location.host || window.location.hostname,
                    href: window.location.href,
                    pathname: window.location.pathname,
                    referrer: document.referrer,
                    "ref-id": F("ref")
                };
                // d.send(function(a) {
                //     var b = [],
                //         c;
                //     for (c in a) a.hasOwnProperty(c) && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                //     return b.join("&")
                // }(a));
                d = null
            }
        },
        O = function() {
            POKI_DISPATCHER.addEventListener(poki.ads.video.error,
                function(a) {
                    3 > t && m.waterfallPossible() ? E(z, A) : (POKI_DISPATCHER.dispatchEvent(poki.ads.error, {
                        message: "No Ads"
                    }), POKI_DISPATCHER.dispatchEvent(poki.ads.completed))
                });
            K("./ima3.js", function() {
                // POKI_VIDEO_ADS.initVideoApp(a, n, r);
                q = !0;
                POKI_DISPATCHER.dispatchEvent(poki.ready)
            });
            L()
        },
        P = function() {
            POKI_ANALYTICS.hit("Ad-system", "Setup-failed")
        },
        H = function(a) {
            l.partner = a.partner;
            l.location = a.location;
            l.pdata = a.hash;
            m ? m.setTimings(a.adTiming) : m = new POKI_AD_TIMINGS(a.adTiming);
            m.startAdsAfterTimer();
            x = a.adTagUrl;
            "G1L1" != a.hash && (POKI_ANALYTICS.setDimensions({
                hash: a.hash,
                referenceId: F("ref"),
                gameId: a.gameId,
                gameStudioId: a.gameStudioId,
                distributorId: a.distributorId
            }), POKI_ANALYTICS.hit("Ad-system", "Setup-completed"), "undefined" !== typeof a.logos && a.logos ? POKI_DISTRIBUTOR_INFO.init({
                logos: a.logos
            }) : POKI_DISTRIBUTOR_INFO.init())
        },
        G = function() {
            return {
                partner: "Poki Generic",
                domain: "Poki Generic",
                hash: "G1L1",
                generic: "yes",
                adTagUrl: "",
                adTiming: {
                    preroll: !0,
                    timeBetweenAds: 12E4,
                    timePerTry: 7E3,
                    startAdsAfter: 0
                }
            }
        },
        w = function() {
            // POKI_DISPATCHER.dispatchEvent(poki.uninitialized, {});
            console.error("Initialize the SDK before calling Poki-Ads functions")
        };
    return {
        init: function(b) {
            POKI_ANALYTICS.init({});
            var c = M();
            b = b || {};
            p = b.debug || !1;
            u = b.rectangle || b.staticAd || !1;
            v = b.leaderboard || !1;
            a = document.getElementById(b.container || "poki-sdk-container");
            n = b.width || 640;
            r = b.height || 480;
            d = b.timeUpdateInterval || 1E3;
            if (null == a || "undefined" == typeof a) console.error("POKI-SDK: containerDiv (poki-sdk-container) not found");
            else if ("MSIE" != c.name || 8 != c.version) POKI_DISPATCHER.setDebug(p), a.style.width = n + "px", a.style.height = r + "px", a.style.zIndex = 9999, f = document.createElement("div"), f.className = "poki-play-container", f.style.width = parseInt(n) + "px", f.style.height = parseInt(r) + "px", b = document.createElement("div"), b.id = "pauseButton", b.className = "poki-play-button", f.appendChild(b), a.appendChild(f), b = document.createElement("style"), b.styleSheet ? b.styleSheet.cssText = '.poki-play-container{display:none;position:absolute;background-color:rgba(0,0,0,.5)}.poki-play-button{height:80px;width:130px;background-color:#282a2e;border-radius:15px;position:relative;left:50%;top:50%;margin-left:-65px;margin-top:-40px}.poki-play-button:hover{background-color:#439ed5}.poki-play-button:after{content:"";display:block;position:absolute;top:23px;left:53px;margin:0 auto;border-style:solid;border-width:18px 0 18px 34px;border-color:transparent transparent transparent rgba(255,255,255,1)}' :
                b.appendChild(document.createTextNode('.poki-play-container{display:none;position:absolute;background-color:rgba(0,0,0,.5)}.poki-play-button{height:80px;width:130px;background-color:#282a2e;border-radius:15px;position:relative;left:50%;top:50%;margin-left:-65px;margin-top:-40px}.poki-play-button:hover{background-color:#439ed5}.poki-play-button:after{content:"";display:block;position:absolute;top:23px;left:53px;margin:0 auto;border-style:solid;border-width:18px 0 18px 34px;border-color:transparent transparent transparent rgba(255,255,255,1)}')),
                document.getElementsByTagName("head")[0].appendChild(b), H(G()), N("//publishing-api.poki.com/game/hit", H, P), O()
        },
        requestAd: function(a) {
            if (q)
                if (y) POKI_DISPATCHER.dispatchEvent("poki.ads.error", {
                    message: "Adblocker has been detected"
                });
                else if (b) POKI_DISPATCHER.dispatchEvent("poki.ads.busy");
            else {
                a = a || {};
                a.position = a.position || null;
                var c = a.debug || !1;
                p && c && (u = "rectangle" == c, v = "leaderboard" == c);
                var c = a.criteria || {},
                    d = a.adUrl || x;
                if (null === a.position) console.error("POKI-SDK: position has not been set");
                else {
                    var e;
                    a: {
                        e = poki.ads.position;
                        for (var h = a.position, f = Object.keys(e), g = 0; g < f.length; g++)
                            if (e[f[g]] == h) {
                                e = !0;
                                break a
                            }
                        e = !1
                    }
                    if (!e) console.error("POKI-SDK: position unknown, pick one from poki.ads.position");
                    else if ((a.position != poki.ads.position.preroll || m.prerollPossible()) && m.requestPossible()) {
                        p && u ? l.debug = "ad-sdk-test-rectangle" : p && v ? l.debug = "ad-sdk-test-leaderboard" : p && (l.debug = "ad-sdk-test-video");
                        e = {};
                        for (var k in l) e[k] = l[k];
                        for (k in c) e[k] = c[k];
                        e.position = a.position;
                        t = 0;
                        m.startWaterfallTimer();
                        POKI_ANALYTICS.hit("Ad-system",
                            "Ad-request");
                        E(d, e)
                    }
                }
            } else w()
        },
        resize: function(b, c) {
            q ? (POKI_VIDEO_ADS.resize(b, c), a.style.width = parseInt(b) + "px", a.style.height = parseInt(c) + "px", f.style.width = parseInt(b) + "px", f.style.height = parseInt(c) + "px") : w()
        },
        startAd: function() {
            q ? (POKI_ANALYTICS.hit("Ad-system", "Ad-start-playback"), POKI_VIDEO_ADS.startPlayback()) : w()
        }
    }
}();
var POKI_POST_MESSAGE_WRAPPER = function(a) {
    var b = [];
    window.onmessage = function(a) {
        for (var c = 0; c < b.length; c++) b[c](a.data, a.source)
    };
    return {
        send: function(b) {
            a.postMessage(b, "*")
        },
        onReceive: function(a) {
            b.push(a)
        }
    }
};
var Ads = function(a, b) {
    this.scale = 1;
    this.currentAd = null;
    this.application_ = a;
    this.videoPlayer_ = b;
    this.contentCompleteCalled_ = !1;
    google.ima.settings.setVpaidAllowed(!0);
    this.adDisplayContainer_ = new google.ima.AdDisplayContainer(this.videoPlayer_.adContainer);
    this.adsLoader_ = new google.ima.AdsLoader(this.adDisplayContainer_);
    this.adsLoader_.getSettings().setPlayerType("h5_vsi");
    this.adsManager_ = null;
    this.adsLoader_.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded_, !1, this);
    this.adsLoader_.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError_, !1, this)
};
Ads.prototype.initialUserAction = function() {
    this.adDisplayContainer_.initialize()
};
Ads.prototype.requestAds = function(a) {
    var b = new google.ima.AdsRequest;
    b.adTagUrl = a;
    b.linearAdSlotWidth = this.videoPlayer_.width;
    b.linearAdSlotHeight = this.videoPlayer_.height;
    b.nonLinearAdSlotWidth = this.videoPlayer_.width * this.scale;
    b.nonLinearAdSlotHeight = this.videoPlayer_.height * this.scale;
    b.forceNonLinearFullSlot = !0;
    this.adsLoader_.requestAds(b)
};
Ads.prototype.pause = function() {
    this.adsManager_ && this.adsManager_.pause()
};
Ads.prototype.resume = function() {
    this.adsManager_ && this.adsManager_.resume()
};
Ads.prototype.resize = function(a, b, d) {
    d = d || google.ima.ViewMode.NORMAL;
    this.adsManager_ && (this.videoPlayer_.adContainer.querySelector("div"), this.adsManager_.resize(this.videoPlayer_.width, this.videoPlayer_.height, d))
};
Ads.prototype.contentEnded = function() {
    this.contentCompleteCalled_ = !0;
    this.adsLoader_.contentComplete()
};
Ads.prototype.onAdsManagerLoaded_ = function(a) {
    var b = new google.ima.AdsRenderingSettings;
    b.mimeTypes = ["video/mp4", "video/webm", "video/ogg", "audio/mp4"];
    this.adsManager_ = a.getAdsManager(this.videoPlayer_, b);
    this.application_.onAdLoaded()
};
Ads.prototype.startPlayback = function() {
    this.startAdManagerAndVideo()
};
Ads.prototype.startAdManagerAndVideo = function() {
    this.adsManager_.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested_, !1, this);
    this.adsManager_.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested_, !1, this);
    this.adsManager_.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError_, !1, this);
    var a = [google.ima.AdEvent.Type.AD_BREAK_READY, google.ima.AdEvent.Type.AD_METADATA, google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            google.ima.AdEvent.Type.CLICK, google.ima.AdEvent.Type.COMPLETE, google.ima.AdEvent.Type.EXPANDED_CHANGED, google.ima.AdEvent.Type.FIRST_QUARTILE, google.ima.AdEvent.Type.IMPRESSION, google.ima.AdEvent.Type.LOADED, google.ima.AdEvent.Type.LOG, google.ima.AdEvent.Type.MIDPOINT, google.ima.AdEvent.Type.PAUSED, google.ima.AdEvent.Type.RESUMED, google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, google.ima.AdEvent.Type.SKIPPED, google.ima.AdEvent.Type.STARTED, google.ima.AdEvent.Type.THIRD_QUARTILE, google.ima.AdEvent.Type.USER_CLOSE,
            google.ima.AdEvent.Type.VOLUME_CHANGED, google.ima.AdEvent.Type.VOLUME_MUTED
        ],
        b;
    for (b in a) this.adsManager_.addEventListener(a[b], this.onAdEvent_, !1, this);
    this.application_.fullscreen ? (a = this.application_.fullscreenWidth, b = this.application_.fullscreenHeight) : (a = this.videoPlayer_.width * this.scale, b = this.videoPlayer_.height * this.scale);
    this.adsManager_.init(a, b, google.ima.ViewMode.NORMAL);
    this.adsManager_.start()
};
Ads.prototype.onContentPauseRequested_ = function(a) {
    this.application_.pauseForAd()
};
Ads.prototype.onContentResumeRequested_ = function(a) {
    this.contentCompleteCalled_ || this.application_.resumeAfterAd()
};
Ads.prototype.onAdEvent_ = function(a) {
    switch (a.type) {
        case google.ima.AdEvent.Type.CLICK:
            this.adsManager_.pause();
            this.application_.onAdClicked();
            break;
        case google.ima.AdEvent.Type.LOADED:
            var b = a.getAd();
            this.currentAd = b;
            b.isLinear() ? this.resize(this.videoPlayer_.width, this.videoPlayer_.height) : this.resize(b.getWidth(), b.getHeight());
            break;
        case google.ima.AdEvent.Type.STARTED:
            a.remainingTime = this.adsManager_.getRemainingTime();
            a.isLinear = a.getAd().isLinear();
            a.isLinear || (b = a.getAd(), a.adWidth = b.getWidth(),
                a.adHeight = b.getHeight()); - 1 == a.remainingTime && (a.isLinear = !1);
            this.application_.onAdStarted(a);
            break;
        case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
        case google.ima.AdEvent.Type.COMPLETE:
        case google.ima.AdEvent.Type.USER_CLOSE:
            this.application_.onAdClosed(a);
            this.currentAd = null;
            break;
        default:
            this.application_.onAdEvent(a)
    }
};
Ads.prototype.onAdError_ = function(a) {
    this.application_.resumeAfterAd();
    "undefined" != typeof this.adsManager_ && null != this.adsManager_ && this.adsManager_.destroy();
    this.application_.onAdError(a.getError().toString());
    this.application_.log("Ad error: " + a.getError().toString())
};
var Application = function(a, b, d, c) {
    this.dispatcher = a;
    this.initVars();
    this.videoPlayer_ = new VideoPlayer(b, d, c);
    this.ads_ = new Ads(this, this.videoPlayer_);
    this.videoEndedCallback_ = this.bind_(this, this.onContentEnded_)
};
Application.prototype.initVars = function() {
    this.fullscreen = this.adsDone_ = this.adsActive_ = this.playing_ = !1
};
Application.prototype.log = function(a) {};
Application.prototype.resumeAfterAd = function() {
    this.adsActive_ = !1;
    this.initVars()
};
Application.prototype.pauseForAd = function() {
    this.playing_ = this.adsActive_ = !0
};
Application.prototype.bind_ = function(a, b) {
    return function() {
        b.apply(a, arguments)
    }
};
Application.prototype.requestAd = function(a) {
    this.adTagUrl = a;
    this.adsDone_ ? (this.adsActive_ && (this.playing_ ? this.ads_.pause() : this.ads_.resume()), this.playing_ = !this.playing_) : (this.ads_.initialUserAction(), this.loadAds_(), this.adsDone_ = !0)
};
Application.prototype.loadAds_ = function() {
    this.ads_.requestAds(this.adTagUrl)
};
Application.prototype.onContentEnded_ = function() {
    this.ads_.contentEnded();
    this.dispatcher.adClosed()
};
Application.prototype.resize = function(a, b) {
    this.videoPlayer_.resize(a, b);
    this.ads_.resize(a, b)
};
Application.prototype.resume = function() {
    this.ads_.resume()
};
Application.prototype.startPlayback = function() {
    this.ads_.startPlayback()
};
Application.prototype.onAdStarted = function(a) {
    this.dispatcher.adStarted(a)
};
Application.prototype.onAdLoaded = function(a) {
    this.dispatcher.adLoaded(a)
};
Application.prototype.onAdClicked = function(a) {
    this.dispatcher.adClicked(a)
};
Application.prototype.onAdClosed = function(a) {
    this.ads_.contentEnded();
    this.dispatcher.adClosed(a);
    this.initVars()
};
Application.prototype.onAdError = function(a) {
    this.ads_.contentEnded();
    this.dispatcher.adError(a);
    this.initVars()
};
Application.prototype.onAdEvent = function(a) {
    this.dispatcher.adEvent(a)
};
var VideoPlayer = function(a, b, d) {
    this.adContainer = a;
    this.width = b;
    this.height = d
};
VideoPlayer.prototype.currentTime = 0;
VideoPlayer.prototype.resize = function(a, b) {
    this.width = a;
    this.height = b
};
var POKI_VIDEO_ADS = function() {
    var a, b = !0,
        d = function(a, b) {
            POKI_DISPATCHER.dispatchEvent(a, b)
        };
    return {
        initVideoApp: function(b, d, g) {
            a = new Application(this, b, d, g)
        },
        loadVideoAd: function(c) {
            a.requestAd(c);
            b = !0;
            d(poki.ads.requested)
        },
        resize: function(b, d) {
            a && a.resize(b, d)
        },
        resume: function() {
            a && a.resume();
            d(poki.ads.resumed)
        },
        startPlayback: function() {
            a.startPlayback()
        },
        nonLinearCompleted: function() {
            a.onAdClosed()
        },
        adLoaded: function(a) {
            d(poki.ads.ready)
        },
        adStarted: function(a) {
            var b = 1E3 * a.remainingTime;
            a.isLinear ?
                POKI_ANALYTICS.hit("Ad-system", "Ad-type-video") : (b = 15E3, POKI_ANALYTICS.hit("Ad-system", "Ad-type-linear"));
            d(poki.ads.started, {
                isLinear: a.isLinear,
                remainingTime: b,
                adWidth: a.adWidth,
                adHeight: a.adHeight
            })
        },
        adClosed: function(a) {
            b && (d(poki.ads.completed), POKI_ANALYTICS.hit("Ad-system", "Ad-completed"), b = !1)
        },
        adClicked: function(a) {
            POKI_ANALYTICS.hit("Ad-system", "Ad-clicked");
            d(poki.ads.video.clicked)
        },
        adError: function(a) {
            POKI_ANALYTICS.hit("Ad-system", "Ad-error");
            d(poki.ads.video.error, {
                message: a || "Unknown"
            })
        },
        adEvent: function(a) {
            switch (a.type) {
                case google.ima.AdEvent.Type.FIRST_QUARTILE:
                    d(poki.ads.video.firstQuartile, {});
                    break;
                case google.ima.AdEvent.Type.MIDPOINT:
                    d(poki.ads.video.midPoint, {});
                    break;
                case google.ima.AdEvent.Type.PAUSED:
                    d(poki.ads.paused, {});
                    break;
                case google.ima.AdEvent.Type.THIRD_QUARTILE:
                    d(poki.ads.video.thirdQuartile, {});
                    break;
                case google.ima.AdEvent.Type.SKIPPED:
                    POKI_ANALYTICS.hit("Ad-system", "Ad-skipped");
                    d(poki.ads.skipped, {});
                    break;
                case google.ima.AdEvent.Type.IMPRESSION:
                    d(poki.ads.impression, {})
            }
        }
    }
}();
var POKI_GAME_SCORE = function(a, b) {
    a = a || !1;
    b = b || window.top;
    var d = !1,
        c = !1;
    "undefined" === typeof console.log && (console.log = function() {});
    var e = {},
        g = {
            init: function() {
                d || (d = new POKI_POST_MESSAGE_WRAPPER(b), d.onReceive(this.receiveMessage), c = d, top !== window && f.bridge())
            },
            sendMessage: function(a) {
                c.send(a)
            },
            receiveMessage: function(b, c) {
                "undefined" !== typeof f.events[b.event] && (a && console.log("Receiving message", b), b.event === f.events.bridge.key ? (g.updateSendSocket(c), a && console.log("A bridge has been established with",
                    c)) : g.fire(b.event, b.data))
            },
            updateSendSocket: function(a) {
                c = new POKI_POST_MESSAGE_WRAPPER(a);
                c.onReceive(this.receiveMessage)
            },
            fire: function(b, c) {
                if ("undefined" !== typeof f.events[b] && "undefined" !== typeof e[b]) {
                    a && console.log("Fireing [" + b + "] with data:", c);
                    for (var d = 0; d < e[b].length; d++) e[b][d](c)
                }
            }
        },
        f = {
            send: function(a, b) {
                try {
                    var c = a.key
                } catch (d) {
                    console.log('POKI_GAME_SCORE: Error, event object has not got the "key" property', a, b);
                    return
                }
                b = b || {};
                if ("undefined" !== typeof this.events[c]) {
                    for (var e = this.events[c].structure,
                        f = 0; f < e.length; f++)
                        if (!b.hasOwnProperty(e[f])) {
                            console.log("POKI_GAME_SCORE: Error, data structure is not what is expected, received", b, "expected keys:", e);
                            return
                        }
                    g.sendMessage({
                        event: c,
                        data: b
                    })
                }
            },
            addEventListener: function(a, b) {
                "undefined" === typeof a || "undefined" === typeof a.key || "undefined" === typeof this.events[a.key] ? console.log("POKI_GAME_SCORE: Error, cannot listen to unknown event, received", a, ", available events: pokiGameScore.events[", this.events, "]") : "undefined" !== typeof e[a.key] ? e[a.key].push(b) :
                    e[a.key] = [b]
            },
            bridge: function() {
                this.send(f.events.bridge)
            },
            events: {
                gameInitialized: {
                    key: "gameInitialized",
                    structure: []
                },
                gameCompleted: {
                    key: "gameCompleted",
                    structure: []
                },
                levelInitialized: {
                    key: "levelInitialized",
                    structure: ["world", "level"]
                },
                levelCompleted: {
                    key: "levelCompleted",
                    structure: "world level highscore score stars success".split(" ")
                },
                rating: {
                    key: "rating",
                    structure: ["score"]
                },
                bridge: {
                    key: "bridge",
                    structure: []
                }
            }
        };
    g.init();
    return f
};