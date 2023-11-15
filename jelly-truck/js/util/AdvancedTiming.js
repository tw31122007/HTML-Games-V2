(function() {
  "use strict";
  var Phaser, isFinite, now, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Phaser = Phaser || this.Phaser || window.Phaser || (typeof require === "function" ? require("phaser") : void 0);

  if (!Phaser) {
    throw new Error("Couldn't find `Phaser` or require 'phaser'.");
  }

  isFinite = Number.isFinite;

  now = ((ref = window.performance) != null ? ref.now.bind(window.performance) : void 0) || Date.now.bind(Date);

  Phaser.Plugin.AdvancedTiming = (function(superClass) {
    extend(AdvancedTiming, superClass);

    function AdvancedTiming() {
      return AdvancedTiming.__super__.constructor.apply(this, arguments);
    }

    AdvancedTiming.MODE_GRAPH = "graph";

    AdvancedTiming.MODE_METER = "meter";

    AdvancedTiming.MODE_TEXT = "text";

    AdvancedTiming.MODE_DOM_METER = "domMeter";

    AdvancedTiming.MODE_DOM_TEXT = "domText";

    AdvancedTiming.MODE_DEFAULT = AdvancedTiming.MODE_TEXT;

    AdvancedTiming.colors = {
      AQUA: "#7FDBFF",
      BLUE: "#0074D9",
      GRAY: "#666666",
      GREEN: "#2ECC40",
      NAVY: "#001F3F",
      ORANGE: "#FF851B",
      PURPLE: "#B10DC9",
      RED: "#FF4136",
      WHITE: "#FFFFFF",
      YELLOW: "#FFDC00"
    };

    AdvancedTiming.hexColors = {
      AQUA: 0x7FDBFF,
      BLUE: 0x0074D9,
      GRAY: 0x666666,
      GREEN: 0x2ECC40,
      NAVY: 0x001F3F,
      ORANGE: 0xFF851B,
      PURPLE: 0xB10DC9,
      RED: 0xFF4136,
      WHITE: 0xFFFFFF,
      YELLOW: 0xFFDC00
    };

    AdvancedTiming.modes = [AdvancedTiming.MODE_DEFAULT, AdvancedTiming.MODE_GRAPH, AdvancedTiming.MODE_METER, AdvancedTiming.MODE_TEXT, AdvancedTiming.MODE_DOM_METER, AdvancedTiming.MODE_DOM_TEXT];

    AdvancedTiming.renderTypes = [null, "Canvas", "WebGL", "Headless"];

    AdvancedTiming.prototype.alpha = 0.75;

    AdvancedTiming.prototype.enableResumeHandler = true;

    AdvancedTiming.prototype.lastTextContent = null;

    AdvancedTiming.prototype.name = "Advanced Timing Plugin";

    AdvancedTiming.prototype.renderDuration = 0;

    AdvancedTiming.prototype.showDurations = true;

    AdvancedTiming.prototype.showElapsed = false;

    AdvancedTiming.prototype.showSpiraling = true;

    AdvancedTiming.prototype.styleDomTextLikeDebugFont = false;

    AdvancedTiming.prototype.updateDuration = 0;

    AdvancedTiming.prototype._mode = null;

    Object.defineProperty(AdvancedTiming.prototype, "mode", {
      get: function() {
        return this._mode;
      },
      set: function(val) {
        if (val === this._mode) {
          return this._mode;
        }
        switch (val) {
          case this.constructor.MODE_GRAPH:
          case this.constructor.MODE_METER:
          case this.constructor.MODE_TEXT:
          case this.constructor.MODE_DOM_TEXT:
          case this.constructor.MODE_DOM_METER:
            this._mode = val;
            this.add();
            this.activeDisplay = this.display[this._mode];
            break;
          default:
            throw new Error("No such mode: '" + val + "'");
        }
        this.refresh();
        return this._mode;
      }
    });

    AdvancedTiming.prototype.init = function(options) {
      var game, mode;
      game = this.game;
      game.time.advancedTiming = true;
      this._gameUpdateLogic = this.game.updateLogic.bind(this.game);
      this._gameUpdateRender = this.game.updateRender.bind(this.game);
      this.game.updateLogic = this.updateLogic.bind(this);
      this.game.updateRender = this.updateRender.bind(this);
      this.group = game.make.group(null, "advancedTimingPlugin", true);
      this.position = new Phaser.Point;
      this.renderType = this.constructor.renderTypes[game.renderType];
      this.reset();
      game.onResume.add(this.onResume, this);
      game.debug.gameInfo = this.debugGameInfo.bind(this);
      game.debug.gameTimeInfo = this.debugGameTimeInfo.bind(this);
      this.display = {};
      if (options) {
        mode = options.mode;
        delete options.mode;
        Phaser.Utils.extend(this, options);
      }
      this.mode = mode || this.constructor.MODE_DEFAULT;
    };

    AdvancedTiming.prototype.update = function() {
      this.group.visible = this.visible;
      if (this.visible) {
        if (this.graphGroup && this.graphGroup.visible) {
          this.updateGraph();
        }
        if (this.meters && this.meters.visible) {
          this.updateMeters();
        }
        if (this.text && this.text.visible) {
          this.updateText();
        }
        if (this.domMeter) {
          this.updateDomMeter();
        }
        if (this.domText) {
          this.updateDomText();
        }
      }
    };

    AdvancedTiming.prototype.updateLogic = function(timeStep) {
      var time;
      time = now();
      this._gameUpdateLogic(timeStep);
      this.updateDuration = now() - time;
    };

    AdvancedTiming.prototype.updateRender = function(elapsedTime) {
      var time;
      time = now();
      this._gameUpdateRender(elapsedTime);
      this.renderDuration = now() - time;
    };

    AdvancedTiming.prototype.destroy = function() {
      AdvancedTiming.__super__.destroy.apply(this, arguments);
      this.graph.destroy();
      this.group.destroy();
    };

    AdvancedTiming.prototype.add = function() {
      switch (this._mode) {
        case this.constructor.MODE_GRAPH:
          if (!this.graphGroup) {
            this.addGraph();
          }
          break;
        case this.constructor.MODE_METER:
          if (!this.meters) {
            this.addMeters();
          }
          break;
        case this.constructor.MODE_TEXT:
          if (!this.text) {
            this.addText();
          }
          break;
        case this.constructor.MODE_DOM_METER:
          if (!this.domMeter) {
            this.addDomMeter();
          }
          break;
        case this.constructor.MODE_DOM_TEXT:
          if (!this.domText) {
            this.addDomText();
          }
          break;
        default:
          throw new Error("Nothing to add (bad mode: " + this._mode + ")");
      }
    };

    AdvancedTiming.prototype.addDomMeter = function() {
      this.domMeter = document.createElement("meter");
      this.domMeter.setAttribute("class", "ppat-fps ppat-meter");
      this.domMeter.setAttribute("min", 0);
      this.domMeter.setAttribute("max", this.game.time.desiredFps);
      this.domMeter.setAttribute("optimum", this.game.time.desiredFps);
      this.game.canvas.parentNode.appendChild(this.domMeter);
      this.display[this.constructor.MODE_DOM_METER] = this.domMeter;
    };

    AdvancedTiming.prototype.addDomText = function() {
      this.domText = document.createElement("pre");
      this.domText.setAttribute("class", "ppat-text");
      if (this.styleDomTextLikeDebugFont) {
        this.domText.style.font = this.game.debug.font;
      }
      this.game.canvas.parentNode.appendChild(this.domText);
      this.display[this.constructor.MODE_DOM_TEXT] = this.domText;
    };

    AdvancedTiming.prototype.addGraph = function(x, y) {
      var desiredFps, desiredMs, height, ref1, scaleY, style, width;
      if (x == null) {
        x = this.position.x;
      }
      if (y == null) {
        y = this.position.y;
      }
      desiredFps = this.game.time.desiredFps;
      desiredMs = this.desiredMs();
      style = {
        fill: "white",
        font: "10px monospace"
      };
      this.graphGroup = this.game.add.group(this.group, "advancedTimingPluginGraphGroup");
      this.graphGroup.x = x;
      this.graphGroup.y = y;
      this.graph = this.game.make.bitmapData(60, 60, "advancedTimingPluginGraph");
      this.graph.fill(0, 0, 0);
      this.graphX = 0;
      this.graphImage = this.game.add.image(0, 0, this.graph, null, this.graphGroup);
      this.graphImage.alpha = this.alpha;
      this.graphImage.scale.set(2);
      this.graphImage.smoothed = false;
      ref1 = this.graphImage, width = ref1.width, height = ref1.height;
      scaleY = this.graphImage.scale.y;
      this.game.add.text(width, height - scaleY * desiredFps, desiredFps + " fps", style, this.graphGroup);
      this.game.add.text(width, height - scaleY * desiredMs, desiredMs + " ms", style, this.graphGroup);
      this.display[this.constructor.MODE_GRAPH] = this.graphGroup;
    };

    AdvancedTiming.prototype.addMeter = function(name, x, y, key, tint, group) {
      var meter;
      name = name + "Meter";
      meter = group.create(x, y, key);
      meter.height = 10;
      meter.tint = tint;
      return this[name] = meter;
    };

    AdvancedTiming.prototype.addMeters = function(x, y) {
      var bt, hexColors;
      if (x == null) {
        x = this.position.x;
      }
      if (y == null) {
        y = this.position.y;
      }
      hexColors = this.constructor.hexColors;
      bt = this.game.make.bitmapData(1, 1).fill(255, 255, 255);
      this.meters = this.game.add.group(this.group, "advancedTimingPluginMeters");
      this.meters.alpha = this.alpha;
      this.meters.classType = Phaser.Image;
      this.meters.x = x;
      this.meters.y = y;
      this.fpsMeters = this.game.add.group(this.meters, "advancedTimingPluginFpsMeters");
      this.elapsedMeters = this.game.add.group(this.meters, "advancedTimingPluginElapsedMeters");
      this.durationMeters = this.game.add.group(this.meters, "advancedTimingPluginDurationMeters");
      this.addMeter("desiredFps", 0, 0, bt, hexColors.GRAY, this.fpsMeters);
      this.addMeter("fps", 0, 0, bt, hexColors.BLUE, this.fpsMeters);
      this.addMeter("desiredMs", 0, 20, bt, hexColors.GRAY, this.elapsedMeters);
      this.addMeter("elapsed", 0, 20, bt, hexColors.GREEN, this.elapsedMeters);
      this.addMeter("ms", 0, 20, bt, hexColors.YELLOW, this.elapsedMeters);
      this.addMeter("desiredDur", 0, 10, bt, hexColors.GRAY, this.durationMeters);
      this.addMeter("updateDuration", 0, 10, bt, hexColors.ORANGE, this.durationMeters);
      this.addMeter("renderDuration", 0, 10, bt, hexColors.PURPLE, this.durationMeters);
      this.display[this.constructor.MODE_METER] = this.meters;
    };

    AdvancedTiming.prototype.addText = function(x, y) {
      if (x == null) {
        x = this.position.x;
      }
      if (y == null) {
        y = this.position.y;
      }
      this.text = this.game.add.text(x+100, y, null, {
        fill: this.constructor.colors.WHITE,
        font: "20px king_cool_kc"
      }, this.group);
      this.text.name = "advancedTimingPluginText";
      this.display[this.constructor.MODE_TEXT] = this.text;
    };

    AdvancedTiming.prototype.debugGameInfo = function(x, y, color) {
      var debug, game;
      game = this.game;
      debug = game.debug;
      debug.start(x, y, color);
      debug.line("renderType:         " + this.renderType);
      debug.line("lockRender:         " + game.lockRender);
      debug.line("forceSingleUpdate:  " + game.forceSingleUpdate);
      debug.line("updatesThisFrame:   " + game.updatesThisFrame);
      debug.line("lastCount:          " + game._lastCount);
      debug.line("spiraling:          " + game._spiraling);
      debug.stop();
    };

    AdvancedTiming.prototype.debugGameTimeInfo = function(x, y, color) {
      var debug, game, time;
      game = this.game;
      debug = game.debug, time = game.time;
      debug.start(x, y, color);
      debug.line("fps:                " + time.fps + " " + (this.fpsRangeStr()));
      debug.line("desiredFps:         " + time.desiredFps);
      debug.line("suggestedFps:       " + time.suggestedFps);
      debug.line("elapsed:            " + time.elapsed + " ms " + (this.elapsedRangeStr()));
      debug.line("elapsedMS:          " + time.elapsedMS + " ms");
      debug.line("physicsElapsedMS:   " + (time.physicsElapsedMS.toFixed(2)) + " ms");
      debug.line("slowMotion:         " + time.slowMotion);
      debug.stop();
    };

    AdvancedTiming.prototype.desiredMs = function() {
      return Math.ceil(1000 / this.game.time.desiredFps);
    };

    AdvancedTiming.prototype.elapsedRange = function() {
      return this.game.time.msMax - this.game.time.msMin;
    };

    AdvancedTiming.prototype.elapsedRangeStr = function() {
      var msMax, msMin, ref1;
      ref1 = this.game.time, msMax = ref1.msMax, msMin = ref1.msMin;
      if (isFinite(msMax) && isFinite(msMin)) {
        return "(" + msMin + "–" + msMax + ")";
      } else {
        return "";
      }
    };

    AdvancedTiming.prototype.fpsColor = function(fps) {
      var colors, desiredFps;
      if (fps == null) {
        fps = this.game.time.fps;
      }
      desiredFps = this.game.time.desiredFps;
      colors = this.constructor.colors;
      switch (false) {
        case !(fps < (desiredFps / 2)):
          return colors.ORANGE;
        case !(fps < desiredFps):
          return colors.YELLOW;
        default:
          return colors.WHITE;
      }
    };

    AdvancedTiming.prototype.fpsRange = function() {
      return this.game.time.fpsMax - this.game.time.fpsMin;
    };

    AdvancedTiming.prototype.fpsRangeStr = function() {
      var fpsMax, fpsMin, ref1;
      ref1 = this.game.time, fpsMax = ref1.fpsMax, fpsMin = ref1.fpsMin;
      if (isFinite(fpsMax) && isFinite(fpsMin)) {
        return "(" + fpsMin + "–" + fpsMax + ")";
      } else {
        return "";
      }
    };

    AdvancedTiming.prototype.onResume = function() {
      this.reset();
    };

    AdvancedTiming.prototype.refresh = function() {
      var name, obj, ref1;
      ref1 = this.display;
      for (name in ref1) {
        obj = ref1[name];
        if (obj.setAttribute) {
          if (name === this._mode) {
            obj.removeAttribute("hidden");
          } else {
            obj.setAttribute("hidden", "");
          }
        } else {
          obj.visible = name === this._mode;
        }
      }
    };

    AdvancedTiming.prototype.reset = function(fpsMin, fpsMax, msMin, msMax) {
      var time;
      if (fpsMin == null) {
        fpsMin = Infinity;
      }
      if (fpsMax == null) {
        fpsMax = 0;
      }
      if (msMin == null) {
        msMin = Infinity;
      }
      if (msMax == null) {
        msMax = 0;
      }
      time = this.game.time;
      time.fpsMin = fpsMin;
      time.fpsMax = fpsMax;
      time.msMin = msMin;
      time.msMax = msMax;
    };

    AdvancedTiming.prototype.resetElapsed = function() {
      var time;
      time = this.game.time;
      time.elapsed = time.now - time.prevTime;
    };

    AdvancedTiming.prototype.textContent = function() {
      var drawCount;
      drawCount = this.game.renderer.renderSession.drawCount;
      return (this.game.time.fps + " fps " + this.renderType) + (drawCount ? " (" + drawCount + ")" : "");
    };

    AdvancedTiming.prototype.updateDomMeter = function() {
      this.domMeter.value = this.game.time.fps;
    };

    AdvancedTiming.prototype.updateDomText = function() {
      var content;
      content = this.textContent();
      if (content !== this.lastTextContent) {
        this.domText.textContent = this.lastTextContent = content;
        this.domText.style.color = this.fpsColor();
      }
    };

    AdvancedTiming.prototype.updateGraph = function() {
      var _spiraling, colors, elapsed, elapsedMS, forceSingleUpdate, fps, graph, graphX, height, ref1, ref2, updatesThisFrame;
      ref1 = this.game, forceSingleUpdate = ref1.forceSingleUpdate, _spiraling = ref1._spiraling, updatesThisFrame = ref1.updatesThisFrame;
      ref2 = this.game.time, elapsed = ref2.elapsed, elapsedMS = ref2.elapsedMS, fps = ref2.fps;
      graph = this.graph, graphX = this.graphX;
      colors = this.constructor.colors;
      height = graph.height;
      graph.dirty = true;
      graph.rect(graphX, 0, 1, height, "black");
      if (fps <= height) {
        graph.rect(graphX, height - fps, 1, 1, colors.BLUE);
      }
      if (this.showElapsed) {
        if (elapsed <= height) {
          graph.rect(graphX, height - elapsed, 1, 1, colors.GREEN);
        }
        if (elapsed !== elapsedMS && elapsed <= height) {
          graph.rect(graphX, height - elapsedMS, 1, 1, colors.YELLOW);
        }
        if (!forceSingleUpdate) {
          graph.rect(graphX, height - updatesThisFrame, 1, 1, colors.NAVY);
        }
      }
      if (this.showDurations) {
        graph.rect(graphX, height - ~~this.updateDuration, 1, 1, colors.ORANGE);
        graph.rect(graphX, height - ~~this.renderDuration, 1, 1, colors.PURPLE);
      }
      if (this.showSpiraling && _spiraling > 0) {
        graph.rect(graphX, height - _spiraling, 1, 1, colors.RED);
      }
      this.graphX += 1;
      this.graphX %= graph.width;
    };

    AdvancedTiming.prototype.updateMeters = function() {
      var desiredFps, desiredMs, elapsed, elapsedMS, fps, ref1;
      ref1 = this.game.time, desiredFps = ref1.desiredFps, elapsed = ref1.elapsed, elapsedMS = ref1.elapsedMS, fps = ref1.fps;
      desiredMs = this.desiredMs();
      this.desiredFpsMeter.scale.x = desiredFps;
      this.fpsMeter.scale.x = fps;
      this.elapsedMeters.visible = this.showElapsed;
      if (this.showElapsed) {
        this.desiredMsMeter.scale.x = desiredMs;
        this.msMeter.scale.x = elapsedMS;
        this.elapsedMeter.scale.x = elapsed;
      }
      this.durationMeters.visible = this.showDurations;
      if (this.showDurations) {
        this.desiredDurMeter.scale.x = desiredMs;
        this.updateDurationMeter.scale.x = this.updateDuration;
        this.renderDurationMeter.scale.x = this.renderDuration;
        this.renderDurationMeter.x = this.updateDurationMeter.width;
      }
    };

    AdvancedTiming.prototype.updateText = function() {
      this.text.text = this.textContent();
      this.text.style.fill = this.fpsColor();
    };

    return AdvancedTiming;

  })(Phaser.Plugin);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Phaser.Plugin.AdvancedTiming;
  }

}).call(this);