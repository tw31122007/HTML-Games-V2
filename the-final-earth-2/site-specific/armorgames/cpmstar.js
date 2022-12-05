(function() {
    //Init CPMStar
    window.cpmStar = {};
    var serviceCouldBeAvailable = false;

    cpmStar.init = function (onOpenAd, onCloseAd) {
        (function(zonefile) { 
        var rnd = Math.round(Math.random()*999999);
        var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
        var proto = document.location.protocol;
        var host = ( proto == "https:" || proto == "file:")?"https://server":"//cdn";
        if(window.location.hash=="#cpmstarDev") host = "//dev.server";
        if(window.location.hash=="#cpmstarStaging") host = "//staging.server"; 
        s.src = host + ".cpmstar.com/cached/zonefiles/" + zonefile + ".js?rnd="+rnd; 
        var s2=document.getElementsByTagName('script')[0];
        s2.parentNode.insertBefore(s, s2);
        var y=window.location.href.split('#')[0].split('').reduce(function(a,b){return(a<<5)-a+b.charCodeAt(0)>>>1},0);y=(10+((y*7)%26)).toString(36)+y.toString(36);
        var drutObj = window[y] = window[y] || {};
        window.cpmstarAPI = function(o) { (drutObj.cmd = drutObj.cmd || []).push(o); }
        }('198_41_gameapi'));

        cpmstarAPI(function(api) {
            api.game.setContentID("7513S4CA351DB");

            serviceCouldBeAvailable = true;
        });

        cpmstarAPI(function(api) {
            api.game.setTarget(document.body);
        });

        //init the interstitial 
        cpmstarAPI({
            kind:"game.createInterstitial",
            onAdOpened: function(){
                onOpenAd();
            },
            onAdClosed: function(){
                onCloseAd();
            }
        });
    };

    cpmStar.showInterstitial = function() {
        cpmstarAPI("game.displayInterstitial");
    };

    //As far as we know, could there be ads?
    cpmStar.couldBeAvailable = function() {
        return serviceCouldBeAvailable;
    }
})();