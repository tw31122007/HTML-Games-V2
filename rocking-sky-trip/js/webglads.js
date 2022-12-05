var time = new Date(Date.now());
var adsControl = 0;

window.SkipAd = function() {

    var stop = false;
    if (typeof jQuery !== 'undefined') {
        stop = true;
        removeAdvert();
    }

    if (!stop)
        setTimeout(window.SkipAd, 500);
}

window.ShowAd = function() {

    //console.log('window.ShowAd');

    var stop = false;
    if (typeof jQuery !== 'undefined') {

        adsControl++;

        if (adsControl != 1) {
            if (!canShowAds(30))
                return;
        }

        stop = true;
        insertAdvert();

    }

    if (!stop)
        setTimeout(window.ShowAd, 500);
}

function insertAdvert() {
    var gs = getGoogleString();
    $(".googleadgoeshere").append(gs);
}


function removeAdvert() {
    //remove ads irrespective of the Ad type
    if ($('.googleadgoeshere').length) {
        $(".googleadgoeshere").empty();
    }

    if ($('.googleadgoeshereOverlay').length) {
        $(".googleadgoeshereOverlay").empty();
    }

    if ($('.googleadgoeshereTimerAd').length) {
        $(".googleadgoeshereTimerAd").empty();
    }
}

window.SkipAdOverlay = function() {

    var stop = false;
    if (typeof jQuery !== 'undefined') {
        stop = true;
        removeAdvertOverlay();
    }

    if (!stop)
        setTimeout(window.SkipAdOverlay, 500);
}

window.ShowAdOverlay = function() {

    //console.log('window.ShowAdOverlay');

    var stop = false;
    if (typeof jQuery !== 'undefined') {

        adsControl++;

        if (adsControl != 1) {
            if (!canShowAds(30))
                return;
        }

        stop = true;
        insertAdvertOverlay();

    }

    if (!stop)
        setTimeout(window.ShowAdOverlay, 500);
}

function insertAdvertOverlay() {
    var gs = getGoogleStringOverlay();
    $(".googleadgoeshereOverlay").append(gs);
}


function removeAdvertOverlay() {
    if ($('.googleadgoeshere').length) {
        $(".googleadgoeshere").empty();
    }

    if ($('.googleadgoeshereOverlay').length) {
        $(".googleadgoeshereOverlay").empty();
    }

    if ($('.googleadgoeshereTimerAd').length) {
        $(".googleadgoeshereTimerAd").empty();
    }
}

window.SkipAdTimerAd = function() {

    var stop = false;
    if (typeof jQuery !== 'undefined') {
        stop = true;
        removeAdvertTimerAd();
    }

    if (!stop)
        setTimeout(window.SkipAdTimerAd, 500);
}

window.ShowAdTimerAd = function() {

    //console.log('window.ShowAdTimerAd');

    var stop = false;
    if (typeof jQuery !== 'undefined') {

        adsControl++;

        if (adsControl != 1) {
            if (!canShowAds(30))
                return;
        }

        stop = true;
        insertAdvertTimerAd();

    }

    if (!stop)
        setTimeout(window.ShowAdTimerAd, 500);
}

function showAdWithSkip() {
    // must happen first to insert the framework for other inserts
    window.setTimeout(insertAdvertTimerAd(), 100);

    // add skip timer text
    window.setTimeout(function() {
        insertSkipTimer(5000);
    }, 200);
    window.setTimeout(function() {
        insertSkipTimer(4000);
    }, 1000);
    window.setTimeout(function() {
        insertSkipTimer(3000);
    }, 2000);
    window.setTimeout(function() {
        insertSkipTimer(2000);
    }, 3000);
    window.setTimeout(function() {
        insertSkipTimer(1000);
    }, 4000);

    // add skip button and remove skip timer text
    window.setTimeout(insertSkipButton, 5000);
}

function insertSkipTimer(_value) {
    var st = '<br><br>' +
        '<p style="color:white;background:transparent;border: none;top:5%;right:4.2%;position:fixed;>' +
        '<font face="Arial" size="4">' +
        'Skip Advertisement in ' + Math.floor(_value / 1000) +
        '<\/font>' +
        '<\/p>';
    $(".skiptimergoeshere").empty();
    $(".skiptimergoeshere").append(st);
}

