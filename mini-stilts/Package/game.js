"use strict";
var Engine;
(function (Engine) {
    var Asset = /** @class */ (function () {
        function Asset(path) {
            this.headerReceived = false;
            this.size = 0;
            this.downloadedSize = 0;
            this.path = Assets.root + path;
        }
        return Asset;
    }());
    var ImageAssetData = /** @class */ (function () {
        function ImageAssetData(xSize, ySize, xSizeSource, ySizeSource, imageData, bytes, filterable) {
            this.xSize = xSize;
            this.ySize = ySize;
            this.xSizeSource = xSizeSource;
            this.ySizeSource = ySizeSource;
            this.imageData = imageData;
            this.bytes = bytes;
            this.filterable = filterable;
        }
        return ImageAssetData;
    }());
    Engine.ImageAssetData = ImageAssetData;
    var Assets = /** @class */ (function () {
        function Assets() {
        }
        Assets.downloadNextAssetHeader = function () {
            Assets.currentAsset = Assets.assets[Assets.assetHeaderDownloadIndex];
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = function () {
                this.responseType = "arraybuffer";
            };
            //xhr.responseType = "arraybuffer";
            xhr.open("GET", Assets.currentAsset.path, true);
            xhr.onreadystatechange = function () {
                if (this.readyState == this.HEADERS_RECEIVED) {
                    Assets.currentAsset.headerReceived = true;
                    if (this.getResponseHeader("Content-Length") != null) {
                        Assets.currentAsset.size = +this.getResponseHeader("Content-Length");
                    }
                    else {
                        Assets.currentAsset.size = 1;
                    }
                    this.abort();
                    Assets.assetHeaderDownloadIndex += 1;
                    if (Assets.assetHeaderDownloadIndex == Assets.assets.length) {
                        Assets.downloadNextAssetBlob();
                    }
                    else {
                        Assets.downloadNextAssetHeader();
                    }
                }
            };
            xhr.onerror = function () {
                //console.log("ERROR");
                Assets.downloadNextAssetHeader();
            };
            xhr.send();
        };
        Assets.downloadNextAssetBlob = function () {
            Assets.currentAsset = Assets.assets[Assets.assetBlobDownloadIndex];
            var xhr = new XMLHttpRequest();
            xhr.onloadstart = function () {
                if (Assets.currentAsset.path.indexOf(".json") > 0 || Assets.currentAsset.path.indexOf(".txt") > 0 || Assets.currentAsset.path.indexOf(".glsl") > 0) {
                    xhr.responseType = "text";
                }
                else {
                    xhr.responseType = "arraybuffer";
                }
            };
            /*
            if(Assets.currentAsset.path.indexOf(".json") > 0 || Assets.currentAsset.path.indexOf(".txt") > 0 || Assets.currentAsset.path.indexOf(".glsl") > 0){
                xhr.responseType = "text";
            }
            else{
                xhr.responseType = "arraybuffer";
            }
            */
            xhr.open("GET", Assets.currentAsset.path, true);
            xhr.onprogress = function (e) {
                Assets.currentAsset.downloadedSize = e.loaded;
                if (Assets.currentAsset.downloadedSize > Assets.currentAsset.size) {
                    Assets.currentAsset.downloadedSize = Assets.currentAsset.size;
                }
            };
            xhr.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200 || this.status == 304 || this.status == 206 || (this.status == 0 && this.response)) {
                        Assets.currentAsset.downloadedSize = Assets.currentAsset.size;
                        if (Assets.currentAsset.path.indexOf(".png") > 0 || Assets.currentAsset.path.indexOf(".jpg") > 0 || Assets.currentAsset.path.indexOf(".jpeg") > 0 || Assets.currentAsset.path.indexOf(".jpe") > 0) {
                            Assets.currentAsset.blob = new Blob([new Uint8Array(this.response)]);
                            Assets.prepareImageAsset();
                        }
                        else if (Assets.currentAsset.path.indexOf(".m4a") > 0 || Assets.currentAsset.path.indexOf(".ogg") > 0 || Assets.currentAsset.path.indexOf(".wav") > 0) {
                            Assets.currentAsset.buffer = this.response;
                            Assets.prepareSoundAsset();
                        }
                        else if (Assets.currentAsset.path.indexOf(".json") > 0 || Assets.currentAsset.path.indexOf(".txt") > 0 || Assets.currentAsset.path.indexOf(".glsl") > 0) {
                            Assets.currentAsset.text = xhr.responseText;
                            Assets.stepAssetDownloadQueue();
                        }
                        else {
                            Assets.currentAsset.blob = this.response;
                            Assets.stepAssetDownloadQueue();
                        }
                    }
                    else {
                        //console.log("ERROR");
                        Assets.downloadNextAssetBlob();
                    }
                }
            };
            xhr.onerror = function () {
                //console.log("ERROR");
                Assets.downloadNextAssetBlob();
            };
            xhr.send();
        };
        Assets.stepAssetDownloadQueue = function () {
            Assets.assetBlobDownloadIndex += 1;
            if (Assets.assetBlobDownloadIndex == Assets.assets.length) {
                Assets.downloadingAssets = false;
            }
            else {
                Assets.downloadNextAssetBlob();
            }
        };
        Assets.prepareImageAsset = function () {
            Assets.currentAsset.image = document.createElement("img");
            Assets.currentAsset.image.onload = function () {
                Assets.currentAsset.blob = null;
                Assets.stepAssetDownloadQueue();
            };
            Assets.currentAsset.image.onerror = function () {
                //console.log("ERROR");
                Assets.prepareImageAsset();
            };
            Assets.currentAsset.image.src = URL.createObjectURL(Assets.currentAsset.blob);
        };
        Assets.prepareSoundAsset = function () {
            if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                Assets.currentAsset.blob = new Blob([new Uint8Array(Assets.currentAsset.buffer)]);
                Assets.currentAsset.audioURL = URL.createObjectURL(Assets.currentAsset.blob);
                Assets.stepAssetDownloadQueue();
            }
            else if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
                //@ts-ignore
                Engine.AudioManager.context.decodeAudioData(Assets.currentAsset.buffer, function (buffer) {
                    Assets.currentAsset.audio = buffer;
                    Assets.currentAsset.buffer = null;
                    Assets.stepAssetDownloadQueue();
                }, function () {
                    //console.log("ERROR");
                    Assets.prepareSoundAsset();
                });
            }
            else {
                Assets.stepAssetDownloadQueue();
            }
        };
        Assets.queue = function (path) {
            if (Assets.downloadingAssets) {
                console.log("ERROR");
            }
            else {
                if (path.indexOf(".ogg") > 0 || path.indexOf(".m4a") > 0 || path.indexOf(".wav") > 0) {
                    console.log("ERROR");
                }
                else if (path.indexOf(".omw") > 0 || path.indexOf(".owm") > 0 || path.indexOf(".mow") > 0 || path.indexOf(".mwo") > 0 || path.indexOf(".wom") > 0 || path.indexOf(".wmo") > 0) {
                    path = Assets.findAudioExtension(path);
                    if (path == "") {
                        console.log("ERROR");
                        return;
                    }
                }
                Assets.assets.push(new Asset(path));
            }
        };
        Assets.download = function () {
            if (Assets.downloadingAssets) {
                console.log("ERROR");
            }
            else if (Assets.assetHeaderDownloadIndex >= Assets.assets.length) {
                console.log("ERROR");
            }
            else {
                Assets.assetQueueStart = Assets.assetHeaderDownloadIndex;
                Assets.downloadingAssets = true;
                Assets.downloadNextAssetHeader();
            }
        };
        Object.defineProperty(Assets, "downloadSize", {
            get: function () {
                var retSize = 0;
                for (var assetIndex = Assets.assetQueueStart; assetIndex < Assets.assets.length; assetIndex += 1) {
                    if (!Assets.assets[assetIndex].headerReceived) {
                        return 0;
                    }
                    retSize += Assets.assets[assetIndex].size;
                }
                return retSize;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Assets, "downloadedSize", {
            get: function () {
                var retSize = 0;
                for (var assetIndex = Assets.assetQueueStart; assetIndex < Assets.assets.length; assetIndex += 1) {
                    retSize += Assets.assets[assetIndex].downloadedSize;
                }
                return retSize;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Assets, "downloadedRatio", {
            get: function () {
                var size = Assets.downloadSize;
                if (size == 0) {
                    return 0;
                }
                return Assets.downloadedSize / size;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Assets, "downloadComplete", {
            get: function () {
                var size = Assets.downloadSize;
                if (size == 0) {
                    return false;
                }
                return Assets.downloadedSize == size && !Assets.downloadingAssets;
            },
            enumerable: false,
            configurable: true
        });
        Assets.findAsset = function (path) {
            path = Assets.root + path;
            for (var assetIndex = 0; assetIndex < Assets.assets.length; assetIndex += 1) {
                if (Assets.assets[assetIndex].path == path) {
                    return Assets.assets[assetIndex];
                }
            }
            console.log("error");
            return null;
        };
        Assets.isPOW2 = function (value) {
            return (value != 0) && ((value & (value - 1)) == 0);
        };
        Assets.getNextPOW = function (value) {
            var xSizePOW2 = 2;
            while (xSizePOW2 < value) {
                xSizePOW2 *= 2;
            }
            return xSizePOW2;
        };
        Assets.loadImage = function (path) {
            var asset = Assets.findAsset(path);
            if (asset == null || asset.image == null) {
                console.log("ERROR");
                return null;
            }
            else {
                if (Engine.Renderer.mode == Engine.RendererMode.CANVAS_2D) {
                    var canvas = document.createElement("canvas");
                    canvas.width = asset.image.width;
                    canvas.height = asset.image.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(asset.image, 0, 0);
                    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    return new ImageAssetData(canvas.width, canvas.height, canvas.width, canvas.height, imageData, imageData.data, false);
                }
                else {
                    var xSize = asset.image.width;
                    var ySize = asset.image.height;
                    if (this.isPOW2(xSize) && this.isPOW2(ySize)) {
                        var canvas = document.createElement("canvas");
                        canvas.width = asset.image.width;
                        canvas.height = asset.image.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(asset.image, 0, 0);
                        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        return new ImageAssetData(canvas.width, canvas.height, canvas.width, canvas.height, imageData, imageData.data, true);
                    }
                    else {
                        //@ts-ignore
                        var maxDim = Engine.Renderer.gl.getParameter(Engine.Renderer.gl.MAX_TEXTURE_SIZE);
                        if (xSize <= maxDim && ySize <= maxDim) {
                            var xSizePOW2 = Assets.getNextPOW(xSize);
                            var ySizePOW2 = Assets.getNextPOW(ySize);
                            var canvas = document.createElement("canvas");
                            canvas.width = xSizePOW2;
                            canvas.height = ySizePOW2;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(asset.image, 0, 0);
                            var imageData = ctx.getImageData(0, 0, xSizePOW2, ySizePOW2);
                            return new ImageAssetData(canvas.width, canvas.height, xSize, ySize, imageData, imageData.data, true);
                        }
                        else {
                            var canvas = document.createElement("canvas");
                            canvas.width = asset.image.width;
                            canvas.height = asset.image.height;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(asset.image, 0, 0);
                            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            return new ImageAssetData(canvas.width, canvas.height, canvas.width, canvas.height, imageData, imageData.data, false);
                        }
                    }
                }
            }
        };
        Assets.loadText = function (path) {
            var asset = Assets.findAsset(path);
            if (asset == null || asset.text == null) {
                console.log("ERROR");
                return null;
            }
            else {
                return asset.text;
            }
        };
        ;
        Assets.loadAudio = function (path) {
            var asset = Assets.findAsset(Assets.findAudioExtension(path));
            if (asset == null || asset.audio == null) {
                console.log("ERROR");
                return null;
            }
            else {
                return asset.audio;
            }
        };
        Assets.root = "";
        Assets.assets = new Array();
        Assets.assetQueueStart = 0;
        Assets.assetHeaderDownloadIndex = 0;
        Assets.assetBlobDownloadIndex = 0;
        Assets.downloadingAssets = false;
        Assets.findAudioExtension = function (path) {
            var extFind = "";
            var extReplace = "";
            if (path.indexOf(".omw") > 0) {
                extFind = ".omw";
                if (Engine.AudioManager.oggSupported) {
                    extReplace = ".ogg";
                }
                else if (Engine.AudioManager.aacSupported) {
                    extReplace = ".m4a";
                }
                else if (Engine.AudioManager.wavSupported) {
                    extReplace = ".wav";
                }
                else {
                    return "";
                }
            }
            else if (path.indexOf(".owm") > 0) {
                extFind = ".owm";
                if (Engine.AudioManager.oggSupported) {
                    extReplace = ".ogg";
                }
                else if (Engine.AudioManager.wavSupported) {
                    extReplace = ".wav";
                }
                else if (Engine.AudioManager.aacSupported) {
                    extReplace = ".m4a";
                }
                else {
                    return "";
                }
            }
            else if (path.indexOf(".mow") > 0) {
                extFind = ".mow";
                if (Engine.AudioManager.aacSupported) {
                    extReplace = ".m4a";
                }
                else if (Engine.AudioManager.oggSupported) {
                    extReplace = ".ogg";
                }
                else if (Engine.AudioManager.wavSupported) {
                    extReplace = ".wav";
                }
                else {
                    return "";
                }
            }
            else if (path.indexOf(".mwo") > 0) {
                extFind = ".mwo";
                if (Engine.AudioManager.aacSupported) {
                    extReplace = ".m4a";
                }
                else if (Engine.AudioManager.wavSupported) {
                    extReplace = ".wav";
                }
                else if (Engine.AudioManager.oggSupported) {
                    extReplace = ".ogg";
                }
                else {
                    return "";
                }
            }
            else if (path.indexOf(".wom") > 0) {
                extFind = ".wom";
                if (Engine.AudioManager.wavSupported) {
                    extReplace = ".wav";
                }
                else if (Engine.AudioManager.oggSupported) {
                    extReplace = ".ogg";
                }
                else if (Engine.AudioManager.aacSupported) {
                    extReplace = ".m4a";
                }
                else {
                    return "";
                }
            }
            else if (path.indexOf(".wmo") > 0) {
                extFind = ".wmo";
                if (Engine.AudioManager.wavSupported) {
                    extReplace = ".wav";
                }
                else if (Engine.AudioManager.aacSupported) {
                    extReplace = ".m4a";
                }
                else if (Engine.AudioManager.oggSupported) {
                    extReplace = ".ogg";
                }
                else {
                    return "";
                }
            }
            else {
                return "";
            }
            var folder = (extReplace == ".ogg" ? "OGG/" : (extReplace == ".m4a" ? "M4A/" : "WAV/"));
            var slashIndex = path.lastIndexOf("/") + 1;
            path = path.substr(0, slashIndex) + folder + path.substr(slashIndex);
            return path.substr(0, path.indexOf(extFind)) + extReplace;
        };
        return Assets;
    }());
    Engine.Assets = Assets;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var AudioPlayer = /** @class */ (function () {
        function AudioPlayer(path) {
            this.loopStart = 0;
            this.loopEnd = 0;
            //TODO: NOT OPTIMAL, CHANGE THIS
            this.restoreVolume = 1;
            this._volume = 1;
            this._muted = false;
            if (!Engine.System.canCreateScene) {
                console.log("error");
            }
            //@ts-ignore
            Engine.AudioManager.players.push(this);
            this.path = path;
            if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
                this.buffer = Engine.Assets.loadAudio(path);
                //@ts-ignore
                this.volumeGain = Engine.AudioManager.context.createGain();
                //@ts-ignore
                this.volumeGain.connect(Engine.AudioManager.context.destination);
                //@ts-ignore
                this.extraGain = Engine.AudioManager.context.createGain();
                this.extraGain.connect(this.volumeGain);
                //@ts-ignore
                this.gaingain = Engine.AudioManager.context.createGain();
                this.gaingain.connect(this.extraGain);
                //@ts-ignore
                this.muteGain = Engine.AudioManager.context.createGain();
                this.muteGain.connect(this.gaingain);
            }
            else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                this.path = path;
                this.lockTime = -1;
                this.htmlAudio = new Audio();
                this.htmlAudio.src = Engine.Assets.findAsset(Engine.Assets.findAudioExtension(path)).audioURL;
                var that = this;
                this.htmlAudio.addEventListener('timeupdate', function () {
                    if (Engine.System.pauseCount > 0 && that.lockTime >= 0) {
                        this.currentTime = that.lockTime;
                    }
                    else {
                        if (that.loopEnd > 0 && (this.currentTime > that.loopEnd || that.htmlAudio.ended)) {
                            this.currentTime = that.loopStart;
                            this.play();
                        }
                    }
                }, false);
            }
            this.muted = false;
        }
        Object.defineProperty(AudioPlayer.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
                    this._volume = value;
                    this.volumeGain.gain.value = value;
                }
                else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                    this._volume = value;
                    this.htmlAudio.volume = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AudioPlayer.prototype, "muted", {
            get: function () {
                return this._muted;
            },
            set: function (value) {
                if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
                    this._muted = value;
                    //@ts-ignore
                    this.muteGain.gain.value = (this._muted || Engine.AudioManager._muted || Engine.System.pauseCount > 0) ? 0 : 1;
                }
                else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                    this._muted = value;
                    //@ts-ignore
                    this.htmlAudio.muted = this._muted || Engine.AudioManager._muted || Engine.System.pauseCount > 0;
                }
            },
            enumerable: false,
            configurable: true
        });
        //@ts-ignore
        AudioPlayer.recycleAll = function () {
            var newPlayers = new Array();
            //@ts-ignore
            for (var _i = 0, _a = Engine.AudioManager.players; _i < _a.length; _i++) {
                var player = _a[_i];
                var owner = player;
                while (owner.owner != null) {
                    owner = owner.owner;
                }
                if (owner.preserved) {
                    newPlayers.push(player);
                }
                else {
                    player.destroy();
                }
            }
            //@ts-ignore
            Engine.AudioManager.players = newPlayers;
        };
        /*
        //@ts-ignore
        private verify(){
            if(AudioManager.mode == AudioManagerMode.WEB){
                
            }
            else if(AudioManager.mode == AudioManagerMode.HTML){
                if(this.autoplayed){
                    //@ts-ignore
                    this.autoplayed = false;
                    this.play();
                    if(System.pauseCount > 0){
                        this.lockTime = this.htmlAudio.currentTime;
                        this.muted = this._muted;
                    }
                }
            }
        }
        */
        //@ts-ignore
        AudioPlayer.prototype.pause = function () {
            if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
            }
            else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                if (this.played) {
                    this.lockTime = this.htmlAudio.currentTime;
                    this.muted = this._muted;
                }
            }
        };
        //@ts-ignore
        AudioPlayer.prototype.resume = function () {
            if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
            }
            else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                if (this.played) {
                    this.htmlAudio.currentTime = this.lockTime;
                    this.lockTime = -1;
                    this.muted = this._muted;
                }
            }
        };
        AudioPlayer.prototype.destroy = function () {
            this.muted = true;
            this.stop();
        };
        AudioPlayer.prototype.boxPlay = function (box, xExpand, yExpand, shake, pitch) {
            if (xExpand === void 0) { xExpand = 0; }
            if (yExpand === void 0) { yExpand = 0; }
            if (shake === void 0) { shake = false; }
            if (pitch === void 0) { pitch = 1; }
            if (AudioPlayer.viewBox == null) {
                AudioPlayer.viewBox = new Engine.Box();
            }
            AudioPlayer.viewBox.x = Game.Player.instance.xRender - Engine.Renderer.xSizeView * 0.5 - xExpand * 0.5;
            AudioPlayer.viewBox.y = Game.Player.instance.yRender - Engine.Renderer.ySizeView * 0.5 - yExpand * 0.5;
            AudioPlayer.viewBox.xSize = Engine.Renderer.xSizeView + xExpand;
            AudioPlayer.viewBox.ySize = Engine.Renderer.ySizeView + yExpand;
            if (AudioPlayer.viewBox.collideAgainst(box, null, true, 0, false, Engine.Box.LAYER_ALL)) {
                this.play(pitch);
                if (shake)
                    Game.LevelShake.instance.start(1);
            }
        };
        AudioPlayer.onScreen = function (box, xExpand, yExpand) {
            if (xExpand === void 0) { xExpand = 0; }
            if (yExpand === void 0) { yExpand = 0; }
            if (AudioPlayer.viewBox == null) {
                AudioPlayer.viewBox = new Engine.Box();
            }
            AudioPlayer.viewBox.x = Game.Player.instance.xRender - Engine.Renderer.xSizeView * 0.5 - xExpand * 0.5;
            AudioPlayer.viewBox.y = Game.Player.instance.yRender - Engine.Renderer.ySizeView * 0.5 - yExpand * 0.5;
            AudioPlayer.viewBox.xSize = Engine.Renderer.xSizeView + xExpand;
            AudioPlayer.viewBox.ySize = Engine.Renderer.ySizeView + yExpand;
            return AudioPlayer.viewBox.collideAgainst(box, null, true, 0, false, Engine.Box.LAYER_ALL) != null;
        };
        AudioPlayer.prototype.play = function (pitch) {
            if (pitch === void 0) { pitch = 1; }
            if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
                //if(AudioManager.verified){
                this.autoplay(pitch);
                //}
            }
            else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                //if(AudioManager.verified){
                //@ts-ignore
                this.played = true;
                try {
                    this.htmlAudio.currentTime = 0;
                }
                catch (e) {
                }
                this.htmlAudio.playbackRate = pitch;
                this.htmlAudio.play();
                //}
            }
        };
        AudioPlayer.prototype.autoplay = function (pitch) {
            if (pitch === void 0) { pitch = 1; }
            if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
                if (this.played) {
                    this.source.stop();
                }
                this.gaingain.gain.value = 1;
                //@ts-ignore
                this.played = true;
                //@ts-ignore
                this.source = Engine.AudioManager.context.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.loop = this.loopEnd > 0;
                this.source.playbackRate.value = pitch;
                if (this.source.loop) {
                    this.source.loopStart = this.loopStart;
                    this.source.loopEnd = this.loopEnd;
                }
                this.source.connect(this.muteGain);
                //@ts-ignore
                this.source[this.source.start ? 'start' : 'noteOn'](0, this.source.loop ? 36 * 0 : 0);
            }
            else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                //if(AudioManager.verified){
                this.play();
                //}
                //else{
                //@ts-ignore
                //    this.autoplayed = true;
                //}
            }
        };
        AudioPlayer.prototype.stop = function () {
            if (Engine.AudioManager.mode == Engine.AudioManagerMode.WEB) {
                if (this.played) {
                    this.source.stop();
                }
            }
            else if (Engine.AudioManager.mode == Engine.AudioManagerMode.HTML) {
                if ( /*AudioManager.verified &&*/this.played) {
                    this.htmlAudio.currentTime = 0;
                    this.htmlAudio.pause();
                }
                //else if(this.autoplay){
                //@ts-ignore
                //    this.autoplayed = false;
                //}
            }
        };
        AudioPlayer.viewBox = null;
        return AudioPlayer;
    }());
    Engine.AudioPlayer = AudioPlayer;
})(Engine || (Engine = {}));
///<reference path="AudioPlayer.ts"/>
var Engine;
(function (Engine) {
    var AudioManagerMode;
    (function (AudioManagerMode) {
        AudioManagerMode[AudioManagerMode["NONE"] = 0] = "NONE";
        AudioManagerMode[AudioManagerMode["HTML"] = 1] = "HTML";
        AudioManagerMode[AudioManagerMode["WEB"] = 2] = "WEB";
    })(AudioManagerMode = Engine.AudioManagerMode || (Engine.AudioManagerMode = {}));
    var AudioManager = /** @class */ (function () {
        function AudioManager() {
        }
        Object.defineProperty(AudioManager, "muted", {
            get: function () {
                return AudioManager._muted;
            },
            set: function (value) {
                AudioManager._muted = value;
                for (var _i = 0, _a = AudioManager.players; _i < _a.length; _i++) {
                    var player = _a[_i];
                    //@ts-ignore
                    player.muted = player._muted;
                }
            },
            enumerable: false,
            configurable: true
        });
        //@ts-ignore
        AudioManager.init = function () {
            //@ts-ignore
            AudioManager.supported = window.Audio !== undefined;
            //@ts-ignore
            AudioManager.webSupported = window.AudioContext !== undefined || window.webkitAudioContext !== undefined;
            if (AudioManager.supported) {
                var audio = new Audio();
                //@ts-ignore
                AudioManager.wavSupported = audio.canPlayType("audio/wav; codecs=2").length > 0 || audio.canPlayType("audio/wav; codecs=1").length > 0 || audio.canPlayType("audio/wav; codecs=0").length > 0 || audio.canPlayType("audio/wav").length > 0;
                //@ts-ignore
                AudioManager.oggSupported = audio.canPlayType("audio/ogg; codecs=vorbis").length > 0 || audio.canPlayType("audio/ogg").length > 0;
                //@ts-ignore
                AudioManager.aacSupported = /*audio.canPlayType("audio/m4a").length > 0 ||*/ audio.canPlayType("audio/aac").length > 0 || audio.canPlayType("audio/mp4").length > 0;
            }
            //@ts-ignore
            AudioManager.supported = AudioManager.wavSupported || AudioManager.oggSupported || AudioManager.aacSupported;
            if (!AudioManager.supported || AudioManager.preferredMode == AudioManagerMode.NONE) {
                if (AudioManager.preferredMode == AudioManagerMode.NONE) {
                    console.error("Set \"AudioManager.preferredMode = AudioManagerMode.NONE\" only for testing proposes.");
                }
                //@ts-ignore
                AudioManager.mode = AudioManagerMode.NONE;
            }
            else if (AudioManager.webSupported && AudioManager.preferredMode == AudioManagerMode.WEB) {
                //@ts-ignore
                AudioManager.mode = AudioManagerMode.WEB;
                //@ts-ignore
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                //@ts-ignore
                AudioManager.context = new window.AudioContext();
                AudioManager.context.suspend();
                //@ts-ignore
                AudioManager.context.createGain = AudioManager.context.createGain || AudioManager.context.createGainNode;
            }
            else {
                if (AudioManager.preferredMode == AudioManagerMode.HTML) {
                    console.error("Set \"AudioManager.preferredMode = AudioManagerMode.HTML\" only for testing proposes.");
                }
                //@ts-ignore
                AudioManager.mode = AudioManagerMode.HTML;
            }
            //@ts-ignore
            AudioManager.inited = true;
        };
        //@ts-ignore
        AudioManager.verify = function () {
            if (Engine.System.pauseCount == 0 && AudioManager.inited && !AudioManager.verified) {
                if (AudioManager.mode == AudioManagerMode.WEB) {
                    AudioManager.context.resume();
                    if (Engine.System.pauseCount > 0) {
                        //    AudioManager.context.suspend();
                    }
                }
                //for(var player of AudioManager.players){
                //@ts-ignore
                //player.verify();
                //}
                //@ts-ignore
                AudioManager.verified = true;
            }
            if (AudioManager.verified && AudioManager.mode == AudioManagerMode.WEB && AudioManager.context.state == "suspended") {
                AudioManager.context.resume();
            }
        };
        //@ts-ignore
        AudioManager.pause = function () {
            /*
            if(AudioManager.mode == AudioManagerMode.WEB){
                if(AudioManager.verified){
                    AudioManager.context.suspend();
                }
            }
            for(var player of AudioManager.players){
                //@ts-ignore
                player.pause();
            }
            */
        };
        //@ts-ignore
        AudioManager.resume = function () {
            /*
            if(AudioManager.mode == AudioManagerMode.WEB){
                if(AudioManager.verified){
                    AudioManager.context.resume();
                }
            }
            for(var player of AudioManager.players){
                //@ts-ignore
                player.resume();
            }
            */
        };
        //@ts-ignore
        AudioManager.checkSuspended = function () {
            if (Engine.System.pauseCount == 0 && AudioManager.inited && AudioManager.mode == AudioManagerMode.WEB && AudioManager.context.state == "suspended") {
                AudioManager.context.resume();
            }
        };
        AudioManager.preferredMode = AudioManagerMode.WEB;
        AudioManager.wavSupported = false;
        AudioManager.oggSupported = false;
        AudioManager.aacSupported = false;
        AudioManager.verified = false;
        AudioManager.supported = false;
        AudioManager.webSupported = false;
        AudioManager.players = new Array();
        AudioManager._muted = false;
        return AudioManager;
    }());
    Engine.AudioManager = AudioManager;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var InteractableBounds = /** @class */ (function () {
        function InteractableBounds() {
            this.enabled = false;
            this.pinned = false;
            this.x = 0;
            this.y = 0;
            this.xSize = 8;
            this.ySize = 8;
            this.xOffset = 0;
            this.yOffset = 0;
            this.xScale = 1;
            this.yScale = 1;
            this.xMirror = false;
            this.yMirror = false;
            this.angle = 0;
            this.useTouchRadius = true;
            this.data = null;
            this.topleftpin = false;
            this.topleftx = 3;
            this.toplefty = 3;
        }
        Object.defineProperty(InteractableBounds.prototype, "mouseOver", {
            get: function () {
                if (this.pinned) {
                    var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale);
                    var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale);
                    var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale);
                    var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale);
                }
                else {
                    var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale - Engine.Renderer.xCamera);
                    var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale - Engine.Renderer.yCamera);
                    var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale - Engine.Renderer.xCamera);
                    var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale - Engine.Renderer.yCamera);
                }
                if (this.topleftpin) {
                    x0 = this.topleftx;
                    y0 = this.toplefty;
                }
                return Engine.Mouse.in(x0, y0, x1, y1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(InteractableBounds.prototype, "touched", {
            get: function () {
                if (this.pinned) {
                    var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale);
                    var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale);
                    var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale);
                    var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale);
                }
                else {
                    var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale - Engine.Renderer.xCamera);
                    var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale - Engine.Renderer.yCamera);
                    var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale - Engine.Renderer.xCamera);
                    var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale - Engine.Renderer.yCamera);
                }
                if (this.topleftpin) {
                    x0 = this.topleftx;
                    y0 = this.toplefty;
                }
                return Engine.TouchInput.down(x0, y0, x1, y1, this.useTouchRadius);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(InteractableBounds.prototype, "pointed", {
            get: function () {
                if (this.pinned) {
                    var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale);
                    var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale);
                    var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale);
                    var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale);
                }
                else {
                    var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale - Engine.Renderer.xCamera);
                    var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale - Engine.Renderer.yCamera);
                    var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale - Engine.Renderer.xCamera);
                    var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale - Engine.Renderer.yCamera);
                }
                if (this.topleftpin) {
                    x0 = this.topleftx;
                    y0 = this.toplefty;
                }
                return Engine.TouchInput.pressed(x0, y0, x1, y1, this.useTouchRadius);
            },
            enumerable: false,
            configurable: true
        });
        InteractableBounds.prototype.pointInside = function (x, y, radius) {
            if (this.pinned) {
                var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale);
                var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale);
                var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale);
                var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale);
            }
            else {
                var x0 = Engine.Renderer.xViewToWindow(this.x + this.xOffset * this.xScale - Engine.Renderer.xCamera);
                var y0 = Engine.Renderer.yViewToWindow(this.y + this.yOffset * this.yScale - Engine.Renderer.yCamera);
                var x1 = Engine.Renderer.xViewToWindow(this.x + (this.xSize + this.xOffset) * this.xScale - Engine.Renderer.xCamera);
                var y1 = Engine.Renderer.yViewToWindow(this.y + (this.ySize + this.yOffset) * this.yScale - Engine.Renderer.yCamera);
            }
            if (this.topleftpin) {
                x0 = this.topleftx;
                y0 = this.toplefty;
            }
            if (radius == null || radius == undefined) {
                radius = 1;
            }
            radius = radius == 0 ? 1 : radius;
            x /= radius;
            y /= radius;
            var rx0 = x0 / radius;
            var ry0 = y0 / radius;
            var rx1 = x1 / radius;
            var ry1 = y1 / radius;
            return x >= rx0 && x <= rx1 && y >= ry0 && y <= ry1;
        };
        InteractableBounds.prototype.render = function () {
        };
        //@ts-ignore
        InteractableBounds.prototype.setRGBA = function (red, green, blue, alpha) {
        };
        return InteractableBounds;
    }());
    Engine.InteractableBounds = InteractableBounds;
})(Engine || (Engine = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path="InteractableBounds.ts"/>
var Engine;
(function (Engine) {
    var CanvasTexture = /** @class */ (function () {
        function CanvasTexture(sprite) {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
            //@ts-ignore
            this.context.drawImage(sprite.texture.canvas, sprite.xTexture, sprite.yTexture, sprite.xSizeTexture, sprite.ySizeTexture, 0, 0, sprite.xSizeTexture, sprite.ySizeTexture);
            //@ts-ignore
            var imageData = this.context.getImageData(0, 0, sprite.xSizeTexture, sprite.ySizeTexture);
            var data = imageData.data;
            //@ts-ignore
            for (var indexPixel = 0; indexPixel < sprite.xSizeTexture * sprite.ySizeTexture * 4; indexPixel += 4) {
                //@ts-ignore
                data[indexPixel + 0] = data[indexPixel + 0] * sprite.red;
                //@ts-ignore
                data[indexPixel + 1] = data[indexPixel + 1] * sprite.green;
                //@ts-ignore
                data[indexPixel + 2] = data[indexPixel + 2] * sprite.blue;
                //@ts-ignore
                data[indexPixel + 3] = data[indexPixel + 3] * sprite.alpha;
            }
            //@ts-ignore
            this.context.clearRect(0, 0, sprite.xSizeTexture, sprite.ySizeTexture);
            this.context.putImageData(imageData, 0, 0);
        }
        return CanvasTexture;
    }());
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.red = 1;
            _this.green = 1;
            _this.blue = 1;
            _this.alpha = 1;
            _this.texture = null;
            //Canvas
            _this.xTexture = 0;
            _this.yTexture = 0;
            _this.xSizeTexture = 0;
            _this.ySizeTexture = 0;
            _this.dirty = false;
            //GL
            //@ts-ignore
            _this.u0 = 0;
            //@ts-ignore
            _this.v0 = 0;
            //@ts-ignore
            _this.u1 = 0;
            //@ts-ignore
            _this.v1 = 0;
            //@ts-ignore
            _this.setHSVA = function (hue, saturation, value, alpha) {
                console.log("error");
            };
            return _this;
        }
        Sprite.prototype.setFull = function (enabled, pinned, texture, xSize, ySize, xOffset, yOffset, xTexture, yTexture, xSizeTexture, ySizeTexture) {
            if (texture == null) {
                console.log("error");
            }
            else {
                this.enabled = enabled;
                this.pinned = pinned;
                this.xSize = xSize;
                this.ySize = ySize;
                this.xOffset = xOffset;
                this.yOffset = yOffset;
                this.texture = texture;
                if (Engine.Renderer.mode == Engine.RendererMode.WEB_GL) {
                    //@ts-ignore
                    this.u0 = xTexture / texture.assetData.xSize;
                    //@ts-ignore
                    this.v0 = yTexture / texture.assetData.ySize;
                    //@ts-ignore
                    this.u1 = (xTexture + xSizeTexture) / texture.assetData.xSize;
                    //@ts-ignore
                    this.v1 = (yTexture + ySizeTexture) / texture.assetData.ySize;
                }
                else {
                    this.xTexture = xTexture;
                    this.yTexture = yTexture;
                    this.xSizeTexture = xSizeTexture;
                    this.ySizeTexture = ySizeTexture;
                    this.dirty = true;
                }
            }
        };
        Sprite.prototype.setRGBA = function (red, green, blue, alpha) {
            if (Engine.Renderer.mode == Engine.RendererMode.CANVAS_2D && (this.red != red || this.green != green || this.blue != blue || this.alpha != alpha)) {
                this.dirty = true;
            }
            //@ts-ignore
            this.red = red;
            //@ts-ignore
            this.green = green;
            //@ts-ignore
            this.blue = blue;
            //@ts-ignore
            this.alpha = alpha;
        };
        Sprite.prototype.render = function () {
            _super.prototype.render.call(this);
            if (Engine.Renderer.mode == Engine.RendererMode.CANVAS_2D && this.dirty && this.texture != null) {
                if (this.red != 1 || this.green != 1 || this.blue != 1 || this.alpha != 1) {
                    if (this.xSizeTexture > 0 && this.ySizeTexture > 0) {
                        this.canvasTexture = new CanvasTexture(this);
                    }
                    else {
                        this.canvasTexture = null;
                    }
                }
                else {
                    this.canvasTexture = null;
                }
                this.dirty = false;
            }
            //@ts-ignore
            Engine.Renderer.renderSprite(this);
        };
        Sprite.prototype.renderAt = function (x, y) {
            var oldX = this.x;
            var oldY = this.y;
            this.x = x;
            this.y = y;
            this.render();
            this.x = oldX;
            this.y = oldY;
        };
        Sprite.prototype.setRGBAFromTexture = function (texture, x, y) {
            this.setFull(true, true, texture, 1, 1, 0, 0, x, y, 1, 1);
        };
        return Sprite;
    }(Engine.InteractableBounds));
    Engine.Sprite = Sprite;
})(Engine || (Engine = {}));
///<reference path="Sprite.ts"/>
var Engine;
(function (Engine) {
    var Contact = /** @class */ (function () {
        function Contact(box, other, distance) {
            this.box = box;
            this.other = other;
            this.distance = distance;
        }
        return Contact;
    }());
    Engine.Contact = Contact;
    /*
    export class Overlap{
        public readonly box : Box;
        public readonly other : Box;

        public constructor(box : Box, other : Box){
            this.box = box;
            this.other = other;
        }
    }
    */
    var Point = /** @class */ (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    Engine.Point = Point;
    var Box = /** @class */ (function () {
        function Box() {
            this.position = new Int32Array(2);
            this.offset = new Int32Array(2);
            this.size = new Int32Array([8000, 8000]);
            this.enabled = false;
            this.layer = Box.LAYER_NONE;
            this.xMirror = false;
            this.yMirror = false;
            this.data = null;
            this.renderable = false;
            this.red = 0;
            this.green = 1;
            this.blue = 0;
            this.alpha = 0.5;
        }
        Object.defineProperty(Box.prototype, "x", {
            get: function () {
                return this.position[0] / Box.UNIT;
            },
            set: function (value) {
                this.position[0] = value * Box.UNIT;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "y", {
            get: function () {
                return this.position[1] / Box.UNIT;
            },
            set: function (value) {
                this.position[1] = value * Box.UNIT;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "xOffset", {
            get: function () {
                return this.offset[0] / Box.UNIT;
            },
            set: function (value) {
                this.offset[0] = value * Box.UNIT;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "yOffset", {
            get: function () {
                return this.offset[1] / Box.UNIT;
            },
            set: function (value) {
                this.offset[1] = value * Box.UNIT;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "xSize", {
            get: function () {
                return this.size[0] / Box.UNIT;
            },
            set: function (value) {
                this.size[0] = value * Box.UNIT;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Box.prototype, "ySize", {
            get: function () {
                return this.size[1] / Box.UNIT;
            },
            set: function (value) {
                this.size[1] = value * Box.UNIT;
            },
            enumerable: false,
            configurable: true
        });
        Box.setInterval = function (box, interval, xAxis) {
            if (xAxis) {
                if (box.xMirror) {
                    interval[0] = box.position[0] - box.offset[0] - box.size[0];
                    interval[1] = box.position[0] - box.offset[0];
                }
                else {
                    interval[0] = box.position[0] + box.offset[0];
                    interval[1] = box.position[0] + box.offset[0] + box.size[0];
                }
                if (box.yMirror) {
                    interval[2] = box.position[1] - box.offset[1] - box.size[1];
                    interval[3] = box.position[1] - box.offset[1];
                }
                else {
                    interval[2] = box.position[1] + box.offset[1];
                    interval[3] = box.position[1] + box.offset[1] + box.size[1];
                }
            }
            else {
                if (box.xMirror) {
                    interval[0] = box.position[1] - box.offset[1] - box.size[1];
                    interval[1] = box.position[1] - box.offset[1];
                }
                else {
                    interval[0] = box.position[1] + box.offset[1];
                    interval[1] = box.position[1] + box.offset[1] + box.size[1];
                }
                if (box.yMirror) {
                    interval[2] = box.position[0] - box.offset[0] - box.size[0];
                    interval[3] = box.position[0] - box.offset[0];
                }
                else {
                    interval[2] = box.position[0] + box.offset[0];
                    interval[3] = box.position[0] + box.offset[0] + box.size[0];
                }
            }
        };
        Box.intervalExclusiveCollides = function (startA, endA, startB, endB) {
            return (startA <= startB && startB < endA) || (startB <= startA && startA < endB);
        };
        Box.intervalDifference = function (startA, endA, startB, endB) {
            if (startA < startB) {
                return endA - startB;
            }
            return startA - endB;
        };
        Box.prototype.castAgainst = function (other, contacts, xAxis, distance, scaleDistance, mask) {
            if (scaleDistance === void 0) { scaleDistance = true; }
            if (mask === void 0) { mask = Box.LAYER_ALL; }
            if (distance != 0) {
                distance *= scaleDistance ? Box.UNIT : 1;
                Box.setInterval(this, Box.intervalA, xAxis);
                if (this == other || !other.enabled || (mask != Box.LAYER_ALL && !(mask & other.layer)) || this.xSize == 0 || this.ySize == 0 || other.xSize == 0 || other.ySize == 0) {
                    return contacts;
                }
                Box.setInterval(other, Box.intervalB, xAxis);
                if (Box.intervalExclusiveCollides(Box.intervalB[0], Box.intervalB[1], Box.intervalA[0], Box.intervalA[1])) {
                    return contacts;
                }
                if (!Box.intervalExclusiveCollides(Box.intervalB[2], Box.intervalB[3], Box.intervalA[2], Box.intervalA[3])) {
                    return contacts;
                }
                if (Box.intervalExclusiveCollides(Box.intervalB[0] - (distance > 0 ? distance : 0), Box.intervalB[1] - (distance < 0 ? distance : 0), Box.intervalA[0], Box.intervalA[1])) {
                    var intervalDist = Box.intervalDifference(Box.intervalB[0], Box.intervalB[1], Box.intervalA[0], Box.intervalA[1]);
                    if (Math.abs(distance) < Math.abs(intervalDist)) {
                        return contacts;
                    }
                    if (contacts == null || contacts.length == 0 || Math.abs(intervalDist) < Math.abs(contacts[0].distance)) {
                        contacts = [];
                        contacts[0] = new Contact(this, other, intervalDist);
                    }
                    else if (Math.abs(intervalDist) == Math.abs(contacts[0].distance)) {
                        contacts = contacts || [];
                        contacts.push(new Contact(this, other, intervalDist));
                    }
                }
            }
            return contacts;
        };
        Box.prototype.cast = function (boxes, contacts, xAxis, distance, scaleDistance, mask) {
            if (scaleDistance === void 0) { scaleDistance = true; }
            if (mask === void 0) { mask = Box.LAYER_ALL; }
            for (var _i = 0, boxes_1 = boxes; _i < boxes_1.length; _i++) {
                var other = boxes_1[_i];
                contacts = this.castAgainst(other, contacts, xAxis, distance, scaleDistance, mask);
            }
            return contacts;
        };
        Box.prototype.collideAgainst = function (other, overlaps, xAxis, distance, scaleDistance, mask) {
            if (overlaps === void 0) { overlaps = null; }
            if (xAxis === void 0) { xAxis = false; }
            if (distance === void 0) { distance = 0; }
            if (scaleDistance === void 0) { scaleDistance = true; }
            if (mask === void 0) { mask = Box.LAYER_ALL; }
            distance *= scaleDistance ? Box.UNIT : 1;
            if (this == other || !other.enabled || (mask != Box.LAYER_ALL && !(mask & other.layer)) || this.xSize == 0 || this.ySize == 0 || other.xSize == 0 || other.ySize == 0) {
                return overlaps;
            }
            Box.setInterval(this, Box.intervalA, xAxis);
            Box.setInterval(other, Box.intervalB, xAxis);
            if (!Box.intervalExclusiveCollides(Box.intervalB[2], Box.intervalB[3], Box.intervalA[2], Box.intervalA[3])) {
                return overlaps;
            }
            if (Box.intervalExclusiveCollides(Box.intervalB[0] - (distance > 0 ? distance : 0), Box.intervalB[1] - (distance < 0 ? distance : 0), Box.intervalA[0], Box.intervalA[1])) {
                overlaps = overlaps || [];
                overlaps.push(new Contact(this, other, 0));
            }
            return overlaps;
        };
        Box.prototype.collide = function (boxes, overlaps, xAxis, distance, scaleDistance, mask) {
            if (overlaps === void 0) { overlaps = null; }
            if (xAxis === void 0) { xAxis = false; }
            if (distance === void 0) { distance = 0; }
            if (scaleDistance === void 0) { scaleDistance = true; }
            if (mask === void 0) { mask = Box.LAYER_ALL; }
            for (var _i = 0, boxes_2 = boxes; _i < boxes_2.length; _i++) {
                var other = boxes_2[_i];
                overlaps = this.collideAgainst(other, overlaps, xAxis, distance, scaleDistance, mask);
            }
            return overlaps;
        };
        Box.prototype.getDist = function (other, dir, xAxis) {
            Box.setInterval(this, Box.intervalA, xAxis);
            Box.setInterval(other, Box.intervalB, xAxis);
            if (dir >= 0) {
                return Box.intervalB[0] - Box.intervalA[1];
            }
            else {
                return Box.intervalB[1] - Box.intervalA[0];
            }
        };
        Box.prototype.translate = function (contacts, xAxis, distance, scaleDistance) {
            if (scaleDistance === void 0) { scaleDistance = true; }
            distance *= scaleDistance ? Box.UNIT : 1;
            if (contacts == null || contacts.length == 0) {
                this.position[0] += xAxis ? distance : 0;
                this.position[1] += xAxis ? 0 : distance;
            }
            else {
                this.position[0] += xAxis ? contacts[0].distance : 0;
                this.position[1] += xAxis ? 0 : contacts[0].distance;
            }
        };
        Box.prototype.getExtrapolation = function (boxes, xDistance, yDistance, scaleDistance, mask) {
            if (scaleDistance === void 0) { scaleDistance = true; }
            if (mask === void 0) { mask = Box.LAYER_ALL; }
            var oldX = this.position[0];
            var oldY = this.position[1];
            xDistance = xDistance * Engine.System.stepExtrapolation;
            yDistance = yDistance * Engine.System.stepExtrapolation;
            if (boxes == null) {
                this.position[0] += xDistance * (scaleDistance ? Box.UNIT : 1);
                this.position[1] += yDistance * (scaleDistance ? Box.UNIT : 1);
            }
            else {
                var contacts = this.cast(boxes, null, true, xDistance, scaleDistance, mask);
                this.translate(contacts, true, xDistance, scaleDistance);
                contacts = this.cast(boxes, null, false, yDistance, scaleDistance, mask);
                this.translate(contacts, false, yDistance, scaleDistance);
            }
            var point = new Point(this.position[0] / Box.UNIT, this.position[1] / Box.UNIT);
            this.position[0] = oldX;
            this.position[1] = oldY;
            return point;
        };
        Box.renderBoxAt = function (box, x, y) {
            if (Box.debugRender && box.enabled && box.renderable) {
                if (Box.sprite == null) {
                    Box.sprite = new Engine.Sprite();
                    Box.sprite.enabled = true;
                }
                Box.sprite.x = x;
                Box.sprite.y = y;
                Box.sprite.xOffset = box.offset[0] / Box.UNIT;
                Box.sprite.yOffset = box.offset[1] / Box.UNIT;
                Box.sprite.xSize = box.size[0] / Box.UNIT;
                Box.sprite.ySize = box.size[1] / Box.UNIT;
                Box.sprite.xMirror = box.xMirror;
                Box.sprite.yMirror = box.yMirror;
                Box.sprite.setRGBA(box.red, box.green, box.blue, box.alpha);
                Box.sprite.render();
            }
        };
        Box.prototype.render = function () {
            Box.renderBoxAt(this, this.x, this.y);
        };
        Box.prototype.renderAt = function (x, y) {
            Box.renderBoxAt(this, x, y);
        };
        Box.prototype.renderExtrapolated = function (boxes, xDistance, yDistance, scaleDistance, mask) {
            if (scaleDistance === void 0) { scaleDistance = true; }
            if (mask === void 0) { mask = Box.LAYER_ALL; }
            var point = this.getExtrapolation(boxes, xDistance, yDistance, scaleDistance, mask);
            Box.renderBoxAt(this, point.x, point.y);
        };
        Box.UNIT = 1000.0;
        Box.LAYER_NONE = 0;
        Box.LAYER_ALL = 1;
        Box.debugRender = true;
        Box.intervalA = new Int32Array(4);
        Box.intervalB = new Int32Array(4);
        return Box;
    }());
    Engine.Box = Box;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Data = /** @class */ (function () {
        function Data() {
        }
        Data.setID = function (domain, developer, game) {
            Data.id = domain + "." + developer + "." + game;
            Data.idToken = Data.id + ".";
        };
        Data.validateID = function () {
            if (Data.id == "") {
                console.error("PLEASE SET A VALID DATA ID");
            }
        };
        Data.save = function (name, value, days) {
            Data.validateID();
            name = Data.idToken + name;
            if (Data.useLocalStorage) {
                localStorage.setItem(name, value + "");
            }
            else {
                try {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    var expires = "expires=" + date.toUTCString();
                    document.cookie = name + "=" + value + ";" + expires + ";path=/; SameSite=None; Secure";
                }
                catch (error) {
                    console.log(error);
                }
            }
            //console.log(document.cookie);
        };
        ;
        Data.load = function (name) {
            Data.validateID();
            name = Data.idToken + name;
            if (Data.useLocalStorage) {
                return localStorage.getItem(name);
            }
            else {
                try {
                    name = name + "=";
                    var arrayCookies = document.cookie.split(';');
                    for (var indexCoockie = 0; indexCoockie < arrayCookies.length; indexCoockie += 1) {
                        var cookie = arrayCookies[indexCoockie];
                        while (cookie.charAt(0) == ' ') {
                            cookie = cookie.substring(1);
                        }
                        if (cookie.indexOf(name) == 0) {
                            return cookie.substring(name.length, cookie.length);
                        }
                    }
                    return null;
                }
                catch (error) {
                    console.log(error);
                    return null;
                }
            }
        };
        ;
        Data.id = "";
        Data.idToken = "";
        Data.useLocalStorage = true;
        return Data;
    }());
    Engine.Data = Data;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Entity = /** @class */ (function () {
        function Entity() {
            this.preserved = false;
            Engine.System.addListenersFrom(this);
        }
        return Entity;
    }());
    Engine.Entity = Entity;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Keyboard = /** @class */ (function () {
        function Keyboard() {
        }
        Keyboard.hasDown = function (keyCode, old) {
            for (var indexCode = 0; indexCode < (old ? Keyboard.oldKeyPressEvents.length : Keyboard.keyPressEvents.length); indexCode += 1) {
                if (keyCode == (old ? Keyboard.oldKeyPressEvents[indexCode] : Keyboard.keyPressEvents[indexCode])) {
                    return true;
                }
            }
            return false;
        };
        Keyboard.down = function (keyCode) {
            return Keyboard.hasDown(keyCode, false);
        };
        Keyboard.onDown = function (event) {
            if (event.key == null || event.key == undefined) {
                return false;
            }
            var code = event.key.toLowerCase();
            var indexCode = Keyboard.readedKeyPressEvents.length;
            for (var indexEvent = 0; indexEvent < Keyboard.readedKeyPressEvents.length; indexEvent += 1) {
                if (Keyboard.readedKeyPressEvents[indexEvent] == "") {
                    indexCode = indexEvent;
                }
                else if (Keyboard.readedKeyPressEvents[indexEvent] == code) {
                    indexCode = -1;
                    break;
                }
            }
            if (indexCode >= 0) {
                Keyboard.readedKeyPressEvents[indexCode] = code;
            }
            switch (code) {
                case Keyboard.UP:
                case "up":
                case "Up":
                case Keyboard.DOWN:
                case "down":
                case "Down":
                case Keyboard.LEFT:
                case "left":
                case "Left":
                case Keyboard.RIGHT:
                case "right":
                case "Right":
                case Keyboard.SPACE:
                case "space":
                case "Space":
                case " ":
                case "spacebar":
                case Keyboard.ESC:
                case "esc":
                case "Esc":
                case "ESC":
                    event.preventDefault();
                    //@ts-ignore
                    if (event.stopPropagation !== "undefined") {
                        event.stopPropagation();
                    }
                    else {
                        event.cancelBubble = true;
                    }
                    return true;
            }
            return false;
        };
        Keyboard.onUp = function (event) {
            if (event.key == null || event.key == undefined) {
                return false;
            }
            var code = event.key.toLowerCase();
            for (var indexEvent = 0; indexEvent < Keyboard.readedKeyPressEvents.length; indexEvent += 1) {
                if (Keyboard.readedKeyPressEvents[indexEvent] == code) {
                    Keyboard.readedKeyPressEvents[indexEvent] = "";
                    break;
                }
            }
            return false;
        };
        //@ts-ignore
        Keyboard.update = function () {
            for (var indexEvent = 0; indexEvent < Keyboard.keyPressEvents.length; indexEvent += 1) {
                Keyboard.oldKeyPressEvents[indexEvent] = Keyboard.keyPressEvents[indexEvent];
            }
            for (var indexEvent = 0; indexEvent < Keyboard.readedKeyPressEvents.length; indexEvent += 1) {
                Keyboard.keyPressEvents[indexEvent] = Keyboard.readedKeyPressEvents[indexEvent];
            }
        };
        Keyboard.A = "a";
        Keyboard.B = "b";
        Keyboard.C = "c";
        Keyboard.D = "d";
        Keyboard.E = "e";
        Keyboard.F = "f";
        Keyboard.G = "g";
        Keyboard.H = "h";
        Keyboard.I = "i";
        Keyboard.J = "j";
        Keyboard.K = "k";
        Keyboard.L = "l";
        Keyboard.M = "m";
        Keyboard.N = "n";
        Keyboard.O = "o";
        Keyboard.P = "p";
        Keyboard.Q = "q";
        Keyboard.R = "r";
        Keyboard.S = "s";
        Keyboard.T = "t";
        Keyboard.U = "u";
        Keyboard.V = "v";
        Keyboard.W = "w";
        Keyboard.X = "x";
        Keyboard.Y = "y";
        Keyboard.Z = "z";
        Keyboard.UP = "arrowup";
        Keyboard.DOWN = "arrowdown";
        Keyboard.LEFT = "arrowleft";
        Keyboard.RIGHT = "arrowright";
        Keyboard.SPACE = " ";
        Keyboard.ESC = "escape";
        Keyboard.readedKeyPressEvents = [];
        Keyboard.oldKeyPressEvents = [];
        Keyboard.keyPressEvents = [];
        Keyboard.up = function (keyCode) {
            return !Keyboard.hasDown(keyCode, false);
        };
        Keyboard.pressed = function (keyCode) {
            return Keyboard.hasDown(keyCode, false) && !Keyboard.hasDown(keyCode, true);
        };
        Keyboard.released = function (keyCode) {
            return !Keyboard.hasDown(keyCode, false) && Keyboard.hasDown(keyCode, true);
        };
        return Keyboard;
    }());
    Engine.Keyboard = Keyboard;
    //@ts-ignore
    window.addEventListener("keydown", Keyboard.onDown, false);
    //@ts-ignore
    window.addEventListener("keyup", Keyboard.onUp, false);
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Link = /** @class */ (function () {
        function Link(owner, url) {
            this.owner = owner;
            this.url = url;
        }
        return Link;
    }());
    var LinkManager = /** @class */ (function () {
        function LinkManager() {
        }
        LinkManager.add = function (owner, url) {
            var link = null;
            for (var _i = 0, _a = LinkManager.links; _i < _a.length; _i++) {
                var arrayLink = _a[_i];
                if (arrayLink.owner == owner && arrayLink.url == url) {
                    link = arrayLink;
                }
            }
            if (link == null) {
                LinkManager.links.push(new Link(owner, url));
            }
        };
        LinkManager.remove = function (owner, url) {
            var newLinks = new Array();
            for (var _i = 0, _a = LinkManager.links; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.owner != owner || link.url != url) {
                    newLinks.push(link);
                }
            }
            LinkManager.links = newLinks;
        };
        LinkManager.triggerMouse = function (event) {
            for (var _i = 0, _a = LinkManager.links; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.owner.bounds == null || (link.owner.bounds.enabled && link.owner.bounds.pointInside(event.clientX, event.clientY, 1) && link.owner.linkCondition())) {
                    if (link.owner != null && link.owner.onLinkTrigger != null) {
                        link.owner.onLinkTrigger();
                    }
                    else {
                        window.open(link.url, '_blank');
                    }
                }
            }
        };
        LinkManager.triggerTouch = function (event) {
            for (var _i = 0, _a = LinkManager.links; _i < _a.length; _i++) {
                var link = _a[_i];
                for (var indexEventTouch = 0; indexEventTouch < event.changedTouches.length; indexEventTouch += 1) {
                    var touch = event.changedTouches.item(indexEventTouch);
                    var radius = touch.radiusX < touch.radiusY ? touch.radiusX : touch.radiusY;
                    //if(radius == null || radius == undefined){
                    radius = 1;
                    //}
                    if (link.owner.bounds == null || (link.owner.bounds.enabled && link.owner.bounds.pointInside(touch.clientX, touch.clientY, radius) && link.owner.linkCondition())) {
                        if (link.owner != null && link.owner.onLinkTrigger != null) {
                            link.owner.onLinkTrigger();
                        }
                        else {
                            window.open(link.url, '_blank');
                        }
                        break;
                    }
                }
            }
        };
        LinkManager.links = new Array();
        return LinkManager;
    }());
    Engine.LinkManager = LinkManager;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Mouse = /** @class */ (function () {
        function Mouse() {
        }
        Object.defineProperty(Mouse, "x", {
            get: function () {
                return Mouse._x;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Mouse, "y", {
            get: function () {
                return Mouse._y;
            },
            enumerable: false,
            configurable: true
        });
        Mouse.hasDown = function (indexButton, old) {
            if (indexButton < (old ? Mouse.oldButtonPressEvents.length : Mouse.buttonPressEvents.length)) {
                return old ? Mouse.oldButtonPressEvents[indexButton] : Mouse.buttonPressEvents[indexButton];
            }
            return false;
        };
        ;
        Mouse.down = function (indexButton) {
            return Mouse.hasDown(indexButton, false);
        };
        Mouse.up = function (indexButton) {
            return !Mouse.hasDown(indexButton, false);
        };
        Mouse.pressed = function (indexButton) {
            return Mouse.hasDown(indexButton, false) && !Mouse.hasDown(indexButton, true);
        };
        Mouse.released = function (indexButton) {
            return !Mouse.hasDown(indexButton, false) && Mouse.hasDown(indexButton, true);
        };
        Mouse.in = function (x0, y0, x1, y1) {
            return x0 <= Mouse._x && x1 >= Mouse._x && y0 <= Mouse._y && y1 >= Mouse._y;
        };
        Mouse.clickedIn = function (indexButton, x0, y0, x1, y1) {
            if (Mouse.released(indexButton)) {
                var downX = Mouse.pressPositionsX[indexButton];
                var downY = Mouse.pressPositionsY[indexButton];
                var downIn = x0 <= downX && x1 >= downX && y0 <= downY && y1 >= downY;
                var upIn = Mouse.in(x0, y0, x1, y1);
                return downIn && upIn;
            }
            return false;
        };
        Mouse.onDown = function (event) {
            Mouse._x = event.clientX;
            Mouse._y = event.clientY;
            Mouse.readedButtonPressEvents[event.button] = true;
            Mouse.pressPositionsX[event.button] = Mouse._x;
            Mouse.pressPositionsY[event.button] = Mouse._y;
            return false;
        };
        Mouse.onUp = function (event) {
            Mouse._x = event.clientX;
            Mouse._y = event.clientY;
            Mouse.readedButtonPressEvents[event.button] = false;
            return false;
        };
        Mouse.onMove = function (event) {
            Mouse._x = event.clientX;
            Mouse._y = event.clientY;
            return false;
        };
        //@ts-ignore
        Mouse.update = function () {
            for (var indexEvent = 0; indexEvent < Mouse.buttonPressEvents.length; indexEvent += 1) {
                Mouse.oldButtonPressEvents[indexEvent] = Mouse.buttonPressEvents[indexEvent];
            }
            for (var indexEvent = 0; indexEvent < Mouse.readedButtonPressEvents.length; indexEvent += 1) {
                Mouse.buttonPressEvents[indexEvent] = Mouse.readedButtonPressEvents[indexEvent];
            }
        };
        Mouse._x = 0;
        Mouse._y = 0;
        Mouse.readedButtonPressEvents = new Array();
        Mouse.oldButtonPressEvents = new Array();
        Mouse.buttonPressEvents = new Array();
        Mouse.pressPositionsX = new Array();
        Mouse.pressPositionsY = new Array();
        return Mouse;
    }());
    Engine.Mouse = Mouse;
    //@ts-ignore
    window.addEventListener("mousedown", Mouse.onDown, false);
    //@ts-ignore
    window.addEventListener("mouseup", Mouse.onUp, false);
    //@ts-ignore
    window.addEventListener("mousemove", Mouse.onMove, false);
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var RendererMode;
    (function (RendererMode) {
        RendererMode[RendererMode["CANVAS_2D"] = 0] = "CANVAS_2D";
        RendererMode[RendererMode["WEB_GL"] = 1] = "WEB_GL";
    })(RendererMode = Engine.RendererMode || (Engine.RendererMode = {}));
    var Renderer = /** @class */ (function () {
        function Renderer() {
        }
        Renderer.xViewToWindow = function (x) {
            return (x + Renderer.xSizeView * 0.5) * (Renderer.xSizeWindow) / Renderer.xSizeView;
        };
        Renderer.yViewToWindow = function (y) {
            return (y + Renderer.ySizeView * 0.5) * (Renderer.ySizeWindow) / Renderer.ySizeView;
        };
        Renderer.camera = function (x, y) {
            Renderer.xCamera = x;
            Renderer.yCamera = y;
            if (Renderer.mode == RendererMode.WEB_GL) {
                Renderer.gl.uniform2f(Renderer.glCameraPosition, x, y);
            }
        };
        Renderer.sizeView = function (x, y) {
            Renderer.xSizeViewIdeal = x;
            Renderer.ySizeViewIdeal = y;
            Renderer.fixViewValues();
            if (Renderer.mode == RendererMode.WEB_GL) {
                Renderer.gl.uniform2f(Renderer.glSizeView, Renderer.xSizeView, Renderer.xSizeView);
            }
        };
        Renderer.scaleView = function (x, y) {
            Renderer.xScaleView = x;
            Renderer.yScaleView = y;
            if (Renderer.mode == RendererMode.WEB_GL) {
                Renderer.gl.uniform2f(Renderer.glScaleView, x, y);
            }
        };
        ;
        Renderer.clearColor = function (red, green, blue) {
            Renderer.clearRed = red;
            Renderer.clearGreen = green;
            Renderer.clearBlue = blue;
            if (Renderer.mode == RendererMode.WEB_GL) {
                Renderer.gl.clearColor(red, green, blue, 1);
            }
        };
        Renderer.fixViewValues = function () {
            Renderer.xFitView = Renderer.ySizeWindow > Renderer.xSizeWindow || (Renderer.xSizeWindow / Renderer.ySizeWindow < (Renderer.xSizeViewIdeal / Renderer.ySizeViewIdeal - 0.001));
            if (Renderer.xFitView) {
                //@ts-ignore
                Renderer.xSizeView = Renderer.xSizeViewIdeal;
                //@ts-ignore
                Renderer.ySizeView = Renderer.ySizeWindow * Renderer.xSizeViewIdeal / Renderer.xSizeWindow;
            }
            else {
                //@ts-ignore
                Renderer.xSizeView = Renderer.xSizeWindow * Renderer.ySizeViewIdeal / Renderer.ySizeWindow;
                //@ts-ignore
                Renderer.ySizeView = Renderer.ySizeViewIdeal;
            }
        };
        //@ts-ignore
        Renderer.fixCanvasSize = function () {
            if (Renderer.autoscale) {
                var xSize = window.innerWidth;
                var ySize = window.innerHeight;
                Renderer.canvas.style.width = "100%";
                Renderer.canvas.style.height = "100%";
                Renderer.canvas.width = xSize * (Renderer.useDPI ? Renderer.dpr : 1);
                Renderer.canvas.height = ySize * (Renderer.useDPI ? Renderer.dpr : 1);
                //@ts-ignore
                Renderer.xSizeWindow = xSize;
                //@ts-ignore
                Renderer.ySizeWindow = ySize;
                Renderer.fixViewValues();
            }
            if (Renderer.mode == RendererMode.WEB_GL) {
                Renderer.gl.viewport(0, 0, Renderer.canvas.width, Renderer.canvas.height);
                Renderer.gl.uniform2f(Renderer.glSizeView, Renderer.xSizeView, Renderer.ySizeView);
            }
            else {
                if (Renderer.context.imageSmoothingEnabled != null && Renderer.context.imageSmoothingEnabled != undefined) {
                    Renderer.context.imageSmoothingEnabled = false;
                }
                //@ts-ignore
                else if (Renderer.context.msImageSmoothingEnabled != null && Renderer.context.msImageSmoothingEnabled != undefined) {
                    //@ts-ignore
                    Renderer.context.msImageSmoothingEnabled = false;
                }
            }
        };
        //@ts-ignore
        Renderer.clear = function () {
            if (Renderer.mode == RendererMode.CANVAS_2D) {
                Renderer.context.fillStyle = "rgba(" + Renderer.clearRed * 255 + ", " + Renderer.clearGreen * 255 + ", " + Renderer.clearBlue * 255 + ", 1.0)";
                Renderer.context.fillRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);
            }
            else {
                Renderer.gl.clear(Renderer.gl.COLOR_BUFFER_BIT);
            }
            //@ts-ignore
            Renderer.drawCalls = 0;
        };
        //@ts-ignore
        Renderer.renderSprite = function (sprite) {
            if (sprite.enabled) {
                if (Renderer.mode == RendererMode.CANVAS_2D) {
                    Renderer.context.scale((Renderer.useDPI ? Renderer.dpr : 1), (Renderer.useDPI ? Renderer.dpr : 1));
                    Renderer.context.translate(Renderer.xSizeWindow * 0.5, Renderer.ySizeWindow * 0.5);
                    if (Renderer.xFitView) {
                        Renderer.context.scale(Renderer.xSizeWindow / Renderer.xSizeView, Renderer.xSizeWindow / Renderer.xSizeView);
                    }
                    else {
                        Renderer.context.scale(Renderer.ySizeWindow / Renderer.ySizeView, Renderer.ySizeWindow / Renderer.ySizeView);
                    }
                    if (Renderer.xScaleView != 1 && Renderer.yScaleView != 1) {
                        Renderer.context.scale(Renderer.xScaleView, Renderer.yScaleView);
                    }
                    if (!sprite.pinned) {
                        Renderer.context.translate(-Renderer.xCamera, -Renderer.yCamera);
                    }
                    Renderer.context.translate(sprite.x, sprite.y);
                    if (sprite.xScale != 1 || sprite.yScale != 1 || sprite.xMirror || sprite.yMirror) {
                        Renderer.context.scale(sprite.xScale * (sprite.xMirror ? -1 : 1), sprite.yScale * (sprite.yMirror ? -1 : 1));
                    }
                    //if(sprite.xSize != sprite.xSizeTexture || sprite.ySize != sprite.ySizeTexture){
                    //    System.context.scale(sprite.xSize / sprite.xSizeTexture, sprite.ySize / sprite.ySizeTexture);
                    //}
                    if (sprite.angle != 0) {
                        Renderer.context.rotate(sprite.angle * Engine.System.PI_OVER_180);
                    }
                    Renderer.context.translate(sprite.xOffset, sprite.yOffset);
                    //@ts-ignore
                    if (sprite.texture == null) {
                        Renderer.context.fillStyle = "rgba(" + sprite.red * 255 + ", " + sprite.green * 255 + ", " + sprite.blue * 255 + ", " + sprite.alpha + ")";
                        Renderer.context.fillRect(0, 0, sprite.xSize, sprite.ySize);
                    }
                    //@ts-ignore
                    else if (sprite.canvasTexture == null) {
                        //@ts-ignore
                        Renderer.context.drawImage(sprite.texture.canvas, sprite.xTexture, sprite.yTexture, sprite.xSizeTexture, sprite.ySizeTexture, 0, 0, sprite.xSize, sprite.ySize);
                    }
                    else {
                        //@ts-ignore
                        Renderer.context.drawImage(sprite.canvasTexture.canvas, 0, 0, sprite.xSizeTexture, sprite.ySizeTexture, 0, 0, sprite.xSize, sprite.ySize);
                    }
                    if (Renderer.context.resetTransform != null && Renderer.context.resetTransform != undefined) {
                        Renderer.context.resetTransform();
                    }
                    else {
                        Renderer.context.setTransform(1, 0, 0, 1, 0, 0);
                    }
                }
                else {
                    if (Renderer.drawableCount == Renderer.maxElementsDrawCall) {
                        Renderer.update();
                    }
                    Renderer.vertexArray.push(sprite.pinned ? 1 : 0);
                    Renderer.vertexArray.push(sprite.x);
                    Renderer.vertexArray.push(sprite.y);
                    Renderer.vertexArray.push(sprite.xOffset);
                    Renderer.vertexArray.push(sprite.yOffset);
                    Renderer.vertexArray.push(sprite.xScale);
                    Renderer.vertexArray.push(sprite.yScale);
                    Renderer.vertexArray.push(sprite.xMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.yMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.angle);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.u0);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.v0);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.texture == null ? -1 : sprite.texture.slot);
                    Renderer.vertexArray.push(sprite.red);
                    Renderer.vertexArray.push(sprite.green);
                    Renderer.vertexArray.push(sprite.blue);
                    Renderer.vertexArray.push(sprite.alpha);
                    Renderer.vertexArray.push(sprite.pinned ? 1 : 0);
                    Renderer.vertexArray.push(sprite.x);
                    Renderer.vertexArray.push(sprite.y);
                    Renderer.vertexArray.push(sprite.xOffset + sprite.xSize);
                    Renderer.vertexArray.push(sprite.yOffset);
                    Renderer.vertexArray.push(sprite.xScale);
                    Renderer.vertexArray.push(sprite.yScale);
                    Renderer.vertexArray.push(sprite.xMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.yMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.angle);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.u1);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.v0);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.texture == null ? -1 : sprite.texture.slot);
                    Renderer.vertexArray.push(sprite.red);
                    Renderer.vertexArray.push(sprite.green);
                    Renderer.vertexArray.push(sprite.blue);
                    Renderer.vertexArray.push(sprite.alpha);
                    Renderer.vertexArray.push(sprite.pinned ? 1 : 0);
                    Renderer.vertexArray.push(sprite.x);
                    Renderer.vertexArray.push(sprite.y);
                    Renderer.vertexArray.push(sprite.xOffset);
                    Renderer.vertexArray.push(sprite.yOffset + sprite.ySize);
                    Renderer.vertexArray.push(sprite.xScale);
                    Renderer.vertexArray.push(sprite.yScale);
                    Renderer.vertexArray.push(sprite.xMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.yMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.angle);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.u0);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.v1);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.texture == null ? -1 : sprite.texture.slot);
                    Renderer.vertexArray.push(sprite.red);
                    Renderer.vertexArray.push(sprite.green);
                    Renderer.vertexArray.push(sprite.blue);
                    Renderer.vertexArray.push(sprite.alpha);
                    Renderer.vertexArray.push(sprite.pinned ? 1 : 0);
                    Renderer.vertexArray.push(sprite.x);
                    Renderer.vertexArray.push(sprite.y);
                    Renderer.vertexArray.push(sprite.xOffset + sprite.xSize);
                    Renderer.vertexArray.push(sprite.yOffset + sprite.ySize);
                    Renderer.vertexArray.push(sprite.xScale);
                    Renderer.vertexArray.push(sprite.yScale);
                    Renderer.vertexArray.push(sprite.xMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.yMirror ? 1 : 0);
                    Renderer.vertexArray.push(sprite.angle);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.u1);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.v1);
                    //@ts-ignore
                    Renderer.vertexArray.push(sprite.texture == null ? -1 : sprite.texture.slot);
                    Renderer.vertexArray.push(sprite.red);
                    Renderer.vertexArray.push(sprite.green);
                    Renderer.vertexArray.push(sprite.blue);
                    Renderer.vertexArray.push(sprite.alpha);
                    Renderer.faceArray.push(Renderer.SPRITE_RENDERER_VERTICES * Renderer.drawableCount + 0);
                    Renderer.faceArray.push(Renderer.SPRITE_RENDERER_VERTICES * Renderer.drawableCount + 1);
                    Renderer.faceArray.push(Renderer.SPRITE_RENDERER_VERTICES * Renderer.drawableCount + 2);
                    Renderer.faceArray.push(Renderer.SPRITE_RENDERER_VERTICES * Renderer.drawableCount + 1);
                    Renderer.faceArray.push(Renderer.SPRITE_RENDERER_VERTICES * Renderer.drawableCount + 3);
                    Renderer.faceArray.push(Renderer.SPRITE_RENDERER_VERTICES * Renderer.drawableCount + 2);
                    Renderer.drawableCount += 1;
                }
            }
        };
        Renderer.update = function () {
            if (Renderer.mode == RendererMode.CANVAS_2D) {
                //@ts-ignore
                Renderer.drawCalls += 1;
            }
            else {
                if (Renderer.drawableCount > 0) {
                    Renderer.gl.bindBuffer(Renderer.gl.ARRAY_BUFFER, Renderer.vertexBuffer);
                    Renderer.gl.bufferData(Renderer.gl.ARRAY_BUFFER, new Float32Array(Renderer.vertexArray), Renderer.gl.DYNAMIC_DRAW);
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexPinned, 1, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (0));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexAnchor, 2, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexPosition, 2, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1 + 2));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexScale, 2, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1 + 2 + 2));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexMirror, 2, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1 + 2 + 2 + 2));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexAngle, 1, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1 + 2 + 2 + 2 + 2));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexUV, 2, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1 + 2 + 2 + 2 + 2 + 1));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexTexture, 1, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2));
                    Renderer.gl.vertexAttribPointer(Renderer.glVertexColor, 4, Renderer.gl.FLOAT, false, 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1 + 4), 4 * (1 + 2 + 2 + 2 + 2 + 1 + 2 + 1));
                    Renderer.gl.bindBuffer(Renderer.gl.ELEMENT_ARRAY_BUFFER, Renderer.faceBuffer);
                    Renderer.gl.bufferData(Renderer.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Renderer.faceArray), Renderer.gl.DYNAMIC_DRAW);
                    Renderer.gl.drawElements(Renderer.gl.TRIANGLES, Renderer.drawableCount * (3 + 3), Renderer.gl.UNSIGNED_SHORT, 0);
                    Renderer.gl.flush();
                    //@ts-ignore
                    Renderer.drawCalls += 1;
                    Renderer.vertexArray = [];
                    Renderer.faceArray = [];
                    Renderer.drawableCount = 0;
                }
            }
        };
        //@ts-ignore
        Renderer.updateHandCursor = function () {
            if (Renderer.useHandPointer) {
                Renderer.canvas.style.cursor = "pointer";
                Renderer.useHandPointer = false;
            }
            else {
                Renderer.canvas.style.cursor = "default";
            }
        };
        //@ts-ignore
        Renderer.init = function () {
            Renderer.canvas = document.getElementById('gameCanvas');
            if (Renderer.autoscale) {
                Renderer.canvas.style.display = "block";
                Renderer.canvas.style.position = "absolute";
                Renderer.canvas.style.top = "0px";
                Renderer.canvas.style.left = "0px";
                var xSize = window.innerWidth;
                var ySize = window.innerHeight;
                Renderer.canvas.style.width = "100%";
                Renderer.canvas.style.height = "100%";
                Renderer.canvas.width = xSize * (Renderer.useDPI ? Renderer.dpr : 1);
                Renderer.canvas.height = ySize * (Renderer.useDPI ? Renderer.dpr : 1);
                //@ts-ignore
                Renderer.xSizeWindow = xSize;
                //@ts-ignore
                Renderer.ySizeWindow = ySize;
                //@ts-ignore
                Renderer.xSizeView = Renderer.xSizeWindow * Renderer.ySizeViewIdeal / Renderer.ySizeWindow;
                //@ts-ignore
                Renderer.ySizeView = Renderer.ySizeViewIdeal;
                Renderer.fixViewValues();
            }
            else {
                //@ts-ignore
                Renderer.xSizeWindow = Renderer.canvas.width;
                //@ts-ignore
                Renderer.ySizeWindow = Renderer.canvas.height;
                //@ts-ignore
                Renderer.xSizeView = Renderer.xSizeWindow * Renderer.ySizeViewIdeal / Renderer.ySizeWindow;
                //@ts-ignore
                Renderer.ySizeView = Renderer.ySizeViewIdeal;
                Renderer.fixViewValues();
            }
            if (Renderer.preferredMode == RendererMode.WEB_GL) {
                try {
                    //@ts-ignore
                    Renderer.gl = Renderer.canvas.getContext("webgl") || Renderer.canvas.getContext("experimental-webgl");
                    //@ts-ignore
                    Renderer.glSupported = Renderer.gl && Renderer.gl instanceof WebGLRenderingContext;
                }
                catch (e) {
                    //@ts-ignore
                    Renderer.glSupported = false;
                }
            }
            if (Renderer.glSupported && Renderer.preferredMode == RendererMode.WEB_GL) {
                //@ts-ignore
                Renderer.mode = RendererMode.WEB_GL;
                Engine.Assets.queue(Renderer.PATH_SHADER_VERTEX);
                Engine.Assets.queue(Renderer.PATH_SHADER_FRAGMENT);
                Engine.Assets.download();
                Renderer.initGL();
            }
            else {
                if (Renderer.preferredMode == RendererMode.CANVAS_2D) {
                    console.error("Set \"Renderer.preferredMode = RendererMode.CANVAS_2D\" only for testing proposes.");
                }
                //@ts-ignore
                Renderer.mode = RendererMode.CANVAS_2D;
                Renderer.context = Renderer.canvas.getContext("2d");
                if (Renderer.context.imageSmoothingEnabled != null && Renderer.context.imageSmoothingEnabled != undefined) {
                    Renderer.context.imageSmoothingEnabled = false;
                }
                //@ts-ignore
                else if (Renderer.context.msImageSmoothingEnabled != null && Renderer.context.msImageSmoothingEnabled != undefined) {
                    //@ts-ignore
                    Renderer.context.msImageSmoothingEnabled = false;
                }
                //@ts-ignore
                Renderer.inited = true;
            }
        };
        Renderer.getGLTextureUnitIndex = function (index) {
            switch (index) {
                case 0: return Renderer.gl.TEXTURE0;
                case 1: return Renderer.gl.TEXTURE1;
                case 2: return Renderer.gl.TEXTURE2;
                case 3: return Renderer.gl.TEXTURE3;
                case 4: return Renderer.gl.TEXTURE4;
                case 5: return Renderer.gl.TEXTURE5;
                case 6: return Renderer.gl.TEXTURE6;
                case 7: return Renderer.gl.TEXTURE7;
                case 8: return Renderer.gl.TEXTURE8;
                case 9: return Renderer.gl.TEXTURE9;
                case 10: return Renderer.gl.TEXTURE10;
                case 11: return Renderer.gl.TEXTURE11;
                case 12: return Renderer.gl.TEXTURE12;
                case 13: return Renderer.gl.TEXTURE13;
                case 14: return Renderer.gl.TEXTURE14;
                case 15: return Renderer.gl.TEXTURE15;
                case 16: return Renderer.gl.TEXTURE16;
                case 17: return Renderer.gl.TEXTURE17;
                case 18: return Renderer.gl.TEXTURE18;
                case 19: return Renderer.gl.TEXTURE19;
                case 20: return Renderer.gl.TEXTURE20;
                case 21: return Renderer.gl.TEXTURE21;
                case 22: return Renderer.gl.TEXTURE22;
                case 23: return Renderer.gl.TEXTURE23;
                case 24: return Renderer.gl.TEXTURE24;
                case 25: return Renderer.gl.TEXTURE25;
                case 26: return Renderer.gl.TEXTURE26;
                case 27: return Renderer.gl.TEXTURE27;
                case 28: return Renderer.gl.TEXTURE28;
                case 29: return Renderer.gl.TEXTURE29;
                case 30: return Renderer.gl.TEXTURE30;
                case 31: return Renderer.gl.TEXTURE31;
                default: return Renderer.gl.NONE;
            }
        };
        Renderer.createShader = function (source, type) {
            var shader = Renderer.gl.createShader(type);
            if (shader == null || shader == Renderer.gl.NONE) {
                console.log("Error");
            }
            else {
                Renderer.gl.shaderSource(shader, source);
                Renderer.gl.compileShader(shader);
                var shaderCompileStatus = Renderer.gl.getShaderParameter(shader, Renderer.gl.COMPILE_STATUS);
                if (shaderCompileStatus <= 0) {
                    console.log("Error");
                }
                else {
                    return shader;
                }
            }
            return Renderer.gl.NONE;
        };
        //@ts-ignore
        Renderer.renderTexture = function (texture, filter) {
            Renderer.textureSamplerIndices[texture.slot] = texture.slot;
            Renderer.gl.uniform1iv(Renderer.glTextureSamplers, new Int32Array(Renderer.textureSamplerIndices));
            Renderer.gl.activeTexture(Renderer.getGLTextureUnitIndex(texture.slot));
            Renderer.gl.bindTexture(Renderer.gl.TEXTURE_2D, Renderer.textureSlots[texture.slot]);
            //@ts-ignore
            Renderer.gl.texImage2D(Renderer.gl.TEXTURE_2D, 0, Renderer.gl.RGBA, texture.assetData.xSize, texture.assetData.ySize, 0, Renderer.gl.RGBA, Renderer.gl.UNSIGNED_BYTE, new Uint8Array(texture.assetData.bytes));
            //@ts-ignore
            if (filter && texture.assetData.filterable) {
                Renderer.gl.generateMipmap(Renderer.gl.TEXTURE_2D);
                Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MAG_FILTER, Renderer.gl.LINEAR);
                Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MIN_FILTER, Renderer.gl.LINEAR_MIPMAP_LINEAR);
            }
            else {
                Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MAG_FILTER, Renderer.gl.NEAREST);
                Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MIN_FILTER, Renderer.gl.NEAREST);
                Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_WRAP_T, Renderer.gl.CLAMP_TO_EDGE);
                Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_WRAP_S, Renderer.gl.CLAMP_TO_EDGE);
            }
        };
        Renderer.initGL = function () {
            if (Engine.Assets.downloadComplete) {
                for (var indexSlot = 0; indexSlot < Renderer.MAX_TEXTURE_SLOTS; indexSlot += 1) {
                    Renderer.textureSamplerIndices[indexSlot] = 0;
                }
                //TODO: USE Renderer.gl.MAX_TEXTURE_IMAGE_UNITS
                Renderer.vertexShader = Renderer.createShader(Engine.Assets.loadText(Renderer.PATH_SHADER_VERTEX), Renderer.gl.VERTEX_SHADER);
                var fragmentSource = "#define MAX_TEXTURE_SLOTS " + Renderer.MAX_TEXTURE_SLOTS + "\n" + "precision mediump float;\n" + Engine.Assets.loadText(Renderer.PATH_SHADER_FRAGMENT);
                Renderer.fragmentShader = Renderer.createShader(fragmentSource, Renderer.gl.FRAGMENT_SHADER);
                Renderer.shaderProgram = Renderer.gl.createProgram();
                if (Renderer.shaderProgram == null || Renderer.shaderProgram == 0) {
                    console.log("Error");
                }
                else {
                    Renderer.gl.attachShader(Renderer.shaderProgram, Renderer.vertexShader);
                    Renderer.gl.attachShader(Renderer.shaderProgram, Renderer.fragmentShader);
                    Renderer.gl.linkProgram(Renderer.shaderProgram);
                    Renderer.glTextureSamplers = Renderer.gl.getUniformLocation(Renderer.shaderProgram, "textures");
                    Renderer.glSizeView = Renderer.gl.getUniformLocation(Renderer.shaderProgram, "view_size");
                    Renderer.glScaleView = Renderer.gl.getUniformLocation(Renderer.shaderProgram, "view_scale");
                    Renderer.glCameraPosition = Renderer.gl.getUniformLocation(Renderer.shaderProgram, "camera_position");
                    //Renderer.glTopLeftCamera = Renderer.gl.getUniformLocation(Renderer.shaderProgram, "top_left_camera");
                    //glPixelPerfect = Renderer.gl.getUniformLocation(shaderProgram, "pixel_perfect");
                    Renderer.glVertexPinned = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_pinned");
                    Renderer.glVertexAnchor = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_anchor");
                    Renderer.glVertexPosition = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_position");
                    Renderer.glVertexScale = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_scale");
                    Renderer.glVertexMirror = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_mirror");
                    Renderer.glVertexAngle = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_angle");
                    Renderer.glVertexUV = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_uv");
                    Renderer.glVertexTexture = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_texture");
                    Renderer.glVertexColor = Renderer.gl.getAttribLocation(Renderer.shaderProgram, "vertex_color");
                    Renderer.gl.useProgram(Renderer.shaderProgram);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexPinned);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexAnchor);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexPosition);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexScale);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexMirror);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexAngle);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexUV);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexTexture);
                    Renderer.gl.enableVertexAttribArray(Renderer.glVertexColor);
                    Renderer.gl.uniform1iv(Renderer.glTextureSamplers, new Int32Array(Renderer.textureSamplerIndices));
                    Renderer.gl.viewport(0, 0, Renderer.canvas.width, Renderer.canvas.height);
                    Renderer.gl.uniform2f(Renderer.glSizeView, Renderer.xSizeView, Renderer.ySizeView);
                    Renderer.gl.uniform2f(Renderer.glScaleView, Renderer.xScaleView, Renderer.yScaleView);
                    //TODO: Android
                    //Renderer.gl.uniform2f(rly_cursor_location, rly_cursorX, rly_cursorY);
                    //Renderer.gl.uniform1iv(rly_top_left_cursor_location, rly_top_left_cursor);
                    //Renderer.gl.uniform1iv(rly_pixel_perfect_location, rly_pixel_perfect);
                    Renderer.vertexBuffer = Renderer.gl.createBuffer();
                    Renderer.faceBuffer = Renderer.gl.createBuffer();
                    Renderer.gl.enable(Renderer.gl.BLEND);
                    Renderer.gl.blendFuncSeparate(Renderer.gl.SRC_ALPHA, Renderer.gl.ONE_MINUS_SRC_ALPHA, Renderer.gl.ZERO, Renderer.gl.ONE);
                    //glBlendFunc(Renderer.gl.ONE, Renderer.gl.ONE_MINUS_SRC_ALPHA);
                    Renderer.gl.clearColor(Renderer.clearRed, Renderer.clearGreen, Renderer.clearBlue, 1);
                    //Renderer.gl.clear(Renderer.gl.COLOR_BUFFER_BIT);
                    for (var indexSlot = 0; indexSlot < Renderer.MAX_TEXTURE_SLOTS; indexSlot += 1) {
                        Renderer.textureSlots[indexSlot] = Renderer.gl.createTexture();
                        Renderer.gl.activeTexture(Renderer.getGLTextureUnitIndex(indexSlot));
                        Renderer.gl.bindTexture(Renderer.gl.TEXTURE_2D, Renderer.textureSlots[indexSlot]);
                        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MAG_FILTER, Renderer.gl.NEAREST);
                        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_MIN_FILTER, Renderer.gl.NEAREST);
                        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_WRAP_T, Renderer.gl.CLAMP_TO_EDGE);
                        Renderer.gl.texParameteri(Renderer.gl.TEXTURE_2D, Renderer.gl.TEXTURE_WRAP_S, Renderer.gl.CLAMP_TO_EDGE);
                    }
                    Renderer.gl.activeTexture(Renderer.getGLTextureUnitIndex(0));
                    Renderer.gl.bindTexture(Renderer.gl.TEXTURE_2D, Renderer.textureSlots[0]);
                    Renderer.gl.texImage2D(Renderer.gl.TEXTURE_2D, 0, Renderer.gl.RGBA, 2, 2, 0, Renderer.gl.RGBA, Renderer.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]));
                }
                Renderer.gl.clearColor(Renderer.clearRed, Renderer.clearGreen, Renderer.clearBlue, 1);
                //@ts-ignore
                Renderer.inited = true;
            }
            else {
                setTimeout(Renderer.initGL, 1.0 / 60.0);
            }
        };
        //GL
        Renderer.MAX_TEXTURE_SLOTS = 8;
        Renderer.SPRITE_RENDERER_VERTICES = 4;
        //private static readonly  SPRITE_RENDERER_VERTEX_ATTRIBUTES = 17;
        //private static readonly  SPRITE_RENDERER_FACE_INDICES = 6;
        Renderer.PATH_SHADER_VERTEX = "System/Vertex.glsl";
        Renderer.PATH_SHADER_FRAGMENT = "System/Fragment.glsl";
        Renderer.inited = false;
        Renderer.preferredMode = RendererMode.WEB_GL;
        Renderer.glSupported = false;
        Renderer.useHandPointer = false;
        //private static topLeftCamera = false;
        Renderer.xCamera = 0;
        Renderer.yCamera = 0;
        Renderer.xSizeViewIdeal = 160 * 1;
        Renderer.ySizeViewIdeal = 120 * 1;
        Renderer.clearRed = 234.0 / 255.0;
        Renderer.clearGreen = 247.0 / 255.0;
        Renderer.clearBlue = 196.0 / 255.0;
        Renderer.xFitView = false;
        Renderer.xScaleView = 1;
        Renderer.yScaleView = 1;
        Renderer.drawCalls = 0;
        Renderer.autoscale = true;
        Renderer.maxElementsDrawCall = 8192;
        Renderer.textureSlots = new Array();
        Renderer.drawableCount = 0;
        Renderer.vertexArray = new Array();
        Renderer.faceArray = new Array();
        Renderer.textureSamplerIndices = new Array();
        Renderer.useDPI = true;
        Renderer.dpr = window.devicePixelRatio || 1;
        Renderer.a = false;
        return Renderer;
    }());
    Engine.Renderer = Renderer;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Scene = /** @class */ (function () {
        function Scene() {
            //@ts-ignore
            if (!Engine.System.canCreateScene || Engine.System.creatingScene) {
                console.log("error");
            }
            //@ts-ignore
            Engine.System.creatingScene = true;
        }
        Object.defineProperty(Scene.prototype, "preserved", {
            get: function () {
                return false;
            },
            //@ts-ignore
            set: function (value) {
                console.log("ERROR");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "owner", {
            get: function () {
                return null;
            },
            //@ts-ignore
            set: function (value) {
                console.log("ERROR");
            },
            enumerable: false,
            configurable: true
        });
        return Scene;
    }());
    Engine.Scene = Scene;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var EventType;
    (function (EventType) {
        EventType[EventType["CUSTOM"] = 0] = "CUSTOM";
        EventType[EventType["CREATE_SCENE"] = 1] = "CREATE_SCENE";
        EventType[EventType["INIT_SCENE"] = 2] = "INIT_SCENE";
        EventType[EventType["RESET_SCENE"] = 3] = "RESET_SCENE";
        EventType[EventType["VIEW_UPDATE"] = 4] = "VIEW_UPDATE";
        EventType[EventType["STEP_UPDATE"] = 5] = "STEP_UPDATE";
        EventType[EventType["TIME_UPDATE"] = 6] = "TIME_UPDATE";
        EventType[EventType["CLEAR_SCENE"] = 7] = "CLEAR_SCENE";
        EventType[EventType["DESTROY"] = 8] = "DESTROY";
        EventType[EventType["SURVIVE"] = 9] = "SURVIVE";
    })(EventType = Engine.EventType || (Engine.EventType = {}));
    var EventListenerGroup = /** @class */ (function () {
        function EventListenerGroup(name) {
            this.name = "";
            this.receptors = new Array();
            this.name = name;
        }
        return EventListenerGroup;
    }());
    var EventReceptor = /** @class */ (function () {
        function EventReceptor(chainable, action) {
            this.chainable = chainable;
            this.action = action;
        }
        return EventReceptor;
    }());
    var System = /** @class */ (function () {
        function System() {
        }
        System.triggerEvents = function (type) {
            for (var _i = 0, _a = System.listenerGroups[type]; _i < _a.length; _i++) {
                var listener = _a[_i];
                for (var _b = 0, _c = listener.receptors; _b < _c.length; _b++) {
                    var receptor = _c[_b];
                    receptor.action(receptor.chainable);
                }
            }
        };
        System.triggerCustomEvent = function (name) {
            for (var _i = 0, _a = System.listenerGroups[EventType.CUSTOM]; _i < _a.length; _i++) {
                var listener = _a[_i];
                if (listener.name == name) {
                    for (var _b = 0, _c = listener.receptors; _b < _c.length; _b++) {
                        var receptor = _c[_b];
                        receptor.action(receptor.chainable);
                    }
                    return;
                }
            }
            console.log("error");
        };
        System.getDestroyReceptors = function () {
            var callReceptors = [];
            for (var _i = 0, _a = System.listenerGroups[EventType.DESTROY]; _i < _a.length; _i++) {
                var listener = _a[_i];
                for (var _b = 0, _c = listener.receptors; _b < _c.length; _b++) {
                    var receptor = _c[_b];
                    var owner = receptor.chainable;
                    while (owner.owner != null) {
                        owner = owner.owner;
                    }
                    if (owner.preserved == null || !owner.preserved) {
                        callReceptors.push(receptor);
                    }
                }
            }
            return callReceptors;
        };
        System.onViewChanged = function () {
            System.triggerEvents(EventType.VIEW_UPDATE);
        };
        System.onStepUpdate = function () {
            if (System.nextSceneClass != null) {
                System.needReset = true;
                if (System.currentScene != null) {
                    System.triggerEvents(EventType.CLEAR_SCENE);
                    var destroyReceptors = System.getDestroyReceptors();
                    for (var _i = 0, _a = System.listenerGroups; _i < _a.length; _i++) {
                        var listenerGroup = _a[_i];
                        for (var _b = 0, listenerGroup_1 = listenerGroup; _b < listenerGroup_1.length; _b++) {
                            var listener = listenerGroup_1[_b];
                            var newReceptors = [];
                            for (var _c = 0, _d = listener.receptors; _c < _d.length; _c++) {
                                var receptor = _d[_c];
                                var owner = receptor.chainable;
                                while (owner.owner != null) {
                                    owner = owner.owner;
                                }
                                if (owner.preserved != null && owner.preserved) {
                                    newReceptors.push(receptor);
                                }
                            }
                            listener.receptors = newReceptors;
                        }
                    }
                    for (var _e = 0, destroyReceptors_1 = destroyReceptors; _e < destroyReceptors_1.length; _e++) {
                        var receptor = destroyReceptors_1[_e];
                        receptor.action(receptor.chainable);
                    }
                    //@ts-ignore
                    Engine.Texture.recycleAll();
                    //@ts-ignore
                    Engine.AudioPlayer.recycleAll();
                    System.triggerEvents(EventType.SURVIVE);
                }
                System.currentSceneClass = System.nextSceneClass;
                System.nextSceneClass = null;
                //@ts-ignore
                System.canCreateScene = true;
                //@ts-ignore
                System.currentScene = new System.currentSceneClass();
                System.triggerEvents(EventType.CREATE_SCENE);
                System.addListenersFrom(System.currentScene);
                //@ts-ignore
                System.canCreateScene = false;
                System.creatingScene = false;
                System.triggerEvents(EventType.INIT_SCENE);
            }
            if (System.needReset) {
                System.needReset = false;
                System.triggerEvents(EventType.RESET_SCENE);
            }
            System.triggerEvents(EventType.STEP_UPDATE);
        };
        System.onTimeUpdate = function () {
            //@ts-ignore
            Engine.AudioManager.checkSuspended();
            System.triggerEvents(EventType.TIME_UPDATE);
        };
        System.requireReset = function () {
            System.needReset = true;
        };
        System.update = function () {
            //if(System.hasFocus && !document.hasFocus()){
            //    System.hasFocus = false;
            //    Engine.pause();
            //}
            //else if(!System.hasFocus && document.hasFocus()){
            //    System.hasFocus = true;
            //    Engine.resume();
            //}
            if (System.pauseCount == 0) {
                //@ts-ignore
                Engine.Renderer.clear();
                while (System.stepTimeCount >= System.STEP_DELTA_TIME) {
                    //@ts-ignore
                    System.stepExtrapolation = 1;
                    if (System.inputInStepUpdate) {
                        //(NewKit as any).updateTouchscreen();
                        //@ts-ignore
                        Engine.Keyboard.update();
                        //@ts-ignore
                        Engine.Mouse.update();
                        //@ts-ignore
                        Engine.TouchInput.update();
                    }
                    System.onStepUpdate();
                    //@ts-ignore
                    Engine.Renderer.updateHandCursor();
                    System.stepTimeCount -= System.STEP_DELTA_TIME;
                }
                //@ts-ignore
                System.stepExtrapolation = System.stepTimeCount / System.STEP_DELTA_TIME;
                if (Engine.Renderer.xSizeWindow != window.innerWidth || Engine.Renderer.ySizeWindow != window.innerHeight) {
                    //@ts-ignore
                    Engine.Renderer.fixCanvasSize();
                    System.triggerEvents(EventType.VIEW_UPDATE);
                }
                if (!System.inputInStepUpdate) {
                    //(NewKit as any).updateTouchscreen();
                    //@ts-ignore
                    Engine.Keyboard.update();
                    //@ts-ignore
                    Engine.Mouse.update();
                    //@ts-ignore
                    Engine.TouchInput.update();
                }
                System.onTimeUpdate();
                //@ts-ignore
                Engine.Renderer.update();
                //@ts-ignore
                var nowTime = Date.now() / 1000.0;
                //@ts-ignore
                System.deltaTime = nowTime - System.oldTime;
                if (System.deltaTime > System.MAX_DELTA_TIME) {
                    //@ts-ignore
                    System.deltaTime = System.MAX_DELTA_TIME;
                }
                else if (System.deltaTime < 0) {
                    //@ts-ignore
                    System.deltaTime = 0;
                }
                System.stepTimeCount += System.deltaTime;
                System.oldTime = nowTime;
            }
            window.requestAnimationFrame(System.update);
        };
        System.pause = function () {
            //@ts-ignore
            System.pauseCount += 1;
            if (System.pauseCount == 1) {
                //@ts-ignore
                Engine.AudioManager.pause();
            }
        };
        ;
        System.resume = function () {
            if (System.pauseCount > 0) {
                //@ts-ignore
                System.pauseCount -= 1;
                if (System.pauseCount == 0) {
                    //@ts-ignore
                    Engine.AudioManager.resume();
                    System.oldTime = Date.now() - System.STEP_DELTA_TIME;
                }
            }
            else {
                console.log("error");
            }
        };
        ;
        System.start = function () {
            if (Engine.Renderer.inited && Engine.AudioManager.inited) {
                System.canCreateEvents = true;
                System.onInit();
                System.canCreateEvents = false;
                //@ts-ignore
                System.started = true;
                window.requestAnimationFrame(System.update);
            }
            else {
                setTimeout(System.start, 1.0 / 60.0);
            }
        };
        System.run = function () {
            System.onRun();
            if (System.inited) {
                console.log("ERROR");
            }
            else {
                System.inited = true;
                //@ts-ignore
                Engine.Renderer.init();
                //@ts-ignore
                Engine.AudioManager.init();
                setTimeout(System.start, 1.0 / 60.0);
            }
        };
        System.STEP_DELTA_TIME = 1.0 / 60.0;
        System.MAX_DELTA_TIME = System.STEP_DELTA_TIME * 4;
        System.PI_OVER_180 = Math.PI / 180;
        System.inited = false;
        System.started = false;
        System.stepTimeCount = 0;
        System.stepExtrapolation = 0;
        System.oldTime = 0;
        System.deltaTime = 0;
        System.pauseCount = 0;
        System.listenerGroups = [[], [], [], [], [], [], [], [], [], []];
        System.canCreateEvents = false;
        System.canCreateScene = false;
        System.creatingScene = false;
        System.needReset = false;
        /*
        Engine.useHandPointer = false;
        Engine.onclick = null;
        */
        System.inputInStepUpdate = true;
        System.createEvent = function (type, name) {
            if (System.canCreateEvents) {
                System.listenerGroups[type].push(new EventListenerGroup(name));
            }
            else {
                console.log("error");
            }
        };
        System.addListenersFrom = function (chainable) {
            if (!System.creatingScene) {
                console.log("error");
            }
            for (var _i = 0, _a = System.listenerGroups; _i < _a.length; _i++) {
                var listenerGroup = _a[_i];
                for (var _b = 0, listenerGroup_2 = listenerGroup; _b < listenerGroup_2.length; _b++) {
                    var listener = listenerGroup_2[_b];
                    if (chainable.constructor != null) {
                        for (var prop in chainable.constructor) {
                            if (prop == listener.name) {
                                listener.receptors.push(new EventReceptor(chainable, chainable.constructor[prop]));
                            }
                        }
                    }
                    for (var prop in chainable) {
                        if (prop == listener.name) {
                            listener.receptors.push(new EventReceptor(chainable, chainable[prop].bind(chainable)));
                        }
                    }
                }
            }
        };
        System.onRun = function () {
        };
        return System;
    }());
    Engine.System = System;
    if (!window.requestAnimationFrame) {
        //@ts-ignore
        window.requestAnimationFrame = function () {
            window.requestAnimationFrame =
                window['requestAnimationFrame'] ||
                    //@ts-ignore
                    window['mozRequestAnimationFrame'] ||
                    window['webkitRequestAnimationFrame'] ||
                    //@ts-ignore
                    window['msRequestAnimationFrame'] ||
                    //@ts-ignore
                    window['oRequestAnimationFrame'] ||
                    //@ts-ignore
                    function (callback, element) {
                        element = element;
                        window.setTimeout(callback, 1000 / 60);
                    };
        };
    }
    window.onclick = function (event) {
        //@ts-ignore
        Engine.AudioManager.verify();
        Engine.LinkManager.triggerMouse(event);
    };
    window.ontouchstart = function (event) {
        //window.onclick = function(_event : MouseEvent){}
        //@ts-ignore
        Engine.AudioManager.verify();
        Engine.LinkManager.triggerTouch(event);
    };
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var Texture = /** @class */ (function () {
        function Texture(path, hasClearColor, filter) {
            this._path = "";
            this.slot = 0;
            this.preserved = false;
            //@ts-ignore
            if (!Engine.System.creatingScene) {
                console.error("error");
            }
            this._path = path;
            //@ts-ignore
            this.slot = Texture.textures.length;
            this.assetData = Engine.Assets.loadImage(path);
            this.filter = filter;
            if (hasClearColor) {
                this.applyClearColor();
            }
            if (Engine.Renderer.mode == Engine.RendererMode.CANVAS_2D) {
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.assetData.xSize;
                this.canvas.height = this.assetData.ySize;
                this.context = this.canvas.getContext("2d");
                this.context.putImageData(this.assetData.imageData, 0, 0);
            }
            else {
                //@ts-ignore
                Engine.Renderer.renderTexture(this, this.filter);
            }
            Texture.textures.push(this);
        }
        Object.defineProperty(Texture.prototype, "path", {
            get: function () {
                return this._path;
            },
            enumerable: false,
            configurable: true
        });
        //@ts-ignore
        Texture.recycleAll = function () {
            var newTextures = new Array();
            for (var _i = 0, _a = Texture.textures; _i < _a.length; _i++) {
                var texture = _a[_i];
                var owner = texture;
                while (owner.owner != null) {
                    owner = owner.owner;
                }
                if (owner.preserved) {
                    var oldSlot = texture.slot;
                    //@ts-ignore
                    texture.slot = newTextures.length;
                    if (Engine.Renderer.mode == Engine.RendererMode.WEB_GL && oldSlot != texture.slot) {
                        //@ts-ignore
                        Engine.Renderer.renderTexture(texture);
                    }
                    newTextures.push(texture);
                }
            }
            Texture.textures = newTextures;
        };
        Texture.prototype.getRed = function (x, y) {
            return this.assetData.bytes[(y * this.assetData.xSize + x) * 4];
        };
        Texture.prototype.getGreen = function (x, y) {
            return this.assetData.bytes[(y * this.assetData.xSize + x) * 4 + 1];
        };
        Texture.prototype.getBlue = function (x, y) {
            return this.assetData.bytes[(y * this.assetData.xSize + x) * 4 + 2];
        };
        Texture.prototype.getAlpha = function (x, y) {
            return this.assetData.bytes[(y * this.assetData.xSize + x) * 4 + 3];
        };
        Texture.prototype.setRGBA = function (x, y, r, g, b, a) {
            this.assetData.bytes[(y * this.assetData.xSize + x) * 4 + 0] = r;
            this.assetData.bytes[(y * this.assetData.xSize + x) * 4 + 1] = g;
            this.assetData.bytes[(y * this.assetData.xSize + x) * 4 + 2] = b;
            this.assetData.bytes[(y * this.assetData.xSize + x) * 4 + 3] = a;
        };
        Texture.prototype.applyClearColor = function () {
            var color = {};
            color.r = this.getRed(0, 0);
            color.g = this.getGreen(0, 0);
            color.b = this.getBlue(0, 0);
            color.a = this.getAlpha(0, 0);
            for (var yIndex = 0; yIndex < this.assetData.ySize; yIndex += 1) {
                for (var xIndex = 0; xIndex < this.assetData.xSize; xIndex += 1) {
                    if (color.r == this.getRed(xIndex, yIndex) && color.g == this.getGreen(xIndex, yIndex) && color.b == this.getBlue(xIndex, yIndex) && color.a == this.getAlpha(xIndex, yIndex)) {
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 0] = 0;
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 1] = 0;
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 2] = 0;
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 3] = 0;
                    }
                }
            }
        };
        Texture.prototype.clear = function () {
            for (var yIndex = 0; yIndex < this.assetData.ySize; yIndex += 1) {
                for (var xIndex = 0; xIndex < this.assetData.xSize; xIndex += 1) {
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 0] = 0;
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 1] = 0;
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 2] = 0;
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 3] = 0;
                }
            }
        };
        Texture.prototype.copy = function (other) {
            for (var yIndex = 0; yIndex < this.assetData.ySize; yIndex += 1) {
                for (var xIndex = 0; xIndex < this.assetData.xSize; xIndex += 1) {
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 0] = other.assetData.bytes[(yIndex * other.assetData.xSize + xIndex) * 4 + 0];
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 1] = other.assetData.bytes[(yIndex * other.assetData.xSize + xIndex) * 4 + 1];
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 2] = other.assetData.bytes[(yIndex * other.assetData.xSize + xIndex) * 4 + 2];
                    this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 3] = other.assetData.bytes[(yIndex * other.assetData.xSize + xIndex) * 4 + 3];
                }
            }
        };
        Texture.prototype.clearColor = function (x, y) {
            var r = this.getRed(x, y);
            var g = this.getRed(x, y);
            var b = this.getRed(x, y);
            var a = this.getRed(x, y);
            for (var yIndex = 0; yIndex < this.assetData.ySize; yIndex += 1) {
                for (var xIndex = 0; xIndex < this.assetData.xSize; xIndex += 1) {
                    if (r == this.getRed(xIndex, yIndex) && g == this.getGreen(xIndex, yIndex) && b == this.getBlue(xIndex, yIndex) && a == this.getAlpha(xIndex, yIndex)) {
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 0] = 0;
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 1] = 0;
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 2] = 0;
                        this.assetData.bytes[(yIndex * this.assetData.xSize + xIndex) * 4 + 3] = 0;
                    }
                }
            }
        };
        Texture.prototype.renderAgain = function () {
            //console.error("OPTIMIZE THIS");
            //@ts-ignore
            Engine.Renderer.renderTexture(this, this.filter);
        };
        Texture.textures = new Array();
        return Texture;
    }());
    Engine.Texture = Texture;
})(Engine || (Engine = {}));
var Engine;
(function (Engine) {
    var TouchState;
    (function (TouchState) {
        TouchState[TouchState["New"] = 0] = "New";
        TouchState[TouchState["Pressed"] = 1] = "Pressed";
        TouchState[TouchState["Down"] = 2] = "Down";
        TouchState[TouchState["Canceled"] = 3] = "Canceled";
        TouchState[TouchState["Released"] = 4] = "Released";
    })(TouchState || (TouchState = {}));
    var TouchData = /** @class */ (function () {
        function TouchData(touch, state) {
            this.start = touch;
            this.previous = touch;
            this.current = touch;
            this.next = null;
            this.state = state;
        }
        return TouchData;
    }());
    var touchDataArray = new Array();
    var touchStart = function (event) {
        event.preventDefault();
        for (var indexEventTouch = 0; indexEventTouch < event.changedTouches.length; indexEventTouch += 1) {
            var touch = event.changedTouches.item(indexEventTouch);
            var add = true;
            for (var indexTouchData = 0; indexTouchData < touchDataArray.length; indexTouchData += 1) {
                var touchData = touchDataArray[indexTouchData];
                if (touchData == null) {
                    touchDataArray[indexTouchData] = new TouchData(touch, TouchState.New);
                    add = false;
                    break;
                }
                if (touch.identifier == touchData.current.identifier) {
                    if (touchData.state == TouchState.Canceled || touchData.state == TouchState.Released) {
                        touchDataArray[indexTouchData] = new TouchData(touch, TouchState.New);
                    }
                    else {
                        touchDataArray[indexTouchData].next = touch;
                    }
                    add = false;
                    break;
                }
            }
            if (add) {
                touchDataArray.push(new TouchData(touch, TouchState.New));
            }
        }
    };
    var touchMove = function (event) {
        event.preventDefault();
        for (var indexEventTouch = 0; indexEventTouch < event.changedTouches.length; indexEventTouch += 1) {
            var touch = event.changedTouches.item(indexEventTouch);
            for (var indexTouchData = 0; indexTouchData < touchDataArray.length; indexTouchData += 1) {
                var touchData = touchDataArray[indexTouchData];
                if (touchData != null && touchData.start.identifier == touch.identifier) {
                    touchData.next = touch;
                    break;
                }
            }
        }
    };
    var touchCancel = function (event) {
        event.preventDefault();
        for (var indexEventTouch = 0; indexEventTouch < event.changedTouches.length; indexEventTouch += 1) {
            var touch = event.changedTouches.item(indexEventTouch);
            for (var indexTouchData = 0; indexTouchData < touchDataArray.length; indexTouchData += 1) {
                var touchData = touchDataArray[indexTouchData];
                if (touchData != null && touchData.start.identifier == touch.identifier) {
                    touchData.next = touch;
                    if (touchData.state == TouchState.New || touchData.state == TouchState.Pressed || touchData.state == TouchState.Down) {
                        touchData.state = TouchState.Canceled;
                    }
                    break;
                }
            }
        }
    };
    var touchEnd = function (event) {
        touchCancel(event);
    };
    window.addEventListener("touchstart", touchStart, { passive: false });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchcancel", touchCancel, { passive: false });
    window.addEventListener("touchend", touchEnd, { passive: false });
    window.document.addEventListener("touchstart", function (e) {
        e.preventDefault();
    }, { passive: false });
    window.document.addEventListener("touchmove", function (e) {
        e.preventDefault();
    }, { passive: false });
    window.document.addEventListener("touchcancel", function (e) {
        e.preventDefault();
    }, { passive: false });
    window.document.addEventListener("touchend", function (e) {
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('gesturechange', function (e) {
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('gestureend', function (e) {
        e.preventDefault();
    }, { passive: false });
    window.document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    }, { passive: false });
    window.document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
    }, { passive: false });
    window.document.addEventListener('gestureend', function (e) {
        e.preventDefault();
    }, { passive: false });
    var TouchInput = /** @class */ (function () {
        function TouchInput() {
        }
        TouchInput.findDown = function (x0, y0, x1, y1, useRadius, findPressed) {
            for (var _i = 0, touchDataArray_1 = touchDataArray; _i < touchDataArray_1.length; _i++) {
                var touchData = touchDataArray_1[_i];
                if (touchData != null) {
                    var touch = touchData.current;
                    if (touchData.state == TouchState.Pressed || (!findPressed && touchData.state == TouchState.Down)) {
                        var radius = touch.radiusX < touch.radiusY ? touch.radiusX : touch.radiusY;
                        //if(radius == null || radius == undefined){
                        radius = 1;
                        //}
                        if (!useRadius) {
                            radius = 1;
                        }
                        radius = radius == 0 ? 1 : radius;
                        var x = touch.clientX / radius;
                        var y = touch.clientY / radius;
                        if (x != 0 && y != 0) {
                            var rx0 = x0 / radius;
                            var ry0 = y0 / radius;
                            var rx1 = x1 / radius;
                            var ry1 = y1 / radius;
                            if (x >= rx0 && x <= rx1 && y >= ry0 && y <= ry1) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };
        TouchInput.down = function (x0, y0, x1, y1, useRadius) {
            return TouchInput.findDown(x0, y0, x1, y1, useRadius, false);
        };
        TouchInput.pressed = function (x0, y0, x1, y1, useRadius) {
            return TouchInput.findDown(x0, y0, x1, y1, useRadius, true);
        };
        //@ts-ignore
        TouchInput.update = function () {
            for (var indexTouchData = 0; indexTouchData < touchDataArray.length; indexTouchData += 1) {
                var touchData = touchDataArray[indexTouchData];
                if (touchData != null) {
                    if (touchData.next != null) {
                        touchData.previous = touchData.current;
                        touchData.current = touchData.next;
                        touchData.next = null;
                    }
                    //window.parent.document.getElementById("myHeader").textContent = touchData.current.identifier + " " + touchData.current.force + " " + touchData.current.radiusX;
                    switch (touchData.state) {
                        case TouchState.New:
                            touchData.state = TouchState.Pressed;
                            break;
                        case TouchState.Pressed:
                            touchData.state = TouchState.Down;
                            break;
                        case TouchState.Canceled:
                            touchData.state = TouchState.Released;
                            break;
                        case TouchState.Released:
                            touchDataArray[indexTouchData] = null;
                            break;
                    }
                }
            }
        };
        return TouchInput;
    }());
    Engine.TouchInput = TouchInput;
})(Engine || (Engine = {}));
///<reference path="../Engine/System.ts"/>
///<reference path="../Engine/AudioManager.ts"/>
///<reference path="../Engine/Renderer.ts"/>
var Game;
(function (Game) {
    //Engine.Renderer.preferredMode = Engine.RendererMode.CANVAS_2D;
    //Engine.AudioManager.preferredMode = Engine.AudioManagerMode.HTML;
    Engine.System.onInit = function () {
        if (Engine.Data.useLocalStorage) {
            Engine.Data.setID("com", "noa", "stilt");
        }
        else {
            Engine.Data.setID("c", "n", "stilt");
        }
        //SceneColors.clearColor(255, 255, 255);
        Engine.System.createEvent(Engine.EventType.CREATE_SCENE, "onCreateScene");
        Engine.System.createEvent(Engine.EventType.INIT_SCENE, "onInitScene");
        Engine.System.createEvent(Engine.EventType.RESET_SCENE, "onReset");
        Engine.System.createEvent(Engine.EventType.RESET_SCENE, "onStart");
        Engine.System.createEvent(Engine.EventType.VIEW_UPDATE, "onViewUpdateAnchor");
        Engine.System.createEvent(Engine.EventType.VIEW_UPDATE, "onViewUpdateText");
        Engine.System.createEvent(Engine.EventType.VIEW_UPDATE, "onViewUpdate");
        Engine.System.createEvent(Engine.EventType.CUSTOM, "onGameSwitchChange");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onControlPreUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onControlUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onMoveReady");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onMoveConfigUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onPlatformMoveUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onMoveUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onOverlapPreUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onOverlapUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onOverlapBlockUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onAnimationUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onStepUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onStepLateUpdate");
        Engine.System.createEvent(Engine.EventType.STEP_UPDATE, "onStepUpdateFade");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onTimeUpdate");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onTimeUpdateSceneBeforeDrawFixed");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawBackground");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawSceneSky");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawSceneMap");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawBlocks");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawSceneFill");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawTextSuperBack");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticlesBack");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawPlatforms");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawStaticDecoration");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawSpeedrunDialog");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawBackStilt");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawBubbles");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawObjectsBack");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticles");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawGoal");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticlesSpark");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawSpark");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawObjects");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawLance");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawJumper");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawLava");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticlesNeoA");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawBoxes");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawBigBlob");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticlesFrontPaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawPlayerPaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawGoalPaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawObjectsFrontPaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawGoalParticlesFrontPaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticlesPaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawControlsPaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawPause");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawBubblesDialog");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawButtons");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawDialogs");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawPreloadParticles");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawText");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticlesFrontUnpaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawPlayerUnpaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawGoalUnpaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawObjectsFrontUnpaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawGoalParticlesFrontUnpaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawParticlesUnpaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawControlsUnpaused");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawObjectsAfterUI");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawFade");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawOrientationUI");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawAdFade");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawAdFrame");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawTextFront");
        Engine.System.createEvent(Engine.EventType.TIME_UPDATE, "onDrawTest");
        Engine.System.createEvent(Engine.EventType.CLEAR_SCENE, "onClearScene");
        console.log(document.cookie);
        for (var i = 1; i <= Game.MAX_LEVELS; i += 1) {
            Game.dataLevels[i] = Engine.Data.load("level" + i) || "locked";
        }
        if (Game.dataLevels[1] == "locked") {
            Game.dataLevels[1] = "unlocked";
        }
        Game.levelSpeedrun = +(Engine.Data.load("speedrunlevel"));
        Game.levelSpeedrun = isNaN(Game.levelSpeedrun) ? 1 : Game.levelSpeedrun;
        Game.levelSpeedrun = Game.levelSpeedrun == 0 ? 1 : Game.levelSpeedrun;
        Game.dataSpeedrun = +(Engine.Data.load("speedrundata"));
        Game.dataSpeedrun = isNaN(Game.dataSpeedrun) ? 0 : Game.dataSpeedrun;
        Game.recordSpeedrun = +(Engine.Data.load("speedrunrecord"));
        Game.recordSpeedrun = isNaN(Game.recordSpeedrun) ? 0 : Game.recordSpeedrun;
        Game.triggerActions("loadgame");
        //console.error("TODO: COMMENT THIS");
        //unlockAllLevels();
        Engine.Box.debugRender = false;
        //SKIP_PRELOADER = true;
        Game.startingSceneClass = Game.MainMenu;
    };
})(Game || (Game = {}));
var Game;
(function (Game) {
    Game.HAS_PRELOADER = true;
    Game.HAS_LINKS = true;
    Game.HAS_GOOGLE_PLAY_LOGOS = false;
    Game.IS_EDGE = /Edge/.test(navigator.userAgent);
    Game.STEPS_CHANGE_SCENE = 10;
    Game.STEPS_CHANGE_SCENE_AD = 30;
    Game.X_BUTTONS_LEFT = 5.3;
    Game.X_BUTTONS_RIGHT = -5.3;
    Game.Y_BUTTONS_TOP = 3 - 0.5;
    Game.Y_BUTTONS_BOTTOM = -1.4;
    Game.Y_ARROWS_GAME_BUTTONS = 4;
    Game.X_SEPARATION_BUTTONS_LEFT = 6;
    Game.MUSIC_MUTED = false;
    Game.SOUND_MUTED = false;
    Game.IS_TOUCH = false;
    Game.SKIP_PRELOADER = false;
    Game.FORCE_TOUCH = false;
    Game.DIRECT_PRELOADER = false;
    Game.TRACK_ORIENTATION = false;
    Game.URL_MORE_GAMES = "http://noadev.com/games";
    Game.URL_NOADEV = "http://noadev.com/games";
    Game.TEXT_MORE_GAMES = "+GAMES";
    Game.TEXT_NOADEV = "NOADEV.COM";
    Game.IS_APP = false;
    Game.OPTIMIZE_TRANSPARENCY = false;
    Game.fixViewHandler = function () { };
    Game.HAS_STARTED = false;
    Game.STRONG_TOUCH_MUTE_CHECK = false;
    function muteAll() {
        for (var _i = 0, _a = Game.Resources.bgms; _i < _a.length; _i++) {
            var bgm = _a[_i];
            bgm.volume = 0;
        }
        for (var _b = 0, sfxs_1 = Game.sfxs; _b < sfxs_1.length; _b++) {
            var player = sfxs_1[_b];
            player.volume = 0;
        }
    }
    Game.muteAll = muteAll;
    Game.unmute = function () {
        if (Game.Resources.bgmVolumeTracker < 1) {
            Game.Resources.bgmVolumeTracker += 1;
            for (var _i = 0, _a = Game.Resources.bgms; _i < _a.length; _i++) {
                var bgm = _a[_i];
                bgm.volume = Game.Resources.bgmVolumeTracker == 1 ? bgm.restoreVolume : 0;
            }
            if (Game.Resources.bgmVolumeTracker == 1) {
                for (var _b = 0, sfxs_2 = Game.sfxs; _b < sfxs_2.length; _b++) {
                    var player = sfxs_2[_b];
                    player.volume = player.restoreVolume;
                }
            }
        }
        return Game.Resources.bgmVolumeTracker == 1;
    };
    Game.mute = function () {
        Game.Resources.bgmVolumeTracker -= 1;
        muteAll();
        return Game.Resources.bgmVolumeTracker < 1;
    };
    Engine.System.onRun = function () {
        if (!Game.IS_APP) {
            /*
            if(document.onvisibilitychange == undefined){
                
            }
            else{
                document.onvisibilitychange = function(){
                    if(document.visibilityState == "visible"){
                        onShow();
                        Engine.System.resume();
                    }
                    else if(document.visibilityState == "hidden"){
                        onHide();
                        Engine.System.pause();
                    }
                }
            }
            */
            window.onfocus = function () {
                Game.fixViewHandler();
                //unmute();
                //Engine.System.resume();
            };
            window.onblur = function () {
                Game.fixViewHandler();
                //mute();
                //Engine.System.pause();
            };
            document.addEventListener("visibilitychange", function () {
                Game.fixViewHandler();
                if (document.visibilityState == "visible") {
                    if (Game.STRONG_TOUCH_MUTE_CHECK) {
                        if (Game.HAS_STARTED && !Game.IS_TOUCH) {
                            Game.unmute();
                        }
                    }
                    else {
                        Game.unmute();
                    }
                    Engine.System.resume();
                }
                else if (document.visibilityState == "hidden") {
                    if (Game.STRONG_TOUCH_MUTE_CHECK) {
                        if (Game.HAS_STARTED && !Game.IS_TOUCH) {
                            Game.mute();
                        }
                    }
                    else {
                        Game.mute();
                    }
                    Engine.System.pause();
                }
            });
        }
    };
    var pathGroups = new Array();
    var actionGroups = new Array();
    Game.dataLevels = new Array();
    //console.log("Fix Canvas Mode Shake, IN ALL IS A BIG PROBLEM ON THE RENDERER ROOT; EVERITHING WORKS BAD, NOT ONLY THE SHAKE");
    //console.log("TEST CANVAS MODE ON MOBILE TO TEST IF THE DPI DONT SHOW PROBLEMS");
    //console.log("FIX IE MODE");
    //console.log("GENERAL SOUNDS");
    //console.log("SCROLL");
    //console.log("TEST ON KITKAT (4.4 API 19 OR 4.4.4 API 20) AFTER THE IE PORT. THE KITKAT VERSION SHOULD USE CANVAS OR TEST IF WEBGL WORK ON 4.4.4 API 20");
    //console.log("FIX CONTROL/BUTTON TOUCH PROBLEM: CONTROL BLOCK IS NOT WORKING WITH TOUCH");
    Game.bgms = new Array();
    Game.sfxs = new Array();
    function switchMusicMute() {
        Game.MUSIC_MUTED = !Game.MUSIC_MUTED;
        for (var _i = 0, bgms_1 = Game.bgms; _i < bgms_1.length; _i++) {
            var player = bgms_1[_i];
            player.muted = Game.MUSIC_MUTED;
        }
    }
    Game.switchMusicMute = switchMusicMute;
    function switchSoundMute() {
        Game.SOUND_MUTED = !Game.SOUND_MUTED;
        for (var _i = 0, sfxs_3 = Game.sfxs; _i < sfxs_3.length; _i++) {
            var player = sfxs_3[_i];
            player.muted = Game.SOUND_MUTED;
        }
    }
    Game.switchSoundMute = switchSoundMute;
    function findInJSON(jsonObj, funct) {
        if (jsonObj.find != null && jsonObj.find != undefined) {
            return jsonObj.find(funct);
        }
        else {
            for (var _i = 0, jsonObj_1 = jsonObj; _i < jsonObj_1.length; _i++) {
                var obj = jsonObj_1[_i];
                if (funct(obj)) {
                    return obj;
                }
            }
            return undefined;
        }
    }
    Game.findInJSON = findInJSON;
    function addElement(groups, type, element) {
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var group = groups_1[_i];
            if (group.type == type) {
                group.elements.push(element);
                return;
            }
        }
        var group = {};
        group.type = type;
        group.elements = [element];
        groups.push(group);
    }
    function addPath(type, path) {
        addElement(pathGroups, type, path);
    }
    Game.addPath = addPath;
    function addAction(type, action) {
        addElement(actionGroups, type, action);
    }
    Game.addAction = addAction;
    function forEachPath(type, action) {
        for (var _i = 0, pathGroups_1 = pathGroups; _i < pathGroups_1.length; _i++) {
            var group = pathGroups_1[_i];
            if (group.type == type) {
                for (var _a = 0, _b = group.elements; _a < _b.length; _a++) {
                    var path = _b[_a];
                    action(path);
                }
                return;
            }
        }
    }
    Game.forEachPath = forEachPath;
    function triggerActions(type) {
        for (var _i = 0, actionGroups_1 = actionGroups; _i < actionGroups_1.length; _i++) {
            var group = actionGroups_1[_i];
            if (group.type == type) {
                for (var _a = 0, _b = group.elements; _a < _b.length; _a++) {
                    var action = _b[_a];
                    action();
                }
                return;
            }
        }
    }
    Game.triggerActions = triggerActions;
})(Game || (Game = {}));
///<reference path="../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var Entity = /** @class */ (function (_super) {
        __extends(Entity, _super);
        function Entity(def) {
            var _this = _super.call(this) || this;
            _this.def = def;
            return _this;
        }
        //@ts-ignore
        Entity.create = function (def) {
            eval("new " + def.type.type + "(def)");
        };
        Entity.getDefProperty = function (def, name) {
            var prop = null;
            if (def.properties != undefined) {
                prop = Game.findInJSON(def.properties, function (prop) {
                    return prop.name == name;
                });
            }
            if (def.instance.properties != undefined) {
                prop = Game.findInJSON(def.instance.properties, function (prop) {
                    return prop.name == name;
                });
            }
            if (prop == null && def.type != undefined && def.type.properties != undefined) {
                prop = Game.findInJSON(def.type.properties, function (prop) {
                    return prop.name == name;
                });
            }
            if (prop == null && def.tileDef != undefined && def.tileDef.properties != undefined) {
                prop = Game.findInJSON(def.tileDef.properties, function (prop) {
                    return prop.name == name;
                });
            }
            if (prop != null) {
                return prop.value;
            }
            return null;
        };
        Entity.prototype.getProperty = function (name) {
            return Entity.getDefProperty(this.def, name);
        };
        return Entity;
    }(Engine.Entity));
    Game.Entity = Entity;
})(Game || (Game = {}));
///<reference path="../System/Entity.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        Arcade.xForceWorld = 0;
        Arcade.yForceWorld = 0.1;
        var X_VEL_MAX_DEFAULT = 0;
        var Y_VEL_MAX_DEFAULT = 3;
        var PhysicEntity = /** @class */ (function (_super) {
            __extends(PhysicEntity, _super);
            function PhysicEntity(def) {
                var _this = _super.call(this, def) || this;
                _this.xOffsetDraw = 0;
                _this.yOffsetDraw = 0;
                _this.xAlign = "middle";
                _this.yAlign = "end";
                _this.xVel = 0;
                _this.yVel = 0;
                _this.xCanMove = true;
                _this.yCanMove = true;
                _this.xStop = true;
                _this.yStop = true;
                _this.xDirContact = 0;
                _this.yDirContact = 0;
                _this.xScaleForceWorld = 1;
                _this.yScaleForceWorld = 1;
                _this.xMaxVel = X_VEL_MAX_DEFAULT;
                _this.yMaxVel = Y_VEL_MAX_DEFAULT;
                _this.xDraw = 0;
                _this.yDraw = 0;
                _this.boxSolid = new Engine.Box();
                _this.boxSolid.enabled = true;
                _this.boxSolid.renderable = true;
                _this.boxSolid.xSize = 8;
                _this.boxSolid.ySize = 8;
                _this.boxSolid.xOffset = -4;
                _this.boxSolid.yOffset = -8;
                return _this;
            }
            Object.defineProperty(PhysicEntity.prototype, "xVelExtern", {
                get: function () {
                    return 0;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(PhysicEntity.prototype, "yVelExtern", {
                get: function () {
                    return 0;
                },
                enumerable: false,
                configurable: true
            });
            PhysicEntity.prototype.onReset = function () {
                if (this.def.flip.x) {
                    switch (this.xAlign) {
                        case "start":
                            this.boxSolid.x = this.def.instance.x;
                            break;
                        case "middle":
                            this.boxSolid.x = this.def.instance.x - Game.SceneMap.instance.xSizeTile * 0.5;
                            break;
                        case "end":
                            this.boxSolid.x = this.def.instance.x - Game.SceneMap.instance.xSizeTile;
                            break;
                    }
                    this.boxSolid.x += Game.SceneMap.instance.xSizeTile;
                }
                else {
                    switch (this.xAlign) {
                        case "start":
                            this.boxSolid.x = this.def.instance.x;
                            break;
                        case "middle":
                            this.boxSolid.x = this.def.instance.x + Game.SceneMap.instance.xSizeTile * 0.5;
                            break;
                        case "end":
                            this.boxSolid.x = this.def.instance.x + Game.SceneMap.instance.xSizeTile;
                            break;
                    }
                }
                if (this.def.flip.y) {
                    switch (this.yAlign) {
                        case "start":
                            this.boxSolid.y = this.def.instance.y;
                            break;
                        case "middle":
                            this.boxSolid.y = this.def.instance.y - Game.SceneMap.instance.ySizeTile * 0.5;
                            break;
                        case "end":
                            this.boxSolid.y = this.def.instance.y - Game.SceneMap.instance.ySizeTile;
                            break;
                    }
                }
                else {
                    switch (this.yAlign) {
                        case "start":
                            this.boxSolid.y = this.def.instance.y;
                            break;
                        case "middle":
                            this.boxSolid.y = this.def.instance.y + Game.SceneMap.instance.ySizeTile * 0.5;
                            break;
                        case "end":
                            this.boxSolid.y = this.def.instance.y + Game.SceneMap.instance.ySizeTile;
                            break;
                    }
                    this.boxSolid.y -= Game.SceneMap.instance.ySizeTile;
                }
                this.boxSolid.enabled = true;
                this.xDraw = this.boxSolid.x;
                this.yDraw = this.boxSolid.y;
                this.xVel = 0;
                this.yVel = 0;
                this.xDirContact = 0;
                this.yDirContact = 0;
                this.xContacts = null;
                this.yContacts = null;
            };
            PhysicEntity.prototype.onMoveUpdate = function () {
                if (!Game.SceneFreezer.stoped) {
                    this.xContacts = null;
                    this.xDirContact = 0;
                    this.yContacts = null;
                    this.yDirContact = 0;
                    if (this.xCanMove) {
                        this.xVel += Arcade.xForceWorld * this.xScaleForceWorld;
                        if (this.xMaxVel > 0 && this.xVel > this.xMaxVel) {
                            this.xVel = this.xMaxVel;
                        }
                        else if (this.xMaxVel < 0 && this.xVel < -this.xMaxVel) {
                            this.xVel = -this.xMaxVel;
                        }
                        if (this.boxSolid != null) {
                            this.onStartMoveX(this.yVel);
                            this.xContacts = this.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, true, this.xVel, true, Engine.Box.LAYER_ALL);
                            this.boxSolid.translate(this.xContacts, true, this.xVel, true);
                            if (this.xContacts != null) {
                                this.xDirContact = this.xVel < 0 ? -1 : 1;
                                if (this.xStop) {
                                    this.xVel = 0;
                                }
                            }
                            this.onEndMoveX();
                        }
                    }
                    if (this.yCanMove) {
                        this.yVel += Arcade.yForceWorld * this.yScaleForceWorld;
                        if (this.yMaxVel > 0 && this.yVel > this.yMaxVel) {
                            this.yVel = this.yMaxVel;
                        }
                        else if (this.yMaxVel < 0 && this.yVel < -this.yMaxVel) {
                            this.yVel = -this.yMaxVel;
                        }
                        if (this.boxSolid != null) {
                            this.onStartMoveY(this.yVel);
                            this.yContacts = this.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, false, this.yVel, true, Engine.Box.LAYER_ALL);
                            this.boxSolid.translate(this.yContacts, false, this.yVel, true);
                            if (this.yContacts != null) {
                                this.yDirContact = this.yVel < 0 ? -1 : 1;
                                if (this.yStop) {
                                    this.yVel = 0;
                                }
                            }
                            this.onEndMoveY();
                        }
                    }
                }
                this.xDraw = this.boxSolid.x;
                this.yDraw = this.boxSolid.y;
            };
            PhysicEntity.prototype.onStartMoveY = function (_dist) { };
            PhysicEntity.prototype.onEndMoveY = function () { };
            PhysicEntity.prototype.onStartMoveX = function (_dist) { };
            PhysicEntity.prototype.onEndMoveX = function () { };
            PhysicEntity.prototype.getContacts = function (xAxis, dir) {
                if (dir != 0) {
                    if (xAxis) {
                        return this.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, true, dir > 0 ? 1 : -1, false, Engine.Box.LAYER_ALL);
                    }
                    else {
                        return this.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, false, dir > 0 ? 1 : -1, false, Engine.Box.LAYER_ALL);
                    }
                }
                return null;
            };
            PhysicEntity.prototype.hasContact = function (xAxis, dir) {
                return this.getContacts(xAxis, dir) != null;
            };
            PhysicEntity.prototype.getDirContact = function (xAxis, dir) {
                if (this.hasContact(xAxis, dir)) {
                    return dir > 0 ? 1 : -1;
                }
                return 0;
            };
            PhysicEntity.prototype.onTimeUpdate = function () {
                if (!Game.SceneFreezer.stoped) {
                    if (this.xCanMove && this.yCanMove) {
                        var point = this.boxSolid.getExtrapolation(Game.SceneMap.instance.boxesSolids, this.xVel + this.xVelExtern, this.yVel + this.yVelExtern, true, Engine.Box.LAYER_ALL);
                        this.xDraw = point.x;
                        this.yDraw = point.y;
                    }
                    else if (this.xCanMove) {
                        var point = this.boxSolid.getExtrapolation(Game.SceneMap.instance.boxesSolids, this.xVel + this.xVelExtern, 0, true, Engine.Box.LAYER_ALL);
                        this.xDraw = point.x;
                        this.yDraw = this.boxSolid.y;
                    }
                    else if (this.yCanMove) {
                        var point = this.boxSolid.getExtrapolation(Game.SceneMap.instance.boxesSolids, 0, this.yVel + this.yVelExtern, true, Engine.Box.LAYER_ALL);
                        this.xDraw = this.boxSolid.x;
                        this.yDraw = point.y;
                    }
                    else {
                        this.xDraw = this.boxSolid.x;
                        this.yDraw = this.boxSolid.y;
                    }
                }
            };
            PhysicEntity.prototype.onDrawObjectsFront = function () {
                if (Engine.Box.debugRender) {
                    this.boxSolid.renderExtrapolated(Game.SceneMap.instance.boxesSolids, this.xVel + this.xVelExtern, this.yVel + this.yVelExtern, true, Engine.Box.LAYER_ALL);
                }
            };
            return PhysicEntity;
        }(Game.Entity));
        Arcade.PhysicEntity = PhysicEntity;
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
/*
///<reference path="../System/Entity.ts"/>
namespace Game.Arcade{
    export var xForceWorld = 0;
    export var yForceWorld = 0.1;

    var X_VEL_MAX_DEFAULT = 0;
    var Y_VEL_MAX_DEFAULT = 10;

    export abstract class PhysicEntity extends Entity{
        boxSolid : Engine.Box;

        protected xOffsetDraw = 0;
        protected yOffsetDraw = 0;

        xAlign : "start" | "middle" | "end" = "middle";
        yAlign : "start" | "middle" | "end" = "end";

        xVel = 0;
        yVel = 0;

        xCanMove = true;
        yCanMove = true;

        xStop = true;
        yStop = true;

        xContacts : Array<Engine.Contact>;
        yContacts : Array<Engine.Contact>;

        xDirContact = 0;
        yDirContact = 0;

        xScaleForceWorld = 1;
        yScaleForceWorld = 1;

        xMaxVel = X_VEL_MAX_DEFAULT;
        yMaxVel = Y_VEL_MAX_DEFAULT;

        protected xDraw = 0;
        protected yDraw = 0;

        coyote = 3;
        coyoteCount : number;

        protected get xVelExtern(){
            return 0;
        }

        protected get yVelExtern(){
            return 0;
        }

        constructor(def : any){
            super(def);
            this.boxSolid = new Engine.Box();
            this.boxSolid.enabled = true;
            this.boxSolid.renderable = true;
            this.boxSolid.xSize = 8;
            this.boxSolid.ySize = 8;
            this.boxSolid.xOffset = -4;
            this.boxSolid.yOffset = -8;
        }

        protected onReset(){
            if(this.def.flip.x){
                switch(this.xAlign){
                    case "start":
                        this.boxSolid.x = this.def.instance.x;
                    break;
                    case "middle":
                        this.boxSolid.x = this.def.instance.x - SceneMap.instance.xSizeTile * 0.5;
                    break;
                    case "end":
                        this.boxSolid.x = this.def.instance.x - SceneMap.instance.xSizeTile;
                    break;
                }
                this.boxSolid.x += SceneMap.instance.xSizeTile;
            }
            else{
                switch(this.xAlign){
                    case "start":
                        this.boxSolid.x = this.def.instance.x;
                    break;
                    case "middle":
                        this.boxSolid.x = this.def.instance.x + SceneMap.instance.xSizeTile * 0.5;
                    break;
                    case "end":
                        this.boxSolid.x = this.def.instance.x + SceneMap.instance.xSizeTile;
                    break;
                }
            }
            if(this.def.flip.y){
                switch(this.yAlign){
                    case "start":
                        this.boxSolid.y = this.def.instance.y;
                    break;
                    case "middle":
                        this.boxSolid.y = this.def.instance.y - SceneMap.instance.ySizeTile * 0.5;
                    break;
                    case "end":
                        this.boxSolid.y = this.def.instance.y - SceneMap.instance.ySizeTile;
                    break;
                }
            }
            else{
                switch(this.yAlign){
                    case "start":
                        this.boxSolid.y = this.def.instance.y;
                    break;
                    case "middle":
                        this.boxSolid.y = this.def.instance.y + SceneMap.instance.ySizeTile * 0.5;
                    break;
                    case "end":
                        this.boxSolid.y = this.def.instance.y + SceneMap.instance.ySizeTile;
                    break;
                }
                this.boxSolid.y -= SceneMap.instance.ySizeTile;
            }
            this.boxSolid.enabled = true;
            this.xDraw = this.boxSolid.x;
            this.yDraw = this.boxSolid.y;
            this.xVel = 0;
            this.yVel = 0;
            this.xDirContact = 0;
            this.yDirContact = 0;
            this.xContacts = null;
            this.yContacts = null;
            this.coyoteCount = 0;
        }

        protected onMoveUpdate(){
            if(!SceneFreezer.stoped){
                this.xContacts = null;
                this.xDirContact = 0;
                var yOldContacts = this.yContacts;
                var yOldDirContact = this.yDirContact;
                this.yContacts = null;
                this.yDirContact = 0;
                if(this.xCanMove){
                    this.xVel += xForceWorld * this.xScaleForceWorld;
                    if(this.xMaxVel > 0 && this.xVel > this.xMaxVel){
                        this.xVel = this.xMaxVel;
                    }
                    else if(this.xMaxVel < 0 && this.xVel < -this.xMaxVel){
                        this.xVel = -this.xMaxVel;
                    }
                    if(this.boxSolid != null){
                        this.onStartMoveX(this.yVel);
                        this.xContacts = this.boxSolid.cast(SceneMap.instance.boxesSolids, null, true, this.xVel, true, Engine.Box.LAYER_ALL);
                        this.boxSolid.translate(this.xContacts, true, this.xVel, true);
                        if(this.xContacts != null){
                            this.xDirContact = this.xVel < 0 ? -1 : 1;
                            if(this.xStop){
                                this.xVel = 0;
                            }
                        }
                        this.onEndMoveX();
                    }
                }
                if(this.yCanMove){
                    this.yVel += yForceWorld * this.yScaleForceWorld;
                    if(this.yMaxVel > 0 && this.yVel > this.yMaxVel){
                        this.yVel = this.yMaxVel;
                    }
                    else if(this.yMaxVel < 0 && this.yVel < -this.yMaxVel){
                        this.yVel = -this.yMaxVel;
                    }
                    if(this.boxSolid != null && this.yVel != 0){
                        this.onStartMoveY(this.yVel);
                        if(this.yVel > 0){
                            this.yContacts = this.boxSolid.cast(SceneMap.instance.boxesSolids, null, false, this.yVel, true, Engine.Box.LAYER_ALL);
                        }
                        else{
                            this.yContacts = this.boxSolid.cast(SceneMap.instance.noOneWaySolids, null, false, this.yVel, true, Engine.Box.LAYER_ALL);
                        }
                        if(this.yContacts == null && yOldContacts != null && this.yVel > 0 && yOldDirContact > 0){
                            if(this.coyoteCount < this.coyote){
                                this.coyoteCount++;
                                if(this.coyoteCount - 1 >= this.coyote){
                                    this.coyoteCount = 0;
                                    this.boxSolid.translate(null, false, this.yVel, true);
                                }
                                else{
                                    this.yContacts = yOldContacts;
                                }
                            }
                        }
                        else{
                            this.coyoteCount = 0;
                            this.boxSolid.translate(this.yContacts, false, this.yVel, true);
                        }
                        if(this.yContacts != null){
                            this.yDirContact = this.yVel < 0 ? -1 : 1;
                            if(this.yStop){
                                this.yVel = 0;
                            }
                        }
                        this.onEndMoveY();
                    }
                }
                else{
                    this.coyoteCount = 0;
                }
            }
            this.xDraw = this.boxSolid.x;
            this.yDraw = this.boxSolid.y;
        }

        onStartMoveY(_dist : number){}
        onEndMoveY(){}

        onStartMoveX(_dist : number){}
        onEndMoveX(){}

        getContacts(xAxis : boolean, dir : number){
            if(dir != 0){
                if(xAxis){
                    return this.boxSolid.cast(SceneMap.instance.boxesSolids, null, true, dir > 0 ? 1 : -1, false, Engine.Box.LAYER_ALL);
                }
                else{
                    return this.boxSolid.cast(SceneMap.instance.boxesSolids, null, false, dir > 0 ? 1 : -1, false, Engine.Box.LAYER_ALL);
                }
            }
            return null;
        }

        hasContact(xAxis : boolean, dir : number){
            return this.getContacts(xAxis, dir) != null;
        }

        getDirContact(xAxis : boolean, dir : number){
            if(this.hasContact(xAxis, dir)){
                return dir > 0 ? 1 : -1;
            }
            return 0;
        }

        protected onTimeUpdate(){
            if(!SceneFreezer.stoped){
                if(this.xCanMove && this.yCanMove){
                    var point = this.boxSolid.getExtrapolation(SceneMap.instance.boxesSolids, this.xVel + this.xVelExtern, this.yVel + this.yVelExtern, true, Engine.Box.LAYER_ALL);
                    this.xDraw = point.x;
                    this.yDraw = point.y;
                }
                else if(this.xCanMove){
                    var point = this.boxSolid.getExtrapolation(SceneMap.instance.boxesSolids, this.xVel + this.xVelExtern, 0, true, Engine.Box.LAYER_ALL);
                    this.xDraw = point.x;
                    this.yDraw = this.boxSolid.y;
                }
                else if(this.yCanMove){
                    var point = this.boxSolid.getExtrapolation(SceneMap.instance.boxesSolids, 0, this.yVel + this.yVelExtern, true, Engine.Box.LAYER_ALL);
                    this.xDraw = this.boxSolid.x;
                    this.yDraw = point.y;
                }
                else{
                    this.xDraw = this.boxSolid.x;
                    this.yDraw = this.boxSolid.y;
                }
            }
        }

        protected onDrawObjectsFront(){
            if(Engine.Box.debugRender){
                this.boxSolid.renderExtrapolated(SceneMap.instance.boxesSolids, this.xVel + this.xVelExtern, this.yVel + this.yVelExtern, true, Engine.Box.LAYER_ALL);
            }
        }
    }
}
*/ 
///<reference path="PhysicEntity.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var WorldEntity = /** @class */ (function (_super) {
            __extends(WorldEntity, _super);
            function WorldEntity(def) {
                var _this = _super.call(this, def) || this;
                _this.sprite = new Engine.Sprite();
                _this.sprite.enabled = true;
                _this.animator = new Utils.Animator();
                _this.animator.owner = _this;
                _this.animator.listener = _this;
                _this.machine = new Game.Flow.StateMachine(_this);
                _this.machine.owner = _this;
                _this.machine.startState = _this.initStates();
                return _this;
            }
            WorldEntity.prototype.initStates = function () {
                return new Game.Flow.State(this);
            };
            WorldEntity.prototype.onSetFrame = function (_animator, _animation, _frame) {
                _frame.applyToSprite(this.sprite);
            };
            WorldEntity.prototype.onReset = function () {
                _super.prototype.onReset.call(this);
                this.sprite.enabled = true;
                this.sprite.x = this.xDraw;
                this.sprite.y = this.yDraw;
                this.sprite.xMirror = this.def.flip.x;
                this.sprite.yMirror = this.def.flip.y;
            };
            WorldEntity.prototype.onMoveUpdate = function () {
                _super.prototype.onMoveUpdate.call(this);
                this.sprite.x = this.xDraw;
                this.sprite.y = this.yDraw;
            };
            WorldEntity.prototype.onTimeUpdate = function () {
                _super.prototype.onTimeUpdate.call(this);
                this.sprite.x = this.xDraw;
                this.sprite.y = this.yDraw;
            };
            return WorldEntity;
        }(Arcade.PhysicEntity));
        Arcade.WorldEntity = WorldEntity;
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "../WorldEntity.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var X_MOVE_VEL_DEFAULT = 1.3 * 2;
            var Y_VEL_JUMP_DEFAULT = 5.0;
            var Y_DRAG_CANCEL_JUMP_DEFAULT = 0.7;
            var BaseEntity = /** @class */ (function (_super) {
                __extends(BaseEntity, _super);
                function BaseEntity() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.platformParent = null;
                    _this.moveActionsEnabled = true;
                    _this.turnActionsEnabled = true;
                    _this._jumpActionsEnabled = true;
                    _this._platformActionsEnabled = true;
                    _this.xVelMove = X_MOVE_VEL_DEFAULT;
                    _this.yVelJump = Y_VEL_JUMP_DEFAULT;
                    _this._jumping = false;
                    _this._canCancelJump = true;
                    _this._jumpCanceled = false;
                    _this.yDragCancelJump = Y_DRAG_CANCEL_JUMP_DEFAULT;
                    _this._xOverlapsPlatform = false;
                    _this._xCollidesOnPlatform = false;
                    _this._yOverlapsPlatform = false;
                    return _this;
                }
                Object.defineProperty(BaseEntity.prototype, "jumpActionsEnabled", {
                    get: function () {
                        return this._jumpActionsEnabled;
                    },
                    set: function (value) {
                        this._jumpActionsEnabled = value;
                        if (!this._jumpActionsEnabled) {
                            this._jumpCanceled = false;
                            this._jumping = false;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "platformActionsEnabled", {
                    get: function () {
                        return this._platformActionsEnabled;
                    },
                    set: function (value) {
                        this._platformActionsEnabled = value;
                        if (!this._platformActionsEnabled && this.platformParent != null) {
                            this.platformParent.removeChild(this);
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "jumping", {
                    get: function () {
                        return this._jumping;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "canCancelJump", {
                    get: function () {
                        return this._canCancelJump;
                    },
                    set: function (value) {
                        this._canCancelJump = value;
                        if (!this._canCancelJump) {
                            this._jumpCanceled = false;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "xOverlapsPlatform", {
                    get: function () {
                        return this._xOverlapsPlatform;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "xCollidesOnPlatform", {
                    get: function () {
                        return this._xCollidesOnPlatform;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "yOverlapsPlatform", {
                    get: function () {
                        return this._yOverlapsPlatform;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "dirMove", {
                    get: function () {
                        return 0;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "jumpControlPressed", {
                    get: function () {
                        return false;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "jumpControlDown", {
                    get: function () {
                        return false;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "xVelExtern", {
                    get: function () {
                        if (this.platformParent != null) {
                            return this.platformParent.xGetVelMove();
                        }
                        return 0;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseEntity.prototype, "yVelExtern", {
                    get: function () {
                        if (this.platformParent != null) {
                            return this.platformParent.yGetVelMove();
                        }
                        return 0;
                    },
                    enumerable: false,
                    configurable: true
                });
                BaseEntity.prototype.onInitScene = function () {
                    Platformer.Platform.pushInteractable(this);
                };
                BaseEntity.prototype.onReset = function () {
                    _super.prototype.onReset.call(this);
                    this._jumping = false;
                    this._jumpCanceled = false;
                };
                BaseEntity.prototype.onMoveReady = function () {
                    this._xOverlapsPlatform = false;
                    this._xCollidesOnPlatform = false;
                    this._yOverlapsPlatform = false;
                };
                BaseEntity.prototype.onMoveUpdate = function () {
                    _super.prototype.onMoveUpdate.call(this);
                    if (!Game.SceneFreezer.stoped) {
                        if (this.moveActionsEnabled) {
                            this.xVel = this.xVelMove * this.dirMove;
                        }
                        if (this.turnActionsEnabled && this.dirMove != 0) {
                            this.sprite.xMirror = this.dirMove < 0;
                        }
                        if (!this._jumping && this._jumpActionsEnabled && this.yDirContact > 0 && this.jumpControlPressed) {
                            this.yVel = -this.yVelJump;
                            this._jumpCanceled = false;
                            this._jumping = true;
                        }
                        if (this._jumping && !this._jumpCanceled && this.yVel < 0 && this._canCancelJump && !this.jumpControlDown) {
                            this._jumpCanceled = true;
                        }
                        if (this._jumping && this._jumpCanceled && this.yVel < 0) {
                            this.yVel *= this.yDragCancelJump;
                        }
                        if (this._jumping && this.yVel >= 0) {
                            this._jumpCanceled = false,
                                this._jumping = false;
                        }
                        if (this.platformActionsEnabled) {
                            this.platformCheck();
                        }
                    }
                };
                BaseEntity.prototype.platformCheck = function () {
                    var newPlatformParent = null;
                    if (this.yDirContact > 0) {
                        for (var _i = 0, _a = this.yContacts; _i < _a.length; _i++) {
                            var contact = _a[_i];
                            if (contact.other.data instanceof Platformer.Platform) {
                                if (contact.other.data == this.platformParent) {
                                    return;
                                }
                                else {
                                    newPlatformParent = contact.other.data;
                                }
                            }
                        }
                    }
                    if (newPlatformParent != null) {
                        newPlatformParent.addChild(this);
                    }
                    else if (this.platformParent != null) {
                        this.platformParent.removeChild(this);
                    }
                };
                BaseEntity.prototype.xMoveOnPlatform = function (dist) {
                    //if(!this.moveActionsEnabled || this.dirMove == 0 || (this.dirMove > 0 && dist < 0)){
                    var contacts = this.boxSolid.cast(Game.SceneMap.instance.noOneWaySolids, null, true, dist, true, Engine.Box.LAYER_ALL);
                    this.boxSolid.translate(contacts, true, dist, true);
                    this._xCollidesOnPlatform = contacts != null;
                    //}
                };
                BaseEntity.prototype.yMoveOnPlatform = function (dist) {
                    var contacts;
                    if (this.yVel > 0) {
                        this.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, false, dist, true, Engine.Box.LAYER_ALL);
                    }
                    else {
                        this.boxSolid.cast(Game.SceneMap.instance.noOneWaySolids, null, false, dist, true, Engine.Box.LAYER_ALL);
                    }
                    this.boxSolid.translate(contacts, false, dist, true);
                };
                BaseEntity.prototype.onPlatformOverlapX = function () {
                    this._xOverlapsPlatform = true;
                };
                BaseEntity.prototype.onPlatformOverlapY = function () {
                    this._yOverlapsPlatform = true;
                };
                BaseEntity.prototype.onTimeUpdate = function () {
                    _super.prototype.onTimeUpdate.call(this);
                    if (!Game.SceneFreezer.stoped && this.platformParent != null) {
                        //this.sprite.x += this.platformParent.xGetVelMove() * Engine.System.deltaTime;
                        //this.sprite.y += this.platformParent.yGetVelMove() * Engine.System.deltaTime;
                    }
                };
                return BaseEntity;
            }(Arcade.WorldEntity));
            Platformer.BaseEntity = BaseEntity;
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseEntity.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var BaseMachineEntity = /** @class */ (function (_super) {
                __extends(BaseMachineEntity, _super);
                function BaseMachineEntity(def) {
                    var _this = _super.call(this, def) || this;
                    _this.extraSoundY = 0;
                    _this.boxOverlap = new Engine.Box();
                    _this.boxOverlap.enabled = true;
                    _this.boxOverlap.renderable = true;
                    _this.boxOverlap.red = 0;
                    _this.boxOverlap.green = 0;
                    _this.boxOverlap.blue = 1;
                    return _this;
                }
                BaseMachineEntity.prototype.initStates = function () {
                    var _this = this;
                    _super.prototype.initStates.call(this);
                    this.stateStand = new Game.Flow.State(this, "stand");
                    this.stateMove = new Game.Flow.State(this, "move");
                    this.stateAscend = new Game.Flow.State(this, "ascend");
                    this.stateFall = new Game.Flow.State(this, "fall");
                    this.stateLanding = new Game.Flow.State(this, "landing");
                    this.stateStand.onEnter = function () {
                        _this.moveActionsEnabled = true;
                        _this.turnActionsEnabled = true;
                        _this.jumpActionsEnabled = true;
                        _this.platformActionsEnabled = true;
                    };
                    this.stateStand.onReady = function () {
                        _this.animator.setAnimation(_this.animStand);
                    };
                    this.stateStand.addLink(this.stateMove, function () { return _this.dirMove != 0 && _this.moveActionsEnabled; });
                    this.stateStand.addLink(this.stateAscend, function () { return _this.yVel < 0; });
                    this.stateStand.addLink(this.stateFall, function () { return _this.yVel > 0 && _this.yDirContact == 0; });
                    this.stateMove.onEnter = function () {
                        _this.moveActionsEnabled = true;
                        _this.turnActionsEnabled = true;
                        _this.jumpActionsEnabled = true;
                        _this.platformActionsEnabled = true;
                    };
                    this.stateMove.onReady = function () {
                        _this.animator.setAnimation(_this.animMove);
                    };
                    this.stateMove.addLink(this.stateStand, function () { return _this.dirMove == 0 || !_this.moveActionsEnabled; });
                    this.stateMove.addLink(this.stateAscend, function () { return _this.yVel < 0; });
                    this.stateMove.addLink(this.stateFall, function () { return _this.yVel > 0 && _this.yDirContact == 0; });
                    this.stateAscend.onEnter = function () {
                        _this.moveActionsEnabled = true;
                        _this.turnActionsEnabled = true;
                        _this.jumpActionsEnabled = true;
                        _this.platformActionsEnabled = true;
                    };
                    this.stateAscend.onReady = function () {
                        _this.animator.setAnimation(_this.animAscend);
                        if (_this.jumping) {
                            _this.consumeJumpControls();
                            if (_this.sfxJump != null)
                                _this.sfxJump.boxPlay(_this.boxSolid, 0, _this.extraSoundY);
                        }
                    };
                    this.stateAscend.addLink(this.stateFall, function () { return _this.yVel >= 0; });
                    this.stateFall.onEnter = function () {
                        _this.moveActionsEnabled = true;
                        _this.turnActionsEnabled = true;
                        _this.jumpActionsEnabled = false;
                        _this.platformActionsEnabled = true;
                    };
                    this.stateFall.onReady = function () {
                        if (_this.animator.animation == _this.animAscend && _this.animFallAscend != null) {
                            _this.animator.setAnimation(_this.animFallAscend);
                        }
                        else {
                            _this.animator.setAnimation(_this.animFall);
                        }
                    };
                    this.stateFall.addLink(this.stateAscend, function () { return _this.yVel < 0; });
                    this.stateFall.addLink(this.stateLanding, function () { return _this.yVel >= 0 && _this.yDirContact > 0; });
                    this.stateLanding.onEnter = function () {
                        _this.moveActionsEnabled = true;
                        _this.turnActionsEnabled = true;
                        _this.jumpActionsEnabled = true;
                        _this.platformActionsEnabled = true;
                    };
                    this.stateLanding.onReady = function () {
                        _this.animator.setAnimation(_this.animLanding);
                    };
                    this.stateLanding.addLink(this.stateStand, function () { return _this.animLanding == null; });
                    this.stateLanding.addLink(this.stateStand, function () { return _this.dirMove == 0 && _this.animator.animation == _this.animLanding && _this.animator.ended; });
                    this.stateLanding.addLink(this.stateMove, function () { return _this.dirMove != 0; });
                    this.stateLanding.addLink(this.stateAscend, function () { return _this.yVel < 0; });
                    this.stateLanding.addLink(this.stateFall, function () { return _this.yVel > 0 && _this.yDirContact == 0; });
                    return this.stateStand;
                };
                BaseMachineEntity.prototype.onReset = function () {
                    _super.prototype.onReset.call(this);
                    this.boxOverlap.x = this.boxSolid.x;
                    this.boxOverlap.y = this.boxSolid.y;
                };
                BaseMachineEntity.prototype.onMoveUpdate = function () {
                    _super.prototype.onMoveUpdate.call(this);
                    this.boxOverlap.x = this.boxSolid.x;
                    this.boxOverlap.y = this.boxSolid.y;
                };
                BaseMachineEntity.prototype.onOverlapUpdate = function () {
                    this.boxOverlap.x = this.boxSolid.x;
                    this.boxOverlap.y = this.boxSolid.y;
                };
                BaseMachineEntity.prototype.consumeJumpControls = function () {
                };
                BaseMachineEntity.prototype.onDrawObjectsFront = function () {
                    _super.prototype.onDrawObjectsFront.call(this);
                    if (Engine.Box.debugRender) {
                        this.boxOverlap.x = this.boxSolid.x;
                        this.boxOverlap.y = this.boxSolid.y;
                        this.boxOverlap.render();
                    }
                };
                return BaseMachineEntity;
            }(Platformer.BaseEntity));
            Platformer.BaseMachineEntity = BaseMachineEntity;
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseMachineEntity.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var BaseDrawablePlayer = /** @class */ (function (_super) {
                __extends(BaseDrawablePlayer, _super);
                function BaseDrawablePlayer() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(BaseDrawablePlayer.prototype, "xRender", {
                    get: function () {
                        return this.xDraw;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseDrawablePlayer.prototype, "yRender", {
                    get: function () {
                        return this.yDraw;
                    },
                    enumerable: false,
                    configurable: true
                });
                BaseDrawablePlayer.prototype.onDrawPlayer = function () {
                    this.sprite.render();
                };
                return BaseDrawablePlayer;
            }(Platformer.BaseMachineEntity));
            Platformer.BaseDrawablePlayer = BaseDrawablePlayer;
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseDrawablePlayer.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var DEFAULT_STEPS_WAIT_WINNING_LOSSING = 26;
            var BaseFlowPlayer = /** @class */ (function (_super) {
                __extends(BaseFlowPlayer, _super);
                function BaseFlowPlayer(def) {
                    var _this = _super.call(this, def) || this;
                    _this.stepsWin = DEFAULT_STEPS_WAIT_WINNING_LOSSING;
                    _this.stepsLoss = DEFAULT_STEPS_WAIT_WINNING_LOSSING;
                    _this._canWin = true;
                    _this._canLoss = true;
                    BaseFlowPlayer._instance = _this;
                    return _this;
                }
                Object.defineProperty(BaseFlowPlayer, "instance", {
                    get: function () {
                        return BaseFlowPlayer._instance;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "winning", {
                    get: function () {
                        return this._winning;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "hasWon", {
                    get: function () {
                        return this._hasWon;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "losing", {
                    get: function () {
                        return this._losing;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "hasLost", {
                    get: function () {
                        return this._hasLost;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "winCondition", {
                    get: function () {
                        return false;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "lossCondition", {
                    get: function () {
                        return false;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "canWin", {
                    get: function () {
                        return this._canWin;
                    },
                    set: function (value) {
                        this._canWin = value;
                        if (!this._canWin) {
                            this._winning = false;
                            this._hasWon = false;
                            this.countStepsWin = 0;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(BaseFlowPlayer.prototype, "canLoss", {
                    get: function () {
                        return this.canLoss;
                    },
                    set: function (value) {
                        this._canLoss = value;
                        if (!this._canLoss) {
                            this._losing = false;
                            this._hasLost = false;
                            this.countStepsLoss = 0;
                        }
                    },
                    enumerable: false,
                    configurable: true
                });
                BaseFlowPlayer.prototype.onReset = function () {
                    _super.prototype.onReset.call(this);
                    this.countStepsWin = 0;
                    this._winning = false;
                    this._hasWon = false;
                    this.countStepsLoss = 0;
                    this._losing = false;
                    this._hasLost = false;
                };
                BaseFlowPlayer.prototype.onStepUpdate = function () {
                    if (!Game.SceneFreezer.stoped) {
                        if (this._winning && !this._hasWon) {
                            this.countStepsWin -= 1;
                            if (this.countStepsWin <= 0) {
                                this._hasWon = true;
                                this.onWon();
                            }
                        }
                        if (this._losing && !this._hasLost) {
                            this.countStepsLoss -= 1;
                            if (this.countStepsLoss <= 0) {
                                this._hasLost = true;
                                this.onWon();
                            }
                        }
                        if (!this._winning && this.winCondition) {
                            this.onGoal();
                            if (this._canWin) {
                                this._winning = true;
                                this.countStepsWin = this.stepsWin;
                                this.onWinning();
                            }
                        }
                        if (!this._winning && !this._losing && this.lossCondition) {
                            this.onDeath();
                            if (this._canLoss) {
                                this._losing = true;
                                this.countStepsLoss = this.stepsLoss;
                                this.onLosing();
                            }
                        }
                    }
                };
                BaseFlowPlayer.prototype.onGoal = function () {
                };
                BaseFlowPlayer.prototype.onWinning = function () {
                };
                BaseFlowPlayer.prototype.onWon = function () {
                };
                BaseFlowPlayer.prototype.onDeath = function () {
                };
                BaseFlowPlayer.prototype.onLosing = function () {
                };
                BaseFlowPlayer.prototype.onLost = function () {
                };
                return BaseFlowPlayer;
            }(Platformer.BaseDrawablePlayer));
            Platformer.BaseFlowPlayer = BaseFlowPlayer;
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseFlowPlayer.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var BaseAwarePlayer = /** @class */ (function (_super) {
                __extends(BaseAwarePlayer, _super);
                function BaseAwarePlayer() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BaseAwarePlayer.prototype.onReset = function () {
                    _super.prototype.onReset.call(this);
                    this.contactsEnemies = null;
                };
                BaseAwarePlayer.prototype.onOverlapUpdate = function () {
                    _super.prototype.onOverlapUpdate.call(this);
                    if (!Game.SceneFreezer.stoped) {
                        this.contactsEnemies = this.boxOverlap.collide(Game.SceneMap.instance.boxesEnemies, null, true, 0, true, Engine.Box.LAYER_ALL);
                        this.contactsSolids = null; //this.boxSolid.collide(SceneMap.instance.boxesTiles, null, true, 0, true, Engine.Box.LAYER_ALL)
                    }
                };
                return BaseAwarePlayer;
            }(Platformer.BaseFlowPlayer));
            Platformer.BaseAwarePlayer = BaseAwarePlayer;
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "../../System/Entity.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var interactables = [];
            var Platform = /** @class */ (function (_super) {
                __extends(Platform, _super);
                function Platform(def) {
                    var _this = _super.call(this, def) || this;
                    _this.soundOrigin = null;
                    _this.soundDestiny = null;
                    _this.shakeOrigin = false;
                    _this.shakeDestiny = false;
                    _this.xSoundExtra = 0;
                    _this.ySoundExtra = 0;
                    _this.children = null;
                    _this.onScreenCheck = false;
                    _this.box = new Engine.Box();
                    _this.box.enabled = true;
                    _this.box.renderable = true;
                    _this.box.xSize = Game.SceneMap.instance.xSizeTile;
                    _this.box.ySize = Game.SceneMap.instance.ySizeTile;
                    _this.box.data = _this;
                    Game.SceneMap.instance.boxesSolids.push(_this.box);
                    _this.sprite = new Engine.Sprite();
                    _this.xOrigin = def.instance.x;
                    _this.yOrigin = def.instance.y - Game.SceneMap.instance.ySizeTile;
                    _this.xDestiny = _this.xOrigin + _this.getProperty("dist tiles x") * Game.SceneMap.instance.xSizeTile;
                    _this.yDestiny = _this.yOrigin + _this.getProperty("dist tiles y") * Game.SceneMap.instance.ySizeTile;
                    _this.velMoveOrigin = _this.getProperty("vel move origin");
                    _this.velMoveDestiny = _this.getProperty("vel move destiny");
                    _this.stepsWaitStart = _this.getProperty("wait steps start");
                    _this.stepsWaitOrigin = _this.getProperty("wait steps origin");
                    _this.stepsWaitDestiny = _this.getProperty("wait steps destiny");
                    _this.shakeOrigin = _this.getProperty("shake origin");
                    _this.shakeDestiny = _this.getProperty("shake destiny");
                    _this.onScreenCheck = _this.getProperty("on screen check");
                    _this.xOnScreenActive = _this.getProperty("on screen active x");
                    _this.yOnScreenActive = _this.getProperty("on screen active y");
                    _this.initStates();
                    //this.sprite.enabled = true;
                    _this.activationIndex = _this.getProperty("activation index");
                    return _this;
                    //Jumper.activables.push(this);
                }
                Platform.prototype.activate = function () {
                    this.activeNow = true;
                };
                Platform.prototype.initStates = function () {
                    var _this = this;
                    this.stateWaiting = new Game.Flow.State(this, "waiting");
                    this.stateMoving = new Game.Flow.State(this, "moving");
                    this.stateWaiting.onEnter = function () {
                        if (_this.machine.oldState == null) {
                            _this.onOrigin = true;
                            _this.countStepsWait = _this.stepsWaitStart;
                        }
                        else {
                            _this.onOrigin = !_this.onOrigin;
                            _this.countStepsWait = _this.onOrigin ? _this.stepsWaitOrigin : _this.stepsWaitDestiny;
                            if (_this.onOrigin) {
                                if (_this.soundOrigin != null) {
                                    _this.soundOrigin.boxPlay(_this.box, _this.xSoundExtra, _this.ySoundExtra, _this.shakeOrigin);
                                }
                            }
                            else {
                                if (_this.soundDestiny != null) {
                                    _this.soundDestiny.boxPlay(_this.box, _this.xSoundExtra, _this.ySoundExtra, _this.shakeDestiny);
                                }
                            }
                        }
                        _this.xDist = 0;
                        _this.yDist = 0;
                        _this.xDir = 0;
                        _this.yDir = 0;
                        _this.xVel = 0;
                        _this.yVel = 0;
                    };
                    this.stateWaiting.onStepUpdate = function () {
                        if (!_this.activeNow) {
                            if (_this.onScreenCheck) {
                                if (Engine.AudioPlayer.onScreen(_this.box, _this.xOnScreenActive, _this.yOnScreenActive)) {
                                    //Jumper.triggerActivation(this);
                                }
                            }
                            else {
                                _this.activeNow = true;
                            }
                        }
                        if (_this.activeNow) {
                            _this.countStepsWait -= 1;
                        }
                    };
                    this.stateWaiting.addLink(this.stateMoving, function () { return _this.countStepsWait <= 0 && _this.activeNow; });
                    this.stateMoving.onEnter = function () {
                        if (_this.onOrigin) {
                            _this.xNext = _this.xDestiny;
                            _this.yNext = _this.yDestiny;
                        }
                        else {
                            _this.xNext = _this.xOrigin;
                            _this.yNext = _this.yOrigin;
                        }
                        _this.xDist = _this.xNext - _this.box.x;
                        _this.yDist = _this.yNext - _this.box.y;
                        var magnitude = Math.sqrt(_this.xDist * _this.xDist + _this.yDist * _this.yDist);
                        _this.xDir = _this.xDist / magnitude;
                        _this.yDir = _this.yDist / magnitude;
                        _this.xVel = (_this.onOrigin ? _this.velMoveDestiny : _this.velMoveOrigin) * _this.xDir * (_this.xDir < 0 ? -1 : 1);
                        _this.yVel = (_this.onOrigin ? _this.velMoveDestiny : _this.velMoveOrigin) * _this.yDir * (_this.yDir < 0 ? -1 : 1);
                        _this.xDist *= (_this.xDist < 0 ? -1 : 1);
                        _this.yDist *= (_this.yDist < 0 ? -1 : 1);
                    };
                    this.stateMoving.onMoveUpdate = function () {
                        _this.xMove();
                        _this.yMove();
                    };
                    this.stateMoving.addLink(this.stateWaiting, function () { return _this.xDist <= 0 && _this.yDist <= 0; });
                    this.machine = new Game.Flow.StateMachine(this);
                    this.machine.owner = this;
                    this.machine.startState = this.stateWaiting;
                };
                Platform.pushInteractable = function (interactable) {
                    //if(interactables != null){
                    interactables.push(interactable);
                    //}
                };
                Platform.prototype.onReset = function () {
                    this.box.x = this.xOrigin;
                    this.box.y = this.yOrigin;
                    if (this.children != null) {
                        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            child.platformParent = null;
                        }
                    }
                    this.children = [];
                    this.activeNow = false;
                };
                Platform.prototype.addChild = function (child) {
                    if (child.platformParent != this) {
                        if (child.platformParent != null) {
                            child.platformParent.removeChild(child);
                        }
                        child.platformParent = this;
                        this.children.push(child);
                    }
                };
                Platform.prototype.removeChild = function (child) {
                    child.platformParent = null;
                    var newChildren = [];
                    for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                        var oldChild = _a[_i];
                        if (oldChild != child) {
                            newChildren.push(oldChild);
                        }
                    }
                    this.children = newChildren;
                };
                Platform.prototype.onStepUpdate = function () {
                };
                Platform.prototype.xGetMagMove = function () {
                    return this.xDist > this.xVel ? this.xVel : this.xDist;
                };
                Platform.prototype.xGetVelMove = function () {
                    return this.xGetMagMove() * (this.xDir > 0 ? 1 : -1);
                };
                Platform.prototype.xMove = function () {
                    if (this.xGetMagMove() != 0) {
                        this.box.x += this.xGetVelMove();
                        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            child.xMoveOnPlatform(this.xGetVelMove());
                        }
                        this.xDist -= this.xGetMagMove();
                        if (this.xDist <= 0) {
                            this.box.x = this.xNext;
                        }
                        var dirMove = this.xDir > 0 ? 1 : -1;
                        for (var _b = 0, interactables_1 = interactables; _b < interactables_1.length; _b++) {
                            var interactable = interactables_1[_b];
                            var contacts = this.box.collideAgainst(interactable.boxSolid, null, true, 0, true, Engine.Box.LAYER_ALL);
                            if (contacts != null) {
                                var distMove = this.box.getDist(interactable.boxSolid, dirMove, true);
                                contacts = interactable.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, true, -distMove, false, Engine.Box.LAYER_ALL);
                                interactable.boxSolid.translate(contacts, true, -distMove, false);
                                interactable.onPlatformOverlapX();
                            }
                        }
                    }
                };
                Platform.prototype.yGetMagMove = function () {
                    return this.yDist > this.yVel ? this.yVel : this.yDist;
                };
                Platform.prototype.yGetVelMove = function () {
                    return this.yGetMagMove() * (this.yDir > 0 ? 1 : -1);
                };
                Platform.prototype.yMove = function () {
                    if (this.yGetMagMove()) {
                        this.box.y += this.yGetVelMove();
                        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            child.yMoveOnPlatform(this.yGetVelMove());
                        }
                        this.yDist -= this.yGetMagMove();
                        if (this.yDist <= 0) {
                            var delta = this.yNext - this.box.y;
                            this.box.y = this.yNext;
                            if (this.yDist < 0) {
                                for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                                    var child = _c[_b];
                                    child.yMoveOnPlatform(delta);
                                }
                            }
                        }
                        var dirMove = this.yDir > 0 ? 1 : -1;
                        for (var _d = 0, interactables_2 = interactables; _d < interactables_2.length; _d++) {
                            var interactable = interactables_2[_d];
                            var contacts = this.box.collideAgainst(interactable.boxSolid, null, true, 0, true, Engine.Box.LAYER_ALL);
                            if (contacts != null) {
                                var distMove = this.box.getDist(interactable.boxSolid, dirMove, false);
                                contacts = interactable.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, false, -distMove, false, Engine.Box.LAYER_ALL);
                                interactable.boxSolid.translate(contacts, false, -distMove, false);
                                interactable.onPlatformOverlapY();
                            }
                        }
                    }
                };
                Platform.prototype.onTimeUpdate = function () {
                    var xDraw = this.box.x;
                    var yDraw = this.box.y;
                    this.sprite.x = xDraw;
                    this.sprite.y = yDraw;
                };
                Platform.prototype.onDrawObjects = function () {
                    //this.sprite.render();
                };
                Platform.prototype.onDrawObjectsFront = function () {
                    if (Engine.Box.debugRender) {
                        var xOld = this.box.x;
                        var yOld = this.box.y;
                        this.box.x += this.xGetVelMove() * Engine.System.deltaTime;
                        this.box.y += this.yGetVelMove() * Engine.System.deltaTime;
                        this.box.render();
                        this.box.x = xOld;
                        this.box.y = yOld;
                    }
                };
                Platform.prototype.onClearScene = function () {
                    if (interactables.length > 0) {
                        interactables = [];
                    }
                };
                return Platform;
            }(Game.Entity));
            Platformer.Platform = Platform;
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "../BaseAwarePlayer.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var Simple;
            (function (Simple) {
                var BaseFlowPlayer = /** @class */ (function (_super) {
                    __extends(BaseFlowPlayer, _super);
                    function BaseFlowPlayer(def) {
                        return _super.call(this, def) || this;
                    }
                    Object.defineProperty(BaseFlowPlayer.prototype, "winCondition", {
                        get: function () {
                            return Simple.Goal.instance != null && this.boxOverlap.collideAgainst(Simple.Goal.instance.boxOverlap, null, true, 0, true, Engine.Box.LAYER_ALL) != null;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(BaseFlowPlayer.prototype, "lossCondition", {
                        get: function () {
                            return this.contactsEnemies != null || this.contactsSolids != null || this.boxSolid.y > Game.SceneMap.instance.ySizeMap;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return BaseFlowPlayer;
                }(Platformer.BaseAwarePlayer));
                Simple.BaseFlowPlayer = BaseFlowPlayer;
            })(Simple = Platformer.Simple || (Platformer.Simple = {}));
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseFlowPlayer.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var Simple;
            (function (Simple) {
                var ControllablePlayer = /** @class */ (function (_super) {
                    __extends(ControllablePlayer, _super);
                    function ControllablePlayer(def) {
                        var _this = _super.call(this, def) || this;
                        _this.controls = new Game.Interaction.Controls.Platformer.BasicJumperControls();
                        return _this;
                    }
                    Object.defineProperty(ControllablePlayer.prototype, "dirMove", {
                        get: function () {
                            return 0;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(ControllablePlayer.prototype, "jumpControlPressed", {
                        get: function () {
                            return this.controls.pressedDelayedAction;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(ControllablePlayer.prototype, "jumpControlDown", {
                        get: function () {
                            return this.controls.downAction;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return ControllablePlayer;
                }(Simple.BaseFlowPlayer));
                Simple.ControllablePlayer = ControllablePlayer;
            })(Simple = Platformer.Simple || (Platformer.Simple = {}));
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path="../BaseMachineEntity.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var Simple;
            (function (Simple) {
                var Goal = /** @class */ (function (_super) {
                    __extends(Goal, _super);
                    function Goal(def) {
                        var _this = _super.call(this, def) || this;
                        Goal.instance = _this;
                        return _this;
                    }
                    Goal.prototype.onDrawGoal = function () {
                        this.sprite.render();
                    };
                    Goal.prototype.onClearScene = function () {
                        Goal.instance = null;
                    };
                    Goal.instance = null;
                    return Goal;
                }(Platformer.BaseMachineEntity));
                Simple.Goal = Goal;
            })(Simple = Platformer.Simple || (Platformer.Simple = {}));
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseFlowPlayer.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var Simple;
            (function (Simple) {
                var NoActionsRunnerPlayer = /** @class */ (function (_super) {
                    __extends(NoActionsRunnerPlayer, _super);
                    function NoActionsRunnerPlayer() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Object.defineProperty(NoActionsRunnerPlayer.prototype, "dirMove", {
                        get: function () {
                            return this.sprite.xMirror ? -1 : 1;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return NoActionsRunnerPlayer;
                }(Simple.BaseFlowPlayer));
                Simple.NoActionsRunnerPlayer = NoActionsRunnerPlayer;
            })(Simple = Platformer.Simple || (Platformer.Simple = {}));
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseFlowPlayer.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var Simple;
            (function (Simple) {
                var RunnerPlayer = /** @class */ (function (_super) {
                    __extends(RunnerPlayer, _super);
                    function RunnerPlayer(def) {
                        var _this = _super.call(this, def) || this;
                        _this.controls = new Game.Interaction.Controls.Platformer.BasicRunnerControls();
                        return _this;
                    }
                    Object.defineProperty(RunnerPlayer.prototype, "dirMove", {
                        get: function () {
                            return this.sprite.xMirror ? -1 : 1;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(RunnerPlayer.prototype, "jumpControlPressed", {
                        get: function () {
                            return this.controls.pressedDelayedAction;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(RunnerPlayer.prototype, "jumpControlDown", {
                        get: function () {
                            return this.controls.downAction;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return RunnerPlayer;
                }(Simple.BaseFlowPlayer));
                Simple.RunnerPlayer = RunnerPlayer;
            })(Simple = Platformer.Simple || (Platformer.Simple = {}));
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
///<reference path = "BaseFlowPlayer.ts"/>
var Game;
(function (Game) {
    var Arcade;
    (function (Arcade) {
        var Platformer;
        (function (Platformer) {
            var Simple;
            (function (Simple) {
                var TwoActionsRunnerPlayer = /** @class */ (function (_super) {
                    __extends(TwoActionsRunnerPlayer, _super);
                    function TwoActionsRunnerPlayer(def) {
                        var _this = _super.call(this, def) || this;
                        _this.controls = new Game.Interaction.Controls.Platformer.TwoActionsControl();
                        return _this;
                    }
                    Object.defineProperty(TwoActionsRunnerPlayer.prototype, "dirMove", {
                        get: function () {
                            return this.sprite.xMirror ? -1 : 1;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(TwoActionsRunnerPlayer.prototype, "jumpControlPressed", {
                        get: function () {
                            return this.controls.pressedDelayedA;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(TwoActionsRunnerPlayer.prototype, "jumpControlDown", {
                        get: function () {
                            return this.controls.downA;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return TwoActionsRunnerPlayer;
                }(Simple.BaseFlowPlayer));
                Simple.TwoActionsRunnerPlayer = TwoActionsRunnerPlayer;
            })(Simple = Platformer.Simple || (Platformer.Simple = {}));
        })(Platformer = Arcade.Platformer || (Arcade.Platformer = {}));
    })(Arcade = Game.Arcade || (Game.Arcade = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Flow;
    (function (Flow) {
        Flow.LENGTH_STATE_CHANGE_CHAIN = 10;
        var StateLink = /** @class */ (function () {
            function StateLink(state, condition, priority) {
                this.priority = 0;
                this.state = state;
                this.condition = condition;
                this.priority = priority;
            }
            return StateLink;
        }());
        Flow.StateLink = StateLink;
        var State = /** @class */ (function () {
            function State(owner, name) {
                if (name === void 0) { name = ""; }
                this.name = "";
                this.recursive = false;
                this.links = new Array();
                this.owner = owner;
                this.name = name;
            }
            Object.defineProperty(State.prototype, "onEnter", {
                set: function (value) {
                    this._onEnter = value.bind(this.owner);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(State.prototype, "onReady", {
                set: function (value) {
                    this._onReady = value.bind(this.owner);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(State.prototype, "onMoveUpdate", {
                set: function (value) {
                    this._onMoveUpdate = value.bind(this.owner);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(State.prototype, "onOverlapUpdate", {
                set: function (value) {
                    this._onOverlapUpdate = value.bind(this.owner);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(State.prototype, "onStepUpdate", {
                set: function (value) {
                    this._onStepUpdate = value.bind(this.owner);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(State.prototype, "onTimeUpdate", {
                set: function (value) {
                    this._onTimeUpdate = value.bind(this.owner);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(State.prototype, "onExit", {
                set: function (value) {
                    this._onExit = value.bind(this.owner);
                },
                enumerable: false,
                configurable: true
            });
            State.prototype.addLink = function (other, condition, priority) {
                if (priority === void 0) { priority = -1; }
                this.links.push(new StateLink(other, condition.bind(this.owner), priority));
                if (priority != -1) {
                    this.links.sort(function (a, b) {
                        if (a.priority < 0 && b.priority < 0) {
                            return 0;
                        }
                        if (a.priority < 0) {
                            return -1;
                        }
                        if (b.priority < 0) {
                            return -1;
                        }
                        return a.priority - b.priority;
                    });
                }
            };
            State.prototype.checkLinks = function (that) {
                for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                    var link = _a[_i];
                    if (link.condition(that)) {
                        return link.state;
                    }
                }
                return null;
            };
            return State;
        }());
        Flow.State = State;
        var StateAccess = /** @class */ (function (_super) {
            __extends(StateAccess, _super);
            function StateAccess() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return StateAccess;
        }(State));
        var StateMachine = /** @class */ (function (_super) {
            __extends(StateMachine, _super);
            function StateMachine(owner) {
                var _this = _super.call(this) || this;
                _this.recursive = true;
                _this.stoppable = true;
                _this.owner = owner;
                _this._anyState = new State(owner);
                return _this;
            }
            Object.defineProperty(StateMachine.prototype, "anyState", {
                get: function () {
                    return this._anyState;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(StateMachine.prototype, "startState", {
                get: function () {
                    return this._startState;
                },
                set: function (value) {
                    this._startState = value;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(StateMachine.prototype, "oldState", {
                get: function () {
                    return this._oldState;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(StateMachine.prototype, "currentState", {
                get: function () {
                    return this._currentState;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(StateMachine.prototype, "nextState", {
                get: function () {
                    return this._nextState;
                },
                enumerable: false,
                configurable: true
            });
            /*
            triggerUserListener(type : number){
                if(this.currentState.onUserUpdate != null){
                    this.currentState.onUserUpdate(type, this.owner as any);
                }
            }
            */
            StateMachine.prototype.triggerListener = function (listener) {
                if (listener != null) {
                    listener(this.owner);
                }
            };
            StateMachine.prototype.onReset = function () {
                this._nextState = null;
                this._oldState = null;
                this._currentState = this._startState;
                this.triggerListener(this._anyState._onEnter);
                this.triggerListener(this._currentState._onEnter);
                this.triggerListener(this._anyState._onReady);
                this.triggerListener(this._currentState._onReady);
            };
            StateMachine.prototype.onMoveUpdate = function () {
                if (!this.stoppable || !Game.SceneFreezer.stoped) {
                    this.triggerListener(this._anyState._onMoveUpdate);
                    this.triggerListener(this._currentState._onMoveUpdate);
                }
            };
            StateMachine.prototype.onOverlapUpdate = function () {
                if (!this.stoppable || !Game.SceneFreezer.stoped) {
                    this.triggerListener(this._anyState._onOverlapUpdate);
                    this.triggerListener(this._currentState._onOverlapUpdate);
                }
            };
            StateMachine.prototype.onStepUpdate = function () {
                if (!this.stoppable || !Game.SceneFreezer.stoped) {
                    this.triggerListener(this._anyState._onStepUpdate);
                    this.triggerListener(this._currentState._onStepUpdate);
                    var nextState = null;
                    var countStateChanges = 0;
                    do {
                        nextState = this._currentState.checkLinks(this.owner);
                        if (nextState != null) {
                            this._nextState = nextState;
                            this.triggerListener(this._anyState._onExit);
                            this.triggerListener(this._currentState._onExit);
                            this._oldState = this._currentState;
                            this._currentState = nextState;
                            this._nextState = null;
                            this.triggerListener(this._anyState._onEnter);
                            this.triggerListener(this._currentState._onEnter);
                            countStateChanges += 1;
                        }
                    } while (nextState != null && (this.recursive || nextState.recursive) && countStateChanges < Flow.LENGTH_STATE_CHANGE_CHAIN);
                    if (countStateChanges > 0) {
                        this.triggerListener(this._anyState._onReady);
                        this.triggerListener(this._currentState._onReady);
                        if (countStateChanges >= Flow.LENGTH_STATE_CHANGE_CHAIN) {
                            console.warn("Warning: state change chain was broken because there was too much recursion. Please check your state links");
                        }
                    }
                }
            };
            StateMachine.prototype.onTimeUpdate = function () {
                if (!this.stoppable || !Game.SceneFreezer.stoped) {
                    this.triggerListener(this._anyState._onTimeUpdate);
                    this.triggerListener(this._currentState._onTimeUpdate);
                }
            };
            return StateMachine;
        }(Engine.Entity));
        Flow.StateMachine = StateMachine;
    })(Flow = Game.Flow || (Game.Flow = {}));
})(Game || (Game = {}));
///<reference path="../../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var Interaction;
    (function (Interaction) {
        var Controls;
        (function (Controls) {
            var Platformer;
            (function (Platformer) {
                var BasicJumperControls = /** @class */ (function (_super) {
                    __extends(BasicJumperControls, _super);
                    function BasicJumperControls() {
                        var _this = _super.call(this) || this;
                        _this.countStepsDelayAction = 0;
                        _this.stepsDelayAction = 5;
                        _this.controlAction = new Game.Control();
                        _this.controlAction.enabled = true;
                        _this.controlAction.freezeable = true;
                        _this.controlAction.listener = _this;
                        _this.controlAction.useKeyboard = true;
                        _this.controlAction.newInteractionRequired = true;
                        _this.controlAction.useMouse = true;
                        _this.controlAction.mouseButtons = [0];
                        _this.controlAction.keys = [Engine.Keyboard.C, Engine.Keyboard.W, Engine.Keyboard.UP, "up", "Up", Engine.Keyboard.SPACE, "Space", "space", " "];
                        _this.controlAction.useTouch = true;
                        _this.controlAction.listener = _this;
                        if (Game.IS_TOUCH) {
                            _this.controlAction.useTouch = true;
                            _this.controlAction.bounds = new Engine.Sprite();
                            _this.controlAction.bounds.enabled = true;
                            _this.controlAction.bounds.pinned = true;
                            _this.tryFixTouchControls();
                        }
                        return _this;
                    }
                    Object.defineProperty(BasicJumperControls.prototype, "pressedDelayedAction", {
                        get: function () {
                            return this.countStepsDelayAction > 0;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(BasicJumperControls.prototype, "pressedAction", {
                        get: function () {
                            return this.controlAction.pressed;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(BasicJumperControls.prototype, "downAction", {
                        get: function () {
                            return this.controlAction.down;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    BasicJumperControls.prototype.onReset = function () {
                        this.countStepsDelayAction = 0;
                        this.tryFixTouchControls();
                    };
                    BasicJumperControls.prototype.onViewUpdate = function () {
                        this.tryFixTouchControls();
                    };
                    BasicJumperControls.prototype.tryFixTouchControls = function () {
                        if (Game.IS_TOUCH) {
                            this.controlAction.bounds.x = -Engine.Renderer.xSizeView * 0.5;
                            this.controlAction.bounds.y = -Engine.Renderer.ySizeView * 0.5;
                            this.controlAction.bounds.xSize = Engine.Renderer.xSizeView;
                            this.controlAction.bounds.ySize = Engine.Renderer.ySizeView;
                        }
                    };
                    BasicJumperControls.prototype.onStepUpdate = function () {
                        if (!Game.SceneFreezer.stoped) {
                            this.countStepsDelayAction -= (this.countStepsDelayAction > 0 ? 1 : 0);
                            if (this.controlAction.pressed) {
                                this.countStepsDelayAction = this.stepsDelayAction;
                            }
                        }
                    };
                    BasicJumperControls.prototype.consumeDelayedAction = function () {
                        this.countStepsDelayAction = 0;
                    };
                    return BasicJumperControls;
                }(Engine.Entity));
                Platformer.BasicJumperControls = BasicJumperControls;
            })(Platformer = Controls.Platformer || (Controls.Platformer = {}));
        })(Controls = Interaction.Controls || (Interaction.Controls = {}));
    })(Interaction = Game.Interaction || (Game.Interaction = {}));
})(Game || (Game = {}));
///<reference path="../../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var Interaction;
    (function (Interaction) {
        var Controls;
        (function (Controls) {
            var Platformer;
            (function (Platformer) {
                var BasicRunnerControls = /** @class */ (function (_super) {
                    __extends(BasicRunnerControls, _super);
                    function BasicRunnerControls() {
                        var _this = _super.call(this) || this;
                        _this.countStepsDelayAction = 0;
                        _this.stepsDelayAction = 5;
                        _this.controlAction = new Game.Control();
                        _this.controlAction.enabled = true;
                        _this.controlAction.freezeable = true;
                        _this.controlAction.listener = _this;
                        _this.controlAction.useKeyboard = true;
                        _this.controlAction.newInteractionRequired = true;
                        _this.controlAction.useMouse = false;
                        _this.controlAction.mouseButtons = [0];
                        if (Game.IS_EDGE) {
                            _this.controlAction.keys = [Engine.Keyboard.H, Engine.Keyboard.UP, "up", "Up", Engine.Keyboard.SPACE, "spacebar", "Space", "space", " "];
                        }
                        else {
                            _this.controlAction.keys = [Engine.Keyboard.W, Engine.Keyboard.H, Engine.Keyboard.UP, "up", "Up", Engine.Keyboard.SPACE, "spacebar", "Space", "space", " "];
                        }
                        _this.controlAction.useTouch = true;
                        return _this;
                    }
                    Object.defineProperty(BasicRunnerControls.prototype, "pressedDelayedAction", {
                        get: function () {
                            return this.countStepsDelayAction > 0;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(BasicRunnerControls.prototype, "pressedAction", {
                        get: function () {
                            return this.controlAction.pressed;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(BasicRunnerControls.prototype, "downAction", {
                        get: function () {
                            return this.controlAction.down;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    BasicRunnerControls.prototype.onReset = function () {
                        this.countStepsDelayAction = 0;
                    };
                    BasicRunnerControls.prototype.onStepUpdate = function () {
                        if (!Game.SceneFreezer.stoped) {
                            this.countStepsDelayAction -= (this.countStepsDelayAction > 0 ? 1 : 0);
                            if (this.controlAction.pressed) {
                                this.countStepsDelayAction = this.stepsDelayAction;
                            }
                        }
                    };
                    return BasicRunnerControls;
                }(Engine.Entity));
                Platformer.BasicRunnerControls = BasicRunnerControls;
            })(Platformer = Controls.Platformer || (Controls.Platformer = {}));
        })(Controls = Interaction.Controls || (Interaction.Controls = {}));
    })(Interaction = Game.Interaction || (Game.Interaction = {}));
})(Game || (Game = {}));
///<reference path="../../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var Interaction;
    (function (Interaction) {
        var Controls;
        (function (Controls) {
            var Platformer;
            (function (Platformer) {
                var TwoActionsControl = /** @class */ (function (_super) {
                    __extends(TwoActionsControl, _super);
                    function TwoActionsControl() {
                        var _this = _super.call(this) || this;
                        _this.countStepsDelayA = 0;
                        _this.stepsDelayA = 5;
                        _this.countStepsDelayB = 0;
                        _this.stepsDelayB = 5;
                        _this.controlA = new Game.Control();
                        _this.controlA.enabled = true;
                        _this.controlA.freezeable = true;
                        _this.controlA.listener = _this;
                        _this.controlA.useKeyboard = true;
                        _this.controlA.newInteractionRequired = true;
                        _this.controlA.useMouse = true;
                        _this.controlA.mouseButtons = [0];
                        _this.controlA.keys = [Engine.Keyboard.C, Engine.Keyboard.UP, "up", "Up"];
                        _this.controlB = new Game.Control();
                        _this.controlB.enabled = true;
                        _this.controlB.freezeable = true;
                        _this.controlB.listener = _this;
                        _this.controlB.useKeyboard = true;
                        _this.controlB.newInteractionRequired = true;
                        _this.controlB.useMouse = true;
                        _this.controlB.mouseButtons = [2];
                        _this.controlB.keys = [Engine.Keyboard.SPACE, Engine.Keyboard.X, "spacebar", "Spacebar", "SPACEBAR", "space", "Space", " "];
                        if (Game.IS_TOUCH) {
                            _this.controlA.useTouch = true;
                            _this.controlA.bounds = new Engine.Sprite();
                            _this.controlA.bounds.enabled = true;
                            _this.controlA.bounds.pinned = true;
                            _this.controlB.useTouch = true;
                            _this.controlB.bounds = new Engine.Sprite();
                            _this.controlB.bounds.enabled = true;
                            _this.controlB.bounds.pinned = true;
                            _this.tryFixTouchControls();
                        }
                        _this.tryFixTouchControls();
                        return _this;
                    }
                    Object.defineProperty(TwoActionsControl.prototype, "pressedDelayedA", {
                        get: function () {
                            return this.countStepsDelayA > 0;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(TwoActionsControl.prototype, "pressedA", {
                        get: function () {
                            return this.controlA.pressed;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(TwoActionsControl.prototype, "downA", {
                        get: function () {
                            return this.controlA.down;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(TwoActionsControl.prototype, "pressedDelayedB", {
                        get: function () {
                            return this.countStepsDelayB > 0;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(TwoActionsControl.prototype, "pressedB", {
                        get: function () {
                            return this.controlB.pressed;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(TwoActionsControl.prototype, "downB", {
                        get: function () {
                            return this.controlB.down;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    TwoActionsControl.prototype.onReset = function () {
                        this.countStepsDelayA = 0;
                        this.countStepsDelayB = 0;
                    };
                    TwoActionsControl.prototype.onViewUpdate = function () {
                        this.tryFixTouchControls();
                    };
                    TwoActionsControl.prototype.tryFixTouchControls = function () {
                        if (Game.IS_TOUCH) {
                            this.controlA.bounds.x = 0;
                            this.controlA.bounds.y = -Engine.Renderer.ySizeView * 0.5;
                            this.controlA.bounds.xSize = Engine.Renderer.xSizeView * 0.5;
                            this.controlA.bounds.ySize = Engine.Renderer.ySizeView;
                            this.controlB.bounds.x = -Engine.Renderer.xSizeView * 0.5;
                            this.controlB.bounds.y = -Engine.Renderer.ySizeView * 0.5;
                            this.controlB.bounds.xSize = Engine.Renderer.xSizeView * 0.5;
                            this.controlB.bounds.ySize = Engine.Renderer.ySizeView;
                        }
                    };
                    TwoActionsControl.prototype.onStepUpdate = function () {
                        if (!Game.SceneFreezer.stoped) {
                            this.countStepsDelayA -= (this.countStepsDelayA > 0 ? 1 : 0);
                            if (this.controlA.pressed) {
                                this.countStepsDelayA = this.stepsDelayA;
                            }
                            this.countStepsDelayB -= (this.countStepsDelayB > 0 ? 1 : 0);
                            if (this.controlB.pressed) {
                                this.countStepsDelayB = this.stepsDelayB;
                            }
                        }
                    };
                    return TwoActionsControl;
                }(Engine.Entity));
                Platformer.TwoActionsControl = TwoActionsControl;
            })(Platformer = Controls.Platformer || (Controls.Platformer = {}));
        })(Controls = Interaction.Controls || (Interaction.Controls = {}));
    })(Interaction = Game.Interaction || (Game.Interaction = {}));
})(Game || (Game = {}));
///<reference path="../../../Engine/Scene.ts"/>
///<reference path="../../Game.ts"/>
var Game;
(function (Game) {
    var Scene = /** @class */ (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            var _this = _super.call(this) || this;
            _this.countStepsWait = 0;
            _this.stepsWait = 0;
            Scene.instance = _this;
            Game.SceneFreezer.init();
            Game.SceneFade.init();
            Game.SceneColors.init();
            //SceneColors.clearColor(0, 0, 0);
            Game.SceneOrientator.init();
            return _this;
        }
        Object.defineProperty(Scene, "nextSceneClass", {
            get: function () {
                return Scene.instance.nextSceneClass;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Scene, "waiting", {
            get: function () {
                return Scene.instance.waiting;
            },
            enumerable: false,
            configurable: true
        });
        Scene.prototype.onReset = function () {
            this.nextSceneClass = null;
            this.waiting = false;
            this.countStepsWait = 0;
        };
        Scene.prototype.onStepUpdate = function () {
            if (this.waiting) {
                this.countStepsWait += 1;
                if (this.countStepsWait >= this.stepsWait) {
                    if (this.nextSceneClass == "reset") {
                        Engine.System.requireReset();
                    }
                    else {
                        Engine.System.nextSceneClass = this.nextSceneClass;
                    }
                    this.onEndWaiting();
                }
            }
            else if (!this.waiting && this.nextSceneClass != null && Game.SceneFade.filled) {
                this.waiting = true;
                this.onStartWaiting();
            }
        };
        Scene.prototype.onStartWaiting = function () {
        };
        Scene.prototype.onEndWaiting = function () {
        };
        Scene.prototype.onFadeLinStart = function () {
        };
        return Scene;
    }(Engine.Scene));
    Game.Scene = Scene;
})(Game || (Game = {}));
///<reference path="Scene.ts"/>
var Game;
(function (Game) {
    var FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    var FLIPPED_VERTICALLY_FLAG = 0x40000000;
    var FLIPPED_DIAGONALLY_FLAG = 0x20000000;
    var SceneMap = /** @class */ (function (_super) {
        __extends(SceneMap, _super);
        //private defSky : any;
        function SceneMap() {
            var _this = _super.call(this) || this;
            _this.offsetTiles = 0;
            _this.xSizeMap = 0;
            _this.ySizeMap = 0;
            _this.xSizeTile = 0;
            _this.ySizeTile = 0;
            SceneMap.instance = _this;
            _this.boxesSolids = [];
            _this.boxesSticky = [];
            _this.noOneWaySolids = [];
            _this.newOneWaySolids = [];
            _this.boxesEnemies = [];
            _this.dataTiles = [];
            return _this;
            //console.error("REMEMBER TO OPTIMIZE THIS SHIT");
        }
        SceneMap.prototype.loadMap = function (pathTerrain, _pathSky) {
            if (_pathSky === void 0) { _pathSky = null; }
            this.loadDefTerrain(pathTerrain);
            this.loadDefSky(null);
            this.createMapBoxes(this.defMapSky);
            this.createMapBoxes(this.defMapTerrain);
            this.createEntities(this.defMapSky);
            this.createEntities(this.defMapTerrain);
            Game.Resources.textureMapBack.clear();
            this.buildTexture(this.defMapSky, true);
            this.buildTexture(this.defMapTerrain, true);
            Game.Resources.textureMapTerrain.copy(Game.Resources.textureMapBack);
            this.buildTexture(this.defMapSky, false);
            this.buildTexture(this.defMapTerrain, false);
            this.spriteTerrain = new Engine.Sprite();
            this.spriteTerrain.setFull(true, false, Game.Resources.textureMapTerrain, this.xSizeMap, this.ySizeMap, 0, 0, 1, 1, this.xSizeMap, this.ySizeMap);
            for (var _i = 0, _a = this.boxesSolids; _i < _a.length; _i++) {
                var box = _a[_i];
                this.noOneWaySolids.push(box);
            }
            for (var _b = 0, _c = this.newOneWaySolids; _b < _c.length; _b++) {
                var box = _c[_b];
                this.boxesSolids.push(box);
            }
            this.onViewUpdate();
        };
        SceneMap.prototype.onViewUpdate = function () {
            this.spritesBack = [];
            if (Engine.Renderer.xFitView) {
                this.onViewUpdateY();
            }
            else {
                this.onViewUpdateX();
            }
        };
        SceneMap.prototype.onViewUpdateX = function () {
            var count = Engine.Renderer.xSizeView - this.xSizeMap;
            count /= 2.0;
            var lastSize = count + this.xSizeTile;
            count /= this.xSizeMap;
            count = Math.ceil(count);
            for (var i = 0; i < count; i++) {
                this.spritesBack.push(this.createSpriteBackX(i, 1, i == count - 1, lastSize));
                this.spritesBack.push(this.createSpriteBackX(i, -1, i == count - 1, lastSize));
            }
        };
        SceneMap.prototype.onViewUpdateY = function () {
            var count = Engine.Renderer.ySizeView - this.ySizeMap;
            count /= 2.0;
            var lastSize = count;
            count /= this.ySizeMap;
            count = Math.ceil(count);
            for (var i = 0; i < count; i++) {
                this.spritesBack.push(this.createSpriteBackY(i, 1, i == count - 1, lastSize));
                this.spritesBack.push(this.createSpriteBackY(i, -1, i == count - 1, lastSize));
            }
        };
        SceneMap.prototype.createSpriteBackX = function (index, dir, last, lastSize) {
            var sprite = new Engine.Sprite();
            if (last) {
                if (dir > 0) {
                    sprite.setFull(true, false, Game.Resources.textureMapBack, lastSize, this.ySizeMap, 0, 0, 1, 1, lastSize, this.ySizeMap);
                    sprite.x = this.xSizeMap * dir + this.xSizeMap * index * dir;
                }
                else {
                    sprite.setFull(true, false, Game.Resources.textureMapBack, lastSize, this.ySizeMap, 0, 0, 1 + (this.xSizeMap - lastSize), 1, lastSize, this.ySizeMap);
                    sprite.x = lastSize * dir + this.xSizeMap * index * dir;
                }
            }
            else {
                sprite.setFull(true, false, Game.Resources.textureMapBack, this.xSizeMap, this.ySizeMap, 0, 0, 1, 1, this.xSizeMap, this.ySizeMap);
                sprite.x = this.xSizeMap * dir + this.xSizeMap * index * dir;
            }
            return sprite;
        };
        SceneMap.prototype.createSpriteBackY = function (index, dir, last, lastSize) {
            var sprite = new Engine.Sprite();
            if (last) {
                if (dir > 0) {
                    sprite.setFull(true, false, Game.Resources.textureMapBack, this.xSizeMap, lastSize, 0, 0, 1, 1, this.xSizeMap, lastSize);
                    sprite.y = this.ySizeMap * dir + this.ySizeMap * index * dir;
                }
                else {
                    sprite.setFull(true, false, Game.Resources.textureMapBack, this.xSizeMap, lastSize, 0, 0, 1, 1 + (this.ySizeMap - lastSize), this.xSizeMap, lastSize);
                    sprite.y = lastSize * dir + this.ySizeMap * index * dir;
                }
            }
            else {
                sprite.setFull(true, false, Game.Resources.textureMapBack, this.xSizeMap, this.ySizeMap, 0, 0, 1, 1, this.xSizeMap, this.ySizeMap);
                sprite.y = this.ySizeMap * dir + this.ySizeMap * index * dir;
            }
            return sprite;
        };
        SceneMap.prototype.loadDefTerrain = function (pathMap) {
            //TODO: Suboptimal
            var tileset = JSON.parse(Engine.Assets.loadText(Game.Resources.PATH_TILESET));
            this.tiles = tileset.tiles;
            this.xSizeTile = tileset.tilewidth;
            this.ySizeTile = tileset.tileheight;
            this.tileColumns = tileset.columns;
            this.offsetTiles = tileset.margin;
            this.defMapTerrain = JSON.parse(Engine.Assets.loadText(pathMap));
            this.xCountTiles = this.defMapTerrain.width;
            this.yCountTiles = this.defMapTerrain.height;
            this.xSizeMap = this.defMapTerrain.width * this.xSizeTile;
            this.ySizeMap = this.defMapTerrain.height * this.ySizeTile;
            this.boxesSolids = new Array();
            this.boxesSticky = new Array();
            this.noOneWaySolids = new Array();
            this.newOneWaySolids = new Array();
        };
        SceneMap.prototype.loadDefSky = function (pathMap) {
            if (pathMap == null) {
                this.defMapSky = null;
                return;
            }
            var xUnitSky = Math.floor(this.xSizeMap / Engine.Renderer.xSizeView);
            var yUnitSky = Math.floor(this.ySizeMap / Engine.Renderer.ySizeView);
            //TODO: Suboptimal
            this.defMapSky = JSON.parse(Engine.Assets.loadText(pathMap + xUnitSky + "x" + yUnitSky + ".json"));
        };
        SceneMap.prototype.createMapBoxes = function (def) {
            if (def == null)
                return;
            for (var _i = 0, _a = def.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.name.indexOf("Entities") < 0 && layer.name.indexOf("Repeat") < 0 && layer.name.indexOf("Ignore") < 0) {
                    var indexTile = 0;
                    var tileDefMatrix = [];
                    for (var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1) {
                        for (var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1) {
                            tileDefMatrix[xIndex + yIndex * this.xCountTiles] = false;
                            if (layer.data[indexTile] != 0) {
                                if (this.getTileType(layer.data[indexTile]) == "Terrain") {
                                    tileDefMatrix[xIndex + yIndex * this.xCountTiles] = true;
                                }
                            }
                            indexTile += 1;
                        }
                    }
                    for (var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1) {
                        for (var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1) {
                            if (tileDefMatrix[xIndex + yIndex * this.xCountTiles]) {
                                this.boxesSolids.push(this.generateBox(tileDefMatrix, xIndex, yIndex, this.xCountTiles, this.yCountTiles, this.xCountTiles));
                            }
                        }
                    }
                    var indexTile = 0;
                    var tileDefMatrix = [];
                    for (var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1) {
                        for (var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1) {
                            tileDefMatrix[xIndex + yIndex * this.xCountTiles] = false;
                            if (layer.data[indexTile] != 0) {
                                if (this.getTileType(layer.data[indexTile]) == "StickyTerrain") {
                                    tileDefMatrix[xIndex + yIndex * this.xCountTiles] = true;
                                }
                            }
                            indexTile += 1;
                        }
                    }
                    for (var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1) {
                        for (var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1) {
                            if (tileDefMatrix[xIndex + yIndex * this.xCountTiles]) {
                                var box = this.generateBox(tileDefMatrix, xIndex, yIndex, this.xCountTiles, this.yCountTiles, this.xCountTiles);
                                this.boxesSolids.push(box);
                                this.boxesSticky.push(box);
                            }
                        }
                    }
                    var indexTile = 0;
                    var tileDefMatrix = [];
                    for (var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1) {
                        for (var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1) {
                            tileDefMatrix[xIndex + yIndex * this.xCountTiles] = false;
                            if (layer.data[indexTile] != 0) {
                                if (this.getTileType(layer.data[indexTile]) == "OneWay") {
                                    tileDefMatrix[xIndex + yIndex * this.xCountTiles] = true;
                                }
                            }
                            indexTile += 1;
                        }
                    }
                    for (var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1) {
                        for (var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1) {
                            if (tileDefMatrix[xIndex + yIndex * this.xCountTiles]) {
                                this.newOneWaySolids.push(this.generateBox(tileDefMatrix, xIndex, yIndex, this.xCountTiles, this.yCountTiles, this.xCountTiles));
                            }
                        }
                    }
                }
            }
        };
        SceneMap.prototype.generateBox = function (tileDefMatrix, xStart, yStart, xMax, yMax, xSize) {
            for (var y = yStart; y < yMax; y += 1) {
                for (var x = xStart; x < xMax; x += 1) {
                    if (!tileDefMatrix[x + y * xSize]) {
                        xMax = x;
                        break;
                    }
                }
                if (y < yMax - 1 && !tileDefMatrix[xStart + (y + 1) * xSize]) {
                    yMax = y + 1;
                    break;
                }
            }
            for (var y = yStart; y < yMax; y += 1) {
                for (var x = xStart; x < xMax; x += 1) {
                    tileDefMatrix[x + y * xSize] = false;
                }
            }
            var box = new Engine.Box();
            box.enabled = true;
            box.renderable = true;
            box.layer = Engine.Box.LAYER_ALL;
            box.x = xStart * this.xSizeTile;
            box.y = yStart * this.ySizeTile;
            box.xSize = (xMax - xStart) * this.xSizeTile;
            box.ySize = (yMax - yStart) * this.ySizeTile;
            box.red = Math.random() * 1;
            box.green = Math.random() * 1;
            box.blue = Math.random() * 1;
            box.alpha = 0.9;
            return box;
        };
        SceneMap.prototype.createEntities = function (def) {
            if (def == null)
                return;
            this.boxesEnemies = Array();
            var entities = Game.findInJSON(def.layers, function (layer) { return layer.name.indexOf("Entities") >= 0; }).objects;
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var instancedef = entities_1[_i];
                var entitydef = this.getEntitydef(instancedef);
                Game.Entity.create(entitydef);
            }
        };
        SceneMap.prototype.getEntitydef = function (instancedef) {
            var typedef = Game.findInJSON(this.tiles, function (typedef) {
                var gid = instancedef.gid & ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);
                return typedef.id == gid - 1;
            });
            var entitydef = {};
            entitydef.type = typedef;
            entitydef.instance = instancedef;
            entitydef.flip = {};
            entitydef.flip.x = (instancedef.gid & (instancedef.gid & FLIPPED_HORIZONTALLY_FLAG)) != 0;
            entitydef.flip.y = (instancedef.gid & (instancedef.gid & FLIPPED_VERTICALLY_FLAG)) != 0;
            return entitydef;
        };
        SceneMap.prototype.getTileType = function (id) {
            var typedef = Game.findInJSON(this.tiles, function (typedef) {
                return typedef.id == id - 1;
            });
            if (typedef != null) {
                return typedef.type;
            }
            return null;
        };
        SceneMap.prototype.onDrawSceneMap = function () {
            //this.drawLayers(this.defMap);
            for (var _i = 0, _a = this.spritesBack; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.render();
            }
            this.spriteTerrain.render();
            //SceneColors.instance.drawFill();
            for (var _b = 0, _c = this.boxesSolids; _b < _c.length; _b++) {
                var box = _c[_b];
                box.render();
            }
            for (var _d = 0, _e = this.boxesSticky; _d < _e.length; _d++) {
                var box = _e[_d];
                box.render();
            }
        };
        SceneMap.prototype.buildTexture = function (def, back) {
            if (def == null)
                return;
            var texture = back ? Game.Resources.textureMapBack : Game.Resources.textureMapTerrain;
            for (var _i = 0, _a = def.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.name.indexOf("Entities") >= 0 || layer.name.indexOf("Ignore") >= 0)
                    continue;
                if (back && layer.name.indexOf("Repeat") < 0)
                    continue;
                if (!back && layer.name.indexOf("Repeat") >= 0)
                    continue;
                for (var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1) {
                    for (var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1) {
                        var indexTile = xIndex + yIndex * this.xCountTiles;
                        var data = layer.data[indexTile];
                        if (data == 0)
                            continue;
                        data--;
                        var yPixTil = Math.floor(data / Math.floor(Game.Resources.textureStiltsTileset.assetData.xSize / (this.xSizeTile + this.offsetTiles)));
                        var xPixTil = data - (yPixTil * Math.floor(Game.Resources.textureStiltsTileset.assetData.ySize / (this.xSizeTile + this.offsetTiles)));
                        var xPixPut = this.offsetTiles + xPixTil * (this.xSizeTile + this.offsetTiles);
                        var yPixPut = this.offsetTiles + yPixTil * (this.xSizeTile + this.offsetTiles);
                        for (var xPix = 0; xPix < this.xSizeTile; xPix += 1) {
                            for (var yPix = 0; yPix < this.ySizeTile; yPix += 1) {
                                var alpha = Game.Resources.textureStiltsTileset.getAlpha(xPixPut + xPix, yPixPut + yPix);
                                if (alpha != 0) {
                                    var red = Game.Resources.textureStiltsTileset.getRed(xPixPut + xPix, yPixPut + yPix);
                                    var green = Game.Resources.textureStiltsTileset.getGreen(xPixPut + xPix, yPixPut + yPix);
                                    var blue = Game.Resources.textureStiltsTileset.getBlue(xPixPut + xPix, yPixPut + yPix);
                                    var xmap = xIndex * this.xSizeTile + xPix + 1;
                                    var ymap = yIndex * this.xSizeTile + yPix + 1;
                                    texture.setRGBA(xmap, ymap, red, green, blue, alpha);
                                }
                            }
                        }
                    }
                }
            }
            for (var xPix = 0; xPix < this.xSizeMap + 1; xPix += 1) {
                var red = texture.getRed(xPix, 1);
                var green = texture.getGreen(xPix, 1);
                var blue = texture.getBlue(xPix, 1);
                var alpha = texture.getAlpha(xPix, 1);
                texture.setRGBA(xPix, 0, red, green, blue, alpha);
                red = texture.getRed(xPix, this.ySizeMap);
                green = texture.getGreen(xPix, this.ySizeMap);
                blue = texture.getBlue(xPix, this.ySizeMap);
                alpha = texture.getAlpha(xPix, this.ySizeMap);
                texture.setRGBA(xPix, this.ySizeMap + 1, red, green, blue, alpha);
            }
            for (var yPix = 0; yPix < this.ySizeMap + 1; yPix += 1) {
                var red = texture.getRed(1, yPix);
                var green = texture.getGreen(1, yPix);
                var blue = texture.getBlue(1, yPix);
                var alpha = texture.getAlpha(1, yPix);
                texture.setRGBA(0, yPix, red, green, blue, alpha);
                red = texture.getRed(this.xSizeMap, yPix);
                green = texture.getGreen(this.xSizeMap, yPix);
                blue = texture.getBlue(this.xSizeMap, yPix);
                alpha = texture.getAlpha(this.xSizeMap, yPix);
                texture.setRGBA(this.xSizeMap + 1, yPix, red, green, blue, alpha);
            }
            texture.renderAgain();
        };
        SceneMap.maxRepetitionsX = Infinity;
        SceneMap.maxRepetitionsY = Infinity;
        SceneMap.instance = null;
        return SceneMap;
    }(Game.Scene));
    Game.SceneMap = SceneMap;
})(Game || (Game = {}));
/*
///<reference path="Scene.ts"/>
namespace Game{
    var FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    var FLIPPED_VERTICALLY_FLAG   = 0x40000000;
    var FLIPPED_DIAGONALLY_FLAG   = 0x20000000;

    export class SceneMap extends Scene{
        public static maxRepetitionsX = Infinity;
        public static maxRepetitionsY = Infinity;

        public static instance : SceneMap = null;

        public spritesBack : Array<Engine.Sprite>;
        public spriteTerrain : Engine.Sprite;

        public boxesSolids : Array<Engine.Box>;
        public boxesSticky : Array<Engine.Box>;
        public newOneWaySolids : Array<Engine.Box>;
        public noOneWaySolids : Array<Engine.Box>;
        public boxesEnemies : Array<Engine.Box>;
        public dataTiles : Array<any>;

        public xCountTiles : number;
        public yCountTiles : number;
        public offsetTiles = 0;

        public xSizeMap = 0;
        public ySizeMap = 0;

        public tiles : any;

        public tileColumns : number;

        public xSizeTile = 0;
        public ySizeTile = 0;

        private defMapSky : any;
        private defMapTerrain : any;
        //private defSky : any;

        constructor(){
            super();
            SceneMap.instance = this;
            this.boxesSolids = [];
            this.boxesSticky = [];
            this.noOneWaySolids = [];
            this.newOneWaySolids = [];
            this.boxesEnemies = [];
            this.dataTiles = [];
            //console.error("REMEMBER TO OPTIMIZE THIS SHIT");
        }

        
        
        protected loadMap(pathTerrain : string, _pathSky : string = null){
            this.loadDefTerrain(pathTerrain);
            this.loadDefSky(null);

            this.createMapBoxes(this.defMapSky);
            this.createMapBoxes(this.defMapTerrain);

            this.createEntities(this.defMapSky);
            this.createEntities(this.defMapTerrain);

            Resources.textureMapBack.clear();
            this.buildTexture(this.defMapSky, true);
            this.buildTexture(this.defMapTerrain, true);
            Resources.textureMapTerrain.copy(Resources.textureMapBack);
            this.buildTexture(this.defMapSky, false);
            this.buildTexture(this.defMapTerrain, false);

            this.spriteTerrain = new Engine.Sprite();
            this.spriteTerrain.setFull(true, false, Resources.textureMapTerrain, this.xSizeMap, this.ySizeMap, 0, 0, 1, 1, this.xSizeMap, this.ySizeMap);
            
            
            for(var box of this.boxesSolids){
                this.noOneWaySolids.push(box);
            }
            for(var box of this.newOneWaySolids){
                this.boxesSolids.push(box);
            }
            

            this.onViewUpdate();
        }

        protected onViewUpdate(){
            this.spritesBack = [];
            if(Engine.Renderer.xFitView){
                this.onViewUpdateY();
            }
            else{
                this.onViewUpdateX();
            }
            
        }

        protected onViewUpdateX(){
            var count = Engine.Renderer.xSizeView - this.xSizeMap;
            count /= 2.0;
            var lastSize = count;
            count /= this.xSizeMap;
            count = Math.ceil(count);
            for(var i = 0; i < count; i++){
                this.spritesBack.push(this.createSpriteBackX(i, 1, i == count - 1, lastSize));
                this.spritesBack.push(this.createSpriteBackX(i, -1, i == count - 1, lastSize));
            }
        }

        protected onViewUpdateY(){
            var count = Engine.Renderer.ySizeView - this.ySizeMap;
            count /= 2.0;
            var lastSize = count;
            count /= this.ySizeMap;
            count = Math.ceil(count);
            for(var i = 0; i < count; i++){
                this.spritesBack.push(this.createSpriteBackY(i, 1, i == count - 1, lastSize));
                this.spritesBack.push(this.createSpriteBackY(i, -1, i == count - 1, lastSize));
            }
        }

        protected createSpriteBackX(index : number, dir : number, last : boolean, lastSize : number){
            var sprite = new Engine.Sprite();
            if(last){
                if(dir > 0){
                    sprite.setFull(true, false, Resources.textureMapBack, lastSize, this.ySizeMap, 0, 0, 1, 1, lastSize, this.ySizeMap);
                    sprite.x = this.xSizeMap * dir + this.xSizeMap * index * dir;
                }
                else{
                    sprite.setFull(true, false, Resources.textureMapBack, lastSize, this.ySizeMap, 0, 0, 1 + (this.xSizeMap - lastSize), 1, lastSize, this.ySizeMap);
                    sprite.x = lastSize * dir + this.xSizeMap * index * dir;
                }
            }
            else{
                sprite.setFull(true, false, Resources.textureMapBack, this.xSizeMap, this.ySizeMap, 0, 0, 1, 1, this.xSizeMap, this.ySizeMap);
                sprite.x = this.xSizeMap * dir + this.xSizeMap * index * dir;
            }
            return sprite;
        }

        protected createSpriteBackY(index : number, dir : number, last : boolean, lastSize : number){
            var sprite = new Engine.Sprite();
            if(last){
                if(dir > 0){
                    sprite.setFull(true, false, Resources.textureMapBack, this.xSizeMap, lastSize, 0, 0, 1, 1, this.xSizeMap, lastSize);
                    sprite.y = this.ySizeMap * dir + this.ySizeMap * index * dir;
                }
                else{
                    sprite.setFull(true, false, Resources.textureMapBack, this.xSizeMap, lastSize, 0, 0, 1, 1 + (this.ySizeMap - lastSize), this.xSizeMap, lastSize);
                    sprite.y = lastSize * dir + this.ySizeMap * index * dir;
                }
            }
            else{
                sprite.setFull(true, false, Resources.textureMapBack, this.xSizeMap, this.ySizeMap, 0, 0, 1, 1, this.xSizeMap, this.ySizeMap);
                sprite.y = this.ySizeMap * dir + this.ySizeMap * index * dir;
            }
            return sprite;
        }

        private loadDefTerrain(pathMap : string){
            //TODO: Suboptimal
            var tileset = JSON.parse(Engine.Assets.loadText(Resources.PATH_TILESET));
            this.tiles = tileset.tiles;
            this.xSizeTile = tileset.tilewidth;
            this.ySizeTile = tileset.tileheight;
            this.tileColumns = tileset.columns;
            this.offsetTiles = tileset.margin;

            this.defMapTerrain = JSON.parse(Engine.Assets.loadText(pathMap));
            this.xCountTiles = this.defMapTerrain.width;
            this.yCountTiles = this.defMapTerrain.height;
            this.xSizeMap = this.defMapTerrain.width * this.xSizeTile;
            this.ySizeMap = this.defMapTerrain.height * this.ySizeTile;
            this.boxesSolids = new Array<Engine.Box>();
            this.boxesSticky = new Array<Engine.Box>();
            this.noOneWaySolids = new Array<Engine.Box>();
            this.newOneWaySolids = new Array<Engine.Box>();
        }

        private loadDefSky(pathMap : string){
            if(pathMap == null){
                this.defMapSky = null;
                return;
            }
            var xUnitSky = Math.floor(this.xSizeMap / Engine.Renderer.xSizeView);
            var yUnitSky = Math.floor(this.ySizeMap / Engine.Renderer.ySizeView);
            //TODO: Suboptimal
            this.defMapSky = JSON.parse(Engine.Assets.loadText(pathMap + xUnitSky + "x" + yUnitSky + ".json"));
        }

        private createMapBoxes(def : any){
            if(def == null) return;
            for(var layer of def.layers){
                if(layer.name.indexOf("Entities") < 0 && layer.name.indexOf("Repeat") < 0 && layer.name.indexOf("Ignore") < 0){
                    var indexTile = 0;
                    var tileDefMatrix : Array<boolean> = [];
                    for(var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1){
                        for(var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1){
                            tileDefMatrix[xIndex + yIndex * this.xCountTiles] = false;
                            if(layer.data[indexTile] != 0){
                                if(this.getTileType(layer.data[indexTile]) == "Terrain"){
                                    tileDefMatrix[xIndex + yIndex * this.xCountTiles] = true;
                                }
                            }
                            indexTile += 1;
                        }
                    }
                    for(var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1){
                        for(var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1){
                            if(tileDefMatrix[xIndex + yIndex * this.xCountTiles]){
                                this.boxesSolids.push(this.generateBox(tileDefMatrix, xIndex, yIndex, this.xCountTiles, this.yCountTiles, this.xCountTiles));
                            }
                        }
                    }
                    var indexTile = 0;
                    var tileDefMatrix : Array<boolean> = [];
                    for(var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1){
                        for(var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1){
                            tileDefMatrix[xIndex + yIndex * this.xCountTiles] = false;
                            if(layer.data[indexTile] != 0){
                                if(this.getTileType(layer.data[indexTile]) == "StickyTerrain"){
                                    tileDefMatrix[xIndex + yIndex * this.xCountTiles] = true;
                                }
                            }
                            indexTile += 1;
                        }
                    }
                    for(var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1){
                        for(var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1){
                            if(tileDefMatrix[xIndex + yIndex * this.xCountTiles]){
                                var box = this.generateBox(tileDefMatrix, xIndex, yIndex, this.xCountTiles, this.yCountTiles, this.xCountTiles);
                                this.boxesSolids.push(box);
                                this.boxesSticky.push(box);
                            }
                        }
                    }
                    var indexTile = 0;
                    var tileDefMatrix : Array<boolean> = [];
                    for(var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1){
                        for(var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1){
                            tileDefMatrix[xIndex + yIndex * this.xCountTiles] = false;
                            if(layer.data[indexTile] != 0){
                                if(this.getTileType(layer.data[indexTile]) == "OneWay"){
                                    tileDefMatrix[xIndex + yIndex * this.xCountTiles] = true;
                                }
                            }
                            indexTile += 1;
                        }
                    }
                    for(var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1){
                        for(var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1){
                            if(tileDefMatrix[xIndex + yIndex * this.xCountTiles]){
                                this.newOneWaySolids.push(this.generateBox(tileDefMatrix, xIndex, yIndex, this.xCountTiles, this.yCountTiles, this.xCountTiles));
                            }
                        }
                    }
                }
            }
        }

        private generateBox(tileDefMatrix : Array<boolean>, xStart : number, yStart : number, xMax : number, yMax : number, xSize : number){
            for(var y = yStart; y < yMax; y += 1){
                for(var x = xStart; x < xMax; x += 1){
                    if(!tileDefMatrix[x + y * xSize]){
                        xMax = x;
                        break;
                    }
                }
                if(y < yMax - 1 && !tileDefMatrix[xStart + (y + 1) * xSize]){
                    yMax = y + 1;
                    break;
                }
            }
            for(var y = yStart; y < yMax; y += 1){
                for(var x = xStart; x < xMax; x += 1){
                    tileDefMatrix[x + y * xSize] = false;
                }
            }
            var box = new Engine.Box();
            box.enabled = true;
            box.renderable = true;
            box.layer = Engine.Box.LAYER_ALL;
            box.x = xStart * this.xSizeTile;
            box.y = yStart * this.ySizeTile;
            box.xSize = (xMax - xStart) * this.xSizeTile;
            box.ySize = (yMax - yStart) * this.ySizeTile;
            box.red = Math.random() * 1;
            box.green = Math.random() * 1;
            box.blue = Math.random() * 1;
            box.alpha = 0.9;
            return box;
        }

        private createEntities(def : any){
            if(def == null) return;
            this.boxesEnemies = Array<Engine.Box>();
            var entities = findInJSON(def.layers, function(layer : any){return layer.name.indexOf("Entities") >= 0;}).objects;
            for(var instancedef of entities){
                var entitydef : any = this.getEntitydef(instancedef);
                Entity.create(entitydef);
            }
        }

        private getEntitydef(instancedef : any){
            var typedef = findInJSON(this.tiles, function(typedef : any){
                var gid = instancedef.gid & ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);
                return typedef.id == gid - 1;
            });
            var entitydef : any = {};
            entitydef.type = typedef;
            entitydef.instance = instancedef;
            entitydef.flip = {};
            entitydef.flip.x = (instancedef.gid & (instancedef.gid & FLIPPED_HORIZONTALLY_FLAG)) != 0;
            entitydef.flip.y = (instancedef.gid & (instancedef.gid & FLIPPED_VERTICALLY_FLAG)) != 0;
            return entitydef;
        }

        private getTileType(id : number){
            var typedef = findInJSON(this.tiles, function(typedef : any){
                return typedef.id == id - 1;
            });
            if(typedef != null){
                return typedef.type;
            }
            return null;
        }

        protected onDrawSceneMap(){
            //this.drawLayers(this.defMap);
            
            for(var sprite of this.spritesBack){
                sprite.render();
            }
            this.spriteTerrain.render();
            for(var box of this.boxesSolids){
                box.render();
            }
            for(var box of this.boxesSticky){
                box.render();
            }
        }

        private buildTexture(def : any, back : boolean){
            if(def == null) return;
            var texture = back ? Resources.textureMapBack : Resources.textureMapTerrain;
            for(var layer of def.layers){
                if(layer.name.indexOf("Entities") >= 0 || layer.name.indexOf("Ignore") >= 0) continue;
                if(back && layer.name.indexOf("Repeat") < 0) continue;
                if(!back && layer.name.indexOf("Repeat") >= 0) continue;
                for(var yIndex = 0; yIndex < this.yCountTiles; yIndex += 1){
                    for(var xIndex = 0; xIndex < this.xCountTiles; xIndex += 1){
                        var indexTile = xIndex + yIndex * this.xCountTiles;
                        var data = layer.data[indexTile];
                        if(data == 0) continue;
                        data--;
                        var yPixTil = Math.floor(data / Math.floor(Resources.textureMiniCoinsTileset.assetData.xSize / (this.xSizeTile + this.offsetTiles)));
                        var xPixTil = data - (yPixTil * Math.floor(Resources.textureMiniCoinsTileset.assetData.ySize / (this.xSizeTile + this.offsetTiles)));
                        var xPixPut = this.offsetTiles + xPixTil * (this.xSizeTile + this.offsetTiles);
                        var yPixPut = this.offsetTiles + yPixTil * (this.xSizeTile + this.offsetTiles);
                        for(var xPix = 0; xPix < this.xSizeTile; xPix += 1){
                            for(var yPix = 0; yPix < this.ySizeTile; yPix += 1){
                                var alpha = Resources.textureMiniCoinsTileset.getAlpha(xPixPut + xPix, yPixPut + yPix);
                                if(alpha != 0){
                                    var red = Resources.textureMiniCoinsTileset.getRed(xPixPut + xPix, yPixPut + yPix);
                                    var green = Resources.textureMiniCoinsTileset.getGreen(xPixPut + xPix, yPixPut + yPix);
                                    var blue = Resources.textureMiniCoinsTileset.getBlue(xPixPut + xPix, yPixPut + yPix);
                                    var xmap = xIndex * this.xSizeTile + xPix + 1;
                                    var ymap = yIndex * this.xSizeTile + yPix + 1;
                                    texture.setRGBA(xmap, ymap, red, green, blue, alpha);
                                }
                            }
                        }
                    }
                }
            }
            for(var xPix = 0; xPix < this.xSizeMap + 1; xPix += 1){
                var red = texture.getRed(xPix, 1);
                var green = texture.getGreen(xPix, 1);
                var blue = texture.getBlue(xPix, 1);
                var alpha = texture.getAlpha(xPix, 1);
                texture.setRGBA(xPix, 0, red, green, blue, alpha);
                red = texture.getRed(xPix, this.ySizeMap);
                green = texture.getGreen(xPix, this.ySizeMap);
                blue = texture.getBlue(xPix, this.ySizeMap);
                alpha = texture.getAlpha(xPix, this.ySizeMap);
                texture.setRGBA(xPix, this.ySizeMap + 1, red, green, blue, alpha);
            }
            for(var yPix = 0; yPix < this.ySizeMap + 1; yPix += 1){
                var red = texture.getRed(1, yPix);
                var green = texture.getGreen(1, yPix);
                var blue = texture.getBlue(1, yPix);
                var alpha = texture.getAlpha(1, yPix);
                texture.setRGBA(0, yPix, red, green, blue, alpha);
                red = texture.getRed(this.xSizeMap, yPix);
                green = texture.getGreen(this.xSizeMap, yPix);
                blue = texture.getBlue(this.xSizeMap, yPix);
                alpha = texture.getAlpha(this.xSizeMap, yPix);
                texture.setRGBA(this.xSizeMap + 1, yPix, red, green, blue, alpha);
            }
            texture.renderAgain();
        }
    }
}
*/ 
///<reference path="../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    var BaseBackScene = /** @class */ (function (_super) {
        __extends(BaseBackScene, _super);
        function BaseBackScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return BaseBackScene;
    }(Game.SceneMap));
    Game.BaseBackScene = BaseBackScene;
})(Game || (Game = {}));
///<reference path="../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    var Y_COUNT_BUTTONS = 4;
    var Y_SIZE_BUTTON = 14;
    var Y_SPEARATION_BUTTONS = 4;
    var OFFSET_SINGLE = 7;
    var OFFSET_DOUBLE = 10;
    var Credits = /** @class */ (function (_super) {
        __extends(Credits, _super);
        function Credits() {
            var _this = _super.call(this) || this;
            _this.yButtons = -29.5 - 12;
            new Game.MusicButton();
            new Game.SoundButton();
            var dialog = new Game.CreditsFrame(0, -54 * 0.5 - 7 + 0.5 - 20 + 2 + 20 + 0.5 + 1 - 2);
            var noadev = new Utils.Text();
            noadev.font = Game.FontManager.a;
            noadev.scale = 1;
            noadev.enabled = true;
            noadev.pinned = true;
            noadev.str = "CREATED BY:";
            noadev.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            noadev.xAlignView = Utils.AnchorAlignment.MIDDLE;
            noadev.yAlignBounds = Utils.AnchorAlignment.START;
            noadev.yAlignView = Utils.AnchorAlignment.MIDDLE;
            //noadev.xAligned = 1.5;
            noadev.yAligned = dialog.sprite.y + 5;
            var noadev2 = new Utils.Text();
            noadev2.font = Game.FontManager.a;
            noadev2.scale = 1;
            noadev2.enabled = true;
            noadev2.pinned = true;
            noadev2.str = "ANDRES GONZALEZ (NOADEV)";
            noadev2.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            noadev2.xAlignView = Utils.AnchorAlignment.MIDDLE;
            noadev2.yAlignBounds = Utils.AnchorAlignment.START;
            noadev2.yAlignView = Utils.AnchorAlignment.MIDDLE;
            noadev2.yAligned = noadev.y + OFFSET_SINGLE;
            /*
            var musicCreator = new Utils.Text();
            musicCreator.font = FontManager.a;
            musicCreator.scale = 1;
            musicCreator.enabled = true;
            musicCreator.pinned = true;
            musicCreator.str = "CONCEPT AND GRAPHICS:";
            musicCreator.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            musicCreator.xAlignView = Utils.AnchorAlignment.MIDDLE;
            musicCreator.yAlignBounds = Utils.AnchorAlignment.START;
            musicCreator.yAlignView = Utils.AnchorAlignment.MIDDLE;
            //musicCreator.xAligned = 1.5;
            musicCreator.yAligned = noadev2.y + 11;

            var musicCreator2 = new Utils.Text();
            musicCreator2.font = FontManager.a;
            musicCreator2.scale = 1;
            musicCreator2.enabled = true;
            musicCreator2.pinned = true;
            musicCreator2.str = "OSCAR SANCHEZ (KALPAR)";
            musicCreator2.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            musicCreator2.xAlignView = Utils.AnchorAlignment.MIDDLE;
            musicCreator2.yAlignBounds = Utils.AnchorAlignment.START;
            musicCreator2.yAlignView = Utils.AnchorAlignment.MIDDLE;
            musicCreator2.yAligned = musicCreator.y + 8;
            */
            var behe = new Utils.Text();
            behe.font = Game.FontManager.a;
            behe.scale = 1;
            behe.enabled = true;
            behe.pinned = true;
            behe.str = "MUSIC:";
            behe.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            behe.xAlignView = Utils.AnchorAlignment.MIDDLE;
            behe.yAlignBounds = Utils.AnchorAlignment.START;
            behe.yAlignView = Utils.AnchorAlignment.MIDDLE;
            //behe.xAligned = 1.5;
            behe.yAligned = noadev2.y + OFFSET_DOUBLE;
            var behe2 = new Utils.Text();
            behe2.font = Game.FontManager.a;
            behe2.scale = 1;
            behe2.enabled = true;
            behe2.pinned = true;
            behe2.str = "KOMIKU";
            behe2.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            behe2.xAlignView = Utils.AnchorAlignment.MIDDLE;
            behe2.yAlignBounds = Utils.AnchorAlignment.START;
            behe2.yAlignView = Utils.AnchorAlignment.MIDDLE;
            behe2.xAligned = 0;
            behe2.yAligned = behe.y + OFFSET_SINGLE;
            var pepe = new Utils.Text();
            pepe.font = Game.FontManager.a;
            pepe.scale = 1;
            pepe.enabled = true;
            pepe.pinned = true;
            pepe.str = "THUMBNAIL:";
            pepe.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            pepe.xAlignView = Utils.AnchorAlignment.MIDDLE;
            pepe.yAlignBounds = Utils.AnchorAlignment.START;
            pepe.yAlignView = Utils.AnchorAlignment.MIDDLE;
            //behe.xAligned = 1.5;
            pepe.yAligned = behe2.y + OFFSET_DOUBLE;
            var pepe2 = new Utils.Text();
            pepe2.font = Game.FontManager.a;
            pepe2.scale = 1;
            pepe2.enabled = true;
            pepe2.pinned = true;
            pepe2.str = "NIELDACAN";
            pepe2.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            pepe2.xAlignView = Utils.AnchorAlignment.MIDDLE;
            pepe2.yAlignBounds = Utils.AnchorAlignment.START;
            pepe2.yAlignView = Utils.AnchorAlignment.MIDDLE;
            pepe2.xAligned = 0;
            pepe2.yAligned = pepe.y + OFFSET_SINGLE;
            _this.backButton = new Game.DialogButton(4, 0, 5 + _this.yButtons + 16 + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * Y_COUNT_BUTTONS + 2 - 7 - 0.5 - 4 - 0);
            _this.backButton.control.listener = _this;
            _this.backButton.text.font = Game.FontManager.a;
            _this.backButton.text.scale = 1;
            _this.backButton.text.enabled = true;
            _this.backButton.text.pinned = true;
            _this.backButton.text.str = "BACK";
            _this.backButton.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.backButton.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.xAligned = _this.backButton.dialog.sprite.x;
            _this.backButton.text.yAligned = _this.backButton.dialog.sprite.y;
            _this.backButton.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.arrows.yOffset -= 0.5;
            _this.backButton.control.useKeyboard = true;
            _this.backButton.control.keys = [Engine.Keyboard.ESC, "esc", "Esc", "ESC"];
            _this.backButton.control.onPressedDelegate = _this.backPressed;
            _this.backButton.control.onReleasedDelegate = _this.backReleased;
            //this.loadMap(Resources.PATH_MAP_NONE);
            //var x = Scene.xSizeLevel * 0.5;
            //var y = Scene.ySizeLevel * 0.5;
            //Engine.Renderer.camera(x, y);
            _this.loadMap(Game.Resources.PATH_MAP_CREDITS);
            Game.SceneColors.enabledDown = true;
            //this.loadSky(Resources.PATH_MAP_SKY);
            new Game.SmallButtonFrame();
            Game.SceneColors.instance.usingFill = true;
            Game.triggerActions("credits");
            return _this;
        }
        Credits.prototype.backPressed = function () {
            if (Game.Scene.nextSceneClass == null) {
                this.stepsWait = 0;
                this.nextSceneClass = Game.MainMenu;
            }
        };
        Credits.prototype.backReleased = function () {
            //    this.backButton.control.enabled = false;
        };
        Credits.prototype.onTimeUpdate = function () {
            Engine.Renderer.camera(Game.SceneMap.instance.xSizeMap * 0.5, Game.SceneMap.instance.ySizeMap * 0.5);
        };
        return Credits;
    }(Game.SceneMap));
    Game.Credits = Credits;
})(Game || (Game = {}));
///<reference path="../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    Game.TEXT_DESKTOP_CONTINUE_EXIT = "ESC OR CLICK HERE TO EXIT";
    var fra;
    Game.addAction("configure", function () {
        fra = Game.FrameSelector.complex("lastscene", Game.Resources.textureStilts, 0, 426);
    });
    Game.HAS_LINKS_NOADEV = true;
    var LastScene = /** @class */ (function (_super) {
        __extends(LastScene, _super);
        function LastScene() {
            var _this = _super.call(this) || this;
            LastScene.instance = _this;
            new Game.MusicButton();
            new Game.SoundButton();
            new Game.ExitButton();
            var hasLinks = Game.HAS_LINKS && Game.HAS_LINKS_NOADEV;
            var tha = new Game.Button();
            tha.bounds.enabled = tha.bounds.pinned = true;
            tha.anchor.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            tha.anchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            tha.anchor.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            tha.anchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            //Level.speedrun=true;
            //LevelSaveManager.hasSpeedrunRecord=true;
            //hasLinks=false;
            if (Game.Level.speedrun) {
                fra[Game.LevelSaveManager.hasSpeedrunRecord ? 3 : 4].applyToSprite(tha.bounds);
                tha.anchor.yAligned = -8;
                tha.control.enabled = false;
                var tex = new Game.TextButton();
                tex.control.listener = _this;
                tex.text.font = Game.FontManager.a;
                tex.text.scale = 1;
                tex.text.enabled = true;
                tex.text.pinned = true;
                tex.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
                tex.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
                tex.text.yAlignBounds = Utils.AnchorAlignment.START;
                tex.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
                tex.text.xAligned = 0.5;
                tex.text.yAligned = -20.5 + 10 + 4;
                tex.control.enabled = false;
                tex.text.str = Game.LevelSaveManager.hasSpeedrunRecord ? "NEW RECORD! " + Game.SpeedrunTimer.getTextValue(Game.recordSpeedrun) : "YOUR TIME! " + Game.SpeedrunTimer.getTextValue(Game.Level.countStepsSpeedrun);
            }
            else if (hasLinks) {
                fra[1].applyToSprite(tha.bounds);
                tha.anchor.yAligned = -8;
                tha.arrows.xOffset = -9;
                tha.arrows.xOffset2 = 1;
                tha.arrows.yOffset = 7 + 6;
                tha.control.url = Game.URL_NOADEV;
                tha.control.onSelectionStayDelegate = function () {
                    Engine.Renderer.useHandPointer = hasLinks;
                };
            }
            else {
                fra[2].applyToSprite(tha.bounds);
                tha.anchor.yAligned = -8;
                tha.control.enabled = false;
            }
            var exi = new Game.Button();
            exi.bounds.enabled = exi.bounds.pinned = true;
            fra[Game.IS_TOUCH ? 5 : 6].applyToSprite(exi.bounds);
            exi.anchor.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            exi.anchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            exi.anchor.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            exi.anchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            exi.anchor.xAligned = 0;
            exi.anchor.yAligned = 48;
            exi.arrows.xOffset = -9;
            exi.arrows.xOffset2 = 1;
            exi.arrows.yOffset = 7;
            _this.con = exi.control;
            _this.loadMap(Game.Resources.PATH_MAP_LAST);
            //var x = Scene.xSizeLevel * 0.5;
            //var y = Scene.ySizeLevel * 0.5;
            //Engine.Renderer.camera(x, y);
            //SceneColors.enabledDown = true;
            Game.triggerActions("endscreen");
            Game.LevelShake.init();
            new Game.LastButtonFrames();
            Game.ExitButton.instance.control.bounds = Game.LastButtonFrames.instance.sprite;
            new Game.LevelAdLoader();
            return _this;
        }
        LastScene.prototype.onReset = function () {
            _super.prototype.onReset.call(this);
        };
        LastScene.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
            if (Game.Scene.nextSceneClass == null && (Game.ExitButton.instance.control.pressed || this.con.pressed)) {
                Game.triggerActions("exitlastlevel");
                this.nextSceneClass = Game.MainMenu;
                this.stepsWait = Game.STEPS_CHANGE_SCENE;
            }
        };
        LastScene.prototype.onStartWaiting = function () {
            _super.prototype.onStartWaiting.call(this);
            if (Game.Scene.nextSceneClass == Game.MainMenu || Game.Scene.nextSceneClass == Game.LevelSelection || Game.Scene.nextSceneClass == Game.SpeedrunMenu) {
                //Resources.stopBGM();
            }
        };
        LastScene.prototype.onTimeUpdateSceneBeforeDrawFixed = function () {
            var x = this.xSizeMap * 0.5;
            var y = this.ySizeMap * 0.5;
            Engine.Renderer.camera(x + Game.LevelShake.position, y);
        };
        LastScene.prototype.onClearScene = function () {
            LastScene.instance = null;
        };
        LastScene.instance = null;
        return LastScene;
    }(Game.SceneMap));
    Game.LastScene = LastScene;
})(Game || (Game = {}));
///<reference path="../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    var X_COUNT_BUTTONS = 3;
    var Y_COUNT_BUTTONS = 3;
    var Y_SIZE_BUTTON = 14;
    var X_SPEARATION_BUTTONS = 42 + 2;
    var Y_SPEARATION_BUTTONS = 6;
    var X_SPEARATION_BUTTONS_2 = 49 + 1;
    Game.LEVELS_PER_PAGE = 9;
    Game.LEVELS_PAGES = 3;
    Game.MAX_LEVELS = 27; //LEVELS_PER_PAGE * LEVELS_PAGES;
    var LevelSelection = /** @class */ (function (_super) {
        __extends(LevelSelection, _super);
        function LevelSelection() {
            var _this = _super.call(this) || this;
            _this.buttons = new Array();
            _this.xButtons = -0.5 * (X_SPEARATION_BUTTONS) * (X_COUNT_BUTTONS - 1);
            _this.yButtons = -34 + 5 - 10 + 10 + 5 + 2;
            _this.yButtons2 = 5 - 5 - 2 - 0.5;
            LevelSelection.instance = _this;
            //Resources.playBGM();
            new Game.MusicButton();
            new Game.SoundButton();
            var selecttext = new Utils.Text();
            selecttext.font = Game.FontManager.a;
            selecttext.scale = 1;
            selecttext.enabled = true;
            selecttext.pinned = true;
            selecttext.str = "SELECT STAGE";
            selecttext.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            selecttext.xAlignView = Utils.AnchorAlignment.MIDDLE;
            selecttext.yAlignBounds = Utils.AnchorAlignment.START;
            selecttext.yAlignView = Utils.AnchorAlignment.MIDDLE;
            selecttext.xAligned = 0;
            selecttext.yAligned = -40 - 1 - 1 + 2 - 4;
            _this.createButtons();
            _this.fixButtons();
            //new ColorDialog("purple", 0, -19 + 6, 60, 27);
            _this.backButton = new Game.DialogButton(1, 0, 4 + _this.yButtons + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * (Y_COUNT_BUTTONS + 0) + 2 + _this.yButtons2);
            _this.backButton.control.listener = _this;
            _this.backButton.text.font = Game.FontManager.a;
            _this.backButton.text.scale = 1;
            _this.backButton.text.enabled = true;
            _this.backButton.text.pinned = true;
            _this.backButton.text.str = "BACK";
            _this.backButton.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.backButton.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.xAligned = _this.backButton.dialog.sprite.x;
            _this.backButton.text.yAligned = _this.backButton.dialog.sprite.y;
            _this.backButton.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            //this.backButton.arrows.yOffset -= 0.5;
            _this.backButton.control.useKeyboard = true;
            _this.backButton.control.keys = [Engine.Keyboard.ESC, "esc", "Esc", "ESC"];
            _this.backButton.control.onPressedDelegate = _this.backPressed;
            _this.backButton.control.onReleasedDelegate = _this.backReleased;
            _this.switchButton = new Game.DialogButton(1, X_SPEARATION_BUTTONS_2, 4 + _this.yButtons + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * Y_COUNT_BUTTONS + 2 + _this.yButtons2);
            _this.switchButton.control.listener = _this;
            _this.switchButton.text.font = Game.FontManager.a;
            _this.switchButton.text.scale = 1;
            _this.switchButton.text.enabled = true;
            _this.switchButton.text.pinned = true;
            _this.switchButton.text.str = ">";
            _this.switchButton.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.switchButton.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.switchButton.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.switchButton.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.switchButton.text.xAligned = _this.switchButton.dialog.sprite.x;
            _this.switchButton.text.yAligned = _this.switchButton.dialog.sprite.y;
            _this.switchButton.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            //this.switchButton.arrows.yOffset -= 0.5;
            _this.switchButton.arrows.enabled = false;
            _this.switchButton.control.onSelectionStartDelegate = _this.switchEnter;
            _this.switchButton.control.onSelectionEndDelegate = _this.switchExit;
            _this.switchButton.control.onPressedDelegate = _this.switchPress;
            _this.switchButton2 = new Game.DialogButton(1, -X_SPEARATION_BUTTONS_2, 4 + _this.yButtons + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * Y_COUNT_BUTTONS + 2 + _this.yButtons2);
            _this.switchButton2.control.listener = _this;
            _this.switchButton2.text.font = Game.FontManager.a;
            _this.switchButton2.text.scale = 1;
            _this.switchButton2.text.enabled = true;
            _this.switchButton2.text.pinned = true;
            _this.switchButton2.text.str = "<";
            _this.switchButton2.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.switchButton2.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.switchButton2.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.switchButton2.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.switchButton2.text.xAligned = _this.switchButton2.dialog.sprite.x;
            _this.switchButton2.text.yAligned = _this.switchButton2.dialog.sprite.y;
            _this.switchButton2.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            //this.switchButton2.arrows.yOffset -= 0.5;
            _this.switchButton2.arrows.enabled = false;
            _this.switchButton2.control.onSelectionStartDelegate = _this.switchEnter2;
            _this.switchButton2.control.onSelectionEndDelegate = _this.switchExit2;
            _this.switchButton2.control.onPressedDelegate = _this.switchPress2;
            //this.fillBlue.enabled = true;
            //this.loadSky(Resources.PATH_MAP_SKY);
            new Game.SmallButtonFrame();
            _this.loadMap(Game.Resources.PATH_MAP_CREDITS);
            Game.SceneColors.instance.usingFill = true;
            Game.triggerActions("levelselectionmenu");
            Game.triggerActions("levelselection");
            new Game.LogoButtonFrameLeft();
            new Game.LogoButtonFrameRight();
            return _this;
        }
        LevelSelection.prototype.createButtons = function () {
            var count = 0;
            for (var yIndex = 0; yIndex < Y_COUNT_BUTTONS; yIndex += 1) {
                for (var xIndex = 0; xIndex < X_COUNT_BUTTONS; xIndex += 1) {
                    var x = this.xButtons + (X_SPEARATION_BUTTONS) * xIndex;
                    var y = this.yButtons + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * yIndex;
                    this.buttons[count] = new Game.DialogButton(1, x, y);
                    this.buttons[count].owner = this;
                    this.buttons[count].control.listener = this.buttons[count];
                    //this.buttons[count].control.audioPressed = Resources.sfxMouseLevel;
                    this.buttons[count].text.font = Game.FontManager.a;
                    this.buttons[count].text.scale = 1;
                    this.buttons[count].text.enabled = true;
                    this.buttons[count].text.pinned = true;
                    this.buttons[count].text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
                    this.buttons[count].text.xAlignView = Utils.AnchorAlignment.MIDDLE;
                    this.buttons[count].text.yAlignBounds = Utils.AnchorAlignment.START;
                    this.buttons[count].text.yAlignView = Utils.AnchorAlignment.MIDDLE;
                    this.buttons[count].text.xAligned = this.buttons[count].dialog.sprite.x;
                    this.buttons[count].text.yAligned = this.buttons[count].dialog.sprite.y;
                    this.buttons[count].text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
                    //this.buttons[count].arrows.yOffset -= 0.5;
                    this.buttons[count].control.onPressedDelegate = function () {
                        this.owner.setLevel(+this.text.str);
                    };
                    this.buttons[count].control.onReleasedDelegate = function () {
                        //    (this as any as DialogButton).control.enabled = false;
                    };
                    count += 1;
                }
            }
        };
        LevelSelection.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
        };
        LevelSelection.prototype.onTimeUpdate = function () {
            Engine.Renderer.camera(Game.SceneMap.instance.xSizeMap * 0.5, Game.SceneMap.instance.ySizeMap * 0.5);
        };
        LevelSelection.prototype.fixButtons = function () {
            var count = 1 + LevelSelection.indexPage * Game.LEVELS_PER_PAGE;
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var button = _a[_i];
                if (count <= Game.MAX_LEVELS) {
                    button.enabled = true;
                    button.text.str = count + "";
                    switch (Game.dataLevels[count]) {
                        case "locked":
                            //button.enabled = false;
                            //button.dialog.enabled = false;
                            button.control.enabled = false;
                            button.dialog.setIndex(3);
                            button.dialog.sprite.setRGBA(1, 1, 1, 0);
                            button.text.font = Game.FontManager.a;
                            button.text.setRGBA(1, 1, 1, 0.5);
                            break;
                        case "unlocked":
                            button.enabled = true;
                            button.control.enabled = true;
                            button.dialog.setIndex(3);
                            button.dialog.sprite.setRGBA(1, 1, 1, 1);
                            button.text.font = Game.FontManager.a;
                            button.text.setRGBA(1, 1, 1, 1);
                            break;
                        case "cleared":
                            button.enabled = true;
                            button.control.enabled = true;
                            button.dialog.setIndex(2);
                            button.dialog.sprite.setRGBA(1, 1, 1, 1);
                            button.text.font = Game.FontManager.a;
                            button.text.setRGBA(1, 1, 1, 1);
                            break;
                    }
                    count += 1;
                }
                else {
                    button.enabled = false;
                }
            }
        };
        LevelSelection.unlockAllLevels = function () {
            for (var indexLevel = 1; indexLevel <= Game.MAX_LEVELS; indexLevel += 1) {
                if (Game.dataLevels[indexLevel] == "locked") {
                    Game.dataLevels[indexLevel] = "unlocked";
                    Engine.Data.save("level" + indexLevel, "unlocked", 60);
                }
            }
            if (LevelSelection.instance != null) {
                LevelSelection.instance.fixButtons();
            }
        };
        LevelSelection.prototype.setLevel = function (index) {
            if (this.nextSceneClass == null) {
                Game.Level.speedrun = false;
                Game.Level.nextIndex = index;
                this.stepsWait = Game.STEPS_CHANGE_SCENE;
                this.nextSceneClass = Game.Level;
                for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                    var button = _a[_i];
                    if (button.text.str != index + "") {
                        button.control.enabled = false;
                    }
                }
                this.backButton.control.enabled = false;
                this.switchButton.control.enabled = false;
                this.switchButton2.control.enabled = false;
                Game.triggerActions("playlevelbutton");
                Game.triggerActions("play");
            }
        };
        LevelSelection.prototype.onStartWaiting = function () {
            _super.prototype.onStartWaiting.call(this);
            if (Game.Scene.nextSceneClass == Game.Level) {
                //Resources.stopBGM();
            }
        };
        LevelSelection.prototype.backPressed = function () {
            if (this.nextSceneClass == null) {
                this.stepsWait = 0;
                this.nextSceneClass = Game.MainMenu;
                for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                    var button = _a[_i];
                    button.control.enabled = false;
                }
                this.switchButton.control.enabled = false;
                this.switchButton2.control.enabled = false;
            }
        };
        LevelSelection.prototype.backReleased = function () {
            //    this.backButton.control.enabled = false;
        };
        LevelSelection.prototype.switchEnter = function () {
            this.switchButton.text.str = ">>>";
        };
        LevelSelection.prototype.switchExit = function () {
            this.switchButton.text.str = ">";
        };
        LevelSelection.prototype.switchPress = function () {
            LevelSelection.indexPage += 1;
            if (LevelSelection.indexPage >= Game.LEVELS_PAGES) {
                LevelSelection.indexPage = 0;
            }
            this.fixButtons();
            this.switchButton.text.str = ">>>";
        };
        LevelSelection.prototype.switchEnter2 = function () {
            this.switchButton2.text.str = "<<<";
        };
        LevelSelection.prototype.switchExit2 = function () {
            this.switchButton2.text.str = "<";
        };
        LevelSelection.prototype.switchPress2 = function () {
            LevelSelection.indexPage -= 1;
            if (LevelSelection.indexPage < 0) {
                LevelSelection.indexPage = Game.LEVELS_PAGES - 1;
            }
            this.fixButtons();
            this.switchButton2.text.str = "<<<";
        };
        LevelSelection.prototype.onClearScene = function () {
            LevelSelection.instance = null;
        };
        LevelSelection.instance = null;
        LevelSelection.indexPage = 0;
        return LevelSelection;
    }(Game.SceneMap));
    Game.LevelSelection = LevelSelection;
})(Game || (Game = {}));
function unlockAllLevels() {
    Game.LevelSelection.unlockAllLevels();
}
///<reference path="../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    var PLAYED = false;
    Game.MAIN_MENU_OFFSET_A = 0;
    Game.MAIN_MENU_OFFSET_B = 0;
    var MainMenu = /** @class */ (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            var _this = _super.call(this) || this;
            _this.linkChecked = false;
            _this.linkChecked2 = 0;
            if (!PLAYED) {
                Game.Resources.playBGM();
                PLAYED = true;
            }
            new Game.MusicButton();
            new Game.SoundButton();
            Game.TryCreatePlaystoreButton();
            _this.start = new Game.TextButton();
            _this.start.control.listener = _this;
            _this.start.text.font = Game.FontManager.a;
            _this.start.text.scale = 1;
            _this.start.text.enabled = true;
            _this.start.text.pinned = true;
            _this.start.text.str = "START";
            _this.start.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.start.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.start.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.start.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.start.control.onPressedDelegate = _this.startPressed;
            _this.start.control.onReleasedDelegate = _this.startReleased;
            _this.speedrun = new Game.TextButton();
            _this.speedrun.control.listener = _this;
            _this.speedrun.text.font = Game.FontManager.a;
            _this.speedrun.text.scale = 1;
            _this.speedrun.text.enabled = true;
            _this.speedrun.text.pinned = true;
            _this.speedrun.text.str = "SPEEDRUN";
            _this.speedrun.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.speedrun.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.speedrun.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.speedrun.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.speedrun.control.onPressedDelegate = _this.speedrunPressed;
            _this.speedrun.control.onReleasedDelegate = _this.speedrunReleased;
            _this.credits = new Game.TextButton();
            _this.credits.control.listener = _this;
            _this.credits.text.font = Game.FontManager.a;
            _this.credits.text.scale = 1;
            _this.credits.text.enabled = true;
            _this.credits.text.pinned = true;
            _this.credits.text.str = "CREDITS";
            _this.credits.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.credits.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.credits.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.credits.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.credits.control.onPressedDelegate = _this.creditsPressed;
            _this.credits.control.onReleasedDelegate = _this.creditsReleased;
            if (Game.HAS_LINKS) {
                _this.moregames = new Game.TextButton();
                _this.moregames.control.listener = _this;
                _this.moregames.control.url = null;
                _this.moregames.control.onSelectionStayDelegate = function () {
                    Engine.Renderer.useHandPointer = true;
                };
                _this.moregames.text.font = Game.FontManager.a;
                _this.moregames.text.scale = 1;
                _this.moregames.text.enabled = true;
                _this.moregames.text.pinned = true;
                _this.moregames.text.str = Game.TEXT_MORE_GAMES;
                _this.moregames.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
                _this.moregames.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
                _this.moregames.text.yAlignBounds = Utils.AnchorAlignment.START;
                _this.moregames.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
                //this.moregames.text.setUnderlineShadowColor(0, 0, 252 / 255, 1);
            }
            if (true || Game.IS_TOUCH) {
                //var xsize = 60;
                //var ysize = 15;
                var ypos = -12 + 6 + 4 + 8 - 8 - 1 + 3 + 0.5 + 3 + 1 - 1 + Game.MAIN_MENU_OFFSET_A + Game.MAIN_MENU_OFFSET_B;
                var yoff = 20;
                var xpos = 0;
                var xoff = 29.5;
                if (Game.HAS_LINKS) {
                    //this.starttouch = new ButtonFrame(0, xpos - xoff, ypos);
                    //this.moregamestouch = new ButtonFrame(0, xpos + xoff, ypos);
                    //this.speedruntouch = new ButtonFrame(0, xpos - xoff, ypos + yoff);
                    //this.creditstouch = new ButtonFrame(0, xpos + xoff, ypos + yoff);
                    _this.starttouch = new Game.ButtonFrame(0, xpos - xoff, ypos);
                    _this.speedruntouch = new Game.ButtonFrame(0, xpos + xoff, ypos);
                    _this.creditstouch = new Game.ButtonFrame(0, xpos - xoff, ypos + yoff);
                    _this.moregamestouch = new Game.ButtonFrame(0, xpos + xoff, ypos + yoff);
                }
                else {
                    _this.starttouch = new Game.ButtonFrame(0, xpos - xoff, ypos);
                    _this.speedruntouch = new Game.ButtonFrame(0, xpos + xoff, ypos);
                    _this.creditstouch = new Game.ButtonFrame(0, 0, ypos + yoff);
                }
                _this.start.text.xAligned = _this.starttouch.sprite.x;
                _this.start.text.yAligned = _this.starttouch.sprite.y;
                _this.start.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
                _this.start.control.bounds = _this.starttouch.sprite;
                //this.start.arrows.yOffset -= 0.5;
                _this.speedrun.text.xAligned = _this.speedruntouch.sprite.x;
                _this.speedrun.text.yAligned = _this.speedruntouch.sprite.y;
                _this.speedrun.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
                _this.speedrun.control.bounds = _this.speedruntouch.sprite;
                //this.speedrun.arrows.yOffset -= 0.5;
                _this.credits.text.xAligned = _this.creditstouch.sprite.x;
                _this.credits.text.yAligned = _this.creditstouch.sprite.y;
                _this.credits.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
                _this.credits.control.bounds = _this.creditstouch.sprite;
                //this.credits.arrows.yOffset -= 0.5;
                if (Game.HAS_LINKS) {
                    _this.moregames.text.xAligned = _this.moregamestouch.sprite.x;
                    _this.moregames.text.yAligned = _this.moregamestouch.sprite.y;
                    _this.moregames.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
                    _this.moregames.control.bounds = _this.moregamestouch.sprite;
                    //this.moregames.arrows.yOffset -= 0.5;
                }
                _this.loadMap(Game.Resources.PATH_MAP_MAIN_MENU);
            }
            /*if(dataLevels[30] == "cleared" || recordSpeedrun > 0){
                this.time = new Utils.Text;
                this.time.font = FontManager.a;
                this.time.scale = 1;
                this.time.enabled = true;
                this.time.pinned = true;
                this.time.str = "BEST: " + SpeedrunTimer.getTextValue(recordSpeedrun);
                this.time.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
                this.time.xAlignView = Utils.AnchorAlignment.MIDDLE;
                this.time.yAlignBounds = Utils.AnchorAlignment.END;
                this.time.yAlignView = Utils.AnchorAlignment.MIDDLE;
                this.time.yAligned = 60 + ((IS_TOUCH && !HAS_LINKS) ? -3 : -6);
            }
            else{*/
            /*
            this.noadev = new TextButton();
            this.noadev.control.listener = this;
            this.noadev.control.enabled = HAS_LINKS;
            this.noadev.control.url = null;
            this.noadev.control.onSelectionStayDelegate = ()=>{
                Engine.Renderer.useHandPointer = HAS_LINKS;
            }
            this.noadev.text.font = FontManager.c;
            this.noadev.text.scale = 1;
            this.noadev.text.enabled = true;
            this.noadev.text.pinned = true;
            this.noadev.text.str = HAS_LINKS ? Game.TEXT_NOADEV : "BY NOADEV AND KALPAR";
            this.noadev.text.underlined = HAS_LINKS;
            //this.noadev.text.setUnderlineShadowColor(0, 0, 0, 1);
            this.noadev.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            this.noadev.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            this.noadev.text.yAlignBounds = Utils.AnchorAlignment.END;
            this.noadev.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            this.noadev.text.yAligned = 60 + 20 - 6 + 2 + (((true || IS_TOUCH) && false) ? -3 : -6);
            //this.noadev.arrows.enabled = false;
            */
            //}
            //new ColorDialog("normal", 0, this.noadev.text.yAligned - 8 - 6 + 3 - 1 + 1, 58, 15);
            var x = _this.xSizeMap * 0.5;
            var y = _this.ySizeMap * 0.5;
            Engine.Renderer.camera(x, y);
            //this.fillBlue.enabled = true;
            //this.loadSky(Resources.PATH_MAP_SKY);
            new Game.TitleFrame(-31 + 1 - 4.5 - 4 + 2 + 1 - 1 + Game.MAIN_MENU_OFFSET_A, 0);
            new Game.SmallButtonFrame();
            Game.triggerActions("mainmenu");
            new Game.LogoButtonFrameLeft();
            new Game.LogoButtonFrameRight();
            Game.SceneColors.instance.usingFill = true;
            return _this;
        }
        MainMenu.prototype.onStartWaiting = function () {
            _super.prototype.onStartWaiting.call(this);
            if (Game.Scene.nextSceneClass == Game.Level) {
                //Resources.stopBGM();
            }
            if (Game.LevelAds.tryTriggerSpeedrunAd()) {
                this.stepsWait = Game.STEPS_CHANGE_SCENE_AD;
            }
        };
        MainMenu.prototype.startPressed = function () {
            if (this.nextSceneClass == null) {
                this.speedrun.control.enabled = false;
                this.credits.control.enabled = false;
                if (Game.HAS_LINKS) {
                    this.moregames.control.enabled = false;
                }
                this.stepsWait = 0;
                this.nextSceneClass = Game.LevelSelection;
                Game.SceneFade.setColor(234, 247, 196);
                Game.triggerActions("playbutton");
            }
        };
        MainMenu.prototype.startReleased = function () {
            //    this.start.control.enabled = false;
        };
        MainMenu.prototype.speedrunPressed = function () {
            if (this.nextSceneClass == null) {
                this.start.control.enabled = false;
                this.speedrun.control.enabled = false;
                if (Game.HAS_LINKS) {
                    this.moregames.control.enabled = false;
                }
                this.stepsWait = 0;
                this.nextSceneClass = Game.SpeedrunMenu;
                Game.SceneFade.setColor(234, 247, 196);
                Game.triggerActions("playbutton");
            }
        };
        MainMenu.prototype.speedrunReleased = function () {
            //    this.speedrun.control.enabled = false;
        };
        MainMenu.prototype.creditsPressed = function () {
            if (this.nextSceneClass == null) {
                this.start.control.enabled = false;
                this.speedrun.control.enabled = false;
                if (Game.HAS_LINKS) {
                    this.moregames.control.enabled = false;
                }
                this.stepsWait = 0;
                this.nextSceneClass = Game.Credits;
                Game.SceneFade.setColor(234, 247, 196);
            }
        };
        MainMenu.prototype.creditsReleased = function () {
            //    this.credits.control.enabled = false;
        };
        MainMenu.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
        };
        MainMenu.prototype.onTimeUpdate = function () {
            Engine.Renderer.camera(Game.SceneMap.instance.xSizeMap * 0.5, Game.SceneMap.instance.ySizeMap * 0.5);
            if (this.linkChecked && this.linkChecked2 < 0.25) {
                this.linkChecked2 += Engine.System.deltaTime;
                if (this.linkChecked2 >= 0.25) {
                    //this.noadev.control.url = HAS_LINKS ? URL_NOADEV : null;
                    this.moregames.control.url = Game.URL_MORE_GAMES;
                }
            }
            if (!this.linkChecked && !Engine.Mouse.down(0) && !Engine.TouchInput.down(0, 0, Engine.Renderer.xSizeWindow, Engine.Renderer.ySizeWindow, false)) {
                this.linkChecked = true;
            }
        };
        return MainMenu;
    }(Game.SceneMap));
    Game.MainMenu = MainMenu;
})(Game || (Game = {}));
///<reference path="../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    var Y_COUNT_BUTTONS = 4;
    var X_SIZE_BUTTON = 45;
    var Y_SIZE_BUTTON = 14;
    var X_SPEARATION_BUTTONS = -0.5;
    var Y_SPEARATION_BUTTONS = 4;
    var OFFSET_SINGLE = 7;
    var OFFSET_DOUBLE = 10;
    var SpeedrunMenu = /** @class */ (function (_super) {
        __extends(SpeedrunMenu, _super);
        function SpeedrunMenu() {
            var _this = _super.call(this) || this;
            _this.yButtons = -29.5 - 3 - 1 - 1 - 1 - 1 + 5 + 2 + 1 - 1 + 4;
            //Resources.playBGM(0);
            new Game.MusicButton();
            new Game.SoundButton();
            var yPepe = -54 * 0.5 - 7 + 0.5 - 20 + 2 + 20 + 0.5 + 1 - 2 - 1;
            new Game.SpeedrunFrame(0, yPepe);
            var recordA = new Utils.Text();
            recordA.font = Game.FontManager.a;
            recordA.scale = 1;
            recordA.enabled = true;
            recordA.pinned = true;
            recordA.str = "BEST TIME:";
            recordA.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            recordA.xAlignView = Utils.AnchorAlignment.MIDDLE;
            recordA.yAlignBounds = Utils.AnchorAlignment.START;
            recordA.yAlignView = Utils.AnchorAlignment.MIDDLE;
            recordA.xAligned = 0;
            recordA.yAligned = yPepe + 5;
            var recordB = new Utils.Text();
            recordB.font = Game.FontManager.a;
            recordB.scale = 1;
            recordB.enabled = true;
            recordB.pinned = true;
            recordB.str = Game.SpeedrunTimer.getTextValue(Game.recordSpeedrun);
            recordB.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            recordB.xAlignView = Utils.AnchorAlignment.MIDDLE;
            recordB.yAlignBounds = Utils.AnchorAlignment.START;
            recordB.yAlignView = Utils.AnchorAlignment.MIDDLE;
            recordB.xAligned = 0;
            recordB.yAligned = recordA.y + OFFSET_SINGLE;
            var timeA = new Utils.Text();
            timeA.font = Game.FontManager.a;
            timeA.scale = 1;
            timeA.enabled = true;
            timeA.pinned = true;
            timeA.str = "CURRENT TIME:";
            timeA.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            timeA.xAlignView = Utils.AnchorAlignment.MIDDLE;
            timeA.yAlignBounds = Utils.AnchorAlignment.START;
            timeA.yAlignView = Utils.AnchorAlignment.MIDDLE;
            timeA.xAligned = 0;
            timeA.yAligned = recordB.y + OFFSET_DOUBLE;
            var timeB = new Utils.Text();
            timeB.font = Game.FontManager.a;
            timeB.scale = 1;
            timeB.enabled = true;
            timeB.pinned = true;
            timeB.str = Game.dataSpeedrun == 0 ? "0.000" : Game.SpeedrunTimer.getTextValue(Game.dataSpeedrun);
            timeB.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            timeB.xAlignView = Utils.AnchorAlignment.MIDDLE;
            timeB.yAlignBounds = Utils.AnchorAlignment.START;
            timeB.yAlignView = Utils.AnchorAlignment.MIDDLE;
            timeB.xAligned = 0;
            timeB.yAligned = timeA.y + OFFSET_SINGLE;
            var levelA = new Utils.Text();
            levelA.font = Game.FontManager.a;
            levelA.scale = 1;
            levelA.enabled = true;
            levelA.pinned = true;
            levelA.str = "CURRENT LEVEL:";
            levelA.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            levelA.xAlignView = Utils.AnchorAlignment.MIDDLE;
            levelA.yAlignBounds = Utils.AnchorAlignment.START;
            levelA.yAlignView = Utils.AnchorAlignment.MIDDLE;
            levelA.xAligned = 0;
            levelA.yAligned = timeB.y + OFFSET_DOUBLE;
            var levelB = new Utils.Text();
            levelB.font = Game.FontManager.a;
            levelB.scale = 1;
            levelB.enabled = true;
            levelB.pinned = true;
            levelB.str = Game.levelSpeedrun + "";
            levelB.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            levelB.xAlignView = Utils.AnchorAlignment.MIDDLE;
            levelB.yAlignBounds = Utils.AnchorAlignment.START;
            levelB.yAlignView = Utils.AnchorAlignment.MIDDLE;
            levelB.xAligned = 0;
            levelB.yAligned = levelA.y + OFFSET_SINGLE;
            _this.newButton = new Game.DialogButton(5, -X_SIZE_BUTTON - 5 - X_SPEARATION_BUTTONS, _this.yButtons + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * Y_COUNT_BUTTONS + 2 - 7 - 0.5);
            _this.newButton.control.listener = _this;
            //this.newButton.control.audioPressed = Resources.sfxMouseLevel;
            _this.newButton.text.font = Game.FontManager.a;
            _this.newButton.text.scale = 1;
            _this.newButton.text.enabled = true;
            _this.newButton.text.pinned = true;
            _this.newButton.text.str = "NEW RUN";
            _this.newButton.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.newButton.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.newButton.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.newButton.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.newButton.text.xAligned = _this.newButton.dialog.sprite.x;
            _this.newButton.text.yAligned = _this.newButton.dialog.sprite.y;
            _this.newButton.control.onPressedDelegate = _this.newPressed;
            _this.newButton.control.onReleasedDelegate = _this.newReleased;
            _this.newButton.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            //this.newButton.arrows.yOffset -= 0.5;
            _this.continueButton = new Game.DialogButton(5, 0, _this.yButtons + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * Y_COUNT_BUTTONS + 2 - 7 - 0.5);
            _this.continueButton.control.enabled = Game.dataSpeedrun > 0;
            _this.continueButton.control.listener = _this;
            //this.continueButton.control.audioPressed = Resources.sfxMouseLevel;
            _this.continueButton.text.font = Game.dataSpeedrun > 0 ? Game.FontManager.a : Game.FontManager.a;
            _this.continueButton.text.scale = 1;
            _this.continueButton.text.enabled = true;
            _this.continueButton.text.pinned = true;
            _this.continueButton.text.str = "RESUME";
            _this.continueButton.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.continueButton.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.continueButton.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.continueButton.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.continueButton.text.xAligned = _this.continueButton.dialog.sprite.x;
            _this.continueButton.text.yAligned = _this.continueButton.dialog.sprite.y;
            _this.continueButton.control.onPressedDelegate = _this.continuePressed;
            _this.continueButton.control.onReleasedDelegate = _this.continueReleased;
            _this.continueButton.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            //this.continueButton.arrows.yOffset -= 0.5;
            if (Game.dataSpeedrun == 0) {
                _this.continueButton.dialog.sprite.setRGBA(1, 1, 1, 0);
                _this.continueButton.text.setRGBA(1, 1, 1, 0.5);
            }
            _this.backButton = new Game.DialogButton(5, X_SIZE_BUTTON + 5 + X_SPEARATION_BUTTONS, _this.yButtons + (Y_SIZE_BUTTON + Y_SPEARATION_BUTTONS) * Y_COUNT_BUTTONS + 2 - 7 - 0.5);
            _this.backButton.control.listener = _this;
            _this.backButton.text.font = Game.FontManager.a;
            _this.backButton.text.scale = 1;
            _this.backButton.text.enabled = true;
            _this.backButton.text.pinned = true;
            _this.backButton.text.str = "BACK";
            _this.backButton.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.backButton.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.backButton.text.xAligned = _this.backButton.dialog.sprite.x;
            _this.backButton.text.yAligned = _this.backButton.dialog.sprite.y;
            _this.backButton.control.useKeyboard = true;
            _this.backButton.control.keys = [Engine.Keyboard.ESC, "esc", "Esc", "ESC"];
            _this.backButton.control.onPressedDelegate = _this.backPressed;
            _this.backButton.control.onReleasedDelegate = _this.backReleased;
            _this.backButton.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            //this.backButton.arrows.yOffset -= 0.5;
            _this.loadMap(Game.Resources.PATH_MAP_CREDITS);
            //var x = Scene.xSizeLevel * 0.5;
            //var y = Scene.ySizeLevel * 0.5;
            //Engine.Renderer.camera(x, y);
            Game.SceneColors.enabledDown = true;
            //this.loadSky(Resources.PATH_MAP_SKY);
            new Game.SmallButtonFrame();
            Game.SceneColors.instance.usingFill = true;
            Game.triggerActions("speedrummenu");
            Game.triggerActions("levelselection");
            return _this;
        }
        SpeedrunMenu.prototype.onStartWaiting = function () {
            _super.prototype.onStartWaiting.call(this);
            if (Game.Scene.nextSceneClass == Game.Level) {
                //Resources.stopBGM();
            }
        };
        SpeedrunMenu.prototype.startSpeedrun = function (isNew) {
            Game.Level.speedrun = true;
            Game.Level.countStepsSpeedrun = isNew ? 0 : Game.dataSpeedrun;
            Game.LevelSaveManager.hasSpeedrunRecord = false;
            Game.Level.nextIndex = isNew ? 1 : Game.levelSpeedrun;
            this.stepsWait = Game.STEPS_CHANGE_SCENE;
            this.nextSceneClass = Game.Level;
            Game.SceneFade.setColor(234, 247, 196);
            Game.triggerActions("playlevelbutton");
            Game.triggerActions("play");
        };
        SpeedrunMenu.prototype.newPressed = function () {
            if (Game.Scene.nextSceneClass == null) {
                this.startSpeedrun(true);
                this.continueButton.control.enabled = false;
                this.backButton.control.enabled = false;
            }
        };
        SpeedrunMenu.prototype.newReleased = function () {
            //    this.backButton.control.enabled = false;
        };
        SpeedrunMenu.prototype.continuePressed = function () {
            if (Game.Scene.nextSceneClass == null) {
                this.startSpeedrun(false);
                this.newButton.control.enabled = false;
                this.backButton.control.enabled = false;
            }
        };
        SpeedrunMenu.prototype.continueReleased = function () {
            //    this.backButton.control.enabled = false;
        };
        SpeedrunMenu.prototype.backPressed = function () {
            if (Game.Scene.nextSceneClass == null) {
                this.stepsWait = 0;
                this.nextSceneClass = Game.MainMenu;
                this.newButton.control.enabled = false;
                this.continueButton.control.enabled = false;
            }
        };
        SpeedrunMenu.prototype.backReleased = function () {
            //    this.backButton.control.enabled = false;
        };
        SpeedrunMenu.prototype.onTimeUpdate = function () {
            Engine.Renderer.camera(Game.SceneMap.instance.xSizeMap * 0.5, Game.SceneMap.instance.ySizeMap * 0.5);
        };
        return SpeedrunMenu;
    }(Game.SceneMap));
    Game.SpeedrunMenu = SpeedrunMenu;
})(Game || (Game = {}));
/*
this.speedrunPressed;
speedrunPressed(){
            if(this.nextSceneClass == null){

                
            }
        }
        
        */ 
///<reference path="../../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    var Level = /** @class */ (function (_super) {
        __extends(Level, _super);
        function Level() {
            var _this = _super.call(this) || this;
            _this.exiting = false;
            _this.bgmIndex = 0;
            _this.fadeSound = false;
            Level.instance = _this;
            Level.index = Level.nextIndex;
            Level.nextIndex = Level.index + 1;
            Game.SceneColors.instance.fillDown.setRGBA(0, 0, 0, 1);
            //Engine.Renderer.clearColor(0 , 0, 0);
            new Game.BigButtonFrame();
            new Game.PauseButton();
            new Game.MusicButton();
            new Game.SoundButton();
            new Game.ResetButton();
            new Game.ExitButton();
            //if(Level.index < 8 || Level.index > 11){
            new Game.LevelText();
            //}
            if (Level.speedrun) {
                new Game.SpeedrunTimer();
            }
            Game.LevelShake.init();
            Game.LevelPauseUI.init();
            Game.LevelAds.init();
            Game.LevelSaveManager.init();
            Game.triggerActions("level");
            _this.loadMap(Game.getPathLevel(Level.index));
            //this.loadMap(getPathLevel(1));
            //this.loadMap(Resources.PATH_LEVEL_TEST);
            switch (Level.index) {
                default:
                    //this.loadSky(Resources.PATH_MAP_NONE);
                    break;
            }
            if (Level.index == 1) {
                //new PushTutorial();
            }
            else if (Level.index == 2) {
                //new JumpTutorial();
            }
            else if (Level.index == 5) {
                //new StuckTutorial();
            }
            new Game.LevelAdLoader();
            //new LogoButtonFrameLeft();
            new Game.LogoButtonFrameRight();
            return _this;
        }
        Level.prototype.onReset = function () {
            _super.prototype.onReset.call(this);
            //triggerActions("play");
        };
        Level.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
            if (this.nextSceneClass == null && Game.Player.instance.hasWon) {
                if (Level.index == Game.MAX_LEVELS) {
                    this.stepsWait = Game.STEPS_CHANGE_SCENE;
                    this.nextSceneClass = Game.LastScene;
                    Game.triggerActions("winlastlevel");
                }
                else {
                    this.nextSceneClass = Level;
                    Game.triggerActions("playlevelbutton");
                    Game.triggerActions("winlevel");
                }
                Game.triggerActions("lose");
            }
            if (this.nextSceneClass == null && Game.Player.instance.hasLost) {
                this.nextSceneClass = "reset";
                this.stepsWait = 0;
                Game.triggerActions("loselevel");
                Game.triggerActions("lose");
            }
            if (Game.ResetButton.instance != null && Game.ResetButton.instance.control.pressed && Game.Scene.nextSceneClass != "reset" && !this.exiting) {
                this.nextSceneClass = "reset";
                this.stepsWait = 0;
                Game.triggerActions("resetlevelbutton");
                Game.triggerActions("resetlevel");
                Game.triggerActions("lose");
            }
            if (Game.ExitButton.instance.control.pressed && !this.exiting) {
                this.stepsWait = Game.STEPS_CHANGE_SCENE;
                if (Level.speedrun) {
                    this.nextSceneClass = Game.SpeedrunMenu;
                }
                else {
                    this.nextSceneClass = Game.LevelSelection;
                }
                this.stepsWait = Game.STEPS_CHANGE_SCENE;
                this.exiting = true;
                Game.triggerActions("exitlevel");
                Game.triggerActions("lose");
            }
        };
        Level.prototype.onTimeUpdateSceneBeforeDrawFixed = function () {
            if (this.fadeSound) {
            }
            //var x = this.xSizeMap * 0.5;
            //var y = this.ySizeMap * 0.5;
            var x = Game.Player.instance.xRender;
            var y = Game.Player.instance.yRender;
            //Engine.Renderer.camera(x + LevelShake.position, y);
            Engine.Renderer.camera((x + Game.LevelShake.position), (y));
        };
        Level.prototype.onDrawSceneMap = function () {
            _super.prototype.onDrawSceneMap.call(this);
            if (Engine.Box.debugRender) {
                for (var _i = 0, _a = this.boxesEnemies; _i < _a.length; _i++) {
                    var box = _a[_i];
                    if (box.data != null && box.data != undefined && box.data.spikeAngle != null && box.data.spikeAngle != undefined) {
                        box.render();
                    }
                }
            }
        };
        Level.prototype.onStartWaiting = function () {
            _super.prototype.onStartWaiting.call(this);
            if ((Game.Scene.nextSceneClass == Level && (Level.nextIndex == Level.INDEX_FASE_2 || Level.nextIndex == Level.INDEX_FASE_3)) || Game.Scene.nextSceneClass == Game.MainMenu || Game.Scene.nextSceneClass == Game.LevelSelection || Game.Scene.nextSceneClass == Game.SpeedrunMenu || Game.Scene.nextSceneClass == Game.LastScene) {
                //Resources.stopBGM();
            }
            Game.LevelAds.tryTriggerTimeAd();
        };
        Level.prototype.onFadeLinStart = function () {
            /*
            if((Scene.nextSceneClass == Level && (Level.nextIndex == Level.INDEX_FASE_2 || Level.nextIndex == Level.INDEX_FASE_3)) || Scene.nextSceneClass == LastScene){
                SceneFade.speed =  0.0166666666666667 * 2;
                if(Scene.nextSceneClass != LastScene) this.stepsWait = STEPS_CHANGE_SCENE_AD * 0.25;
                else this.stepsWait = STEPS_CHANGE_SCENE_AD * 0.65;
                this.fadeSound = true;
                //Resources.stopBGM();
            }
            */
        };
        Level.prototype.onClearScene = function () {
            Level.instance = null;
        };
        Level.INDEX_FASE_2 = 10;
        Level.INDEX_FASE_3 = 19;
        Level.GRAVITY = 0.0;
        Level.Y_VEL_MAX = 6;
        Level.nextIndex = 1;
        return Level;
    }(Game.SceneMap));
    Game.Level = Level;
})(Game || (Game = {}));
///<reference path="../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var TIME_AD_SPEEDRUN = 60000;
    var STEPS_AD_TIME_FIRST = 30 * 60;
    var STEPS_AD_TIME_REGULAR = 110 * 60;
    var LevelAds = /** @class */ (function (_super) {
        __extends(LevelAds, _super);
        function LevelAds() {
            return _super.call(this) || this;
        }
        LevelAds.init = function () {
            new LevelAds();
        };
        LevelAds.prototype.onStepUpdate = function () {
            if (!Game.Level.speedrun) {
                if (LevelAds.countStepsAdTime > 0) {
                    LevelAds.countStepsAdTime -= 1;
                }
            }
        };
        LevelAds.tryTriggerTimeAd = function () {
            if (!Game.Level.speedrun) {
                if (LevelAds.countStepsAdTime <= 0) {
                    if (LevelAds.listenerAdTime != null) {
                        LevelAds.listenerAdTime();
                    }
                    LevelAds.clearSpeedrunCounter();
                    LevelAds.countStepsAdTime = STEPS_AD_TIME_REGULAR;
                    return LevelAds.listenerAdTime != null;
                }
            }
            return false;
        };
        LevelAds.tryTriggerSpeedrunAd = function () {
            if (Game.Scene.nextSceneClass == Game.Level && Game.Level.speedrun) {
                if (LevelAds.dateSpeedrun == 0 || Date.now() - LevelAds.dateSpeedrun >= TIME_AD_SPEEDRUN) {
                    if (LevelAds.listenerAdSpeedrun != null) {
                        LevelAds.listenerAdSpeedrun();
                    }
                    LevelAds.clearTimeCounter();
                    LevelAds.dateSpeedrun = Date.now();
                    return LevelAds.listenerAdSpeedrun != null;
                }
            }
            return false;
        };
        LevelAds.clearTimeCounter = function () {
            LevelAds.countStepsAdTime = STEPS_AD_TIME_REGULAR;
        };
        LevelAds.clearSpeedrunCounter = function () {
            LevelAds.dateSpeedrun = Date.now();
        };
        LevelAds.listenerAdTime = null;
        LevelAds.listenerAdSpeedrun = null;
        LevelAds.countStepsAdTime = STEPS_AD_TIME_FIRST;
        LevelAds.dateSpeedrun = 0;
        return LevelAds;
    }(Engine.Entity));
    Game.LevelAds = LevelAds;
})(Game || (Game = {}));
///<reference path="../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    //var FILL_R = 0 / 255;
    //var FILL_G = 89 / 255;
    //var FILL_B = 250 / 255;
    var FILL_A = 0.7;
    var LevelPauseUI = /** @class */ (function (_super) {
        __extends(LevelPauseUI, _super);
        function LevelPauseUI() {
            var _this = _super.call(this) || this;
            _this.fill = new Engine.Sprite();
            _this.fill.enabled = true;
            _this.fill.pinned = true;
            /*
            this.fill.setRGBA(
                196 / 255.0,
                73 / 255.0,
                159 / 255.0,
                FILL_A
            );
            */
            _this.fill.setRGBA(37 / 255.0, 140 / 255.0, 13 / 255.0, FILL_A);
            _this.onViewUpdate();
            _this.text = new Utils.Text();
            _this.text.font = Game.FontManager.a;
            _this.text.scale = 1;
            _this.text.enabled = false;
            _this.text.pinned = true;
            _this.text.str = "PAUSED";
            _this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAligned = 0;
            _this.text.yAligned = 0;
            return _this;
        }
        LevelPauseUI.init = function () {
            new LevelPauseUI();
        };
        LevelPauseUI.prototype.onViewUpdate = function () {
            this.fill.x = -Engine.Renderer.xSizeView * 0.5;
            this.fill.y = -Engine.Renderer.ySizeView * 0.5;
            this.fill.xSize = Engine.Renderer.xSizeView;
            this.fill.ySize = Engine.Renderer.ySizeView;
        };
        LevelPauseUI.prototype.onDrawPause = function () {
            if (Game.SceneFreezer.paused) {
                if (!this.text.enabled) {
                    this.text.enabled = true;
                }
                this.fill.render();
            }
            else {
                if (this.text.enabled) {
                    this.text.enabled = false;
                }
            }
        };
        return LevelPauseUI;
    }(Engine.Entity));
    Game.LevelPauseUI = LevelPauseUI;
})(Game || (Game = {}));
///<reference path="../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var LevelSaveManager = /** @class */ (function (_super) {
        __extends(LevelSaveManager, _super);
        function LevelSaveManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.winSaved = false;
            _this.exiting = false;
            return _this;
        }
        LevelSaveManager.init = function () {
            new LevelSaveManager();
        };
        LevelSaveManager.prototype.onReset = function () {
            this.winSaved = false;
        };
        LevelSaveManager.prototype.onStepUpdate = function () {
            if (!this.winSaved && Game.Player.instance.winning) {
                Game.dataLevels[Game.Level.index] = "cleared";
                Engine.Data.save("level" + (Game.Level.index), "cleared", 60);
                if (Game.dataLevels[Game.Level.nextIndex] == "locked") {
                    Engine.Data.save("level" + (Game.Level.nextIndex), "unlocked", 60);
                    Game.dataLevels[Game.Level.nextIndex] = "unlocked";
                }
                if (Game.Level.speedrun && Game.Level.nextIndex > Game.MAX_LEVELS && (Game.recordSpeedrun == 0 || Game.Level.countStepsSpeedrun < Game.recordSpeedrun)) {
                    LevelSaveManager.hasSpeedrunRecord = Game.recordSpeedrun > 0;
                    Game.recordSpeedrun = Game.Level.countStepsSpeedrun;
                    Engine.Data.save("speedrunrecord", Game.recordSpeedrun, 60);
                    Game.levelSpeedrun = 1;
                    Engine.Data.save("speedrunlevel", 0, 60);
                    Game.dataSpeedrun = 0;
                    Engine.Data.save("speedrundata", 0, 60);
                }
                else if (Game.Level.speedrun && Game.Level.nextIndex > Game.MAX_LEVELS) {
                    LevelSaveManager.hasSpeedrunRecord = false;
                    Game.levelSpeedrun = 1;
                    Engine.Data.save("speedrunlevel", 0, 60);
                    Game.dataSpeedrun = 0;
                    Engine.Data.save("speedrundata", 0, 60);
                }
                else if (Game.Level.speedrun) {
                    Game.levelSpeedrun = Game.Level.nextIndex;
                    Engine.Data.save("speedrunlevel", Game.levelSpeedrun, 60);
                    Game.dataSpeedrun = Game.Level.countStepsSpeedrun;
                    Engine.Data.save("speedrundata", Game.dataSpeedrun, 60);
                }
                if (!Game.Level.speedrun && Game.Level.index < Game.MAX_LEVELS && Game.Level.index == Game.LEVELS_PER_PAGE * (Game.LevelSelection.indexPage + 1)) {
                    Game.LevelSelection.indexPage += 1;
                }
                this.winSaved = true;
                Game.triggerActions("savegame");
            }
            if (Game.Level.speedrun && !this.winSaved && !this.exiting && Game.ExitButton.instance.control.pressed) {
                Game.levelSpeedrun = Game.Level.index;
                Engine.Data.save("speedrunlevel", Game.levelSpeedrun, 60);
                Game.dataSpeedrun = Game.Level.countStepsSpeedrun;
                Engine.Data.save("speedrundata", Game.dataSpeedrun, 60);
                this.exiting = true;
            }
        };
        return LevelSaveManager;
    }(Engine.Entity));
    Game.LevelSaveManager = LevelSaveManager;
})(Game || (Game = {}));
var Utils;
(function (Utils) {
    var Shake = /** @class */ (function (_super) {
        __extends(Shake, _super);
        function Shake() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._triggered = false;
            return _this;
        }
        Object.defineProperty(Shake.prototype, "triggered", {
            get: function () {
                return this._triggered;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Shake.prototype, "inactive", {
            get: function () {
                return this.position == 0 && this.direction == 0;
            },
            enumerable: false,
            configurable: true
        });
        Shake.prototype.start = function (direction) {
            this.position = 0;
            this.countDistance = this.distance;
            this.direction = direction;
            this._triggered = true;
        };
        Shake.prototype.stop = function () {
            this.position = 0;
            this.direction = 0;
            this._triggered = false;
        };
        Shake.prototype.onReset = function () {
            this.position = 0;
            this.direction = 0;
            this._triggered = false;
        };
        Shake.prototype.onStepUpdate = function () {
            if (this.direction != 0 && !Game.SceneFreezer.stoped) {
                this.position += this.velocity * this.direction;
                var change = false;
                if ((this.direction > 0 && this.position > this.countDistance) || (this.direction < 0 && this.position < -this.countDistance)) {
                    change = true;
                }
                if (change) {
                    this.position = this.countDistance * this.direction;
                    this.direction *= -1;
                    this.countDistance *= this.reduction;
                    if (this.countDistance <= this.minDistance) {
                        this.position = 0;
                        this.direction = 0;
                    }
                }
            }
        };
        return Shake;
    }(Engine.Entity));
    Utils.Shake = Shake;
})(Utils || (Utils = {}));
///<reference path="../../Utils/Shake.ts"/>
var Game;
(function (Game) {
    var VELOCITY = 2;
    var DISTANCE = 2;
    var MIN_DISTANCE = 0.01;
    var REDUCTION = 0.8;
    var START_DIRECTION = 1;
    var LevelShake = /** @class */ (function (_super) {
        __extends(LevelShake, _super);
        function LevelShake() {
            var _this = _super.call(this) || this;
            _this.velocity = VELOCITY;
            _this.distance = DISTANCE;
            _this.minDistance = MIN_DISTANCE;
            _this.reduction = REDUCTION;
            return _this;
        }
        Object.defineProperty(LevelShake, "triggered", {
            get: function () {
                return LevelShake.instance.triggered;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LevelShake, "position", {
            get: function () {
                return LevelShake.instance.position;
            },
            enumerable: false,
            configurable: true
        });
        LevelShake.init = function () {
            LevelShake.instance = new LevelShake();
        };
        LevelShake.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
            if (!this.triggered && Game.Player.instance.losing) {
                this.start(START_DIRECTION);
            }
        };
        LevelShake.prototype.onClearScene = function () {
            LevelShake.instance = null;
        };
        LevelShake.instance = null;
        return LevelShake;
    }(Utils.Shake));
    Game.LevelShake = LevelShake;
})(Game || (Game = {}));
///<reference path="../../System/Scene/SceneMap.ts"/>
var Game;
(function (Game) {
    var X_LOADING_START = 0;
    var X_LOADING_PRESS = 0;
    var X_LOADING_COMPLETE = -34;
    var Y_LOADING = 5 - 1 + 2;
    var STEPS_DOTS = 20;
    var STEPS_BLINK_TEXT = 40;
    var STEPS_NEXT = 60;
    var Preloader = /** @class */ (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            var _this = _super.call(this) || this;
            _this.count = 0;
            _this.soundPlayed = false;
            Game.SceneFade.speed = 0.0166666666666667 * 1;
            //Palette.setCurrent(1);
            _this.text = new Utils.Text();
            _this.text.font = Game.FontManager.a;
            _this.text.scale = 1;
            _this.text.enabled = true;
            _this.text.pinned = true;
            _this.text.str = "   LOADING   ";
            _this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAligned = X_LOADING_START;
            _this.text.yAligned = Y_LOADING;
            _this.text.front = false;
            _this.control = new Game.Control();
            _this.control.enabled = true;
            _this.control.freezeable = true;
            _this.control.newInteractionRequired = true;
            _this.control.useMouse = true;
            _this.control.mouseButtons = [0];
            _this.control.useTouch = true;
            _this.bar = new Game.LoadingBar(Y_LOADING, 52, 5);
            Game.SceneColors.enabledDown = false;
            //SceneColors.clearColor(CLEAR_RED, CLEAR_GREEN, CLEAR_BLUE);
            _this.loadMap(Game.Resources.PATH_MAP_PRELOADER);
            //this.loadSky(Resources.PATH_MAP_SKY_NONE);
            _this.initStates();
            Game.SceneColors.instance.usingFill = true;
            Game.triggerActions("preloader");
            return _this;
        }
        ;
        Preloader.prototype.initStates = function () {
            var _this = this;
            var loading = new Game.Flow.State(this);
            var click = new Game.Flow.State(this);
            var exit = new Game.Flow.State(this);
            var wait = new Game.Flow.State(this);
            var next = new Game.Flow.State(this);
            loading.onStepUpdate = function () {
                _this.count += 1;
                if (_this.count == STEPS_DOTS) {
                    _this.count = 0;
                    if (_this.text.str == "   LOADING   ") {
                        _this.text.str = "  .LOADING.  ";
                    }
                    else if (_this.text.str == "  .LOADING.  ") {
                        _this.text.str = " ..LOADING.. ";
                    }
                    else if (_this.text.str == " ..LOADING.. ") {
                        _this.text.str = "...LOADING...";
                    }
                    else if (_this.text.str == "...LOADING...") {
                        _this.text.str = "   LOADING   ";
                    }
                }
            };
            loading.addLink(exit, function () { return Game.DIRECT_PRELOADER && Engine.Assets.downloadComplete && _this.bar.full; });
            loading.addLink(click, function () { return Engine.Assets.downloadComplete && _this.bar.full; });
            click.onEnter = function () {
                _this.count = 0;
                _this.text.str = "PRESS TO CONTINUE";
                _this.text.xAligned = X_LOADING_PRESS;
            };
            click.onStepUpdate = function () {
                _this.count += 1;
                if (_this.count == STEPS_BLINK_TEXT) {
                    _this.count = 0;
                    _this.text.enabled = !_this.text.enabled;
                }
            };
            click.addLink(exit, function () { return _this.control.pressed; });
            exit.onEnter = function () {
                if (Game.DIRECT_PRELOADER) {
                    _this.text.str = "LOAD COMPLETE!";
                    _this.text.xAligned = X_LOADING_COMPLETE;
                    //@ts-ignore
                    //Engine.AudioManager.verify();
                }
                Game.HAS_STARTED = true;
                Game.IS_TOUCH = Game.FORCE_TOUCH || _this.control.touchPressed;
                //HAS_LINKS = HAS_LINKS && !IS_TOUCH;
                _this.text.enabled = true;
                Game.SceneFade.trigger();
                Game.triggerActions("postinit");
            };
            exit.onStepUpdate = function () {
                if (!_this.soundPlayed && Engine.AudioManager.verified) {
                    //Resources.sfxGameStart.play();
                    _this.soundPlayed = true;
                }
            };
            exit.addLink(wait, function () { return Game.SceneFade.filled && Preloader.canFinish; });
            wait.onEnter = function () {
                _this.count = 0;
            };
            wait.onStepUpdate = function () {
                _this.count += 1;
            };
            wait.addLink(next, function () { return (Game.startingSceneClass != Game.MainMenu || _this.count >= STEPS_NEXT); });
            next.onEnter = function () {
                //triggerActions("preloadchangecolor");
                Game.triggerActions("endpreloader");
                Engine.System.nextSceneClass = Game.PreloadEnd;
            };
            next.onStepUpdate = function () {
                // if(Preloader.canExit){
                //     this.count += 1;
                //     if(this.count >= STEPS_NEXT){
                //         Engine.System.nextSceneClass = PreloadEnd;
                //         Preloader.canExit = false;
                //     }
                // }
            };
            new Game.Flow.StateMachine(this).startState = loading;
        };
        Preloader.prototype.onTimeUpdate = function () {
            Engine.Renderer.camera(Game.SceneMap.instance.xSizeMap * 0.5, Game.SceneMap.instance.ySizeMap * 0.5);
        };
        Preloader.canFinish = true;
        return Preloader;
    }(Game.SceneMap));
    Game.Preloader = Preloader;
})(Game || (Game = {}));
///<reference path="../../../Engine/Scene.ts"/>
var Game;
(function (Game) {
    var PreloadStart = /** @class */ (function (_super) {
        __extends(PreloadStart, _super);
        function PreloadStart() {
            var _this = _super.call(this) || this;
            Game.forEachPath("preload", function (path) {
                Engine.Assets.queue(path);
            });
            Engine.Assets.download();
            return _this;
            //triggerActions("preloadchangecolor");
        }
        PreloadStart.prototype.onStepUpdate = function () {
            if (Engine.Assets.downloadComplete) {
                Engine.System.nextSceneClass = PreloadMiddle;
            }
        };
        return PreloadStart;
    }(Engine.Scene));
    Game.PreloadStart = PreloadStart;
    var PreloadMiddle = /** @class */ (function (_super) {
        __extends(PreloadMiddle, _super);
        function PreloadMiddle() {
            var _this = _super.call(this) || this;
            Game.triggerActions("preinit");
            Game.triggerActions("init");
            Game.forEachPath("load", function (path) {
                Engine.Assets.queue(path);
            });
            Engine.Assets.download();
            Engine.System.nextSceneClass = Game.SKIP_PRELOADER ? SimplePreloader : Game.Preloader;
            return _this;
        }
        return PreloadMiddle;
    }(Engine.Scene));
    Game.PreloadMiddle = PreloadMiddle;
    var SimplePreloader = /** @class */ (function (_super) {
        __extends(SimplePreloader, _super);
        function SimplePreloader() {
            var _this = _super.call(this) || this;
            Game.SceneFade.speed = 0.0166666666666667 * 1000;
            //SceneColors.clearColor(0, 0, 0);
            Game.triggerActions("preloader");
            Game.IS_TOUCH = Game.FORCE_TOUCH;
            Game.triggerActions("postinit");
            return _this;
        }
        ;
        SimplePreloader.prototype.onStepUpdate = function () {
            if (Engine.Assets.downloadComplete) {
                Engine.System.nextSceneClass = PreloadEnd;
            }
        };
        return SimplePreloader;
    }(Game.Scene));
    Game.SimplePreloader = SimplePreloader;
    var PreloadEnd = /** @class */ (function (_super) {
        __extends(PreloadEnd, _super);
        function PreloadEnd() {
            var _this = _super.call(this) || this;
            Game.triggerActions("preconfigure");
            Game.triggerActions("configure");
            Game.triggerActions("prepare");
            Game.triggerActions("start");
            Engine.System.nextSceneClass = Game.startingSceneClass;
            return _this;
            //triggerActions("preloadchangecolor");
        }
        return PreloadEnd;
    }(Engine.Scene));
    Game.PreloadEnd = PreloadEnd;
})(Game || (Game = {}));
Engine.System.nextSceneClass = Game.PreloadStart;
var Game;
(function (Game) {
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(bounds) {
            if (bounds === void 0) { bounds = new Engine.Sprite(); }
            var _this = _super.call(this) || this;
            _this.arrows = new Game.Arrows();
            _this.control = new Game.Control();
            _this.anchor = new Utils.Anchor();
            _this.control.bounds = bounds;
            _this.anchor.bounds = bounds;
            _this.control.enabled = true;
            _this.control.useMouse = true;
            _this.control.mouseButtons = [0];
            _this.control.useTouch = true;
            _this.control.blockOthersSelection = true;
            _this.control.newInteractionRequired = true;
            _this.control.listener = _this;
            _this.arrows.control = _this.control;
            _this.arrows.bounds = _this.control.bounds;
            return _this;
            //this.control.audioSelected = Resources.sfxMouseOver;
            //this.control.audioPressed = Resources.sfxMouseClick;
        }
        Object.defineProperty(Button.prototype, "bounds", {
            get: function () {
                return this.control.bounds;
            },
            enumerable: false,
            configurable: true
        });
        Button.prototype.onDrawButtons = function () {
            this.control.bounds.render();
        };
        return Button;
    }(Engine.Entity));
    Game.Button = Button;
    var TextButton = /** @class */ (function (_super) {
        __extends(TextButton, _super);
        function TextButton() {
            var _this = _super.call(this) || this;
            _this.arrows = new Game.Arrows();
            _this.control = new Game.Control();
            _this.text = new Utils.Text();
            _this.control.bounds = _this.text.bounds;
            _this.control.enabled = true;
            _this.control.useMouse = true;
            _this.control.mouseButtons = [0];
            _this.control.useTouch = true;
            _this.control.blockOthersSelection = true;
            _this.control.newInteractionRequired = true;
            _this.control.listener = _this;
            _this.arrows.control = _this.control;
            _this.arrows.bounds = _this.text.bounds;
            return _this;
            //this.control.audioSelected = Resources.sfxMouseOver;
            //this.control.audioPressed = Resources.sfxMouseClick;
        }
        return TextButton;
    }(Engine.Entity));
    Game.TextButton = TextButton;
    var DialogButton = /** @class */ (function (_super) {
        __extends(DialogButton, _super);
        function DialogButton(index, x, y) {
            var _this = _super.call(this) || this;
            _this.arrows = new Game.Arrows();
            _this.control = new Game.Control();
            _this.text = new Utils.Text();
            _this.dialog = new Game.ButtonFrame(index, x, y);
            _this.control.bounds = _this.dialog.sprite;
            _this.control.enabled = true;
            _this.control.useMouse = true;
            _this.control.mouseButtons = [0];
            _this.control.useTouch = true;
            _this.control.blockOthersSelection = true;
            _this.control.newInteractionRequired = true;
            _this.control.listener = _this;
            _this.arrows.control = _this.control;
            _this.arrows.bounds = _this.text.bounds;
            return _this;
            //this.control.audioSelected = Resources.sfxMouseOver;
            //this.control.audioPressed = Resources.sfxMouseClick;
        }
        Object.defineProperty(DialogButton.prototype, "enabled", {
            set: function (value) {
                this.control.enabled = value;
                this.dialog.sprite.enabled = value;
                this.text.enabled = value;
            },
            enumerable: false,
            configurable: true
        });
        return DialogButton;
    }(Engine.Entity));
    Game.DialogButton = DialogButton;
})(Game || (Game = {}));
///<reference path="../../../System/Button.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("exit button", Game.Resources.textureStilts, 0, 225);
    });
    var ExitButton = /** @class */ (function (_super) {
        __extends(ExitButton, _super);
        function ExitButton() {
            var _this = _super.call(this, new Engine.Sprite()) || this;
            _this.baseSprite = _this.bounds;
            ExitButton.instance = _this;
            _this.bounds.enabled = true;
            _this.bounds.pinned = true;
            _this.fix();
            _this.anchor.xAlignBounds = Utils.AnchorAlignment.END;
            _this.anchor.xAlignView = Utils.AnchorAlignment.END;
            _this.anchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.yAlignView = Utils.AnchorAlignment.START;
            _this.anchor.xAligned = -Game.X_BUTTONS_LEFT;
            _this.anchor.yAligned = Game.Y_BUTTONS_TOP;
            _this.arrows.yOffset = Game.Y_ARROWS_GAME_BUTTONS;
            _this.control.useKeyboard = true;
            _this.control.keys = [Engine.Keyboard.ESC, "esc", "Esc", "ESC"];
            _this.control.onPressedDelegate = _this.onPressed;
            return _this;
        }
        ExitButton.prototype.onPressed = function () {
            if (Game.Scene.nextSceneClass == null) {
                //Scene.switchPause();
                //this.fix(); 
            }
        };
        ExitButton.prototype.onStepUpdate = function () {
            if (Game.PauseButton.instance != null) {
                if (!Game.SceneFreezer.paused && this.bounds.enabled) {
                    this.control.useMouse = false;
                    this.control.useTouch = false;
                    this.bounds.enabled = false;
                }
                else if (Game.SceneFreezer.paused && !this.bounds.enabled) {
                    this.control.useMouse = true;
                    this.control.useTouch = true;
                    this.bounds.enabled = true;
                }
            }
        };
        //onStepUpdate(){
        /*
        if(Scene.nextSceneClass != null && Scene.nextSceneClass != Level && Scene.nextSceneClass != LastScene && Scene.nextSceneClass != "reset"){
            this.control.enabled = false;
            this.control.bounds.enabled = false;
        }
        else{
            this.control.enabled = true;
            this.control.bounds.enabled = true;
        }
        */
        //}
        ExitButton.prototype.fix = function () {
            FRAMES[7 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.bounds);
        };
        ExitButton.prototype.onDrawButtons = function () {
            this.baseSprite.render();
        };
        ExitButton.prototype.onClearScene = function () {
            ExitButton.instance = null;
        };
        return ExitButton;
    }(Game.Button));
    Game.ExitButton = ExitButton;
})(Game || (Game = {}));
///<reference path="../../../System/Button.ts"/>
var Game;
(function (Game) {
    Game.PLAYSTORE_BUTTON_POSITION = "bottom right";
    var SCALE = 0.060;
    var PlayStoreButton = /** @class */ (function (_super) {
        __extends(PlayStoreButton, _super);
        function PlayStoreButton() {
            var _this = _super.call(this) || this;
            _this.bounds.enabled = true;
            _this.bounds.pinned = true;
            _this.arrows.enabled = false;
            FRAMES[0].applyToSprite(_this.bounds);
            _this.bounds.xSize *= SCALE;
            _this.bounds.ySize *= SCALE;
            /*
            this.anchor.xAlignBounds = Utils.AnchorAlignment.START;
            this.anchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            this.anchor.yAlignBounds = Utils.AnchorAlignment.END;
            this.anchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            this.anchor.xAligned = 40 + (Engine.Renderer.xSizeView * 0.5 - 40) * 0.5 - this.bounds.xSize * 0.5;
            this.anchor.yAligned = 56;

            
            this.anchor.xAlignBounds = Utils.AnchorAlignment.START;
            this.anchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            this.anchor.yAlignBounds = Utils.AnchorAlignment.END;
            this.anchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            this.anchor.xAligned = 43;
            this.anchor.yAligned = 56;
            */
            switch (Game.PLAYSTORE_BUTTON_POSITION) {
                case "top right":
                    _this.anchor.xAlignBounds = Utils.AnchorAlignment.END;
                    _this.anchor.xAlignView = Utils.AnchorAlignment.END;
                    _this.anchor.yAlignBounds = Utils.AnchorAlignment.START;
                    _this.anchor.yAlignView = Utils.AnchorAlignment.START;
                    _this.anchor.xAligned = -3;
                    _this.anchor.yAligned = 2;
                    break;
                case "bottom left":
                    _this.anchor.xAlignBounds = Utils.AnchorAlignment.START;
                    _this.anchor.xAlignView = Utils.AnchorAlignment.START;
                    _this.anchor.yAlignBounds = Utils.AnchorAlignment.END;
                    _this.anchor.yAlignView = Utils.AnchorAlignment.END;
                    _this.anchor.xAligned = 3;
                    _this.anchor.yAligned = -4;
                    break;
                case "bottom right":
                    _this.anchor.xAlignBounds = Utils.AnchorAlignment.END;
                    _this.anchor.xAlignView = Utils.AnchorAlignment.END;
                    _this.anchor.yAlignBounds = Utils.AnchorAlignment.END;
                    _this.anchor.yAlignView = Utils.AnchorAlignment.END;
                    _this.anchor.xAligned = -3;
                    _this.anchor.yAligned = -4;
                    break;
                case "right":
                    _this.anchor.xAlignBounds = Utils.AnchorAlignment.END;
                    _this.anchor.xAlignView = Utils.AnchorAlignment.END;
                    _this.anchor.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
                    _this.anchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
                    _this.anchor.xAligned = -3;
                    _this.anchor.yAligned = -0.5;
                    break;
            }
            _this.control.url = "https://play.google.com/store/apps/details?id=com.noadev.miniblocks";
            _this.control.onSelectionStayDelegate = function () {
                Engine.Renderer.useHandPointer = true;
            };
            return _this;
        }
        PlayStoreButton.prototype.onViewUpdate = function () {
            //this.anchor.xAligned = 40 + (Engine.Renderer.xSizeView * 0.5 - 40) * 0.5 - this.bounds.xSize * 0.5;
        };
        return PlayStoreButton;
    }(Game.Button));
    Game.PlayStoreButton = PlayStoreButton;
    function TryCreatePlaystoreButton() {
        if (Game.HAS_LINKS && Game.HAS_GOOGLE_PLAY_LOGOS) {
            new PlayStoreButton();
        }
    }
    Game.TryCreatePlaystoreButton = TryCreatePlaystoreButton;
    var FRAMES;
    Game.addAction("prepare", function () {
        if (Game.HAS_LINKS && Game.HAS_GOOGLE_PLAY_LOGOS) {
            FRAMES = Game.FrameSelector.complex("google play", Game.Resources.textureGooglePlay, 37, 37);
        }
    });
})(Game || (Game = {}));
///<reference path="../../../System/Button.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("music button", Game.Resources.textureStilts, 0, 225);
    });
    var MusicButton = /** @class */ (function (_super) {
        __extends(MusicButton, _super);
        function MusicButton() {
            var _this = _super.call(this) || this;
            MusicButton.instance = _this;
            _this.bounds.enabled = true;
            _this.bounds.pinned = true;
            _this.fix();
            _this.anchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.xAlignView = Utils.AnchorAlignment.START;
            _this.anchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.yAlignView = Utils.AnchorAlignment.START;
            _this.anchor.xAligned = Game.X_BUTTONS_LEFT + (Game.PauseButton.instance != null ? Game.PauseButton.instance.bounds.xSize + Game.X_SEPARATION_BUTTONS_LEFT : 0);
            _this.anchor.yAligned = Game.Y_BUTTONS_TOP;
            _this.arrows.yOffset = Game.Y_ARROWS_GAME_BUTTONS;
            _this.control.useKeyboard = true;
            _this.control.keys = [Engine.Keyboard.M];
            _this.control.onPressedDelegate = _this.onPressed;
            return _this;
        }
        MusicButton.prototype.onStepUpdate = function () {
            if (Game.PauseButton.instance != null) {
                if (!Game.SceneFreezer.paused && this.bounds.enabled) {
                    this.control.useMouse = false;
                    this.control.useTouch = false;
                    this.bounds.enabled = false;
                }
                else if (Game.SceneFreezer.paused && !this.bounds.enabled) {
                    this.control.useMouse = true;
                    this.control.useTouch = true;
                    this.bounds.enabled = true;
                }
            }
        };
        MusicButton.prototype.onPressed = function () {
            Game.switchMusicMute();
            this.fix();
        };
        MusicButton.prototype.fix = function () {
            if (Game.MUSIC_MUTED) {
                FRAMES[1 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.bounds);
            }
            else {
                FRAMES[0 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.bounds);
            }
        };
        MusicButton.prototype.onClearScene = function () {
            MusicButton.instance = null;
        };
        return MusicButton;
    }(Game.Button));
    Game.MusicButton = MusicButton;
})(Game || (Game = {}));
///<reference path="../../../System/Button.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("pause button", Game.Resources.textureStilts, 0, 225);
    });
    var PauseButton = /** @class */ (function (_super) {
        __extends(PauseButton, _super);
        function PauseButton() {
            var _this = _super.call(this) || this;
            _this.pauseGraph = false;
            _this.inited = false;
            PauseButton.instance = _this;
            _this.pauseGraph = Game.SceneFreezer.paused;
            _this.bounds.enabled = true;
            _this.bounds.pinned = true;
            _this.baseSprite = _this.bounds;
            _this.fix();
            _this.anchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.xAlignView = Utils.AnchorAlignment.START;
            _this.anchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.yAlignView = Utils.AnchorAlignment.START;
            _this.anchor.xAligned = Game.X_BUTTONS_LEFT;
            _this.anchor.yAligned = Game.Y_BUTTONS_TOP;
            _this.arrows.yOffset = Game.Y_ARROWS_GAME_BUTTONS;
            _this.control.useKeyboard = true;
            _this.control.keys = [Engine.Keyboard.P];
            _this.control.onPressedDelegate = _this.onPressed;
            return _this;
        }
        PauseButton.prototype.onReset = function () {
            this.inited = true;
            this.fix();
        };
        PauseButton.prototype.onPressed = function () {
            Game.SceneFreezer.switchPause();
            this.pauseGraph = !this.pauseGraph;
            this.fix();
        };
        PauseButton.prototype.onStepUpdate = function () {
            /*
            if(Scene.nextSceneClass != null && Scene.nextSceneClass != Level && Scene.nextSceneClass != LastScene && Scene.nextSceneClass != "reset"){
                this.control.enabled = false;
                this.control.bounds.enabled = false;
            }
            else{
                this.control.enabled = true;
                this.control.bounds.enabled = true;
            }
            */
            //console.log(this.control.selected);
        };
        PauseButton.prototype.fix = function () {
            if (this.pauseGraph) {
                FRAMES[5 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.baseSprite);
                if (!Game.IS_TOUCH && this.inited) {
                    this.control.bounds = this.baseSprite;
                }
            }
            else {
                FRAMES[4 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.baseSprite);
                if (!Game.IS_TOUCH && this.inited) {
                    this.control.bounds = Game.BigButtonFrame.instance.spriteB;
                }
            }
        };
        PauseButton.prototype.onDrawButtons = function () {
            this.baseSprite.render();
        };
        PauseButton.prototype.onClearScene = function () {
            PauseButton.instance = null;
        };
        PauseButton.instance = null;
        return PauseButton;
    }(Game.Button));
    Game.PauseButton = PauseButton;
})(Game || (Game = {}));
///<reference path="../../../System/Button.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("reset button", Game.Resources.textureStilts, 0, 225);
    });
    var ResetButton = /** @class */ (function (_super) {
        __extends(ResetButton, _super);
        function ResetButton() {
            var _this = _super.call(this) || this;
            ResetButton.instance = _this;
            _this.bounds.enabled = true;
            _this.bounds.pinned = true;
            _this.fix();
            _this.anchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.xAlignView = Utils.AnchorAlignment.START;
            _this.anchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.yAlignView = Utils.AnchorAlignment.START;
            _this.anchor.xAligned = Game.X_BUTTONS_LEFT + Game.MusicButton.instance.bounds.xSize + Game.X_SEPARATION_BUTTONS_LEFT + Game.SoundButton.instance.bounds.xSize + Game.X_SEPARATION_BUTTONS_LEFT + Game.PauseButton.instance.bounds.xSize + Game.X_SEPARATION_BUTTONS_LEFT;
            _this.anchor.yAligned = Game.Y_BUTTONS_TOP;
            _this.arrows.yOffset = Game.Y_ARROWS_GAME_BUTTONS;
            _this.control.useKeyboard = true;
            _this.control.keys = [Engine.Keyboard.R];
            return _this;
            //this.control.onPressedDelegate = this.onPressed;
        }
        ResetButton.prototype.onStepUpdate = function () {
            if (Game.PauseButton.instance != null) {
                if (!Game.SceneFreezer.paused && this.bounds.enabled) {
                    this.control.useMouse = false;
                    this.control.useTouch = false;
                    this.bounds.enabled = false;
                }
                else if (Game.SceneFreezer.paused && !this.bounds.enabled) {
                    this.control.useMouse = true;
                    this.control.useTouch = true;
                    this.bounds.enabled = true;
                }
            }
        };
        //onStepUpdate(){
        /*
        if(Scene.nextSceneClass != null && Scene.nextSceneClass != Level && Scene.nextSceneClass != LastScene){
            this.control.enabled = false;
            this.control.bounds.enabled = false;
        }
        else{
            this.control.enabled = true;
            this.control.bounds.enabled = true;
        }
        */
        //}
        ResetButton.prototype.fix = function () {
            FRAMES[6 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.bounds);
        };
        ResetButton.prototype.onClearScene = function () {
            ResetButton.instance = null;
        };
        return ResetButton;
    }(Game.Button));
    Game.ResetButton = ResetButton;
})(Game || (Game = {}));
///<reference path="../../../System/Button.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("sound button", Game.Resources.textureStilts, 0, 225);
    });
    var SoundButton = /** @class */ (function (_super) {
        __extends(SoundButton, _super);
        function SoundButton() {
            var _this = _super.call(this) || this;
            SoundButton.instance = _this;
            _this.bounds.enabled = true;
            _this.bounds.pinned = true;
            _this.fix();
            _this.anchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.xAlignView = Utils.AnchorAlignment.START;
            _this.anchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.anchor.yAlignView = Utils.AnchorAlignment.START;
            _this.anchor.xAligned = Game.X_BUTTONS_LEFT + Game.MusicButton.instance.bounds.xSize + Game.X_SEPARATION_BUTTONS_LEFT
                + (Game.PauseButton.instance != null ? Game.PauseButton.instance.bounds.xSize + Game.X_SEPARATION_BUTTONS_LEFT : 0);
            _this.anchor.yAligned = Game.Y_BUTTONS_TOP;
            _this.arrows.yOffset = Game.Y_ARROWS_GAME_BUTTONS;
            _this.control.useKeyboard = true;
            _this.control.keys = [Engine.Keyboard.N];
            _this.control.onPressedDelegate = _this.onPressed;
            return _this;
        }
        SoundButton.prototype.onStepUpdate = function () {
            if (Game.PauseButton.instance != null) {
                if (!Game.SceneFreezer.paused && this.bounds.enabled) {
                    this.control.useMouse = false;
                    this.control.useTouch = false;
                    this.bounds.enabled = false;
                }
                else if (Game.SceneFreezer.paused && !this.bounds.enabled) {
                    this.control.useMouse = true;
                    this.control.useTouch = true;
                    this.bounds.enabled = true;
                }
            }
        };
        SoundButton.prototype.onPressed = function () {
            Game.switchSoundMute();
            this.fix();
        };
        SoundButton.prototype.fix = function () {
            if (Game.SOUND_MUTED) {
                FRAMES[3 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.bounds);
            }
            else {
                FRAMES[2 + (Game.IS_TOUCH ? 8 : 0)].applyToSprite(this.bounds);
            }
        };
        SoundButton.prototype.onClearScene = function () {
            SoundButton.instance = null;
        };
        return SoundButton;
    }(Game.Button));
    Game.SoundButton = SoundButton;
})(Game || (Game = {}));
var Game;
(function (Game) {
    Game.LEVEL_TEXT_UNPAUSED_ALPHA = 0.5;
    Game.LEVEL_TEXT_UNPAUSED_OFFSET = -30 + 6 - 1 + 1;
    var LevelText = /** @class */ (function (_super) {
        __extends(LevelText, _super);
        function LevelText() {
            var _this = _super.call(this) || this;
            _this.text = new Utils.Text();
            _this.text.font = Game.FontManager.a;
            _this.text.scale = 1;
            _this.text.enabled = true;
            _this.text.pinned = true;
            _this.text.str = "STAGE " + (Game.Level.index < 10 ? "0" : "") + Game.Level.index;
            _this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.text.yAlignView = Utils.AnchorAlignment.START;
            _this.text.xAligned = 0;
            _this.text.yAligned = Game.Y_BUTTONS_TOP + 2.5;
            if (Game.IS_TOUCH) {
                //this.text0.enabled = false;
            }
            _this.fix();
            _this.onStepUpdate();
            return _this;
        }
        LevelText.prototype.fix = function () {
            if (Engine.Renderer.xSizeView > 360) {
                this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
                this.text.xAligned = 0;
            }
            else {
                this.text.xAlignView = Utils.AnchorAlignment.START;
                var posLeft = Game.X_BUTTONS_LEFT + Game.MusicButton.instance.bounds.xSize
                    + Game.X_SEPARATION_BUTTONS_LEFT + Game.SoundButton.instance.bounds.xSize
                    + Game.X_SEPARATION_BUTTONS_LEFT + Game.PauseButton.instance.bounds.xSize
                    + Game.X_SEPARATION_BUTTONS_LEFT + Game.ResetButton.instance.bounds.xSize;
                var posRight = Engine.Renderer.xSizeView - Game.X_BUTTONS_LEFT - Game.ExitButton.instance.bounds.xSize;
                this.text.xAligned = posLeft + (posRight - posLeft) * 0.5;
            }
        };
        LevelText.prototype.onStepUpdate = function () {
            if (!Game.SceneFreezer.paused && this.text.enabled) {
                this.text.enabled = false;
            }
            else if (Game.SceneFreezer.paused && !this.text.enabled) {
                this.text.enabled = true;
            }
        };
        LevelText.prototype.onViewUpdate = function () {
            this.fix();
        };
        LevelText.prototype.onDrawUIDialogs = function () {
        };
        return LevelText;
    }(Engine.Entity));
    Game.LevelText = LevelText;
})(Game || (Game = {}));
var Game;
(function (Game) {
    Game.EXTRA_DIALOG_ALPHA = 0.6;
    var SpeedrunTimer = /** @class */ (function (_super) {
        __extends(SpeedrunTimer, _super);
        function SpeedrunTimer() {
            var _this = _super.call(this) || this;
            _this.text = new Utils.Text();
            _this.textDown = new Utils.Text();
            _this.levelSteps = 0;
            /*
            if(Level.index != 1 && Level.index != 24){
                var dialog = new ColorDialog("normal", 0, 1 - 50, 43, 10);
                if(
                    Level.index == 3
                    || Level.index == 5
                    || Level.index == 8
                    || Level.index == 9
                    || Level.index == 13
                    || Level.index == 21
                    || Level.index == 25
                ){
                    dialog.setAlpha(EXTRA_DIALOG_ALPHA);
                }
            }
            */
            _this.text.font = Game.FontManager.a;
            _this.text.scale = 1;
            _this.text.enabled = true;
            _this.text.pinned = true;
            _this.text.str = Game.Level.countStepsSpeedrun == 0 ? "0.000" : SpeedrunTimer.getTextValue(Game.Level.countStepsSpeedrun);
            _this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.text.yAlignView = Utils.AnchorAlignment.START;
            _this.text.xAligned = 0;
            _this.textDown.font = Game.FontManager.off;
            _this.textDown.scale = 1;
            _this.textDown.enabled = true;
            _this.textDown.pinned = true;
            _this.textDown.str = "0.000";
            _this.textDown.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.textDown.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.textDown.yAlignBounds = Utils.AnchorAlignment.START;
            _this.textDown.yAlignView = Utils.AnchorAlignment.START;
            _this.textDown.xAligned = 0;
            new Game.SpeedrunDialogFrame();
            _this.fix();
            return _this;
        }
        SpeedrunTimer.prototype.fix = function () {
            if (!Game.SceneFreezer.paused) {
                this.text.xAlignView = Utils.AnchorAlignment.END;
                this.text.yAlignView = Utils.AnchorAlignment.START;
                this.text.xAligned = -10 - 1 - 4 - 2;
                this.text.yAligned = 2;
                this.textDown.xAlignView = Utils.AnchorAlignment.END;
                this.textDown.yAlignView = Utils.AnchorAlignment.START;
                this.textDown.xAligned = -10 - 1 - 4 - 2;
                this.textDown.yAligned = 9;
            }
            else {
                this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
                this.text.yAlignView = Utils.AnchorAlignment.END;
                this.text.xAligned = 0.5;
                this.text.yAligned = -15;
                this.textDown.xAlignView = Utils.AnchorAlignment.MIDDLE;
                this.textDown.yAlignView = Utils.AnchorAlignment.END;
                this.textDown.xAligned = 0.5;
                this.textDown.yAligned = -15 + 7;
            }
            /*
            else if(Engine.Renderer.xSizeView > 360){
                this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
                this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
                this.text.xAligned = 0;
                this.text.yAligned = 8;
            }
            else{
                this.text.xAlignView = Utils.AnchorAlignment.START;
                this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
                var posLeft = X_BUTTONS_LEFT + MusicButton.instance.bounds.xSize
                    + X_SEPARATION_BUTTONS_LEFT + SoundButton.instance.bounds.xSize
                    + X_SEPARATION_BUTTONS_LEFT + PauseButton.instance.bounds.xSize
                    + X_SEPARATION_BUTTONS_LEFT + ResetButton.instance.bounds.xSize;
                var posRight = Engine.Renderer.xSizeView - X_BUTTONS_LEFT - ExitButton.instance.bounds.xSize;
                this.text.xAligned = posLeft + (posRight - posLeft) * 0.5;
                this.text.yAligned = 8;
            }
            */
            this.oldPaused = Game.SceneFreezer.paused;
        };
        SpeedrunTimer.prototype.onReset = function () {
            this.levelSteps = 0;
        };
        SpeedrunTimer.prototype.onViewUpdate = function () {
            this.fix();
        };
        SpeedrunTimer.getTextValue = function (stepsTime) {
            var text = "9999.999";
            if (stepsTime > 0) {
                var seconds = new Int32Array([stepsTime / 60]);
                if (seconds[0] <= 9999) {
                    var milliseconds = new Int32Array([(stepsTime - seconds[0] * 60) * 1000.0 * (1.0 / 60.0)]);
                    text = seconds[0] + ".";
                    if (milliseconds[0] < 10) {
                        text += "00" + milliseconds[0];
                    }
                    else if (milliseconds[0] < 100) {
                        text += "0" + milliseconds[0];
                    }
                    else {
                        text += milliseconds[0];
                    }
                }
            }
            //text = "9999.999";
            return text;
        };
        SpeedrunTimer.getValue = function (stepsTime) {
            var value = 9999999;
            if (stepsTime > 0) {
                var seconds = new Int32Array([stepsTime / 60]);
                if (seconds[0] <= 9999) {
                    var milliseconds = new Int32Array([(stepsTime - seconds[0] * 60) * 1000.0 * (1.0 / 60.0)]);
                    value = seconds[0] * 1000 + milliseconds[0];
                }
            }
            return value;
        };
        SpeedrunTimer.prototype.onStepUpdate = function () {
            if (!Game.Player.instance.winning && !Game.Player.instance.losing && !Game.SceneFreezer.stoped) {
                Game.Level.countStepsSpeedrun += 1;
                this.levelSteps++;
                this.text.str = SpeedrunTimer.getTextValue(Game.Level.countStepsSpeedrun);
                this.textDown.str = SpeedrunTimer.getTextValue(this.levelSteps);
            }
            if (this.oldPaused != Game.SceneFreezer.paused) {
                this.fix();
            }
        };
        return SpeedrunTimer;
    }(Engine.Entity));
    Game.SpeedrunTimer = SpeedrunTimer;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Arrows = /** @class */ (function (_super) {
        __extends(Arrows, _super);
        function Arrows() {
            var _this = _super.call(this) || this;
            _this.enabled = true;
            _this.xOffset = 0;
            _this.xOffset2 = 0;
            _this.yOffset = 0;
            _this.arrowLeft = new Utils.Text();
            _this.arrowLeft.owner = _this;
            _this.arrowLeft.str = ">";
            _this.arrowLeft.font = Game.FontManager.a;
            _this.arrowLeft.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.arrowLeft.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.arrowLeft.xAlignBounds = Utils.AnchorAlignment.END;
            _this.arrowLeft.yAlignBounds = Utils.AnchorAlignment.START;
            _this.arrowRight = new Utils.Text();
            _this.arrowRight.owner = _this;
            _this.arrowRight.str = "<";
            _this.arrowRight.font = Game.FontManager.a;
            _this.arrowRight.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.arrowRight.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.arrowRight.xAlignBounds = Utils.AnchorAlignment.START;
            _this.arrowRight.yAlignBounds = Utils.AnchorAlignment.START;
            return _this;
        }
        Object.defineProperty(Arrows.prototype, "font", {
            set: function (value) {
                this.arrowLeft.font = value;
                this.arrowRight.font = value;
            },
            enumerable: false,
            configurable: true
        });
        Arrows.prototype.onTimeUpdate = function () {
            this.arrowLeft.enabled = false;
            this.arrowRight.enabled = false;
            //console.log(this.bounds.selected);
            if (this.control.selected) {
                this.arrowLeft.enabled = this.enabled && this.bounds.enabled;
                this.arrowRight.enabled = this.enabled && this.bounds.enabled;
                this.arrowLeft.pinned = this.bounds.pinned;
                this.arrowRight.pinned = this.bounds.pinned;
                this.arrowLeft.xAligned = this.bounds.x - this.arrowLeft.font.xOffset - this.xOffset;
                this.arrowLeft.yAligned = this.bounds.y + this.yOffset;
                this.arrowRight.xAligned = this.bounds.x + this.bounds.xSize * this.bounds.xScale + this.arrowLeft.font.xOffset + this.xOffset + this.xOffset2;
                this.arrowRight.yAligned = this.bounds.y + this.yOffset;
            }
        };
        return Arrows;
    }(Engine.Entity));
    Game.Arrows = Arrows;
})(Game || (Game = {}));
var Utils;
(function (Utils) {
    var Font = /** @class */ (function () {
        function Font() {
            this.ySize = 0;
            this.xOffset = 0;
        }
        Font.prototype.setFull = function (texture, xTexture, yTexture, xOffset) {
            this.texture = texture;
            this.frames = Game.FrameSelector.complex("font", texture, xTexture, yTexture);
            this.xOffset = xOffset;
            this.ySize = this.frames[0].ySize;
            return this;
        };
        return Font;
    }());
    Utils.Font = Font;
})(Utils || (Utils = {}));
///<reference path="../Utils/Font.ts"/>
var Game;
(function (Game) {
    var FontManager = /** @class */ (function () {
        function FontManager() {
        }
        FontManager.createFondts = function () {
            FontManager.a = new Utils.Font();
            //FontManager.a.setFull(Resources.textureElina, 0, 233, 1);
            FontManager.a.setFull(Game.Resources.textureStilts, 0, 184, 0);
            FontManager.b = new Utils.Font();
            FontManager.b.setFull(Game.Resources.textureStilts, 0, 184, 0);
            FontManager.c = new Utils.Font();
            FontManager.c.setFull(Game.Resources.textureStilts, 0, 184, 0);
            FontManager.ads = new Utils.Font();
            FontManager.ads.setFull(Game.Resources.textureStilts, 0, 184, 0);
            FontManager.off = new Utils.Font();
            FontManager.off.setFull(Game.Resources.textureStilts, 0, 462, 0);
        };
        return FontManager;
    }());
    Game.FontManager = FontManager;
    Game.addAction("init", function () {
        FontManager.createFondts();
    });
})(Game || (Game = {}));
var Game;
(function (Game) {
    var offsetFrame = 0;
    var testFrames = null;
    Game.DEBUG_FRAME_SELECTOR = false;
    if (Game.DEBUG_FRAME_SELECTOR) {
        Game.addAction("start", function () {
            //console.log(testFrames);
            //console.log(JSON.stringify(testFrames));
        });
    }
    Game.xBlackFrameSelector = 1;
    Game.yBlackFrameSelector = 1;
    Game.xWhiteFrameSelector = 5;
    Game.yWhiteFrameSelector = 1;
    var FrameSelector = /** @class */ (function () {
        function FrameSelector() {
        }
        FrameSelector.complex = function (message, texture, x, y, frames, offset, extrude) {
            if (frames === void 0) { frames = new Array(); }
            if (offset === void 0) { offset = 0; }
            if (extrude === void 0) { extrude = false; }
            if (frames == null)
                frames = new Array();
            colorRect.r = texture.getRed(Game.xBlackFrameSelector, Game.yBlackFrameSelector);
            colorRect.g = texture.getGreen(Game.xBlackFrameSelector, Game.yBlackFrameSelector);
            colorRect.b = texture.getBlue(Game.xBlackFrameSelector, Game.yBlackFrameSelector);
            colorRect.a = texture.getAlpha(Game.xBlackFrameSelector, Game.yBlackFrameSelector);
            colorMark.r = texture.getRed(Game.xWhiteFrameSelector, Game.yWhiteFrameSelector);
            colorMark.g = texture.getGreen(Game.xWhiteFrameSelector, Game.yWhiteFrameSelector);
            colorMark.b = texture.getBlue(Game.xWhiteFrameSelector, Game.yWhiteFrameSelector);
            colorMark.a = texture.getAlpha(Game.xWhiteFrameSelector, Game.yWhiteFrameSelector);
            if (testFrames == null) {
                testFrames = {};
                if (Game.DEBUG_FRAME_SELECTOR) {
                    console.error("DEBUG_FRAME_SELECTOR ONLY FOR TESTING");
                }
            }
            if (Game.DEBUG_FRAME_SELECTOR) {
                console.log(message);
            }
            offsetFrame = offset;
            var oldLength = frames.length;
            findHorizontalFrames(frames, texture, x, y);
            var jsonFrames = {};
            var count = 0;
            for (var index = oldLength; index < frames.length; index += 1) {
                frames[index].extrude = extrude;
                jsonFrames[count + ""] = frames[index].getGeneric();
                count += 1;
            }
            testFrames[texture.path + " " + x + " " + y] = jsonFrames;
            return frames;
        };
        return FrameSelector;
    }());
    Game.FrameSelector = FrameSelector;
    var colorRect = { r: 0, g: 0, b: 0, a: 255 };
    var colorMark = { r: 255, g: 255, b: 255, a: 255 };
    function findHorizontalFrames(frames, texture, x, y) {
        var xLimit = xFindLimit(texture, x, y);
        var yLimit = yFindLimit(texture, x, y);
        var xSearch = x + 2;
        var ySearch = y + 2;
        while (xSearch < xLimit - 3) {
            var frame = new Utils.AnimationFrame();
            frames.push(frame);
            xSearch = initComplexFrame(frame, texture, xSearch, ySearch) + 1;
        }
        var color = {};
        copyColor(color, texture, x, yLimit);
        if (compareColor(color, colorRect)) {
            findHorizontalFrames(frames, texture, x, yLimit - 1);
        }
    }
    function initComplexFrame(frame, texture, x, y) {
        var xLimit = xFindLimit(texture, x, y);
        var yLimit = yFindLimit(texture, x, y);
        var colorSearch = {};
        var xMarkOffsetStart = 0;
        var xMarkOffsetEnd = 0;
        var xBoxStart = 0;
        var xBoxEnd = 0;
        for (var xIndex = x + 1; xIndex < xLimit - 1; xIndex += 1) {
            copyColor(colorSearch, texture, xIndex, y);
            if (compareColor(colorSearch, colorMark)) {
                if (xBoxStart == 0) {
                    xBoxStart = xIndex;
                }
                xBoxEnd = xIndex + 1;
            }
            copyColor(colorSearch, texture, xIndex, yLimit - 1);
            if (compareColor(colorSearch, colorMark)) {
                if (xMarkOffsetStart == 0) {
                    xMarkOffsetStart = xIndex;
                }
                xMarkOffsetEnd = xIndex + 1;
            }
        }
        var yMarkOffsetStart = 0;
        var yMarkOffsetEnd = 0;
        var yBoxStart = 0;
        var yBoxEnd = 0;
        for (var yIndex = y + 1; yIndex < yLimit - 1; yIndex += 1) {
            copyColor(colorSearch, texture, x, yIndex);
            if (compareColor(colorSearch, colorMark)) {
                if (yBoxStart == 0) {
                    yBoxStart = yIndex;
                }
                yBoxEnd = yIndex + 1;
            }
            copyColor(colorSearch, texture, xLimit - 1, yIndex);
            if (compareColor(colorSearch, colorMark)) {
                if (yMarkOffsetStart == 0) {
                    yMarkOffsetStart = yIndex;
                }
                yMarkOffsetEnd = yIndex + 1;
            }
        }
        frame.texture = texture;
        frame.xSize = xLimit - 2 - (x + 2) - offsetFrame * 2;
        frame.ySize = yLimit - 2 - (y + 2) - offsetFrame * 2;
        frame.xTexture = x + 2 + offsetFrame;
        frame.yTexture = y + 2 + offsetFrame;
        if (xMarkOffsetStart > 0) {
            frame.xOffset = frame.xTexture - xMarkOffsetStart - (xMarkOffsetEnd - xMarkOffsetStart) * 0.5;
        }
        if (yMarkOffsetStart > 0) {
            frame.yOffset = frame.yTexture - yMarkOffsetStart - (yMarkOffsetEnd - yMarkOffsetStart) * 0.5;
        }
        if (xBoxStart > 0) {
            frame.hasBox = true;
            frame.xSizeBox = xBoxEnd - xBoxStart;
            if (xMarkOffsetStart > 0) {
                frame.xOffsetBox = xBoxStart - xMarkOffsetStart - (xMarkOffsetEnd - xMarkOffsetStart) * 0.5;
            }
        }
        else if (yBoxStart > 0) {
            frame.hasBox = true;
            frame.xSizeBox = frame.xSize;
            if (xMarkOffsetStart > 0) {
                frame.xOffsetBox = frame.xTexture - xMarkOffsetStart - (xMarkOffsetEnd - xMarkOffsetStart) * 0.5;
            }
        }
        if (yBoxStart > 0) {
            frame.hasBox = true;
            frame.ySizeBox = yBoxEnd - yBoxStart;
            if (yMarkOffsetStart > 0) {
                frame.yOffsetBox = yBoxStart - yMarkOffsetStart - (yMarkOffsetEnd - yMarkOffsetStart) * 0.5;
            }
        }
        else if (xBoxStart > 0) {
            frame.hasBox = true;
            frame.ySizeBox = frame.ySize;
            if (yMarkOffsetStart > 0) {
                frame.yOffsetBox = frame.yTexture - yMarkOffsetStart - (yMarkOffsetEnd - yMarkOffsetStart) * 0.5;
            }
        }
        return xLimit;
    }
    function xFindLimit(texture, x, y) {
        var colorCompare = {};
        y += 1;
        do {
            x += 1;
            copyColor(colorCompare, texture, x, y);
        } while (!compareColor(colorCompare, colorRect) && !compareColor(colorCompare, colorMark));
        return x += 1;
    }
    function yFindLimit(texture, x, y) {
        var colorCompare = {};
        x += 1;
        do {
            y += 1;
            copyColor(colorCompare, texture, x, y);
        } while (!compareColor(colorCompare, colorRect) && !compareColor(colorCompare, colorMark));
        return y += 1;
    }
    function copyColor(color, texture, x, y) {
        color.r = texture.getRed(x, y);
        color.g = texture.getGreen(x, y);
        color.b = texture.getBlue(x, y);
        color.a = texture.getAlpha(x, y);
    }
    function compareColor(colorA, colorB) {
        return colorA.r == colorB.r && colorA.g == colorB.g && colorA.b == colorB.b && colorA.a == colorB.a;
    }
})(Game || (Game = {}));
/*
namespace Game{

    var offsetFrame = 0;
    var testFrames : any = null;
    var loadedFrames : any = null;

    export var DEBUG_FRAME_SELECTOR = true;

    if(DEBUG_FRAME_SELECTOR){
        addAction("start", ()=>{
            console.log(testFrames);
            console.log(JSON.stringify(testFrames));
        });
    }

    export class FrameSelector{
        static complex(message : string, texture : Engine.Texture, x : number, y : number, frames = new Array<Utils.AnimationFrame>(), offset = 0, extrude = true){
            if(frames == null) frames = new Array<Utils.AnimationFrame>();
            if(DEBUG_FRAME_SELECTOR){
                if(testFrames == null){
                    //alert("DEBUG_FRAME_SELECTOR ONLY FOR TESTING");
                    console.error("DEBUG_FRAME_SELECTOR ONLY FOR TESTING");
                    testFrames = {};
                }
                console.log(message);
                offsetFrame = offset;
                var oldLength = frames.length;
                findHorizontalFrames(frames, texture, x, y);
                var jsonFrames : any = {};
                var count = 0;
                for(var index = oldLength; index < frames.length; index += 1){
                    frames[index].extrude = extrude;
                    jsonFrames[count + ""] = frames[index].getGeneric();
                    count += 1;
                }
                testFrames[texture.path + " " + x + " " + y] = jsonFrames;
            }
            else{
                if(loadedFrames == null){
                    loadedFrames = JSON.parse(Engine.Assets.loadText(Resources.PATH_FRAMES));
                }
                var count = 0;
                var generic : any = loadedFrames[texture.path + " " + x + " " + y][count + ""];
                while(generic != null && generic != undefined){
                    frames.push(new Utils.AnimationFrame(texture, generic.xTexture, generic.yTexture, generic.xSize, generic.ySize, generic.xOffset, generic.yOffset, null, generic.hasBox, generic.xSizeBox, generic.ySizeBox, generic.xOffsetBox, generic.yOffsetBox));
                    count += 1;
                    generic = loadedFrames[texture.path + " " + x + " " + y][count + ""];
                }
            }
            return frames;
        }
    }

    var colorRect : any = {r : 0, g : 0, b : 0, a : 255};
    var colorMark : any = {r : 255, g : 255, b : 255, a : 255};

    function findHorizontalFrames(frames : Array<Utils.AnimationFrame>, texture : Engine.Texture, x : number, y : number){
        var xLimit = xFindLimit(texture, x, y);
        var yLimit = yFindLimit(texture, x, y);
        var xSearch = x + 2;
        var ySearch = y + 2;
        while(xSearch < xLimit - 3){
            var frame = new Utils.AnimationFrame();
            frames.push(frame);
            xSearch = initComplexFrame(frame, texture, xSearch, ySearch) + 1;
        }
        var color = {};
        copyColor(color, texture, x, yLimit);
        if(compareColor(color, colorRect)){
            findHorizontalFrames(frames, texture, x, yLimit - 1);
        }
    }

    function initComplexFrame(frame : Utils.AnimationFrame, texture : Engine.Texture, x : number, y : number){
        var xLimit = xFindLimit(texture, x, y);
        var yLimit = yFindLimit(texture, x, y);

        var colorSearch : any = {};

        var xMarkOffsetStart = 0;
        var xMarkOffsetEnd = 0;
        var xBoxStart = 0;
        var xBoxEnd = 0;
        for(var xIndex = x + 1; xIndex < xLimit - 1; xIndex += 1){
            copyColor(colorSearch, texture, xIndex, y);
            if(compareColor(colorSearch, colorMark)){
                if(xBoxStart == 0){
                    xBoxStart = xIndex;
                }
                xBoxEnd = xIndex + 1;
            }
            copyColor(colorSearch, texture, xIndex, yLimit - 1);
            if(compareColor(colorSearch, colorMark)){
                if(xMarkOffsetStart == 0){
                    xMarkOffsetStart = xIndex;
                }
                xMarkOffsetEnd = xIndex + 1;
            }
        }

        var yMarkOffsetStart = 0;
        var yMarkOffsetEnd = 0;
        var yBoxStart = 0;
        var yBoxEnd = 0;
        for(var yIndex = y + 1; yIndex < yLimit - 1; yIndex += 1){
            copyColor(colorSearch, texture, x, yIndex);
            if(compareColor(colorSearch, colorMark)){
                if(yBoxStart == 0){
                    yBoxStart = yIndex;
                }
                yBoxEnd = yIndex + 1;
            }
            copyColor(colorSearch, texture, xLimit - 1, yIndex);
            if(compareColor(colorSearch, colorMark)){
                if(yMarkOffsetStart == 0){
                    yMarkOffsetStart = yIndex;
                }
                yMarkOffsetEnd = yIndex + 1;
            }
        }
        
        frame.texture = texture;
        frame.xSize = xLimit - 2 - (x + 2) - offsetFrame * 2;
        frame.ySize = yLimit - 2 - (y + 2) - offsetFrame * 2
        frame.xTexture = x + 2 + offsetFrame;
        frame.yTexture = y + 2 + offsetFrame;
        if(xMarkOffsetStart > 0){
            frame.xOffset = frame.xTexture - xMarkOffsetStart - (xMarkOffsetEnd - xMarkOffsetStart) * 0.5;
        }
        if(yMarkOffsetStart > 0){
            frame.yOffset = frame.yTexture - yMarkOffsetStart - (yMarkOffsetEnd - yMarkOffsetStart) * 0.5;
        }

        if(xBoxStart > 0){
            frame.hasBox = true;
            frame.xSizeBox = xBoxEnd - xBoxStart;
            if(xMarkOffsetStart > 0){
                frame.xOffsetBox = xBoxStart - xMarkOffsetStart - (xMarkOffsetEnd - xMarkOffsetStart) * 0.5;
            }
        }
        else if(yBoxStart > 0){
            frame.hasBox = true;
            frame.xSizeBox = frame.xSize;
            if(xMarkOffsetStart > 0){
                frame.xOffsetBox = frame.xTexture - xMarkOffsetStart - (xMarkOffsetEnd - xMarkOffsetStart) * 0.5;
            }
        }

        if(yBoxStart > 0){
            frame.hasBox = true;
            frame.ySizeBox = yBoxEnd - yBoxStart;
            if(yMarkOffsetStart > 0){
                frame.yOffsetBox = yBoxStart - yMarkOffsetStart - (yMarkOffsetEnd - yMarkOffsetStart) * 0.5;
            }
        }
        else if(xBoxStart > 0){
            frame.hasBox = true;
            frame.ySizeBox = frame.ySize;
            if(yMarkOffsetStart > 0){
                frame.yOffsetBox = frame.yTexture - yMarkOffsetStart - (yMarkOffsetEnd - yMarkOffsetStart) * 0.5;
            }
        }
        
        return xLimit;
    }

    function xFindLimit(texture : Engine.Texture, x : number, y : number){
        var colorCompare : any = {};
        y += 1;
        do{
            x += 1;
            copyColor(colorCompare, texture, x, y);
        }
        while(!compareColor(colorCompare, colorRect) && !compareColor(colorCompare, colorMark));
        return x += 1;
    }

    function yFindLimit(texture : Engine.Texture, x : number, y : number){
        var colorCompare : any = {};
        x += 1;
        do{
            y += 1;
            copyColor(colorCompare, texture, x, y);
        }
        while(!compareColor(colorCompare, colorRect) && !compareColor(colorCompare, colorMark));
        return y += 1;
    }

    function copyColor(color : any, texture : Engine.Texture, x : number, y : number){
        color.r = texture.getRed(x, y);
        color.g = texture.getGreen(x, y);
        color.b = texture.getBlue(x, y);
        color.a = texture.getAlpha(x, y);
    }

    function compareColor(colorA : any, colorB : any){
        return colorA.r == colorB.r && colorA.g == colorB.g && colorA.b == colorB.b && colorA.a == colorB.a;
    }
}
*/ 
var Game;
(function (Game) {
    var PATH_MUSIC = "Assets/Audio/Komiku_-_25_-_Space_Bicycle.omw";
    var PATH_AUDIO_LOSE = "Assets/Audio/lose.wom";
    var PATH_AUDIO_STILTS = "Assets/Audio/stilts.wom";
    var PATH_AUDIO_STILTS_OFF = "Assets/Audio/stiltsoff.wom";
    var PATH_AUDIO_WIN = "Assets/Audio/win.wom";
    var PATH_AUDIO_BUTTON = "Assets/Audio/button.wom";
    var PATH_AUDIO_IN = "Assets/Audio/in.wom";
    var PATH_AUDIO_OUT = "Assets/Audio/out.wom";
    var PATH_AUDIO_POP = "Assets/Audio/pop.wom";
    var PATH_AUDIO_RES = "Assets/Audio/res.wom";
    Game.PATH_TEXTURE_STILTS_TILESET = "Assets/Graphics/StiltsTileset.png";
    Game.PATH_TEXTURE_STILTS = "Assets/Graphics/Stilts.png";
    Game.PATH_TEXTURE_MAP_BACK = "Assets/Graphics/MapBack.png";
    Game.PATH_TEXTURE_MAP_TERRAIN = "Assets/Graphics/MapTerrain.png";
    var PATH_GOOGLE_PLAY_LOGO = "Assets/Graphics/google-play-badge.png";
    var Resources = /** @class */ (function () {
        function Resources() {
        }
        //static bgmIndex = -1;
        Resources.playBGM = function () {
            Resources.bgms[0].extraGain.gain.value = 1;
            Resources.bgms[0].autoplay();
        };
        Resources.PATH_LEVEL_TEST = "Assets/Maps/LevelTest.json";
        Resources.PATH_TILESET = "Assets/Maps/Tileset.json";
        Resources.PATH_MAPS = "Assets/Maps/";
        Resources.PATH_MAP_NONE = Resources.PATH_MAPS + "None.json";
        Resources.PATH_MAP_SKY_NONE = Resources.PATH_MAPS + "SkyNone.json";
        Resources.PATH_MAP_SKY = Resources.PATH_MAPS + "Sky.json";
        Resources.PATH_MAP_PRELOADER = Resources.PATH_MAPS + "Preloader.json";
        Resources.PATH_MAP_MAIN_MENU = Resources.PATH_MAPS + "MainMenu.json";
        Resources.PATH_MAP_CREDITS = Resources.PATH_MAPS + "Credits.json";
        Resources.PATH_MAP_LEVEL_SELECTION = Resources.PATH_MAPS + "LevelSelection.json";
        Resources.PATH_MAP_MAIN_MENU_TOUCH = Resources.PATH_MAPS + "MainMenuTouch.json";
        Resources.PATH_MAP_LAST = Resources.PATH_MAPS + "LastScene.json";
        Resources.PATH_LEVEL = Resources.PATH_MAPS + "Level";
        Resources.bgms = [];
        Resources.bgmVolumeTracker = 1;
        return Resources;
    }());
    Game.Resources = Resources;
    function getPathLevel(index) {
        return Resources.PATH_LEVEL + "" + (index < 10 ? "0" : "") + index + ".json";
    }
    Game.getPathLevel = getPathLevel;
    Game.addPath("preload", Game.PATH_TEXTURE_STILTS);
    Game.addPath("preload", Game.PATH_TEXTURE_STILTS_TILESET);
    Game.addPath("preload", Game.PATH_TEXTURE_MAP_BACK);
    Game.addPath("preload", Game.PATH_TEXTURE_MAP_TERRAIN);
    Game.addPath("preload", Resources.PATH_TILESET);
    Game.addPath("preload", Resources.PATH_MAP_NONE);
    Game.addPath("preload", Resources.PATH_MAP_SKY_NONE);
    Game.addPath("preload", Resources.PATH_MAP_PRELOADER);
    Game.addPath("preload", Resources.PATH_MAP_MAIN_MENU);
    Game.addPath("load", Resources.PATH_MAP_SKY);
    Game.addPath("load", Resources.PATH_LEVEL_TEST);
    Game.addPath("load", Resources.PATH_MAP_MAIN_MENU_TOUCH);
    Game.addPath("load", Resources.PATH_MAP_CREDITS);
    Game.addPath("load", Resources.PATH_MAP_LEVEL_SELECTION);
    Game.addPath("load", Resources.PATH_MAP_LAST);
    for (var indexLevel = 1; indexLevel <= Game.MAX_LEVELS; indexLevel += 1) {
        Game.addPath("load", getPathLevel(indexLevel));
    }
    Game.addPath("load", PATH_MUSIC);
    Game.addPath("load", PATH_AUDIO_STILTS);
    Game.addPath("load", PATH_AUDIO_STILTS_OFF);
    Game.addPath("load", PATH_AUDIO_WIN);
    Game.addPath("load", PATH_AUDIO_LOSE);
    Game.addPath("load", PATH_AUDIO_BUTTON);
    Game.addPath("load", PATH_AUDIO_IN);
    Game.addPath("load", PATH_AUDIO_OUT);
    Game.addPath("load", PATH_AUDIO_POP);
    Game.addPath("load", PATH_AUDIO_RES);
    Game.addAction("preinit", function () {
        Resources.textureStilts = new Engine.Texture(Game.PATH_TEXTURE_STILTS, false, false);
        Resources.textureStilts.preserved = true;
        Resources.textureStiltsTileset = new Engine.Texture(Game.PATH_TEXTURE_STILTS_TILESET, false, false);
        Resources.textureStiltsTileset.preserved = true;
        Resources.textureMapBack = new Engine.Texture(Game.PATH_TEXTURE_MAP_BACK, false, false);
        Resources.textureMapBack.preserved = true;
        Resources.textureMapTerrain = new Engine.Texture(Game.PATH_TEXTURE_MAP_TERRAIN, false, false);
        Resources.textureMapTerrain.preserved = true;
        //Resources.sfxGameStart = new Engine.AudioPlayer(PATH_AUDIO_GAME_START);
        //Resources.sfxGameStart.preserved = true;
        //Resources.sfxGameStart.volume = Resources.sfxGameStart.restoreVolume = 5;
        if (Game.HAS_LINKS && Game.HAS_GOOGLE_PLAY_LOGOS) {
            Game.addPath("load", PATH_GOOGLE_PLAY_LOGO);
        }
    });
    Game.addAction("preconfigure", function () {
    });
    Game.addAction("configure", function () {
        if (Game.HAS_LINKS && Game.HAS_GOOGLE_PLAY_LOGOS) {
            Resources.textureGooglePlay = new Engine.Texture(PATH_GOOGLE_PLAY_LOGO, false, true);
            Resources.textureGooglePlay.preserved = true;
        }
        var volumeScale = 0.5;
        Resources.bgms[0] = new Engine.AudioPlayer(PATH_MUSIC);
        Resources.bgms[0].preserved = true;
        Resources.bgms[0].volume = Resources.bgms[0].restoreVolume = 3.1 * volumeScale;
        Resources.bgms[0].loopStart = 5.5 * 0;
        Resources.bgms[0].loopEnd = 44.137930;
        Game.bgms.push(Resources.bgms[0]);
        Resources.sfxStilts = new Engine.AudioPlayer(PATH_AUDIO_STILTS);
        Resources.sfxStilts.preserved = true;
        Resources.sfxStilts.volume = Resources.sfxStilts.restoreVolume = 7.5 * volumeScale;
        Game.sfxs.push(Resources.sfxStilts);
        Resources.sfxStiltsOff = new Engine.AudioPlayer(PATH_AUDIO_STILTS_OFF);
        Resources.sfxStiltsOff.preserved = true;
        Resources.sfxStiltsOff.volume = Resources.sfxStiltsOff.restoreVolume = 4.3 * volumeScale;
        Game.sfxs.push(Resources.sfxStiltsOff);
        Resources.sfxLose = new Engine.AudioPlayer(PATH_AUDIO_LOSE);
        Resources.sfxLose.preserved = true;
        Resources.sfxLose.volume = Resources.sfxLose.restoreVolume = 4.5 * volumeScale;
        Game.sfxs.push(Resources.sfxLose);
        Resources.sfxWin = new Engine.AudioPlayer(PATH_AUDIO_WIN);
        Resources.sfxWin.preserved = true;
        Resources.sfxWin.volume = Resources.sfxWin.restoreVolume = 6.5 * volumeScale;
        Game.sfxs.push(Resources.sfxWin);
        Resources.sfxButton = new Engine.AudioPlayer(PATH_AUDIO_BUTTON);
        Resources.sfxButton.preserved = true;
        Resources.sfxButton.volume = Resources.sfxButton.restoreVolume = 5.0 * volumeScale;
        Game.sfxs.push(Resources.sfxButton);
        Resources.sfxIn = new Engine.AudioPlayer(PATH_AUDIO_IN);
        Resources.sfxIn.preserved = true;
        Resources.sfxIn.volume = Resources.sfxIn.restoreVolume = 4.5 * volumeScale;
        Game.sfxs.push(Resources.sfxIn);
        Resources.sfxOut = new Engine.AudioPlayer(PATH_AUDIO_OUT);
        Resources.sfxOut.preserved = true;
        Resources.sfxOut.volume = Resources.sfxOut.restoreVolume = 6.0 * volumeScale;
        Game.sfxs.push(Resources.sfxOut);
        Resources.sfxPop = new Engine.AudioPlayer(PATH_AUDIO_POP);
        Resources.sfxPop.preserved = true;
        Resources.sfxPop.volume = Resources.sfxPop.restoreVolume = 4.5 * volumeScale;
        Game.sfxs.push(Resources.sfxPop);
        Resources.sfxRes = new Engine.AudioPlayer(PATH_AUDIO_RES);
        Resources.sfxRes.preserved = true;
        Resources.sfxRes.volume = Resources.sfxRes.restoreVolume = 7.3 * volumeScale;
        Game.sfxs.push(Resources.sfxRes);
        if (Resources.bgmVolumeTracker < 1) {
            Game.muteAll();
        }
    });
})(Game || (Game = {}));
///<reference path="../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var SceneColors = /** @class */ (function (_super) {
        __extends(SceneColors, _super);
        function SceneColors() {
            var _this = _super.call(this) || this;
            _this.usingFill = false;
            SceneColors.instance = _this;
            _this.fillUp = new Engine.Sprite();
            _this.fillUp.enabled = true;
            _this.fillUp.pinned = true;
            _this.fillUp.y = -60 - 8 - 8;
            _this.fillUp.xSize = 160;
            _this.fillUp.xOffset = -80;
            _this.fillUp.setRGBA(Game.Resources.textureStiltsTileset.getRed(57, 57) / 255.0, Game.Resources.textureStiltsTileset.getGreen(57, 57) / 255.0, Game.Resources.textureStiltsTileset.getBlue(57, 57) / 255.0, Game.Resources.textureStiltsTileset.getAlpha(57, 57) / 255.0);
            _this.fillDown = new Engine.Sprite();
            _this.fillDown.enabled = true;
            _this.fillDown.pinned = true;
            _this.fillDown.y = 120 - 48;
            _this.fillDown.xSize = 160;
            _this.fillDown.xOffset = -80;
            _this.fillDown.setRGBA(Game.Resources.textureStiltsTileset.getRed(1, 49) / 255.0, Game.Resources.textureStiltsTileset.getGreen(1, 49) / 255.0, Game.Resources.textureStiltsTileset.getBlue(1, 49) / 255.0, Game.Resources.textureStiltsTileset.getAlpha(1, 49) / 255.0);
            return _this;
        }
        Object.defineProperty(SceneColors, "enabledDown", {
            set: function (value) {
                SceneColors.instance.fillDown.enabled = value;
            },
            enumerable: false,
            configurable: true
        });
        SceneColors.init = function () {
            new SceneColors();
            //console.error("REMEMBER TO CHANGE THIS FOR COLOR SCHEMES. FADE AND PAUSE ALSO");
        };
        SceneColors.prototype.onDrawSceneFill = function () {
            if (!this.usingFill)
                return;
            this.fillUp.enabled = true;
            this.fillUp.pinned = true;
            this.fillDown.enabled = true;
            this.fillDown.pinned = true;
            if (Engine.Renderer.xFitView) {
                this.fillUp.ySize = Engine.Renderer.ySizeView;
                this.fillUp.yOffset = -Engine.Renderer.ySizeView;
                this.fillUp.render();
                this.fillDown.ySize = Engine.Renderer.ySizeView;
                this.fillDown.render();
            }
        };
        SceneColors.prototype.onClearScene = function () {
            SceneColors.instance = null;
            this.usingFill = false;
        };
        return SceneColors;
    }(Engine.Entity));
    Game.SceneColors = SceneColors;
})(Game || (Game = {}));
///<reference path="../../Engine/Entity.ts"/>
var Utils;
(function (Utils) {
    var Fade = /** @class */ (function (_super) {
        __extends(Fade, _super);
        function Fade() {
            var _this = _super.call(this) || this;
            _this.speed = 0.0166666666666667 * 4;
            _this.direction = -1;
            _this.alpha = 1;
            _this.red = 234.0 / 255.0;
            _this.green = 247.0 / 255.0;
            _this.blue = 196.0 / 255.0;
            _this.maxAlpha = 1;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            _this.sprite.setRGBA(_this.red, _this.green, _this.blue, _this.maxAlpha);
            _this.onViewUpdate();
            return _this;
        }
        Fade.prototype.onViewUpdate = function () {
            this.sprite.xSize = Engine.Renderer.xSizeView;
            this.sprite.ySize = Engine.Renderer.ySizeView;
            this.sprite.x = -Engine.Renderer.xSizeView * 0.5;
            this.sprite.y = -Engine.Renderer.ySizeView * 0.5;
        };
        Fade.prototype.onStepUpdateFade = function () {
            if (this.direction != 0) {
                this.alpha += this.speed * this.direction;
                if (this.direction < 0 && this.alpha <= 0) {
                    this.direction = 0;
                    this.alpha = 0;
                    this.sprite.setRGBA(this.red, this.green, this.blue, 0);
                }
                else if (this.direction > 0 && this.alpha >= this.maxAlpha) {
                    this.direction = 0;
                    this.alpha = this.maxAlpha;
                    this.sprite.setRGBA(this.red, this.green, this.blue, this.maxAlpha);
                }
            }
        };
        Fade.prototype.onTimeUpdate = function () {
            if (this.direction != 0) {
                var extAlpha = this.alpha + this.speed * this.direction * Engine.System.stepExtrapolation;
                if (this.direction < 0 && extAlpha < 0) {
                    extAlpha = 0;
                }
                else if (this.direction > 0 && extAlpha > this.maxAlpha) {
                    extAlpha = this.maxAlpha;
                }
                this.sprite.setRGBA(this.red, this.green, this.blue, extAlpha);
            }
        };
        Fade.prototype.onDrawFade = function () {
            this.sprite.render();
        };
        return Fade;
    }(Engine.Entity));
    Utils.Fade = Fade;
})(Utils || (Utils = {}));
///<reference path="../../Utils/Fade.ts"/>
var Game;
(function (Game) {
    var instance = null;
    var SceneFade = /** @class */ (function (_super) {
        __extends(SceneFade, _super);
        function SceneFade() {
            return _super.call(this) || this;
        }
        Object.defineProperty(SceneFade, "speed", {
            set: function (value) {
                instance.speed = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneFade, "filled", {
            get: function () {
                return instance.alpha == 1;
            },
            enumerable: false,
            configurable: true
        });
        SceneFade.init = function () {
            instance = instance || new SceneFade();
            instance.preserved = true;
            instance.speed = 0.0833 * (0.75);
        };
        SceneFade.setColor = function (red, green, blue) {
            //red = 0;
            //green = 0;
            //blue = 0;
            instance.red = red / 255;
            instance.green = green / 255;
            instance.blue = blue / 255;
        };
        SceneFade.isBlack = function () {
            //console.log(instance.red + " " + instance.green + " " + instance.blue);
            return instance.red == 0 && instance.blue == 0 && instance.green == 0;
        };
        SceneFade.trigger = function () {
            instance.direction = 1;
        };
        SceneFade.prototype.onReset = function () {
            this.direction = -1;
        };
        SceneFade.prototype.onStepUpdate = function () {
            if (!Game.Scene.waiting && Game.Scene.nextSceneClass != null && this.direction != 1 && (Game.LevelAdLoader.instance == null || !Game.LevelAdLoader.blocked)) {
                Game.Scene.instance.onFadeLinStart();
                this.direction = 1;
            }
        };
        return SceneFade;
    }(Utils.Fade));
    Game.SceneFade = SceneFade;
})(Game || (Game = {}));
///<reference path="../../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var instance = null;
    var SceneFreezer = /** @class */ (function (_super) {
        __extends(SceneFreezer, _super);
        function SceneFreezer() {
            var _this = _super.call(this) || this;
            _this.requirePauseSwitch = false;
            _this.paused = false;
            if (!(Game.Scene.instance instanceof Game.Level)) {
                _this.paused = false;
                _this.requirePauseSwitch = false;
            }
            return _this;
        }
        Object.defineProperty(SceneFreezer, "paused", {
            get: function () {
                return instance.paused;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneFreezer, "stoped", {
            get: function () {
                return Game.Scene.nextSceneClass != null || instance.paused || Game.SceneOrientator.blocked || (Game.LevelAdLoader.instance != null && Game.LevelAdLoader.blocked);
            },
            enumerable: false,
            configurable: true
        });
        SceneFreezer.switchPause = function () {
            instance.requirePauseSwitch = !instance.requirePauseSwitch;
        };
        SceneFreezer.init = function () {
            instance = new SceneFreezer();
        };
        SceneFreezer.prototype.onReset = function () {
            this.paused = false;
        };
        SceneFreezer.prototype.onStepUpdate = function () {
            if (this.requirePauseSwitch) {
                this.paused = !this.paused;
                this.requirePauseSwitch = false;
            }
        };
        SceneFreezer.prototype.onClearScene = function () {
            instance = null;
        };
        return SceneFreezer;
    }(Engine.Entity));
    Game.SceneFreezer = SceneFreezer;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var instance = null;
    var ready = false;
    var SceneOrientator = /** @class */ (function (_super) {
        __extends(SceneOrientator, _super);
        function SceneOrientator() {
            var _this = _super.call(this) || this;
            var yOffset = 24 - 6;
            _this.text0 = new Utils.Text();
            _this.text0.font = Game.FontManager.a;
            _this.text0.scale = 1;
            _this.text0.enabled = true;
            _this.text0.pinned = true;
            _this.text0.str = "PLEASE ROTATE";
            _this.text0.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text0.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text0.yAlignBounds = Utils.AnchorAlignment.START;
            _this.text0.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text0.xAligned = 0;
            _this.text0.yAligned = yOffset;
            _this.text0.front = true;
            _this.text1 = new Utils.Text();
            _this.text1.font = Game.FontManager.a;
            _this.text1.scale = 1;
            _this.text1.enabled = true;
            _this.text1.pinned = true;
            _this.text1.str = "YOUR DEVICE";
            _this.text1.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text1.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text1.yAlignBounds = Utils.AnchorAlignment.START;
            _this.text1.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text1.xAligned = 0;
            _this.text1.yAligned = yOffset + 8;
            _this.text1.front = true;
            _this.device = new Engine.Sprite();
            _this.device.enabled = true;
            _this.device.pinned = true;
            _this.device.y = 0 - 6;
            FRAMES[0].applyToSprite(_this.device);
            _this.fill = new Engine.Sprite();
            _this.fill.enabled = true;
            _this.fill.pinned = true;
            _this.fill.setRGBA(0 / 255, 88 / 255, 248 / 255, 1);
            _this.onViewUpdate();
            return _this;
        }
        Object.defineProperty(SceneOrientator, "blocked", {
            get: function () {
                return instance != null && instance.fill.enabled;
            },
            enumerable: false,
            configurable: true
        });
        SceneOrientator.init = function () {
            if (Game.TRACK_ORIENTATION && ready) {
                instance = instance || new SceneOrientator();
            }
        };
        SceneOrientator.prototype.onViewUpdate = function () {
            this.fill.enabled = Engine.Renderer.xSizeView < Engine.Renderer.ySizeView;
            this.device.enabled = this.fill.enabled;
            this.text0.enabled = this.fill.enabled;
            this.text1.enabled = this.fill.enabled;
            this.fill.x = -Engine.Renderer.xSizeView * 0.5;
            this.fill.y = -Engine.Renderer.ySizeView * 0.5;
            this.fill.xSize = Engine.Renderer.xSizeView;
            this.fill.ySize = Engine.Renderer.ySizeView;
        };
        SceneOrientator.prototype.onDrawOrientationUI = function () {
            this.fill.render();
            this.device.render();
        };
        SceneOrientator.prototype.onClearScene = function () {
            instance = null;
        };
        return SceneOrientator;
    }(Engine.Entity));
    Game.SceneOrientator = SceneOrientator;
    var FRAMES = null;
    Game.addAction("init", function () {
        //FRAMES = FrameSelector.complex(Resources.texture, 13, 74);
        //ready = true;
    });
})(Game || (Game = {}));
///<reference path="../../Engine/Entity.ts"/>
var Utils;
(function (Utils) {
    var AnchorAlignment;
    (function (AnchorAlignment) {
        AnchorAlignment[AnchorAlignment["START"] = 0] = "START";
        AnchorAlignment[AnchorAlignment["MIDDLE"] = 1] = "MIDDLE";
        AnchorAlignment[AnchorAlignment["END"] = 2] = "END";
    })(AnchorAlignment = Utils.AnchorAlignment || (Utils.AnchorAlignment = {}));
    var Anchor = /** @class */ (function (_super) {
        __extends(Anchor, _super);
        function Anchor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._bounds = null;
            _this._xAlignView = AnchorAlignment.MIDDLE;
            _this._yAlignView = AnchorAlignment.MIDDLE;
            _this._xAlignBounds = AnchorAlignment.MIDDLE;
            _this._yAlignBounds = AnchorAlignment.MIDDLE;
            _this._xAligned = 0;
            _this._yAligned = 0;
            return _this;
        }
        Object.defineProperty(Anchor.prototype, "bounds", {
            get: function () {
                return this._bounds;
            },
            set: function (value) {
                this._bounds = value;
                this.fix();
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Anchor.prototype, "xAlignView", {
            get: function () {
                return this._xAlignView;
            },
            set: function (value) {
                this._xAlignView = value;
                this.fix();
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Anchor.prototype, "yAlignView", {
            get: function () {
                return this._yAlignView;
            },
            set: function (value) {
                this._yAlignView = value;
                this.fix();
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Anchor.prototype, "xAlignBounds", {
            get: function () {
                return this._xAlignBounds;
            },
            set: function (value) {
                this._xAlignBounds = value;
                this.fix();
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Anchor.prototype, "yAlignBounds", {
            get: function () {
                return this._yAlignBounds;
            },
            set: function (value) {
                this._yAlignBounds = value;
                this.fix();
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Anchor.prototype, "xAligned", {
            get: function () {
                return this._xAligned;
            },
            set: function (value) {
                this._xAligned = value;
                this.fix();
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Anchor.prototype, "yAligned", {
            get: function () {
                return this._yAligned;
            },
            set: function (value) {
                this._yAligned = value;
                this.fix();
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Anchor.prototype, "x", {
            get: function () {
                return this._bounds.x;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Anchor.prototype, "y", {
            get: function () {
                return this._bounds.y;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Anchor.prototype.fix = function () {
            this.xFix();
            this.yFix();
        };
        Anchor.prototype.xFix = function () {
            var xSizeBounds = this.bounds == null ? 0 : this.bounds.xSize;
            var xScaleBounds = this.bounds == null ? 1 : this.bounds.xScale;
            var x = 0;
            switch (this._xAlignView) {
                case AnchorAlignment.START:
                    x = -Engine.Renderer.xSizeView * 0.5 + this._xAligned;
                    switch (this._xAlignBounds) {
                        case AnchorAlignment.START:
                            break;
                        case AnchorAlignment.MIDDLE:
                            x -= xSizeBounds * xScaleBounds * 0.5;
                            break;
                        case AnchorAlignment.END:
                            x -= xSizeBounds * xScaleBounds;
                            break;
                    }
                    break;
                case AnchorAlignment.MIDDLE:
                    x = this._xAligned;
                    switch (this._xAlignBounds) {
                        case AnchorAlignment.START:
                            break;
                        case AnchorAlignment.MIDDLE:
                            x -= xSizeBounds * xScaleBounds * 0.5;
                            break;
                        case AnchorAlignment.END:
                            x -= xSizeBounds * xScaleBounds;
                            break;
                    }
                    break;
                case AnchorAlignment.END:
                    x = Engine.Renderer.xSizeView * 0.5 + this._xAligned - (xSizeBounds * xScaleBounds);
                    switch (this._xAlignBounds) {
                        case AnchorAlignment.START:
                            x += xSizeBounds * xScaleBounds;
                            break;
                        case AnchorAlignment.MIDDLE:
                            x += xSizeBounds * xScaleBounds * 0.5;
                            break;
                        case AnchorAlignment.END:
                            break;
                    }
                    break;
            }
            this._bounds.x = x;
        };
        Anchor.prototype.yFix = function () {
            var ySizeBounds = this.bounds == null ? 0 : this.bounds.ySize;
            var yScaleBounds = this.bounds == null ? 1 : this.bounds.yScale;
            var y = 0;
            switch (this._yAlignView) {
                case AnchorAlignment.START:
                    y = -Engine.Renderer.ySizeView * 0.5 + this._yAligned;
                    switch (this._yAlignBounds) {
                        case AnchorAlignment.START:
                            break;
                        case AnchorAlignment.MIDDLE:
                            y -= ySizeBounds * yScaleBounds * 0.5;
                            break;
                        case AnchorAlignment.END:
                            y -= ySizeBounds * yScaleBounds;
                            break;
                    }
                    break;
                case AnchorAlignment.MIDDLE:
                    y = this._yAligned;
                    switch (this._yAlignBounds) {
                        case AnchorAlignment.START:
                            break;
                        case AnchorAlignment.MIDDLE:
                            y -= ySizeBounds * yScaleBounds * 0.5;
                            break;
                        case AnchorAlignment.END:
                            y -= ySizeBounds * yScaleBounds;
                            break;
                    }
                    break;
                case AnchorAlignment.END:
                    y = Engine.Renderer.ySizeView * 0.5 + this._yAligned - (ySizeBounds * yScaleBounds);
                    switch (this._yAlignBounds) {
                        case AnchorAlignment.START:
                            y += ySizeBounds * yScaleBounds;
                            break;
                        case AnchorAlignment.MIDDLE:
                            y += ySizeBounds * yScaleBounds * 0.5;
                            break;
                        case AnchorAlignment.END:
                            break;
                    }
                    break;
            }
            this._bounds.y = y;
        };
        Anchor.prototype.setFullPosition = function (xAlignView, yAlignView, xAlignBounds, yAlignBounds, xAligned, yAligned) {
            this._xAlignView = xAlignView;
            this._yAlignView = yAlignView;
            this._xAlignBounds = xAlignBounds;
            this._yAlignBounds = yAlignBounds;
            this._xAligned = xAligned;
            this._yAligned = yAligned;
            this.fix();
            return this;
        };
        //@ts-ignore
        Anchor.prototype.onViewUpdateAnchor = function () {
            this.fix();
        };
        return Anchor;
    }(Engine.Entity));
    Utils.Anchor = Anchor;
})(Utils || (Utils = {}));
///<reference path = "../../Engine/Entity.ts"/>
/*
namespace Game.UI{
    var FRAMES_DEFAULT : Array<Utils.AnimationFrame>;

    addAction("configure", ()=>{
        FRAMES_DEFAULT = FrameSelector.complex("dialog default a", Resources.texture, 21, 159);
        //FRAMES_DEFAULT = FrameSelector.complex("dialog default b", Resources.texture, 45, 159, FRAMES_DEFAULT);
    });

    export class Dialog extends Engine.Entity implements Engine.Bounds{
        private bounds : Engine.InteractableBounds;
        private anchor : Utils.Anchor;

        private dirty = false;

        private spriteTopLeft : Engine.Sprite;
        private spriteTop : Engine.Sprite;
        private spriteTopRight : Engine.Sprite;
        private spriteLeft : Engine.Sprite;
        private spriteMiddle : Engine.Sprite;
        private spriteRight : Engine.Sprite;
        private spriteBottomLeft : Engine.Sprite;
        private spriteBottom : Engine.Sprite;
        private spriteBottomRight : Engine.Sprite;
        private spriteIcon : Engine.Sprite;

        private sprites : Array<Engine.Sprite>;

        public set enabled(value : boolean){
            this.bounds.enabled = value;
            for(var sprite of this.sprites){
                sprite.enabled = this.bounds.enabled;
            }
            this.spriteIcon.enabled = this.bounds.enabled && this.frames.length > 9;
        }
        public get enabled(){
            return this.bounds.enabled;
        }

        public set pinned(value : boolean){
            this.bounds.pinned = value;
            for(var sprite of this.sprites){
                sprite.pinned = this.bounds.pinned;
            }
        }
        public get pinned(){
            return this.bounds.pinned;
        }

        private _frames : Array<Utils.AnimationFrame>;
        public set frames(value : Array<Utils.AnimationFrame>){
            this._frames = value;
            this.dirty = true;
        }
        public get frames(){
            return this._frames;
        }

        public set x(_value : number){
            //this.bounds.x = value;
            //this.dirty = true;
            console.warn("UNIMPLEMENTED");
        }
        public get x(){
            return this.bounds.x;
        }

        public set xAlignView(value : Utils.AnchorAlignment){
            this.anchor.xAlignView = value;
            this.dirty = true;
        }
        public get xAlignView(){
            return this.anchor.xAlignView;
        }

        public set xAlignBounds(value : Utils.AnchorAlignment){
            this.anchor.xAlignBounds = value;
            this.dirty = true;
        }
        public get xAlignBounds(){
            return this.anchor.xAlignBounds;
        }

        public set xAligned(value : number){
            this.anchor.xAligned = value;
            this.dirty = true;
        }
        public get xAligned(){
            return this.anchor.xAlignView;
        }

        public set y(_value : number){
            //this.bounds.y = value;
            //this.dirty = true;
            console.warn("UNIMPLEMENTED");
        }
        public get y(){
            return this.bounds.y;
        }

        public set yAlignView(value : Utils.AnchorAlignment){
            this.anchor.yAlignView = value;
            this.dirty = true;
        }
        public get yAlignView(){
            return this.anchor.yAlignView;
        }

        public set yAlignBounds(value : Utils.AnchorAlignment){
            this.anchor.yAlignBounds = value;
            this.dirty = true;
        }
        public get yAlignBounds(){
            return this.anchor.yAlignBounds;
        }

        public set yAligned(value : number){
            this.anchor.yAligned = value;
            this.dirty = true;
        }
        public get yAligned(){
            return this.anchor.yAlignView;
        }

        private _xSize : number;
        public set xSize(value : number){
            this._xSize = value;
            this.bounds.xSize = this._xSize;
            this.anchor.bounds = this.bounds;
            this.dirty = true;
        }
        public get xSize(){
            return this._xSize;
        }

        private _ySize : number;
        public set ySize(value : number){
            this._ySize = value;
            this.bounds.ySize = this._ySize;
            this.anchor.bounds = this.bounds;
            this.dirty = true;
        }
        public get ySize(){
            return this._ySize;
        }

        public set xOffset(value : number){
            this.bounds.xOffset = value;
            this.dirty = true;
        }
        public get xOffset(){
            return this.bounds.xOffset;
        }

        public set yOffset(value : number){
            this.bounds.yOffset = value;
            this.dirty = true;
        }
        public get yOffset(){
            return this.bounds.yOffset;
        }

        public set xScale(_value : number){
            
        }
        public get xScale(){
            return this.bounds.xScale;
        }

        public set yScale(_value : number){
            
        }
        public get yScale(){
            return this.bounds.yScale;
        }

        public set xMirror(_value : boolean){
            
        }
        public get xMirror(){
            return this.bounds.xMirror;
        }

        public set yMirror(_value : boolean){
           
        }
        public get yMirror(){
            return this.bounds.yMirror;
        }

        public set angle(_value : number){
            
        }
        public get angle(){
            return this.bounds.angle;
        }

        public set useTouchRadius(value : boolean){
            this.bounds.useTouchRadius = value;
        }
        public get useTouchRadius(){
            return this.bounds.useTouchRadius;
        }

        public set data(value : any){
            this.bounds.data = value;
        }
        public get data(){
            return this.bounds.data;
        }

        public get mouseOver(){
            return this.bounds.mouseOver;
        }
        
        public get touched(){
            return this.bounds.touched;
        }

        public get pointed(){
            return this.bounds.pointed;
        }

        public constructor(frames : Array<Utils.AnimationFrame> = null){
            super();
            this.bounds = new Engine.InteractableBounds();
            this.anchor = new Utils.Anchor();
            this.anchor.bounds = this.bounds;
            this._xSize = this.bounds.xSize;
            this._ySize = this.bounds.ySize;
            this.sprites = [];
            this.spriteTopLeft = new Engine.Sprite();
            this.sprites.push(this.spriteTopLeft);
            this.spriteTop = new Engine.Sprite();
            this.sprites.push(this.spriteTop);
            this.spriteTopRight = new Engine.Sprite();
            this.sprites.push(this.spriteTopRight);
            this.spriteLeft = new Engine.Sprite();
            this.sprites.push(this.spriteLeft);
            this.spriteMiddle = new Engine.Sprite();
            this.sprites.push(this.spriteMiddle);
            this.spriteRight = new Engine.Sprite();
            this.sprites.push(this.spriteRight);
            this.spriteBottomLeft = new Engine.Sprite();
            this.sprites.push(this.spriteBottomLeft);
            this.spriteBottom = new Engine.Sprite();
            this.sprites.push(this.spriteBottom);
            this.spriteBottomRight = new Engine.Sprite();
            this.sprites.push(this.spriteBottomRight);
            this.spriteIcon = new Engine.Sprite();
            this.sprites.push(this.spriteIcon);
            this.frames = frames || FRAMES_DEFAULT;
            this.enabled = true;
            this.pinned = true;
        }

        public pointInside(x : number, y :number, radius : number){
            return this.bounds.pointInside(x, y, radius);
        }

        protected onDrawDialogs(){
            this.render();
        }

        public render(){
            if(this.dirty){
                this.fix();
                this.anchor.fix();
            }
            for(var sprite of this.sprites){
                sprite.render();
            }
        }
        
        protected fix(){
            var lengthArraySprites = this.frames.length > 9 ? 10 : 9;
            for(var indexSprite = 0; indexSprite < lengthArraySprites; indexSprite += 1){
                this.frames[indexSprite].applyToSprite(this.sprites[indexSprite]);
            }
            if(lengthArraySprites == 10){
                this._xSize = this._xSize < this.spriteIcon.xSize ? this.spriteIcon.xSize : this._xSize;
                this._ySize = this._ySize < this.spriteIcon.ySize ? this.spriteIcon.ySize : this._ySize;
            }
            this.spriteTop.xSize = this._xSize;
            this.spriteBottom.xSize = this._xSize;
            this.spriteLeft.ySize = this._ySize;
            this.spriteRight.ySize = this._ySize;
            this.spriteMiddle.xSize = this._xSize;
            this.spriteMiddle.ySize = this._ySize;
            this.bounds.xSize = this.spriteLeft.xSize + this.spriteRight.xSize + this._xSize;
            this.bounds.ySize = this.spriteLeft.ySize + this.spriteBottom.ySize + this._ySize;
            this.spriteTopLeft.x = this.bounds.x;
            this.spriteTop.x = this.bounds.x + this.spriteTopLeft.xSize;
            this.spriteTopRight.x = this.bounds.x + this.spriteTopLeft.xSize + this.spriteTop.xSize;
            this.spriteLeft.x = this.bounds.x;
            this.spriteMiddle.x = this.bounds.x + this.spriteTopLeft.xSize;
            this.spriteRight.x = this.bounds.x + this.spriteTopLeft.xSize + this.spriteTop.xSize;
            this.spriteBottomLeft.x = this.bounds.x;
            this.spriteBottom.x = this.bounds.x + this.spriteTopLeft.xSize;
            this.spriteBottomRight.x = this.bounds.x + this.spriteTopLeft.xSize + this.spriteTop.xSize;
            this.spriteTopLeft.y = this.bounds.y;
            this.spriteLeft.y = this.bounds.y + this.spriteTopLeft.ySize;
            this.spriteBottomLeft.y = this.bounds.y + this.spriteTopLeft.ySize + this.spriteLeft.ySize;
            this.spriteTop.y = this.bounds.y;
            this.spriteMiddle.y = this.bounds.y + this.spriteTopLeft.ySize;
            this.spriteBottom.y = this.bounds.y + this.spriteTopLeft.ySize + this.spriteLeft.ySize;
            this.spriteTopRight.y = this.bounds.y;
            this.spriteRight.y = this.bounds.y + this.spriteTopLeft.ySize;
            this.spriteBottomRight.y = this.bounds.y + this.spriteTopLeft.ySize + this.spriteLeft.ySize;
            if(lengthArraySprites == 10){
                this.spriteIcon.x = this.bounds.x + this.spriteTopLeft.xSize;
                this.spriteIcon.y = this.bounds.y + this.spriteTopLeft.ySize;
            }
            for(var sprite of this.sprites){
                sprite.xOffset = this.xOffset;
                sprite.yOffset = this.yOffset;
            }
        }

        //@ts-ignore
        public setRGBA(red : number, green : number, blue : number, alpha : number){
            
        }
    }
}
*/ 
///<reference path="Anchor.ts"/>
var Utils;
(function (Utils) {
    var Text = /** @class */ (function (_super) {
        __extends(Text, _super);
        function Text() {
            var _this = _super.call(this) || this;
            _this.sprites = new Array();
            _this.front = false;
            _this._enabled = false;
            _this._pinned = false;
            _this._str = null;
            _this._font = null;
            _this._underlined = false;
            _this._scale = 1;
            _this.superback = false;
            _this._bounds = new Engine.Sprite();
            _this.underline = new Engine.Sprite();
            _this.underline2 = new Engine.Sprite();
            //if(this.underlined){
            //this.underline.setRGBAFromTexture(Game.Resources.textureStiltsTileset, 26, 42);
            //this.underline2.setRGBAFromTexture(Game.Resources.textureStiltsTileset, 18, 34);
            //}
            _this._bounds.setRGBA(1, 1, 1, 0.2);
            return _this;
        }
        Text.prototype.setEnabled = function (value) {
            this._enabled = value;
            this._bounds.enabled = value;
            for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.enabled = false;
            }
            if (this._str != null) {
                for (var indexSprite = 0; indexSprite < this._str.length; indexSprite += 1) {
                    this.sprites[indexSprite].enabled = value;
                }
            }
            if (this._underlined) {
                this.underline.enabled = value;
                this.underline2.enabled = value;
            }
        };
        Object.defineProperty(Text.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this.setEnabled(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "pinned", {
            get: function () {
                return this._pinned;
            },
            set: function (value) {
                this._pinned = value;
                this._bounds.pinned = value;
                for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
                    var sprite = _a[_i];
                    sprite.pinned = value;
                }
                if (this._underlined) {
                    this.underline.pinned = value;
                    this.underline2.pinned = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "str", {
            get: function () {
                return this._str;
            },
            set: function (value) {
                this._str = value;
                this.fixStr();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "font", {
            get: function () {
                return this._font;
            },
            set: function (value) {
                this._font = value;
                this.fixStr();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "underlined", {
            get: function () {
                return this._underlined;
            },
            set: function (value) {
                this._underlined = value;
                this.fixStr();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            set: function (value) {
                this._scale = value;
                this.fixStr();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "a", {
            get: function () {
                return this.sprites[0].alpha;
            },
            enumerable: false,
            configurable: true
        });
        Text.prototype.setRGBA = function (r, g, b, a) {
            for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
                var sprite = _a[_i];
                sprite.setRGBA(r, g, b, a);
            }
            if (this._underlined) {
                //this.underline.setRGBA(r, g, b, a);
                //this.underline2.setRGBA(r, g, b, a);
            }
        };
        Text.prototype.fixStr = function () {
            if (this._str != null && this._font != null) {
                for (var indexSprite = this.sprites.length; indexSprite < this._str.length; indexSprite += 1) {
                    this.sprites.push(new Engine.Sprite());
                }
                for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
                    var sprite = _a[_i];
                    sprite.enabled = false;
                }
                var xSizeText = 0;
                for (var indexChar = 0; indexChar < this._str.length; indexChar += 1) {
                    var sprite = this.sprites[indexChar];
                    sprite.enabled = this._enabled;
                    sprite.pinned = this._pinned;
                    var charDef = this._font.frames[this._str.charCodeAt(indexChar) - " ".charCodeAt(0)];
                    sprite.setFull(this._enabled, this._pinned, this._font.texture, charDef.xSize * this._scale, this._font.ySize * this._scale, 0, 0, charDef.xTexture, charDef.yTexture, charDef.xSize, this._font.ySize);
                    xSizeText += sprite.xSize + this._font.xOffset * this._scale;
                }
                this._bounds.enabled = this._enabled;
                this._bounds.pinned = this._pinned;
                this._bounds.xSize = xSizeText - this._font.xOffset * this._scale;
                this._bounds.ySize = this._font.ySize * this._scale;
                if (this._underlined) {
                    this.underline.enabled = this._enabled;
                    this.underline.pinned = this._pinned;
                    this.underline.xSize = this._bounds.xSize;
                    this.underline.ySize = this._scale;
                    this.underline2.enabled = this._enabled;
                    this.underline2.pinned = this._pinned;
                    this.underline2.xSize = this._bounds.xSize;
                    this.underline2.ySize = this._scale;
                    this._bounds.ySize += this._scale * 2;
                }
                this.fix();
            }
        };
        Text.prototype.fix = function () {
            _super.prototype.fix.call(this);
            if (this._str != null && this._font != null) {
                var x = this._bounds.x;
                for (var indexChar = 0; indexChar < this._str.length; indexChar += 1) {
                    var sprite = this.sprites[indexChar];
                    sprite.x = x;
                    sprite.y = this._bounds.y;
                    x += sprite.xSize + this._font.xOffset * this._scale;
                }
                if (this._underlined) {
                    this.underline.x = this._bounds.x;
                    this.underline.y = this._bounds.y + this._bounds.ySize - this.scale;
                    this.underline2.x = this._bounds.x + this.scale - 2;
                    this.underline2.y = this._bounds.y + this._bounds.ySize;
                }
            }
        };
        Text.prototype.onViewUpdateText = function () {
            this.fix();
        };
        Text.prototype.onDrawTextSuperBack = function () {
            if (this.superback) {
                //this._bounds.render();
                for (var indexSprite = 0; indexSprite < this.sprites.length; indexSprite += 1) {
                    this.sprites[indexSprite].render();
                }
                if (this._underlined) {
                    this.underline.render();
                    this.underline2.render();
                }
            }
        };
        Text.prototype.onDrawText = function () {
            if (!this.front && !this.superback) {
                //this._bounds.render();
                for (var indexSprite = 0; indexSprite < this.sprites.length; indexSprite += 1) {
                    this.sprites[indexSprite].render();
                }
                if (this._underlined) {
                    this.underline.render();
                    this.underline2.render();
                }
            }
        };
        Text.prototype.onDrawTextFront = function () {
            if (this.front && !this.superback) {
                //this._bounds.render();
                for (var indexSprite = 0; indexSprite < this.sprites.length; indexSprite += 1) {
                    this.sprites[indexSprite].render();
                }
                if (this._underlined) {
                    this.underline.render();
                    this.underline2.render();
                }
            }
        };
        return Text;
    }(Utils.Anchor));
    Utils.Text = Text;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Animation = /** @class */ (function () {
        function Animation(name, loop, frames, steps, indexArray, stepArray) {
            if (name === void 0) { name = ""; }
            if (loop === void 0) { loop = false; }
            if (frames === void 0) { frames = null; }
            if (steps === void 0) { steps = 0; }
            if (indexArray === void 0) { indexArray = null; }
            if (stepArray === void 0) { stepArray = null; }
            this.loop = false;
            this.name = name;
            this.loop = loop;
            this.frames = frames;
            this.steps = steps;
            this.indexArray = indexArray;
            this.stepArray = stepArray;
        }
        return Animation;
    }());
    Utils.Animation = Animation;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    Utils.FRAME_EXTRUSION = 0.5;
    var AnimationFrame = /** @class */ (function () {
        function AnimationFrame(texture, xTexture, yTexture, xSize, ySize, xOffset, yOffset, data, hasBox, xSizeBox, ySizeBox, xOffsetBox, yOffsetBox) {
            if (texture === void 0) { texture = null; }
            if (xTexture === void 0) { xTexture = 0; }
            if (yTexture === void 0) { yTexture = 0; }
            if (xSize === void 0) { xSize = 0; }
            if (ySize === void 0) { ySize = 0; }
            if (xOffset === void 0) { xOffset = 0; }
            if (yOffset === void 0) { yOffset = 0; }
            if (data === void 0) { data = null; }
            if (hasBox === void 0) { hasBox = false; }
            if (xSizeBox === void 0) { xSizeBox = 0; }
            if (ySizeBox === void 0) { ySizeBox = 0; }
            if (xOffsetBox === void 0) { xOffsetBox = 0; }
            if (yOffsetBox === void 0) { yOffsetBox = 0; }
            this.xTexture = 0;
            this.yTexture = 0;
            this.xSize = 0;
            this.ySize = 0;
            this.xOffset = 0;
            this.yOffset = 0;
            this.hasBox = false;
            this.xSizeBox = 0;
            this.ySizeBox = 0;
            this.xOffsetBox = 0;
            this.yOffsetBox = 0;
            this.extrude = false;
            this.texture = texture;
            this.xTexture = xTexture;
            this.yTexture = yTexture;
            this.xSize = xSize;
            this.ySize = ySize;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
            this.data = data;
            this.hasBox = hasBox;
            this.xSizeBox = xSizeBox;
            this.ySizeBox = ySizeBox;
            this.xOffsetBox = xOffsetBox;
            this.yOffsetBox = yOffsetBox;
        }
        AnimationFrame.prototype.applyToSprite = function (sprite) {
            if (this.extrude) {
                sprite.setFull(sprite.enabled, sprite.pinned, this.texture, this.xSize + Utils.FRAME_EXTRUSION, this.ySize + Utils.FRAME_EXTRUSION, this.xOffset - Utils.FRAME_EXTRUSION * 0.5, this.yOffset - Utils.FRAME_EXTRUSION * 0.5, this.xTexture - Utils.FRAME_EXTRUSION * 0.5, this.yTexture - Utils.FRAME_EXTRUSION * 0.5, this.xSize + Utils.FRAME_EXTRUSION, this.ySize + Utils.FRAME_EXTRUSION);
            }
            else {
                sprite.setFull(sprite.enabled, sprite.pinned, this.texture, this.xSize, this.ySize, this.xOffset, this.yOffset, this.xTexture, this.yTexture, this.xSize, this.ySize);
            }
            //sprite.setFull(sprite.enabled, sprite.pinned, this.texture, this.xSize + extra, this.ySize + extra, this.xOffset - extra * 0.5, this.yOffset - extra * 0.5, this.xTexture - 0.25, this.yTexture - 0.25, this.xSize + 0.5, this.ySize + 0.5);
        };
        AnimationFrame.prototype.applyToBox = function (box) {
            if (this.hasBox) {
                box.xSize = this.xSizeBox;
                box.ySize = this.ySizeBox;
                box.xOffset = this.xOffsetBox;
                box.yOffset = this.yOffsetBox;
            }
        };
        AnimationFrame.prototype.applyToBoxEx = function (box) {
            if (this.hasBox) {
                box.xSize = this.xSizeBox;
                box.ySize = this.ySizeBox;
                box.xOffset = this.xOffsetBox;
                box.yOffset = this.yOffsetBox;
            }
            else {
                box.enabled = false;
            }
        };
        AnimationFrame.prototype.getGeneric = function () {
            var generic = {};
            generic.xTexture = this.xTexture;
            generic.yTexture = this.yTexture;
            generic.xSize = this.xSize;
            generic.ySize = this.ySize;
            generic.xOffset = this.xOffset;
            generic.yOffset = this.yOffset;
            generic.hasBox = this.hasBox;
            generic.xSizeBox = this.xSizeBox;
            generic.ySizeBox = this.ySizeBox;
            generic.xOffsetBox = this.xOffsetBox;
            generic.yOffsetBox = this.yOffsetBox;
            return generic;
        };
        AnimationFrame.framesFromGrid = function (texture, xTexture, yTexture, columns, maxFrames, xStartOffsetFrame, yStartOffsetFrame, xSeparationFrame, ySeparationFrame, xSizeFrame, ySizeFrame, xStartFrame, yStartFrame, xOffsetFrame, yOffsetFrame, data) {
            var frames = [];
            var indexFrame = 0;
            var y = 0;
            do {
                for (var x = 0; x < columns && indexFrame < maxFrames; x += 1) {
                    var anim = new AnimationFrame();
                    anim.texture = texture;
                    anim.xTexture = xTexture + xStartOffsetFrame + xStartFrame * (xSizeFrame + xSeparationFrame) + x * (xSizeFrame + xSeparationFrame);
                    anim.yTexture = yTexture + yStartOffsetFrame + yStartFrame * (ySizeFrame + ySeparationFrame) + y * (ySizeFrame + ySeparationFrame);
                    anim.xSize = xSizeFrame;
                    anim.ySize = ySizeFrame;
                    anim.xOffset = xOffsetFrame;
                    anim.yOffset = yOffsetFrame;
                    anim.data = data;
                    frames.push(anim);
                    indexFrame += 1;
                }
                y += 1;
            } while (indexFrame < maxFrames);
            return frames;
        };
        return AnimationFrame;
    }());
    Utils.AnimationFrame = AnimationFrame;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var Animator = /** @class */ (function (_super) {
        __extends(Animator, _super);
        function Animator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.indexFrame = 0;
            _this.countSteps = 0;
            _this.cycles = 0;
            _this.enabled = true;
            return _this;
        }
        Object.defineProperty(Animator.prototype, "ended", {
            get: function () {
                return this.cycles > 0;
            },
            enumerable: false,
            configurable: true
        });
        Animator.prototype.reset = function () {
            this.indexFrame = 0;
            this.countSteps = 0;
            this.cycles = 0;
        };
        Animator.prototype.setCurrentFrame = function () {
            if (this.animation != null) {
                var indexFrame = this.animation.indexArray != null ? this.animation.indexArray[this.indexFrame] : this.indexFrame;
                var frame = this.animation.frames[indexFrame];
                if (this.listener != null) {
                    this.listener.onSetFrame(this, this.animation, frame);
                }
            }
        };
        Animator.prototype.setAnimation = function (animation, preserveStatus) {
            if (preserveStatus === void 0) { preserveStatus = false; }
            this.animation = animation;
            if (!preserveStatus) {
                this.indexFrame = 0;
                this.countSteps = 0;
                this.cycles = 0;
            }
            this.setCurrentFrame();
        };
        Animator.prototype.onAnimationUpdate = function () {
            if (!Game.SceneFreezer.stoped && this.enabled && this.animation != null && (this.animation.loop || this.cycles < 1)) {
                var indexFrame = this.animation.indexArray != null ? this.animation.indexArray[this.indexFrame] : this.indexFrame;
                var steps = this.animation.stepArray != null ? this.animation.stepArray[indexFrame] : this.animation.steps;
                if (this.countSteps >= steps) {
                    this.countSteps = 0;
                    this.indexFrame += 1;
                    var length = this.animation.indexArray != null ? this.animation.indexArray.length : this.animation.frames.length;
                    if (this.indexFrame >= length) {
                        this.indexFrame = this.animation.loop ? 0 : length - 1;
                        this.cycles += 1;
                    }
                    this.setCurrentFrame();
                }
                this.countSteps += 1;
            }
        };
        return Animator;
    }(Engine.Entity));
    Utils.Animator = Animator;
})(Utils || (Utils = {}));
///<reference path="../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var Control = /** @class */ (function (_super) {
        __extends(Control, _super);
        function Control() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._enabled = false;
            _this._selected = false;
            _this._url = null;
            _this.linkCondition = function () { return true; };
            _this.onLinkTrigger = null;
            _this.useMouse = false;
            _this.useKeyboard = false;
            _this.useTouch = false;
            _this.newInteractionRequired = false;
            _this.blockOthersSelection = false;
            _this.freezeable = false;
            _this._firstDown = false;
            _this._firstUp = false;
            _this.firstUpdate = false;
            _this._downSteps = 0;
            _this._stepsSincePressed = 0;
            _this._upSteps = 0;
            _this._stepsSinceReleased = 0;
            _this._touchDown = false;
            return _this;
        }
        Object.defineProperty(Control.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this.setEnabled(value);
            },
            enumerable: false,
            configurable: true
        });
        Control.prototype.setEnabled = function (value) {
            var oldEnabled = this.enabled;
            this._enabled = value;
            if (value != oldEnabled) {
                if (value) {
                    this.onEnable();
                }
                else {
                    if (this._selected) {
                        this._selected = false;
                        if (this._url != null) {
                            Engine.LinkManager.remove(this, this._url);
                        }
                        this.onSelectionEnd();
                    }
                    this.onDisable();
                }
            }
        };
        Object.defineProperty(Control.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "url", {
            get: function () {
                return this._url;
            },
            set: function (value) {
                if (this._url != null) {
                    Engine.LinkManager.remove(this, this._url);
                }
                this._url = value;
                if (this._url != null) {
                    Engine.LinkManager.add(this, this._url);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "downSteps", {
            get: function () {
                return this._downSteps;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "stepsSincePressed", {
            get: function () {
                return this._stepsSincePressed;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "pressed", {
            get: function () {
                return this._downSteps == 1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "down", {
            get: function () {
                return this._downSteps > 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "upSteps", {
            get: function () {
                return this._upSteps;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "stepsSinceReleased", {
            get: function () {
                return this._stepsSinceReleased;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "released", {
            get: function () {
                return this._upSteps == 1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "up", {
            get: function () {
                return !this.down;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "touchDown", {
            get: function () {
                return this._touchDown;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "touchPressed", {
            get: function () {
                return this._touchDown && this.pressed;
            },
            enumerable: false,
            configurable: true
        });
        Control.prototype.onEnable = function () {
            if (this.onEnableDelegate != null) {
                this.onEnableDelegate.call(this.listener);
            }
        };
        Control.prototype.onDisable = function () {
            if (this.onDisableDelegate != null) {
                this.onDisableDelegate.call(this.listener);
            }
        };
        Control.prototype.onSelectionStart = function () {
            if (this.onSelectionStartDelegate != null) {
                this.onSelectionStartDelegate.call(this.listener);
            }
        };
        Control.prototype.onSelectionStay = function () {
            if (this.onSelectionStayDelegate != null) {
                this.onSelectionStayDelegate.call(this.listener);
            }
        };
        Control.prototype.onSelectionEnd = function () {
            if (this.onSelectionEndDelegate != null) {
                this.onSelectionEndDelegate.call(this.listener);
            }
        };
        Control.prototype.onPressed = function () {
            if (this.onPressedDelegate != null) {
                this.onPressedDelegate.call(this.listener);
            }
        };
        Control.prototype.onReleased = function () {
            if (this.onReleasedDelegate != null) {
                this.onReleasedDelegate.call(this.listener);
            }
        };
        //TODO: Not optimal, change it
        Control.prototype.onClearScene = function () {
            if (this.url != null) {
                Engine.LinkManager.remove(this, this._url);
            }
        };
        //TODO: Not optimal, change it
        Control.prototype.onControlPreUpdate = function () {
            Control.selectionBlocker = null;
        };
        Control.prototype.onControlUpdate = function () {
            if (Game.LevelAdLoader.instance != null && Game.LevelAdLoader.blocked) {
                return;
            }
            var oldSelected = this._selected;
            this.mouseSelected = false;
            this.touchSelected = false;
            var selectedAudio = false;
            var pressedAudio = false;
            if (this.enabled) {
                this.mouseSelected = this.useMouse && (this.bounds == null || this.bounds.mouseOver);
                this.touchSelected = this.useTouch && (this.bounds == null || this.bounds.touched);
                if ((this.freezeable && Game.SceneFreezer.stoped) || Control.selectionBlocker != null) {
                    this.mouseSelected = false;
                    this.touchSelected = false;
                }
                if (!this._selected && (this.mouseSelected || this.touchSelected)) {
                    this._selected = true;
                    this.onSelectionStart();
                    selectedAudio = true;
                }
                else if (this._selected && !(this.mouseSelected || this.touchSelected)) {
                    this._selected = false;
                    this.onSelectionEnd();
                }
                if (this._selected && this.blockOthersSelection) {
                    Control.selectionBlocker = this;
                }
                var used = false;
                if (this.mouseSelected && this.mouseButtons != null) {
                    for (var _i = 0, _a = this.mouseButtons; _i < _a.length; _i++) {
                        var buttonIndex = _a[_i];
                        if (this.newInteractionRequired) {
                            used = this._downSteps == 0 ? Engine.Mouse.pressed(buttonIndex) : Engine.Mouse.down(buttonIndex);
                        }
                        else {
                            used = Engine.Mouse.down(buttonIndex);
                        }
                        if (used) {
                            break;
                        }
                    }
                }
                var touchUsed = false;
                if (this.touchSelected) {
                    if (this.newInteractionRequired) {
                        if (this.bounds != null) {
                            touchUsed = this._downSteps == 0 ? this.bounds.pointed : this.bounds.touched;
                        }
                        else {
                            if (this._downSteps == 0) {
                                touchUsed = Engine.TouchInput.pressed(0, 0, Engine.Renderer.xSizeWindow, Engine.Renderer.ySizeWindow, true);
                            }
                            else {
                                touchUsed = Engine.TouchInput.down(0, 0, Engine.Renderer.xSizeWindow, Engine.Renderer.ySizeWindow, true);
                            }
                        }
                    }
                    else {
                        if (this.bounds != null) {
                            touchUsed = this.bounds.touched;
                        }
                        else {
                            touchUsed = Engine.TouchInput.down(0, 0, Engine.Renderer.xSizeWindow, Engine.Renderer.ySizeWindow, true);
                        }
                    }
                    used = used || touchUsed;
                }
                if (!used && this.useKeyboard && !(this.freezeable && Game.SceneFreezer.stoped)) {
                    for (var _b = 0, _c = this.keys; _b < _c.length; _b++) {
                        var key = _c[_b];
                        if (this.newInteractionRequired) {
                            used = this._downSteps == 0 ? Engine.Keyboard.pressed(key) : Engine.Keyboard.down(key);
                        }
                        else {
                            used = Engine.Keyboard.down(key);
                        }
                        if (used) {
                            break;
                        }
                    }
                }
                if (used) {
                    this._firstDown = true;
                    this._downSteps += 1;
                    this._upSteps = 0;
                    this._touchDown = touchUsed;
                    if (this.pressed) {
                        this._stepsSincePressed = 0;
                        this.onPressed();
                        pressedAudio = true;
                    }
                }
                else if (this._firstDown) {
                    this._firstUp = true;
                    this._downSteps = 0;
                    this._upSteps += 1;
                    this._touchDown = false;
                    if (this.released) {
                        this._stepsSinceReleased = 0;
                        this.onReleased();
                    }
                }
                if (this._firstDown) {
                    this._stepsSincePressed += 1;
                }
                if (this._firstUp) {
                    this._stepsSinceReleased += 1;
                }
            }
            if (this._selected && oldSelected) {
                this.onSelectionStay();
            }
            if (pressedAudio) {
                if (this.audioPressed != null) {
                    this.audioPressed.play();
                }
            }
            else if (selectedAudio) {
                if (this.audioSelected != null && this.firstUpdate && !this.touchSelected) {
                    this.audioSelected.play();
                }
            }
            this.firstUpdate = true;
        };
        Control.selectionBlocker = null;
        return Control;
    }(Engine.Entity));
    Game.Control = Control;
})(Game || (Game = {}));
/*

        protected onControlUpdate(){
            var oldSelected = this._selected;
            if(this.enabled){
                var mouseSelected = this.useMouse && (this.bounds == null || this.bounds.mouseOver);
                var boundsTouched = false;
                if(this.useTouch && this.bounds != null){
                    if(this.newInteractionRequired){
                        boundsTouched = this._downSteps == 0 ? this.bounds.pointed : this.bounds.touched;
                    }
                    else{
                        boundsTouched = this.bounds.touched;
                    }
                }
                else if(this.useTouch && this.bounds == null){
                    if(this.newInteractionRequired){
                        if(this._downSteps == 0){
                            boundsTouched = Engine.TouchInput.down(0, 0, Engine.Renderer.xSizeWindow, Engine.Renderer.ySizeWindow, true);
                        }
                        else{

                        }
                    }
                    else{
                        
                    }

                    
                }
                var touchSelected = boundsTouched || (this.useTouch && this.bounds == null);
                if((this.freezeable && Scene.freezed) || Control.selectionBlocker != null){
                    mouseSelected = false;
                    boundsTouched = false;
                    touchSelected = false;
                }
                if(!this._selected && (mouseSelected || touchSelected)){
                    this._selected = true;
                    if(this._url != null){
                        Engine.LinkManager.add(this, this._url);
                    }
                    this.onSelectionStart();
                }
                else if(this._selected && !(mouseSelected || touchSelected)){
                    this._selected = false;
                    if(this._url != null){
                        Engine.LinkManager.remove(this, this._url);
                    }
                    this.onSelectionEnd();
                }
                if(this._selected && this.blockOthersSelection){
                    Control.selectionBlocker = this;
                }
                var used = false;
                if(mouseSelected && this.mouseButtons != null){
                    for(var buttonIndex of this.mouseButtons){
                        if(this.newInteractionRequired){
                            used = this._downSteps == 0 ? Engine.Mouse.pressed(buttonIndex) : Engine.Mouse.down(buttonIndex);
                        }
                        else{
                            used = Engine.Mouse.down(buttonIndex);
                        }
                        if(used){
                            break;
                        }
                    }
                }
                var touchUsed = false;
                if(this.useTouch && touchSelected){
                    if(this.bounds == null){
                        touchUsed = Engine.TouchInput.down(0, 0, Engine.Renderer.xSizeWindow, Engine.Renderer.ySizeWindow, true);
                    }
                    else{
                        touchUsed = boundsTouched;
                    }
                    used = used || touchUsed;
                }
                if(!used && this.useKeyboard && !(this.freezeable && Scene.freezed)){
                    for(var key of this.keys){
                        if(this.newInteractionRequired){
                            used = this._downSteps == 0 ? Engine.Keyboard.pressed(key) : Engine.Keyboard.down(key);
                        }
                        else{
                            used = Engine.Keyboard.down(key);
                        }
                        if(used){
                            break;
                        }
                    }
                }
                if(used){
                    this._firstDown = true;
                    this._downSteps += 1;
                    this._upSteps = 0;
                    this._touchDown = touchUsed;
                    if(this.pressed){
                        this._stepsSincePressed = 0;
                        this.onPressed();
                    }
                }
                else if(this._firstDown){
                    this._firstUp = true;
                    this._downSteps = 0;
                    this._upSteps += 1;
                    if(this.released){
                        this._stepsSinceReleased = 0;
                        this.onReleased();
                    }
                }
                if(!this.pressed){
                     = false;
                }
                if(this._firstDown){
                    this._stepsSincePressed += 1;
                }
                if(this._firstUp){
                    this._stepsSinceReleased += 1;
                }
            }
            if(this._selected && oldSelected){
                this.onSelectionStay();
            }
        }
    }
}
*/ 
///<reference path="../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var Dialog = /** @class */ (function (_super) {
        __extends(Dialog, _super);
        function Dialog(x, y, xSize, ySize) {
            var _this = _super.call(this) || this;
            _this.up = new Engine.Sprite();
            _this.left = new Engine.Sprite();
            _this.down = new Engine.Sprite();
            _this.right = new Engine.Sprite();
            _this.fill = new Engine.Sprite();
            _this.leftShadow = new Engine.Sprite();
            _this.downBand = new Engine.Sprite();
            _this.upLight = new Engine.Sprite();
            _this.rightLight = new Engine.Sprite();
            _this.upAnchor = new Utils.Anchor();
            _this.leftAnchor = new Utils.Anchor();
            _this.rightAnchor = new Utils.Anchor();
            _this.downAnchor = new Utils.Anchor();
            _this.fillAnchor = new Utils.Anchor();
            _this.leftShadowAnchor = new Utils.Anchor();
            _this.downBandAnchor = new Utils.Anchor();
            _this.upLightAnchor = new Utils.Anchor();
            _this.rightLightAnchor = new Utils.Anchor();
            _this.x = x;
            _this.y = y;
            _this.up.enabled = true;
            _this.up.pinned = true;
            _this.up.xSize = xSize - 2;
            _this.up.ySize = 1;
            _this.upAnchor.bounds = _this.up;
            _this.upAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.upAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.upAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.upAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.upAnchor.xAligned = x + 1 - xSize * 0.5;
            _this.upAnchor.yAligned = y;
            _this.upLight.enabled = true;
            _this.upLight.pinned = true;
            _this.upLight.xSize = 1;
            _this.upLight.ySize = 1;
            _this.upLight.setRGBA(255.0 / 255.0, 201.0 / 255.0, 148.0 / 255.0, 1);
            _this.upLightAnchor.bounds = _this.upLight;
            _this.upLightAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.upLightAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.upLightAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.upLightAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.upLightAnchor.xAligned = x + 1 + xSize * 0.5 - 3;
            _this.upLightAnchor.yAligned = y;
            _this.left.enabled = true;
            _this.left.pinned = true;
            _this.left.xSize = 1;
            _this.left.ySize = ySize - 2;
            _this.leftAnchor.bounds = _this.left;
            _this.leftAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.leftAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.leftAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.leftAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.leftAnchor.xAligned = x - xSize * 0.5;
            _this.leftAnchor.yAligned = y + 1;
            _this.down.enabled = true;
            _this.down.pinned = true;
            _this.down.xSize = xSize - 2;
            _this.down.ySize = 1;
            _this.downAnchor.bounds = _this.down;
            _this.downAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.downAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.downAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.downAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.downAnchor.xAligned = x + 1 - xSize * 0.5;
            _this.downAnchor.yAligned = y + ySize - 1;
            _this.downBand.enabled = true;
            _this.downBand.pinned = true;
            _this.downBand.xSize = xSize - 2;
            _this.downBand.ySize = 2;
            _this.downBandAnchor.bounds = _this.downBand;
            _this.downBandAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.downBandAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.downBandAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.downBandAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.downBandAnchor.xAligned = x + 2 - xSize * 0.5 - 2;
            _this.downBandAnchor.yAligned = y + ySize - 1;
            _this.right.enabled = true;
            _this.right.pinned = true;
            _this.right.xSize = 1;
            _this.right.ySize = ySize - 2;
            _this.rightAnchor.bounds = _this.right;
            _this.rightAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.rightAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.rightAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.rightAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.rightAnchor.xAligned = x + xSize * 0.5 - 1;
            _this.rightAnchor.yAligned = y + 1;
            _this.rightLight.enabled = true;
            _this.rightLight.pinned = true;
            _this.rightLight.xSize = 1;
            _this.rightLight.ySize = 2;
            _this.rightLight.setRGBA(255.0 / 255.0, 201.0 / 255.0, 148.0 / 255.0, 1);
            _this.rightLightAnchor.bounds = _this.rightLight;
            _this.rightLightAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.rightLightAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.rightLightAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.rightLightAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.rightLightAnchor.xAligned = x + xSize * 0.5 - 1;
            _this.rightLightAnchor.yAligned = y + 1;
            _this.leftShadow.enabled = true;
            _this.leftShadow.pinned = true;
            _this.leftShadow.xSize = 1;
            _this.leftShadow.ySize = ySize - 2;
            _this.leftShadowAnchor.bounds = _this.leftShadow;
            _this.leftShadowAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.leftShadowAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.leftShadowAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.leftShadowAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.leftShadowAnchor.xAligned = x - xSize * 0.5 - 1;
            _this.leftShadowAnchor.yAligned = y + 2;
            _this.fill.enabled = true;
            _this.fill.pinned = true;
            _this.fill.xSize = xSize - 2;
            _this.fill.ySize = ySize - 2;
            _this.fillAnchor.bounds = _this.fill;
            _this.fillAnchor.xAlignBounds = Utils.AnchorAlignment.START;
            _this.fillAnchor.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.fillAnchor.yAlignBounds = Utils.AnchorAlignment.START;
            _this.fillAnchor.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.fillAnchor.xAligned = x - xSize * 0.5 + 1;
            _this.fillAnchor.yAligned = y + 1;
            return _this;
        }
        Object.defineProperty(Dialog.prototype, "enabled", {
            set: function (value) {
                this.up.enabled = value;
                this.left.enabled = value;
                this.down.enabled = value;
                this.right.enabled = value;
                this.fill.enabled = value;
                this.leftShadow.enabled = value;
                this.downBand.enabled = value;
                this.upLight.enabled = value;
                this.rightLight.enabled = value;
            },
            enumerable: false,
            configurable: true
        });
        Dialog.prototype.setBorderColor = function (red, green, blue, alpha) {
            this.up.setRGBA(red / 255, green / 255, blue / 255, alpha);
            this.left.setRGBA(red / 255, green / 255, blue / 255, alpha);
            this.right.setRGBA(red / 255, green / 255, blue / 255, alpha);
            this.down.setRGBA(red / 255, green / 255, blue / 255, alpha);
        };
        Dialog.prototype.setFillColor = function (red, green, blue, alpha) {
            this.fill.setRGBA(red / 255, green / 255, blue / 255, alpha);
        };
        Dialog.prototype.setBandColor = function (red, green, blue, alpha) {
            this.leftShadow.setRGBA(red * 0 / 255, green * 0 / 255, blue * 0 / 255, alpha);
            this.downBand.setRGBA(red * 0 / 255, green * 0 / 255, blue * 0 / 255, alpha);
        };
        Dialog.prototype.setBandDisabled = function () {
            this.leftShadow.setRGBA(120.0 / 255, 120.0 / 255, 120.0 / 255, 1);
            this.downBand.setRGBA(120.0 / 255, 120.0 / 255, 120.0 / 255, 1);
        };
        Dialog.prototype.setAlpha = function (alpha) {
            this.up.setRGBA(this.up.red, this.up.green, this.up.blue, alpha);
            this.left.setRGBA(this.left.red, this.left.green, this.left.blue, alpha);
            this.right.setRGBA(this.right.red, this.right.green, this.right.blue, alpha);
            this.down.setRGBA(this.down.red, this.down.green, this.down.blue, alpha);
            this.leftShadow.setRGBA(this.leftShadow.red, this.leftShadow.green, this.leftShadow.blue, alpha);
            this.downBand.setRGBA(this.downBand.red, this.downBand.green, this.downBand.blue, alpha);
            //this.upLight.setRGBA(this.upLight.red , this.upLight.green, this.upLight.blue, alpha);
            //this.rightLight.setRGBA(this.rightLight.red, this.rightLight.green, this.rightLight.blue, alpha);
            this.upLight.setRGBA(1, 1, 1, alpha);
            this.rightLight.setRGBA(1, 1, 1, alpha);
            //this.upLight.setRGBA(this.upLight.red , this.upLight.green, this.upLight.blue, 0.9);
            //this.rightLight.setRGBA(this.rightLight.red, this.rightLight.green, this.rightLight.blue, 0.9);
            this.fill.setRGBA(this.fill.red, this.fill.green, this.fill.blue, alpha);
        };
        Dialog.prototype.onDrawDialogs = function () {
            this.downBand.render();
            this.up.render();
            this.left.render();
            this.right.render();
            this.down.render();
            this.fill.render();
            this.leftShadow.render();
            this.upLight.render();
            this.rightLight.render();
        };
        return Dialog;
    }(Engine.Entity));
    Game.Dialog = Dialog;
    var ColorDialog = /** @class */ (function (_super) {
        __extends(ColorDialog, _super);
        function ColorDialog(style, x, y, xSize, ySize) {
            var _this = _super.call(this, x, y, xSize, ySize) || this;
            _this.style = style;
            return _this;
        }
        Object.defineProperty(ColorDialog.prototype, "style", {
            get: function () {
                return this._style;
            },
            set: function (style) {
                this._style = style;
                switch (style) {
                    case "normal":
                        this.setBorderColor(30, 50, 255, 1);
                        this.setFillColor(0, 120, 255, 1);
                        this.setBandColor(255, 255, 255, 1);
                        this.upLight.setRGBA(103.0 / 255.0, 214.0 / 255.0, 255.0 / 255.0, 1);
                        this.rightLight.setRGBA(103.0 / 255.0, 214.0 / 255.0, 255.0 / 255.0, 1);
                        break;
                    case "purple":
                        this.setBorderColor(88 / 1, 40 / 1, 188 / 1, 1);
                        this.setFillColor(152 / 1, 120 / 1, 248 / 1, 1);
                        this.setBandColor(255 / 1, 255 / 1, 255 / 1, 1);
                        this.upLight.setRGBA(216.0 / 255.0, 184.0 / 255.0, 248.0 / 255.0, 1);
                        this.rightLight.setRGBA(216.0 / 255.0, 184.0 / 255.0, 248.0 / 255.0, 1);
                        break;
                    case "clearblue":
                        this.setBorderColor(184 / 1, 184 / 1, 248 / 1, 1);
                        this.setFillColor(164 / 1, 228 / 1, 252 / 1, 1);
                        this.setBandColor(255 / 1, 255 / 1, 255 / 1, 1);
                        this.upLight.setRGBA(218.0 / 255.0, 214.0 / 255.0, 255.0 / 255.0, 1);
                        this.rightLight.setRGBA(218.0 / 255.0, 214.0 / 255.0, 255.0 / 255.0, 1);
                        this.setBandDisabled();
                        break;
                }
            },
            enumerable: false,
            configurable: true
        });
        return ColorDialog;
    }(Dialog));
    Game.ColorDialog = ColorDialog;
})(Game || (Game = {}));
///<reference path="../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("init", function () {
        FRAMES = Game.FrameSelector.complex("loadingbar", Game.Resources.textureStilts, 0, 269, null, 0, false);
    });
    Game.MAX = 0.3;
    Game.LOAD_VELOCITY = 1.0;
    var LoadingBar = /** @class */ (function (_super) {
        __extends(LoadingBar, _super);
        function LoadingBar(y, xSize, ySize) {
            var _this = _super.call(this) || this;
            _this.back = new Engine.Sprite();
            _this.fillReal = new Engine.Sprite();
            _this.fillReal2 = new Engine.Sprite();
            _this.front = new Engine.Sprite();
            _this.fill = new Engine.Sprite();
            _this.loadCount = 0;
            _this.count = 0;
            if (Game.startingSceneClass != Game.MainMenu) {
                Game.LOAD_VELOCITY *= 60000;
            }
            new Game.TitleFrame(-36 - 2);
            _this.back.enabled = true;
            _this.back.pinned = true;
            FRAMES[0].applyToSprite(_this.back);
            _this.back.x -= _this.back.xSize * 0.5;
            _this.back.y = y - _this.back.ySize * 0.5 - 0.5 * 1;
            _this.fillReal.enabled = true;
            _this.fillReal.pinned = true;
            FRAMES[1].applyToSprite(_this.fillReal);
            _this.fillReal.x = _this.back.x + _this.back.xSize - 2 + 0.2;
            _this.fillReal.y = _this.back.y;
            _this.fillReal2.enabled = true;
            _this.fillReal2.pinned = true;
            FRAMES[3].applyToSprite(_this.fillReal2);
            _this.fillReal2.x = _this.back.x + _this.back.xSize + 0.25;
            _this.fillReal2.y = _this.back.y;
            _this.front.enabled = true;
            _this.front.pinned = true;
            FRAMES[2].applyToSprite(_this.front);
            _this.front.x = _this.back.x;
            _this.front.y = _this.back.y;
            _this.fill.enabled = true;
            _this.fill.pinned = true;
            _this.fill.xSize = 0;
            _this.fill.ySize = ySize;
            _this.loadSize = xSize - 2;
            return _this;
        }
        Object.defineProperty(LoadingBar.prototype, "full", {
            get: function () {
                return this.fill.xSize == this.loadSize;
            },
            enumerable: false,
            configurable: true
        });
        LoadingBar.prototype.onStepUpdate = function () {
            this.count += 1;
            if (this.count > 60 * 2) {
                Game.MAX += Math.random() * 0.1;
                if (Game.MAX > 0.9) {
                    Game.MAX = 0.9;
                }
                this.count = 0;
            }
            var max = Game.MAX;
            if (max < Engine.Assets.downloadedRatio) {
                max = Engine.Assets.downloadedRatio;
            }
            max *= this.loadSize;
            this.loadCount += Game.LOAD_VELOCITY;
            if (this.loadCount > max) {
                this.loadCount = max;
            }
            this.fill.xSize = Math.floor(this.loadCount);
            if (this.fill.xSize > 0) {
            }
        };
        LoadingBar.prototype.onDrawDialogs = function () {
            //this.fill.render();
            this.back.render();
            this.fillReal.render();
            this.fillReal.xScale = -1 + this.fill.xSize / this.loadSize;
            this.fillReal2.xScale = this.fillReal.xScale;
            //this.fillReal2.render();
            this.front.render();
        };
        return LoadingBar;
    }(Engine.Entity));
    Game.LoadingBar = LoadingBar;
})(Game || (Game = {}));
///<reference path = "../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var Transform = /** @class */ (function (_super) {
        __extends(Transform, _super);
        function Transform() {
            var _this = _super.call(this) || this;
            _this._x = 0;
            _this._y = 0;
            _this._xLocal = 0;
            _this._yLocal = 0;
            _this._parent = null;
            _this._parentRelative = true;
            _this._children = [];
            return _this;
        }
        Object.defineProperty(Transform.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                if (this._parent != null && this._parentRelative) {
                    this._xLocal = this._x - this._parent.x;
                }
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.xLocal = child._xLocal;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                if (this._parent != null && this._parentRelative) {
                    this._yLocal = this._y - this._parent.y;
                }
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.yLocal = child._yLocal;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "xLocal", {
            get: function () {
                return this._xLocal;
            },
            set: function (value) {
                this._xLocal = value;
                if (this._parent != null && this._parentRelative) {
                    this._x = this._parent._x + this._xLocal;
                }
                else {
                    this._x = this._xLocal;
                }
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.xLocal = child._xLocal;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "yLocal", {
            get: function () {
                return this._yLocal;
            },
            set: function (value) {
                this._yLocal = value;
                if (this._parent != null && this._parentRelative) {
                    this._y = this._parent._y + this._yLocal;
                }
                else {
                    this._y = this._yLocal;
                }
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.yLocal = child._yLocal;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (value) {
                if (this._parent != null) {
                    this._parent._children.splice(this._parent._children.indexOf(this), 1);
                }
                try {
                    this._parent = value;
                    this.x = this._x;
                    this.y = this._y;
                }
                catch (e) {
                    console.error(e);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "parentRelative", {
            get: function () {
                return this._parentRelative;
            },
            set: function (value) {
                this._parentRelative = value;
                this.x = this._x;
                this.y = this._y;
            },
            enumerable: false,
            configurable: true
        });
        return Transform;
    }(Engine.Entity));
    Game.Transform = Transform;
})(Game || (Game = {}));
/*
///<reference path = "../Transform.ts"/>
namespace Game.Emission{
    export class Emitter extends Transform{
        public enabled = true;

        protected stepsFirstEmitt = 0;
        protected stepsRepeatEmitt = 5;
        protected loop = true;
        protected sizeEmission = 1;

        public xMirror = false;
        public get xDir(){
            return this.xMirror ? -1 : 1;
        }
        public yMirror = false;
        public get yDir(){
            return this.yMirror ? -1 : 1;
        }
        
        private countStepsEmitt : number;
        private indexArrayParticle : number;
        private indexEmissionParticle : number;

        private particles : Array<BaseParticle>;

        public constructor(def : any, particleClass : typeof BaseParticle, countParticles : number){
            super(def);
            this.particles = [];
            for(var indexCount = 0; indexCount < countParticles; indexCount += 1){
                var particle = new particleClass(this);
                particle.parent = this;
                this.particles.push(particle);
            }
        }

        protected onReset(){
            this.countStepsEmitt = this.stepsFirstEmitt;
            this.indexArrayParticle = 0;
            this.indexEmissionParticle = 0;
        }

        protected onStepUpdate(){
            if(!SceneFreezer.stoped && this.enabled && (this.indexArrayParticle < this.particles.length || this.loop)){
                if(this.countStepsEmitt <= 0){
                    for(var indexEmitt = 0; indexEmitt < this.sizeEmission; indexEmitt += 1){
                        this.emittParticle();
                        if(!this.loop && this.indexArrayParticle >= this.particles.length){
                            break;
                        }
                    }
                    this.countStepsEmitt = this.stepsRepeatEmitt;
                }
                else{
                    this.countStepsEmitt -= 1;
                }
            }
        }

        protected emittParticle(){
            if(this.indexArrayParticle < this.particles.length){
                var particle = this.particles[this.indexArrayParticle];
                this.indexArrayParticle += 1;
                if(this.loop && this.indexArrayParticle >= this.particles.length){
                    this.indexArrayParticle = 0;
                }
                var indexEmissionParticle = this.indexEmissionParticle;
                this.indexEmissionParticle += 1;
                particle.emitt(indexEmissionParticle);
                return particle;
            }
            return null;
        }
    }
}
*/ 
///<reference path = "../Transform.ts"/>
var Game;
(function (Game) {
    var Emission;
    (function (Emission) {
        var BaseParticle = /** @class */ (function (_super) {
            __extends(BaseParticle, _super);
            function BaseParticle(emitter) {
                var _this = _super.call(this) || this;
                _this._enabled = false;
                _this._emitter = emitter;
                return _this;
            }
            Object.defineProperty(BaseParticle.prototype, "emitter", {
                get: function () {
                    return this._emitter;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseParticle.prototype, "enabled", {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this.setEnabled(value);
                },
                enumerable: false,
                configurable: true
            });
            BaseParticle.prototype.onReset = function () {
                this.enabled = false;
            };
            BaseParticle.prototype.emitt = function (index) {
                this.enabled = true;
                this.x = this.parent.x;
                this.y = this.parent.y;
                this.index = index;
            };
            BaseParticle.prototype.setEnabled = function (value) {
                this._enabled = value;
            };
            return BaseParticle;
        }(Game.Transform));
        Emission.BaseParticle = BaseParticle;
    })(Emission = Game.Emission || (Game.Emission = {}));
})(Game || (Game = {}));
///<reference path = "BaseParticle.ts"/>
var Game;
(function (Game) {
    var Emission;
    (function (Emission) {
        var BaseVisualParticle = /** @class */ (function (_super) {
            __extends(BaseVisualParticle, _super);
            function BaseVisualParticle(emitter) {
                var _this = _super.call(this, emitter) || this;
                _this.sprite = new Engine.Sprite();
                return _this;
            }
            BaseVisualParticle.prototype.setEnabled = function (value) {
                _super.prototype.setEnabled.call(this, value);
                this.sprite.enabled = value;
            };
            BaseVisualParticle.prototype.onTimeUpdate = function () {
                this.sprite.x = this.x;
                this.sprite.y = this.y;
            };
            BaseVisualParticle.prototype.onDrawParticles = function () {
                this.sprite.render();
            };
            return BaseVisualParticle;
        }(Emission.BaseParticle));
        Emission.BaseVisualParticle = BaseVisualParticle;
    })(Emission = Game.Emission || (Game.Emission = {}));
})(Game || (Game = {}));
///<reference path = "../Transform.ts"/>
var Game;
(function (Game) {
    var Emission;
    (function (Emission) {
        var Emitter = /** @class */ (function (_super) {
            __extends(Emitter, _super);
            function Emitter(particleClass, countParticles) {
                if (particleClass === void 0) { particleClass = null; }
                if (countParticles === void 0) { countParticles = 0; }
                var _this = _super.call(this) || this;
                _this.sizeEmission = 1;
                _this.emissionSteps = 0;
                _this.xMirror = false;
                _this.yMirror = false;
                _this.particles = [];
                _this.addParticles(particleClass, countParticles);
                return _this;
            }
            Object.defineProperty(Emitter.prototype, "xDir", {
                get: function () {
                    return this.xMirror ? -1 : 1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Emitter.prototype, "yDir", {
                get: function () {
                    return this.yMirror ? -1 : 1;
                },
                enumerable: false,
                configurable: true
            });
            Emitter.prototype.addParticles = function (particleClass, countParticles) {
                for (var indexCount = 0; indexCount < countParticles; indexCount += 1) {
                    var particle = new particleClass(this);
                    particle.parent = this;
                    this.particles.push(particle);
                }
            };
            Emitter.prototype.onReset = function () {
                this.indexArrayParticle = 0;
                this.indexEmissionParticle = 0;
                this.countEmitt = 0;
            };
            Emitter.prototype.emittSingle = function () {
                if (this.indexArrayParticle < this.particles.length) {
                    var particle = this.particles[this.indexArrayParticle];
                    this.indexArrayParticle += 1;
                    if (this.indexArrayParticle >= this.particles.length) {
                        this.indexArrayParticle = 0;
                    }
                    var indexEmissionParticle = this.indexEmissionParticle;
                    this.indexEmissionParticle += 1;
                    particle.emitt(indexEmissionParticle);
                    return particle;
                }
                return null;
            };
            Emitter.prototype.emittChunk = function () {
                for (var indexEmitt = 0; indexEmitt < this.sizeEmission; indexEmitt += 1) {
                    this.emittSingle();
                }
            };
            Emitter.prototype.onStepUpdate = function () {
                if (!Game.SceneFreezer.stoped && this.emissionSteps > 0) {
                    this.countEmitt += 1;
                    if (this.countEmitt >= this.emissionSteps + 2) {
                        this.emittChunk();
                        this.countEmitt = 0;
                    }
                }
            };
            return Emitter;
        }(Game.Transform));
        Emission.Emitter = Emitter;
    })(Emission = Game.Emission || (Game.Emission = {}));
})(Game || (Game = {}));
///<reference path = "BaseVisualParticle.ts"/>
var Game;
(function (Game) {
    var Emission;
    (function (Emission) {
        var SimpleParticle = /** @class */ (function (_super) {
            __extends(SimpleParticle, _super);
            function SimpleParticle() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.eternal = false;
                return _this;
            }
            Object.defineProperty(SimpleParticle.prototype, "xRange", {
                get: function () {
                    return 1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(SimpleParticle.prototype, "yRange", {
                get: function () {
                    return 1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(SimpleParticle.prototype, "xRangeVel", {
                get: function () {
                    return 0.1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(SimpleParticle.prototype, "yRangeVel", {
                get: function () {
                    return 0.1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(SimpleParticle.prototype, "xRangeAccel", {
                get: function () {
                    return 0.1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(SimpleParticle.prototype, "yRangeAccel", {
                get: function () {
                    return 0.1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(SimpleParticle.prototype, "rangeLife", {
                get: function () {
                    return 180;
                },
                enumerable: false,
                configurable: true
            });
            SimpleParticle.prototype.emitt = function (index) {
                _super.prototype.emitt.call(this, index);
                this.x = this.parent.x;
                this.y = this.parent.y;
                this.x += this.xRange * this.emitter.xDir;
                this.y += this.yRange * this.emitter.yDir;
                this.xVel = this.xRangeVel * this.emitter.xDir;
                this.yVel = this.yRangeVel * this.emitter.yDir;
                this.xAccel = this.xRangeAccel * this.emitter.xDir;
                this.yAccel = this.yRangeAccel * this.emitter.yDir;
                this.countLife = this.rangeLife;
            };
            SimpleParticle.prototype.onMoveUpdate = function () {
                if (!Game.SceneFreezer.stoped && this.enabled) {
                    this.x += this.xVel;
                    this.y += this.yVel;
                    this.xVel += this.xAccel;
                    this.yVel += this.yAccel;
                }
            };
            SimpleParticle.prototype.onStepUpdate = function () {
                if (!Game.SceneFreezer.stoped && this.enabled && !this.eternal) {
                    this.countLife -= 1;
                    if (this.countLife <= 0) {
                        this.enabled = false;
                    }
                }
            };
            SimpleParticle.prototype.onTimeUpdate = function () {
                _super.prototype.onTimeUpdate.call(this);
                if (!Game.SceneFreezer.stoped && this.enabled) {
                    this.sprite.x += this.xVel * Engine.System.deltaTime;
                    this.sprite.y += this.yVel * Engine.System.deltaTime;
                }
            };
            return SimpleParticle;
        }(Emission.BaseVisualParticle));
        Emission.SimpleParticle = SimpleParticle;
    })(Emission = Game.Emission || (Game.Emission = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var BasicObjectWave = /** @class */ (function (_super) {
        __extends(BasicObjectWave, _super);
        function BasicObjectWave() {
            var _this = _super.call(this) || this;
            _this.steps = 30;
            return _this;
        }
        BasicObjectWave.prototype.onReset = function () {
            this.index = 0;
            this.count = 0;
            this.value = 0;
        };
        BasicObjectWave.prototype.onStepUpdate = function () {
            if (!Game.SceneFreezer.stoped) {
                this.count = (this.count + 1) % this.steps;
                if (this.count == 0) {
                    this.index = (this.index + 1) % 4;
                    this.value = BasicObjectWave.values[this.index];
                }
            }
        };
        BasicObjectWave.values = [0, 1, 2, 1];
        return BasicObjectWave;
    }(Engine.Entity));
    Game.BasicObjectWave = BasicObjectWave;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var fra;
    Game.addAction("configure", function () {
        fra = Game.FrameSelector.complex("block", Game.Resources.textureStilts, 240, 92);
    });
    var blo = new Array();
    var Block = /** @class */ (function (_super) {
        __extends(Block, _super);
        function Block(def) {
            var _this = _super.call(this, def) || this;
            _this.sprite = new Engine.Sprite();
            _this.box = new Engine.Box();
            _this.sprite.enabled = _this.box.enabled = _this.box.renderable = true;
            _this.box.x = _this.sprite.x = def.instance.x;
            _this.box.y = _this.sprite.y = def.instance.y - 8;
            _this.box.xSize = _this.box.ySize = 8;
            _this.act = _this.getProperty("on");
            _this.col = _this.getProperty("color");
            Game.SceneMap.instance.boxesSolids.push(_this.box);
            blo.push(_this);
            return _this;
        }
        Block.prototype.onReset = function () {
            this.setMe(this.act);
        };
        Block.prototype.setMe = function (act) {
            this.box.enabled = act;
            fra[this.col * 4 + (act ? 0 : 1)].applyToSprite(this.sprite);
        };
        Block.prototype.switchMe = function () {
            this.setMe(!this.box.enabled);
        };
        Block.switchAll = function (col) {
            for (var _i = 0, blo_1 = blo; _i < blo_1.length; _i++) {
                var b = blo_1[_i];
                if (b.col == col)
                    b.switchMe();
            }
        };
        Block.prototype.onDrawBlocks = function () {
            this.sprite.render();
            this.box.render();
        };
        return Block;
    }(Game.Entity));
    Game.Block = Block;
    var swi = new Array();
    var Switch = /** @class */ (function (_super) {
        __extends(Switch, _super);
        function Switch(def) {
            var _this = _super.call(this, def) || this;
            _this.sprite = new Engine.Sprite();
            _this.box = new Engine.Box();
            _this.sprite.enabled = _this.box.enabled = _this.box.renderable = true;
            _this.box.x = _this.sprite.x = def.instance.x + 4;
            _this.box.y = _this.sprite.y = def.instance.y;
            fra[2].applyToBox(_this.box);
            _this.act = _this.getProperty("on");
            _this.col = _this.getProperty("color");
            swi.push(_this);
            return _this;
        }
        Switch.prototype.onReset = function () {
            this.setMe(this.act);
        };
        Switch.prototype.setMe = function (act) {
            this.box.enabled = act;
            fra[2 + this.col * 4 + (act ? 0 : 1)].applyToSprite(this.sprite);
        };
        Switch.prototype.switchMe = function () {
            this.setMe(!this.box.enabled);
            Game.Resources.sfxButton.autoplay();
        };
        Switch.prototype.onStepUpdate = function () {
            if (this.box.enabled && !Game.SceneFreezer.stoped && this.box.collideAgainst(Game.Player.instance.boxContact)) {
                Block.switchAll(this.col);
                for (var _i = 0, swi_1 = swi; _i < swi_1.length; _i++) {
                    var s = swi_1[_i];
                    if (s.col == this.col)
                        s.switchMe();
                }
            }
        };
        Switch.prototype.onDrawBlocks = function () {
            this.sprite.render();
            this.box.render();
        };
        return Switch;
    }(Game.Entity));
    Game.Switch = Switch;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var FRAMES;
    var FRAMES_PARTICLES;
    var ANIM;
    var ANIM_PARTICLE_POP;
    var ANIM_PARTICLE_RES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("bubble", Game.Resources.textureStilts, 145, 4);
        ANIM = new Utils.Animation("anim", true, FRAMES, 9, [0, 1, 2, 1]);
        FRAMES_PARTICLES = Game.FrameSelector.complex("bubleparticle", Game.Resources.textureStilts, 0, 26);
        ANIM_PARTICLE_POP = new Utils.Animation("pop", false, FRAMES_PARTICLES, 2, [0, 2, 4, 5, 6, 7, 8]);
        ANIM_PARTICLE_RES = new Utils.Animation("res", false, FRAMES_PARTICLES, 2, [7, 6, 5, 4, 2, 0, 8]);
    });
    var FUN_45 = 0.70710678118;
    var VEL_POP = 60.0;
    var DIS_RES = 13.0;
    var VEL_RES = 60.0;
    var array = [];
    var Bubble = /** @class */ (function (_super) {
        __extends(Bubble, _super);
        function Bubble(def) {
            var _this = _super.call(this, def) || this;
            _this.sprite = new Engine.Sprite();
            _this.box = new Engine.Box();
            _this.animator = new Utils.Animator();
            _this.aniPopA = new Game.SimpleAnimator();
            _this.aniPopB = new Game.SimpleAnimator();
            _this.aniPopC = new Game.SimpleAnimator();
            _this.aniResA = new Game.SimpleAnimator();
            _this.aniResB = new Game.SimpleAnimator();
            _this.aniResC = new Game.SimpleAnimator();
            _this.sprite.enabled = _this.box.enabled = _this.box.renderable = true;
            _this.sprite.x = _this.box.x = def.instance.x + 4;
            _this.sprite.y = _this.box.y = def.instance.y;
            FRAMES[0].applyToBox(_this.box);
            _this.animator.enabled = true;
            _this.animator.owner = _this;
            _this.animator.listener = _this;
            array.push(_this);
            return _this;
        }
        Bubble.prototype.onReset = function () {
            this.animator.setAnimation(ANIM);
            this.sprite.setRGBA(1, 1, 1, 1);
            this.popped = false;
        };
        Bubble.prototype.onSetFrame = function (_animator, _animation, _frame) {
            _frame.applyToSprite(this.sprite);
        };
        Bubble.popAll = function () {
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var bub = array_1[_i];
                if (!bub.popped && bub.box.collideAgainst(Game.Player.instance.boxContact, null, false, 0, false, Engine.Box.LAYER_ALL) != null) {
                    bub.popMe();
                    return true;
                }
            }
            return false;
        };
        Bubble.prototype.popMe = function () {
            var off = -this.box.ySize * 0.5;
            this.aniPopA.trigger(ANIM_PARTICLE_POP, this.box.x, this.box.y + off);
            this.aniPopB.trigger(ANIM_PARTICLE_POP, this.box.x, this.box.y + off);
            this.aniPopC.trigger(ANIM_PARTICLE_POP, this.box.x, this.box.y + off);
            Game.Resources.sfxPop.autoplay();
            this.sprite.setRGBA(1, 1, 1, 0.5);
            this.popped = true;
        };
        Bubble.restoreAll = function () {
            for (var _i = 0, array_2 = array; _i < array_2.length; _i++) {
                var bub = array_2[_i];
                if (bub.popped) {
                    bub.restoreMe();
                }
            }
        };
        Bubble.prototype.restoreMe = function () {
            var off = -this.box.ySize * 0.5;
            this.aniResA.trigger(ANIM_PARTICLE_RES, this.box.x - DIS_RES * FUN_45, this.box.y - DIS_RES * FUN_45 + off);
            this.aniResB.trigger(ANIM_PARTICLE_RES, this.box.x, this.box.y - DIS_RES + off);
            this.aniResC.trigger(ANIM_PARTICLE_RES, this.box.x + DIS_RES * FUN_45, this.box.y - DIS_RES * FUN_45 + off);
            Game.Resources.sfxRes.autoplay();
            this.sprite.setRGBA(1, 1, 1, 1);
            this.popped = false;
        };
        Bubble.prototype.onDrawBubbles = function () {
            this.sprite.render();
            this.box.render();
            if (this.popped) {
                this.aniPopA.timeMove(-VEL_POP * FUN_45, -VEL_POP * FUN_45);
                this.aniPopB.timeMove(0, -VEL_POP);
                this.aniPopC.timeMove(VEL_POP * FUN_45, -VEL_POP * FUN_45);
                this.aniPopA.render();
                this.aniPopB.render();
                this.aniPopC.render();
            }
            if (this.aniResA.sprite.enabled) {
                var off = -this.box.ySize * 0.5;
                this.aniResA.timeMoveTo(this.box.x, this.box.y + off, VEL_RES, true);
                this.aniResB.timeMoveTo(this.box.x, this.box.y + off, VEL_RES, true);
                this.aniResC.timeMoveTo(this.box.x, this.box.y + off, VEL_RES, true);
                this.aniResA.render();
                this.aniResB.render();
                this.aniResC.render();
            }
        };
        Bubble.prototype.onClearScene = function () {
            array = [];
        };
        return Bubble;
    }(Game.Entity));
    Game.Bubble = Bubble;
})(Game || (Game = {}));
///<reference path="../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    var FRAME_PAUSE;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("framebtn", Game.Resources.textureStilts, 200, 184, null, 0, false);
        FRAME_PAUSE = Game.FrameSelector.complex("frapau", Game.Resources.textureStilts, 127, 503, null, 0, false)[0];
    });
    var SmallButtonFrame = /** @class */ (function (_super) {
        __extends(SmallButtonFrame, _super);
        function SmallButtonFrame() {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            FRAMES[1].applyToSprite(_this.sprite);
            _this.onViewUpdate();
            return _this;
        }
        SmallButtonFrame.prototype.onViewUpdate = function () {
            this.sprite.x = -Engine.Renderer.xSizeView * 0.5 - 1 - 0.5;
            this.sprite.y = -Engine.Renderer.ySizeView * 0.5 - 1;
        };
        SmallButtonFrame.prototype.onDrawBubblesDialog = function () {
            this.sprite.render();
        };
        return SmallButtonFrame;
    }(Engine.Entity));
    Game.SmallButtonFrame = SmallButtonFrame;
    var BigButtonFrame = /** @class */ (function (_super) {
        __extends(BigButtonFrame, _super);
        function BigButtonFrame() {
            var _this = _super.call(this) || this;
            BigButtonFrame.instance = _this;
            _this.spriteA = new Engine.Sprite();
            _this.spriteA.enabled = true;
            _this.spriteA.pinned = true;
            FRAMES[0].applyToSprite(_this.spriteA);
            _this.spriteB = new Engine.Sprite();
            _this.spriteB.enabled = true;
            _this.spriteB.pinned = true;
            FRAMES[1].applyToSprite(_this.spriteB);
            _this.spriteC = new Engine.Sprite();
            _this.spriteC.enabled = true;
            _this.spriteC.pinned = true;
            _this.spriteC.y = -0.5;
            FRAME_PAUSE.applyToSprite(_this.spriteC);
            _this.onViewUpdate();
            return _this;
        }
        BigButtonFrame.prototype.onViewUpdate = function () {
            this.spriteA.x = 0;
            this.spriteA.y = -Engine.Renderer.ySizeView * 0.5 - 1;
            this.spriteA.xSize = Engine.Renderer.xSizeView + 10;
            this.spriteA.xOffset = -this.spriteA.xSize * 0.5;
            this.spriteB.x = -Engine.Renderer.xSizeView * 0.5;
            this.spriteB.y = -Engine.Renderer.ySizeView * 0.5;
            this.spriteB.x = -Engine.Renderer.xSizeView * 0.5 - 1 - 29 + 8 + 1 - 1;
            this.spriteB.y = -Engine.Renderer.ySizeView * 0.5 - 1;
            this.spriteC.xSize = Engine.Renderer.xSizeView + 10;
            this.spriteC.xOffset = -this.spriteC.xSize * 0.5;
        };
        BigButtonFrame.prototype.onDrawBubblesDialog = function () {
            if (Game.SceneFreezer.paused) {
                this.spriteA.render();
                this.spriteC.render();
            }
        };
        BigButtonFrame.prototype.onDrawAdFrame = function () {
            if (Game.LevelAdLoader.instance != null && Game.LevelAdLoader.instance.text.enabled) {
                this.spriteC.render();
            }
        };
        BigButtonFrame.prototype.onDrawSpeedrunDialog = function () {
            if (!Game.SceneFreezer.paused) {
                this.spriteB.render();
            }
        };
        return BigButtonFrame;
    }(Engine.Entity));
    Game.BigButtonFrame = BigButtonFrame;
    var LevelLogoFrame = /** @class */ (function (_super) {
        __extends(LevelLogoFrame, _super);
        function LevelLogoFrame(lef) {
            var _this = _super.call(this) || this;
            _this.spr = new Engine.Sprite();
            _this.wid = 51;
            _this.hei = 20 + 4 - 4 + 1 + 0.5 + 0.5;
            _this.lef = lef;
            if (lef)
                _this.spr.setFull(true, true, Game.Resources.textureStilts, _this.wid, _this.hei, 0, 0, 224, 462, _this.wid, _this.hei);
            else
                _this.spr.setFull(true, true, Game.Resources.textureStilts, _this.wid, _this.hei, 0, 0, 200, 462, _this.wid, _this.hei);
            _this.onViewUpdate();
            return _this;
        }
        LevelLogoFrame.prototype.onViewUpdate = function () {
            if (this.lef) {
                this.spr.x = -Engine.Renderer.xSizeView * 0.5 - 5 - 0.5;
                this.spr.y = Engine.Renderer.ySizeView * 0.5 - this.hei + 5;
            }
            else {
                this.spr.x = Engine.Renderer.xSizeView * 0.5 - this.wid + 5;
                this.spr.y = Engine.Renderer.ySizeView * 0.5 - this.hei + 5;
            }
        };
        LevelLogoFrame.prototype.onDrawButtons = function () {
            this.sprfor.render();
        };
        return LevelLogoFrame;
    }(Engine.Entity));
    Game.LevelLogoFrame = LevelLogoFrame;
    var FRAMES_BUTTON;
    Game.addAction("configure", function () {
        FRAMES_BUTTON = Game.FrameSelector.complex("btnfrmss", Game.Resources.textureStilts, 0, 159, null, 0, false);
    });
    var ButtonFrame = /** @class */ (function (_super) {
        __extends(ButtonFrame, _super);
        function ButtonFrame(indexFrame, x, y) {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            _this.sprite.x = x;
            _this.sprite.y = y;
            FRAMES_BUTTON[indexFrame].applyToSprite(_this.sprite);
            return _this;
        }
        ButtonFrame.prototype.setIndex = function (index) {
            FRAMES_BUTTON[index].applyToSprite(this.sprite);
        };
        ButtonFrame.prototype.onDrawBubblesDialog = function () {
            this.sprite.render();
        };
        return ButtonFrame;
    }(Engine.Entity));
    Game.ButtonFrame = ButtonFrame;
    var FRAME_CREDITS;
    Game.addAction("configure", function () {
        FRAME_CREDITS = Game.FrameSelector.complex("frmcrdts", Game.Resources.textureStilts, 203, 269, null, 0, false)[0];
    });
    var CreditsFrame = /** @class */ (function (_super) {
        __extends(CreditsFrame, _super);
        function CreditsFrame(x, y) {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            _this.sprite.x = x;
            _this.sprite.y = y;
            FRAME_CREDITS.applyToSprite(_this.sprite);
            return _this;
        }
        CreditsFrame.prototype.setIndex = function (index) {
            FRAMES_BUTTON[index].applyToSprite(this.sprite);
        };
        CreditsFrame.prototype.onDrawBubblesDialog = function () {
            this.sprite.render();
        };
        return CreditsFrame;
    }(Engine.Entity));
    Game.CreditsFrame = CreditsFrame;
    var FRAMEFRAMEFRAME;
    var FRAMEFRAMEFRAME2;
    Game.addAction("configure", function () {
        FRAMEFRAMEFRAME = Game.FrameSelector.complex("frafraspe", Game.Resources.textureStilts, 0, 503, null, 0, false)[0];
        FRAMEFRAMEFRAME2 = Game.FrameSelector.complex("frafraspe2", Game.Resources.textureStilts, 79, 503, null, 0, false)[0];
    });
    var SpeedrunDialogFrame = /** @class */ (function (_super) {
        __extends(SpeedrunDialogFrame, _super);
        function SpeedrunDialogFrame() {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            FRAMEFRAMEFRAME.applyToSprite(_this.sprite);
            //this.sprite.setRGBA(1, 1, 1, LEVEL_TEXT_UNPAUSED_ALPHA);
            _this.sprite2 = new Engine.Sprite();
            _this.sprite2.enabled = true;
            _this.sprite2.pinned = true;
            FRAMEFRAMEFRAME2.applyToSprite(_this.sprite2);
            _this.onViewUpdate();
            return _this;
        }
        SpeedrunDialogFrame.prototype.onViewUpdate = function () {
            this.sprite.x = Engine.Renderer.xSizeView * 0.5 + 1 - 15 + 32 - 1 + 2 + 6 + 4 + 4 - 1;
            this.sprite.y = -Engine.Renderer.ySizeView * 0.5 - 1 - 8 + 2;
            this.sprite2.y = Engine.Renderer.ySizeView * 0.5;
        };
        SpeedrunDialogFrame.prototype.onDrawBubblesDialog = function () {
            if (Game.SceneFreezer.paused) {
                this.sprite2.render();
            }
        };
        SpeedrunDialogFrame.prototype.onDrawSpeedrunDialog = function () {
            if (!Game.SceneFreezer.paused) {
                this.sprite.render();
            }
        };
        return SpeedrunDialogFrame;
    }(Engine.Entity));
    Game.SpeedrunDialogFrame = SpeedrunDialogFrame;
    var FRAME_SPEEDRUN;
    Game.addAction("configure", function () {
        FRAME_SPEEDRUN = Game.FrameSelector.complex("frmspeedrn", Game.Resources.textureStilts, 111, 269, null, 0, false)[0];
    });
    var SpeedrunFrame = /** @class */ (function (_super) {
        __extends(SpeedrunFrame, _super);
        function SpeedrunFrame(x, y) {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            _this.sprite.x = x;
            _this.sprite.y = y;
            FRAME_SPEEDRUN.applyToSprite(_this.sprite);
            return _this;
        }
        SpeedrunFrame.prototype.setIndex = function (index) {
            FRAMES_BUTTON[index].applyToSprite(this.sprite);
        };
        SpeedrunFrame.prototype.onDrawBubblesDialog = function () {
            this.sprite.render();
        };
        return SpeedrunFrame;
    }(Engine.Entity));
    Game.SpeedrunFrame = SpeedrunFrame;
    var FRAME_TITLE;
    Game.addAction("init", function () {
        FRAME_TITLE = Game.FrameSelector.complex("frmtitle", Game.Resources.textureStilts, 60, 64, null, 0, false)[0];
    });
    var TitleFrame = /** @class */ (function (_super) {
        __extends(TitleFrame, _super);
        function TitleFrame(y, x) {
            if (x === void 0) { x = 0; }
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            _this.sprite.x = 0;
            _this.sprite.y = y;
            FRAME_TITLE.applyToSprite(_this.sprite);
            _this.text = new Utils.Text();
            _this.text.font = Game.FontManager.a;
            _this.text.scale = 1;
            _this.text.enabled = true;
            _this.text.pinned = true;
            _this.text.str = "BY NOADEV";
            _this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignBounds = Utils.AnchorAlignment.START;
            _this.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAligned = 27 * x;
            _this.text.yAligned = y + 20;
            return _this;
        }
        TitleFrame.prototype.onDrawBubblesDialog = function () {
            this.sprite.render();
        };
        return TitleFrame;
    }(Engine.Entity));
    Game.TitleFrame = TitleFrame;
    var FRAME_LAST;
    Game.addAction("configure", function () {
        FRAME_LAST = Game.FrameSelector.complex("lastbtnfrm", Game.Resources.textureStilts, 188, 64, null, 0, false)[0];
    });
    var LastButtonFrames = /** @class */ (function (_super) {
        __extends(LastButtonFrames, _super);
        function LastButtonFrames() {
            var _this = _super.call(this) || this;
            LastButtonFrames.instance = _this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            FRAME_LAST.applyToSprite(_this.sprite);
            new SmallButtonFrame();
            _this.onViewUpdate();
            return _this;
        }
        LastButtonFrames.prototype.onViewUpdate = function () {
            this.sprite.x = Engine.Renderer.xSizeView * 0.5 + 1 + 20 + 14;
            this.sprite.y = -Engine.Renderer.ySizeView * 0.5 - 1;
        };
        LastButtonFrames.prototype.onDrawBubblesDialog = function () {
            this.sprite.render();
        };
        LastButtonFrames.prototype.onClearScene = function () {
            LastButtonFrames.instance = null;
        };
        LastButtonFrames.instance = null;
        return LastButtonFrames;
    }(Engine.Entity));
    Game.LastButtonFrames = LastButtonFrames;
    var SpeedrunButtonFrame = /** @class */ (function (_super) {
        __extends(SpeedrunButtonFrame, _super);
        function SpeedrunButtonFrame() {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            FRAME_LAST.applyToSprite(_this.sprite);
            //this.sprite.setRGBA(1, 1, 1, LEVEL_TEXT_UNPAUSED_ALPHA);
            _this.onViewUpdate();
            return _this;
        }
        SpeedrunButtonFrame.prototype.onViewUpdate = function () {
            this.sprite.x = Engine.Renderer.xSizeView * 0.5 + 1 - 15 + 32 - 1 + 2 + 6 + 4 + 4 - 1;
            this.sprite.y = -Engine.Renderer.ySizeView * 0.5 - 1 - 8 + 2;
        };
        SpeedrunButtonFrame.prototype.onDrawBubblesDialog = function () {
            if (!Game.SceneFreezer.paused) {
                this.sprite.render();
            }
        };
        return SpeedrunButtonFrame;
    }(Engine.Entity));
    Game.SpeedrunButtonFrame = SpeedrunButtonFrame;
    Game.USE_LOGO_BUTTON_FRAME_LEFT = false;
    Game.USE_LOGO_BUTTON_FRAME_RIGHT = false;
    var LogoButtonFrameLeft = /** @class */ (function (_super) {
        __extends(LogoButtonFrameLeft, _super);
        function LogoButtonFrameLeft() {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            _this.sprite.yMirror = true;
            FRAMES[1].applyToSprite(_this.sprite);
            _this.onViewUpdate();
            return _this;
        }
        LogoButtonFrameLeft.prototype.onViewUpdate = function () {
            this.sprite.x = -Engine.Renderer.xSizeView * 0.5 - 1 - 10 + 1;
            this.sprite.y = Engine.Renderer.ySizeView * 0.5 - 1 + 6 - 3;
        };
        LogoButtonFrameLeft.prototype.onDrawBubblesDialog = function () {
            if (Game.USE_LOGO_BUTTON_FRAME_LEFT) {
                this.sprite.render();
            }
        };
        return LogoButtonFrameLeft;
    }(Engine.Entity));
    Game.LogoButtonFrameLeft = LogoButtonFrameLeft;
    var LogoButtonFrameRight = /** @class */ (function (_super) {
        __extends(LogoButtonFrameRight, _super);
        function LogoButtonFrameRight() {
            var _this = _super.call(this) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            _this.sprite.pinned = true;
            _this.sprite.xMirror = true;
            _this.sprite.yMirror = true;
            FRAMES[1].applyToSprite(_this.sprite);
            _this.onViewUpdate();
            return _this;
        }
        LogoButtonFrameRight.prototype.onViewUpdate = function () {
            this.sprite.x = Engine.Renderer.xSizeView * 0.5 + 1 + 10 - 1;
            this.sprite.y = Engine.Renderer.ySizeView * 0.5 - 1 + 6 - 3;
        };
        LogoButtonFrameRight.prototype.onDrawBubblesDialog = function () {
            if (Game.USE_LOGO_BUTTON_FRAME_RIGHT) {
                this.sprite.render();
            }
        };
        return LogoButtonFrameRight;
    }(Engine.Entity));
    Game.LogoButtonFrameRight = LogoButtonFrameRight;
})(Game || (Game = {}));
///<reference path="../../Game/Arcade/Platformer/BaseMachineEntity.ts"/>
var Game;
(function (Game) {
    ;
    var Character = /** @class */ (function (_super) {
        __extends(Character, _super);
        function Character(def, frames, anims) {
            var _this = _super.call(this, def) || this;
            _this.flipOnWall = true;
            _this.flipOnAbyss = true;
            _this.canStick = true;
            _this.contactsTiles = null;
            _this.contactsSpikes = null;
            _this.contactsUpsideDown = null;
            frames[0].applyToBox(_this.boxSolid);
            frames[0].applyToBox(_this.boxOverlap);
            _this.initAnimations(anims);
            _this.boxSolid.data = _this;
            _this.boxOverlap.data = _this;
            _this.boxPatrol = new Engine.Box();
            _this.boxPatrol.enabled = true;
            _this.boxPatrol.renderable = true;
            _this.boxPatrol.xSize = 1;
            _this.boxPatrol.ySize = 1;
            _this.boxPatrol.green = 0;
            _this.boxPatrol.blue = 1;
            return _this;
            //this.sfxJump = Resources.sfxJump;
        }
        Character.prototype.initStates = function () {
            var _this = this;
            _super.prototype.initStates.call(this);
            this.stateDead = new Game.Flow.State(this, "dead");
            this.stateLandingUpsideDown = new Game.Flow.State(this, "landingupsidedown");
            this.stateJumpUpsideDown = new Game.Flow.State(this, "jumpupsidedown");
            this.stateStand.addLink(this.stateDead, function () { return _this.imDead(); });
            this.stateMove.addLink(this.stateDead, function () { return _this.imDead(); });
            this.stateAscend.addLink(this.stateDead, function () { return _this.imDead(); });
            this.stateFall.addLink(this.stateDead, function () { return _this.imDead(); });
            this.stateFall.addLink(this.stateLandingUpsideDown, function () { return _this.canStick && _this.yDirContact < 0; });
            this.stateLanding.addLink(this.stateDead, function () { return _this.imDead(); });
            this.stateStand.addLink(this.stateJumpUpsideDown, function () { return _this.sprite.yMirror && _this.jumpControlPressed; });
            this.stateStand.addLink(this.stateFall, function () { return _this.sprite.yMirror && _this.contactsUpsideDown == null; });
            this.stateMove.addLink(this.stateJumpUpsideDown, function () { return _this.sprite.yMirror && _this.jumpControlPressed; });
            this.stateMove.addLink(this.stateFall, function () { return _this.sprite.yMirror && _this.contactsUpsideDown == null; });
            this.stateLanding.addLink(this.stateJumpUpsideDown, function () { return _this.sprite.yMirror && _this.jumpControlPressed; });
            this.stateLanding.addLink(this.stateFall, function () { return _this.sprite.yMirror && _this.contactsUpsideDown == null; });
            this.stateLandingUpsideDown.onEnter = function () {
                _this.consumeJumpControls();
                _this.yScaleForceWorld = 0;
                _this.sprite.yMirror = true;
                _this.upsideDownPlatformCheck();
            };
            this.stateLandingUpsideDown.addLink(this.stateLanding, function () { return true; });
            this.stateJumpUpsideDown.onEnter = function () {
                _this.consumeJumpControls();
                _this.yScaleForceWorld = 1;
                _this.sprite.yMirror = false;
                _this.contactsUpsideDown = null;
                if (_this.sfxFall != null)
                    _this.sfxFall.play();
                if (_this.platformParent != null) {
                    _this.platformParent.removeChild(_this);
                }
            };
            this.stateJumpUpsideDown.addLink(this.stateFall, function () { return true; });
            this.stateDead.onEnter = function () {
                _this.moveActionsEnabled = false;
                _this.turnActionsEnabled = false;
                _this.jumpActionsEnabled = false;
                _this.platformActionsEnabled = false;
                _this.yScaleForceWorld = 0;
                _this.xVel = 0;
                _this.yVel = 0;
                _this.onCharacterDead();
                if (_this.sfxDead != null)
                    _this.sfxDead.play();
            };
            this.stateDead.onReady = function () {
                _this.boxSolid.enabled = false;
                _this.boxOverlap.enabled = false;
                _this.animator.setAnimation(_this.animDead);
                _this.sprite.enabled = false;
            };
            this.machine.anyState.onStepUpdate = function () {
                if (_this.sprite.yMirror) {
                    _this.upsideDownPlatformCheck();
                    //this.yScaleForceWorld = 1;
                    //this.sprite.yMirror = false;
                }
            };
            this.machine.anyState.onExit = function () {
                if (_this.sprite.yMirror && _this.contactsUpsideDown == null) {
                    _this.yScaleForceWorld = 1;
                    _this.sprite.yMirror = false;
                }
            };
            return this.stateStand;
        };
        Character.prototype.fixBoxPatrolPosition = function () {
            this.boxPatrol.x = this.boxSolid.x;
            if (this.sprite.yMirror) {
                this.boxPatrol.y = this.boxSolid.y - this.boxSolid.ySize - 1;
            }
            else {
                this.boxPatrol.y = this.boxSolid.y;
            }
            if (this.xVel > 0) {
                this.boxPatrol.x += this.boxSolid.xSize * 0.5;
            }
            else {
                this.boxPatrol.x -= (this.boxSolid.xSize * 0.5 + 1);
            }
        };
        Character.prototype.initAnimations = function (anims) {
            this.animStand = anims.stand;
            this.animMove = anims.move;
            this.animAscend = anims.ascend;
            this.animFall = anims.fall;
            this.animFallAscend = anims.fallAscend;
            this.animLanding = anims.landing;
            this.animDead = anims.dead;
        };
        Character.prototype.onReset = function () {
            _super.prototype.onReset.call(this);
            this.yScaleForceWorld = 1;
            this.boxSolid.enabled = true;
            this.boxOverlap.enabled = true;
            this.sprite.enabled = true;
            this.contactsSpikes = null;
            this.contactsTiles = null;
            this.contactsUpsideDown = null;
            if (this.sprite.yMirror) {
                this.boxSolid.y += this.boxSolid.ySize;
                this.yScaleForceWorld = 0;
                this.upsideDownPlatformCheck();
            }
        };
        Character.prototype.imDead = function () {
            return this.boxSolid.y + this.boxSolid.ySize * 0.5 > Game.SceneMap.instance.ySizeMap ||
                this.boxSolid.x - this.boxSolid.xSize * 0.5 > Game.SceneMap.instance.xSizeMap + 2 * Game.SceneMap.instance.xSizeTile ||
                this.boxSolid.x + this.boxSolid.xSize * 0.5 < -2 * Game.SceneMap.instance.xSizeTile ||
                this.contactsSpikes != null ||
                this.contactsTiles != null;
        };
        Character.prototype.onSetFrame = function (_animator, _animation, _frame) {
            _frame.applyToSprite(this.sprite);
        };
        Character.prototype.onMoveUpdate = function () {
            _super.prototype.onMoveUpdate.call(this);
            if (!Game.SceneFreezer.stoped && this.dirMove != 0) {
                var flip = false;
                if (this.flipOnWall) {
                    if ((this.xDirContact > 0 && this.dirMove > 0) || (this.xDirContact < 0 && this.dirMove < 0)) {
                        flip = true;
                    }
                }
                if (this.flipOnAbyss) {
                    this.fixBoxPatrolPosition();
                    if ( /*this.yDirContact > 0 &&*/this.boxPatrol.collide(Game.SceneMap.instance.boxesSolids, null, true, 0, true, Engine.Box.LAYER_ALL) == null) {
                        flip = true;
                    }
                }
                if (flip) {
                    this.sprite.xMirror = !this.sprite.xMirror;
                }
            }
        };
        Character.prototype.upsideDownPlatformCheck = function () {
            var newPlatformParent = null;
            this.contactsUpsideDown = this.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, false, -1, false, Engine.Box.LAYER_ALL);
            if (this.contactsUpsideDown != null) {
                for (var _i = 0, _a = this.contactsUpsideDown; _i < _a.length; _i++) {
                    var contact = _a[_i];
                    if (contact.other.data instanceof Game.Arcade.Platformer.Platform) {
                        if (contact.other.data == this.platformParent) {
                            return;
                        }
                        else {
                            newPlatformParent = contact.other.data;
                        }
                    }
                }
            }
            if (newPlatformParent != null) {
                newPlatformParent.addChild(this);
            }
            else if (this.platformParent != null) {
                this.platformParent.removeChild(this);
            }
            return;
        };
        Character.prototype.onOverlapUpdate = function () {
            _super.prototype.onOverlapUpdate.call(this);
            if (!Game.SceneFreezer.stoped) {
                this.contactsSpikes = this.boxOverlap.collide(Game.Spike.boxes, null, false, 0, false, Engine.Box.LAYER_ALL);
                this.contactsTiles = this.boxSolid.collide(Game.SceneMap.instance.boxesSolids, null, false, 0, false, Engine.Box.LAYER_ALL);
            }
        };
        Character.prototype.onGoal = function () {
        };
        Character.prototype.onWinning = function () {
        };
        Character.prototype.onLosing = function () {
        };
        Character.prototype.onCharacterDead = function () {
        };
        Character.prototype.onTimeUpdate = function () {
            _super.prototype.onTimeUpdate.call(this);
            if (!Game.SceneFreezer.stoped && this.platformParent != null) {
                this.sprite.x = this.boxSolid.x + this.platformParent.xGetVelMove() * Engine.System.deltaTime;
                this.sprite.y = this.boxSolid.y + this.platformParent.yGetVelMove() * Engine.System.deltaTime;
            }
        };
        Character.prototype.drawCharacter = function () {
            this.sprite.y -= this.sprite.yMirror ? this.boxSolid.ySize : 0;
            //this.sprite.x = fastPixelPerfect(this.sprite.x);
            //this.sprite.y = fastPixelPerfect(this.sprite.y);
            this.sprite.render();
            //this.sprite.y += this.sprite.yMirror ? this.boxSolid.ySize : 0;
            if (this.boxPatrol.enabled && this.boxPatrol.renderable) {
                this.fixBoxPatrolPosition();
                this.boxPatrol.render();
            }
        };
        return Character;
    }(Game.Arcade.Platformer.BaseMachineEntity));
    Game.Character = Character;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var FRAMES;
    var ANIM_IN;
    var ANIM_GROWING;
    var ANIM_OUT;
    var ANIM_SHRINKING;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("enlongera", Game.Resources.textureStilts, 60, 105);
        ANIM_IN = new Utils.Animation("in", true, FRAMES, 9, [0, 1, 2, 1], null);
        ANIM_GROWING = new Utils.Animation("growing", false, FRAMES, 3, [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 10], null);
        ANIM_OUT = new Utils.Animation("out", true, FRAMES, 9, [9, 10, 11, 10], null);
        ANIM_SHRINKING = new Utils.Animation("shrinking", false, FRAMES, 3, [8, 7, 6, 5, 4, 3, 2, 1], null);
    });
    var Enlonger = /** @class */ (function (_super) {
        __extends(Enlonger, _super);
        function Enlonger(def) {
            var _this = _super.call(this, def) || this;
            _this.boxA = new Engine.Box();
            _this.boxB = new Engine.Box();
            _this.sprite = new Engine.Sprite();
            _this.animator = new Utils.Animator();
            _this.boxA.x = _this.boxB.x = _this.sprite.x = def.instance.x + 4;
            _this.boxA.y = _this.boxB.y = _this.sprite.y = def.instance.y - (def.flip.y ? 8 : 0);
            _this.sprite.xMirror = def.flip.x;
            _this.sprite.yMirror = def.flip.y;
            _this.boxA.enabled = _this.boxB.enabled = true;
            _this.boxA.renderable = _this.boxB.renderable = true;
            _this.boxA.red = 1;
            _this.sprite.enabled = true;
            _this.animator.enabled = true;
            _this.animator.owner = _this;
            _this.animator.listener = _this;
            Game.SceneMap.instance.boxesEnemies.push(_this.boxA);
            Game.SceneMap.instance.boxesEnemies.push(_this.boxB);
            _this.stepsStart = _this.getProperty("steps start");
            _this.stepsIn = _this.getProperty("steps in");
            _this.stepsOut = _this.getProperty("steps out");
            return _this;
        }
        Enlonger.prototype.onReset = function () {
            this.sprite.xMirror = false;
            this.setState(this.getProperty("out") ? 2 : 0, true);
        };
        Enlonger.prototype.setState = function (state, start) {
            if (start === void 0) { start = false; }
            this.state = state;
            switch (state) {
                case 0:
                    this.stepCount = start ? this.stepsStart : this.stepsIn;
                    this.animator.setAnimation(ANIM_IN);
                    break;
                case 1:
                    this.animator.setAnimation(ANIM_GROWING);
                    Game.Resources.sfxOut.autoplay();
                    break;
                case 2:
                    this.stepCount = start ? this.stepsStart : this.stepsOut;
                    this.animator.setAnimation(ANIM_OUT);
                    break;
                case 3:
                    this.animator.setAnimation(ANIM_SHRINKING);
                    Game.Resources.sfxIn.autoplay();
                    break;
            }
        };
        Enlonger.prototype.onSetFrame = function (_animator, _animation, _frame) {
            if (_frame == undefined) {
                console.log(this.animator.animation.indexArray[this.animator.indexFrame] + 12);
                return;
            }
            _frame.applyToSprite(this.sprite);
            _frame.applyToBox(this.boxA);
            FRAMES[this.animator.animation.indexArray[this.animator.indexFrame] + 12].applyToBox(this.boxB);
            if (this.sprite.yMirror) {
                this.boxA.yOffset = 0;
                this.boxB.yOffset = -this.boxB.yOffset - this.boxB.ySize;
            }
        };
        Enlonger.prototype.onStepUpdate = function () {
            if (Game.SceneFreezer.stoped)
                return;
            this.sprite.xMirror = this.boxA.x > Game.Player.instance.boxSolid.x;
            this.stepCount--;
            if (this.animator.ended) {
                switch (this.state) {
                    case 1:
                        this.setState(2);
                        return;
                    case 3:
                        this.setState(0);
                        return;
                }
            }
            if (this.stepCount <= 0) {
                switch (this.state) {
                    case 0:
                        this.setState(1);
                        return;
                    case 2:
                        this.setState(3);
                        return;
                }
            }
        };
        Enlonger.prototype.onDrawObjectsBack = function () {
            this.sprite.render();
            this.boxA.render();
            this.boxB.render();
        };
        return Enlonger;
    }(Game.Entity));
    Game.Enlonger = Enlonger;
})(Game || (Game = {}));
///<reference path="../../Game/System/Entity.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    var ANIM_FLAG;
    Game.addAction("init", function () {
        FRAMES = Game.FrameSelector.complex("goal", Game.Resources.textureStilts, 386, 26);
        ANIM_FLAG = new Utils.Animation("goalflg", true, FRAMES, 6, [0, 0], null);
    });
    var Goal = /** @class */ (function (_super) {
        __extends(Goal, _super);
        function Goal(def) {
            var _this = _super.call(this, def) || this;
            _this.wave = new Game.BasicObjectWave();
            Goal.instance = _this;
            _this.last = _this.getProperty("last");
            _this.box = new Engine.Box();
            _this.box.enabled = !_this.last;
            _this.box.renderable = true;
            _this.box.x = def.instance.x + Game.SceneMap.instance.xSizeTile * 0.5;
            FRAMES[0].applyToBox(_this.box);
            _this.anim = new Game.SimpleAnimator();
            if (def.flip.x) {
                _this.anim.sprite.xMirror = true;
            }
            if (def.flip.y) {
                _this.box.yOffset = 0;
                _this.box.y = def.instance.y - Game.SceneMap.instance.ySizeTile;
                _this.anim.sprite.yMirror = true;
            }
            else {
                _this.box.y = def.instance.y;
            }
            _this.wave.steps = 20;
            _this.emitter = new Game.Emission.Emitter(Game.GoalGotParticle, 8);
            _this.emitter.sizeEmission = 4;
            _this.emitterBack = new Game.Emission.Emitter(Game.GoalSupportParticle, 60);
            _this.emitterBack.sizeEmission = 1;
            _this.emitterBack.x = def.instance.x + 4;
            _this.emitterBack.y = def.instance.y;
            Engine.System.addListenersFrom(_this);
            return _this;
        }
        Goal.prototype.onStart = function () {
            this.anim.sprite.enabled = true;
            this.anim.trigger(ANIM_FLAG, this.box.x, this.box.y);
            this.emitterBack.emissionSteps = 1;
        };
        Goal.prototype.onStepUpdate = function () {
            this.anim.sprite.y = this.box.y - this.wave.value;
            this.emitterBack.y = this.anim.sprite.y + 2;
        };
        Goal.prototype.getMe = function () {
            this.anim.sprite.enabled = false;
            this.emitter.x = this.box.x;
            this.emitter.y = this.box.y - this.wave.value;
            this.emitter.emittChunk();
            this.emitterBack.emissionSteps = 0;
            Game.Resources.sfxWin.autoplay();
        };
        Goal.prototype.onDrawGoal = function () {
            this.anim.render();
            this.box.render();
        };
        Goal.prototype.onClearScene = function () {
            Goal.instance = null;
        };
        return Goal;
    }(Game.Entity));
    Game.Goal = Goal;
})(Game || (Game = {}));
///<reference path = "../../Game/Utils/Emission/SimpleParticle.ts"/>
var Game;
(function (Game) {
    function range(start, end) {
        return start + Math.random() * (end - start);
    }
    Game.range = range;
    var GoalParticle = /** @class */ (function (_super) {
        __extends(GoalParticle, _super);
        function GoalParticle(emitter) {
            var _this = _super.call(this, emitter) || this;
            _this.support = false;
            _this.parentRelative = false;
            if (Engine.Renderer.mode != Engine.RendererMode.CANVAS_2D) {
                _this.sprite.setRGBA(1, 1, 1, 1);
            }
            return _this;
        }
        Object.defineProperty(GoalParticle.prototype, "xRange", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalParticle.prototype, "yRange", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalParticle.prototype, "xRangeVel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalParticle.prototype, "yRangeVel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalParticle.prototype, "xRangeAccel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalParticle.prototype, "yRangeAccel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalParticle.prototype, "rangeLife", {
            get: function () {
                return 60;
            },
            enumerable: false,
            configurable: true
        });
        GoalParticle.prototype.emitt = function (index) {
            _super.prototype.emitt.call(this, index);
            this.lifeTotal = this.countLife;
            this.spriteIndex = 0;
            Game.FRAMES_GOAL_PARTICLES[5].applyToSprite(this.sprite);
        };
        GoalParticle.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
            if (!Game.SceneFreezer.stoped && this.enabled) {
                if (this.spriteIndex == 0 && this.countLife < this.lifeTotal * 0.55) {
                    Game.FRAMES_GOAL_PARTICLES[6].applyToSprite(this.sprite);
                    this.spriteIndex = 1;
                }
            }
        };
        GoalParticle.prototype.onTimeUpdate = function () {
            _super.prototype.onTimeUpdate.call(this);
            if (!Game.SceneFreezer.stoped && this.enabled) {
                if (Engine.Renderer.mode != Engine.RendererMode.CANVAS_2D) {
                    var extLife = this.countLife - Engine.System.deltaTime;
                    if (extLife > 0) {
                        this.sprite.setRGBA(1, 1, 1, extLife / this.lifeTotal);
                    }
                    else {
                        this.sprite.setRGBA(1, 1, 1, 0);
                    }
                }
            }
        };
        GoalParticle.prototype.onDrawParticles = function () {
            this.sprite.render();
        };
        return GoalParticle;
    }(Game.Emission.SimpleParticle));
    Game.GoalParticle = GoalParticle;
})(Game || (Game = {}));
(function (Game) {
    var GoalBaseParticle = /** @class */ (function (_super) {
        __extends(GoalBaseParticle, _super);
        function GoalBaseParticle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(GoalBaseParticle.prototype, "xRange", {
            get: function () {
                return Game.range(-11, 11);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalBaseParticle.prototype, "yRange", {
            get: function () {
                return Game.range(-6, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalBaseParticle.prototype, "xRangeVel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalBaseParticle.prototype, "yRangeVel", {
            get: function () {
                return Game.range(-0.6, -0.8);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalBaseParticle.prototype, "xRangeAccel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalBaseParticle.prototype, "yRangeAccel", {
            get: function () {
                return Game.range(0.004, 0.008);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalBaseParticle.prototype, "rangeLife", {
            get: function () {
                return Game.range(20, 30);
            },
            enumerable: false,
            configurable: true
        });
        return GoalBaseParticle;
    }(Game.GoalParticle));
    Game.GoalBaseParticle = GoalBaseParticle;
    var GoalSupportParticle = /** @class */ (function (_super) {
        __extends(GoalSupportParticle, _super);
        function GoalSupportParticle(emitter) {
            var _this = _super.call(this, emitter) || this;
            _this.support = true;
            return _this;
        }
        Object.defineProperty(GoalSupportParticle.prototype, "xRange", {
            get: function () {
                return Game.range(-11, 11);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalSupportParticle.prototype, "yRange", {
            get: function () {
                return Game.range(-6, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalSupportParticle.prototype, "xRangeVel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalSupportParticle.prototype, "yRangeVel", {
            get: function () {
                return Game.range(-0.6, -0.8);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalSupportParticle.prototype, "xRangeAccel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalSupportParticle.prototype, "yRangeAccel", {
            get: function () {
                return Game.range(0.004, 0.008);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoalSupportParticle.prototype, "rangeLife", {
            get: function () {
                return Game.range(20, 30);
            },
            enumerable: false,
            configurable: true
        });
        GoalSupportParticle.prototype.onDrawParticles = function () {
        };
        GoalSupportParticle.prototype.onDrawParticlesBack = function () {
            _super.prototype.onDrawParticles.call(this);
        };
        return GoalSupportParticle;
    }(Game.GoalParticle));
    Game.GoalSupportParticle = GoalSupportParticle;
})(Game || (Game = {}));
///<reference path="Character.ts"/>
var Game;
(function (Game) {
    var NONE = 0;
    var WALK = 2;
    var JUMP = 3;
    var FALL = 4;
    var DEAD = 6;
    var VEL_MOVE = 1 * 0.8;
    var VEL_JUMP_NORMAL = 2.65;
    //var VEL_JUMP_SPRING = 2.95 * 2;
    var STEPS_WIN = 30;
    var STEPS_LOSS = 30;
    var ANIM_STAND;
    var ANIM_WALK;
    var ANIM_ASCEND;
    var ANIM_FALL_ASCEND;
    var ANIM_FALL;
    var FRAMES;
    var STILT_SPEED = 1;
    Game.BASE_STILT_SIZE = 7;
    Game.START_STILT_SIZE = 7;
    var MAX_STILT_SIZE = 14;
    var BOX_Y_SIZE = 6;
    Game.addAction("init", function () {
        FRAMES = Game.FrameSelector.complex("player sprites", Game.Resources.textureStilts, 0, 4);
        ANIM_STAND = new Utils.Animation("stand", true, FRAMES, 10, [0, 1, 2, 1], null);
        ANIM_WALK = new Utils.Animation("move", true, FRAMES, 7, [0, 1, 2, 1], null);
        ANIM_ASCEND = new Utils.Animation("ascend", false, FRAMES, 3, [3, 4], null);
        ANIM_FALL_ASCEND = new Utils.Animation("fall ascend", false, FRAMES, 5, [5, 6, 7], null);
        ANIM_FALL = new Utils.Animation("fall", false, FRAMES, 5, [6, 7], null);
    });
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(def) {
            var _this = _super.call(this, def) || this;
            _this.platformParent = null;
            _this.sprite = new Engine.Sprite();
            _this.stiltOff = 0;
            _this.stiltActivate = false;
            _this.boxContact = new Engine.Box();
            Player.instance = _this;
            _this.title = _this.getProperty("title");
            _this.last = _this.getProperty("last");
            _this.control = new Game.Interaction.Controls.Platformer.BasicJumperControls();
            _this.xCanMove = true;
            _this.boxSolid.xSize = 7;
            _this.boxSolid.ySize = BOX_Y_SIZE;
            _this.boxSolid.xOffset = -_this.boxSolid.xSize * 0.5;
            _this.boxSolid.yOffset = -_this.boxSolid.ySize;
            _this.boxContact.enabled = true;
            _this.boxContact.renderable = true;
            _this.boxContact.xSize = 7;
            _this.boxContact.ySize = BOX_Y_SIZE;
            _this.boxContact.xOffset = -_this.boxContact.xSize * 0.5;
            _this.boxContact.yOffset = -_this.boxContact.ySize;
            _this.boxContact.green = 0;
            _this.boxContact.red = 1;
            _this.sprite.enabled = true;
            _this.sprite.x = _this.boxSolid.x;
            _this.sprite.y = _this.boxSolid.y;
            Game.Arcade.Platformer.Platform.pushInteractable(_this);
            _this.animator = new Utils.Animator();
            _this.animator.enabled = true;
            _this.animator.listener = _this;
            _this.animator.owner = _this;
            _this.emitter = new Game.Emission.Emitter(Game.PlayerParticle, 8);
            _this.emitter.sizeEmission = 4;
            Game.Stilt.ini();
            return _this;
        }
        Object.defineProperty(Player.prototype, "xRender", {
            get: function () {
                var x = this.sprite.x;
                if (Game.SceneMap.instance.xSizeMap - Game.SceneMap.instance.xSizeTile * 2 < Engine.Renderer.xSizeView) {
                    x = Game.SceneMap.instance.xSizeMap * 0.5;
                }
                else if (x < Engine.Renderer.xSizeView * 0.5 + Game.SceneMap.instance.xSizeTile) {
                    x = Engine.Renderer.xSizeView * 0.5 + Game.SceneMap.instance.xSizeTile;
                }
                else if (x > Game.SceneMap.instance.xSizeMap - Engine.Renderer.xSizeView * 0.5 - Game.SceneMap.instance.xSizeTile) {
                    x = Game.SceneMap.instance.xSizeMap - Engine.Renderer.xSizeView * 0.5 - Game.SceneMap.instance.xSizeTile;
                }
                return x;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "yRender", {
            get: function () {
                var y = this.sprite.y;
                if (Game.SceneMap.instance.ySizeMap - Game.SceneMap.instance.ySizeTile * 2 < Engine.Renderer.ySizeView) {
                    y = Game.SceneMap.instance.ySizeMap * 0.5;
                }
                else if (y < Engine.Renderer.ySizeView * 0.5 + Game.SceneMap.instance.ySizeTile) {
                    y = Engine.Renderer.ySizeView * 0.5 + Game.SceneMap.instance.ySizeTile;
                }
                else if (y > Game.SceneMap.instance.ySizeMap - Engine.Renderer.ySizeView * 0.5 - Game.SceneMap.instance.ySizeTile) {
                    y = Game.SceneMap.instance.ySizeMap - Engine.Renderer.ySizeView * 0.5 - Game.SceneMap.instance.ySizeTile;
                }
                return y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "xVelExtern", {
            get: function () {
                return (this.platformParent == null ? 0 : this.platformParent.xGetVelMove());
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "yVelExtern", {
            get: function () {
                return (this.platformParent == null ? 0 : this.platformParent.yGetVelMove());
            },
            enumerable: false,
            configurable: true
        });
        Player.prototype.onReset = function () {
            _super.prototype.onReset.call(this);
            this.winning = false;
            this.losing = false;
            this.hasWon = false;
            this.hasLost = false;
            this.xCanMove = true;
            this.yCanMove = true;
            this.sprite.x = this.boxSolid.x;
            this.sprite.y = this.boxSolid.y;
            this.sprite.enabled = true;
            this.state = NONE;
            this.jumpCanceled = false;
            this.hurt = false;
            this.countNext = 0;
            this.xDir = this.def.flip.x ? -1 : 1;
            this.sprite.xMirror = this.xDir < 0;
            this.stiltOff = 1;
            this.stiltActivate = false;
            this.boxSolid.ySize = BOX_Y_SIZE;
            this.boxSolid.yOffset = -this.boxSolid.ySize;
            this.stiltSize = Game.BASE_STILT_SIZE;
            this.needJump = false;
            this.checkLinks();
        };
        Player.prototype.onStart = function () {
            if (this.getProperty("stilts")) {
                this.stiltSize = MAX_STILT_SIZE;
                this.stiltActivate = true;
                this.boxSolid.ySize = MAX_STILT_SIZE;
                this.boxSolid.yOffset = -this.boxSolid.ySize;
                Game.Stilt.show();
                Game.Stilt.upd(this.stiltSize);
            }
        };
        Player.prototype.onInitScene = function () {
            Game.Arcade.Platformer.Platform.pushInteractable(this);
        };
        Player.prototype.xMoveOnPlatform = function (dist) {
            var contacts = this.boxSolid.cast(Game.SceneMap.instance.noOneWaySolids, null, true, dist, true, Engine.Box.LAYER_ALL);
            this.boxSolid.translate(contacts, true, dist, true);
        };
        Player.prototype.yMoveOnPlatform = function (dist) {
            var contacts;
            if (this.yVel > 0) {
                this.boxSolid.cast(Game.SceneMap.instance.boxesSolids, null, false, dist, true, Engine.Box.LAYER_ALL);
            }
            else {
                this.boxSolid.cast(Game.SceneMap.instance.noOneWaySolids, null, false, dist, true, Engine.Box.LAYER_ALL);
            }
            this.boxSolid.translate(contacts, false, dist, true);
        };
        Player.prototype.onPlatformOverlapX = function () { };
        Player.prototype.onPlatformOverlapY = function () { };
        Player.prototype.onOverlapUpdate = function () {
            if (Game.SceneFreezer.stoped)
                return;
            if (!this.hurt) {
                this.hurt = this.boxContact.collide(Game.SceneMap.instance.boxesEnemies, null, false, 0, false, Engine.Box.LAYER_ALL) != null;
            }
            if (!this.winning && !this.title) {
                this.winning = this.boxSolid.collideAgainst(Game.Goal.instance.box, null, false, 0, false, Engine.Box.LAYER_ALL) != null;
                if (this.winning) {
                    Game.Goal.instance.getMe();
                }
            }
            if (!this.winning && !this.losing && this.hurt) {
                this.losing = true;
            }
            this.needJump = Game.Bubble.popAll();
        };
        Player.prototype.onMoveUpdate = function () {
            _super.prototype.onMoveUpdate.call(this);
            if (Game.SceneFreezer.stoped)
                return;
            this.sprite.x = this.boxSolid.x;
            this.sprite.y = this.boxSolid.y;
            if (!Game.SceneFreezer.stoped) {
                if (this.state != DEAD) {
                    if (this.xDirContact != 0) {
                        if (this.stiltActivate && !this.last) {
                            if (this.stiltSize == MAX_STILT_SIZE) {
                                this.boxContact.x = this.boxSolid.x;
                                this.boxContact.y = this.boxSolid.y - (this.boxSolid.ySize - BOX_Y_SIZE);
                                if (this.boxContact.cast(Game.SceneMap.instance.boxesSolids, null, true, 1 * this.xDir, false, Engine.Box.LAYER_ALL) == null) {
                                    this.cancelStilts();
                                }
                                else {
                                    this.xDir = -this.xDir;
                                    this.sprite.xMirror = this.xDir < 0;
                                }
                            }
                        }
                        else if (this.state == WALK) {
                            this.xDir = -this.xDir;
                            this.sprite.xMirror = this.xDir < 0;
                        }
                    }
                    this.xVel = this.xDir * VEL_MOVE;
                    this.xCanMove = true;
                    this.yCanMove = true;
                    if (this.yDirContact > 0) {
                        this.checkPlatformParent(this.yContacts);
                    }
                    else {
                        if (this.platformParent != null) {
                            this.platformParent.removeChild(this);
                        }
                        if (this.stiltActivate) {
                            this.cancelStilts();
                        }
                    }
                }
                else {
                    this.xCanMove = false;
                    this.yCanMove = false;
                    if (this.platformParent != null) {
                        this.platformParent.removeChild(this);
                    }
                }
            }
            if (!this.title && this.stiltActivate) {
                this.stiltSize += STILT_SPEED;
                if (this.stiltSize > MAX_STILT_SIZE && !this.last) {
                    this.stiltSize = MAX_STILT_SIZE;
                }
                if (this.stiltSize > Game.START_STILT_SIZE) {
                    this.boxSolid.ySize = this.stiltSize;
                    this.boxSolid.yOffset = -this.boxSolid.ySize;
                }
                Game.Stilt.upd(this.stiltSize);
                if (this.control.pressedDelayedAction && !this.last) {
                    this.cancelStilts();
                }
            }
            if (!this.stiltActivate && this.control.pressedDelayedAction && this.yDirContact > 0) {
                this.boxContact.x = this.boxSolid.x;
                this.boxContact.y = this.boxSolid.y;
                this.boxContact.ySize = 8;
                this.boxContact.yOffset = -this.boxContact.ySize;
                if (this.boxContact.cast(Game.SceneMap.instance.boxesSolids, null, false, -1, false, Engine.Box.LAYER_ALL) == null) {
                    this.stiltSize = Game.BASE_STILT_SIZE;
                    this.stiltActivate = true;
                    this.boxSolid.ySize = Game.START_STILT_SIZE;
                    this.boxSolid.yOffset = -this.boxSolid.ySize;
                    this.control.consumeDelayedAction();
                    Game.Resources.sfxStilts.autoplay();
                    Game.Stilt.show();
                }
                this.boxContact.ySize = BOX_Y_SIZE;
                this.boxContact.yOffset = -this.boxContact.ySize;
            }
            this.boxContact.x = this.boxSolid.x;
            this.boxContact.y = this.boxSolid.y - (this.boxSolid.ySize - BOX_Y_SIZE);
        };
        Player.prototype.cancelStilts = function (playSound) {
            if (playSound === void 0) { playSound = true; }
            this.stiltActivate = false;
            this.control.consumeDelayedAction();
            //this.boxSolid.y -=
            this.boxSolid.y -= this.boxSolid.ySize - BOX_Y_SIZE;
            this.boxSolid.ySize = BOX_Y_SIZE;
            this.boxSolid.yOffset = -this.boxSolid.ySize;
            if (playSound)
                Game.Resources.sfxStiltsOff.autoplay();
            Game.Stilt.hid(this.stiltOff);
        };
        Player.prototype.checkPlatformParent = function (contacts) {
            var newParent = null;
            for (var _i = 0, contacts_1 = contacts; _i < contacts_1.length; _i++) {
                var contact = contacts_1[_i];
                if (contact.other.data instanceof Game.Arcade.Platformer.Platform) {
                    newParent = contact.other.data;
                    if (newParent == this.platformParent) {
                        break;
                    }
                }
            }
            if (newParent != this.platformParent) {
                if (this.platformParent != null) {
                    this.platformParent.removeChild(this);
                }
                if (newParent != null) {
                    newParent.addChild(this);
                }
                this.platformParent = newParent;
            }
        };
        Player.prototype.onSetFrame = function (_animator, _animation, _frame) {
            if (_animation == ANIM_WALK) {
                this.stiltOff = 1 + 1 * _animation.indexArray[_animator.indexFrame];
            }
            _frame.applyToSprite(this.sprite);
        };
        Player.prototype.onStepUpdate = function () {
            if (!Game.SceneFreezer.stoped) {
                if (this.winning || this.losing) {
                    this.countNext++;
                }
                this.hasWon = this.winning && this.countNext > STEPS_WIN;
                this.hasLost = this.losing && this.countNext > STEPS_LOSS;
                this.checkLinks();
            }
        };
        Player.prototype.setState = function (next) {
            this.exitState(next);
            this.enterState(next);
        };
        Player.prototype.exitState = function (_next) {
            switch (this.state) {
            }
        };
        Player.prototype.enterState = function (next) {
            var old = this.state;
            this.state = next;
            switch (this.state) {
                case WALK: {
                    this.animator.setAnimation(ANIM_WALK);
                    if (old != NONE)
                        Game.Bubble.restoreAll();
                    break;
                }
                case JUMP: {
                    this.animator.setAnimation(ANIM_ASCEND);
                    //this.control.consumeDelayedAction();
                    this.jumpCanceled = false;
                    this.yVel = -VEL_JUMP_NORMAL;
                    if (this.stiltActivate) {
                        this.cancelStilts();
                    }
                    break;
                }
                case FALL: {
                    if (old == JUMP) {
                        this.animator.setAnimation(ANIM_FALL_ASCEND);
                    }
                    else {
                        this.animator.setAnimation(ANIM_FALL);
                    }
                    this.control.consumeDelayedAction();
                    break;
                }
                case DEAD: {
                    Game.Resources.sfxLose.autoplay();
                    this.xCanMove = false;
                    this.yCanMove = false;
                    this.sprite.enabled = false;
                    this.emitter.x = this.boxSolid.x;
                    this.emitter.y = this.boxSolid.y - this.boxSolid.ySize * 0.5;
                    this.emitter.emittChunk();
                    if (this.stiltActivate)
                        this.cancelStilts(false);
                    return;
                }
            }
        };
        Object.defineProperty(Player.prototype, "noStuckControl", {
            get: function () {
                return Engine.Keyboard.pressed(Engine.Keyboard.S) || Engine.Keyboard.pressed(Engine.Keyboard.DOWN);
            },
            enumerable: false,
            configurable: true
        });
        Player.prototype.checkLinks = function () {
            if (this.state != DEAD && this.hurt) {
                this.setState(DEAD);
                return;
            }
            switch (this.state) {
                case NONE: {
                    this.setState(WALK);
                    return;
                }
                case WALK: {
                    if (this.yDirContact == 0 && this.yVel > 0) {
                        this.setState(FALL);
                        return;
                    }
                    if (this.needJump) {
                        this.setState(JUMP);
                        return;
                    }
                    return;
                }
                case JUMP: {
                    if (this.needJump) {
                        this.setState(JUMP);
                        return;
                    }
                    if (this.yDirContact > 0) {
                        this.setState(WALK);
                        return;
                    }
                    if (this.yVel >= 0) {
                        this.setState(FALL);
                        return;
                    }
                    return;
                }
                case FALL: {
                    if (this.needJump) {
                        this.setState(JUMP);
                        return;
                    }
                    if (this.yDirContact > 0) {
                        this.setState(WALK);
                        return;
                    }
                    return;
                }
                case DEAD: {
                    return;
                }
            }
        };
        Player.prototype.onTimeUpdate = function () {
            _super.prototype.onTimeUpdate.call(this);
            this.sprite.x = this.xDraw;
            this.sprite.y = this.yDraw;
            if (this.stiltActivate) {
                this.sprite.y -= 1;
                if (this.stiltSize > Game.START_STILT_SIZE) {
                    this.sprite.y -= this.stiltSize - Game.START_STILT_SIZE;
                }
            }
        };
        Player.prototype.onDrawPlayerUnpaused = function () {
            if (!Game.SceneFreezer.stoped) {
                this.draw();
            }
        };
        Player.prototype.onDrawPlayerPaused = function () {
            if (Game.SceneFreezer.stoped) {
                this.draw();
            }
        };
        Player.prototype.onDrawBackStilt = function () {
            if (!this.last)
                Game.Stilt.drawOth(this.stiltOff);
        };
        Player.prototype.draw = function () {
            if (this.last)
                Game.Stilt.drawOth(this.stiltOff);
            Game.Stilt.draw(this.stiltOff);
            this.sprite.render();
            this.boxSolid.render();
            this.boxContact.render();
        };
        Player.instance = null;
        return Player;
    }(Game.Arcade.PhysicEntity));
    Game.Player = Player;
    var PlayerTitle = /** @class */ (function (_super) {
        __extends(PlayerTitle, _super);
        function PlayerTitle(def) {
            var _this = _super.call(this, def) || this;
            _this.sprite = new Engine.Sprite();
            _this.animator = new Utils.Animator();
            _this.sprite.enabled = true;
            _this.sprite.x = def.instance.x + 4;
            _this.sprite.y = def.instance.y;
            _this.animator.owner = _this;
            _this.animator.listener = _this;
            _this.animator.setAnimation(ANIM_STAND);
            return _this;
        }
        PlayerTitle.prototype.onSetFrame = function (_animator, _animation, _frame) {
            _frame.applyToSprite(this.sprite);
        };
        PlayerTitle.prototype.onDrawPlayerUnpaused = function () {
            if (!Game.SceneFreezer.stoped) {
                this.sprite.render();
            }
        };
        PlayerTitle.prototype.onDrawPlayerPaused = function () {
            if (Game.SceneFreezer.stoped) {
                this.sprite.render();
            }
        };
        return PlayerTitle;
    }(Game.Entity));
    Game.PlayerTitle = PlayerTitle;
    var PlayerInstancer = /** @class */ (function (_super) {
        __extends(PlayerInstancer, _super);
        function PlayerInstancer(def) {
            var _this = _super.call(this, def) || this;
            if (_this.getProperty("preloader")) {
                new PlayerTitle(def);
            }
            else {
                if (_this.getProperty("title")) {
                    def.instance.y += 8;
                }
                new Player(def);
            }
            return _this;
        }
        return PlayerInstancer;
    }(Game.Entity));
    Game.PlayerInstancer = PlayerInstancer;
})(Game || (Game = {}));
var Game;
(function (Game) {
    Game.addAction("init", function () {
        Game.FRAMES_GOAL_PARTICLES = Game.FrameSelector.complex("goal particles", Game.Resources.textureStilts, 0, 26);
    });
    var VEL = 1.3;
    var PlayerParticle = /** @class */ (function (_super) {
        __extends(PlayerParticle, _super);
        function PlayerParticle(emitter) {
            var _this = _super.call(this, emitter) || this;
            _this.countSteps = 0;
            _this.startFrame = 3;
            _this.parentRelative = false;
            return _this;
        }
        Object.defineProperty(PlayerParticle.prototype, "xRange", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlayerParticle.prototype, "yRange", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlayerParticle.prototype, "xRangeVel", {
            get: function () {
                if (this.index == 0 || this.index == 1) {
                    return VEL;
                }
                else {
                    return -VEL;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlayerParticle.prototype, "yRangeVel", {
            get: function () {
                if (this.index == 0 || this.index == 2) {
                    return VEL;
                }
                else {
                    return -VEL;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlayerParticle.prototype, "xRangeAccel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlayerParticle.prototype, "yRangeAccel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlayerParticle.prototype, "rangeLife", {
            get: function () {
                return 300;
            },
            enumerable: false,
            configurable: true
        });
        PlayerParticle.prototype.onReset = function () {
            _super.prototype.onReset.call(this);
        };
        PlayerParticle.prototype.emitt = function (index) {
            _super.prototype.emitt.call(this, index);
            this.countSteps = PlayerParticle.STEPS * this.startFrame;
            Game.FRAMES_GOAL_PARTICLES[this.startFrame].applyToSprite(this.sprite);
        };
        PlayerParticle.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
            if (this.enabled && !Game.SceneFreezer.stoped) {
                var index = Math.floor(this.countSteps / PlayerParticle.STEPS);
                if (index > Game.FRAMES_GOAL_PARTICLES.length - 1) {
                    index = Game.FRAMES_GOAL_PARTICLES.length - 1;
                }
                Game.FRAMES_GOAL_PARTICLES[index].applyToSprite(this.sprite);
                this.countSteps += 1;
            }
        };
        PlayerParticle.STEPS = 2;
        return PlayerParticle;
    }(Game.Emission.SimpleParticle));
    Game.PlayerParticle = PlayerParticle;
    var GoalGotParticle = /** @class */ (function (_super) {
        __extends(GoalGotParticle, _super);
        function GoalGotParticle(emitter) {
            var _this = _super.call(this, emitter) || this;
            _this.startFrame = 2;
            return _this;
        }
        return GoalGotParticle;
    }(PlayerParticle));
    Game.GoalGotParticle = GoalGotParticle;
})(Game || (Game = {}));
///<reference path="../../Game/System/Entity.ts"/>
var Game;
(function (Game) {
    var SimpleAnimator = /** @class */ (function () {
        function SimpleAnimator() {
            this.sprite = new Engine.Sprite();
            this.animator = new Utils.Animator();
            this.animator.listener = this;
            Engine.System.addListenersFrom(this);
        }
        SimpleAnimator.prototype.onReset = function () {
            this.sprite.enabled = false;
            this.animator.setAnimation(null);
        };
        SimpleAnimator.prototype.trigger = function (animation, x, y) {
            this.sprite.enabled = true;
            this.sprite.x = x;
            this.sprite.y = y;
            this.animator.setAnimation(animation);
        };
        SimpleAnimator.prototype.timeMove = function (dx, dy) {
            if (Game.SceneFreezer.stoped)
                return;
            this.sprite.x += dx * Engine.System.deltaTime;
            this.sprite.y += dy * Engine.System.deltaTime;
        };
        SimpleAnimator.prototype.timeMoveTo = function (x, y, vel, disable) {
            if (Game.SceneFreezer.stoped)
                return;
            vel *= Engine.System.deltaTime;
            var dx = x - this.sprite.x;
            var dy = y - this.sprite.y;
            var mag = Math.sqrt(dx * dx + dy * dy);
            if (mag < vel) {
                this.sprite.x = x;
                this.sprite.y = y;
                this.sprite.enabled = this.sprite.enabled && !disable;
            }
            else {
                this.sprite.x += dx * vel / mag;
                this.sprite.y += dy * vel / mag;
            }
        };
        SimpleAnimator.prototype.onSetFrame = function (_animator, _animation, frame) {
            frame.applyToSprite(this.sprite);
        };
        SimpleAnimator.prototype.render = function () {
            if (!this.animator.ended || (this.animator.animation != null && this.animator.animation.loop)) {
                this.sprite.render();
            }
        };
        return SimpleAnimator;
    }());
    Game.SimpleAnimator = SimpleAnimator;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var fra;
    Game.addAction("configure", function () {
        fra = Game.FrameSelector.complex("fraspa", Game.Resources.textureStilts, 197, 4);
    });
    var velang = 10;
    var Spark = /** @class */ (function (_super) {
        __extends(Spark, _super);
        function Spark(def) {
            var _this = _super.call(this, def) || this;
            _this.spr = new Engine.Sprite();
            _this.box = new Engine.Box();
            _this.des = new Float32Array(2);
            _this.box.enabled = _this.box.renderable = _this.spr.enabled = true;
            fra[0].applyToBox(_this.box);
            Game.SceneMap.instance.boxesEnemies.push(_this.box);
            _this.dis = _this.getProperty("dist") * 8;
            _this.sta = _this.def.instance.x + 4;
            _this.des[0] = _this.sta + _this.dis;
            _this.des[1] = _this.sta;
            _this.emi = new Game.Emission.Emitter(Game.SparkParticle, 60);
            _this.emi.sizeEmission = 1;
            _this.emi.emissionSteps = 1;
            return _this;
        }
        Spark.prototype.onReset = function () {
            this.box.x = this.def.instance.x + 4;
            this.box.y = this.def.instance.y - 4;
            this.emi.x = this.box.x;
            this.emi.y = this.box.y;
            this.spr.xMirror = this.dis < 0;
            this.vel = this.getProperty("vel") * (this.dis < 0 ? -1 : 1);
            this.ang = 0;
            this.fra = 0;
            this.cou = Math.abs(this.dis);
            this.loo = 0;
            fra[0].applyToSprite(this.spr);
        };
        Spark.prototype.onMoveUpdate = function () {
            if (Game.SceneFreezer.stoped)
                return;
            this.box.x += this.vel;
            this.cou -= Math.abs(this.vel);
            if (this.cou <= 0) {
                this.cou = Math.abs(this.dis);
                this.vel *= -1;
                this.spr.xMirror = !this.spr.xMirror;
                this.box.x = this.des[this.loo++];
                this.loo = this.loo % 2;
            }
            this.emi.x = this.box.x;
            this.emi.y = this.box.y;
        };
        Spark.prototype.onStepUpdate = function () {
            if (Game.SceneFreezer.stoped)
                return;
            fra[Math.floor((this.fra++) / 10) % 4].applyToSprite(this.spr);
        };
        Spark.prototype.onDrawSpark = function () {
            this.ang += velang * (Game.SceneFreezer.stoped ? 0 : Engine.System.deltaTime);
            var x = this.box.x + this.vel * (Game.SceneFreezer.stoped ? 0 : Engine.System.stepExtrapolation);
            this.spr.renderAt(x, this.box.y + Math.sin(this.ang));
            this.box.render();
        };
        return Spark;
    }(Game.Entity));
    Game.Spark = Spark;
})(Game || (Game = {}));
///<reference path = "../../Game/Utils/Emission/SimpleParticle.ts"/>
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("init", function () {
        FRAMES = Game.FrameSelector.complex("spark particles", Game.Resources.textureStilts, 253, 4);
    });
    var SparkParticle = /** @class */ (function (_super) {
        __extends(SparkParticle, _super);
        function SparkParticle(emitter) {
            var _this = _super.call(this, emitter) || this;
            _this.support = false;
            _this.parentRelative = false;
            if (Engine.Renderer.mode != Engine.RendererMode.CANVAS_2D) {
                _this.sprite.setRGBA(1, 1, 1, 1);
            }
            return _this;
        }
        Object.defineProperty(SparkParticle.prototype, "xRange", {
            get: function () {
                return Game.range(-5, 5);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SparkParticle.prototype, "yRange", {
            get: function () {
                return Game.range(-3, 3);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SparkParticle.prototype, "xRangeVel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SparkParticle.prototype, "yRangeVel", {
            get: function () {
                return Game.range(-0.6, -0.8);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SparkParticle.prototype, "xRangeAccel", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SparkParticle.prototype, "yRangeAccel", {
            get: function () {
                return Game.range(0.004, 0.008);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SparkParticle.prototype, "rangeLife", {
            get: function () {
                return Game.range(20, 30);
            },
            enumerable: false,
            configurable: true
        });
        SparkParticle.prototype.emitt = function (index) {
            _super.prototype.emitt.call(this, index);
            this.lifeTotal = this.countLife;
            this.spriteIndex = 0;
            FRAMES[1].applyToSprite(this.sprite);
        };
        SparkParticle.prototype.onStepUpdate = function () {
            _super.prototype.onStepUpdate.call(this);
            if (!Game.SceneFreezer.stoped && this.enabled) {
                if (this.spriteIndex == 0 && this.countLife < this.lifeTotal * 0.55) {
                    FRAMES[2].applyToSprite(this.sprite);
                    this.spriteIndex = 1;
                }
            }
        };
        SparkParticle.prototype.onTimeUpdate = function () {
            _super.prototype.onTimeUpdate.call(this);
            if (!Game.SceneFreezer.stoped && this.enabled) {
                if (Engine.Renderer.mode != Engine.RendererMode.CANVAS_2D) {
                    var extLife = this.countLife - Engine.System.deltaTime;
                    if (extLife > 0) {
                        this.sprite.setRGBA(1, 1, 1, extLife / this.lifeTotal);
                    }
                    else {
                        this.sprite.setRGBA(1, 1, 1, 0);
                    }
                }
            }
        };
        SparkParticle.prototype.onDrawParticles = function () {
            //this.sprite.render();
        };
        SparkParticle.prototype.onDrawParticlesSpark = function () {
            this.sprite.render();
        };
        return SparkParticle;
    }(Game.Emission.SimpleParticle));
    Game.SparkParticle = SparkParticle;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Spike = /** @class */ (function (_super) {
        __extends(Spike, _super);
        function Spike(def, frames, anim) {
            var _this = _super.call(this, def) || this;
            frames[0].applyToBox(_this.boxSolid);
            Game.SceneMap.instance.boxesEnemies.push(_this.boxSolid);
            //Spike.boxes.push(this.boxSolid);
            _this.xScaleForceWorld = 0;
            _this.yScaleForceWorld = 0;
            _this.xCanMove = false;
            _this.yCanMove = false;
            _this.animator.setAnimation(anim);
            return _this;
        }
        Spike.prototype.onReset = function () {
            _super.prototype.onReset.call(this);
        };
        Spike.prototype.onStart = function () {
            var contacts = this.boxSolid.collide(Game.SceneMap.instance.boxesSolids, null, false, 0, false, Engine.Box.LAYER_ALL);
            if (contacts != null) {
                for (var _i = 0, contacts_2 = contacts; _i < contacts_2.length; _i++) {
                    var contact = contacts_2[_i];
                    if (contact.other.data instanceof Game.Arcade.Platformer.Platform) {
                        contact.other.data.addChild(this);
                        break;
                    }
                }
            }
        };
        Spike.prototype.xMoveOnPlatform = function (dist) {
            this.boxSolid.x += dist;
        };
        Spike.prototype.yMoveOnPlatform = function (dist) {
            this.boxSolid.y += dist;
        };
        Spike.prototype.onPlatformOverlapX = function () {
        };
        Spike.prototype.onPlatformOverlapY = function () {
        };
        Spike.prototype.onDrawObjectsBack = function () {
            if (this.platformParent != null) {
                this.sprite.x += this.platformParent.xGetVelMove() * Engine.System.deltaTime;
                this.sprite.y += this.platformParent.yGetVelMove() * Engine.System.deltaTime;
            }
            this.sprite.render();
            if (Engine.Box.debugRender) {
                this.boxSolid.render();
            }
        };
        Spike.prototype.onClearScene = function () {
            Spike.boxes = [];
        };
        Spike.boxes = [];
        return Spike;
    }(Game.Arcade.WorldEntity));
    Game.Spike = Spike;
    var FRAMES_ANIM_0;
    var ANIM_0;
    Game.addAction("configure", function () {
        FRAMES_ANIM_0 = Game.FrameSelector.complex("spike 0", Game.Resources.textureStilts, 410, 26);
        ANIM_0 = new Utils.Animation("spike 0", true, FRAMES_ANIM_0, 25, [0, 0], null);
    });
    var Spike0 = /** @class */ (function (_super) {
        __extends(Spike0, _super);
        function Spike0(def) {
            var _this = _super.call(this, def, FRAMES_ANIM_0, ANIM_0) || this;
            def.instance.x += 4;
            _this.xAlign = "start";
            _this.yAlign = "end";
            return _this;
        }
        return Spike0;
    }(Spike));
    Game.Spike0 = Spike0;
    var FRAMES_ANIM_90;
    var ANIM_90;
    Game.addAction("configure", function () {
        FRAMES_ANIM_90 = Game.FrameSelector.complex("spike 90", Game.Resources.textureStilts, 410, 44);
        ANIM_90 = new Utils.Animation("spike 90", true, FRAMES_ANIM_90, 25, [0, 0], null);
    });
    var Spike90 = /** @class */ (function (_super) {
        __extends(Spike90, _super);
        function Spike90(def) {
            var _this = _super.call(this, def, FRAMES_ANIM_90, ANIM_90) || this;
            //this.boxSolid.ySize=5;
            //this.boxSolid.yOffset=-2.5;
            def.instance.y += 4;
            _this.xAlign = "start";
            _this.yAlign = "start";
            return _this;
        }
        return Spike90;
    }(Spike));
    Game.Spike90 = Spike90;
    var FRAMES_ANIM_180;
    var ANIM_180;
    Game.addAction("configure", function () {
        FRAMES_ANIM_180 = Game.FrameSelector.complex("spike 180", Game.Resources.textureStilts, 427, 26);
        ANIM_180 = new Utils.Animation("spike 180", true, FRAMES_ANIM_180, 25, [0, 0], null);
    });
    var Spike180 = /** @class */ (function (_super) {
        __extends(Spike180, _super);
        function Spike180(def) {
            var _this = _super.call(this, def, FRAMES_ANIM_180, ANIM_180) || this;
            def.instance.x += 4;
            _this.xAlign = "start";
            _this.yAlign = "start";
            return _this;
        }
        return Spike180;
    }(Spike));
    Game.Spike180 = Spike180;
    var FRAMES_ANIM_270;
    var ANIM_270;
    Game.addAction("configure", function () {
        FRAMES_ANIM_270 = Game.FrameSelector.complex("spike 270", Game.Resources.textureStilts, 427, 44);
        ANIM_270 = new Utils.Animation("spike 270", true, FRAMES_ANIM_270, 25, [0, 0], null);
    });
    var Spike270 = /** @class */ (function (_super) {
        __extends(Spike270, _super);
        function Spike270(def) {
            var _this = _super.call(this, def, FRAMES_ANIM_270, ANIM_270) || this;
            def.instance.y += 4;
            _this.xAlign = "end";
            _this.yAlign = "start";
            return _this;
        }
        return Spike270;
    }(Spike));
    Game.Spike270 = Spike270;
})(Game || (Game = {}));
///<reference path = "../../Game/System/Entity.ts"/>
var Game;
(function (Game) {
    var StaticDecoration = /** @class */ (function (_super) {
        __extends(StaticDecoration, _super);
        function StaticDecoration(def, frame) {
            var _this = _super.call(this, def) || this;
            _this.sprite = new Engine.Sprite();
            _this.sprite.enabled = true;
            frame.applyToSprite(_this.sprite);
            _this.sprite.xMirror = def.flip.x;
            //this.yStart -= SceneMap.instance.ySizeTile * 0.5;
            _this.boxSolid = new Engine.Box();
            _this.boxSolid.enabled = true;
            _this.boxSolid.renderable = true;
            frame.applyToBox(_this.boxSolid);
            return _this;
        }
        StaticDecoration.prototype.onStart = function () {
            this.sprite.x = this.def.instance.x;
            this.sprite.x += Game.SceneMap.instance.xSizeTile * 0.5;
            this.sprite.y = this.def.instance.y;
            this.boxSolid.x = this.sprite.x;
            this.boxSolid.y = this.sprite.y;
            var contacts = this.boxSolid.collide(Game.SceneMap.instance.boxesSolids, null, false, 0, false, Engine.Box.LAYER_ALL);
            if (contacts != null) {
                for (var _i = 0, contacts_3 = contacts; _i < contacts_3.length; _i++) {
                    var contact = contacts_3[_i];
                    if (contact.other.data instanceof Game.Arcade.Platformer.Platform) {
                        contact.other.data.addChild(this);
                        break;
                    }
                }
            }
        };
        StaticDecoration.prototype.xMoveOnPlatform = function (dist) {
            this.sprite.x += dist;
        };
        StaticDecoration.prototype.yMoveOnPlatform = function (dist) {
            this.sprite.y += dist;
        };
        StaticDecoration.prototype.onPlatformOverlapX = function () {
        };
        StaticDecoration.prototype.onPlatformOverlapY = function () {
        };
        StaticDecoration.prototype.onDrawStaticDecoration = function () {
            var xOld = this.sprite.x;
            var yOld = this.sprite.y;
            if (this.platformParent != null) {
                this.sprite.x += this.platformParent.xGetVelMove() * Engine.System.deltaTime;
                this.sprite.y += this.platformParent.yGetVelMove() * Engine.System.deltaTime;
            }
            this.sprite.render();
            this.sprite.x = xOld;
            this.sprite.y = yOld;
        };
        return StaticDecoration;
    }(Game.Entity));
    Game.StaticDecoration = StaticDecoration;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("stiltm", Game.Resources.textureStilts, 117, 4);
    });
    var arr;
    var lef;
    var rig;
    var ind;
    var X_HID_VEL = 0.2 * 1;
    var Y_HID_VEL = 1 * 1;
    var GRAVITY = 0.2 * 1;
    var Stilt = /** @class */ (function (_super) {
        __extends(Stilt, _super);
        function Stilt(lef) {
            var _this = _super.call(this) || this;
            _this.sprbut = new Engine.Sprite();
            _this.sprmid = new Engine.Sprite();
            _this.sprtop = new Engine.Sprite();
            _this.lef = lef;
            FRAMES[0].applyToSprite(_this.sprbut);
            FRAMES[1].applyToSprite(_this.sprmid);
            FRAMES[2].applyToSprite(_this.sprtop);
            return _this;
        }
        Stilt.prototype.onReset = function () {
            this.sprbut.enabled = false;
            this.sprmid.enabled = false;
            this.sprtop.enabled = false;
            this.sprmid.yScale = 7;
            this.usi = false;
        };
        Stilt.prototype.act = function () {
            this.sprbut.enabled = true;
            this.sprmid.enabled = true;
            this.sprtop.enabled = true;
        };
        Stilt.prototype.off = function () {
            this.sprbut.enabled = false;
            this.sprmid.enabled = false;
            this.sprtop.enabled = false;
        };
        Stilt.ini = function () {
            ind = 0;
            arr = [];
            for (var i = 0; i < 10; i++) {
                arr.push(new Stilt(i % 2 == 0));
            }
        };
        Stilt.show = function () {
            lef = arr[ind++];
            rig = arr[ind++];
            lef.sprmid.yScale = Game.BASE_STILT_SIZE;
            rig.sprmid.yScale = Game.BASE_STILT_SIZE;
            lef.act();
            rig.act();
            lef.usi = true;
            rig.usi = true;
            if (ind >= arr.length) {
                ind = 0;
            }
        };
        Stilt.upd = function (size) {
            lef.sprmid.yScale = size;
            rig.sprmid.yScale = size;
        };
        Stilt.hid = function (offset) {
            lef.hid(offset);
            rig.hid(offset);
        };
        Stilt.prototype.hid = function (offset) {
            var x = Game.Player.instance.boxContact.x + (this.lef ? -offset : offset);
            this.sprbut.x = x;
            this.sprbut.y = Game.Player.instance.boxContact.y + Game.Player.instance.stiltSize - Game.Player.instance.boxContact.ySize;
            this.usi = false;
            this.xvel = X_HID_VEL * (this.lef ? -1 : 1);
            this.yvel = -Y_HID_VEL;
        };
        Stilt.draw = function (offset) {
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var s = arr_1[_i];
                if (s.sprmid.enabled) {
                    s.draw(offset);
                }
            }
        };
        Stilt.drawOth = function (offset) {
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var s = arr_2[_i];
                if (s.sprmid.enabled) {
                    s.drawOth(offset);
                }
            }
        };
        Stilt.prototype.onMoveUpdate = function () {
            if (Game.SceneFreezer.stoped)
                return;
            if (this.sprmid.enabled && !this.usi) {
                this.sprbut.x += this.xvel;
                this.sprbut.y += this.yvel;
                this.yvel += GRAVITY;
            }
        };
        Stilt.prototype.drawMe = function (offset) {
            if (!this.sprmid.enabled)
                return;
            var x = Game.Player.instance.xDraw + (this.lef ? -offset : offset);
            if (this.usi) {
                this.sprbut.x = x;
                this.sprbut.y = Game.Player.instance.yDraw;
                this.sprmid.x = x;
                this.sprmid.y = Game.Player.instance.yDraw - 1;
                this.sprtop.x = x;
                this.sprtop.y = Game.Player.instance.yDraw - this.sprmid.yScale;
                this.sprtop.render();
                this.sprmid.render();
                this.sprbut.render();
            }
            else {
                var xbut = this.sprbut.x;
                var ybut = this.sprbut.y;
                this.sprbut.x += this.xvel * Engine.System.deltaTime * (Game.SceneFreezer.stoped ? 0 : 1);
                this.sprbut.y += this.yvel * Engine.System.deltaTime * (Game.SceneFreezer.stoped ? 0 : 1);
                this.sprmid.x = this.sprbut.x;
                this.sprmid.y = this.sprbut.y - 1;
                this.sprtop.x = this.sprbut.x;
                this.sprtop.y = this.sprbut.y - this.sprmid.yScale;
                this.sprtop.render();
                this.sprmid.render();
                this.sprbut.render();
                this.sprbut.x = xbut;
                this.sprbut.y = ybut;
            }
        };
        Stilt.prototype.draw = function (offset) {
            if (Game.Player.instance.xDir > 0) {
                if (this.lef)
                    this.drawMe(offset);
            }
            else {
                if (!this.lef)
                    this.drawMe(offset);
            }
        };
        Stilt.prototype.drawOth = function (offset) {
            if (Game.Player.instance.xDir > 0) {
                if (!this.lef)
                    this.drawMe(offset);
            }
            else {
                if (this.lef)
                    this.drawMe(offset);
            }
        };
        Stilt.prototype.onClearScene = function () {
            arr = [];
        };
        return Stilt;
    }(Engine.Entity));
    Game.Stilt = Stilt;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var FRAMES;
    Game.addAction("configure", function () {
        FRAMES = Game.FrameSelector.complex("tutorial", Game.Resources.textureStilts, 0, 359);
    });
    var Tutorial = /** @class */ (function (_super) {
        __extends(Tutorial, _super);
        function Tutorial(def) {
            var _this = _super.call(this, def) || this;
            var touchOffset = _this.getProperty("touch offset");
            if (Game.IS_TOUCH) {
                if (touchOffset >= 0) {
                    new Game.StaticDecoration(def, FRAMES[_this.getProperty("index") + touchOffset]);
                }
            }
            else {
                new Game.StaticDecoration(def, FRAMES[_this.getProperty("index")]);
            }
            return _this;
        }
        return Tutorial;
    }(Game.Entity));
    Game.Tutorial = Tutorial;
})(Game || (Game = {}));
///<reference path="../../Engine/Entity.ts"/>
var Game;
(function (Game) {
    var X_LOADING_START = 0;
    var STEPS_DOTS = 20;
    //TODO: CHANGE SCENE FREEZER
    var LevelAdLoader = /** @class */ (function (_super) {
        __extends(LevelAdLoader, _super);
        function LevelAdLoader() {
            var _this = _super.call(this) || this;
            _this.count = 0;
            LevelAdLoader.instance = _this;
            _this.text = new Utils.Text();
            _this.text.font = Game.FontManager.ads;
            _this.text.scale = 1;
            _this.text.enabled = false;
            _this.text.pinned = true;
            _this.text.str = "   PLEASE WAIT   ";
            _this.text.xAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignBounds = Utils.AnchorAlignment.MIDDLE;
            _this.text.yAlignView = Utils.AnchorAlignment.MIDDLE;
            _this.text.xAligned = X_LOADING_START;
            _this.text.yAligned = 0;
            _this.text.front = true;
            _this.red = 234.0 / 255.0;
            _this.green = 247.0 / 255.0;
            _this.blue = 196.0 / 255.0;
            _this.alpha = 0;
            _this.sprite.setRGBA(_this.red, _this.green, _this.blue, 0);
            _this.maxAlpha = 0.5;
            _this.speed = 0.0166666666666667 * 4;
            return _this;
        }
        Object.defineProperty(LevelAdLoader, "blocked", {
            get: function () {
                return LevelAdLoader.instance.alpha != 0;
            },
            enumerable: false,
            configurable: true
        });
        LevelAdLoader.prototype.onStepUpdate = function () {
            if (this.direction > 0 && !this.text.enabled && this.alpha > 0.05) {
                //this.text.enabled = true;
            }
            else if (this.direction < 0 && this.text.enabled && this.alpha < 0.05) {
                //this.text.enabled = false;
            }
            if (this.text.enabled) {
                this.count += 1;
                if (this.count == STEPS_DOTS) {
                    this.count = 0;
                    if (this.text.str == "   PLEASE WAIT   ") {
                        this.text.str = "  .PLEASE WAIT.  ";
                    }
                    else if (this.text.str == "  .PLEASE WAIT.  ") {
                        this.text.str = " ..PLEASE WAIT.. ";
                    }
                    else if (this.text.str == " ..PLEASE WAIT.. ") {
                        this.text.str = "...PLEASE WAIT...";
                    }
                    else if (this.text.str == "...PLEASE WAIT...") {
                        this.text.str = "   PLEASE WAIT   ";
                    }
                }
                if (!LevelAdLoader.blocked) {
                    this.text.enabled = false;
                }
            }
        };
        LevelAdLoader.prototype.onDrawFade = function () {
        };
        LevelAdLoader.prototype.onDrawAdFade = function () {
            this.sprite.render();
        };
        LevelAdLoader.show = function () {
            //LevelAdLoader.instance.red = 1;
            //LevelAdLoader.instance.green = 1;
            //LevelAdLoader.instance.blue = 1;
            LevelAdLoader.instance.sprite.setRGBA(LevelAdLoader.instance.red, LevelAdLoader.instance.green, LevelAdLoader.instance.blue, LevelAdLoader.instance.alpha);
            LevelAdLoader.instance.text.enabled = true;
            LevelAdLoader.instance.text.str = "   PLEASE WAIT   ";
            LevelAdLoader.instance.count = 0;
            LevelAdLoader.instance.direction = 1;
            //LevelAdLoader.instance.speed = 0.0166666666666667 * 9999;
        };
        LevelAdLoader.hide = function (slowOnSpeedrun) {
            if (slowOnSpeedrun === void 0) { slowOnSpeedrun = false; }
            if (Game.Level.speedrun && slowOnSpeedrun && (Game.Scene.nextSceneClass == Game.Level || Game.Scene.nextSceneClass == "reset")) {
                LevelAdLoader.instance.speed = 0.0166666666666667 * 1;
            }
            else {
                LevelAdLoader.instance.speed = 0.0166666666666667 * 4;
            }
            LevelAdLoader.instance.direction = -1;
        };
        LevelAdLoader.prototype.onClearScene = function () {
            LevelAdLoader.instance = null;
        };
        LevelAdLoader.instance = null;
        return LevelAdLoader;
    }(Utils.Fade));
    Game.LevelAdLoader = LevelAdLoader;
})(Game || (Game = {}));
