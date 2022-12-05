var Ads = {

    leftAdContainer: null,
    rightAdContainer: null,
    minAdWidth: 0,
    minAdHeight: 0,



    initAds: function (w, h) {

        this.leftAdContainer = document.getElementById("left_adContainer");
        this.rightAdContainer = document.getElementById("right_adContainer");

        this.minAdWidth = w;
        this.minAdHeight = h;

        this.setupAds(this.leftAdContainer);
        this.setupAds(this.rightAdContainer);

        //window.addEventListener("resize", Ads.setSizes);
    },

    setupAds: function (adContainer) {
        if (adContainer) {
            // Set the ad container's size and position.
            adContainer.style.width = '160px';
            adContainer.style.height = '600px';

            // Create the ad control and attach event handlers.
            // The applicationId and adUnitId can be obtained from Dev Center.
            // See "Monetize with Ads" at https://msdn.microsoft.com/en-us/library/windows/apps/mt170658.aspx
            var ad = new MicrosoftNSJS.Advertising.AdControl(adContainer, {
                applicationId: '9n53s0cnc5xh',
                adUnitId: '1100041782',
                onErrorOccurred: errorHandler,
                onAdRefreshed: refreshHandler
            });
        }
    },

    setSizes: function () {
        var rect;
        rect = { width: window.innerWidth, height: window.innerHeight };

        if (Ads.minAdWidth > 0) {
            if (rect.width < Ads.minAdWidth) {
                if (Ads.leftAdContainer)
                    Ads.leftAdContainer.style.display = 'none';
                if (Ads.rightAdContainer)
                    Ads.rightAdContainer.style.display = 'none';

            }
            else {
                if (Ads.leftAdContainer)
                    Ads.leftAdContainer.style.display = 'block';
                if (Ads.rightAdContainer)
                    Ads.rightAdContainer.style.display = 'block';
            }
        }

    },

}
// This is an error event handler for the ad control.
function errorHandler(adControl, e) {
    WinJS.log && WinJS.log("An error occurred. " + e.errorCode + ": " + e.errorMessage, "samples", "error");
}

// This is an event handler for the ad control. It is called when the ad is refreshed with a new ad.
function refreshHandler(adControl) {
    WinJS.log && WinJS.log("Advertisement #" + adCount, "samples", "status");
}