function insertSkipButton() {
    var ss =
        '<button onclick="window.SkipAd()" style="background:transparent;border: none;top:5%;right:4.2%;position:fixed;">' +
        '<img src="skip.png" style="background:transparent;border: none;width:38px; height:38px;"><\/button>';
    $(".skipbuttongoeshere").append(ss);
    $(".skiptimergoeshere").empty();
}

function insertAdvertTimerAd() {
    var gs = getGoogleStringTimerAd();
    $(".googleadgoeshereTimerAd").append(gs);
}


function removeAdvertTimerAd() {
    //remove ads irrespective of the Ad type
    if ($('.googleadgoeshere').length) {
        $(".googleadgoeshere").empty();
    }

    if ($('.googleadgoeshereOverlay').length) {
        $(".googleadgoeshereOverlay").empty();
    }

    if ($('.googleadgoeshereTimerAd').length) {
        $(".googleadgoeshereTimerAd").empty();
    }

}

function canShowAds(diff) {
    var dateNow = new Date(Date.now());
    var diffSeconds = (dateNow - time) / 1000;

    //console.log(diffSeconds);

    if (diffSeconds > diff) {
        time = dateNow;
        return true;
    } else {
        return false;
    }
}

function getGoogleString()
{
    return (
        '<div style="position:absolute; top: 0; left: 0; background-color:black; z-index:2147483647; overflow:auto; width:100%; height:100%; pointer-events:auto;">' +
        '<div>' +
            '<button onclick="window.SkipAd()" style="background:transparent;border: none;top:5%;right:4.2%;position:fixed;">' +
            '<img src="skip.png" style="background:transparent;border: none;width:38px; height:38px;"><\/button>' +
        '<\/div>'+
            '<div style="text-align:center;position: relative;' +
                'top:30%;' +
                'z-index:2147483648;">' +
                '<div>' +
                    '<script async src="\/\/pagead2.googlesyndication.com\/pagead\/js\/adsbygoogle.js"><\/script>' +
                    '<!-- MW Car 300x250 -->' +
                    '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px;" data-ad-client="ca-pub-6129580795478709" data-ad-slot="7360591927"><\/ins>' +
                    '<script>' +
                        '(adsbygoogle = window.adsbygoogle || []).push({});' +
                    '<\/script>' +
                '<\/div>' +
            '<\/div>' +
        '<\/div>'
    );
}

function getGoogleStringOverlay()
{
      return (
        '<div style="position:absolute; top: 0; left: 0; background-color:rgba(0,0,0,0); z-index:2147483647; overflow:auto; width:100%; height:100%; pointer-events:none;">' +
            '<div style="text-align:center;position: relative;' +
                'top:30%;' +
                'z-index:2147483648;">' +
                '<div>' +
                    '<script async src="\/\/pagead2.googlesyndication.com\/pagead\/js\/adsbygoogle.js"><\/script>' +
                    '<!-- MW 300x250 Ad -->' +
                    '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px;pointer-events:auto" data-ad-client="ca-pub-6129580795478709" data-ad-slot="7360591927"><\/ins>' +
                    '<script>' +
                        '(adsbygoogle = window.adsbygoogle || []).push({});' +
                    '<\/script>' +
                '<\/div>' +
            '<\/div>' +
        '<\/div>'
    );
}

function getGoogleStringTimerAd() {
    return (
        '<div style="position:absolute; top: 0; left: 0; background-color:black; z-index:2147483647; overflow:auto; width:100%; height:100%; pointer-events:auto;">' +
        '<div class="skipbuttongoeshere">' +
        '<\/div>' +
        '<div class="skiptimergoeshere">' +
        '<\/div>' +
        '<div style="text-align:center;position: relative;' +
        'top:30%;' +
        'z-index:2147483648;">' +
        '<div>' +
        '<script async src="\/\/pagead2.googlesyndication.com\/pagead\/js\/adsbygoogle.js"><\/script>' +
        '<!-- MW 300x250 -->' +
        '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px;" data-ad-client="ca-pub-6129580795478709" data-ad-slot="7360591927"><\/ins>' +
        '<script>' +
        '(adsbygoogle = window.adsbygoogle || []).push({});' +
        '<\/script>' +
        '<\/div>' +
        '<\/div>' +
        '<\/div>'
    );
}