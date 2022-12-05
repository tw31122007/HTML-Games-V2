// 有关“空白”模板的简介，请参阅以下文档:
// https://go.microsoft.com/fwlink/?LinkId=232509

(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var isFirstActivation = true;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.voiceCommand) {
            // TODO: 处理相关的 ActivationKinds。例如，如果你的应用可通过语音命令启动，
            //可在此决定是填充输入字段还是选择其他初始视图。
        }
        else if (args.detail.kind === activation.ActivationKind.launch) {
            // 当用户通过磁贴启动你的应用时，即发生启动激活
            // 或通过单击或点击正文调用 toast 通知。
            if (args.detail.arguments) {
                // TODO: 如果应用支持 toast，请使用 toast 有效负载中的此值来确定在应用中
                //响应调用 toast 通知的用户时应将其转到的位置。
            }
            else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
                // TODO: 此应用程序被挂起，稍后又终止了它以回收内存。
                // 若要创造顺畅的用户体验，请在此处还原应用程序状态，使应用似乎永不停止运行。
                // 注意: 可能需要记录应用上次被挂起的时间，并仅当它们在短期内返回时才还原状态。
            }
        }

        if (!args.detail.prelaunchActivated) {
            // TODO: 如果 prelaunchActivated 为 true, 则意味着应用已在背景中预启动以进行优化。
            // 在这种情况下，它会在不久之后被挂起。
            // 任何长时间运行的操作(例如成本高昂的网络或磁盘 I/O)或启动时发生的用户状态更改
            // 都应该在此处完成(以避免在预启动时执行)。
            // 或者，也可以在简历或者 visibilitychanged 处理程序中完成此项工作。
        }

        if (isFirstActivation) {
            // TODO: 应用已激活但尚未运行。在此进行常规启动初始化。
            document.addEventListener("visibilitychange", onVisibilityChanged);
            args.setPromise(WinJS.UI.processAll());

            window.setLaunchScreen();
            Ads.initAds();
            //IntersititialAds.SetupAds();

            document.getElementById("webview").addEventListener("MSWebViewScriptNotify", LevelComplete);
        }

        isFirstActivation = false;
    };

    function onVisibilityChanged(args) {
        if (!document.hidden) {
            // TODO: 应用已可见。现可刷新视图。
        }
    }

    app.oncheckpoint = function (args) {
        // TODO: 此应用程序将被挂起。请在此保存需要挂起中需要保存的任何状态。
        //你可以使用 WinJS.Application.sessionState 对象，该对象在挂起中会自动保存和还原。
        //如果需要在应用程序被挂起之前完成异步操作，请调用 args.setPromise()。
    };

    app.start();

})();



function setLaunchScreen() {
    var ViewManagement = Windows.UI.ViewManagement;
    var ApplicationView = ViewManagement.ApplicationView;

    var normalWidth = 1000;
    var normalHeight = 600;

    var view = ApplicationView.getForCurrentView();
    if (view.tryEnterFullScreenMode()) {
        WinJS.log && WinJS.log("Entering full screen mode", "samples", "status");
        // The resize event will be raised when the entry to full screen mode is complete.
    } else {
        WinJS.log && WinJS.log("Failed to enter full screen mode", "samples", "error");

        var info = Windows.Graphics.Display.DisplayInformation.getForCurrentView();
        ApplicationView.preferredLaunchViewSize = { width: info.screenWidthInRawPixels, height: info.screenHeightInRawPixels };
        ApplicationView.preferredLaunchWindowingMode = Windows.UI.ViewManagement.ApplicationViewWindowingMode.preferredLaunchViewSize;
    }


}

function setScreenSize() {

    var ViewManagement = Windows.UI.ViewManagement;
    var ApplicationView = ViewManagement.ApplicationView;
    var normalWidth = 1260;
    var normalHeight = 600;

    var info = Windows.Graphics.Display.DisplayInformation.getForCurrentView();

    var view = ApplicationView.getForCurrentView();
    var t = view && view.tryResizeView({ width: normalWidth, height: normalHeight });
}


function LevelComplete(e) {
    // When a ScriptNotify event is received, append a message to outputArea to indicate that fact
    switch (e.value) {
        case "Resize":
            setScreenSize();
            break;
        case "Rate":
            showRate();
            break;
        case "OpenMoreGames":
            OpenMoreGames();
            break;
        case "Purchanse":
            DoPurchanse();
            break;
        case "showIntersititialAd":
            IntersititialAds.requestAdHandler();
            break;
        case "loadIntersititialAd":
            IntersititialAds.loadAd();
            break;
        case "ShowAds":
            ShowAds();
            break;
        default:
            break;

    }
}



function DoPurchanse() {

    var storeContext = Windows.Services.Store.StoreContext.getDefault();
    var storeId = "9n53s0cnc5xh";


    storeContext.requestPurchaseAsync(storeId).done(function (result) {
        if (result.extendedError === (0x803f6107 | 0)) {
            //SdkSample.reportExtendedError(result.extendedError);
            return;
        }

        switch (result.status) {
            case StorePurchaseStatus.alreadyPurchased:
                WinJS.log && WinJS.log("You already bought this AddOn.", "samples", "error");
                break;

            case StorePurchaseStatus.succeeded:
                WinJS.log && WinJS.log("You bought " + item.title, "samples", "status");
                break;

            case StorePurchaseStatus.notPurchased:
                WinJS.log && WinJS.log("Product was not purchased, it may have been canceled.", "samples", "error");
                break;

            case StorePurchaseStatus.networkError:
                WinJS.log && WinJS.log("Product was not purchased due to a network error.", "samples", "error");
                break;

            case StorePurchaseStatus.serverError:
                WinJS.log && WinJS.log("Product was not purchased due to a server error.", "samples", "error");
                break;

            default:
                WinJS.log && WinJS.log("Product was not purchased due to an unknown error.", "samples", "error");
                break;
        }

    });
}

function showRate() {
    var isRate = null;
    try {
        var e = window.localStorage;
        isRate = e.getItem("9n53s0cnc5xh:isRate");
    } catch (t) { }

    if (isRate == null) isRate = "0";
    if (isRate == "0") {
        var msg = "Thanks for playing!Please take the time to rate the app!";
        var msgGoBtn = "Go to rate";
        var msgCancel = "Cancel";

        var msgdlg = new Windows.UI.Popups.MessageDialog(msg);
        if (msgdlg) {

            msgdlg.defaultCommandIndex = 0;
            msgdlg.cancelCommandIndex = 1;

            msgdlg.commands.append(new Windows.UI.Popups.UICommand(msgGoBtn, function () {
                var url = new Windows.Foundation.Uri("ms-windows-store://review/?ProductId=9n53s0cnc5xh");
                Windows.System.Launcher.launchUriAsync(url);

                try {
                    var e = window.localStorage;
                    e.setItem("9n53s0cnc5xh:isRate", "1");
                } catch (t) { }
            }));

            msgdlg.commands.append(new Windows.UI.Popups.UICommand(msgCancel, function () {

            }.bind(this)));

            msgdlg.showAsync();
        }
    }
}

function OpenMoreGames() {
    var url = new Windows.Foundation.Uri("ms-windows-store://publisher/?name=EngleSoft");
    Windows.System.Launcher.launchUriAsync(url);
}

var cntAdsShow = 0;

function ShowAds() {
    /*if (cntAdsShow > 0) {
        if (cntAdsShow % 2 == 0) {
            showRate();
            //IntersititialAds.loadAd();
        } else {
           
            IntersititialAds.requestAdHandler();
        }
    }

    ++cntAdsShow;*/
    IntersititialAds.requestAdHandler();
}