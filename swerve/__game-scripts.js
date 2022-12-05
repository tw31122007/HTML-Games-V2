var Environment = new pc.Script("environment");
Environment.attributes.add("templateGround", {
	type: "entity"
}), Environment.attributes.add("templateProps", {
	type: "entity"
}), Environment.attributes.add("xLead", {
	type: "number",
	"default": 6
}), Environment.attributes.add("zLead", {
	type: "number",
	"default": 4
}), Environment.attributes.add("cellSize", {
	type: "number",
	"default": 10
}), Environment.attributes.add("propChanceModifier", {
	type: "number",
	"default": 2
}), Environment.v1 = new pc.Vec3, Environment.v2 = new pc.Vec3;
var FAST_HIDE = !0,
	QueueItem = function() {
		this.hash = 0, this.x = 0, this.z = 0
	};
Environment.prototype.initialize = function() {
	this.camera = this.app.root.findByName("camera").camera, this.player = this.app.root.findByName("player"), this.cellBlocks = {}, this.cellPoolIndexes = {}, this.topLeftRoads = {}, this.topRightRoads = {}, this.bottomLeftRoads = {}, this.bottomRightRoads = {}, this.props = {}, this.propPoolIndexes = {}, this.fillQueue = [], this.maxFillQueue = 10;
	for (var e = 0; e < this.maxFillQueue; e++) this.fillQueue.push(new QueueItem);
	this.fillQueueIndex = 0, this.fillFromQueue = this._fillFromQueue.bind(this), this._propChanceModifier = this.propChanceModifier, this._cellSize = this.cellSize, this.areaColors = [
		[new Float32Array([0, 152 / 255, 14 / 255]), new Float32Array([37 / 255, 239 / 255, 28 / 255]), new Float32Array([46 / 255, 115 / 255, 61 / 255])],
		[new Float32Array([211 / 255, 251 / 255, 58 / 255]), new Float32Array([241 / 255, 241 / 255, 54 / 255]), new Float32Array([243 / 255, 211 / 255, 115 / 255])],
		[new Float32Array([1, 1, 1]), new Float32Array([193 / 255, 232 / 255, 244 / 255]), new Float32Array([239 / 255, 231 / 255, 248 / 255])]
	], this.tilePools = [], this.tileLocators = [];
	for (var t = this.templateGround.getChildren(), e = 0; e < t.length; e++) {
		for (var i = t[e].getChildren(), n = [], r = i.length; r--;) i[r]._guid && (n.push(i[r].getPosition().clone()), i[r].destroy());
		this.tileLocators.push(n);
		var o = new EntityPool(t[e], 30);
		o.on("free", this.onFreePoolItem, this), this.tilePools.push(o);
		for (var s = 0; 30 > s; s++) {
			var a = o.alloc();
			this.app.root.addChild(a), a.enabled = !0, o.free(a)
		}
	}
	this.treesFinalIndex = 0, this.propPools = [];
	for (var l = this.templateProps.getChildren(), e = 0; e < l.length; e++) {
		var o = new EntityPool(l[e], 30);
		o.on("free", this.onFreePoolItem, this), this.propPools.push(o);
		for (var r = 0; 30 > r; r++) {
			var a = o.alloc();
			this.app.root.addChild(a), a.enabled = !0, o.free(a)
		}
		"T" !== l[e].name[0] && "t" !== l[e].name[0] || (this.treesFinalIndex = e)
	}
	this.tempSphere = {
		center: new pc.Vec3,
		radius: 0
	}, this.currentArea = 0, this.app.on("app:reset", this.reset, this), this.app.on("app:postReset", this.postReset, this), this.app.on("player:current", this.onPlayerProgress, this), this.app.on("level:addBlock", this.onRoadBlockAdded, this), this.app.on("level:removeBlock", this.onRoadBlockRemoved, this)
}, Environment.prototype.postInitialize = function() {
	this.postReset()
}, Environment.prototype.reset = function() {
	this.cellBlocks = {}, this.cellPoolIndexes = {}, this.topLeftRoads = {}, this.topRightRoads = {}, this.bottomLeftRoads = {}, this.bottomRightRoads = {}, this.props = {}, this.propPoolIndexes = {}, this.currentArea = 0;
	for (var e = 0; e < this.tilePools.length; e++) this.tilePools[e].freeAll();
	for (var e = 0; e < this.propPools.length; e++) this.propPools[e].freeAll()
}, Environment.prototype.postReset = function() {
	this.fillVisibleCells(!0)
}, Environment.prototype.onFreePoolItem = function(e) {
	if (FAST_HIDE) e.model.model.meshInstances[0]._hidden = !0;
	else {
		e.enabled = !1;
		var t = e.getParent();
		t && t.removeChild(e)
	}
}, Environment.prototype.onPlayerProgress = function(e) {
	this.currentArea = Math.floor(e / 25) % this.areaColors.length, this.clearInvisibleCells(), this.fillVisibleCells()
}, Environment.prototype.cellX = function(e) {
	return Math.floor((e + this._cellSize / 4) / this._cellSize)
}, Environment.prototype.cellZ = function(e) {
	return Math.ceil((e - this._cellSize / 4) / this._cellSize)
}, Environment.prototype.onRoadBlockAdded = function(e) {
	var t = e.getLocalPosition(),
		i = this.cellX(t.x),
		n = this.cellZ(t.z),
		r = this.indexHash(i, n);
	this.getCellPosition(i, n, Environment.v1);
	var o = Environment.v1.x,
		s = Environment.v1.z;
	t.x >= o ? t.z >= s ? this.topRightRoads[r] = !0 : this.topLeftRoads[r] = !0 : t.z >= s ? this.bottomRightRoads[r] = !0 : this.bottomLeftRoads[r] = !0;
	var a = this.props[r];
	if (a) for (var l = 0; l < a.length; l++) a[l].enabled && this.isPositionOnRoad(a[l].getLocalPosition()) && (FAST_HIDE ? a[l].model.model.meshInstances[0]._hidden = !0 : a[l].enabled = !1)
}, Environment.prototype.onRoadBlockRemoved = function(e, t) {
	var i = e.getLocalPosition(),
		n = this.cellX(i.x),
		r = this.cellZ(i.z),
		o = this.indexHash(n, r);
	delete this.topRightRoads[o], delete this.topLeftRoads[o], delete this.bottomRightRoads[o], delete this.bottomLeftRoads[o]
}, Environment.prototype.indexHash = function(e, t) {
	return 51 * (51 + e) + t
}, Environment.prototype.getCellPosition = function(e, t, i) {
	i.set(e * this._cellSize + this._cellSize / 4, 0, t * this._cellSize - this._cellSize / 4)
}, Environment.prototype.isCellVisible = function(e, t) {
	this.getCellPosition(e, t, this.tempSphere.center), this.tempSphere.radius = this._cellSize;
	var i = this.camera.camera.getFrustum();
	return i.containsSphere(this.tempSphere)
}, Environment.prototype.colorize = function(e, t) {
	if (e.model) for (var i = e.model.model.meshInstances, n = 0; n < i.length; n++) i[n].setParameter("material_diffuse", t)
}, Environment.prototype.generateProps = function(e, t) {
	for (var i = 1, n = t.length, r = this.propPools.length, o = this.player.getLocalPosition(), s = 0; n > s; s++) {
		var a = pc.math.random(0, 1);
		if (!(a > i)) {
			i -= this._propChanceModifier / n;
			var l = Environment.v1;
			l.add2(this.cellBlocks[e].getLocalPosition(), t[s]);
			var h = 0;
			if (!(l.x >= o.x + this._cellSize && l.z >= o.z - this._cellSize && (h = this.treesFinalIndex + 1, l.z > o.z && a > .1 * i))) {
				var c = Math.floor(pc.math.random(h, r)),
					u = this.propPools[c].alloc(),
					p = this.isPositionOnRoad(l);
				if (FAST_HIDE ? (null === u.getParent() && (this.app.root.addChild(u), u.enabled = !0), u.model.model.meshInstances[0]._hidden = p) : (this.app.root.addChild(u), u.enabled = !p), u.setLocalPosition(l), STATIC_MESHES) {
					var f = u.model.model.meshInstances[0];
					u.syncHierarchy(), f._updateAabb = !0, f._aabb = f.aabb, f._updateAabb = !1
				}
				this.props[e] = this.props[e] || [], this.props[e].push(u), this.propPoolIndexes[e] = this.propPoolIndexes[e] || [], this.propPoolIndexes[e].push(c)
			}
		}
	}
}, Environment.prototype.isPositionOnRoad = function(e) {
	var t = this.cellX(e.x),
		i = this.cellZ(e.z),
		n = this.indexHash(t, i);
	this.getCellPosition(t, i, Environment.v2);
	var r = Environment.v2.x,
		o = Environment.v2.z;
	return e.x >= r ? e.z >= o ? this.topRightRoads[n] : this.topLeftRoads[n] : e.z >= o ? this.bottomRightRoads[n] : this.bottomLeftRoads[n]
}, Environment.prototype.clearInvisibleCells = function() {
	var e = this.player.getLocalPosition(),
		t = this.cellX(e.x),
		i = this.cellZ(e.z);
	for (var n in this.cellBlocks) {
		var r = this.cellBlocks[n],
			o = r.getLocalPosition(),
			s = this.cellX(o.x),
			a = this.cellZ(o.z);
		if (!(Math.abs(t - s) < 2 && Math.abs(i - a) < 2 || this.isCellVisible(s, a))) {
			this.tilePools[this.cellPoolIndexes[n]].free(r);
			var l = this.props[n];
			if (l) {
				for (var h = this.propPoolIndexes[n], c = 0; c < l.length; c++) this.propPools[h[c]].free(l[c]);
				delete this.props[n], delete this.propPoolIndexes[n]
			}
			delete this.cellBlocks[n], delete this.cellPoolIndexes[n]
		}
	}
}, Environment.prototype.fillCell = function(e, t, i, n, r) {
	var o = this.indexHash(i, n);
	return this.cellBlocks[o] ? !1 : (Math.abs(e - i) >= 2 || Math.abs(t - n) >= 2) && !this.isCellVisible(i, n) ? !1 : (!r && this.fillQueueIndex < this.maxFillQueue - 1 ? (this.fillQueue[this.fillQueueIndex].x = i, this.fillQueue[this.fillQueueIndex].z = n, this.fillQueue[this.fillQueueIndex].hash = o, this.fillQueueIndex++) : this._fill(o, i, n), !0)
}, Environment.prototype._fill = function(e, t, i) {
	var n = Math.floor(pc.math.random(0, this.tilePools.length));
	cell = this.tilePools[n].alloc(), FAST_HIDE ? null === cell.getParent() && (this.app.root.addChild(cell), cell.enabled = !0) : (this.app.root.addChild(cell), cell.enabled = !0);
	var r = cell.getLocalPosition();
	if (this.getCellPosition(t, i, r), cell.setPosition(r), STATIC_MESHES) {
		var o = cell.model.model.meshInstances[0];
		o && (cell.syncHierarchy(), o._updateAabb = !0, o._aabb = o.aabb, o._updateAabb = !1), o._hidden = !1
	}
	var s = this.areaColors[this.currentArea],
		a = s[Math.floor(pc.math.random(0, s.length))];
	this.colorize(cell, a), this.cellBlocks[e] = cell, this.cellPoolIndexes[e] = n, this.generateProps(e, this.tileLocators[n])
}, Environment.prototype._fillFromQueue = function() {
	var e = this.fillQueueIndex - 1;
	e >= 0 && (this._fill(this.fillQueue[e].hash, this.fillQueue[e].x, this.fillQueue[e].z), this.fillQueueIndex--), this.fillQueueIndex && setTimeout(this.fillFromQueue, 0)
}, Environment.prototype.fillVisibleCells = function(e) {
	for (var t = this.player.getLocalPosition(), i = Math.floor((t.x + this._cellSize / 4) / this._cellSize), n = Math.ceil((t.z - this._cellSize / 4) / this._cellSize), r = i - this.xLead; r < i + this.xLead; r++) for (var o = n + this.zLead; o > n - this.zLead; o--) this.fillCell(i, n, r, o, e);
	this.fillFromQueue()
};
var Camera = new pc.Script("camera");
Camera.attributes.add("target", {
	type: "entity"
}), Camera.attributes.add("offset", {
	type: "vec3",
	"default": [-17, 25, 17]
}), Camera.attributes.add("crashOffset", {
	type: "vec3",
	"default": [-17, 20, 17]
}), Camera.attributes.add("crashOffsetPortrait", {
	type: "vec3",
	"default": [-17, 20, 17]
}), Camera.attributes.add("crashZoom", {
	type: "number",
	"default": 10
}), Camera.vecA = new pc.Vec3, Camera.vecB = new pc.Vec3, Camera.extend({
	initialize: function() {
		this.crashed = !1, this.initialZoom = this.entity.camera.orthoHeight, this.initialPosition = Camera.vecA.copy(this.target.getPosition()).add(this.offset).clone(), this.entity.setPosition(this.initialPosition), this.app.renderer.updateCameraFrustum(this.entity.camera.camera), this.app.on("app:reset", this.reset, this), this.app.on("player:crash", this.onCrash, this)
	},
	reset: function() {
		this.crashed = !1, this.entity.setPosition(this.initialPosition), this.entity.camera.orthoHeight = this.initialZoom, this.postUpdate(1e3), this.app.renderer.updateCameraFrustum(this.entity.camera.camera)
	},
	postUpdate: function(e) {
		var t = this.target,
			i = this.offset;
		this.crashed && (t = this.target.getParent().script.vehicle.current, i = this.crashOffset, this.app.graphicsDevice.height > 480 && this.app.graphicsDevice.height < 736 && (i = this.crashOffsetPortrait)), t && t.enabled && (Camera.vecA.copy(t.getPosition()).add(i), Camera.vecB.copy(this.entity.getPosition()), Camera.vecB.lerp(Camera.vecB, Camera.vecA, Math.min(1, .15 * e / (1 / 60))), this.entity.setPosition(Camera.vecB));
		var n = this.initialZoom;
		this.crashed && (n = this.crashZoom), this.entity.camera.orthoHeight !== n && (this.entity.camera.orthoHeight += (n - this.entity.camera.orthoHeight) * (.15 * e / (1 / 60)), Math.abs(this.entity.camera.orthoHeight - n) < .001 && (this.entity.camera.orthoHeight = n))
	},
	onCrash: function() {
		this.crashed = !0
	},
	swap: function(e) {
		this.target = e.target, this.offset = e.offset, this.initialZoom = e.initialZoom, this.initialPosition = e.initialPosition, this.crashed = e.crashed, this.crashZoom = e.crashZoom, this.crashTarget = e.crashTarget, this.crashOffset = e.crashOffset, this.app.off("app:reset", e.reset, e), this.app.on("app:reset", this.reset, this), this.app.off("player:crash", e.onCrash, e), this.app.on("player:crash", this.onCrash, this)
	}
});
var Application = new pc.Script("application");
Application.attributes.add("frontendstate", {
	type: "entity"
}), Application.attributes.add("ingamestate", {
	type: "entity"
}), Application.attributes.add("gameoverstate", {
	type: "entity"
}), Application.prototype.initialize = function() {
	this.app.on("app:reset", this.reset, this), this.app.gamepads = null, this.initializeStates(), this._dt = [0], this._dt.length = 60, this._index = 0, this._time = 0, this._mode = 0, -1 !== window.location.search.indexOf("autoplay=true") && (this.app.autoplay = !0)
}, Application.prototype.initializeStates = function() {
	this.score = 0, this.app.on("app:score", function(e) {
		this.score += e
	}, this)
}, Application.prototype.gameover = function() {
	this.app.fire("gameover")
}, Application.prototype.reset = function() {
	this.score = 0
};
var Share = new pc.Script("share");
Share.attributes.add("player", {
	type: "entity"
}), Share.prototype.initialize = function() {
	var e = this;
	this.app.ui.shareTwitter && (this.app.ui.shareTwitter.addEventListener("touchstart", function(t) {
		t.stopPropagation(), this.href = e.share("twitter")
	}, !1), this.app.ui.shareTwitter.addEventListener("click", function(e) {
		return e.preventDefault(), e.stopPropagation(), !1
	}), this.app.ui.shareTwitter.addEventListener("mousedown", function(t) {
		return t.stopPropagation(), t.preventDefault(), e.share("twitter", !0), !1
	}, !1)), this.app.ui.shareFacebook && (this.app.ui.shareFacebook.addEventListener("touchstart", function(t) {
		t.stopPropagation(), this.href = e.share("facebook")
	}, !1), this.app.ui.shareFacebook.addEventListener("click", function(e) {
		return e.preventDefault(), e.stopPropagation(), !1
	}), this.app.ui.shareFacebook.addEventListener("mousedown", function(t) {
		return t.stopPropagation(), t.preventDefault(), e.share("facebook", !0), !1
	}, !1))
}, Share.prototype.share = function(e, t) {
	var i = screen.width / 2 - 320,
		n = screen.height / 2 - 190,
		r = this.entity.script.score.score,
		o = this.player.script.player.speed,
		s = encodeURIComponent("http://swerve.playcanvas.com/"),
		a = encodeURIComponent("I've scored " + r.toLocaleString() + " speeding " + o + " km/h in SWERVE! Can you beat me? http://swerve.playcanvas.com/ Powered by PlayCanvas #WebGL");
	switch (e) {
		case "facebook":
			s = "https://facebook.com/sharer/sharer.php?u=" + s;
			break;
		case "twitter":
			s = "https://twitter.com/intent/tweet?text=" + a
	}
	if (t) {
		var l = window.open(s, "SWERVE - Share Score", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=640, height=380, top=" + n + ", left=" + i);
		window.focus && l && l.focus()
	}
	return s
};
var Vehicle = new pc.Script("vehicle");
Vehicle.attributes.add("trails", {
	type: "entity"
}), Vehicle.attributes.add("smoke", {
	type: "entity"
}), Vehicle.attributes.add("texture", {
	type: "asset",
	assetType: "texture"
}), Vehicle.attributes.add("color", {
	type: "rgb",
	"default": [0, .5, 1]
}), Vehicle.attributes.add("glossiness", {
	type: "number",
	"default": .5,
	min: 0,
	max: 1
}), Vehicle.attributes.add("metalness", {
	type: "number",
	"default": 0,
	min: 0,
	max: 1
}), Vehicle.vecA = new pc.Vec3, Vehicle.vecB = new pc.Vec3, Vehicle.vecC = new pc.Vec3, Vehicle.vecD = new pc.Vec3, Vehicle.vecE = new pc.Vec3, Vehicle.color = new pc.Color(1, 1, 1), Vehicle.prototype.initialize = function() {
	this.first = !0, this.ind = 0, this.current = null, this.trailChildren = this.trails.getChildren().slice(0);
	for (var e = 0; e < this.trailChildren.length; e++) this.trailChildren[e] = this.trailChildren[e].script.trail;
	this.app.on("app:reset", this.reset, this), this.app.on("player:level", this.onLevel, this), this.app.on("player:crash", this.onCrash, this), this.on("attr:color", this.onColor, this), this.on("attr:glossiness", this.onColor, this), this.on("attr:metalness", this.onColor, this);
	var t = this;
	this.image = new Image, this.imageLoaded = !1, this.image.onload = function() {
		t.imageLoaded = !0, t.renderTexture()
	}, this.image.src = this.texture.file.url + "?t=" + this.texture.file.hash, this.canvas = document.createElement("canvas"), this.canvas.width = 8, this.canvas.height = 8, this.ctx = this.canvas.getContext("2d")
}, Vehicle.prototype.onColor = function() {
	this.renderTexture()
}, Vehicle.prototype.renderTexture = function() {
	if (this.imageLoaded) {
		this.ctx.drawImage(this.image, 0, 0), this.ctx.beginPath(), this.ctx.rect(0, 0, 2, 2), this.ctx.fillStyle = this.color.toString(), this.ctx.fill(), this.ctx.beginPath(), this.ctx.rect(0, 2, 2, 2);
		var e = ("00" + Math.floor(255 * this.glossiness).toString(16)).slice(-2);
		this.ctx.fillStyle = "#" + e + e + e, this.ctx.fill(), this.ctx.beginPath(), this.ctx.rect(0, 4, 2, 2), e = ("00" + Math.floor(255 * this.metalness).toString(16)).slice(-2), this.ctx.fillStyle = "#" + e + e + e, this.ctx.fill(), this.texture.resource.setSource(this.canvas)
	}
}, Vehicle.prototype._hue2rgb = function(e, t, i) {
	return 0 > i && (i += 1), i > 1 && (i -= 1), 1 / 6 > i ? e + 6 * (t - e) * i : .5 > i ? t : 2 / 3 > i ? e + (t - e) * (2 / 3 - i) * 6 : e
}, Vehicle.prototype.colorHslToRgb = function(e, t, i) {
	var n, r, o;
	if (0 == t) n = r = o = i;
	else {
		var s = .5 > i ? i * (1 + t) : i + t - i * t,
			a = 2 * i - s;
		n = this._hue2rgb(a, s, e + 1 / 3), r = this._hue2rgb(a, s, e), o = this._hue2rgb(a, s, e - 1 / 3)
	}
	return [n, r, o]
}, Vehicle.prototype.update = function(e) {
	this.first && (this.first = !1, this.reset()), this.current && (this.current.pipe || (this.app.vehicles.process(this.current), this.attachTrails()))
}, Vehicle.prototype.attachTrails = function() {
	if (this.trails) {
		var e = this.trails.getChildren();
		if (4 === e.length && this.current.trails && 4 === this.current.trails.length) for (var t = 0; 4 > t; t++) e[t].script.trail.__attributes.pivot = this.current.trails[t]
	}
	if (this.smoke && this.smoke.particlesystem.emitter && this.current.pipe) {
		var i = this.smoke.getParent();
		i && i.removeChild(this.smoke), this.current.addChild(this.smoke), this.smoke.setPosition(this.current.pipe.getPosition()), this.smoke.particlesystem.emitter.meshInstance.layer = pc.LAYER_GIZMO;
		var n = this.app.scene.drawCalls.indexOf(this.smoke.particlesystem.emitter.meshInstance);
		this.app.scene.drawCalls.splice(n, 1), this.app.scene.drawCalls.unshift(this.smoke.particlesystem.emitter.meshInstance)
	}
}, Vehicle.prototype.onLevel = function(e) {
	this.upgrade(e - 1)
}, Vehicle.prototype.onCrash = function() {
	this.smoke.particlesystem.stop()
}, Vehicle.prototype.reset = function() {
	this.upgrade(0), this.smoke.particlesystem.play();
	var e = this.colorHslToRgb(Math.random(), 1, .5);
	this.color.set(e[0], e[1], e[2]), this.renderTexture()
}, Vehicle.prototype.upgrade = function(e) {
	this.ind = e;
	var t = this.app.vehicles.get(e);
	this.set(t);
	var i = this.app.vehicles.get(e + 1);
	if (i !== t && !i.model.model) {
		var n = this.app.assets.get(i.model.asset);
		this.app.assets.load(n)
	}
	var r = this.colorHslToRgb(Math.random(), 1, .5);
	this.color.set(r[0], r[1], r[2]), this.renderTexture()
}, Vehicle.prototype.set = function(e) {
	this.current !== e && (this.current && (this.entity.removeChild(this.current), this.current.enabled = !1), this.current = e, pc.GraphNode.prototype.addChild.call(this.entity, this.current), this.current.setLocalPosition(0, 0, 0), this.current.enabled = !0, this.attachTrails())
}, Vehicle.prototype.swap = function(e) {
	this.current = e.current, this.ind = e.ind, this.trails = e.trails, this.smoke = e.smoke, this.trailChildren = e.trailChildren, this.image = e.image, this.imageLoaded = e.imageLoaded, this.canvas = e.canvas, this.ctx = e.ctx, this.texture = e.texture, this.color = e.color, this.glossiness = e.glossiness, this.metalness = e.metalness, this.app.off("app:reset", e.reset, e), this.app.on("app:reset", this.reset, this), this.app.off("player:level", e.onLevel, e), this.app.on("player:level", this.onLevel, this), this.app.off("player:crash", e.onCrash, e), this.app.on("player:crash", this.onCrash, this), e.off("attr:color", e.onColor, e), e.off("attr:glossiness", e.onColor, e), e.off("attr:metalness", e.onColor, e), this.on("attr:color", this.onColor, this), this.on("attr:glossiness", this.onColor, this), this.on("attr:metalness", this.onColor, this)
};
var Score = new pc.Script("score");
Score.attributes.add("levelDistance", {
	type: "number",
	"default": 10
}), Score.attributes.add("bonusMultiplier", {
	type: "number",
	"default": 5,
	placeholder: "x"
}), Score.prototype.initialize = function() {
	this.score = 0, this.multiplier = 1, this.level = 1, this.app.on("player:current", this.onPos, this), this.app.on("player:crash", this.onCrash, this), this.app.on("player:level", this.onLevel, this), this.app.on("app:reset", this.reset, this), this.app.on("ui:tempalte", this.onTemplate, this), this.app.on("collectible:points", this.onPoints, this)
}, Score.prototype.reset = function() {
	if (this.app.ui.checkpoints && this.level > 1) for (var e = this.app.ui.checkpoints.children, t = 1; t < Math.min(this.level, e.length); t++) e[t].classList.remove("active");
	this.score = 0, this.multiplier = 1, this.level = 1, this.app.ui.score && (this.app.ui.score.textContent = 0), this.app.ui.path && (this.app.ui.path.style.width = "0%")
}, Score.prototype.onCrash = function() {
	this.app.ui["game-over.score"] && (this.app.ui["game-over.score"].textContent = this.score.toLocaleString())
}, Score.prototype.onLevel = function() {
	this.app.mute || this.entity.sound.slot("upgrade").play()
}, Score.prototype.onPos = function(e) {
	var t = Math.ceil(e / this.levelDistance);
	if (t !== this.level && (this.multiplier *= 2, this.level = t, this.app.fire("player:level", t), this.app.ui.checkpoints)) {
		var i = this.app.ui.checkpoints.children;
		i[this.level - 1] && i[this.level - 1].classList.add("active")
	}
	this.score += this.multiplier, this.app.ui.path && (this.app.ui.path.style.width = Math.floor(100 * Math.min(1, e / (10 * this.levelDistance))) + "%"), this.app.ui.score && (this.app.ui.score.textContent = this.score.toLocaleString())
}, Score.prototype.onTemplate = function() {
	if (this.app.ui.score && (this.app.ui.score.textContent = this.score.toLocaleString()), this.app.ui.checkpoints && this.level > 1) for (var e = this.app.ui.checkpoints.children, t = 1; t < Math.min(this.level, e.length); t++) e[t].classList.add("active")
}, Score.prototype.onPoints = function() {
	this.score += this.multiplier * this.bonusMultiplier, this.app.ui.score && (this.app.ui.score.textContent = this.score.toLocaleString())
}, Score.prototype.swap = function(e) {
	this.score = e.score, this.multiplier = e.multiplier, this.level = e.level, this.levelDistance = e.levelDistance, this.bonusMultiplier = e.bonusMultiplier, this.app.off("player:current", e.onPos, e), this.app.on("player:current", this.onPos, this), this.app.off("player:crash", e.onCrash, e), this.app.on("player:crash", this.onCrash, this), this.app.off("app:reset", e.reset, e), this.app.on("app:reset", this.reset, this), this.app.off("ui:tempalte", e.onTemplate, e), this.app.on("ui:tempalte", this.onTemplate, this), this.app.off("collectible:points", e.onPoints, e), this.app.on("collectible:points", this.onPoints, this)
};
var Player = new pc.Script("player"),
	count = 0;
Player.attributes.add("speed", {
	type: "number",
	"default": 50,
	placeholder: "km/h"
}), Player.attributes.add("acceleration", {
	type: "number",
	"default": 5,
	placeholder: "km/h"
}), Player.attributes.add("turnSpeed", {
	type: "number",
	"default": 90,
	placeholder: "deg/s"
}), Player.left = 180, Player.right = 90, Player.vecA = new pc.Vec3, Player.vecB = new pc.Vec3, Player.vecC = new pc.Vec3, Player.size = 1, Player.timeEasing = .05, Player.extend({
	initialize: function() {
		this.started = !1, this.introduced = 0, this.left = !0, this.angle = new pc.Angle(Player.left), this.angleTarget = new pc.Angle(Player.left), this.angleRoll = new pc.Angle, this.angleOffN = new pc.Angle, this.angleA = this.angle.clone(), this.block = 0, this.crashed = !1, this.timeScale = 1, this.lastTimeScale = 1, this.crashRotate = new pc.Vec3, this.crashY = 0, this.startTime = Date.now(), this.startSpeed = this.speed, this.blockLast = null, this.garagePos = new pc.Vec3(-100, 0, -100), this.immediateStop = !1;
		var e = this;
		this.onClick = function(t) {
			e.toggleDirection(), t.preventDefault()
		}, window.addEventListener("mousedown", this.onClick, !1), window.addEventListener("touchstart", this.onClick, !1), this.app.on("app:start", this.onStart, this), this.app.on("app:reset", this.onReset, this), this.app.on("player:level", this.onLevel, this), this.app.on("garage:spawn", this.onGarageSpawn, this), this.app.on("ui:template", this.onTemplate, this), this.onTemplate(), this.app.on("audio:mute", function(e) {
			e ? this.entity.sound.stop() : (this.entity.sound.slot("skidding").volume = 0, this.entity.sound.slot("skidding").play())
		}, this)
	},
	update: function(e) {
		this.updateTimeScale(e), this.timeScale !== this.lastTimeScale && this.updateSound(), this.started && this.timeScale && this.updateMovement(e), this.crashed || this.updateCollisions(e), this.lastTimeScale = this.timeScale
	},
	updateTimeScale: function(e) {
		this.lastTimeScale = this.timeScale, !this.crashed && 2 !== this.introduced || 0 === this.timeScale ? !this.crashed && 2 !== this.introduced && this.started && 1 !== this.timeScale && (this.timeScale += (1 - this.timeScale) * Math.min(1, Player.timeEasing * e / (1 / 60)), this.timeScale > .999 && (this.timeScale = 1)) : (this.timeScale += (0 - this.timeScale) * Math.min(1, Player.timeEasing * e / (1 / 60)), this.timeScale < .001 && (this.timeScale = 0))
	},
	updateSound: function() {
		this.entity.sound.pitch = this.timeScale, this.app.root._children[0].sound.pitch = .5 + .5 * this.timeScale, this.app.root._children[0].sound.volume = .1 + .3 * this.timeScale
	},
	updateMovement: function(e) {
		0 !== this.angle.distance(this.angleTarget) && this.angle.lerp(this.angleTarget, this.turnSpeed * (this.speed / 10 * 1e3 / 60 / 60) / pc.Angle.RA * e * this.timeScale);
		var t = this.angle.distance(this.angleTarget);
		0 !== t ? this.angleOffN.degrees += 45 * e * this.timeScale * (t > 0 ? 1 : -1) : this.angleOffN.degrees += (0 - this.angleOffN.degrees) * (.2 * e / (1 / 60) * this.timeScale), this.angleA.degrees = this.angle.degrees + this.angleOffN.degrees;
		var i = Math.min(1, Math.abs(this.angleA.distance(this.angleTarget)));
		this.app.mute || (this.entity.sound.slot("skidding").volume = .5 * i);
		for (var n = this.entity.script.vehicle.trailChildren, r = 0; r < n.length; r++) {
			var o = 1;
			if (this.blockLast) {
				if (n[r].pivot) {
					var s = this.app.level.getBlock(this.block),
						a = this.app.level.getBlockType(this.block),
						l = s.getLocalPosition(),
						h = n[r].pivot.getPosition();
					switch (a) {
						case BLOCK_STRAIGHT_LEFT:
							(h.x > l.x + 3.5 || h.x < l.x - 3.5) && (o = 0);
							break;
						case BLOCK_STRAIGHT_RIGHT:
							(h.z > l.z + 3.5 || h.z < l.z - 3.5) && (o = 0);
							break;
						case BLOCK_CORNER_LEFT:
							(h.z > l.z + 3.5 || h.x > l.x + 3.5) && (o = 0);
							break;
						case BLOCK_CORNER_RIGHT:
							(h.z < l.z - 3.5 || h.x < l.x - 3.5) && (o = 0)
					}
				}
			} else o = 0;
			n[r].level = Math.min(1, .2 + i + (this.crashed ? 0 : 2 * (1 - this.timeScale)) + this.crashed) * o
		}
		if (!this.crashed || !this.immediateStop) {
			this.entity.setLocalEulerAngles(0, this.angle.degrees + 90 + this.angleOffN.degrees, 0), this.angleA.degrees = this.angle.degrees + this.angleOffN.degrees;
			var t = this.angleA.distance(this.angleTarget);
			this.angleRoll.degrees += .1 * (15 * -t - this.angleRoll.degrees) * (e / (1 / 60)) * this.timeScale, this.entity.rotateLocal(this.angleRoll.degrees, 0, 0), this.crashed && 1 !== this.timeScale && (Player.vecA.copy(this.crashRotate).scale(1 - this.timeScale), this.entity.rotateLocal(Player.vecA)), Player.vecA.set(this.angle.x, 0, this.angle.y).normalize().scale(1e3 * this.speed / 60 / 60 * e * this.timeScale), this.entity.translate(Player.vecA)
		}
		this.crashed && 1 !== this.timeScale && (this.entity.getLocalPosition().y = 1.15 - (1 - this.timeScale) * this.crashY)
	},
	updateCollisions: function(e) {
		var t = this.app.level.getBlock(this.block),
			i = this.app.level.getBlockType(this.block),
			n = this.entity.getLocalPosition(),
			r = t.getLocalPosition();
		switch (this.blockLast = t, i) {
			case BLOCK_STRAIGHT_LEFT:
				(n.x > r.x + 4 - Player.size || n.x < r.x - 4 + Player.size) && (this.crashed = !0);
				break;
			case BLOCK_STRAIGHT_RIGHT:
				(n.z > r.z + 4 - Player.size || n.z < r.z - 4 + Player.size) && (this.crashed = !0);
				break;
			case BLOCK_CORNER_LEFT:
				(n.z > r.z + 4 - Player.size || n.x > r.x + 4 - Player.size) && (this.crashed = !0);
				break;
			case BLOCK_CORNER_RIGHT:
				(n.z < r.z - 4 + Player.size || n.x < r.x - 4 + Player.size) && (this.crashed = !0)
		}
		this.crashed ? (this.crashRotate.x = 30 * (2 * Math.random() - 1), this.crashRotate.y = 15 * (2 * Math.random() - 1), this.crashRotate.z = 5 * (2 * Math.random() - 1), this.crashY = .3 * Math.random(), this.app.mute || this.entity.sound.slot("crash").play(), this.app.fire("player:crash"), this.app.ui.element && this.app.ui.element.classList.add("gameOver"), this.app.ui["game-over.speed"] && (this.app.ui["game-over.speed"].textContent = this.speed), this.garagePos && Math.abs(this.garagePos.x - n.x) < 4 + Player.size && Math.abs(this.garagePos.z - n.z) < 4 + Player.size ? this.immediateStop = !0 : this.immediateStop = !1, 3 !== this.introduced && (this.introduced = 0, this.app.ui.introduce && this.app.ui.introduce.classList.remove("active"))) : n.x > r.x + 4 || n.z < r.z - 4 || n.x < r.x - 4 || n.z > r.z + 4 ? (this.block++, this.app.fire("player:current", this.block), 0 === this.introduced && 2 === this.block && (this.introduced = 1)) : 1 === this.introduced && n.z - 1 < r.z && (this.introduced = this.app.autoplay ? 3 : 2, !this.app.autoplay && this.app.ui.introduce && this.app.ui.introduce.classList.add("active"))
	},
	toggleDirection: function() {
		if (!this.crashed && this.started) {
			if (2 === this.introduced) {
				if (this.introduced = 3, this.app.ui.introduce) {
					this.app.ui.introduce.classList.remove("active");
					var e = this;
					setTimeout(function() {
						e.app.ui.introduce && e.app.ui.introduce.parentNode && e.app.ui.introduce.parentNode.removeChild(e.app.ui.introduce)
					}, 500)
				}
				this.app.fire("tap")
			}
			this.left = !this.left, this.left ? this.angleTarget.degrees = Player.left : this.angleTarget.degrees = Player.right
		}
	},
	onLevel: function(e) {
		this.speed = this.startSpeed + (e - 1) * this.acceleration, this.app.ui.speed && (this.app.ui.speed.textContent = this.speed)
	},
	onGarageSpawn: function(e) {
		this.garagePos.copy(e.getPosition())
	},
	onTemplate: function() {
		if (this.app.ui.restart) {
			var e = this,
				t = function(t) {
					t.preventDefault(), t.stopPropagation(), e.app.fire("app:reset"), e.app.fire("app:postReset"), e.app.fire("tap")
				};
			this.app.ui.restart.addEventListener("touchstart", t, !1), this.app.ui.restart.addEventListener("click", t, !1)
		}
	},
	onStart: function() {
		this.started = !0
	},
	onReset: function() {
		this.entity.setPosition(0, 1.15, 0), this.angle.degrees = Player.left, this.angleTarget.degrees = this.angle.degrees, this.angleRoll.degrees = 0, this.angleOffN.degrees = 0, this.left = !0, this.block = 0, this.crashed = !1, this.timeScale = 0, this.startTime = Date.now(), this.speed = this.startSpeed, this.blockLast = null, this.app.ui.speed && (this.app.ui.speed.textContent = this.speed), this.app.ui.element && this.app.ui.element.classList.remove("gameOver"), this.app.mute || this.entity.sound.slot("start").play(), this.entity.sound.slot("crash").stop()
	},
	swap: function(e) {
		this.left = e.left, this.speed = e.speed, this.turnSpeed = e.turnSpeed, this.angle = e.angle, this.angleTarget = e.angleTarget, this.angleRoll = e.angleRoll || new pc.Angle, this.angleOffN = e.angleOffN || new pc.Angle, this.angleA = e.angleA, this.block = e.block, this.crashed = e.crashed, this.timeScale = e.timeScale, this.crashRotate = e.crashRotate, this.crashY = e.crashY, this.startTime = e.startTime || Date.now(), this.startSpeed = e.startSpeed, this.acceleration = e.acceleration, this.blockLast = e.blockLast, this.garagePos = e.garagePos, this.immediateStop = e.immediateStop, this.started = e.started, this.introduced = e.introduced, window.removeEventListener("mousedown", e.onClick), window.removeEventListener("touchstart", e.onClick);
		var t = this;
		this.onClick = function(e) {
			t.toggleDirection(), e.preventDefault()
		}, window.addEventListener("mousedown", this.onClick, !1), window.addEventListener("touchstart", this.onClick, !1), this.app.off("app:start", e.onStart, e), this.app.on("app:start", this.onStart, this), this.app.off("app:reset", e.onReset, e), this.app.on("app:reset", this.onReset, this), this.app.off("player:level", e.onLevel, e), this.app.on("player:level", this.onLevel, this), this.app.off("garage:spawn", e.onGarageSpawn, e), this.app.on("garage:spawn", this.onGarageSpawn, this), this.app.off("ui:template", e.onTemplate, e), this.app.on("ui:template", this.onTemplate, this)
	}
});
var Collectibles = new pc.Script("collectibles");
Collectibles.attributes.add("templatePoints", {
	type: "entity"
}), Collectibles.attributes.add("iconSpeed", {
	type: "number",
	"default": 2
}), Collectibles.attributes.add("iconFadeHeight", {
	type: "number",
	"default": 5
}), Collectibles.attributes.add("iconFadeSpeed", {
	type: "number",
	"default": 2
}), Collectibles.attributes.add("player", {
	type: "entity"
}), Collectibles.attributes.add("camera", {
	type: "entity"
}), Collectibles.attributes.add("chance", {
	type: "vec2",
	"default": [5, 15]
}), Collectibles.attributes.add("confetti", {
	type: "entity"
}), Collectibles.v1 = new pc.Vec2, Collectibles.v2 = new pc.Vec2, Collectibles.v3 = new pc.Vec3, Collectibles.sphere = {
	center: new pc.Vec3,
	radius: 2
}, Collectibles.prototype.initialize = function() {
	this.pool = new EntityPool(this.templatePoints, 4), this.pool.on("free", this.onFreePoolItem, this), this.app.on("app:reset", this.reset, this), this.app.on("level:addBlock", this.onBlockAdded, this), this.app.on("level:removeBlock", this.onBlockRemoved, this), this.collectibles = {}, this.icons = {}, this.blocksTillCollectible = this.getBlocksTillCollectible()
}, Collectibles.prototype.reset = function() {
	this.pool.freeAll(), this.collectibles = {}, this.icons = {}, this.blocksTillCollectible = this.getBlocksTillCollectible()
}, Collectibles.prototype.getBlocksTillCollectible = function() {
	return Math.floor(pc.math.random(this.chance.x, this.chance.y))
}, Collectibles.prototype.onFreePoolItem = function(e) {
	e.enabled = !1;
	var t = e.getParent();
	t && t.removeChild(e)
}, Collectibles.prototype.onBlockAdded = function(e, t) {
	if (this.blocksTillCollectible--, !(this.blocksTillCollectible > 0)) {
		this.blocksTillCollectible = this.getBlocksTillCollectible();
		var i = this.pool.alloc();
		i.setLocalScale(.85, .85, .85), i.setLocalEulerAngles(0, 360 * Math.random(), 0), this.app.root.addChild(i);
		var n = Collectibles.v3;
		n.copy(e.getLocalPosition()), n.y += 2, t === BLOCK_STRAIGHT_LEFT ? n.x += pc.math.random(0, 1) < .5 ? 2 : -2 : t === BLOCK_STRAIGHT_RIGHT ? n.z += pc.math.random(0, 1) < .5 ? 2 : -2 : t === BLOCK_CORNER_LEFT ? pc.math.random(0, 1) < .5 ? (n.x -= 2, n.z += pc.math.random(0, 1) < .5 ? -2 : 2) : (n.z -= 2, n.x += pc.math.random(0, 1) < .5 ? -2 : 2) : t === BLOCK_CORNER_RIGHT && (pc.math.random(0, 1) < .5 ? (n.x += 2, n.z += pc.math.random(0, 1) < .5 ? -2 : 2) : (n.z += 2, n.x += pc.math.random(0, 1) < .5 ? -2 : 2)), i.setPosition(n), i.enabled = !0, this.collectibles[e.getGuid()] = i
	}
}, Collectibles.prototype.onBlockRemoved = function(e) {
	var t = e.getGuid();
	this.collectibles[t] && (this.pool.free(this.collectibles[t]), delete this.collectibles[t], delete this.icons[t])
}, Collectibles.prototype.update = function(e) {
	var t = this.player.getLocalPosition();
	Collectibles.v2.set(t.x, t.z);
	for (var i in this.collectibles) if (this.icons[i]) {
		var n = this.collectibles[i],
			r = !1;
		if (Collectibles.sphere.center.copy(n.getLocalPosition()),
		this.camera.camera.camera.getFrustum().containsSphere(Collectibles.sphere)) {
			n.translate(0, e * this.iconSpeed, 0);
			var o = 360 * Math.sin(Date.now() / 300) * e;
			n.rotateLocal(o, o, o), r = n.getLocalPosition().y > this.iconFadeHeight
		} else r = !0;
		r && (this.pool.free(n), delete this.collectibles[i], delete this.icons[i])
	} else {
		var s = this.collectibles[i];
		t = s.getLocalPosition(), Collectibles.v1.set(t.x, t.z), Collectibles.v1.sub(Collectibles.v2), Collectibles.v1.lengthSq() < 4 && (this.app.fire("collectible:points"), this.icons[i] = !0, this.app.mute || s.sound.slot("hit").play())
	}
};
var Music = new pc.Script("music");
Music.prototype.initialize = function() {
	if (this.app.mute = !1, this.entity.sound.slot("start").play().on("end", this.onStartEnd, this), this.app.ui.mute) {
		var e = this,
			t = function(t) {
				t.preventDefault(), t.stopPropagation(), e.app.mute = !e.app.mute, e.app.fire("audio:mute", e.app.mute), e.app.mute ? e.app.ui.mute.classList.add("active") : e.app.ui.mute.classList.remove("active")
			};
		this.app.ui.mute.addEventListener("mousedown", t, !1), this.app.ui.mute.addEventListener("touchstart", t, !1)
	}
	this.app.on("audio:mute", function(e) {
		e ? this.entity.sound.stop() : this.entity.sound.slot("start").play().on("end", this.onStartEnd, this)
	}, this), this.app.on("tap", function() {
		this.app.mute || this.entity.sound.slot("tap").play()
	}, this)
}, Music.prototype.onStartEnd = function() {
	this.app.mute || this.entity.sound.slot("loop").play()
};
var Powered = new pc.Script("powered");
Powered.prototype.initialize = function() {
	var e = this,
		t = !1,
		i = null,
		n = function(t) {
			t.preventDefault(), t.stopPropagation(), i && clearTimeout(i), r(), e.app.fire("tap")
		}, r = function() {
			t || (t = !0, e.app.ui.powered && (e.app.ui.powered.removeEventListener("mousedown", n), e.app.ui.powered.removeEventListener("touchstart", n), e.app.ui.powered.classList.add("hidden"), e.app.fire("app:start"), setTimeout(function() {
				e.app.ui.powered && e.app.ui.powered.parentNode.removeChild(e.app.ui.powered)
			}, 1500)))
		};
	e.app.ui.powered && (e.app.ui.powered.addEventListener("mousedown", n, !1), e.app.ui.powered.addEventListener("touchstart", n, !1)), setTimeout(function() {
		t || (i = setTimeout(r, 1500))
	}, 0)
};
var BLOCK_SIZE = 8,
	MAX_BLOCKS = 13,
	TAIL = 5,
	FIRST_POS = new pc.Vec3,
	LEAD = MAX_BLOCKS - TAIL - 1,
	BLOCK_STRAIGHT_LEFT = 1,
	BLOCK_STRAIGHT_RIGHT = 2,
	BLOCK_CORNER_LEFT = 3,
	BLOCK_CORNER_RIGHT = 4,
	Level = new pc.Script("level");
Level.attributes.add("roadStraight", {
	type: "entity"
}), Level.attributes.add("roadRight", {
	type: "entity"
}), Level.attributes.add("roadLeft", {
	type: "entity"
}), Level.tmpVec = new pc.Vec3, Level.v2 = new pc.Vec3, Level.FAST_HIDE = !0, Level.prototype.initialize = function() {
	this.poolStraight = new EntityPool(this.roadStraight, 12), this.poolStraight.on("free", this.onFreePoolItem, this);
	for (var e = 0; 12 > e; e++) {
		var t = this.poolStraight.alloc();
		this.app.root.addChild(t), t.enabled = !0, this.poolStraight.free(t)
	}
	this.poolLeft = new EntityPool(this.roadLeft, 12), this.poolLeft.on("free", this.onFreePoolItem, this);
	for (var e = 0; 12 > e; e++) {
		var t = this.poolLeft.alloc();
		this.app.root.addChild(t), t.enabled = !0, this.poolLeft.free(t)
	}
	this.poolRight = new EntityPool(this.roadRight, 12), this.poolRight.on("free", this.onFreePoolItem, this);
	for (var e = 0; 12 > e; e++) {
		var t = this.poolRight.alloc();
		this.app.root.addChild(t), t.enabled = !0, this.poolRight.free(t)
	}
	this.blocks = [], this.app.on("player:current", this.onPlayerProgress, this), this.app.on("app:collect", this.onCollect, this), this.app.on("app:reset", this.reset, this), this.app.level = this, this.progress = 0, this.forceStraight = !1
}, Level.prototype.postInitialize = function() {
	this.reset()
}, Level.prototype.reset = function() {
	this.poolStraight.freeAll(), this.poolRight.freeAll(), this.poolLeft.freeAll(), this.blocks = new Array(MAX_BLOCKS), this.progress = 0, this.forceStraight = !1;
	var e = 3;
	this.forceStraight = !0;
	for (var t = 0; e > t; t++) this.addBlock(t);
	this.forceStraight = !1;
	for (var t = e; LEAD >= t; t++) this.addBlock(t)
}, Level.prototype.getBlock = function(e) {
	return this.blocks[e % MAX_BLOCKS]
}, Level.prototype.getBlockType = function(e) {
	var t = this.getBlock(e);
	if (!t) return null;
	if ("s" === t.name[0]) {
		var i = t.getLocalRotation();
		return i.y < .1 ? BLOCK_STRAIGHT_RIGHT : BLOCK_STRAIGHT_LEFT
	}
	return "l" === t.name[0] ? BLOCK_CORNER_LEFT : BLOCK_CORNER_RIGHT
}, Level.prototype.addBlock = function(e) {
	var t = e - 1;
	0 > t && (t += MAX_BLOCKS);
	var i = Level.tmpVec,
		n = BLOCK_STRAIGHT_LEFT,
		r = this.getBlockType(t);
	if (r) {
		if (i.copy(this.blocks[t].getLocalPosition()), r === BLOCK_STRAIGHT_LEFT || r === BLOCK_CORNER_LEFT) if (i.z -= BLOCK_SIZE, this.forceStraight) n = BLOCK_STRAIGHT_LEFT;
		else {
			for (var o = !0, s = !1, a = 1; 4 >= a; a++) {
				var l = t - a,
					h = this.getBlockType(l);
				if (!h) break;
				h === BLOCK_STRAIGHT_LEFT || h === BLOCK_STRAIGHT_RIGHT ? s = !0 : o = !1
			}
			n = o ? BLOCK_CORNER_RIGHT : s ? pc.math.random(0, 1) < .5 ? BLOCK_STRAIGHT_LEFT : BLOCK_CORNER_RIGHT : BLOCK_STRAIGHT_LEFT
		} else if (r === BLOCK_STRAIGHT_RIGHT || r === BLOCK_CORNER_RIGHT) if (i.x += BLOCK_SIZE, this.forceStraight) n = BLOCK_STRAIGHT_RIGHT;
		else {
			for (var o = !0, s = !1, a = 1; 4 >= a; a++) {
				var l = t - a,
					h = this.getBlockType(l);
				if (!h) break;
				h === BLOCK_STRAIGHT_RIGHT || h === BLOCK_STRAIGHT_LEFT ? s = !0 : o = !1
			}
			n = o ? BLOCK_CORNER_LEFT : s ? pc.math.random(0, 1) < .5 ? BLOCK_STRAIGHT_RIGHT : BLOCK_CORNER_LEFT : BLOCK_STRAIGHT_RIGHT
		}
	} else i.copy(FIRST_POS);
	this.app.autoplay && !this.forceStraight && (n = r === BLOCK_CORNER_RIGHT || r === BLOCK_STRAIGHT_RIGHT ? BLOCK_CORNER_LEFT : BLOCK_CORNER_RIGHT);
	var c, u = Level.v2;
	if (n === BLOCK_STRAIGHT_LEFT ? (c = this.poolStraight.alloc(), u.set(0, 90, 0)) : n === BLOCK_STRAIGHT_RIGHT ? (c = this.poolStraight.alloc(), u.set(0, 0, 0)) : n === BLOCK_CORNER_LEFT ? (c = this.poolLeft.alloc(), u.set(0, 0, 0)) : (c = this.poolRight.alloc(), u.set(0, 90, 0)), Level.FAST_HIDE ? (null === c.getParent() && (this.app.root.addChild(c), c.enabled = !0), c.model.model.meshInstances[0]._hidden = !1, c.model.model.meshInstances[1]._hidden = !1) : (this.app.root.addChild(c), c.enabled = !0), c.setLocalEulerAngles(u), c.setPosition(i), STATIC_MESHES) {
		c.syncHierarchy();
		for (var p = c.model.model.meshInstances, a = 0; a < p.length; a++) p[a]._updateAabb = !0, p[a]._aabb = p[a].aabb, p[a]._updateAabb = !1
	}
	this.blocks[e] = c, this.app.fire("level:addBlock", c, n)
}, Level.prototype.onPlayerProgress = function(e) {
	this.progress = e, e %= MAX_BLOCKS;
	var t = e - TAIL;
	0 > t && (t += MAX_BLOCKS);
	var i = this.blocks[t];
	i && ("straight" === i.name ? this.poolStraight.free(i) : "right" === i.name ? this.poolRight.free(i) : "left" === i.name && this.poolLeft.free(i), this.app.fire("level:removeBlock", i)), t = e + LEAD, t >= MAX_BLOCKS && (t -= MAX_BLOCKS), this.addBlock(t)
}, Level.prototype.onFreePoolItem = function(e) {
	if (Level.FAST_HIDE) e.model.model.meshInstances[0]._hidden = !0, e.model.model.meshInstances[1]._hidden = !0;
	else {
		e.enabled = !1;
		var t = e.getParent();
		t && t.removeChild(e)
	}
};
var Ui = new pc.Script("ui");
Ui.attributes.add("html", {
	type: "asset",
	assetType: "html"
}), Ui.attributes.add("less", {
	type: "asset",
	assetType: "css"
}), Ui.prototype.initialize = function() {
	this.app.ui = {};
	var e = document.createElement("div");
	e.id = "ui", document.body.appendChild(e);
	var t = document.createElement("style");
	document.head.appendChild(t), this.html.on("load", function() {
		this.templateHtml(e, this.html)
	}, this), this.less.on("load", function() {
		this.templateCss(t, this.less)
	}, this), this.templateHtml(e, this.html), this.templateCss(t, this.less)
}, Ui.prototype.replaceTags = function(e) {
	for (var t = e.match(/\{.+?\}/g), i = 0; i < t.length; i++) {
		var n = t[i].match(/\{asset\[([0-9]+)\]\.(.+?)\}/i);
		if (n) {
			for (var r = n[1], o = n[2].split("."), s = this.app.assets.get(r), a = s, l = 0; l < o.length; l++) a = a[o[l]];
			e = e.replace(t[i], a)
		}
	}
	return e
}, Ui.prototype.templateHtml = function(e, t) {
	e.innerHTML = this.replaceTags(t.resource), this.app.ui = {
		element: e
	};
	for (var i = e.querySelectorAll("[bind]"), n = 0; n < i.length; n++) {
		var r = i[n].getAttribute("bind");
		this.app.ui[r] = i[n]
	}
	this.app.fire("ui:template")
}, Ui.prototype.templateCss = function(e, t) {
	var i = this.replaceTags(t.resource);
	less.render(i, function(t, i) {
		return t ? console.error(t) : void(e.innerHTML = i.css)
	})
};
var Vehicles = new pc.Script("vehicles");
Vehicles.attributes.add("entities", {
	type: "entity"
}), Vehicles.prototype.postInitialize = function() {
	this.list = [];
	for (var e = this.entities.getChildren().slice(0), t = 0; t < e.length; t++) this.add(e[t]);
	this.app.vehicles = this
}, Vehicles.prototype.add = function(e) {
	this.list.push(e), this.entities.removeChild(e);
	var t = this.app.assets.get(e.model.asset);
	t.on("load", function() {
		this.process(e)
	}, this), this.app.assets.load(t), this.process(e)
}, Vehicles.prototype.process = function(e) {
	e.pipe = e.findByName("pipe"), e.wheels = [e.findByName("fwd_r_wheel"), e.findByName("fwd_l_wheel")], e.trails = [e.findByName("fwd_r"), e.findByName("fwd_l"), e.findByName("back_r"), e.findByName("back_l")]
}, Vehicles.prototype.get = function(e, t) {
	var i = this.list[Math.min(e, this.list.length - 1)];
	return this.process(i), i
};
var CameraFrustum = new pc.Script("cameraFrustum");
CameraFrustum.attributes.add("camera", {
	type: "entity"
}), CameraFrustum.vecA = new pc.Vec3, CameraFrustum.vecB = new pc.Vec3, CameraFrustum.color = new pc.Color(1, 1, 1), CameraFrustum.prototype.postUpdate = function(e) {
	this.camera.camera.screenToWorld(0, 0, 1, CameraFrustum.vecA), this.camera.camera.screenToWorld(window.innerWidth, 0, 1, CameraFrustum.vecB), this.app.renderLine(CameraFrustum.vecA, CameraFrustum.vecB, CameraFrustum.color, pc.LAYER_GIZMO), this.camera.camera.screenToWorld(window.innerWidth, window.innerHeight, 1, CameraFrustum.vecA), this.camera.camera.screenToWorld(window.innerWidth, 0, 1, CameraFrustum.vecB), this.app.renderLine(CameraFrustum.vecA, CameraFrustum.vecB, CameraFrustum.color, pc.LAYER_GIZMO), this.camera.camera.screenToWorld(window.innerWidth, window.innerHeight, 1, CameraFrustum.vecA), this.camera.camera.screenToWorld(0, window.innerHeight, 1, CameraFrustum.vecB), this.app.renderLine(CameraFrustum.vecA, CameraFrustum.vecB, CameraFrustum.color, pc.LAYER_GIZMO), this.camera.camera.screenToWorld(0, 0, 1, CameraFrustum.vecA), this.camera.camera.screenToWorld(0, window.innerHeight, 1, CameraFrustum.vecB), this.app.renderLine(CameraFrustum.vecA, CameraFrustum.vecB, CameraFrustum.color, pc.LAYER_GIZMO)
}, CameraFrustum.prototype.swap = function(e) {
	this.camera = e.camera
};
var Fps = new pc.Script("fps");
Fps.prototype.initialize = function() {
	this.meter = new FPSMeter({
		graph: !0,
		top: "auto",
		bottom: "50px"
	})
}, Fps.prototype.update = function(e) {
	this.meter.tick()
}, ! function(e) {
	if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
	else if ("function" == typeof define && define.amd) define([], e);
	else {
		var t;
		t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.less = e()
	}
}(function() {
	return function e(t, i, n) {
		function r(s, a) {
			if (!i[s]) {
				if (!t[s]) {
					var l = "function" == typeof require && require;
					if (!a && l) return l(s, !0);
					if (o) return o(s, !0);
					var h = new Error("Cannot find module '" + s + "'");
					throw h.code = "MODULE_NOT_FOUND", h
				}
				var c = i[s] = {
					exports: {}
				};
				t[s][0].call(c.exports, function(e) {
					var i = t[s][1][e];
					return r(i ? i : e)
				}, c, c.exports, e, t, i, n)
			}
			return i[s].exports
		}
		for (var o = "function" == typeof require && require, s = 0; n.length > s; s++) r(n[s]);
		return r
	}({
		1: [function(e, t) {
			var i = e("./utils").addDataAttr,
				n = e("./browser");
			t.exports = function(e, t) {
				i(t, n.currentScript(e)), void 0 === t.isFileProtocol && (t.isFileProtocol = /^(file|(chrome|safari)(-extension)?|resource|qrc|app):/.test(e.location.protocol)), t.async = t.async || !1, t.fileAsync = t.fileAsync || !1, t.poll = t.poll || (t.isFileProtocol ? 1e3 : 1500), t.env = t.env || ("127.0.0.1" == e.location.hostname || "0.0.0.0" == e.location.hostname || "localhost" == e.location.hostname || e.location.port && e.location.port.length > 0 || t.isFileProtocol ? "development" : "production");
				var r = /!dumpLineNumbers:(comments|mediaquery|all)/.exec(e.location.hash);
				r && (t.dumpLineNumbers = r[1]), void 0 === t.useFileCache && (t.useFileCache = !0), void 0 === t.onReady && (t.onReady = !0)
			}
		}, {
			"./browser": 3,
			"./utils": 9
		}],
		2: [function(e, t) {
			e("promise/polyfill.js");
			var i = window.less || {};
			e("./add-default-options")(window, i);
			var n = t.exports = e("./index")(window, i);
			window.less = n, i.onReady && (/!watch/.test(window.location.hash) && n.watch(), n.registerStylesheetsImmediately(), n.pageLoadFinished = n.refresh("development" === n.env))
		}, {
			"./add-default-options": 1,
			"./index": 7,
			"promise/polyfill.js": 95
		}],
		3: [function(e, t) {
			var i = e("./utils");
			t.exports = {
				createCSS: function(e, t, n) {
					var r = n.href || "",
						o = "less:" + (n.title || i.extractId(r)),
						s = e.getElementById(o),
						a = !1,
						l = e.createElement("style");
					l.setAttribute("type", "text/css"), n.media && l.setAttribute("media", n.media), l.id = o, l.styleSheet || (l.appendChild(e.createTextNode(t)), a = null !== s && s.childNodes.length > 0 && l.childNodes.length > 0 && s.firstChild.nodeValue === l.firstChild.nodeValue);
					var h = e.getElementsByTagName("head")[0];
					if (null === s || a === !1) {
						var c = n && n.nextSibling || null;
						c ? c.parentNode.insertBefore(l, c) : h.appendChild(l)
					}
					if (s && a === !1 && s.parentNode.removeChild(s), l.styleSheet) try {
						l.styleSheet.cssText = t
					} catch (u) {
						throw new Error("Couldn't reassign styleSheet.cssText.")
					}
				},
				currentScript: function(e) {
					var t = e.document;
					return t.currentScript || function() {
						var e = t.getElementsByTagName("script");
						return e[e.length - 1]
					}()
				}
			}
		}, {
			"./utils": 9
		}],
		4: [function(e, t) {
			t.exports = function(e, t, i) {
				var n = null;
				if ("development" !== t.env) try {
					n = "undefined" == typeof e.localStorage ? null : e.localStorage
				} catch (r) {}
				return {
					setCSS: function(e, t, r) {
						if (n) {
							i.info("saving " + e + " to cache.");
							try {
								n.setItem(e, r), n.setItem(e + ":timestamp", t)
							} catch (o) {
								i.error('failed to save "' + e + '" to local storage for caching.')
							}
						}
					},
					getCSS: function(e, t) {
						var i = n && n.getItem(e),
							r = n && n.getItem(e + ":timestamp");
						return r && t.lastModified && new Date(t.lastModified).valueOf() === new Date(r).valueOf() ? i : void 0
					}
				}
			}
		}, {}],
		5: [function(e, t) {
			var i = e("./utils"),
				n = e("./browser");
			t.exports = function(e, t, r) {
				function o(t, o) {
					var s, a, l = "less-error-message:" + i.extractId(o || ""),
						h = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>',
						c = e.document.createElement("div"),
						u = [],
						p = t.filename || o,
						f = p.match(/([^\/]+(\?.*)?)$/)[1];
					c.id = l, c.className = "less-error-message", a = "<h3>" + (t.type || "Syntax") + "Error: " + (t.message || "There is an error in your .less file") + '</h3><p>in <a href="' + p + '">' + f + "</a> ";
					var d = function(e, t, i) {
						void 0 !== e.extract[t] && u.push(h.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (t - 1)).replace(/\{class\}/, i).replace(/\{content\}/, e.extract[t]))
					};
					t.extract && (d(t, 0, ""), d(t, 1, "line"), d(t, 2, ""), a += "on line " + t.line + ", column " + (t.column + 1) + ":</p><ul>" + u.join("") + "</ul>"), t.stack && (t.extract || r.logLevel >= 4) && (a += "<br/>Stack Trace</br />" + t.stack.split("\n").slice(1).join("<br/>")), c.innerHTML = a, n.createCSS(e.document, [".less-error-message ul, .less-error-message li {", "list-style-type: none;", "margin-right: 15px;", "padding: 4px 0;", "margin: 0;", "}", ".less-error-message label {", "font-size: 12px;", "margin-right: 15px;", "padding: 4px 0;", "color: #cc7777;", "}", ".less-error-message pre {", "color: #dd6666;", "padding: 4px 0;", "margin: 0;", "display: inline-block;", "}", ".less-error-message pre.line {", "color: #ff0000;", "}", ".less-error-message h3 {", "font-size: 20px;", "font-weight: bold;", "padding: 15px 0 5px 0;", "margin: 0;", "}", ".less-error-message a {", "color: #10a", "}", ".less-error-message .error {", "color: red;", "font-weight: bold;", "padding-bottom: 2px;", "border-bottom: 1px dashed red;", "}"].join("\n"), {
						title: "error-message"
					}), c.style.cssText = ["font-family: Arial, sans-serif", "border: 1px solid #e00", "background-color: #eee", "border-radius: 5px", "-webkit-border-radius: 5px", "-moz-border-radius: 5px", "color: #e00", "padding: 15px", "margin-bottom: 15px"].join(";"), "development" === r.env && (s = setInterval(function() {
						var t = e.document,
							i = t.body;
						i && (t.getElementById(l) ? i.replaceChild(c, t.getElementById(l)) : i.insertBefore(c, i.firstChild), clearInterval(s))
					}, 10))
				}
				function s(e, t) {
					r.errorReporting && "html" !== r.errorReporting ? "console" === r.errorReporting ? c(e, t) : "function" == typeof r.errorReporting && r.errorReporting("add", e, t) : o(e, t)
				}
				function a(t) {
					var n = e.document.getElementById("less-error-message:" + i.extractId(t));
					n && n.parentNode.removeChild(n)
				}
				function l() {}
				function h(e) {
					r.errorReporting && "html" !== r.errorReporting ? "console" === r.errorReporting ? l(e) : "function" == typeof r.errorReporting && r.errorReporting("remove", e) : a(e)
				}
				function c(e, i) {
					var n = "{line} {content}",
						o = e.filename || i,
						s = [],
						a = (e.type || "Syntax") + "Error: " + (e.message || "There is an error in your .less file") + " in " + o + " ",
						l = function(e, t, i) {
							void 0 !== e.extract[t] && s.push(n.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (t - 1)).replace(/\{class\}/, i).replace(/\{content\}/, e.extract[t]))
						};
					e.extract && (l(e, 0, ""), l(e, 1, "line"), l(e, 2, ""), a += "on line " + e.line + ", column " + (e.column + 1) + ":\n" + s.join("\n")), e.stack && (e.extract || r.logLevel >= 4) && (a += "\nStack Trace\n" + e.stack), t.logger.error(a)
				}
				return {
					add: s,
					remove: h
				}
			}
		}, {
			"./browser": 3,
			"./utils": 9
		}],
		6: [function(e, t) {
			t.exports = function(t, i) {
				function n() {
					if (window.XMLHttpRequest && !("file:" === window.location.protocol && "ActiveXObject" in window)) return new XMLHttpRequest;
					try {
						return new ActiveXObject("Microsoft.XMLHTTP")
					} catch (e) {
						return i.error("browser doesn't support AJAX."), null
					}
				}
				var r = e("../less/environment/abstract-file-manager.js"),
					o = {}, s = function() {};
				return s.prototype = new r, s.prototype.alwaysMakePathsAbsolute = function() {
					return !0
				}, s.prototype.join = function(e, t) {
					return e ? this.extractUrlParts(t, e).path : t
				}, s.prototype.doXHR = function(e, r, o, s) {
					function a(t, i, n) {
						t.status >= 200 && 300 > t.status ? i(t.responseText, t.getResponseHeader("Last-Modified")) : "function" == typeof n && n(t.status, e)
					}
					var l = n(),
						h = t.isFileProtocol ? t.fileAsync : t.async;
					"function" == typeof l.overrideMimeType && l.overrideMimeType("text/css"), i.debug("XHR: Getting '" + e + "'"), l.open("GET", e, h), l.setRequestHeader("Accept", r || "text/x-less, text/css; q=0.9, */*; q=0.5"), l.send(null), t.isFileProtocol && !t.fileAsync ? 0 === l.status || l.status >= 200 && 300 > l.status ? o(l.responseText) : s(l.status, e) : h ? l.onreadystatechange = function() {
						4 == l.readyState && a(l, o, s)
					} : a(l, o, s)
				}, s.prototype.supports = function() {
					return !0
				}, s.prototype.clearFileCache = function() {
					o = {}
				}, s.prototype.loadFile = function(e, t, i, n, r) {
					t && !this.isPathAbsolute(e) && (e = t + e), i = i || {};
					var s = this.extractUrlParts(e, window.location.href),
						a = s.url;
					if (i.useFileCache && o[a]) try {
						var l = o[a];
						r(null, {
							contents: l,
							filename: a,
							webInfo: {
								lastModified: new Date
							}
						})
					} catch (h) {
						r({
							filename: a,
							message: "Error loading file " + a + " error was " + h.message
						})
					} else this.doXHR(a, i.mime, function(e, t) {
						o[a] = e, r(null, {
							contents: e,
							filename: a,
							webInfo: {
								lastModified: t
							}
						})
					}, function(e, t) {
						r({
							type: "File",
							message: "'" + t + "' wasn't found (" + e + ")",
							href: a
						})
					})
				}, s
			}
		}, {
			"../less/environment/abstract-file-manager.js": 14
		}],
		7: [function(e, t) {
			var i = e("./utils").addDataAttr,
				n = e("./browser");
			t.exports = function(t, r) {
				function o(e) {
					return r.postProcessor && "function" == typeof r.postProcessor && (e = r.postProcessor.call(e, e) || e), e
				}
				function s(e) {
					var t = {};
					for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
					return t
				}
				function a(e, t) {
					var i = Array.prototype.slice.call(arguments, 2);
					return function() {
						var n = i.concat(Array.prototype.slice.call(arguments, 0));
						return e.apply(t, n)
					}
				}
				function l(e) {
					for (var t, i = p.getElementsByTagName("style"), n = 0; i.length > n; n++) if (t = i[n], t.type.match(b)) {
						var o = s(r);
						o.modifyVars = e;
						var l = t.innerHTML || "";
						o.filename = p.location.href.replace(/#.*$/, ""), f.render(l, o, a(function(e, t, i) {
							t ? g.add(t, "inline") : (e.type = "text/css", e.styleSheet ? e.styleSheet.cssText = i.css : e.innerHTML = i.css)
						}, null, t))
					}
				}
				function h(e, t, n, a, l) {
					function h(i) {
						var r = i.contents,
							s = i.filename,
							l = i.webInfo,
							h = {
								currentDirectory: v.getPath(s),
								filename: s,
								rootFilename: s,
								relativeUrls: c.relativeUrls
							};
						if (h.entryPath = h.currentDirectory, h.rootpath = c.rootpath || h.currentDirectory, l && (l.remaining = a, !c.modifyVars)) {
							var u = y.getCSS(s, l);
							if (!n && u) return l.local = !0, void t(null, u, r, e, l, s)
						}
						g.remove(s), c.rootFileInfo = h, f.render(r, c, function(i, n) {
							i ? (i.href = s, t(i)) : (n.css = o(n.css), c.modifyVars || y.setCSS(e.href, l.lastModified, n.css), t(null, n.css, r, e, l, s))
						})
					}
					var c = s(r);
					i(c, e), c.mime = e.type, l && (c.modifyVars = l), v.loadFile(e.href, null, c, d, function(e, i) {
						return e ? void t(e) : void h(i)
					})
				}
				function c(e, t, i) {
					for (var n = 0; f.sheets.length > n; n++) h(f.sheets[n], e, t, f.sheets.length - (n + 1), i)
				}
				function u() {
					"development" === f.env && (f.watchTimer = setInterval(function() {
						f.watchMode && (v.clearFileCache(), c(function(e, i, r, o) {
							e ? g.add(e, e.href || o.href) : i && n.createCSS(t.document, i, o)
						}))
					}, r.poll))
				}
				var p = t.document,
					f = e("../less")();
				f.options = r;
				var d = f.environment,
					m = e("./file-manager")(r, f.logger),
					v = new m;
				d.addFileManager(v), f.FileManager = m, e("./log-listener")(f, r);
				var g = e("./error-reporting")(t, f, r),
					y = f.cache = r.cache || e("./cache")(t, r, f.logger);
				r.functions && f.functions.functionRegistry.addMultiple(r.functions);
				var b = /^text\/(x-)?less$/;
				return f.watch = function() {
					return f.watchMode || (f.env = "development", u()), this.watchMode = !0, !0
				}, f.unwatch = function() {
					return clearInterval(f.watchTimer), this.watchMode = !1, !1
				}, f.registerStylesheetsImmediately = function() {
					var e = p.getElementsByTagName("link");
					f.sheets = [];
					for (var t = 0; e.length > t; t++)("stylesheet/less" === e[t].rel || e[t].rel.match(/stylesheet/) && e[t].type.match(b)) && f.sheets.push(e[t])
				}, f.registerStylesheets = function() {
					return new Promise(function(e) {
						f.registerStylesheetsImmediately(), e()
					})
				}, f.modifyVars = function(e) {
					return f.refresh(!0, e, !1)
				}, f.refresh = function(e, i, r) {
					return (e || r) && r !== !1 && v.clearFileCache(), new Promise(function(r, o) {
						var s, a, h;
						s = a = new Date, c(function(e, i, l, c, u) {
							return e ? (g.add(e, e.href || c.href), void o(e)) : (f.logger.info(u.local ? "loading " + c.href + " from cache." : "rendered " + c.href + " successfully."), n.createCSS(t.document, i, c), f.logger.info("css for " + c.href + " generated in " + (new Date - a) + "ms"), 0 === u.remaining && (h = new Date - s, f.logger.info("less has finished. css generated in " + h + "ms"), r({
								startTime: s,
								endTime: a,
								totalMilliseconds: h,
								sheets: f.sheets.length
							})), void(a = new Date))
						}, e, i), l(i)
					})
				}, f.refreshStyles = l, f
			}
		}, {
			"../less": 30,
			"./browser": 3,
			"./cache": 4,
			"./error-reporting": 5,
			"./file-manager": 6,
			"./log-listener": 8,
			"./utils": 9
		}],
		8: [function(e, t) {
			t.exports = function(e, t) {
				var i = 4,
					n = 3,
					r = 2,
					o = 1;
				t.logLevel = "undefined" != typeof t.logLevel ? t.logLevel : "development" === t.env ? n : o, t.loggers || (t.loggers = [{
					debug: function(e) {
						t.logLevel >= i && console.log(e)
					},
					info: function(e) {
						t.logLevel >= n && console.log(e)
					},
					warn: function(e) {
						t.logLevel >= r && console.warn(e)
					},
					error: function(e) {
						t.logLevel >= o && console.error(e)
					}
				}]);
				for (var s = 0; t.loggers.length > s; s++) e.logger.addListener(t.loggers[s])
			}
		}, {}],
		9: [function(e, t) {
			t.exports = {
				extractId: function(e) {
					return e.replace(/^[a-z-]+:\/+?[^\/]+/, "").replace(/[\?\&]livereload=\w+/, "").replace(/^\//, "").replace(/\.[a-zA-Z]+$/, "").replace(/[^\.\w-]+/g, "-").replace(/\./g, ":")
				},
				addDataAttr: function(e, t) {
					for (var i in t.dataset) if (t.dataset.hasOwnProperty(i)) if ("env" === i || "dumpLineNumbers" === i || "rootpath" === i || "errorReporting" === i) e[i] = t.dataset[i];
					else try {
						e[i] = JSON.parse(t.dataset[i])
					} catch (n) {}
				}
			}
		}, {}],
		10: [function(e, t) {
			var i = {};
			t.exports = i;
			var n = function(e, t, i) {
				if (e) for (var n = 0; i.length > n; n++) e.hasOwnProperty(i[n]) && (t[i[n]] = e[i[n]])
			}, r = ["paths", "relativeUrls", "rootpath", "strictImports", "insecure", "dumpLineNumbers", "compress", "syncImport", "chunkInput", "mime", "useFileCache", "processImports", "reference", "pluginManager"];
			i.Parse = function(e) {
				n(e, this, r), "string" == typeof this.paths && (this.paths = [this.paths])
			};
			var o = ["paths", "compress", "ieCompat", "strictMath", "strictUnits", "sourceMap", "importMultiple", "urlArgs", "javascriptEnabled", "pluginManager", "importantScope"];
			i.Eval = function(e, t) {
				n(e, this, o), "string" == typeof this.paths && (this.paths = [this.paths]), this.frames = t || [], this.importantScope = this.importantScope || []
			}, i.Eval.prototype.inParenthesis = function() {
				this.parensStack || (this.parensStack = []), this.parensStack.push(!0)
			}, i.Eval.prototype.outOfParenthesis = function() {
				this.parensStack.pop()
			}, i.Eval.prototype.isMathOn = function() {
				return this.strictMath ? this.parensStack && this.parensStack.length : !0
			}, i.Eval.prototype.isPathRelative = function(e) {
				return !/^(?:[a-z-]+:|\/|#)/i.test(e)
			}, i.Eval.prototype.normalizePath = function(e) {
				var t, i = e.split("/").reverse();
				for (e = []; 0 !== i.length;) switch (t = i.pop()) {
					case ".":
						break;
					case "..":
						0 === e.length || ".." === e[e.length - 1] ? e.push(t) : e.pop();
						break;
					default:
						e.push(t)
				}
				return e.join("/")
			}
		}, {}],
		11: [function(e, t) {
			t.exports = {
				aliceblue: "#f0f8ff",
				antiquewhite: "#faebd7",
				aqua: "#00ffff",
				aquamarine: "#7fffd4",
				azure: "#f0ffff",
				beige: "#f5f5dc",
				bisque: "#ffe4c4",
				black: "#000000",
				blanchedalmond: "#ffebcd",
				blue: "#0000ff",
				blueviolet: "#8a2be2",
				brown: "#a52a2a",
				burlywood: "#deb887",
				cadetblue: "#5f9ea0",
				chartreuse: "#7fff00",
				chocolate: "#d2691e",
				coral: "#ff7f50",
				cornflowerblue: "#6495ed",
				cornsilk: "#fff8dc",
				crimson: "#dc143c",
				cyan: "#00ffff",
				darkblue: "#00008b",
				darkcyan: "#008b8b",
				darkgoldenrod: "#b8860b",
				darkgray: "#a9a9a9",
				darkgrey: "#a9a9a9",
				darkgreen: "#006400",
				darkkhaki: "#bdb76b",
				darkmagenta: "#8b008b",
				darkolivegreen: "#556b2f",
				darkorange: "#ff8c00",
				darkorchid: "#9932cc",
				darkred: "#8b0000",
				darksalmon: "#e9967a",
				darkseagreen: "#8fbc8f",
				darkslateblue: "#483d8b",
				darkslategray: "#2f4f4f",
				darkslategrey: "#2f4f4f",
				darkturquoise: "#00ced1",
				darkviolet: "#9400d3",
				deeppink: "#ff1493",
				deepskyblue: "#00bfff",
				dimgray: "#696969",
				dimgrey: "#696969",
				dodgerblue: "#1e90ff",
				firebrick: "#b22222",
				floralwhite: "#fffaf0",
				forestgreen: "#228b22",
				fuchsia: "#ff00ff",
				gainsboro: "#dcdcdc",
				ghostwhite: "#f8f8ff",
				gold: "#ffd700",
				goldenrod: "#daa520",
				gray: "#808080",
				grey: "#808080",
				green: "#008000",
				greenyellow: "#adff2f",
				honeydew: "#f0fff0",
				hotpink: "#ff69b4",
				indianred: "#cd5c5c",
				indigo: "#4b0082",
				ivory: "#fffff0",
				khaki: "#f0e68c",
				lavender: "#e6e6fa",
				lavenderblush: "#fff0f5",
				lawngreen: "#7cfc00",
				lemonchiffon: "#fffacd",
				lightblue: "#add8e6",
				lightcoral: "#f08080",
				lightcyan: "#e0ffff",
				lightgoldenrodyellow: "#fafad2",
				lightgray: "#d3d3d3",
				lightgrey: "#d3d3d3",
				lightgreen: "#90ee90",
				lightpink: "#ffb6c1",
				lightsalmon: "#ffa07a",
				lightseagreen: "#20b2aa",
				lightskyblue: "#87cefa",
				lightslategray: "#778899",
				lightslategrey: "#778899",
				lightsteelblue: "#b0c4de",
				lightyellow: "#ffffe0",
				lime: "#00ff00",
				limegreen: "#32cd32",
				linen: "#faf0e6",
				magenta: "#ff00ff",
				maroon: "#800000",
				mediumaquamarine: "#66cdaa",
				mediumblue: "#0000cd",
				mediumorchid: "#ba55d3",
				mediumpurple: "#9370d8",
				mediumseagreen: "#3cb371",
				mediumslateblue: "#7b68ee",
				mediumspringgreen: "#00fa9a",
				mediumturquoise: "#48d1cc",
				mediumvioletred: "#c71585",
				midnightblue: "#191970",
				mintcream: "#f5fffa",
				mistyrose: "#ffe4e1",
				moccasin: "#ffe4b5",
				navajowhite: "#ffdead",
				navy: "#000080",
				oldlace: "#fdf5e6",
				olive: "#808000",
				olivedrab: "#6b8e23",
				orange: "#ffa500",
				orangered: "#ff4500",
				orchid: "#da70d6",
				palegoldenrod: "#eee8aa",
				palegreen: "#98fb98",
				paleturquoise: "#afeeee",
				palevioletred: "#d87093",
				papayawhip: "#ffefd5",
				peachpuff: "#ffdab9",
				peru: "#cd853f",
				pink: "#ffc0cb",
				plum: "#dda0dd",
				powderblue: "#b0e0e6",
				purple: "#800080",
				rebeccapurple: "#663399",
				red: "#ff0000",
				rosybrown: "#bc8f8f",
				royalblue: "#4169e1",
				saddlebrown: "#8b4513",
				salmon: "#fa8072",
				sandybrown: "#f4a460",
				seagreen: "#2e8b57",
				seashell: "#fff5ee",
				sienna: "#a0522d",
				silver: "#c0c0c0",
				skyblue: "#87ceeb",
				slateblue: "#6a5acd",
				slategray: "#708090",
				slategrey: "#708090",
				snow: "#fffafa",
				springgreen: "#00ff7f",
				steelblue: "#4682b4",
				tan: "#d2b48c",
				teal: "#008080",
				thistle: "#d8bfd8",
				tomato: "#ff6347",
				turquoise: "#40e0d0",
				violet: "#ee82ee",
				wheat: "#f5deb3",
				white: "#ffffff",
				whitesmoke: "#f5f5f5",
				yellow: "#ffff00",
				yellowgreen: "#9acd32"
			}
		}, {}],
		12: [function(e, t) {
			t.exports = {
				colors: e("./colors"),
				unitConversions: e("./unit-conversions")
			}
		}, {
			"./colors": 11,
			"./unit-conversions": 13
		}],
		13: [function(e, t) {
			t.exports = {
				length: {
					m: 1,
					cm: .01,
					mm: .001,
					"in": .0254,
					px: .0254 / 96,
					pt: .0254 / 72,
					pc: .0254 / 72 * 12
				},
				duration: {
					s: 1,
					ms: .001
				},
				angle: {
					rad: 1 / (2 * Math.PI),
					deg: 1 / 360,
					grad: .0025,
					turn: 1
				}
			}
		}, {}],
		14: [function(e, t) {
			var i = function() {};
			i.prototype.getPath = function(e) {
				var t = e.lastIndexOf("?");
				return t > 0 && (e = e.slice(0, t)), t = e.lastIndexOf("/"), 0 > t && (t = e.lastIndexOf("\\")), 0 > t ? "" : e.slice(0, t + 1)
			}, i.prototype.tryAppendExtension = function(e, t) {
				return /(\.[a-z]*$)|([\?;].*)$/.test(e) ? e : e + t
			}, i.prototype.tryAppendLessExtension = function(e) {
				return this.tryAppendExtension(e, ".less")
			}, i.prototype.supportsSync = function() {
				return !1
			}, i.prototype.alwaysMakePathsAbsolute = function() {
				return !1
			}, i.prototype.isPathAbsolute = function(e) {
				return /^(?:[a-z-]+:|\/|\\|#)/i.test(e)
			}, i.prototype.join = function(e, t) {
				return e ? e + t : t
			}, i.prototype.pathDiff = function(e, t) {
				var i, n, r, o, s = this.extractUrlParts(e),
					a = this.extractUrlParts(t),
					l = "";
				if (s.hostPart !== a.hostPart) return "";
				for (n = Math.max(a.directories.length, s.directories.length), i = 0; n > i && a.directories[i] === s.directories[i]; i++);
				for (o = a.directories.slice(i), r = s.directories.slice(i), i = 0; o.length - 1 > i; i++) l += "../";
				for (i = 0; r.length - 1 > i; i++) l += r[i] + "/";
				return l
			}, i.prototype.extractUrlParts = function(e, t) {
				var i, n, r = /^((?:[a-z-]+:)?\/+?(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i,
					o = e.match(r),
					s = {}, a = [];
				if (!o) throw new Error("Could not parse sheet href - '" + e + "'");
				if (t && (!o[1] || o[2])) {
					if (n = t.match(r), !n) throw new Error("Could not parse page url - '" + t + "'");
					o[1] = o[1] || n[1] || "", o[2] || (o[3] = n[3] + o[3])
				}
				if (o[3]) {
					for (a = o[3].replace(/\\/g, "/").split("/"), i = 0; a.length > i; i++) "." === a[i] && (a.splice(i, 1), i -= 1);
					for (i = 0; a.length > i; i++) ".." === a[i] && i > 0 && (a.splice(i - 1, 2), i -= 2)
				}
				return s.hostPart = o[1], s.directories = a, s.path = (o[1] || "") + a.join("/"), s.fileUrl = s.path + (o[4] || ""), s.url = s.fileUrl + (o[5] || ""), s
			}, t.exports = i
		}, {}],
		15: [function(e, t) {
			var i = e("../logger"),
				n = function(e, t) {
					this.fileManagers = t || [], e = e || {};
					for (var i = ["encodeBase64", "mimeLookup", "charsetLookup", "getSourceMapGenerator"], n = [], r = n.concat(i), o = 0; r.length > o; o++) {
						var s = r[o],
							a = e[s];
						a ? this[s] = a.bind(e) : n.length > o && this.warn("missing required function in environment - " + s)
					}
				};
			n.prototype.getFileManager = function(e, t, n, r, o) {
				e || i.warn("getFileManager called with no filename.. Please report this issue. continuing."), null == t && i.warn("getFileManager called with null directory.. Please report this issue. continuing.");
				var s = this.fileManagers;
				n.pluginManager && (s = [].concat(s).concat(n.pluginManager.getFileManagers()));
				for (var a = s.length - 1; a >= 0; a--) {
					var l = s[a];
					if (l[o ? "supportsSync" : "supports"](e, t, n, r)) return l
				}
				return null
			}, n.prototype.addFileManager = function(e) {
				this.fileManagers.push(e)
			}, n.prototype.clearFileManagers = function() {
				this.fileManagers = []
			}, t.exports = n
		}, {
			"../logger": 32
		}],
		16: [function(e) {
			function t(e, t, n) {
				var r, o, s, a, l = t.alpha,
					h = n.alpha,
					c = [];
				s = h + l * (1 - h);
				for (var u = 0; 3 > u; u++) r = t.rgb[u] / 255, o = n.rgb[u] / 255, a = e(r, o), s && (a = (h * o + l * (r - h * (r + o - a))) / s), c[u] = 255 * a;
				return new i(c, s)
			}
			var i = e("../tree/color"),
				n = e("./function-registry"),
				r = {
					multiply: function(e, t) {
						return e * t
					},
					screen: function(e, t) {
						return e + t - e * t
					},
					overlay: function(e, t) {
						return e *= 2, 1 >= e ? r.multiply(e, t) : r.screen(e - 1, t)
					},
					softlight: function(e, t) {
						var i = 1,
							n = e;
						return t > .5 && (n = 1, i = e > .25 ? Math.sqrt(e) : ((16 * e - 12) * e + 4) * e), e - (1 - 2 * t) * n * (i - e)
					},
					hardlight: function(e, t) {
						return r.overlay(t, e)
					},
					difference: function(e, t) {
						return Math.abs(e - t)
					},
					exclusion: function(e, t) {
						return e + t - 2 * e * t
					},
					average: function(e, t) {
						return (e + t) / 2
					},
					negation: function(e, t) {
						return 1 - Math.abs(e + t - 1)
					}
				};
			for (var o in r) r.hasOwnProperty(o) && (t[o] = t.bind(null, r[o]));
			n.addMultiple(t)
		}, {
			"../tree/color": 49,
			"./function-registry": 21
		}],
		17: [function(e) {
			function t(e) {
				return Math.min(1, Math.max(0, e))
			}
			function i(e) {
				return o.hsla(e.h, e.s, e.l, e.a)
			}
			function n(e) {
				if (e instanceof s) return parseFloat(e.unit.is("%") ? e.value / 100 : e.value);
				if ("number" == typeof e) return e;
				throw {
					type: "Argument",
					message: "color functions take numbers as parameters"
				}
			}
			function r(e, t) {
				return e instanceof s && e.unit.is("%") ? parseFloat(e.value * t / 100) : n(e)
			}
			var o, s = e("../tree/dimension"),
				a = e("../tree/color"),
				l = e("../tree/quoted"),
				h = e("../tree/anonymous"),
				c = e("./function-registry");
			o = {
				rgb: function(e, t, i) {
					return o.rgba(e, t, i, 1)
				},
				rgba: function(e, t, i, o) {
					var s = [e, t, i].map(function(e) {
						return r(e, 255)
					});
					return o = n(o), new a(s, o)
				},
				hsl: function(e, t, i) {
					return o.hsla(e, t, i, 1)
				},
				hsla: function(e, i, r, s) {
					function a(e) {
						return e = 0 > e ? e + 1 : e > 1 ? e - 1 : e, 1 > 6 * e ? h + (l - h) * e * 6 : 1 > 2 * e ? l : 2 > 3 * e ? h + (l - h) * (2 / 3 - e) * 6 : h
					}
					e = n(e) % 360 / 360, i = t(n(i)), r = t(n(r)), s = t(n(s));
					var l = .5 >= r ? r * (i + 1) : r + i - r * i,
						h = 2 * r - l;
					return o.rgba(255 * a(e + 1 / 3), 255 * a(e), 255 * a(e - 1 / 3), s)
				},
				hsv: function(e, t, i) {
					return o.hsva(e, t, i, 1)
				},
				hsva: function(e, t, i, r) {
					e = n(e) % 360 / 360 * 360, t = n(t), i = n(i), r = n(r);
					var s, a;
					s = Math.floor(e / 60 % 6), a = e / 60 - s;
					var l = [i, i * (1 - t), i * (1 - a * t), i * (1 - (1 - a) * t)],
						h = [
							[0, 3, 1],
							[2, 0, 1],
							[1, 0, 3],
							[1, 2, 0],
							[3, 1, 0],
							[0, 1, 2]
						];
					return o.rgba(255 * l[h[s][0]], 255 * l[h[s][1]], 255 * l[h[s][2]], r)
				},
				hue: function(e) {
					return new s(e.toHSL().h)
				},
				saturation: function(e) {
					return new s(100 * e.toHSL().s, "%")
				},
				lightness: function(e) {
					return new s(100 * e.toHSL().l, "%")
				},
				hsvhue: function(e) {
					return new s(e.toHSV().h)
				},
				hsvsaturation: function(e) {
					return new s(100 * e.toHSV().s, "%")
				},
				hsvvalue: function(e) {
					return new s(100 * e.toHSV().v, "%")
				},
				red: function(e) {
					return new s(e.rgb[0])
				},
				green: function(e) {
					return new s(e.rgb[1])
				},
				blue: function(e) {
					return new s(e.rgb[2])
				},
				alpha: function(e) {
					return new s(e.toHSL().a);
				},
				luma: function(e) {
					return new s(e.luma() * e.alpha * 100, "%")
				},
				luminance: function(e) {
					var t = .2126 * e.rgb[0] / 255 + .7152 * e.rgb[1] / 255 + .0722 * e.rgb[2] / 255;
					return new s(t * e.alpha * 100, "%")
				},
				saturate: function(e, n, r) {
					if (!e.rgb) return null;
					var o = e.toHSL();
					return o.s += "undefined" != typeof r && "relative" === r.value ? o.s * n.value / 100 : n.value / 100, o.s = t(o.s), i(o)
				},
				desaturate: function(e, n, r) {
					var o = e.toHSL();
					return o.s -= "undefined" != typeof r && "relative" === r.value ? o.s * n.value / 100 : n.value / 100, o.s = t(o.s), i(o)
				},
				lighten: function(e, n, r) {
					var o = e.toHSL();
					return o.l += "undefined" != typeof r && "relative" === r.value ? o.l * n.value / 100 : n.value / 100, o.l = t(o.l), i(o)
				},
				darken: function(e, n, r) {
					var o = e.toHSL();
					return o.l -= "undefined" != typeof r && "relative" === r.value ? o.l * n.value / 100 : n.value / 100, o.l = t(o.l), i(o)
				},
				fadein: function(e, n, r) {
					var o = e.toHSL();
					return o.a += "undefined" != typeof r && "relative" === r.value ? o.a * n.value / 100 : n.value / 100, o.a = t(o.a), i(o)
				},
				fadeout: function(e, n, r) {
					var o = e.toHSL();
					return o.a -= "undefined" != typeof r && "relative" === r.value ? o.a * n.value / 100 : n.value / 100, o.a = t(o.a), i(o)
				},
				fade: function(e, n) {
					var r = e.toHSL();
					return r.a = n.value / 100, r.a = t(r.a), i(r)
				},
				spin: function(e, t) {
					var n = e.toHSL(),
						r = (n.h + t.value) % 360;
					return n.h = 0 > r ? 360 + r : r, i(n)
				},
				mix: function(e, t, i) {
					e.toHSL && t.toHSL || (console.log(t.type), console.dir(t)), i || (i = new s(50));
					var n = i.value / 100,
						r = 2 * n - 1,
						o = e.toHSL().a - t.toHSL().a,
						l = ((r * o == -1 ? r : (r + o) / (1 + r * o)) + 1) / 2,
						h = 1 - l,
						c = [e.rgb[0] * l + t.rgb[0] * h, e.rgb[1] * l + t.rgb[1] * h, e.rgb[2] * l + t.rgb[2] * h],
						u = e.alpha * n + t.alpha * (1 - n);
					return new a(c, u)
				},
				greyscale: function(e) {
					return o.desaturate(e, new s(100))
				},
				contrast: function(e, t, i, r) {
					if (!e.rgb) return null;
					if ("undefined" == typeof i && (i = o.rgba(255, 255, 255, 1)), "undefined" == typeof t && (t = o.rgba(0, 0, 0, 1)), t.luma() > i.luma()) {
						var s = i;
						i = t, t = s
					}
					return r = "undefined" == typeof r ? .43 : n(r), e.luma() < r ? i : t
				},
				argb: function(e) {
					return new h(e.toARGB())
				},
				color: function(e) {
					if (e instanceof l && /^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(e.value)) return new a(e.value.slice(1));
					if (e instanceof a || (e = a.fromKeyword(e.value))) return e.value = void 0, e;
					throw {
						type: "Argument",
						message: "argument must be a color keyword or 3/6 digit hex e.g. #FFF"
					}
				},
				tint: function(e, t) {
					return o.mix(o.rgb(255, 255, 255), e, t)
				},
				shade: function(e, t) {
					return o.mix(o.rgb(0, 0, 0), e, t)
				}
			}, c.addMultiple(o)
		}, {
			"../tree/anonymous": 45,
			"../tree/color": 49,
			"../tree/dimension": 55,
			"../tree/quoted": 72,
			"./function-registry": 21
		}],
		18: [function(e, t) {
			t.exports = function(t) {
				var i = e("../tree/quoted"),
					n = e("../tree/url"),
					r = e("./function-registry"),
					o = function(e, t) {
						return new n(t, e.index, e.currentFileInfo).eval(e.context)
					}, s = e("../logger");
				r.add("data-uri", function(e, r) {
					r || (r = e, e = null);
					var a = e && e.value,
						l = r.value,
						h = this.currentFileInfo,
						c = h.relativeUrls ? h.currentDirectory : h.entryPath,
						u = l.indexOf("#"),
						p = ""; - 1 !== u && (p = l.slice(u), l = l.slice(0, u));
					var f = t.getFileManager(l, c, this.context, t, !0);
					if (!f) return o(this, r);
					var d = !1;
					if (e) d = /;base64$/.test(a);
					else {
						if (a = t.mimeLookup(l), "image/svg+xml" === a) d = !1;
						else {
							var m = t.charsetLookup(a);
							d = ["US-ASCII", "UTF-8"].indexOf(m) < 0
						}
						d && (a += ";base64")
					}
					var v = f.loadFileSync(l, c, this.context, t);
					if (!v.contents) return s.warn("Skipped data-uri embedding of " + l + " because file not found"), o(this, r || e);
					var g = v.contents;
					if (d && !t.encodeBase64) return o(this, r);
					g = d ? t.encodeBase64(g) : encodeURIComponent(g);
					var y = "data:" + a + "," + g + p,
						b = 32768;
					return y.length >= b && this.context.ieCompat !== !1 ? (s.warn("Skipped data-uri embedding of " + l + " because its size (" + y.length + " characters) exceeds IE8-safe " + b + " characters!"), o(this, r || e)) : new n(new i('"' + y + '"', y, !1, this.index, this.currentFileInfo), this.index, this.currentFileInfo)
				})
			}
		}, {
			"../logger": 32,
			"../tree/quoted": 72,
			"../tree/url": 79,
			"./function-registry": 21
		}],
		19: [function(e, t) {
			var i = e("../tree/keyword"),
				n = e("./function-registry"),
				r = {
					eval: function() {
						var e = this.value_,
							t = this.error_;
						if (t) throw t;
						return null != e ? e ? i.True : i.False : void 0
					},
					value: function(e) {
						this.value_ = e
					},
					error: function(e) {
						this.error_ = e
					},
					reset: function() {
						this.value_ = this.error_ = null
					}
				};
			n.add("default", r.eval.bind(r)), t.exports = r
		}, {
			"../tree/keyword": 64,
			"./function-registry": 21
		}],
		20: [function(e, t) {
			var i = e("../tree/expression"),
				n = function(e, t, i, n) {
					this.name = e.toLowerCase(), this.index = i, this.context = t, this.currentFileInfo = n, this.func = t.frames[0].functionRegistry.get(this.name)
				};
			n.prototype.isValid = function() {
				return Boolean(this.func)
			}, n.prototype.call = function(e) {
				return Array.isArray(e) && (e = e.filter(function(e) {
					return "Comment" !== e.type
				}).map(function(e) {
					if ("Expression" === e.type) {
						var t = e.value.filter(function(e) {
							return "Comment" !== e.type
						});
						return 1 === t.length ? t[0] : new i(t)
					}
					return e
				})), this.func.apply(this, e)
			}, t.exports = n
		}, {
			"../tree/expression": 58
		}],
		21: [function(e, t) {
			function i(e) {
				return {
					_data: {},
					add: function(e, t) {
						e = e.toLowerCase(), this._data.hasOwnProperty(e), this._data[e] = t
					},
					addMultiple: function(e) {
						Object.keys(e).forEach(function(t) {
							this.add(t, e[t])
						}.bind(this))
					},
					get: function(t) {
						return this._data[t] || e && e.get(t)
					},
					inherit: function() {
						return i(this)
					}
				}
			}
			t.exports = i(null)
		}, {}],
		22: [function(e, t) {
			t.exports = function(t) {
				var i = {
					functionRegistry: e("./function-registry"),
					functionCaller: e("./function-caller")
				};
				return e("./default"), e("./color"), e("./color-blending"), e("./data-uri")(t), e("./math"), e("./number"), e("./string"), e("./svg")(t), e("./types"), i
			}
		}, {
			"./color": 17,
			"./color-blending": 16,
			"./data-uri": 18,
			"./default": 19,
			"./function-caller": 20,
			"./function-registry": 21,
			"./math": 24,
			"./number": 25,
			"./string": 26,
			"./svg": 27,
			"./types": 28
		}],
		23: [function(e, t) {
			var i = e("../tree/dimension"),
				n = function() {};
			n._math = function(e, t, n) {
				if (!(n instanceof i)) throw {
					type: "Argument",
					message: "argument must be a number"
				};
				return null == t ? t = n.unit : n = n.unify(), new i(e(parseFloat(n.value)), t)
			}, t.exports = n
		}, {
			"../tree/dimension": 55
		}],
		24: [function(e) {
			var t = e("./function-registry"),
				i = e("./math-helper.js"),
				n = {
					ceil: null,
					floor: null,
					sqrt: null,
					abs: null,
					tan: "",
					sin: "",
					cos: "",
					atan: "rad",
					asin: "rad",
					acos: "rad"
				};
			for (var r in n) n.hasOwnProperty(r) && (n[r] = i._math.bind(null, Math[r], n[r]));
			n.round = function(e, t) {
				var n = "undefined" == typeof t ? 0 : t.value;
				return i._math(function(e) {
					return e.toFixed(n)
				}, null, e)
			}, t.addMultiple(n)
		}, {
			"./function-registry": 21,
			"./math-helper.js": 23
		}],
		25: [function(e) {
			var t = e("../tree/dimension"),
				i = e("../tree/anonymous"),
				n = e("./function-registry"),
				r = e("./math-helper.js"),
				o = function(e, n) {
					switch (n = Array.prototype.slice.call(n), n.length) {
						case 0:
							throw {
								type: "Argument",
								message: "one or more arguments required"
							}
					}
					var r, o, s, a, l, h, c, u, p = [],
						f = {};
					for (r = 0; n.length > r; r++) if (s = n[r], s instanceof t) if (a = "" === s.unit.toString() && void 0 !== u ? new t(s.value, u).unify() : s.unify(), h = "" === a.unit.toString() && void 0 !== c ? c : a.unit.toString(), c = "" !== h && void 0 === c || "" !== h && "" === p[0].unify().unit.toString() ? h : c, u = "" !== h && void 0 === u ? s.unit.toString() : u, o = void 0 !== f[""] && "" !== h && h === c ? f[""] : f[h], void 0 !== o) l = "" === p[o].unit.toString() && void 0 !== u ? new t(p[o].value, u).unify() : p[o].unify(), (e && l.value > a.value || !e && a.value > l.value) && (p[o] = s);
					else {
						if (void 0 !== c && h !== c) throw {
							type: "Argument",
							message: "incompatible types"
						};
						f[h] = p.length, p.push(s)
					} else Array.isArray(n[r].value) && Array.prototype.push.apply(n, Array.prototype.slice.call(n[r].value));
					return 1 == p.length ? p[0] : (n = p.map(function(e) {
						return e.toCSS(this.context)
					}).join(this.context.compress ? "," : ", "), new i((e ? "min" : "max") + "(" + n + ")"))
				};
			n.addMultiple({
				min: function() {
					return o(!0, arguments)
				},
				max: function() {
					return o(!1, arguments)
				},
				convert: function(e, t) {
					return e.convertTo(t.value)
				},
				pi: function() {
					return new t(Math.PI)
				},
				mod: function(e, i) {
					return new t(e.value % i.value, e.unit)
				},
				pow: function(e, i) {
					if ("number" == typeof e && "number" == typeof i) e = new t(e), i = new t(i);
					else if (!(e instanceof t && i instanceof t)) throw {
						type: "Argument",
						message: "arguments must be numbers"
					};
					return new t(Math.pow(e.value, i.value), e.unit)
				},
				percentage: function(e) {
					var t = r._math(function(e) {
						return 100 * e
					}, "%", e);
					return t
				}
			})
		}, {
			"../tree/anonymous": 45,
			"../tree/dimension": 55,
			"./function-registry": 21,
			"./math-helper.js": 23
		}],
		26: [function(e) {
			var t = e("../tree/quoted"),
				i = e("../tree/anonymous"),
				n = e("../tree/javascript"),
				r = e("./function-registry");
			r.addMultiple({
				e: function(e) {
					return new i(e instanceof n ? e.evaluated : e.value)
				},
				escape: function(e) {
					return new i(encodeURI(e.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B").replace(/\(/g, "%28").replace(/\)/g, "%29"))
				},
				replace: function(e, i, n, r) {
					var o = e.value;
					return n = "Quoted" === n.type ? n.value : n.toCSS(), o = o.replace(new RegExp(i.value, r ? r.value : ""), n), new t(e.quote || "", o, e.escaped)
				},
				"%": function(e) {
					for (var i = Array.prototype.slice.call(arguments, 1), n = e.value, r = 0; i.length > r; r++) n = n.replace(/%[sda]/i, function(e) {
						var t = "Quoted" === i[r].type && e.match(/s/i) ? i[r].value : i[r].toCSS();
						return e.match(/[A-Z]$/) ? encodeURIComponent(t) : t
					});
					return n = n.replace(/%%/g, "%"), new t(e.quote || "", n, e.escaped)
				}
			})
		}, {
			"../tree/anonymous": 45,
			"../tree/javascript": 62,
			"../tree/quoted": 72,
			"./function-registry": 21
		}],
		27: [function(e, t) {
			t.exports = function() {
				var t = e("../tree/dimension"),
					i = e("../tree/color"),
					n = e("../tree/expression"),
					r = e("../tree/quoted"),
					o = e("../tree/url"),
					s = e("./function-registry");
				s.add("svg-gradient", function(e) {
					function s() {
						throw {
							type: "Argument",
							message: "svg-gradient expects direction, start_color [start_position], [color position,]..., end_color [end_position] or direction, color list"
						}
					}
					var a, l, h, c, u, p, f, d, m = "linear",
						v = 'x="0" y="0" width="1" height="1"',
						g = {
							compress: !1
						}, y = e.toCSS(g);
					switch (2 == arguments.length ? (arguments[1].value.length < 2 && s(), a = arguments[1].value) : arguments.length < 3 ? s() : a = Array.prototype.slice.call(arguments, 1), y) {
						case "to bottom":
							l = 'x1="0%" y1="0%" x2="0%" y2="100%"';
							break;
						case "to right":
							l = 'x1="0%" y1="0%" x2="100%" y2="0%"';
							break;
						case "to bottom right":
							l = 'x1="0%" y1="0%" x2="100%" y2="100%"';
							break;
						case "to top right":
							l = 'x1="0%" y1="100%" x2="100%" y2="0%"';
							break;
						case "ellipse":
						case "ellipse at center":
							m = "radial", l = 'cx="50%" cy="50%" r="75%"', v = 'x="-50" y="-50" width="101" height="101"';
							break;
						default:
							throw {
								type: "Argument",
								message: "svg-gradient direction must be 'to bottom', 'to right', 'to bottom right', 'to top right' or 'ellipse at center'"
							}
					}
					for (h = '<?xml version="1.0" ?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none"><' + m + 'Gradient id="gradient" gradientUnits="userSpaceOnUse" ' + l + ">", c = 0; a.length > c; c += 1) a[c] instanceof n ? (u = a[c].value[0], p = a[c].value[1]) : (u = a[c], p = void 0), u instanceof i && ((0 === c || c + 1 === a.length) && void 0 === p || p instanceof t) || s(), f = p ? p.toCSS(g) : 0 === c ? "0%" : "100%", d = u.alpha, h += '<stop offset="' + f + '" stop-color="' + u.toRGB() + '"' + (1 > d ? ' stop-opacity="' + d + '"' : "") + "/>";
					return h += "</" + m + "Gradient><rect " + v + ' fill="url(#gradient)" /></svg>', h = encodeURIComponent(h), h = "data:image/svg+xml," + h, new o(new r("'" + h + "'", h, !1, this.index, this.currentFileInfo), this.index, this.currentFileInfo)
				})
			}
		}, {
			"../tree/color": 49,
			"../tree/dimension": 55,
			"../tree/expression": 58,
			"../tree/quoted": 72,
			"../tree/url": 79,
			"./function-registry": 21
		}],
		28: [function(e) {
			var t = e("../tree/keyword"),
				i = e("../tree/detached-ruleset"),
				n = e("../tree/dimension"),
				r = e("../tree/color"),
				o = e("../tree/quoted"),
				s = e("../tree/anonymous"),
				a = e("../tree/url"),
				l = e("../tree/operation"),
				h = e("./function-registry"),
				c = function(e, i) {
					return e instanceof i ? t.True : t.False
				}, u = function(e, i) {
					if (void 0 === i) throw {
						type: "Argument",
						message: "missing the required second argument to isunit."
					};
					if (i = "string" == typeof i.value ? i.value : i, "string" != typeof i) throw {
						type: "Argument",
						message: "Second argument to isunit should be a unit or a string."
					};
					return e instanceof n && e.unit.is(i) ? t.True : t.False
				}, p = function(e) {
					var t = Array.isArray(e.value) ? e.value : Array(e);
					return t
				};
			h.addMultiple({
				isruleset: function(e) {
					return c(e, i)
				},
				iscolor: function(e) {
					return c(e, r)
				},
				isnumber: function(e) {
					return c(e, n)
				},
				isstring: function(e) {
					return c(e, o)
				},
				iskeyword: function(e) {
					return c(e, t)
				},
				isurl: function(e) {
					return c(e, a)
				},
				ispixel: function(e) {
					return u(e, "px")
				},
				ispercentage: function(e) {
					return u(e, "%")
				},
				isem: function(e) {
					return u(e, "em")
				},
				isunit: u,
				unit: function(e, i) {
					if (!(e instanceof n)) throw {
						type: "Argument",
						message: "the first argument to unit must be a number" + (e instanceof l ? ". Have you forgotten parenthesis?" : "")
					};
					return i = i ? i instanceof t ? i.value : i.toCSS() : "", new n(e.value, i)
				},
				"get-unit": function(e) {
					return new s(e.unit)
				},
				extract: function(e, t) {
					return t = t.value - 1, p(e)[t]
				},
				length: function(e) {
					return new n(p(e).length)
				}
			})
		}, {
			"../tree/anonymous": 45,
			"../tree/color": 49,
			"../tree/detached-ruleset": 54,
			"../tree/dimension": 55,
			"../tree/keyword": 64,
			"../tree/operation": 70,
			"../tree/quoted": 72,
			"../tree/url": 79,
			"./function-registry": 21
		}],
		29: [function(e, t) {
			var i = e("./contexts"),
				n = e("./parser/parser"),
				r = e("./plugins/function-importer");
			t.exports = function(e) {
				var t = function(e, t) {
					this.rootFilename = t.filename, this.paths = e.paths || [], this.contents = {}, this.contentsIgnoredChars = {}, this.mime = e.mime, this.error = null, this.context = e, this.queue = [], this.files = {}
				};
				return t.prototype.push = function(t, o, s, a, l) {
					var h = this;
					this.queue.push(t);
					var c = function(e, i, n) {
						h.queue.splice(h.queue.indexOf(t), 1);
						var r = n === h.rootFilename;
						a.optional && e ? l(null, {
							rules: []
						}, !1, null) : (h.files[n] = i, e && !h.error && (h.error = e), l(e, i, r, n))
					}, u = {
						relativeUrls: this.context.relativeUrls,
						entryPath: s.entryPath,
						rootpath: s.rootpath,
						rootFilename: s.rootFilename
					}, p = e.getFileManager(t, s.currentDirectory, this.context, e);
					if (!p) return void c({
						message: "Could not find a file-manager for " + t
					});
					o && (t = p.tryAppendExtension(t, a.plugin ? ".js" : ".less"));
					var f = function(e) {
						var t = e.filename,
							o = e.contents.replace(/^\uFEFF/, "");
						u.currentDirectory = p.getPath(t), u.relativeUrls && (u.rootpath = p.join(h.context.rootpath || "", p.pathDiff(u.currentDirectory, u.entryPath)), !p.isPathAbsolute(u.rootpath) && p.alwaysMakePathsAbsolute() && (u.rootpath = p.join(u.entryPath, u.rootpath))), u.filename = t;
						var l = new i.Parse(h.context);
						l.processImports = !1, h.contents[t] = o, (s.reference || a.reference) && (u.reference = !0), a.plugin ? new r(l, u).eval(o, function(e, i) {
							c(e, i, t)
						}) : a.inline ? c(null, o, t) : new n(l, h, u).parse(o, function(e, i) {
							c(e, i, t)
						})
					}, d = p.loadFile(t, s.currentDirectory, this.context, e, function(e, t) {
						e ? c(e) : f(t)
					});
					d && d.then(f, c)
				}, t
			}
		}, {
			"./contexts": 10,
			"./parser/parser": 37,
			"./plugins/function-importer": 39
		}],
		30: [function(e, t) {
			t.exports = function(t, i) {
				var n, r, o, s, a, l = {
					version: [2, 5, 3],
					data: e("./data"),
					tree: e("./tree"),
					Environment: a = e("./environment/environment"),
					AbstractFileManager: e("./environment/abstract-file-manager"),
					environment: t = new a(t, i),
					visitors: e("./visitors"),
					Parser: e("./parser/parser"),
					functions: e("./functions")(t),
					contexts: e("./contexts"),
					SourceMapOutput: n = e("./source-map-output")(t),
					SourceMapBuilder: r = e("./source-map-builder")(n, t),
					ParseTree: o = e("./parse-tree")(r),
					ImportManager: s = e("./import-manager")(t),
					render: e("./render")(t, o, s),
					parse: e("./parse")(t, o, s),
					LessError: e("./less-error"),
					transformTree: e("./transform-tree"),
					utils: e("./utils"),
					PluginManager: e("./plugin-manager"),
					logger: e("./logger")
				};
				return l
			}
		}, {
			"./contexts": 10,
			"./data": 12,
			"./environment/abstract-file-manager": 14,
			"./environment/environment": 15,
			"./functions": 22,
			"./import-manager": 29,
			"./less-error": 31,
			"./logger": 32,
			"./parse": 34,
			"./parse-tree": 33,
			"./parser/parser": 37,
			"./plugin-manager": 38,
			"./render": 40,
			"./source-map-builder": 41,
			"./source-map-output": 42,
			"./transform-tree": 43,
			"./tree": 61,
			"./utils": 82,
			"./visitors": 86
		}],
		31: [function(e, t) {
			var i = e("./utils"),
				n = t.exports = function(e, t, n) {
					Error.call(this);
					var r = e.filename || n;
					if (t && r) {
						var o = t.contents[r],
							s = i.getLocation(e.index, o),
							a = s.line,
							l = s.column,
							h = e.call && i.getLocation(e.call, o).line,
							c = o.split("\n");
						this.type = e.type || "Syntax", this.filename = r, this.index = e.index, this.line = "number" == typeof a ? a + 1 : null, this.callLine = h + 1, this.callExtract = c[h], this.column = l, this.extract = [c[a - 1], c[a], c[a + 1]]
					}
					this.message = e.message, this.stack = e.stack
				};
			if ("undefined" == typeof Object.create) {
				var r = function() {};
				r.prototype = Error.prototype, n.prototype = new r
			} else n.prototype = Object.create(Error.prototype);
			n.prototype.constructor = n
		}, {
			"./utils": 82
		}],
		32: [function(e, t) {
			t.exports = {
				error: function(e) {
					this._fireEvent("error", e)
				},
				warn: function(e) {
					this._fireEvent("warn", e)
				},
				info: function(e) {
					this._fireEvent("info", e)
				},
				debug: function(e) {
					this._fireEvent("debug", e)
				},
				addListener: function(e) {
					this._listeners.push(e)
				},
				removeListener: function(e) {
					for (var t = 0; this._listeners.length > t; t++) if (this._listeners[t] === e) return void this._listeners.splice(t, 1)
				},
				_fireEvent: function(e, t) {
					for (var i = 0; this._listeners.length > i; i++) {
						var n = this._listeners[i][e];
						n && n(t)
					}
				},
				_listeners: []
			}
		}, {}],
		33: [function(e, t) {
			var i = e("./less-error"),
				n = e("./transform-tree"),
				r = e("./logger");
			t.exports = function(e) {
				var t = function(e, t) {
					this.root = e, this.imports = t
				};
				return t.prototype.toCSS = function(t) {
					var o, s, a = {};
					try {
						o = n(this.root, t)
					} catch (l) {
						throw new i(l, this.imports)
					}
					try {
						var h = Boolean(t.compress);
						h && r.warn("The compress option has been deprecated. We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.");
						var c = {
							compress: h,
							dumpLineNumbers: t.dumpLineNumbers,
							strictUnits: Boolean(t.strictUnits),
							numPrecision: 8
						};
						t.sourceMap ? (s = new e(t.sourceMap), a.css = s.toCSS(o, c, this.imports)) : a.css = o.toCSS(c)
					} catch (l) {
						throw new i(l, this.imports)
					}
					if (t.pluginManager) for (var u = t.pluginManager.getPostProcessors(), p = 0; u.length > p; p++) a.css = u[p].process(a.css, {
						sourceMap: s,
						options: t,
						imports: this.imports
					});
					t.sourceMap && (a.map = s.getExternalSourceMap()), a.imports = [];
					for (var f in this.imports.files) this.imports.files.hasOwnProperty(f) && f !== this.imports.rootFilename && a.imports.push(f);
					return a
				}, t
			}
		}, {
			"./less-error": 31,
			"./logger": 32,
			"./transform-tree": 43
		}],
		34: [function(e, t) {
			var i, n = e("./contexts"),
				r = e("./parser/parser"),
				o = e("./plugin-manager");
			t.exports = function(t, s, a) {
				var l = function(t, s, h) {
					if (s = s || {}, "function" == typeof s && (h = s, s = {}), !h) {
						i || (i = "undefined" == typeof Promise ? e("promise") : Promise);
						var c = this;
						return new i(function(e, i) {
							l.call(c, t, s, function(t, n) {
								t ? i(t) : e(n)
							})
						})
					}
					var u, p, f = new o(this);
					if (f.addPlugins(s.plugins), s.pluginManager = f, u = new n.Parse(s), s.rootFileInfo) p = s.rootFileInfo;
					else {
						var d = s.filename || "input",
							m = d.replace(/[^\/\\]*$/, "");
						p = {
							filename: d,
							relativeUrls: u.relativeUrls,
							rootpath: u.rootpath || "",
							currentDirectory: m,
							entryPath: m,
							rootFilename: d
						}, p.rootpath && "/" !== p.rootpath.slice(-1) && (p.rootpath += "/")
					}
					var v = new a(u, p);
					new r(u, v, p).parse(t, function(e, t) {
						return e ? h(e) : void h(null, t, v, s)
					}, s)
				};
				return l
			}
		}, {
			"./contexts": 10,
			"./parser/parser": 37,
			"./plugin-manager": 38,
			promise: void 0
		}],
		35: [function(e, t) {
			t.exports = function(e, t) {
				function i(t) {
					var i = a - v;
					512 > i && !t || !i || (m.push(e.slice(v, a + 1)), v = a + 1)
				}
				var n, r, o, s, a, l, h, c, u, p = e.length,
					f = 0,
					d = 0,
					m = [],
					v = 0;
				for (a = 0; p > a; a++) if (h = e.charCodeAt(a), !(h >= 97 && 122 >= h || 34 > h)) switch (h) {
					case 40:
						d++, r = a;
						continue;
					case 41:
						if (--d < 0) return t("missing opening `(`", a);
						continue;
					case 59:
						d || i();
						continue;
					case 123:
						f++, n = a;
						continue;
					case 125:
						if (--f < 0) return t("missing opening `{`", a);
						f || d || i();
						continue;
					case 92:
						if (p - 1 > a) {
							a++;
							continue
						}
						return t("unescaped `\\`", a);
					case 34:
					case 39:
					case 96:
						for (u = 0, l = a, a += 1; p > a; a++) if (c = e.charCodeAt(a), !(c > 96)) {
							if (c == h) {
								u = 1;
								break
							}
							if (92 == c) {
								if (a == p - 1) return t("unescaped `\\`", a);
								a++
							}
						}
						if (u) continue;
						return t("unmatched `" + String.fromCharCode(h) + "`", l);
					case 47:
						if (d || a == p - 1) continue;
						if (c = e.charCodeAt(a + 1), 47 == c) for (a += 2; p > a && (c = e.charCodeAt(a), !(13 >= c) || 10 != c && 13 != c); a++);
						else if (42 == c) {
							for (o = l = a, a += 2; p - 1 > a && (c = e.charCodeAt(a), 125 == c && (s = a), 42 != c || 47 != e.charCodeAt(a + 1)); a++);
							if (a == p - 1) return t("missing closing `*/`", l);
							a++
						}
						continue;
					case 42:
						if (p - 1 > a && 47 == e.charCodeAt(a + 1)) return t("unmatched `/*`", a);
						continue
				}
				return 0 !== f ? o > n && s > o ? t("missing closing `}` or `*/`", n) : t("missing closing `}`", n) : 0 !== d ? t("missing closing `)`", r) : (i(!0), m)
			}
		}, {}],
		36: [function(e, t) {
			var i = e("./chunker");
			t.exports = function() {
				var e, t, n, r, o, s, a, l = [],
					h = {};
				h.save = function() {
					a = h.i, l.push({
						current: s,
						i: h.i,
						j: t
					})
				}, h.restore = function(e) {
					(h.i > n || h.i === n && e && !r) && (n = h.i, r = e);
					var i = l.pop();
					s = i.current, a = h.i = i.i, t = i.j
				}, h.forget = function() {
					l.pop()
				}, h.isWhitespace = function(t) {
					var i = h.i + (t || 0),
						n = e.charCodeAt(i);
					return n === c || n === f || n === u || n === p
				}, h.$re = function(e) {
					h.i > a && (s = s.slice(h.i - a), a = h.i);
					var t = e.exec(s);
					return t ? (y(t[0].length), "string" == typeof t ? t : 1 === t.length ? t[0] : t) : null
				}, h.$char = function(t) {
					return e.charAt(h.i) !== t ? null : (y(1), t)
				}, h.$str = function(t) {
					for (var i = t.length, n = 0; i > n; n++) if (e.charAt(h.i + n) !== t.charAt(n)) return null;
					return y(i), t
				}, h.$quoted = function() {
					var t = e.charAt(h.i);
					if ("'" === t || '"' === t) {
						for (var i = e.length, n = h.i, r = 1; i > r + n; r++) {
							var o = e.charAt(r + n);
							switch (o) {
								case "\\":
									r++;
									continue;
								case "\r":
								case "\n":
									break;
								case t:
									var s = e.substr(n, r + 1);
									return y(r + 1), s
							}
						}
						return null
					}
				};
				var c = 32,
					u = 9,
					p = 10,
					f = 13,
					d = 43,
					m = 44,
					v = 47,
					g = 57;
				h.autoCommentAbsorb = !0, h.commentStore = [], h.finished = !1;
				var y = function(i) {
					for (var n, r, l, d = h.i, m = t, g = h.i - a, b = h.i + s.length - g, w = h.i += i, x = e; b > h.i; h.i++) {
						if (n = x.charCodeAt(h.i), h.autoCommentAbsorb && n === v) {
							if (r = x.charAt(h.i + 1), "/" === r) {
								l = {
									index: h.i,
									isLineComment: !0
								};
								var S = x.indexOf("\n", h.i + 2);
								0 > S && (S = b), h.i = S, l.text = x.substr(l.i, h.i - l.i), h.commentStore.push(l);
								continue
							}
							if ("*" === r) {
								var C = x.indexOf("*/", h.i + 2);
								if (C >= 0) {
									l = {
										index: h.i,
										text: x.substr(h.i, C + 2 - h.i),
										isLineComment: !1
									}, h.i += l.text.length - 1, h.commentStore.push(l);
									continue
								}
							}
							break
						}
						if (n !== c && n !== p && n !== u && n !== f) break
					}
					if (s = s.slice(i + h.i - w + g), a = h.i, !s.length) {
						if (o.length - 1 > t) return s = o[++t], y(0), !0;
						h.finished = !0
					}
					return d !== h.i || m !== t
				};
				return h.peek = function(t) {
					if ("string" == typeof t) {
						for (var i = 0; t.length > i; i++) if (e.charAt(h.i + i) !== t.charAt(i)) return !1;
						return !0
					}
					return t.test(s)
				}, h.peekChar = function(t) {
					return e.charAt(h.i) === t
				}, h.currentChar = function() {
					return e.charAt(h.i)
				}, h.getInput = function() {
					return e
				}, h.peekNotNumeric = function() {
					var t = e.charCodeAt(h.i);
					return t > g || d > t || t === v || t === m
				}, h.start = function(r, l, c) {
					e = r, h.i = t = a = n = 0, o = l ? i(r, c) : [r], s = o[0], y(0)
				}, h.end = function() {
					var t, i = h.i >= e.length;
					return n > h.i && (t = r, h.i = n), {
						isFinished: i,
						furthest: h.i,
						furthestPossibleErrorMessage: t,
						furthestReachedEnd: h.i >= e.length - 1,
						furthestChar: e[h.i]
					}
				}, h
			}
		}, {
			"./chunker": 35
		}],
		37: [function(e, t) {
			var i = e("../less-error"),
				n = e("../tree"),
				r = e("../visitors"),
				o = e("./parser-input"),
				s = e("../utils"),
				a = function l(e, t, a) {
					function h(e, t) {
						var i = "[object Function]" === Object.prototype.toString.call(e) ? e.call(f) : d.$re(e);
						return i ? i : void u(t || ("string" == typeof e ? "expected '" + e + "' got '" + d.currentChar() + "'" : "unexpected token"))
					}
					function c(e, t) {
						return d.$char(e) ? e : void u(t || "expected '" + e + "' got '" + d.currentChar() + "'")
					}
					function u(e, n) {
						throw new i({
							index: d.i,
							filename: a.filename,
							type: n || "Syntax",
							message: e
						}, t)
					}
					function p(e) {
						var t = a.filename;
						return {
							lineNumber: s.getLocation(e, d.getInput()).line + 1,
							fileName: t
						}
					}
					var f, d = o();
					return {
						parse: function(o, s, h) {
							var c, u, p, f, m = null,
								v = "";
							if (u = h && h.globalVars ? l.serializeVars(h.globalVars) + "\n" : "", p = h && h.modifyVars ? "\n" + l.serializeVars(h.modifyVars) : "", e.pluginManager) for (var g = e.pluginManager.getPreProcessors(), y = 0; g.length > y; y++) o = g[y].process(o, {
								context: e,
								imports: t,
								fileInfo: a
							});
							(u || h && h.banner) && (v = (h && h.banner ? h.banner : "") + u, f = t.contentsIgnoredChars, f[a.filename] = f[a.filename] || 0, f[a.filename] += v.length), o = o.replace(/\r\n?/g, "\n"), o = v + o.replace(/^\uFEFF/, "") + p, t.contents[a.filename] = o;
							try {
								d.start(o, e.chunkInput, function(e, n) {
									throw new i({
										index: n,
										type: "Parse",
										message: e,
										filename: a.filename
									}, t)
								}), c = new n.Ruleset(null, this.parsers.primary()), c.root = !0, c.firstRoot = !0
							} catch (b) {
								return s(new i(b, t, a.filename))
							}
							var w = d.end();
							if (!w.isFinished) {
								var x = w.furthestPossibleErrorMessage;
								x || (x = "Unrecognised input", "}" === w.furthestChar ? x += ". Possibly missing opening '{'" : ")" === w.furthestChar ? x += ". Possibly missing opening '('" : w.furthestReachedEnd && (x += ". Possibly missing something")), m = new i({
									type: "Parse",
									message: x,
									index: w.furthest,
									filename: a.filename
								}, t)
							}
							var S = function(e) {
								return e = m || e || t.error, e ? (e instanceof i || (e = new i(e, t, a.filename)), s(e)) : s(null, c)
							};
							return e.processImports === !1 ? S() : void new r.ImportVisitor(t, S).run(c)
						},
						parsers: f = {
							primary: function() {
								for (var e, t = this.mixin, i = [];;) {
									for (; e = this.comment(), e;) i.push(e);
									if (d.finished) break;
									if (d.peek("}")) break;
									if (e = this.extendRule()) i = i.concat(e);
									else if (e = t.definition() || this.rule() || this.ruleset() || t.call() || this.rulesetCall() || this.directive()) i.push(e);
									else {
										for (var n = !1; d.$char(";");) n = !0;
										if (!n) break
									}
								}
								return i
							},
							comment: function() {
								if (d.commentStore.length) {
									var e = d.commentStore.shift();
									return new n.Comment(e.text, e.isLineComment, e.index, a)
								}
							},
							entities: {
								quoted: function() {
									var e, t = d.i,
										i = !1;
									return d.save(), d.$char("~") && (i = !0), (e = d.$quoted()) ? (d.forget(), new n.Quoted(e.charAt(0), e.substr(1, e.length - 2), i, t, a)) : void d.restore()
								},
								keyword: function() {
									var e = d.$char("%") || d.$re(/^[_A-Za-z-][_A-Za-z0-9-]*/);
									return e ? n.Color.fromKeyword(e) || new n.Keyword(e) : void 0
								},
								call: function() {
									var e, t, i, r, o = d.i;
									return d.peek(/^url\(/i) ? void 0 : (d.save(), (e = d.$re(/^([\w-]+|%|progid:[\w\.]+)\(/)) ? (e = e[1], t = e.toLowerCase(), "alpha" === t && (r = f.alpha()) ? (d.forget(), r) : (i = this.arguments(), d.$char(")") ? (d.forget(), new n.Call(e, i, o, a)) : void d.restore("Could not parse call arguments or missing ')'"))) : void d.forget())
								},
								arguments: function() {
									for (var e, t = [];
									(e = this.assignment() || f.expression(), e) && (t.push(e), d.$char(",")););
									return t
								},
								literal: function() {
									return this.dimension() || this.color() || this.quoted() || this.unicodeDescriptor()
								},
								assignment: function() {
									var e, t;
									return d.save(), (e = d.$re(/^\w+(?=\s?=)/i)) && d.$char("=") && (t = f.entity()) ? (d.forget(), new n.Assignment(e, t)) : void d.restore()
								},
								url: function() {
									var e, t = d.i;
									return d.autoCommentAbsorb = !1, d.$str("url(") ? (e = this.quoted() || this.variable() || d.$re(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || "", d.autoCommentAbsorb = !0, c(")"), new n.URL(null != e.value || e instanceof n.Variable ? e : new n.Anonymous(e), t, a)) : void(d.autoCommentAbsorb = !0)
								},
								variable: function() {
									var e, t = d.i;
									return "@" === d.currentChar() && (e = d.$re(/^@@?[\w-]+/)) ? new n.Variable(e, t, a) : void 0
								},
								variableCurly: function() {
									var e, t = d.i;
									return "@" === d.currentChar() && (e = d.$re(/^@\{([\w-]+)\}/)) ? new n.Variable("@" + e[1], t, a) : void 0
								},
								color: function() {
									var e;
									if ("#" === d.currentChar() && (e = d.$re(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))) {
										var t = e.input.match(/^#([\w]+).*/);
										return t = t[1], t.match(/^[A-Fa-f0-9]+$/) || u("Invalid HEX color code"), new n.Color(e[1], void 0, "#" + t)
									}
								},
								dimension: function() {
									if (!d.peekNotNumeric()) {
										var e = d.$re(/^([+-]?\d*\.?\d+)(%|[a-z]+)?/i);
										return e ? new n.Dimension(e[1], e[2]) : void 0
									}
								},
								unicodeDescriptor: function() {
									var e;
									return e = d.$re(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/), e ? new n.UnicodeDescriptor(e[0]) : void 0
								},
								javascript: function() {
									var e, t = d.i;
									d.save();
									var i = d.$char("~"),
										r = d.$char("`");
									return r ? (e = d.$re(/^[^`]*`/)) ? (d.forget(), new n.JavaScript(e.substr(0, e.length - 1), Boolean(i), t, a)) : void d.restore("invalid javascript definition") : void d.restore()
								}
							},
							variable: function() {
								var e;
								return "@" === d.currentChar() && (e = d.$re(/^(@[\w-]+)\s*:/)) ? e[1] : void 0
							},
							rulesetCall: function() {
								var e;
								return "@" === d.currentChar() && (e = d.$re(/^(@[\w-]+)\s*\(\s*\)\s*;/)) ? new n.RulesetCall(e[1]) : void 0
							},
							extend: function(e) {
								var t, i, r, o, s, a = d.i;
								if (d.$str(e ? "&:extend(" : ":extend(")) {
									do {
										for (r = null, t = null; !(r = d.$re(/^(all)(?=\s*(\)|,))/)) && (i = this.element());) t ? t.push(i) : t = [i];
										r = r && r[1], t || u("Missing target selector for :extend()."), s = new n.Extend(new n.Selector(t), r, a), o ? o.push(s) : o = [s]
									} while (d.$char(","));
									return h(/^\)/), e && h(/^;/), o
								}
							},
							extendRule: function() {
								return this.extend(!0)
							},
							mixin: {
								call: function() {
									var e, t, i, r, o, s, l = d.currentChar(),
										h = !1,
										u = d.i;
									if ("." === l || "#" === l) {
										for (d.save(); e = d.i, r = d.$re(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/), r;) i = new n.Element(o, r, e, a), t ? t.push(i) : t = [i], o = d.$char(">");
										return t && (d.$char("(") && (s = this.args(!0).args, c(")")), f.important() && (h = !0), f.end()) ? (d.forget(), new n.mixin.Call(t, s, u, a, h)) : void d.restore()
									}
								},
								args: function(e) {
									var t, i, r, o, s, a, l, h = f.entities,
										c = {
											args: null,
											variadic: !1
										}, p = [],
										m = [],
										v = [];
									for (d.save();;) {
										if (e) a = f.detachedRuleset() || f.expression();
										else {
											if (d.commentStore.length = 0, d.$str("...")) {
												c.variadic = !0, d.$char(";") && !t && (t = !0), (t ? m : v).push({
													variadic: !0
												});
												break
											}
											a = h.variable() || h.literal() || h.keyword()
										}
										if (!a) break;
										o = null, a.throwAwayComments && a.throwAwayComments(), s = a;
										var g = null;
										if (e ? a.value && 1 == a.value.length && (g = a.value[0]) : g = a, g && g instanceof n.Variable) if (d.$char(":")) {
											if (p.length > 0 && (t && u("Cannot mix ; and , as delimiter types"), i = !0), s = f.detachedRuleset() || f.expression(), !s) {
												if (!e) return d.restore(), c.args = [], c;
												u("could not understand value for named argument")
											}
											o = r = g.name
										} else if (d.$str("...")) {
											if (!e) {
												c.variadic = !0, d.$char(";") && !t && (t = !0), (t ? m : v).push({
													name: a.name,
													variadic: !0
												});
												break
											}
											l = !0
										} else e || (r = o = g.name, s = null);
										s && p.push(s), v.push({
											name: o,
											value: s,
											expand: l
										}), d.$char(",") || (d.$char(";") || t) && (i && u("Cannot mix ; and , as delimiter types"), t = !0, p.length > 1 && (s = new n.Value(p)), m.push({
											name: r,
											value: s,
											expand: l
										}), r = null, p = [], i = !1)
									}
									return d.forget(), c.args = t ? m : v, c
								},
								definition: function() {
									var e, t, i, r, o = [],
										s = !1;
									if (!("." !== d.currentChar() && "#" !== d.currentChar() || d.peek(/^[^{]*\}/))) if (d.save(), t = d.$re(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/)) {
										e = t[1];
										var a = this.args(!1);
										if (o = a.args, s = a.variadic, !d.$char(")")) return void d.restore("Missing closing ')'");
										if (d.commentStore.length = 0, d.$str("when") && (r = h(f.conditions, "expected condition")), i = f.block()) return d.forget(), new n.mixin.Definition(e, o, i, r, s);
										d.restore()
									} else d.forget()
								}
							},
							entity: function() {
								var e = this.entities;
								return this.comment() || e.literal() || e.variable() || e.url() || e.call() || e.keyword() || e.javascript()
							},
							end: function() {
								return d.$char(";") || d.peek("}")
							},
							alpha: function() {
								var e;
								return d.$re(/^opacity=/i) ? (e = d.$re(/^\d+/), e || (e = h(this.entities.variable, "Could not parse alpha")), c(")"), new n.Alpha(e)) : void 0
							},
							element: function() {
								var e, t, i, r = d.i;
								return t = this.combinator(), e = d.$re(/^(?:\d+\.\d+|\d+)%/) || d.$re(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) || d.$char("*") || d.$char("&") || this.attribute() || d.$re(/^\([^&()@]+\)/) || d.$re(/^[\.#:](?=@)/) || this.entities.variableCurly(), e || (d.save(), d.$char("(") ? (i = this.selector()) && d.$char(")") ? (e = new n.Paren(i), d.forget()) : d.restore("Missing closing ')'") : d.forget()), e ? new n.Element(t, e, r, a) : void 0
							},
							combinator: function() {
								var e = d.currentChar();
								if ("/" === e) {
									d.save();
									var t = d.$re(/^\/[a-z]+\//i);
									if (t) return d.forget(), new n.Combinator(t);
									d.restore()
								}
								if (">" === e || "+" === e || "~" === e || "|" === e || "^" === e) {
									for (d.i++, "^" === e && "^" === d.currentChar() && (e = "^^", d.i++); d.isWhitespace();) d.i++;
									return new n.Combinator(e)
								}
								return new n.Combinator(d.isWhitespace(-1) ? " " : null)
							},
							lessSelector: function() {
								return this.selector(!0)
							},
							selector: function(e) {
								for (var t, i, r, o, s, l, c, p = d.i;
								(e && (i = this.extend()) || e && (l = d.$str("when")) || (o = this.element())) && (l ? c = h(this.conditions, "expected condition") : c ? u("CSS guard can only be used at the end of selector") : i ? s = s ? s.concat(i) : i : (s && u("Extend can only be used at the end of selector"), r = d.currentChar(), t ? t.push(o) : t = [o], o = null), "{" !== r && "}" !== r && ";" !== r && "," !== r && ")" !== r););
								return t ? new n.Selector(t, s, c, p, a) : void(s && u("Extend must be used to extend a selector, it cannot be used on its own"))
							},
							attribute: function() {
								if (d.$char("[")) {
									var e, t, i, r = this.entities;
									return (e = r.variableCurly()) || (e = h(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/)), i = d.$re(/^[|~*$^]?=/), i && (t = r.quoted() || d.$re(/^[0-9]+%/) || d.$re(/^[\w-]+/) || r.variableCurly()), c("]"), new n.Attribute(e, i, t)
								}
							},
							block: function() {
								var e;
								return d.$char("{") && (e = this.primary()) && d.$char("}") ? e : void 0
							},
							blockRuleset: function() {
								var e = this.block();
								return e && (e = new n.Ruleset(null, e)), e
							},
							detachedRuleset: function() {
								var e = this.blockRuleset();
								return e ? new n.DetachedRuleset(e) : void 0
							},
							ruleset: function() {
								var t, i, r, o;
								for (d.save(), e.dumpLineNumbers && (o = p(d.i));
								(i = this.lessSelector(), i) && (t ? t.push(i) : t = [i], d.commentStore.length = 0, i.condition && t.length > 1 && u("Guards are only currently allowed on a single selector."), d.$char(","));) i.condition && u("Guards are only currently allowed on a single selector."), d.commentStore.length = 0;
								if (t && (r = this.block())) {
									d.forget();
									var s = new n.Ruleset(t, r, e.strictImports);
									return e.dumpLineNumbers && (s.debugInfo = o), s
								}
								d.restore()
							},
							rule: function(t) {
								var i, r, o, s, l, h = d.i,
									c = d.currentChar();
								if ("." !== c && "#" !== c && "&" !== c && ":" !== c) if (d.save(), i = this.variable() || this.ruleProperty()) {
									if (l = "string" == typeof i, l && (r = this.detachedRuleset()), d.commentStore.length = 0, !r) {
										s = !l && i.length > 1 && i.pop().value;
										var u = !t && (e.compress || l);
										if (u && (r = this.value()), !r && (r = this.anonymousValue())) return d.forget(),
										new n.Rule(i, r, !1, s, h, a);
										u || r || (r = this.value()), o = this.important()
									}
									if (r && this.end()) return d.forget(), new n.Rule(i, r, o, s, h, a);
									if (d.restore(), r && !t) return this.rule(!0)
								} else d.forget()
							},
							anonymousValue: function() {
								var e = d.$re(/^([^@+\/'"*`(;{}-]*);/);
								return e ? new n.Anonymous(e[1]) : void 0
							},
							"import": function() {
								var e, t, i = d.i,
									r = d.$re(/^@import?\s+/);
								if (r) {
									var o = (r ? this.importOptions() : null) || {};
									if (e = this.entities.quoted() || this.entities.url()) return t = this.mediaFeatures(), d.$char(";") || (d.i = i, u("missing semi-colon or unrecognised media features on import")), t = t && new n.Value(t), new n.Import(e, t, o, i, a);
									d.i = i, u("malformed import statement")
								}
							},
							importOptions: function() {
								var e, t, i, n = {};
								if (!d.$char("(")) return null;
								do if (e = this.importOption()) {
									switch (t = e, i = !0, t) {
										case "css":
											t = "less", i = !1;
											break;
										case "once":
											t = "multiple", i = !1
									}
									if (n[t] = i, !d.$char(",")) break
								}
								while (e);
								return c(")"), n
							},
							importOption: function() {
								var e = d.$re(/^(less|css|multiple|once|inline|reference|optional)/);
								return e ? e[1] : void 0
							},
							mediaFeature: function() {
								var e, t, i = this.entities,
									r = [];
								d.save();
								do if (e = i.keyword() || i.variable()) r.push(e);
								else if (d.$char("(")) {
									if (t = this.property(), e = this.value(), !d.$char(")")) return d.restore("Missing closing ')'"), null;
									if (t && e) r.push(new n.Paren(new n.Rule(t, e, null, null, d.i, a, !0)));
									else {
										if (!e) return d.restore("badly formed media feature definition"), null;
										r.push(new n.Paren(e))
									}
								}
								while (e);
								return d.forget(), r.length > 0 ? new n.Expression(r) : void 0
							},
							mediaFeatures: function() {
								var e, t = this.entities,
									i = [];
								do if (e = this.mediaFeature()) {
									if (i.push(e), !d.$char(",")) break
								} else if (e = t.variable(), e && (i.push(e), !d.$char(","))) break;
								while (e);
								return i.length > 0 ? i : null
							},
							media: function() {
								var t, i, r, o;
								return e.dumpLineNumbers && (o = p(d.i)), d.save(), d.$str("@media") ? (t = this.mediaFeatures(), (i = this.block()) ? (d.forget(), r = new n.Media(i, t, d.i, a), e.dumpLineNumbers && (r.debugInfo = o), r) : void d.restore("media definitions require block statements after any features")) : void d.restore()
							},
							plugin: function() {
								var e, t = d.i,
									i = d.$re(/^@plugin?\s+/);
								if (i) {
									var r = {
										plugin: !0
									};
									if (e = this.entities.quoted() || this.entities.url()) return d.$char(";") || (d.i = t, u("missing semi-colon on plugin")), new n.Import(e, null, r, t, a);
									d.i = t, u("malformed plugin statement")
								}
							},
							directive: function() {
								var t, i, r, o, s, l, h, c = d.i,
									f = !0,
									m = !0;
								if ("@" === d.currentChar()) {
									if (i = this["import"]() || this.plugin() || this.media()) return i;
									if (d.save(), t = d.$re(/^@[a-z-]+/)) {
										switch (o = t, "-" == t.charAt(1) && t.indexOf("-", 2) > 0 && (o = "@" + t.slice(t.indexOf("-", 2) + 1)), o) {
											case "@counter-style":
												s = !0, f = !0;
												break;
											case "@charset":
												s = !0, f = !1;
												break;
											case "@namespace":
												l = !0, f = !1;
												break;
											case "@keyframes":
												s = !0;
												break;
											case "@host":
											case "@page":
												h = !0;
												break;
											case "@document":
											case "@supports":
												h = !0, m = !1
										}
										return d.commentStore.length = 0, s ? (i = this.entity(), i || u("expected " + t + " identifier")) : l ? (i = this.expression(), i || u("expected " + t + " expression")) : h && (i = (d.$re(/^[^{;]+/) || "").trim(), i && (i = new n.Anonymous(i))), f && (r = this.blockRuleset()), r || !f && i && d.$char(";") ? (d.forget(), new n.Directive(t, i, r, c, a, e.dumpLineNumbers ? p(c) : null, !1, m)) : void d.restore("directive options not recognised")
									}
								}
							},
							value: function() {
								var e, t = [];
								do if (e = this.expression(), e && (t.push(e), !d.$char(","))) break;
								while (e);
								return t.length > 0 ? new n.Value(t) : void 0
							},
							important: function() {
								return "!" === d.currentChar() ? d.$re(/^! *important/) : void 0
							},
							sub: function() {
								var e, t;
								return d.save(), d.$char("(") ? (e = this.addition(), e && d.$char(")") ? (d.forget(), t = new n.Expression([e]), t.parens = !0, t) : void d.restore("Expected ')'")) : void d.restore()
							},
							multiplication: function() {
								var e, t, i, r, o;
								if (e = this.operand()) {
									for (o = d.isWhitespace(-1); !d.peek(/^\/[*\/]/);) {
										if (d.save(), i = d.$char("/") || d.$char("*"), !i) {
											d.forget();
											break
										}
										if (t = this.operand(), !t) {
											d.restore();
											break
										}
										d.forget(), e.parensInOp = !0, t.parensInOp = !0, r = new n.Operation(i, [r || e, t], o), o = d.isWhitespace(-1)
									}
									return r || e
								}
							},
							addition: function() {
								var e, t, i, r, o;
								if (e = this.multiplication()) {
									for (o = d.isWhitespace(-1);
									(i = d.$re(/^[-+]\s+/) || !o && (d.$char("+") || d.$char("-")), i) && (t = this.multiplication(), t);) e.parensInOp = !0, t.parensInOp = !0, r = new n.Operation(i, [r || e, t], o), o = d.isWhitespace(-1);
									return r || e
								}
							},
							conditions: function() {
								var e, t, i, r = d.i;
								if (e = this.condition()) {
									for (; d.peek(/^,\s*(not\s*)?\(/) && d.$char(",") && (t = this.condition(), t);) i = new n.Condition("or", i || e, t, r);
									return i || e
								}
							},
							condition: function() {
								var e, t, i, r, o = this.entities,
									s = d.i,
									a = !1;
								return d.$str("not") && (a = !0), c("("), e = this.addition() || o.keyword() || o.quoted(), e ? (d.$char(">") ? r = d.$char("=") ? ">=" : ">" : d.$char("<") ? r = d.$char("=") ? "<=" : "<" : d.$char("=") && (r = d.$char(">") ? "=>" : d.$char("<") ? "=<" : "="), r ? (t = this.addition() || o.keyword() || o.quoted(), t ? i = new n.Condition(r, e, t, s, a) : u("expected expression")) : i = new n.Condition("=", e, new n.Keyword("true"), s, a), c(")"), d.$str("and") ? new n.Condition("and", i, this.condition()) : i) : void 0
							},
							operand: function() {
								var e, t = this.entities;
								d.peek(/^-[@\(]/) && (e = d.$char("-"));
								var i = this.sub() || t.dimension() || t.color() || t.variable() || t.call();
								return e && (i.parensInOp = !0, i = new n.Negative(i)), i
							},
							expression: function() {
								var e, t, i = [];
								do e = this.comment(), e ? i.push(e) : (e = this.addition() || this.entity(), e && (i.push(e), d.peek(/^\/[\/*]/) || (t = d.$char("/"), t && i.push(new n.Anonymous(t)))));
								while (e);
								return i.length > 0 ? new n.Expression(i) : void 0
							},
							property: function() {
								var e = d.$re(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/);
								return e ? e[1] : void 0
							},
							ruleProperty: function() {
								function e(e) {
									var t = d.i,
										i = d.$re(e);
									return i ? (o.push(t), r.push(i[1])) : void 0
								}
								var t, i, r = [],
									o = [];
								d.save();
								var s = d.$re(/^([_a-zA-Z0-9-]+)\s*:/);
								if (s) return r = [new n.Keyword(s[1])], d.forget(), r;
								for (e(/^(\*?)/); e(/^((?:[\w-]+)|(?:@\{[\w-]+\}))/););
								if (r.length > 1 && e(/^((?:\+_|\+)?)\s*:/)) {
									for (d.forget(), "" === r[0] && (r.shift(), o.shift()), i = 0; r.length > i; i++) t = r[i], r[i] = "@" !== t.charAt(0) ? new n.Keyword(t) : new n.Variable("@" + t.slice(2, -1), o[i], a);
									return r
								}
								d.restore()
							}
						}
					}
				};
			a.serializeVars = function(e) {
				var t = "";
				for (var i in e) if (Object.hasOwnProperty.call(e, i)) {
					var n = e[i];
					t += ("@" === i[0] ? "" : "@") + i + ": " + n + (";" === String(n).slice(-1) ? "" : ";")
				}
				return t
			}, t.exports = a
		}, {
			"../less-error": 31,
			"../tree": 61,
			"../utils": 82,
			"../visitors": 86,
			"./parser-input": 36
		}],
		38: [function(e, t) {
			var i = function(e) {
				this.less = e, this.visitors = [], this.preProcessors = [], this.postProcessors = [], this.installedPlugins = [], this.fileManagers = []
			};
			i.prototype.addPlugins = function(e) {
				if (e) for (var t = 0; e.length > t; t++) this.addPlugin(e[t])
			}, i.prototype.addPlugin = function(e) {
				this.installedPlugins.push(e), e.install(this.less, this)
			}, i.prototype.addVisitor = function(e) {
				this.visitors.push(e)
			}, i.prototype.addPreProcessor = function(e, t) {
				var i;
				for (i = 0; this.preProcessors.length > i && !(this.preProcessors[i].priority >= t); i++);
				this.preProcessors.splice(i, 0, {
					preProcessor: e,
					priority: t
				})
			}, i.prototype.addPostProcessor = function(e, t) {
				var i;
				for (i = 0; this.postProcessors.length > i && !(this.postProcessors[i].priority >= t); i++);
				this.postProcessors.splice(i, 0, {
					postProcessor: e,
					priority: t
				})
			}, i.prototype.addFileManager = function(e) {
				this.fileManagers.push(e)
			}, i.prototype.getPreProcessors = function() {
				for (var e = [], t = 0; this.preProcessors.length > t; t++) e.push(this.preProcessors[t].preProcessor);
				return e
			}, i.prototype.getPostProcessors = function() {
				for (var e = [], t = 0; this.postProcessors.length > t; t++) e.push(this.postProcessors[t].postProcessor);
				return e
			}, i.prototype.getVisitors = function() {
				return this.visitors
			}, i.prototype.getFileManagers = function() {
				return this.fileManagers
			}, t.exports = i
		}, {}],
		39: [function(e, t) {
			var i = e("../less-error"),
				n = e("../tree"),
				r = t.exports = function(e, t) {
					this.fileInfo = t
				};
			r.prototype.eval = function(e, t) {
				var r, o, s = {};
				o = {
					add: function(e, t) {
						s[e] = t
					},
					addMultiple: function(e) {
						Object.keys(e).forEach(function(t) {
							s[t] = e[t]
						})
					}
				};
				try {
					(r = new Function("functions", "tree", "fileInfo", e))(o, n, this.fileInfo)
				} catch (a) {
					t(new i({
						message: "Plugin evaluation error: '" + a.name + ": " + a.message.replace(/["]/g, "'") + "'",
						filename: this.fileInfo.filename
					}), null)
				}
				t(null, {
					functions: s
				})
			}
		}, {
			"../less-error": 31,
			"../tree": 61
		}],
		40: [function(e, t) {
			var i;
			t.exports = function(t, n) {
				var r = function(t, o, s) {
					if ("function" == typeof o && (s = o, o = {}), !s) {
						i || (i = "undefined" == typeof Promise ? e("promise") : Promise);
						var a = this;
						return new i(function(e, i) {
							r.call(a, t, o, function(t, n) {
								t ? i(t) : e(n)
							})
						})
					}
					this.parse(t, o, function(e, t, i, r) {
						if (e) return s(e);
						var o;
						try {
							var a = new n(t, i);
							o = a.toCSS(r)
						} catch (e) {
							return s(e)
						}
						s(null, o)
					})
				};
				return r
			}
		}, {
			promise: void 0
		}],
		41: [function(e, t) {
			t.exports = function(e, t) {
				var i = function(e) {
					this.options = e
				};
				return i.prototype.toCSS = function(t, i, n) {
					var r = new e({
						contentsIgnoredCharsMap: n.contentsIgnoredChars,
						rootNode: t,
						contentsMap: n.contents,
						sourceMapFilename: this.options.sourceMapFilename,
						sourceMapURL: this.options.sourceMapURL,
						outputFilename: this.options.sourceMapOutputFilename,
						sourceMapBasepath: this.options.sourceMapBasepath,
						sourceMapRootpath: this.options.sourceMapRootpath,
						outputSourceFiles: this.options.outputSourceFiles,
						sourceMapGenerator: this.options.sourceMapGenerator,
						sourceMapFileInline: this.options.sourceMapFileInline
					}),
						o = r.toCSS(i);
					return this.sourceMap = r.sourceMap, this.sourceMapURL = r.sourceMapURL, this.options.sourceMapInputFilename && (this.sourceMapInputFilename = r.normalizeFilename(this.options.sourceMapInputFilename)), o + this.getCSSAppendage()
				}, i.prototype.getCSSAppendage = function() {
					var e = this.sourceMapURL;
					if (this.options.sourceMapFileInline) {
						if (void 0 === this.sourceMap) return "";
						e = "data:application/json;base64," + t.encodeBase64(this.sourceMap)
					}
					return e ? "/*# sourceMappingURL=" + e + " */" : ""
				}, i.prototype.getExternalSourceMap = function() {
					return this.sourceMap
				}, i.prototype.setExternalSourceMap = function(e) {
					this.sourceMap = e
				}, i.prototype.isInline = function() {
					return this.options.sourceMapFileInline
				}, i.prototype.getSourceMapURL = function() {
					return this.sourceMapURL
				}, i.prototype.getOutputFilename = function() {
					return this.options.sourceMapOutputFilename
				}, i.prototype.getInputFilename = function() {
					return this.sourceMapInputFilename
				}, i
			}
		}, {}],
		42: [function(e, t) {
			t.exports = function(e) {
				var t = function(t) {
					this._css = [], this._rootNode = t.rootNode, this._contentsMap = t.contentsMap, this._contentsIgnoredCharsMap = t.contentsIgnoredCharsMap, t.sourceMapFilename && (this._sourceMapFilename = t.sourceMapFilename.replace(/\\/g, "/")), this._outputFilename = t.outputFilename, this.sourceMapURL = t.sourceMapURL, t.sourceMapBasepath && (this._sourceMapBasepath = t.sourceMapBasepath.replace(/\\/g, "/")), t.sourceMapRootpath ? (this._sourceMapRootpath = t.sourceMapRootpath.replace(/\\/g, "/"), "/" !== this._sourceMapRootpath.charAt(this._sourceMapRootpath.length - 1) && (this._sourceMapRootpath += "/")) : this._sourceMapRootpath = "", this._outputSourceFiles = t.outputSourceFiles, this._sourceMapGeneratorConstructor = e.getSourceMapGenerator(), this._lineNumber = 0, this._column = 0
				};
				return t.prototype.normalizeFilename = function(e) {
					return e = e.replace(/\\/g, "/"), this._sourceMapBasepath && 0 === e.indexOf(this._sourceMapBasepath) && (e = e.substring(this._sourceMapBasepath.length), ("\\" === e.charAt(0) || "/" === e.charAt(0)) && (e = e.substring(1))), (this._sourceMapRootpath || "") + e
				}, t.prototype.add = function(e, t, i, n) {
					if (e) {
						var r, o, s, a, l;
						if (t) {
							var h = this._contentsMap[t.filename];
							this._contentsIgnoredCharsMap[t.filename] && (i -= this._contentsIgnoredCharsMap[t.filename], 0 > i && (i = 0), h = h.slice(this._contentsIgnoredCharsMap[t.filename])), h = h.substring(0, i), o = h.split("\n"), a = o[o.length - 1]
						}
						if (r = e.split("\n"), s = r[r.length - 1], t) if (n) for (l = 0; r.length > l; l++) this._sourceMapGenerator.addMapping({
							generated: {
								line: this._lineNumber + l + 1,
								column: 0 === l ? this._column : 0
							},
							original: {
								line: o.length + l,
								column: 0 === l ? a.length : 0
							},
							source: this.normalizeFilename(t.filename)
						});
						else this._sourceMapGenerator.addMapping({
							generated: {
								line: this._lineNumber + 1,
								column: this._column
							},
							original: {
								line: o.length,
								column: a.length
							},
							source: this.normalizeFilename(t.filename)
						});
						1 === r.length ? this._column += s.length : (this._lineNumber += r.length - 1, this._column = s.length), this._css.push(e)
					}
				}, t.prototype.isEmpty = function() {
					return 0 === this._css.length
				}, t.prototype.toCSS = function(e) {
					if (this._sourceMapGenerator = new this._sourceMapGeneratorConstructor({
						file: this._outputFilename,
						sourceRoot: null
					}), this._outputSourceFiles) for (var t in this._contentsMap) if (this._contentsMap.hasOwnProperty(t)) {
						var i = this._contentsMap[t];
						this._contentsIgnoredCharsMap[t] && (i = i.slice(this._contentsIgnoredCharsMap[t])), this._sourceMapGenerator.setSourceContent(this.normalizeFilename(t), i)
					}
					if (this._rootNode.genCSS(e, this), this._css.length > 0) {
						var n, r = JSON.stringify(this._sourceMapGenerator.toJSON());
						this.sourceMapURL ? n = this.sourceMapURL : this._sourceMapFilename && (n = this._sourceMapFilename), this.sourceMapURL = n, this.sourceMap = r
					}
					return this._css.join("")
				}, t
			}
		}, {}],
		43: [function(e, t) {
			var i = e("./contexts"),
				n = e("./visitors"),
				r = e("./tree");
			t.exports = function(e, t) {
				t = t || {};
				var o, s = t.variables,
					a = new i.Eval(t);
				"object" != typeof s || Array.isArray(s) || (s = Object.keys(s).map(function(e) {
					var t = s[e];
					return t instanceof r.Value || (t instanceof r.Expression || (t = new r.Expression([t])), t = new r.Value([t])), new r.Rule("@" + e, t, !1, null, 0)
				}), a.frames = [new r.Ruleset(null, s)]);
				var l, h = [],
					c = [new n.JoinSelectorVisitor, new n.ExtendVisitor, new n.ToCSSVisitor({
						compress: Boolean(t.compress)
					})];
				if (t.pluginManager) {
					var u = t.pluginManager.getVisitors();
					for (l = 0; u.length > l; l++) {
						var p = u[l];
						p.isPreEvalVisitor ? h.push(p) : p.isPreVisitor ? c.splice(0, 0, p) : c.push(p)
					}
				}
				for (l = 0; h.length > l; l++) h[l].run(e);
				for (o = e.eval(a), l = 0; c.length > l; l++) c[l].run(o);
				return o
			}
		}, {
			"./contexts": 10,
			"./tree": 61,
			"./visitors": 86
		}],
		44: [function(e, t) {
			var i = e("./node"),
				n = function(e) {
					this.value = e
				};
			n.prototype = new i, n.prototype.type = "Alpha", n.prototype.accept = function(e) {
				this.value = e.visit(this.value)
			}, n.prototype.eval = function(e) {
				return this.value.eval ? new n(this.value.eval(e)) : this
			}, n.prototype.genCSS = function(e, t) {
				t.add("alpha(opacity="), this.value.genCSS ? this.value.genCSS(e, t) : t.add(this.value), t.add(")")
			}, t.exports = n
		}, {
			"./node": 69
		}],
		45: [function(e, t) {
			var i = e("./node"),
				n = function(e, t, i, n, r, o) {
					this.value = e, this.index = t, this.mapLines = n, this.currentFileInfo = i, this.rulesetLike = "undefined" == typeof r ? !1 : r, this.isReferenced = o || !1
				};
			n.prototype = new i, n.prototype.type = "Anonymous", n.prototype.eval = function() {
				return new n(this.value, this.index, this.currentFileInfo, this.mapLines, this.rulesetLike, this.isReferenced)
			}, n.prototype.compare = function(e) {
				return e.toCSS && this.toCSS() === e.toCSS() ? 0 : void 0
			}, n.prototype.isRulesetLike = function() {
				return this.rulesetLike
			}, n.prototype.genCSS = function(e, t) {
				t.add(this.value, this.currentFileInfo, this.index, this.mapLines)
			}, n.prototype.markReferenced = function() {
				this.isReferenced = !0
			}, n.prototype.getIsReferenced = function() {
				return !this.currentFileInfo || !this.currentFileInfo.reference || this.isReferenced
			}, t.exports = n
		}, {
			"./node": 69
		}],
		46: [function(e, t) {
			var i = e("./node"),
				n = function(e, t) {
					this.key = e, this.value = t
				};
			n.prototype = new i, n.prototype.type = "Assignment", n.prototype.accept = function(e) {
				this.value = e.visit(this.value)
			}, n.prototype.eval = function(e) {
				return this.value.eval ? new n(this.key, this.value.eval(e)) : this
			}, n.prototype.genCSS = function(e, t) {
				t.add(this.key + "="), this.value.genCSS ? this.value.genCSS(e, t) : t.add(this.value)
			}, t.exports = n
		}, {
			"./node": 69
		}],
		47: [function(e, t) {
			var i = e("./node"),
				n = function(e, t, i) {
					this.key = e, this.op = t, this.value = i
				};
			n.prototype = new i, n.prototype.type = "Attribute", n.prototype.eval = function(e) {
				return new n(this.key.eval ? this.key.eval(e) : this.key, this.op, this.value && this.value.eval ? this.value.eval(e) : this.value)
			}, n.prototype.genCSS = function(e, t) {
				t.add(this.toCSS(e))
			}, n.prototype.toCSS = function(e) {
				var t = this.key.toCSS ? this.key.toCSS(e) : this.key;
				return this.op && (t += this.op, t += this.value.toCSS ? this.value.toCSS(e) : this.value), "[" + t + "]"
			}, t.exports = n
		}, {
			"./node": 69
		}],
		48: [function(e, t) {
			var i = e("./node"),
				n = e("../functions/function-caller"),
				r = function(e, t, i, n) {
					this.name = e, this.args = t, this.index = i, this.currentFileInfo = n
				};
			r.prototype = new i, r.prototype.type = "Call", r.prototype.accept = function(e) {
				this.args && (this.args = e.visitArray(this.args))
			}, r.prototype.eval = function(e) {
				var t, i = this.args.map(function(t) {
					return t.eval(e)
				}),
					o = new n(this.name, e, this.index, this.currentFileInfo);
				if (o.isValid()) try {
					if (t = o.call(i), null != t) return t
				} catch (s) {
					throw {
						type: s.type || "Runtime",
						message: "error evaluating function `" + this.name + "`" + (s.message ? ": " + s.message : ""),
						index: this.index,
						filename: this.currentFileInfo.filename
					}
				}
				return new r(this.name, i, this.index, this.currentFileInfo)
			}, r.prototype.genCSS = function(e, t) {
				t.add(this.name + "(", this.currentFileInfo, this.index);
				for (var i = 0; this.args.length > i; i++) this.args[i].genCSS(e, t), this.args.length > i + 1 && t.add(", ");
				t.add(")")
			}, t.exports = r
		}, {
			"../functions/function-caller": 20,
			"./node": 69
		}],
		49: [function(e, t) {
			function i(e, t) {
				return Math.min(Math.max(e, 0), t)
			}
			function n(e) {
				return "#" + e.map(function(e) {
					return e = i(Math.round(e), 255), (16 > e ? "0" : "") + e.toString(16)
				}).join("")
			}
			var r = e("./node"),
				o = e("../data/colors"),
				s = function(e, t, i) {
					this.rgb = Array.isArray(e) ? e : 6 == e.length ? e.match(/.{2}/g).map(function(e) {
						return parseInt(e, 16)
					}) : e.split("").map(function(e) {
						return parseInt(e + e, 16)
					}), this.alpha = "number" == typeof t ? t : 1, "undefined" != typeof i && (this.value = i)
				};
			s.prototype = new r, s.prototype.type = "Color", s.prototype.luma = function() {
				var e = this.rgb[0] / 255,
					t = this.rgb[1] / 255,
					i = this.rgb[2] / 255;
				return e = .03928 >= e ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4), t = .03928 >= t ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4), i = .03928 >= i ? i / 12.92 : Math.pow((i + .055) / 1.055, 2.4), .2126 * e + .7152 * t + .0722 * i
			}, s.prototype.genCSS = function(e, t) {
				t.add(this.toCSS(e))
			}, s.prototype.toCSS = function(e, t) {
				var n, r, o = e && e.compress && !t;
				if (this.value) return this.value;
				if (r = this.fround(e, this.alpha), 1 > r) return "rgba(" + this.rgb.map(function(e) {
					return i(Math.round(e), 255)
				}).concat(i(r, 1)).join("," + (o ? "" : " ")) + ")";
				if (n = this.toRGB(), o) {
					var s = n.split("");
					s[1] === s[2] && s[3] === s[4] && s[5] === s[6] && (n = "#" + s[1] + s[3] + s[5])
				}
				return n
			}, s.prototype.operate = function(e, t, i) {
				for (var n = [], r = this.alpha * (1 - i.alpha) + i.alpha, o = 0; 3 > o; o++) n[o] = this._operate(e, t, this.rgb[o], i.rgb[o]);
				return new s(n, r)
			}, s.prototype.toRGB = function() {
				return n(this.rgb)
			}, s.prototype.toHSL = function() {
				var e, t, i = this.rgb[0] / 255,
					n = this.rgb[1] / 255,
					r = this.rgb[2] / 255,
					o = this.alpha,
					s = Math.max(i, n, r),
					a = Math.min(i, n, r),
					l = (s + a) / 2,
					h = s - a;
				if (s === a) e = t = 0;
				else {
					switch (t = l > .5 ? h / (2 - s - a) : h / (s + a), s) {
						case i:
							e = (n - r) / h + (r > n ? 6 : 0);
							break;
						case n:
							e = (r - i) / h + 2;
							break;
						case r:
							e = (i - n) / h + 4
					}
					e /= 6
				}
				return {
					h: 360 * e,
					s: t,
					l: l,
					a: o
				}
			}, s.prototype.toHSV = function() {
				var e, t, i = this.rgb[0] / 255,
					n = this.rgb[1] / 255,
					r = this.rgb[2] / 255,
					o = this.alpha,
					s = Math.max(i, n, r),
					a = Math.min(i, n, r),
					l = s,
					h = s - a;
				if (t = 0 === s ? 0 : h / s, s === a) e = 0;
				else {
					switch (s) {
						case i:
							e = (n - r) / h + (r > n ? 6 : 0);
							break;
						case n:
							e = (r - i) / h + 2;
							break;
						case r:
							e = (i - n) / h + 4
					}
					e /= 6
				}
				return {
					h: 360 * e,
					s: t,
					v: l,
					a: o
				}
			}, s.prototype.toARGB = function() {
				return n([255 * this.alpha].concat(this.rgb))
			}, s.prototype.compare = function(e) {
				return e.rgb && e.rgb[0] === this.rgb[0] && e.rgb[1] === this.rgb[1] && e.rgb[2] === this.rgb[2] && e.alpha === this.alpha ? 0 : void 0
			}, s.fromKeyword = function(e) {
				var t, i = e.toLowerCase();
				return o.hasOwnProperty(i) ? t = new s(o[i].slice(1)) : "transparent" === i && (t = new s([0, 0, 0], 0)), t ? (t.value = e, t) : void 0
			}, t.exports = s
		}, {
			"../data/colors": 11,
			"./node": 69
		}],
		50: [function(e, t) {
			var i = e("./node"),
				n = function(e) {
					" " === e ? (this.value = " ", this.emptyOrWhitespace = !0) : (this.value = e ? e.trim() : "", this.emptyOrWhitespace = "" === this.value)
				};
			n.prototype = new i, n.prototype.type = "Combinator";
			var r = {
				"": !0,
				" ": !0,
				"|": !0
			};
			n.prototype.genCSS = function(e, t) {
				var i = e.compress || r[this.value] ? "" : " ";
				t.add(i + this.value + i)
			}, t.exports = n
		}, {
			"./node": 69
		}],
		51: [function(e, t) {
			var i = e("./node"),
				n = e("./debug-info"),
				r = function(e, t, i, n) {
					this.value = e, this.isLineComment = t, this.currentFileInfo = n
				};
			r.prototype = new i, r.prototype.type = "Comment", r.prototype.genCSS = function(e, t) {
				this.debugInfo && t.add(n(e, this), this.currentFileInfo, this.index), t.add(this.value)
			}, r.prototype.isSilent = function(e) {
				var t = this.currentFileInfo && this.currentFileInfo.reference && !this.isReferenced,
					i = e.compress && "!" !== this.value[2];
				return this.isLineComment || t || i
			}, r.prototype.markReferenced = function() {
				this.isReferenced = !0
			}, t.exports = r
		}, {
			"./debug-info": 53,
			"./node": 69
		}],
		52: [function(e, t) {
			var i = e("./node"),
				n = function(e, t, i, n, r) {
					this.op = e.trim(), this.lvalue = t, this.rvalue = i, this.index = n, this.negate = r
				};
			n.prototype = new i, n.prototype.type = "Condition", n.prototype.accept = function(e) {
				this.lvalue = e.visit(this.lvalue), this.rvalue = e.visit(this.rvalue)
			}, n.prototype.eval = function(e) {
				var t = function(e, t, n) {
					switch (e) {
						case "and":
							return t && n;
						case "or":
							return t || n;
						default:
							switch (i.compare(t, n)) {
								case -1:
									return "<" === e || "=<" === e || "<=" === e;
								case 0:
									return "=" === e || ">=" === e || "=<" === e || "<=" === e;
								case 1:
									return ">" === e || ">=" === e;
								default:
									return !1
							}
					}
				}(this.op, this.lvalue.eval(e), this.rvalue.eval(e));
				return this.negate ? !t : t
			}, t.exports = n
		}, {
			"./node": 69
		}],
		53: [function(e, t) {
			var i = function(e, t, n) {
				var r = "";
				if (e.dumpLineNumbers && !e.compress) switch (e.dumpLineNumbers) {
					case "comments":
						r = i.asComment(t);
						break;
					case "mediaquery":
						r = i.asMediaQuery(t);
						break;
					case "all":
						r = i.asComment(t) + (n || "") + i.asMediaQuery(t)
				}
				return r
			};
			i.asComment = function(e) {
				return "/* line " + e.debugInfo.lineNumber + ", " + e.debugInfo.fileName + " */\n"
			}, i.asMediaQuery = function(e) {
				var t = e.debugInfo.fileName;
				return /^[a-z]+:\/\//i.test(t) || (t = "file://" + t), "@media -sass-debug-info{filename{font-family:" + t.replace(/([.:\/\\])/g, function(e) {
					return "\\" == e && (e = "/"), "\\" + e
				}) + "}line{font-family:\\00003" + e.debugInfo.lineNumber + "}}\n"
			}, t.exports = i
		}, {}],
		54: [function(e, t) {
			var i = e("./node"),
				n = e("../contexts"),
				r = function(e, t) {
					this.ruleset = e, this.frames = t
				};
			r.prototype = new i, r.prototype.type = "DetachedRuleset", r.prototype.evalFirst = !0, r.prototype.accept = function(e) {
				this.ruleset = e.visit(this.ruleset)
			}, r.prototype.eval = function(e) {
				var t = this.frames || e.frames.slice(0);
				return new r(this.ruleset, t)
			}, r.prototype.callEval = function(e) {
				return this.ruleset.eval(this.frames ? new n.Eval(e, this.frames.concat(e.frames)) : e)
			}, t.exports = r
		}, {
			"../contexts": 10,
			"./node": 69
		}],
		55: [function(e, t) {
			var i = e("./node"),
				n = e("../data/unit-conversions"),
				r = e("./unit"),
				o = e("./color"),
				s = function(e, t) {
					this.value = parseFloat(e), this.unit = t && t instanceof r ? t : new r(t ? [t] : void 0)
				};
			s.prototype = new i, s.prototype.type = "Dimension", s.prototype.accept = function(e) {
				this.unit = e.visit(this.unit)
			}, s.prototype.eval = function() {
				return this
			}, s.prototype.toColor = function() {
				return new o([this.value, this.value, this.value])
			}, s.prototype.genCSS = function(e, t) {
				if (e && e.strictUnits && !this.unit.isSingular()) throw new Error("Multiple units in dimension. Correct the units or use the unit function. Bad unit: " + this.unit.toString());
				var i = this.fround(e, this.value),
					n = String(i);
				if (0 !== i && 1e-6 > i && i > -1e-6 && (n = i.toFixed(20).replace(/0+$/, "")), e && e.compress) {
					if (0 === i && this.unit.isLength()) return void t.add(n);
					i > 0 && 1 > i && (n = n.substr(1))
				}
				t.add(n), this.unit.genCSS(e, t)
			}, s.prototype.operate = function(e, t, i) {
				var n = this._operate(e, t, this.value, i.value),
					r = this.unit.clone();
				if ("+" === t || "-" === t) if (0 === r.numerator.length && 0 === r.denominator.length) r = i.unit.clone(), this.unit.backupUnit && (r.backupUnit = this.unit.backupUnit);
				else if (0 === i.unit.numerator.length && 0 === r.denominator.length);
				else {
					if (i = i.convertTo(this.unit.usedUnits()), e.strictUnits && i.unit.toString() !== r.toString()) throw new Error("Incompatible units. Change the units or use the unit function. Bad units: '" + r.toString() + "' and '" + i.unit.toString() + "'.");
					n = this._operate(e, t, this.value, i.value)
				} else "*" === t ? (r.numerator = r.numerator.concat(i.unit.numerator).sort(), r.denominator = r.denominator.concat(i.unit.denominator).sort(), r.cancel()) : "/" === t && (r.numerator = r.numerator.concat(i.unit.denominator).sort(), r.denominator = r.denominator.concat(i.unit.numerator).sort(), r.cancel());
				return new s(n, r)
			}, s.prototype.compare = function(e) {
				var t, n;
				if (e instanceof s) {
					if (this.unit.isEmpty() || e.unit.isEmpty()) t = this, n = e;
					else if (t = this.unify(), n = e.unify(), 0 !== t.unit.compare(n.unit)) return;
					return i.numericCompare(t.value, n.value)
				}
			}, s.prototype.unify = function() {
				return this.convertTo({
					length: "px",
					duration: "s",
					angle: "rad"
				})
			}, s.prototype.convertTo = function(e) {
				var t, i, r, o, a, l = this.value,
					h = this.unit.clone(),
					c = {};
				if ("string" == typeof e) {
					for (t in n) n[t].hasOwnProperty(e) && (c = {}, c[t] = e);
					e = c
				}
				a = function(e, t) {
					return r.hasOwnProperty(e) ? (t ? l /= r[e] / r[o] : l *= r[e] / r[o], o) : e
				};
				for (i in e) e.hasOwnProperty(i) && (o = e[i], r = n[i], h.map(a));
				return h.cancel(), new s(l, h)
			}, t.exports = s
		}, {
			"../data/unit-conversions": 13,
			"./color": 49,
			"./node": 69,
			"./unit": 78
		}],
		56: [function(e, t) {
			var i = e("./node"),
				n = e("./selector"),
				r = e("./ruleset"),
				o = function(e, t, i, r, o, s, a, l) {
					var h;
					if (this.name = e, this.value = t, i) for (Array.isArray(i) ? this.rules = i : (this.rules = [i], this.rules[0].selectors = new n([], null, null, this.index, o).createEmptySelectors()), h = 0; this.rules.length > h; h++) this.rules[h].allowImports = !0;
					this.index = r, this.currentFileInfo = o, this.debugInfo = s, this.isReferenced = a, this.isRooted = l || !1
				};
			o.prototype = new i, o.prototype.type = "Directive", o.prototype.accept = function(e) {
				var t = this.value,
					i = this.rules;
				i && (this.rules = e.visitArray(i)), t && (this.value = e.visit(t))
			}, o.prototype.isRulesetLike = function() {
				return this.rules || !this.isCharset()
			}, o.prototype.isCharset = function() {
				return "@charset" === this.name
			}, o.prototype.genCSS = function(e, t) {
				var i = this.value,
					n = this.rules;
				t.add(this.name, this.currentFileInfo, this.index), i && (t.add(" "), i.genCSS(e, t)), n ? this.outputRuleset(e, t, n) : t.add(";")
			}, o.prototype.eval = function(e) {
				var t, i, n = this.value,
					r = this.rules;
				return t = e.mediaPath, i = e.mediaBlocks, e.mediaPath = [], e.mediaBlocks = [], n && (n = n.eval(e)), r && (r = [r[0].eval(e)], r[0].root = !0), e.mediaPath = t, e.mediaBlocks = i, new o(this.name, n, r, this.index, this.currentFileInfo, this.debugInfo, this.isReferenced, this.isRooted)
			}, o.prototype.variable = function(e) {
				return this.rules ? r.prototype.variable.call(this.rules[0], e) : void 0
			}, o.prototype.find = function() {
				return this.rules ? r.prototype.find.apply(this.rules[0], arguments) : void 0
			}, o.prototype.rulesets = function() {
				return this.rules ? r.prototype.rulesets.apply(this.rules[0]) : void 0
			}, o.prototype.markReferenced = function() {
				var e, t;
				if (this.isReferenced = !0, this.rules) for (t = this.rules, e = 0; t.length > e; e++) t[e].markReferenced && t[e].markReferenced()
			}, o.prototype.getIsReferenced = function() {
				return !this.currentFileInfo || !this.currentFileInfo.reference || this.isReferenced
			}, o.prototype.outputRuleset = function(e, t, i) {
				var n, r = i.length;
				if (e.tabLevel = (0 | e.tabLevel) + 1, e.compress) {
					for (t.add("{"), n = 0; r > n; n++) i[n].genCSS(e, t);
					return t.add("}"), void e.tabLevel--
				}
				var o = "\n" + Array(e.tabLevel).join("  "),
					s = o + "  ";
				if (r) {
					for (t.add(" {" + s), i[0].genCSS(e, t), n = 1; r > n; n++) t.add(s), i[n].genCSS(e, t);
					t.add(o + "}")
				} else t.add(" {" + o + "}");
				e.tabLevel--
			}, t.exports = o
		}, {
			"./node": 69,
			"./ruleset": 75,
			"./selector": 76
		}],
		57: [function(e, t) {
			var i = e("./node"),
				n = e("./paren"),
				r = e("./combinator"),
				o = function(e, t, i, n) {
					this.combinator = e instanceof r ? e : new r(e), this.value = "string" == typeof t ? t.trim() : t ? t : "", this.index = i, this.currentFileInfo = n
				};
			o.prototype = new i, o.prototype.type = "Element", o.prototype.accept = function(e) {
				var t = this.value;
				this.combinator = e.visit(this.combinator), "object" == typeof t && (this.value = e.visit(t))
			}, o.prototype.eval = function(e) {
				return new o(this.combinator, this.value.eval ? this.value.eval(e) : this.value, this.index, this.currentFileInfo)
			}, o.prototype.genCSS = function(e, t) {
				t.add(this.toCSS(e), this.currentFileInfo, this.index)
			}, o.prototype.toCSS = function(e) {
				e = e || {};
				var t = this.value,
					i = e.firstSelector;
				return t instanceof n && (e.firstSelector = !0), t = t.toCSS ? t.toCSS(e) : t, e.firstSelector = i, "" === t && "&" === this.combinator.value.charAt(0) ? "" : this.combinator.toCSS(e) + t
			}, t.exports = o
		}, {
			"./combinator": 50,
			"./node": 69,
			"./paren": 71
		}],
		58: [function(e, t) {
			var i = e("./node"),
				n = e("./paren"),
				r = e("./comment"),
				o = function(e) {
					if (this.value = e, !e) throw new Error("Expression requires an array parameter")
				};
			o.prototype = new i, o.prototype.type = "Expression", o.prototype.accept = function(e) {
				this.value = e.visitArray(this.value)
			}, o.prototype.eval = function(e) {
				var t, i = this.parens && !this.parensInOp,
					r = !1;
				return i && e.inParenthesis(), this.value.length > 1 ? t = new o(this.value.map(function(t) {
					return t.eval(e)
				})) : 1 === this.value.length ? (this.value[0].parens && !this.value[0].parensInOp && (r = !0), t = this.value[0].eval(e)) : t = this, i && e.outOfParenthesis(), this.parens && this.parensInOp && !e.isMathOn() && !r && (t = new n(t)), t
			}, o.prototype.genCSS = function(e, t) {
				for (var i = 0; this.value.length > i; i++) this.value[i].genCSS(e, t), this.value.length > i + 1 && t.add(" ")
			}, o.prototype.throwAwayComments = function() {
				this.value = this.value.filter(function(e) {
					return !(e instanceof r)
				})
			}, o.prototype.markReferenced = function() {
				this.value.forEach(function(e) {
					e.markReferenced && e.markReferenced()
				})
			}, t.exports = o
		}, {
			"./comment": 51,
			"./node": 69,
			"./paren": 71
		}],
		59: [function(e, t) {
			var i = e("./node"),
				n = function r(e, t, i) {
					switch (this.selector = e, this.option = t, this.index = i, this.object_id = r.next_id++, this.parent_ids = [this.object_id], t) {
						case "all":
							this.allowBefore = !0, this.allowAfter = !0;
							break;
						default:
							this.allowBefore = !1, this.allowAfter = !1
					}
				};
			n.next_id = 0, n.prototype = new i, n.prototype.type = "Extend", n.prototype.accept = function(e) {
				this.selector = e.visit(this.selector)
			}, n.prototype.eval = function(e) {
				return new n(this.selector.eval(e), this.option, this.index)
			}, n.prototype.clone = function() {
				return new n(this.selector, this.option, this.index)
			}, n.prototype.findSelfSelectors = function(e) {
				var t, i, n = [];
				for (t = 0; e.length > t; t++) i = e[t].elements, t > 0 && i.length && "" === i[0].combinator.value && (i[0].combinator.value = " "), n = n.concat(e[t].elements);
				this.selfSelectors = [{
					elements: n
				}]
			}, t.exports = n
		}, {
			"./node": 69
		}],
		60: [function(e, t) {
			var i = e("./node"),
				n = e("./media"),
				r = e("./url"),
				o = e("./quoted"),
				s = e("./ruleset"),
				a = e("./anonymous"),
				l = function(e, t, i, n, r) {
					if (this.options = i, this.index = n, this.path = e, this.features = t, this.currentFileInfo = r, void 0 !== this.options.less || this.options.inline) this.css = !this.options.less || this.options.inline;
					else {
						var o = this.getPath();
						o && /[#\.\&\?\/]css([\?;].*)?$/.test(o) && (this.css = !0)
					}
				};
			l.prototype = new i, l.prototype.type = "Import", l.prototype.accept = function(e) {
				this.features && (this.features = e.visit(this.features)), this.path = e.visit(this.path), this.options.plugin || this.options.inline || !this.root || (this.root = e.visit(this.root))
			}, l.prototype.genCSS = function(e, t) {
				this.css && void 0 === this.path.currentFileInfo.reference && (t.add("@import ", this.currentFileInfo, this.index), this.path.genCSS(e, t), this.features && (t.add(" "), this.features.genCSS(e, t)), t.add(";"))
			}, l.prototype.getPath = function() {
				return this.path instanceof r ? this.path.value.value : this.path.value
			}, l.prototype.isVariableImport = function() {
				var e = this.path;
				return e instanceof r && (e = e.value), e instanceof o ? e.containsVariables() : !0
			}, l.prototype.evalForImport = function(e) {
				var t = this.path;
				return t instanceof r && (t = t.value), new l(t.eval(e), this.features, this.options, this.index, this.currentFileInfo)
			}, l.prototype.evalPath = function(e) {
				var t = this.path.eval(e),
					i = this.currentFileInfo && this.currentFileInfo.rootpath;
				if (!(t instanceof r)) {
					if (i) {
						var n = t.value;
						n && e.isPathRelative(n) && (t.value = i + n)
					}
					t.value = e.normalizePath(t.value)
				}
				return t
			}, l.prototype.eval = function(e) {
				var t, i, r = this.features && this.features.eval(e);
				if (this.options.plugin) return i = e.frames[0] && e.frames[0].functionRegistry, i && this.root && this.root.functions && i.addMultiple(this.root.functions), [];
				if (this.skip && ("function" == typeof this.skip && (this.skip = this.skip()), this.skip)) return [];
				if (this.options.inline) {
					var o = new a(this.root, 0, {
						filename: this.importedFilename,
						reference: this.path.currentFileInfo && this.path.currentFileInfo.reference
					}, !0, !0, !1);
					return this.features ? new n([o], this.features.value) : [o]
				}
				if (this.css) {
					var h = new l(this.evalPath(e), r, this.options, this.index);
					if (!h.css && this.error) throw this.error;
					return h
				}
				return t = new s(null, this.root.rules.slice(0)), t.evalImports(e), this.features ? new n(t.rules, this.features.value) : t.rules
			}, t.exports = l
		}, {
			"./anonymous": 45,
			"./media": 65,
			"./node": 69,
			"./quoted": 72,
			"./ruleset": 75,
			"./url": 79
		}],
		61: [function(e, t) {
			var i = {};
			i.Node = e("./node"), i.Alpha = e("./alpha"), i.Color = e("./color"), i.Directive = e("./directive"), i.DetachedRuleset = e("./detached-ruleset"), i.Operation = e("./operation"), i.Dimension = e("./dimension"), i.Unit = e("./unit"), i.Keyword = e("./keyword"), i.Variable = e("./variable"), i.Ruleset = e("./ruleset"), i.Element = e("./element"), i.Attribute = e("./attribute"), i.Combinator = e("./combinator"), i.Selector = e("./selector"), i.Quoted = e("./quoted"), i.Expression = e("./expression"), i.Rule = e("./rule"), i.Call = e("./call"), i.URL = e("./url"), i.Import = e("./import"), i.mixin = {
				Call: e("./mixin-call"),
				Definition: e("./mixin-definition")
			}, i.Comment = e("./comment"), i.Anonymous = e("./anonymous"), i.Value = e("./value"), i.JavaScript = e("./javascript"), i.Assignment = e("./assignment"), i.Condition = e("./condition"), i.Paren = e("./paren"), i.Media = e("./media"), i.UnicodeDescriptor = e("./unicode-descriptor"), i.Negative = e("./negative"), i.Extend = e("./extend"), i.RulesetCall = e("./ruleset-call"), t.exports = i
		}, {
			"./alpha": 44,
			"./anonymous": 45,
			"./assignment": 46,
			"./attribute": 47,
			"./call": 48,
			"./color": 49,
			"./combinator": 50,
			"./comment": 51,
			"./condition": 52,
			"./detached-ruleset": 54,
			"./dimension": 55,
			"./directive": 56,
			"./element": 57,
			"./expression": 58,
			"./extend": 59,
			"./import": 60,
			"./javascript": 62,
			"./keyword": 64,
			"./media": 65,
			"./mixin-call": 66,
			"./mixin-definition": 67,
			"./negative": 68,
			"./node": 69,
			"./operation": 70,
			"./paren": 71,
			"./quoted": 72,
			"./rule": 73,
			"./ruleset": 75,
			"./ruleset-call": 74,
			"./selector": 76,
			"./unicode-descriptor": 77,
			"./unit": 78,
			"./url": 79,
			"./value": 80,
			"./variable": 81
		}],
		62: [function(e, t) {
			var i = e("./js-eval-node"),
				n = e("./dimension"),
				r = e("./quoted"),
				o = e("./anonymous"),
				s = function(e, t, i, n) {
					this.escaped = t, this.expression = e, this.index = i, this.currentFileInfo = n
				};
			s.prototype = new i, s.prototype.type = "JavaScript", s.prototype.eval = function(e) {
				var t = this.evaluateJavaScript(this.expression, e);
				return "number" == typeof t ? new n(t) : "string" == typeof t ? new r('"' + t + '"', t, this.escaped, this.index) : new o(Array.isArray(t) ? t.join(", ") : t)
			}, t.exports = s
		}, {
			"./anonymous": 45,
			"./dimension": 55,
			"./js-eval-node": 63,
			"./quoted": 72
		}],
		63: [function(e, t) {
			var i = e("./node"),
				n = e("./variable"),
				r = function() {};
			r.prototype = new i, r.prototype.evaluateJavaScript = function(e, t) {
				var i, r = this,
					o = {};
				if (void 0 !== t.javascriptEnabled && !t.javascriptEnabled) throw {
					message: "You are using JavaScript, which has been disabled.",
					filename: this.currentFileInfo.filename,
					index: this.index
				};
				e = e.replace(/@\{([\w-]+)\}/g, function(e, i) {
					return r.jsify(new n("@" + i, r.index, r.currentFileInfo).eval(t))
				});
				try {
					e = new Function("return (" + e + ")")
				} catch (s) {
					throw {
						message: "JavaScript evaluation error: " + s.message + " from `" + e + "`",
						filename: this.currentFileInfo.filename,
						index: this.index
					}
				}
				var a = t.frames[0].variables();
				for (var l in a) a.hasOwnProperty(l) && (o[l.slice(1)] = {
					value: a[l].value,
					toJS: function() {
						return this.value.eval(t).toCSS()
					}
				});
				try {
					i = e.call(o)
				} catch (s) {
					throw {
						message: "JavaScript evaluation error: '" + s.name + ": " + s.message.replace(/["]/g, "'") + "'",
						filename: this.currentFileInfo.filename,
						index: this.index
					}
				}
				return i
			}, r.prototype.jsify = function(e) {
				return Array.isArray(e.value) && e.value.length > 1 ? "[" + e.value.map(function(e) {
					return e.toCSS()
				}).join(", ") + "]" : e.toCSS()
			}, t.exports = r
		}, {
			"./node": 69,
			"./variable": 81
		}],
		64: [function(e, t) {
			var i = e("./node"),
				n = function(e) {
					this.value = e
				};
			n.prototype = new i, n.prototype.type = "Keyword", n.prototype.genCSS = function(e, t) {
				if ("%" === this.value) throw {
					type: "Syntax",
					message: "Invalid % without number"
				};
				t.add(this.value)
			}, n.True = new n("true"), n.False = new n("false"), t.exports = n
		}, {
			"./node": 69
		}],
		65: [function(e, t) {
			var i = e("./ruleset"),
				n = e("./value"),
				r = e("./selector"),
				o = e("./anonymous"),
				s = e("./expression"),
				a = e("./directive"),
				l = function(e, t, o, s) {
					this.index = o, this.currentFileInfo = s;
					var a = new r([], null, null, this.index, this.currentFileInfo).createEmptySelectors();
					this.features = new n(t), this.rules = [new i(a, e)], this.rules[0].allowImports = !0
				};
			l.prototype = new a, l.prototype.type = "Media", l.prototype.isRulesetLike = !0, l.prototype.accept = function(e) {
				this.features && (this.features = e.visit(this.features)), this.rules && (this.rules = e.visitArray(this.rules))
			}, l.prototype.genCSS = function(e, t) {
				t.add("@media ", this.currentFileInfo, this.index), this.features.genCSS(e, t), this.outputRuleset(e, t, this.rules)
			}, l.prototype.eval = function(e) {
				e.mediaBlocks || (e.mediaBlocks = [], e.mediaPath = []);
				var t = new l(null, [], this.index, this.currentFileInfo);
				this.debugInfo && (this.rules[0].debugInfo = this.debugInfo, t.debugInfo = this.debugInfo);
				var i = !1;
				e.strictMath || (i = !0, e.strictMath = !0);
				try {
					t.features = this.features.eval(e)
				} finally {
					i && (e.strictMath = !1)
				}
				return e.mediaPath.push(t), e.mediaBlocks.push(t), this.rules[0].functionRegistry = e.frames[0].functionRegistry.inherit(), e.frames.unshift(this.rules[0]), t.rules = [this.rules[0].eval(e)], e.frames.shift(), e.mediaPath.pop(), 0 === e.mediaPath.length ? t.evalTop(e) : t.evalNested(e)
			}, l.prototype.evalTop = function(e) {
				var t = this;
				if (e.mediaBlocks.length > 1) {
					var n = new r([], null, null, this.index, this.currentFileInfo).createEmptySelectors();
					t = new i(n, e.mediaBlocks), t.multiMedia = !0
				}
				return delete e.mediaBlocks, delete e.mediaPath, t
			}, l.prototype.evalNested = function(e) {
				var t, r, a = e.mediaPath.concat([this]);
				for (t = 0; a.length > t; t++) r = a[t].features instanceof n ? a[t].features.value : a[t].features, a[t] = Array.isArray(r) ? r : [r];
				return this.features = new n(this.permute(a).map(function(e) {
					for (e = e.map(function(e) {
						return e.toCSS ? e : new o(e)
					}), t = e.length - 1; t > 0; t--) e.splice(t, 0, new o("and"));
					return new s(e)
				})), new i([], [])
			}, l.prototype.permute = function(e) {
				if (0 === e.length) return [];
				if (1 === e.length) return e[0];
				for (var t = [], i = this.permute(e.slice(1)), n = 0; i.length > n; n++) for (var r = 0; e[0].length > r; r++) t.push([e[0][r]].concat(i[n]));
				return t
			}, l.prototype.bubbleSelectors = function(e) {
				e && (this.rules = [new i(e.slice(0), [this.rules[0]])])
			}, t.exports = l
		}, {
			"./anonymous": 45,
			"./directive": 56,
			"./expression": 58,
			"./ruleset": 75,
			"./selector": 76,
			"./value": 80
		}],
		66: [function(e, t) {
			var i = e("./node"),
				n = e("./selector"),
				r = e("./mixin-definition"),
				o = e("../functions/default"),
				s = function(e, t, i, r, o) {
					this.selector = new n(e), this.arguments = t || [], this.index = i, this.currentFileInfo = r, this.important = o
				};
			s.prototype = new i, s.prototype.type = "MixinCall", s.prototype.accept = function(e) {
				this.selector && (this.selector = e.visit(this.selector)), this.arguments.length && (this.arguments = e.visitArray(this.arguments))
			}, s.prototype.eval = function(e) {
				function t(t, i) {
					var n, r, s;
					for (n = 0; 2 > n; n++) {
						for (k[n] = !0, o.value(n), r = 0; i.length > r && k[n]; r++) s = i[r], s.matchCondition && (k[n] = k[n] && s.matchCondition(null, e));
						t.matchCondition && (k[n] = k[n] && t.matchCondition(w, e))
					}
					return k[0] || k[1] ? k[0] != k[1] ? k[1] ? R : P : _ : I
				}
				var i, n, s, a, l, h, c, u, p, f, d, m, v, g, y, b, w = [],
					x = [],
					S = !1,
					C = [],
					k = [],
					I = -1,
					_ = 0,
					R = 1,
					P = 2;
				for (c = 0; this.arguments.length > c; c++) if (a = this.arguments[c], l = a.value.eval(e), a.expand && Array.isArray(l.value)) for (l = l.value, u = 0; l.length > u; u++) w.push({
					value: l[u]
				});
				else w.push({
					name: a.name,
					value: l
				});
				for (b = function(t) {
					return t.matchArgs(null, e)
				}, c = 0; e.frames.length > c; c++) if ((i = e.frames[c].find(this.selector, null, b)).length > 0) {
					for (d = !0, u = 0; i.length > u; u++) {
						for (n = i[u].rule, s = i[u].path, f = !1, p = 0; e.frames.length > p; p++) if (!(n instanceof r) && n === (e.frames[p].originalRuleset || e.frames[p])) {
							f = !0;
							break
						}
						f || n.matchArgs(w, e) && (m = {
							mixin: n,
							group: t(n, s)
						}, m.group !== I && C.push(m), S = !0)
					}
					for (o.reset(), g = [0, 0, 0], u = 0; C.length > u; u++) g[C[u].group]++;
					if (g[_] > 0) v = P;
					else if (v = R, g[R] + g[P] > 1) throw {
						type: "Runtime",
						message: "Ambiguous use of `default()` found when matching for `" + this.format(w) + "`",
						index: this.index,
						filename: this.currentFileInfo.filename
					};
					for (u = 0; C.length > u; u++) if (m = C[u].group, m === _ || m === v) try {
						n = C[u].mixin, n instanceof r || (y = n.originalRuleset || n, n = new r("", [], n.rules, null, !1), n.originalRuleset = y), Array.prototype.push.apply(x, n.evalCall(e, w, this.important).rules)
					} catch (L) {
						throw {
							message: L.message,
							index: this.index,
							filename: this.currentFileInfo.filename,
							stack: L.stack
						}
					}
					if (S) {
						if (!this.currentFileInfo || !this.currentFileInfo.reference) for (c = 0; x.length > c; c++) h = x[c], h.markReferenced && h.markReferenced();
						return x
					}
				}
				throw d ? {
					type: "Runtime",
					message: "No matching definition was found for `" + this.format(w) + "`",
					index: this.index,
					filename: this.currentFileInfo.filename
				} : {
					type: "Name",
					message: this.selector.toCSS().trim() + " is undefined",
					index: this.index,
					filename: this.currentFileInfo.filename
				}
			}, s.prototype.format = function(e) {
				return this.selector.toCSS().trim() + "(" + (e ? e.map(function(e) {
					var t = "";
					return e.name && (t += e.name + ":"), t += e.value.toCSS ? e.value.toCSS() : "???"
				}).join(", ") : "") + ")"
			}, t.exports = s
		}, {
			"../functions/default": 19,
			"./mixin-definition": 67,
			"./node": 69,
			"./selector": 76
		}],
		67: [function(e, t) {
			var i = e("./selector"),
				n = e("./element"),
				r = e("./ruleset"),
				o = e("./rule"),
				s = e("./expression"),
				a = e("../contexts"),
				l = function(e, t, r, o, s, a) {
					this.name = e, this.selectors = [new i([new n(null, e, this.index, this.currentFileInfo)])], this.params = t, this.condition = o, this.variadic = s, this.arity = t.length, this.rules = r, this._lookups = {};
					var l = [];
					this.required = t.reduce(function(e, t) {
						return !t.name || t.name && !t.value ? e + 1 : (l.push(t.name), e)
					}, 0), this.optionalParameters = l, this.frames = a
				};
			l.prototype = new r, l.prototype.type = "MixinDefinition", l.prototype.evalFirst = !0, l.prototype.accept = function(e) {
				this.params && this.params.length && (this.params = e.visitArray(this.params)), this.rules = e.visitArray(this.rules), this.condition && (this.condition = e.visit(this.condition))
			}, l.prototype.evalParams = function(e, t, i, n) {
				var l, h, c, u, p, f, d, m, v = new r(null, null),
					g = this.params.slice(0),
					y = 0;
				if (t.frames && t.frames[0] && t.frames[0].functionRegistry && (v.functionRegistry = t.frames[0].functionRegistry.inherit()), t = new a.Eval(t, [v].concat(t.frames)), i) for (i = i.slice(0), y = i.length, c = 0; y > c; c++) if (h = i[c], f = h && h.name) {
					for (d = !1, u = 0; g.length > u; u++) if (!n[u] && f === g[u].name) {
						n[u] = h.value.eval(e), v.prependRule(new o(f, h.value.eval(e))), d = !0;
						break
					}
					if (d) {
						i.splice(c, 1), c--;
						continue
					}
					throw {
						type: "Runtime",
						message: "Named argument for " + this.name + " " + i[c].name + " not found"
					}
				}
				for (m = 0, c = 0; g.length > c; c++) if (!n[c]) {
					if (h = i && i[m], f = g[c].name) if (g[c].variadic) {
						for (l = [], u = m; y > u; u++) l.push(i[u].value.eval(e));
						v.prependRule(new o(f, new s(l).eval(e)))
					} else {
						if (p = h && h.value) p = p.eval(e);
						else {
							if (!g[c].value) throw {
								type: "Runtime",
								message: "wrong number of arguments for " + this.name + " (" + y + " for " + this.arity + ")"
							};
							p = g[c].value.eval(t), v.resetCache()
						}
						v.prependRule(new o(f, p)), n[c] = p
					}
					if (g[c].variadic && i) for (u = m; y > u; u++) n[u] = i[u].value.eval(e);
					m++
				}
				return v
			}, l.prototype.makeImportant = function() {
				var e = this.rules ? this.rules.map(function(e) {
					return e.makeImportant ? e.makeImportant(!0) : e
				}) : this.rules,
					t = new l(this.name, this.params, e, this.condition, this.variadic, this.frames);
				return t
			}, l.prototype.eval = function(e) {
				return new l(this.name, this.params, this.rules, this.condition, this.variadic, this.frames || e.frames.slice(0))
			}, l.prototype.evalCall = function(e, t, i) {
				var n, l, h = [],
					c = this.frames ? this.frames.concat(e.frames) : e.frames,
					u = this.evalParams(e, new a.Eval(e, c), t, h);
				return u.prependRule(new o("@arguments", new s(h).eval(e))), n = this.rules.slice(0), l = new r(null, n), l.originalRuleset = this, l = l.eval(new a.Eval(e, [this, u].concat(c))), i && (l = l.makeImportant()), l
			}, l.prototype.matchCondition = function(e, t) {
				return !this.condition || this.condition.eval(new a.Eval(t, [this.evalParams(t, new a.Eval(t, this.frames ? this.frames.concat(t.frames) : t.frames), e, [])].concat(this.frames || []).concat(t.frames)))
			}, l.prototype.matchArgs = function(e, t) {
				var i, n = e && e.length || 0,
					r = this.optionalParameters,
					o = e ? e.reduce(function(e, t) {
						return r.indexOf(t.name) < 0 ? e + 1 : e
					}, 0) : 0;
				if (this.variadic) {
					if (this.required - 1 > o) return !1
				} else {
					if (this.required > o) return !1;
					if (n > this.params.length) return !1
				}
				i = Math.min(o, this.arity);
				for (var s = 0; i > s; s++) if (!this.params[s].name && !this.params[s].variadic && e[s].value.eval(t).toCSS() != this.params[s].value.eval(t).toCSS()) return !1;
				return !0
			}, t.exports = l
		}, {
			"../contexts": 10,
			"./element": 57,
			"./expression": 58,
			"./rule": 73,
			"./ruleset": 75,
			"./selector": 76
		}],
		68: [function(e, t) {
			var i = e("./node"),
				n = e("./operation"),
				r = e("./dimension"),
				o = function(e) {
					this.value = e
				};
			o.prototype = new i, o.prototype.type = "Negative", o.prototype.genCSS = function(e, t) {
				t.add("-"), this.value.genCSS(e, t)
			}, o.prototype.eval = function(e) {
				return e.isMathOn() ? new n("*", [new r(-1), this.value]).eval(e) : new o(this.value.eval(e))
			}, t.exports = o
		}, {
			"./dimension": 55,
			"./node": 69,
			"./operation": 70
		}],
		69: [function(e, t) {
			var i = function() {};
			i.prototype.toCSS = function(e) {
				var t = [];
				return this.genCSS(e, {
					add: function(e) {
						t.push(e)
					},
					isEmpty: function() {
						return 0 === t.length
					}
				}), t.join("")
			}, i.prototype.genCSS = function(e, t) {
				t.add(this.value)
			}, i.prototype.accept = function(e) {
				this.value = e.visit(this.value)
			}, i.prototype.eval = function() {
				return this
			}, i.prototype._operate = function(e, t, i, n) {
				switch (t) {
					case "+":
						return i + n;
					case "-":
						return i - n;
					case "*":
						return i * n;
					case "/":
						return i / n
				}
			}, i.prototype.fround = function(e, t) {
				var i = e && e.numPrecision;
				return null == i ? t : Number((t + 2e-16).toFixed(i))
			}, i.compare = function(e, t) {
				if (e.compare && "Quoted" !== t.type && "Anonymous" !== t.type) return e.compare(t);
				if (t.compare) return -t.compare(e);
				if (e.type === t.type) {
					if (e = e.value, t = t.value, !Array.isArray(e)) return e === t ? 0 : void 0;
					if (e.length === t.length) {
						for (var n = 0; e.length > n; n++) if (0 !== i.compare(e[n], t[n])) return;
						return 0
					}
				}
			}, i.numericCompare = function(e, t) {
				return t > e ? -1 : e === t ? 0 : e > t ? 1 : void 0
			}, t.exports = i
		}, {}],
		70: [function(e, t) {
			var i = e("./node"),
				n = e("./color"),
				r = e("./dimension"),
				o = function(e, t, i) {
					this.op = e.trim(), this.operands = t, this.isSpaced = i
				};
			o.prototype = new i, o.prototype.type = "Operation", o.prototype.accept = function(e) {
				this.operands = e.visit(this.operands)
			}, o.prototype.eval = function(e) {
				var t = this.operands[0].eval(e),
					i = this.operands[1].eval(e);
				if (e.isMathOn()) {
					if (t instanceof r && i instanceof n && (t = t.toColor()), i instanceof r && t instanceof n && (i = i.toColor()), !t.operate) throw {
						type: "Operation",
						message: "Operation on an invalid type"
					};
					return t.operate(e, this.op, i)
				}
				return new o(this.op, [t, i], this.isSpaced)
			}, o.prototype.genCSS = function(e, t) {
				this.operands[0].genCSS(e, t), this.isSpaced && t.add(" "), t.add(this.op), this.isSpaced && t.add(" "), this.operands[1].genCSS(e, t)
			}, t.exports = o
		}, {
			"./color": 49,
			"./dimension": 55,
			"./node": 69
		}],
		71: [function(e, t) {
			var i = e("./node"),
				n = function(e) {
					this.value = e
				};
			n.prototype = new i, n.prototype.type = "Paren", n.prototype.genCSS = function(e, t) {
				t.add("("), this.value.genCSS(e, t), t.add(")")
			}, n.prototype.eval = function(e) {
				return new n(this.value.eval(e))
			}, t.exports = n
		}, {
			"./node": 69
		}],
		72: [function(e, t) {
			var i = e("./node"),
				n = e("./js-eval-node"),
				r = e("./variable"),
				o = function(e, t, i, n, r) {
					this.escaped = null == i ? !0 : i, this.value = t || "", this.quote = e.charAt(0), this.index = n, this.currentFileInfo = r
				};
			o.prototype = new n, o.prototype.type = "Quoted", o.prototype.genCSS = function(e, t) {
				this.escaped || t.add(this.quote, this.currentFileInfo, this.index), t.add(this.value), this.escaped || t.add(this.quote)
			}, o.prototype.containsVariables = function() {
				return this.value.match(/(`([^`]+)`)|@\{([\w-]+)\}/)
			}, o.prototype.eval = function(e) {
				function t(e, t, i) {
					var n = e;
					do e = n, n = e.replace(t, i);
					while (e !== n);
					return n
				}
				var i = this,
					n = this.value,
					s = function(t, n) {
						return String(i.evaluateJavaScript(n, e))
					}, a = function(t, n) {
						var s = new r("@" + n, i.index, i.currentFileInfo).eval(e, !0);
						return s instanceof o ? s.value : s.toCSS()
					};
				return n = t(n, /`([^`]+)`/g, s), n = t(n, /@\{([\w-]+)\}/g, a), new o(this.quote + n + this.quote, n, this.escaped, this.index, this.currentFileInfo)
			}, o.prototype.compare = function(e) {
				return "Quoted" !== e.type || this.escaped || e.escaped ? e.toCSS && this.toCSS() === e.toCSS() ? 0 : void 0 : i.numericCompare(this.value, e.value)
			}, t.exports = o
		}, {
			"./js-eval-node": 63,
			"./node": 69,
			"./variable": 81
		}],
		73: [function(e, t) {
			function i(e, t) {
				var i, n = "",
					r = t.length,
					o = {
						add: function(e) {
							n += e
						}
					};
				for (i = 0; r > i; i++) t[i].eval(e).genCSS(e, o);
				return n
			}
			var n = e("./node"),
				r = e("./value"),
				o = e("./keyword"),
				s = function(e, t, i, o, s, a, l, h) {
					this.name = e, this.value = t instanceof n ? t : new r([t]), this.important = i ? " " + i.trim() : "", this.merge = o, this.index = s, this.currentFileInfo = a, this.inline = l || !1, this.variable = void 0 !== h ? h : e.charAt && "@" === e.charAt(0)
				};
			s.prototype = new n, s.prototype.type = "Rule", s.prototype.genCSS = function(e, t) {
				t.add(this.name + (e.compress ? ":" : ": "), this.currentFileInfo, this.index);
				try {
					this.value.genCSS(e, t)
				} catch (i) {
					throw i.index = this.index, i.filename = this.currentFileInfo.filename, i
				}
				t.add(this.important + (this.inline || e.lastRule && e.compress ? "" : ";"), this.currentFileInfo, this.index)
			}, s.prototype.eval = function(e) {
				var t, n = !1,
					r = this.name,
					a = this.variable;
				"string" != typeof r && (r = 1 === r.length && r[0] instanceof o ? r[0].value : i(e, r), a = !1), "font" !== r || e.strictMath || (n = !0, e.strictMath = !0);
				try {
					if (e.importantScope.push({}), t = this.value.eval(e), !this.variable && "DetachedRuleset" === t.type) throw {
						message: "Rulesets cannot be evaluated on a property.",
						index: this.index,
						filename: this.currentFileInfo.filename
					};
					var l = this.important,
						h = e.importantScope.pop();
					return !l && h.important && (l = h.important), new s(r, t, l, this.merge, this.index, this.currentFileInfo, this.inline, a)
				} catch (c) {
					throw "number" != typeof c.index && (c.index = this.index, c.filename = this.currentFileInfo.filename), c
				} finally {
					n && (e.strictMath = !1)
				}
			}, s.prototype.makeImportant = function() {
				return new s(this.name, this.value, "!important", this.merge, this.index, this.currentFileInfo, this.inline)
			};
			var a = function(e) {
				Array.isArray(e) ? e.forEach(function(e) {
					a(e)
				}) : e.markReferenced && e.markReferenced()
			};
			s.prototype.markReferenced = function() {
				this.value && a(this.value)
			}, t.exports = s
		}, {
			"./keyword": 64,
			"./node": 69,
			"./value": 80
		}],
		74: [function(e, t) {
			var i = e("./node"),
				n = e("./variable"),
				r = function(e) {
					this.variable = e
				};
			r.prototype = new i, r.prototype.type = "RulesetCall", r.prototype.eval = function(e) {
				var t = new n(this.variable).eval(e);
				return t.callEval(e)
			}, t.exports = r
		}, {
			"./node": 69,
			"./variable": 81
		}],
		75: [function(e, t) {
			var i = e("./node"),
				n = e("./rule"),
				r = e("./selector"),
				o = e("./element"),
				s = e("./paren"),
				a = e("../contexts"),
				l = e("../functions/function-registry"),
				h = e("../functions/default"),
				c = e("./debug-info"),
				u = function(e, t, i) {
					this.selectors = e, this.rules = t, this._lookups = {}, this.strictImports = i
				};
			u.prototype = new i, u.prototype.type = "Ruleset", u.prototype.isRuleset = !0, u.prototype.isRulesetLike = !0, u.prototype.accept = function(e) {
				this.paths ? e.visitArray(this.paths, !0) : this.selectors && (this.selectors = e.visitArray(this.selectors)), this.rules && this.rules.length && (this.rules = e.visitArray(this.rules))
			}, u.prototype.eval = function(e) {
				var t, i, r, o, s = this.selectors,
					a = !1;
				if (s && (i = s.length)) {
					for (t = [], h.error({
						type: "Syntax",
						message: "it is currently only allowed in parametric mixin guards,"
					}), o = 0; i > o; o++) r = s[o].eval(e), t.push(r), r.evaldCondition && (a = !0);
					h.reset()
				} else a = !0;
				var c, p, f = this.rules ? this.rules.slice(0) : null,
					d = new u(t, f, this.strictImports);
				d.originalRuleset = this, d.root = this.root, d.firstRoot = this.firstRoot, d.allowImports = this.allowImports, this.debugInfo && (d.debugInfo = this.debugInfo), a || (f.length = 0), d.functionRegistry = function(e) {
					for (var t, i = 0, n = e.length; i !== n; ++i) if (t = e[i].functionRegistry) return t;
					return l
				}(e.frames).inherit();
				var m = e.frames;
				m.unshift(d);
				var v = e.selectors;
				v || (e.selectors = v = []), v.unshift(this.selectors), (d.root || d.allowImports || !d.strictImports) && d.evalImports(e);
				var g = d.rules,
					y = g ? g.length : 0;
				for (o = 0; y > o; o++) g[o].evalFirst && (g[o] = g[o].eval(e));
				var b = e.mediaBlocks && e.mediaBlocks.length || 0;
				for (o = 0; y > o; o++) "MixinCall" === g[o].type ? (f = g[o].eval(e).filter(function(e) {
					return e instanceof n && e.variable ? !d.variable(e.name) : !0
				}), g.splice.apply(g, [o, 1].concat(f)), y += f.length - 1, o += f.length - 1, d.resetCache()) : "RulesetCall" === g[o].type && (f = g[o].eval(e).rules.filter(function(e) {
					return !(e instanceof n && e.variable)
				}), g.splice.apply(g, [o, 1].concat(f)), y += f.length - 1, o += f.length - 1, d.resetCache());
				for (o = 0; g.length > o; o++) c = g[o], c.evalFirst || (g[o] = c = c.eval ? c.eval(e) : c);
				for (o = 0; g.length > o; o++) if (c = g[o], c instanceof u && c.selectors && 1 === c.selectors.length && c.selectors[0].isJustParentSelector()) {
					g.splice(o--, 1);
					for (var w = 0; c.rules.length > w; w++) p = c.rules[w], p instanceof n && p.variable || g.splice(++o, 0, p)
				}
				if (m.shift(), v.shift(), e.mediaBlocks) for (o = b; e.mediaBlocks.length > o; o++) e.mediaBlocks[o].bubbleSelectors(t);
				return d
			}, u.prototype.evalImports = function(e) {
				var t, i, n = this.rules;
				if (n) for (t = 0; n.length > t; t++) "Import" === n[t].type && (i = n[t].eval(e), i && i.length ? (n.splice.apply(n, [t, 1].concat(i)), t += i.length - 1) : n.splice(t, 1, i), this.resetCache())
			}, u.prototype.makeImportant = function() {
				var e = new u(this.selectors, this.rules.map(function(e) {
					return e.makeImportant ? e.makeImportant() : e
				}), this.strictImports);
				return e
			}, u.prototype.matchArgs = function(e) {
				return !e || 0 === e.length
			}, u.prototype.matchCondition = function(e, t) {
				var i = this.selectors[this.selectors.length - 1];
				return i.evaldCondition ? !i.condition || i.condition.eval(new a.Eval(t, t.frames)) : !1
			}, u.prototype.resetCache = function() {
				this._rulesets = null, this._variables = null, this._lookups = {}
			}, u.prototype.variables = function() {
				return this._variables || (this._variables = this.rules ? this.rules.reduce(function(e, t) {
					if (t instanceof n && t.variable === !0 && (e[t.name] = t), "Import" === t.type && t.root && t.root.variables) {
						var i = t.root.variables();
						for (var r in i) i.hasOwnProperty(r) && (e[r] = i[r])
					}
					return e
				}, {}) : {}), this._variables
			}, u.prototype.variable = function(e) {
				return this.variables()[e]
			}, u.prototype.rulesets = function() {
				if (!this.rules) return [];
				var e, t, i = [],
					n = this.rules,
					r = n.length;
				for (e = 0; r > e; e++) t = n[e], t.isRuleset && i.push(t);
				return i
			}, u.prototype.prependRule = function(e) {
				var t = this.rules;
				t ? t.unshift(e) : this.rules = [e]
			}, u.prototype.find = function(e, t, i) {
				t = t || this;
				var n, o, s = [],
					a = e.toCSS();
				return a in this._lookups ? this._lookups[a] : (this.rulesets().forEach(function(a) {
					if (a !== t) for (var l = 0; a.selectors.length > l; l++) if (n = e.match(a.selectors[l])) {
						if (e.elements.length > n) {
							if (!i || i(a)) {
								o = a.find(new r(e.elements.slice(n)), t, i);
								for (var h = 0; o.length > h; ++h) o[h].path.push(a);
								Array.prototype.push.apply(s, o)
							}
						} else s.push({
							rule: a,
							path: []
						});
						break
					}
				}), this._lookups[a] = s, s)
			}, u.prototype.genCSS = function(e, t) {
				function i(e) {
					return "boolean" == typeof e.isRulesetLike ? e.isRulesetLike : "function" == typeof e.isRulesetLike ? e.isRulesetLike() : !1
				}
				var n, r, o, s, a, l = [],
					h = [];
				e.tabLevel = e.tabLevel || 0, this.root || e.tabLevel++;
				var u, p = e.compress ? "" : Array(e.tabLevel + 1).join("  "),
					f = e.compress ? "" : Array(e.tabLevel).join("  "),
					d = 0,
					m = 0;
				for (n = 0; this.rules.length > n; n++) s = this.rules[n], "Comment" === s.type ? (m === n && m++, h.push(s)) : s.isCharset && s.isCharset() ? (h.splice(d, 0, s), d++, m++) : "Import" === s.type ? (h.splice(m, 0, s), m++) : h.push(s);
				if (h = l.concat(h), !this.root) {
					o = c(e, this, f), o && (t.add(o), t.add(f));
					var v, g = this.paths,
						y = g.length;
					for (u = e.compress ? "," : ",\n" + f, n = 0; y > n; n++) if (a = g[n], v = a.length) for (n > 0 && t.add(u), e.firstSelector = !0, a[0].genCSS(e, t), e.firstSelector = !1, r = 1; v > r; r++) a[r].genCSS(e, t);
					t.add((e.compress ? "{" : " {\n") + p)
				}
				for (n = 0; h.length > n; n++) {
					s = h[n], n + 1 === h.length && (e.lastRule = !0);
					var b = e.lastRule;
					i(s) && (e.lastRule = !1), s.genCSS ? s.genCSS(e, t) : s.value && t.add(s.value.toString()), e.lastRule = b, e.lastRule ? e.lastRule = !1 : t.add(e.compress ? "" : "\n" + p)
				}
				this.root || (t.add(e.compress ? "}" : "\n" + f + "}"), e.tabLevel--), t.isEmpty() || e.compress || !this.firstRoot || t.add("\n")
			}, u.prototype.markReferenced = function() {
				var e;
				if (this.selectors) for (e = 0; this.selectors.length > e; e++) this.selectors[e].markReferenced();
				if (this.rules) for (e = 0; this.rules.length > e; e++) this.rules[e].markReferenced && this.rules[e].markReferenced()
			}, u.prototype.getIsReferenced = function() {
				var e, t, i, n;
				if (this.paths) for (e = 0; this.paths.length > e; e++) for (i = this.paths[e], t = 0; i.length > t; t++) if (i[t].getIsReferenced && i[t].getIsReferenced()) return !0;
				if (this.selectors) for (e = 0; this.selectors.length > e; e++) if (n = this.selectors[e], n.getIsReferenced && n.getIsReferenced()) return !0;
				return !1
			}, u.prototype.joinSelectors = function(e, t, i) {
				for (var n = 0; i.length > n; n++) this.joinSelector(e, t, i[n])
			}, u.prototype.joinSelector = function(e, t, i) {
				function n(e, t) {
					var i, n;
					if (0 === e.length) i = new s(e[0]);
					else {
						var a = [];
						for (n = 0; e.length > n; n++) a.push(new o(null, e[n], t.index, t.currentFileInfo));
						i = new s(new r(a))
					}
					return i
				}
				function a(e, t) {
					var i, n;
					return i = new o(null, e, t.index, t.currentFileInfo), n = new r([i])
				}
				function l(e, t, i) {
					function r(e) {
						var t;
						return "Paren" !== e.value.type ? null : (t = e.value.value, "Selector" !== t.type ? null : t)
					}
					var s, p, f, d, m, v, g, y, b, w, x = !1;
					for (d = [], m = [
						[]
					], s = 0; i.elements.length > s; s++) if (y = i.elements[s], "&" !== y.value) {
						var S = r(y);
						if (null != S) {
							u(d, m);
							var C, k = [],
								I = [];
							for (C = l(k, t, S), x = x || C, f = 0; k.length > f; f++) {
								var _ = a(n(k[f], y), y);
								c(m, [_], y, i, I)
							}
							m = I, d = []
						} else d.push(y)
					} else {
						for (x = !0, v = [], u(d, m), p = 0; m.length > p; p++) if (g = m[p], 0 === t.length) g.length > 0 && g[0].elements.push(new o(y.combinator, "", y.index, y.currentFileInfo)), v.push(g);
						else for (f = 0; t.length > f; f++) {
							var R = h(g, t[f], y, i);
							v.push(R)
						}
						m = v, d = []
					}
					for (u(d, m), s = 0; m.length > s; s++) b = m[s].length, b > 0 && (e.push(m[s]), w = m[s][b - 1], m[s][b - 1] = w.createDerived(w.elements, i.extendList));
					return x
				}
				function h(e, t, i, n) {
					var r, s, a;
					if (r = [], e.length > 0 ? (r = e.slice(0), s = r.pop(), a = n.createDerived(s.elements.slice(0))) : a = n.createDerived([]), t.length > 0) {
						var l = i.combinator,
							h = t[0].elements[0];
						l.emptyOrWhitespace && !h.combinator.emptyOrWhitespace && (l = h.combinator), a.elements.push(new o(l, h.value, i.index, i.currentFileInfo)), a.elements = a.elements.concat(t[0].elements.slice(1))
					}
					return 0 !== a.elements.length && r.push(a), t.length > 1 && (r = r.concat(t.slice(1))), r
				}
				function c(e, t, i, n, r) {
					var o;
					for (o = 0; e.length > o; o++) {
						var s = h(e[o], t, i, n);
						r.push(s)
					}
					return r
				}
				function u(e, t) {
					var i, n;
					if (0 !== e.length) {
						if (0 === t.length) return void t.push([new r(e)]);
						for (i = 0; t.length > i; i++) n = t[i], n.length > 0 ? n[n.length - 1] = n[n.length - 1].createDerived(n[n.length - 1].elements.concat(e)) : n.push(new r(e))
					}
				}
				var p, f, d;
				if (f = [], d = l(f, t, i), !d) if (t.length > 0) for (f = [], p = 0; t.length > p; p++) f.push(t[p].concat(i));
				else f = [
					[i]
				];
				for (p = 0; f.length > p; p++) e.push(f[p])
			}, t.exports = u
		}, {
			"../contexts": 10,
			"../functions/default": 19,
			"../functions/function-registry": 21,
			"./debug-info": 53,
			"./element": 57,
			"./node": 69,
			"./paren": 71,
			"./rule": 73,
			"./selector": 76
		}],
		76: [function(e, t) {
			var i = e("./node"),
				n = e("./element"),
				r = function(e, t, i, n, r, o) {
					this.elements = e, this.extendList = t, this.condition = i, this.currentFileInfo = r || {}, this.isReferenced = o, i || (this.evaldCondition = !0)
				};
			r.prototype = new i, r.prototype.type = "Selector", r.prototype.accept = function(e) {
				this.elements && (this.elements = e.visitArray(this.elements)), this.extendList && (this.extendList = e.visitArray(this.extendList)), this.condition && (this.condition = e.visit(this.condition))
			}, r.prototype.createDerived = function(e, t, i) {
				i = null != i ? i : this.evaldCondition;
				var n = new r(e, t || this.extendList, null, this.index, this.currentFileInfo, this.isReferenced);
				return n.evaldCondition = i, n.mediaEmpty = this.mediaEmpty, n
			}, r.prototype.createEmptySelectors = function() {
				var e = new n("", "&", this.index, this.currentFileInfo),
					t = [new r([e], null, null, this.index, this.currentFileInfo)];
				return t[0].mediaEmpty = !0, t
			}, r.prototype.match = function(e) {
				var t, i, n = this.elements,
					r = n.length;
				if (e.CacheElements(), t = e._elements.length, 0 === t || t > r) return 0;
				for (i = 0; t > i; i++) if (n[i].value !== e._elements[i]) return 0;
				return t
			}, r.prototype.CacheElements = function() {
				if (!this._elements) {
					var e = this.elements.map(function(e) {
						return e.combinator.value + (e.value.value || e.value)
					}).join("").match(/[,&#\*\.\w-]([\w-]|(\\.))*/g);
					e ? "&" === e[0] && e.shift() : e = [], this._elements = e
				}
			}, r.prototype.isJustParentSelector = function() {
				return !this.mediaEmpty && 1 === this.elements.length && "&" === this.elements[0].value && (" " === this.elements[0].combinator.value || "" === this.elements[0].combinator.value)
			}, r.prototype.eval = function(e) {
				var t = this.condition && this.condition.eval(e),
					i = this.elements,
					n = this.extendList;
				return i = i && i.map(function(t) {
					return t.eval(e)
				}), n = n && n.map(function(t) {
					return t.eval(e)
				}), this.createDerived(i, n, t)
			}, r.prototype.genCSS = function(e, t) {
				var i, n;
				if (e && e.firstSelector || "" !== this.elements[0].combinator.value || t.add(" ", this.currentFileInfo, this.index), !this._css) for (i = 0; this.elements.length > i; i++) n = this.elements[i], n.genCSS(e, t)
			}, r.prototype.markReferenced = function() {
				this.isReferenced = !0
			}, r.prototype.getIsReferenced = function() {
				return !this.currentFileInfo.reference || this.isReferenced
			}, r.prototype.getIsOutput = function() {
				return this.evaldCondition
			}, t.exports = r
		}, {
			"./element": 57,
			"./node": 69
		}],
		77: [function(e, t) {
			var i = e("./node"),
				n = function(e) {
					this.value = e
				};
			n.prototype = new i, n.prototype.type = "UnicodeDescriptor", t.exports = n
		}, {
			"./node": 69
		}],
		78: [function(e, t) {
			var i = e("./node"),
				n = e("../data/unit-conversions"),
				r = function(e, t, i) {
					this.numerator = e ? e.slice(0).sort() : [], this.denominator = t ? t.slice(0).sort() : [], i ? this.backupUnit = i : e && e.length && (this.backupUnit = e[0])
				};
			r.prototype = new i, r.prototype.type = "Unit", r.prototype.clone = function() {
				return new r(this.numerator.slice(0), this.denominator.slice(0), this.backupUnit)
			}, r.prototype.genCSS = function(e, t) {
				var i = e && e.strictUnits;
				1 === this.numerator.length ? t.add(this.numerator[0]) : !i && this.backupUnit ? t.add(this.backupUnit) : !i && this.denominator.length && t.add(this.denominator[0])
			}, r.prototype.toString = function() {
				var e, t = this.numerator.join("*");
				for (e = 0; this.denominator.length > e; e++) t += "/" + this.denominator[e];
				return t
			}, r.prototype.compare = function(e) {
				return this.is(e.toString()) ? 0 : void 0
			}, r.prototype.is = function(e) {
				return this.toString().toUpperCase() === e.toUpperCase()
			}, r.prototype.isLength = function() {
				return Boolean(this.toCSS().match(/px|em|%|in|cm|mm|pc|pt|ex/))
			}, r.prototype.isEmpty = function() {
				return 0 === this.numerator.length && 0 === this.denominator.length
			}, r.prototype.isSingular = function() {
				return 1 >= this.numerator.length && 0 === this.denominator.length
			}, r.prototype.map = function(e) {
				var t;
				for (t = 0; this.numerator.length > t; t++) this.numerator[t] = e(this.numerator[t], !1);
				for (t = 0; this.denominator.length > t; t++) this.denominator[t] = e(this.denominator[t], !0)
			}, r.prototype.usedUnits = function() {
				var e, t, i = {};
				t = function(t) {
					return e.hasOwnProperty(t) && !i[r] && (i[r] = t), t
				};
				for (var r in n) n.hasOwnProperty(r) && (e = n[r], this.map(t));
				return i
			}, r.prototype.cancel = function() {
				var e, t, i = {};
				for (t = 0; this.numerator.length > t; t++) e = this.numerator[t], i[e] = (i[e] || 0) + 1;
				for (t = 0; this.denominator.length > t; t++) e = this.denominator[t], i[e] = (i[e] || 0) - 1;
				this.numerator = [], this.denominator = [];
				for (e in i) if (i.hasOwnProperty(e)) {
					var n = i[e];
					if (n > 0) for (t = 0; n > t; t++) this.numerator.push(e);
					else if (0 > n) for (t = 0; - n > t; t++) this.denominator.push(e)
				}
				this.numerator.sort(), this.denominator.sort()
			}, t.exports = r
		}, {
			"../data/unit-conversions": 13,
			"./node": 69
		}],
		79: [function(e, t) {
			var i = e("./node"),
				n = function(e, t, i, n) {
					this.value = e, this.currentFileInfo = i, this.index = t, this.isEvald = n
				};
			n.prototype = new i, n.prototype.type = "Url", n.prototype.accept = function(e) {
				this.value = e.visit(this.value)
			}, n.prototype.genCSS = function(e, t) {
				t.add("url("), this.value.genCSS(e, t), t.add(")")
			}, n.prototype.eval = function(e) {
				var t, i = this.value.eval(e);
				if (!this.isEvald && (t = this.currentFileInfo && this.currentFileInfo.rootpath, t && "string" == typeof i.value && e.isPathRelative(i.value) && (i.quote || (t = t.replace(/[\(\)'"\s]/g, function(e) {
					return "\\" + e
				})), i.value = t + i.value), i.value = e.normalizePath(i.value), e.urlArgs && !i.value.match(/^\s*data:/))) {
					var r = -1 === i.value.indexOf("?") ? "?" : "&",
						o = r + e.urlArgs; - 1 !== i.value.indexOf("#") ? i.value = i.value.replace("#", o + "#") : i.value += o
				}
				return new n(i, this.index, this.currentFileInfo, !0)
			}, t.exports = n
		}, {
			"./node": 69
		}],
		80: [function(e, t) {
			var i = e("./node"),
				n = function(e) {
					if (this.value = e, !e) throw new Error("Value requires an array argument")
				};
			n.prototype = new i, n.prototype.type = "Value", n.prototype.accept = function(e) {
				this.value && (this.value = e.visitArray(this.value))
			}, n.prototype.eval = function(e) {
				return 1 === this.value.length ? this.value[0].eval(e) : new n(this.value.map(function(t) {
					return t.eval(e)
				}))
			}, n.prototype.genCSS = function(e, t) {
				var i;
				for (i = 0; this.value.length > i; i++) this.value[i].genCSS(e, t), this.value.length > i + 1 && t.add(e && e.compress ? "," : ", ")
			}, t.exports = n
		}, {
			"./node": 69
		}],
		81: [function(e, t) {
			var i = e("./node"),
				n = function(e, t, i) {
					this.name = e, this.index = t, this.currentFileInfo = i || {}
				};
			n.prototype = new i, n.prototype.type = "Variable", n.prototype.eval = function(e) {
				var t, i = this.name;
				if (0 === i.indexOf("@@") && (i = "@" + new n(i.slice(1), this.index, this.currentFileInfo).eval(e).value), this.evaluating) throw {
					type: "Name",
					message: "Recursive variable definition for " + i,
					filename: this.currentFileInfo.filename,
					index: this.index
				};
				if (this.evaluating = !0, t = this.find(e.frames, function(t) {
					var n = t.variable(i);
					if (n) {
						if (n.important) {
							var r = e.importantScope[e.importantScope.length - 1];
							r.important = n.important
						}
						return n.value.eval(e)
					}
				})) return this.evaluating = !1, t;
				throw {
					type: "Name",
					message: "variable " + i + " is undefined",
					filename: this.currentFileInfo.filename,
					index: this.index
				}
			}, n.prototype.find = function(e, t) {
				for (var i, n = 0; e.length > n; n++) if (i = t.call(e, e[n])) return i;
				return null
			}, t.exports = n
		}, {
			"./node": 69
		}],
		82: [function(e, t) {
			t.exports = {
				getLocation: function(e, t) {
					for (var i = e + 1, n = null, r = -1; --i >= 0 && "\n" !== t.charAt(i);) r++;
					return "number" == typeof e && (n = (t.slice(0, e).match(/\n/g) || "").length), {
						line: n,
						column: r
					}
				}
			}
		}, {}],
		83: [function(e, t) {
			var i = e("../tree"),
				n = e("./visitor"),
				r = e("../logger"),
				o = function() {
					this._visitor = new n(this), this.contexts = [], this.allExtendsStack = [
						[]
					]
				};
			o.prototype = {
				run: function(e) {
					return e = this._visitor.visit(e),
					e.allExtends = this.allExtendsStack[0], e
				},
				visitRule: function(e, t) {
					t.visitDeeper = !1
				},
				visitMixinDefinition: function(e, t) {
					t.visitDeeper = !1
				},
				visitRuleset: function(e) {
					if (!e.root) {
						var t, n, r, o, s = [],
							a = e.rules,
							l = a ? a.length : 0;
						for (t = 0; l > t; t++) e.rules[t] instanceof i.Extend && (s.push(a[t]), e.extendOnEveryPath = !0);
						var h = e.paths;
						for (t = 0; h.length > t; t++) {
							var c = h[t],
								u = c[c.length - 1],
								p = u.extendList;
							for (o = p ? p.slice(0).concat(s) : s, o && (o = o.map(function(e) {
								return e.clone()
							})), n = 0; o.length > n; n++) this.foundExtends = !0, r = o[n], r.findSelfSelectors(c), r.ruleset = e, 0 === n && (r.firstExtendOnThisSelectorPath = !0), this.allExtendsStack[this.allExtendsStack.length - 1].push(r)
						}
						this.contexts.push(e.selectors)
					}
				},
				visitRulesetOut: function(e) {
					e.root || (this.contexts.length = this.contexts.length - 1)
				},
				visitMedia: function(e) {
					e.allExtends = [], this.allExtendsStack.push(e.allExtends)
				},
				visitMediaOut: function() {
					this.allExtendsStack.length = this.allExtendsStack.length - 1
				},
				visitDirective: function(e) {
					e.allExtends = [], this.allExtendsStack.push(e.allExtends)
				},
				visitDirectiveOut: function() {
					this.allExtendsStack.length = this.allExtendsStack.length - 1
				}
			};
			var s = function() {
				this._visitor = new n(this)
			};
			s.prototype = {
				run: function(e) {
					var t = new o;
					if (this.extendIndicies = {}, t.run(e), !t.foundExtends) return e;
					e.allExtends = e.allExtends.concat(this.doExtendChaining(e.allExtends, e.allExtends)), this.allExtendsStack = [e.allExtends];
					var i = this._visitor.visit(e);
					return this.checkExtendsForNonMatched(e.allExtends), i
				},
				checkExtendsForNonMatched: function(e) {
					var t = this.extendIndicies;
					e.filter(function(e) {
						return !e.hasFoundMatches && 1 == e.parent_ids.length
					}).forEach(function(e) {
						var i = "_unknown_";
						try {
							i = e.selector.toCSS({})
						} catch (n) {}
						t[e.index + " " + i] || (t[e.index + " " + i] = !0, r.warn("extend '" + i + "' has no matches"))
					})
				},
				doExtendChaining: function(e, t, n) {
					var r, o, s, a, l, h, c, u, p = [],
						f = this;
					for (n = n || 0, r = 0; e.length > r; r++) for (o = 0; t.length > o; o++) h = e[r], c = t[o], h.parent_ids.indexOf(c.object_id) >= 0 || (l = [c.selfSelectors[0]], s = f.findMatch(h, l), s.length && (h.hasFoundMatches = !0, h.selfSelectors.forEach(function(e) {
						a = f.extendSelector(s, l, e), u = new i.Extend(c.selector, c.option, 0), u.selfSelectors = a, a[a.length - 1].extendList = [u], p.push(u), u.ruleset = c.ruleset, u.parent_ids = u.parent_ids.concat(c.parent_ids, h.parent_ids), c.firstExtendOnThisSelectorPath && (u.firstExtendOnThisSelectorPath = !0, c.ruleset.paths.push(a))
					})));
					if (p.length) {
						if (this.extendChainCount++, n > 100) {
							var d = "{unable to calculate}",
								m = "{unable to calculate}";
							try {
								d = p[0].selfSelectors[0].toCSS(), m = p[0].selector.toCSS()
							} catch (v) {}
							throw {
								message: "extend circular reference detected. One of the circular extends is currently:" + d + ":extend(" + m + ")"
							}
						}
						return p.concat(f.doExtendChaining(p, t, n + 1))
					}
					return p
				},
				visitRule: function(e, t) {
					t.visitDeeper = !1
				},
				visitMixinDefinition: function(e, t) {
					t.visitDeeper = !1
				},
				visitSelector: function(e, t) {
					t.visitDeeper = !1
				},
				visitRuleset: function(e) {
					if (!e.root) {
						var t, i, n, r, o = this.allExtendsStack[this.allExtendsStack.length - 1],
							s = [],
							a = this;
						for (n = 0; o.length > n; n++) for (i = 0; e.paths.length > i; i++) if (r = e.paths[i], !e.extendOnEveryPath) {
							var l = r[r.length - 1].extendList;
							l && l.length || (t = this.findMatch(o[n], r), t.length && (o[n].hasFoundMatches = !0, o[n].selfSelectors.forEach(function(e) {
								s.push(a.extendSelector(t, r, e))
							})))
						}
						e.paths = e.paths.concat(s)
					}
				},
				findMatch: function(e, t) {
					var i, n, r, o, s, a, l, h = this,
						c = e.selector.elements,
						u = [],
						p = [];
					for (i = 0; t.length > i; i++) for (n = t[i], r = 0; n.elements.length > r; r++) for (o = n.elements[r], (e.allowBefore || 0 === i && 0 === r) && u.push({
						pathIndex: i,
						index: r,
						matched: 0,
						initialCombinator: o.combinator
					}), a = 0; u.length > a; a++) l = u[a], s = o.combinator.value, "" === s && 0 === r && (s = " "), !h.isElementValuesEqual(c[l.matched].value, o.value) || l.matched > 0 && c[l.matched].combinator.value !== s ? l = null : l.matched++, l && (l.finished = l.matched === c.length, l.finished && !e.allowAfter && (n.elements.length > r + 1 || t.length > i + 1) && (l = null)), l ? l.finished && (l.length = c.length, l.endPathIndex = i, l.endPathElementIndex = r + 1, u.length = 0, p.push(l)) : (u.splice(a, 1), a--);
					return p
				},
				isElementValuesEqual: function(e, t) {
					if ("string" == typeof e || "string" == typeof t) return e === t;
					if (e instanceof i.Attribute) return e.op !== t.op || e.key !== t.key ? !1 : e.value && t.value ? (e = e.value.value || e.value, t = t.value.value || t.value, e === t) : !e.value && !t.value;
					if (e = e.value, t = t.value, e instanceof i.Selector) {
						if (!(t instanceof i.Selector) || e.elements.length !== t.elements.length) return !1;
						for (var n = 0; e.elements.length > n; n++) {
							if (e.elements[n].combinator.value !== t.elements[n].combinator.value && (0 !== n || (e.elements[n].combinator.value || " ") !== (t.elements[n].combinator.value || " "))) return !1;
							if (!this.isElementValuesEqual(e.elements[n].value, t.elements[n].value)) return !1
						}
						return !0
					}
					return !1
				},
				extendSelector: function(e, t, n) {
					var r, o, s, a, l, h = 0,
						c = 0,
						u = [];
					for (r = 0; e.length > r; r++) a = e[r], o = t[a.pathIndex], s = new i.Element(a.initialCombinator, n.elements[0].value, n.elements[0].index, n.elements[0].currentFileInfo), a.pathIndex > h && c > 0 && (u[u.length - 1].elements = u[u.length - 1].elements.concat(t[h].elements.slice(c)), c = 0, h++), l = o.elements.slice(c, a.index).concat([s]).concat(n.elements.slice(1)), h === a.pathIndex && r > 0 ? u[u.length - 1].elements = u[u.length - 1].elements.concat(l) : (u = u.concat(t.slice(h, a.pathIndex)), u.push(new i.Selector(l))), h = a.endPathIndex, c = a.endPathElementIndex, c >= t[h].elements.length && (c = 0, h++);
					return t.length > h && c > 0 && (u[u.length - 1].elements = u[u.length - 1].elements.concat(t[h].elements.slice(c)), h++), u = u.concat(t.slice(h, t.length))
				},
				visitRulesetOut: function() {},
				visitMedia: function(e) {
					var t = e.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
					t = t.concat(this.doExtendChaining(t, e.allExtends)), this.allExtendsStack.push(t)
				},
				visitMediaOut: function() {
					var e = this.allExtendsStack.length - 1;
					this.allExtendsStack.length = e
				},
				visitDirective: function(e) {
					var t = e.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length - 1]);
					t = t.concat(this.doExtendChaining(t, e.allExtends)), this.allExtendsStack.push(t)
				},
				visitDirectiveOut: function() {
					var e = this.allExtendsStack.length - 1;
					this.allExtendsStack.length = e
				}
			}, t.exports = s
		}, {
			"../logger": 32,
			"../tree": 61,
			"./visitor": 89
		}],
		84: [function(e, t) {
			function i(e) {
				this.imports = [], this.variableImports = [], this._onSequencerEmpty = e, this._currentDepth = 0
			}
			i.prototype.addImport = function(e) {
				var t = this,
					i = {
						callback: e,
						args: null,
						isReady: !1
					};
				return this.imports.push(i),
				function() {
					i.args = Array.prototype.slice.call(arguments, 0), i.isReady = !0, t.tryRun()
				}
			}, i.prototype.addVariableImport = function(e) {
				this.variableImports.push(e)
			}, i.prototype.tryRun = function() {
				this._currentDepth++;
				try {
					for (;;) {
						for (; this.imports.length > 0;) {
							var e = this.imports[0];
							if (!e.isReady) return;
							this.imports = this.imports.slice(1), e.callback.apply(null, e.args)
						}
						if (0 === this.variableImports.length) break;
						var t = this.variableImports[0];
						this.variableImports = this.variableImports.slice(1), t()
					}
				} finally {
					this._currentDepth--
				}
				0 === this._currentDepth && this._onSequencerEmpty && this._onSequencerEmpty()
			}, t.exports = i
		}, {}],
		85: [function(e, t) {
			var i = e("../contexts"),
				n = e("./visitor"),
				r = e("./import-sequencer"),
				o = function(e, t) {
					this._visitor = new n(this), this._importer = e, this._finish = t, this.context = new i.Eval, this.importCount = 0, this.onceFileDetectionMap = {}, this.recursionDetector = {}, this._sequencer = new r(this._onSequencerEmpty.bind(this))
				};
			o.prototype = {
				isReplacing: !1,
				run: function(e) {
					try {
						this._visitor.visit(e)
					} catch (t) {
						this.error = t
					}
					this.isFinished = !0, this._sequencer.tryRun()
				},
				_onSequencerEmpty: function() {
					this.isFinished && this._finish(this.error)
				},
				visitImport: function(e, t) {
					var n = e.options.inline;
					if (!e.css || n) {
						var r = new i.Eval(this.context, this.context.frames.slice(0)),
							o = r.frames[0];
						this.importCount++, e.isVariableImport() ? this._sequencer.addVariableImport(this.processImportNode.bind(this, e, r, o)) : this.processImportNode(e, r, o)
					}
					t.visitDeeper = !1
				},
				processImportNode: function(e, t, i) {
					var n, r = e.options.inline;
					try {
						n = e.evalForImport(t)
					} catch (o) {
						o.filename || (o.index = e.index, o.filename = e.currentFileInfo.filename), e.css = !0, e.error = o
					}
					if (!n || n.css && !r) this.importCount--, this.isFinished && this._sequencer.tryRun();
					else {
						n.options.multiple && (t.importMultiple = !0);
						for (var s = void 0 === n.css, a = 0; i.rules.length > a; a++) if (i.rules[a] === e) {
							i.rules[a] = n;
							break
						}
						var l = this.onImported.bind(this, n, t),
							h = this._sequencer.addImport(l);
						this._importer.push(n.getPath(), s, n.currentFileInfo, n.options, h)
					}
				},
				onImported: function(e, t, i, n, r, o) {
					i && (i.filename || (i.index = e.index, i.filename = e.currentFileInfo.filename), this.error = i);
					var s = this,
						a = e.options.inline,
						l = e.options.plugin,
						h = e.options.optional,
						c = r || o in s.recursionDetector;
					if (t.importMultiple || (e.skip = c ? !0 : function() {
						return o in s.onceFileDetectionMap ? !0 : (s.onceFileDetectionMap[o] = !0, !1)
					}), !o && h && (e.skip = !0), n && (e.root = n, e.importedFilename = o, !(a || l || !t.importMultiple && c))) {
						s.recursionDetector[o] = !0;
						var u = this.context;
						this.context = t;
						try {
							this._visitor.visit(n)
						} catch (i) {
							this.error = i
						}
						this.context = u
					}
					s.importCount--, s.isFinished && s._sequencer.tryRun()
				},
				visitRule: function(e, t) {
					"DetachedRuleset" === e.value.type ? this.context.frames.unshift(e) : t.visitDeeper = !1
				},
				visitRuleOut: function(e) {
					"DetachedRuleset" === e.value.type && this.context.frames.shift()
				},
				visitDirective: function(e) {
					this.context.frames.unshift(e)
				},
				visitDirectiveOut: function() {
					this.context.frames.shift()
				},
				visitMixinDefinition: function(e) {
					this.context.frames.unshift(e)
				},
				visitMixinDefinitionOut: function() {
					this.context.frames.shift()
				},
				visitRuleset: function(e) {
					this.context.frames.unshift(e)
				},
				visitRulesetOut: function() {
					this.context.frames.shift()
				},
				visitMedia: function(e) {
					this.context.frames.unshift(e.rules[0])
				},
				visitMediaOut: function() {
					this.context.frames.shift()
				}
			}, t.exports = o
		}, {
			"../contexts": 10,
			"./import-sequencer": 84,
			"./visitor": 89
		}],
		86: [function(e, t) {
			var i = {
				Visitor: e("./visitor"),
				ImportVisitor: e("./import-visitor"),
				ExtendVisitor: e("./extend-visitor"),
				JoinSelectorVisitor: e("./join-selector-visitor"),
				ToCSSVisitor: e("./to-css-visitor")
			};
			t.exports = i
		}, {
			"./extend-visitor": 83,
			"./import-visitor": 85,
			"./join-selector-visitor": 87,
			"./to-css-visitor": 88,
			"./visitor": 89
		}],
		87: [function(e, t) {
			var i = e("./visitor"),
				n = function() {
					this.contexts = [
						[]
					], this._visitor = new i(this)
				};
			n.prototype = {
				run: function(e) {
					return this._visitor.visit(e)
				},
				visitRule: function(e, t) {
					t.visitDeeper = !1
				},
				visitMixinDefinition: function(e, t) {
					t.visitDeeper = !1
				},
				visitRuleset: function(e) {
					var t, i = this.contexts[this.contexts.length - 1],
						n = [];
					this.contexts.push(n), e.root || (t = e.selectors, t && (t = t.filter(function(e) {
						return e.getIsOutput()
					}), e.selectors = t.length ? t : t = null, t && e.joinSelectors(n, i, t)), t || (e.rules = null), e.paths = n)
				},
				visitRulesetOut: function() {
					this.contexts.length = this.contexts.length - 1
				},
				visitMedia: function(e) {
					var t = this.contexts[this.contexts.length - 1];
					e.rules[0].root = 0 === t.length || t[0].multiMedia
				},
				visitDirective: function(e) {
					var t = this.contexts[this.contexts.length - 1];
					e.rules && e.rules.length && (e.rules[0].root = e.isRooted || 0 === t.length || null)
				}
			}, t.exports = n
		}, {
			"./visitor": 89
		}],
		88: [function(e, t) {
			var i = e("../tree"),
				n = e("./visitor"),
				r = function(e) {
					this._visitor = new n(this), this._context = e
				};
			r.prototype = {
				isReplacing: !0,
				run: function(e) {
					return this._visitor.visit(e)
				},
				visitRule: function(e) {
					return e.variable ? void 0 : e
				},
				visitMixinDefinition: function(e) {
					e.frames = []
				},
				visitExtend: function() {},
				visitComment: function(e) {
					return e.isSilent(this._context) ? void 0 : e
				},
				visitMedia: function(e, t) {
					return e.accept(this._visitor), t.visitDeeper = !1, e.rules.length ? e : void 0
				},
				visitImport: function(e) {
					return void 0 !== e.path.currentFileInfo.reference && e.css ? void 0 : e
				},
				visitDirective: function(e, t) {
					function n(e) {
						var t, i = e.rules;
						1 !== i.length || i[0].paths && 0 !== i[0].paths.length || (i = i[0].rules);
						for (var n = 0; i.length > n; n++) if (t = i[n], t.getIsReferenced && t.getIsReferenced()) return !0;
						return !1
					}
					if ("@charset" === e.name) {
						if (!e.getIsReferenced()) return;
						if (this.charset) {
							if (e.debugInfo) {
								var r = new i.Comment("/* " + e.toCSS(this._context).replace(/\n/g, "") + " */\n");
								return r.debugInfo = e.debugInfo, this._visitor.visit(r)
							}
							return
						}
						this.charset = !0
					}
					if (e.rules && e.rules.length) {
						if (this._mergeRules(e.rules[0].rules), e.accept(this._visitor), t.visitDeeper = !1, e.getIsReferenced()) return e;
						if (!e.rules || !e.rules.length) return;
						if (n(e)) return e.markReferenced(), e
					} else if (e.getIsReferenced()) return e
				},
				checkPropertiesInRoot: function(e) {
					for (var t, n = 0; e.length > n; n++) if (t = e[n], t instanceof i.Rule && !t.variable) throw {
						message: "properties must be inside selector blocks, they cannot be in the root.",
						index: t.index,
						filename: t.currentFileInfo ? t.currentFileInfo.filename : null
					}
				},
				visitRuleset: function(e, t) {
					var n, r = [];
					if (e.firstRoot && this.checkPropertiesInRoot(e.rules), e.root) e.accept(this._visitor), t.visitDeeper = !1, (e.firstRoot || e.rules && e.rules.length > 0) && r.splice(0, 0, e);
					else {
						e.paths && (e.paths = e.paths.filter(function(e) {
							var t;
							for (" " === e[0].elements[0].combinator.value && (e[0].elements[0].combinator = new i.Combinator("")), t = 0; e.length > t; t++) if (e[t].getIsReferenced() && e[t].getIsOutput()) return !0;
							return !1
						}));
						for (var o = e.rules, s = o ? o.length : 0, a = 0; s > a;) n = o[a], n && n.rules ? (r.push(this._visitor.visit(n)), o.splice(a, 1), s--) : a++;
						s > 0 ? e.accept(this._visitor) : e.rules = null, t.visitDeeper = !1, o = e.rules, o && (this._mergeRules(o), o = e.rules), o && (this._removeDuplicateRules(o), o = e.rules), o && o.length > 0 && e.paths.length > 0 && r.splice(0, 0, e)
					}
					return 1 === r.length ? r[0] : r
				},
				_removeDuplicateRules: function(e) {
					if (e) {
						var t, n, r, o = {};
						for (r = e.length - 1; r >= 0; r--) if (n = e[r], n instanceof i.Rule) if (o[n.name]) {
							t = o[n.name], t instanceof i.Rule && (t = o[n.name] = [o[n.name].toCSS(this._context)]);
							var s = n.toCSS(this._context); - 1 !== t.indexOf(s) ? e.splice(r, 1) : t.push(s)
						} else o[n.name] = n
					}
				},
				_mergeRules: function(e) {
					if (e) {
						for (var t, n, r, o = {}, s = 0; e.length > s; s++) n = e[s], n instanceof i.Rule && n.merge && (r = [n.name, n.important ? "!" : ""].join(","), o[r] ? e.splice(s--, 1) : o[r] = [], o[r].push(n));
						Object.keys(o).map(function(e) {
							function r(e) {
								return new i.Expression(e.map(function(e) {
									return e.value
								}))
							}
							function s(e) {
								return new i.Value(e.map(function(e) {
									return e
								}))
							}
							if (t = o[e], t.length > 1) {
								n = t[0];
								var a = [],
									l = [];
								t.map(function(e) {
									"+" === e.merge && (l.length > 0 && a.push(r(l)), l = []), l.push(e)
								}), a.push(r(l)), n.value = s(a)
							}
						})
					}
				},
				visitAnonymous: function(e) {
					return e.getIsReferenced() ? (e.accept(this._visitor), e) : void 0
				}
			}, t.exports = r
		}, {
			"../tree": 61,
			"./visitor": 89
		}],
		89: [function(e, t) {
			function i(e) {
				return e
			}
			function n(e, t) {
				var i, r;
				for (i in e) if (e.hasOwnProperty(i)) switch (r = e[i], typeof r) {
					case "function":
						r.prototype && r.prototype.type && (r.prototype.typeIndex = t++);
						break;
					case "object":
						t = n(r, t)
				}
				return t
			}
			var r = e("../tree"),
				o = {
					visitDeeper: !0
				}, s = !1,
				a = function(e) {
					this._implementation = e, this._visitFnCache = [], s || (n(r, 1), s = !0)
				};
			a.prototype = {
				visit: function(e) {
					if (!e) return e;
					var t = e.typeIndex;
					if (!t) return e;
					var n, r = this._visitFnCache,
						s = this._implementation,
						a = t << 1,
						l = 1 | a,
						h = r[a],
						c = r[l],
						u = o;
					if (u.visitDeeper = !0, h || (n = "visit" + e.type, h = s[n] || i, c = s[n + "Out"] || i, r[a] = h, r[l] = c), h !== i) {
						var p = h.call(s, e, u);
						s.isReplacing && (e = p)
					}
					return u.visitDeeper && e && e.accept && e.accept(this), c != i && c.call(s, e), e
				},
				visitArray: function(e, t) {
					if (!e) return e;
					var i, n = e.length;
					if (t || !this._implementation.isReplacing) {
						for (i = 0; n > i; i++) this.visit(e[i]);
						return e
					}
					var r = [];
					for (i = 0; n > i; i++) {
						var o = this.visit(e[i]);
						void 0 !== o && (o.splice ? o.length && this.flatten(o, r) : r.push(o))
					}
					return r
				},
				flatten: function(e, t) {
					t || (t = []);
					var i, n, r, o, s, a;
					for (n = 0, i = e.length; i > n; n++) if (r = e[n], void 0 !== r) if (r.splice) for (s = 0, o = r.length; o > s; s++) a = r[s], void 0 !== a && (a.splice ? a.length && this.flatten(a, t) : t.push(a));
					else t.push(r);
					return t
				}
			}, t.exports = a
		}, {
			"../tree": 61
		}],
		90: [function(e, t) {
			function i() {
				if (!s) {
					s = !0;
					for (var e, t = o.length; t;) {
						e = o, o = [];
						for (var i = -1; ++i < t;) e[i]();
						t = o.length
					}
					s = !1
				}
			}
			function n() {}
			var r = t.exports = {}, o = [],
				s = !1;
			r.nextTick = function(e) {
				o.push(e), s || setTimeout(i, 0)
			}, r.title = "browser", r.browser = !0, r.env = {}, r.argv = [], r.version = "", r.versions = {}, r.on = n, r.addListener = n, r.once = n, r.off = n, r.removeListener = n, r.removeAllListeners = n, r.emit = n, r.binding = function() {
				throw new Error("process.binding is not supported")
			}, r.cwd = function() {
				return "/"
			}, r.chdir = function() {
				throw new Error("process.chdir is not supported")
			}, r.umask = function() {
				return 0
			}
		}, {}],
		91: [function(e, t) {
			"use strict";

			function i(e) {
				function t(e) {
					return null === l ? void c.push(e) : void o(function() {
						var t = l ? e.onFulfilled : e.onRejected;
						if (null === t) return void(l ? e.resolve : e.reject)(h);
						var i;
						try {
							i = t(h)
						} catch (n) {
							return void e.reject(n)
						}
						e.resolve(i)
					})
				}
				function i(e) {
					try {
						if (e === u) throw new TypeError("A promise cannot be resolved with itself.");
						if (e && ("object" == typeof e || "function" == typeof e)) {
							var t = e.then;
							if ("function" == typeof t) return void r(t.bind(e), i, s)
						}
						l = !0, h = e, a()
					} catch (n) {
						s(n)
					}
				}
				function s(e) {
					l = !1, h = e, a()
				}
				function a() {
					for (var e = 0, i = c.length; i > e; e++) t(c[e]);
					c = null
				}
				if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
				if ("function" != typeof e) throw new TypeError("not a function");
				var l = null,
					h = null,
					c = [],
					u = this;
				this.then = function(e, i) {
					return new u.constructor(function(r, o) {
						t(new n(e, i, r, o))
					})
				}, r(e, i, s)
			}
			function n(e, t, i, n) {
				this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.resolve = i, this.reject = n
			}
			function r(e, t, i) {
				var n = !1;
				try {
					e(function(e) {
						n || (n = !0, t(e))
					}, function(e) {
						n || (n = !0, i(e))
					})
				} catch (r) {
					if (n) return;
					n = !0, i(r)
				}
			}
			var o = e("asap");
			t.exports = i
		}, {
			asap: 93
		}],
		92: [function(e, t) {
			"use strict";

			function i(e) {
				this.then = function(t) {
					return "function" != typeof t ? this : new n(function(i, n) {
						r(function() {
							try {
								i(t(e))
							} catch (r) {
								n(r)
							}
						})
					})
				}
			}
			var n = e("./core.js"),
				r = e("asap");
			t.exports = n, i.prototype = n.prototype;
			var o = new i(!0),
				s = new i(!1),
				a = new i(null),
				l = new i(void 0),
				h = new i(0),
				c = new i("");
			n.resolve = function(e) {
				if (e instanceof n) return e;
				if (null === e) return a;
				if (void 0 === e) return l;
				if (e === !0) return o;
				if (e === !1) return s;
				if (0 === e) return h;
				if ("" === e) return c;
				if ("object" == typeof e || "function" == typeof e) try {
					var t = e.then;
					if ("function" == typeof t) return new n(t.bind(e))
				} catch (r) {
					return new n(function(e, t) {
						t(r)
					})
				}
				return new i(e)
			}, n.all = function(e) {
				var t = Array.prototype.slice.call(e);
				return new n(function(e, i) {
					function n(o, s) {
						try {
							if (s && ("object" == typeof s || "function" == typeof s)) {
								var a = s.then;
								if ("function" == typeof a) return void a.call(s, function(e) {
									n(o, e)
								}, i)
							}
							t[o] = s, 0 === --r && e(t)
						} catch (l) {
							i(l)
						}
					}
					if (0 === t.length) return e([]);
					for (var r = t.length, o = 0; t.length > o; o++) n(o, t[o])
				})
			}, n.reject = function(e) {
				return new n(function(t, i) {
					i(e)
				})
			}, n.race = function(e) {
				return new n(function(t, i) {
					e.forEach(function(e) {
						n.resolve(e).then(t, i)
					})
				})
			}, n.prototype["catch"] = function(e) {
				return this.then(null, e)
			}
		}, {
			"./core.js": 91,
			asap: 93
		}],
		93: [function(e, t) {
			(function(e) {
				function i() {
					for (; r.next;) {
						r = r.next;
						var e = r.task;
						r.task = void 0;
						var t = r.domain;
						t && (r.domain = void 0, t.enter());
						try {
							e()
						} catch (n) {
							if (l) throw t && t.exit(), setTimeout(i, 0), t && t.enter(), n;
							setTimeout(function() {
								throw n
							}, 0)
						}
						t && t.exit()
					}
					s = !1
				}
				function n(t) {
					o = o.next = {
						task: t,
						domain: l && e.domain,
						next: null
					}, s || (s = !0, a())
				}
				var r = {
					task: void 0,
					next: null
				}, o = r,
					s = !1,
					a = void 0,
					l = !1;
				if ("undefined" != typeof e && e.nextTick) l = !0, a = function() {
					e.nextTick(i)
				};
				else if ("function" == typeof setImmediate) a = "undefined" != typeof window ? setImmediate.bind(window, i) : function() {
					setImmediate(i)
				};
				else if ("undefined" != typeof MessageChannel) {
					var h = new MessageChannel;
					h.port1.onmessage = i, a = function() {
						h.port2.postMessage(0)
					}
				} else a = function() {
					setTimeout(i, 0)
				};
				t.exports = n
			}).call(this, e("_process"))
		}, {
			_process: 90
		}],
		94: [function() {
			"function" != typeof Promise.prototype.done && (Promise.prototype.done = function() {
				var e = arguments.length ? this.then.apply(this, arguments) : this;
				e.then(null, function(e) {
					setTimeout(function() {
						throw e
					}, 0)
				})
			})
		}, {}],
		95: [function(e) {
			e("asap"), "undefined" == typeof Promise && (Promise = e("./lib/core.js"), e("./lib/es6-extensions.js")), e("./polyfill-done.js")
		}, {
			"./lib/core.js": 91,
			"./lib/es6-extensions.js": 92,
			"./polyfill-done.js": 94,
			asap: 93
		}]
	}, {}, [2])(2)
}),
function(e, t) {
	function i(e, t) {
		for (var i in t) try {
			e.style[i] = t[i]
		} catch (n) {}
		return e
	}
	function n(e) {
		return null == e ? String(e) : "object" == typeof e || "function" == typeof e ? Object.prototype.toString.call(e).match(/\s([a-z]+)/i)[1].toLowerCase() || "object" : typeof e
	}
	function r(e, t) {
		if ("array" !== n(t)) return -1;
		if (t.indexOf) return t.indexOf(e);
		for (var i = 0, r = t.length; r > i; i++) if (t[i] === e) return i;
		return -1
	}
	function o() {
		var e, t = arguments;
		for (e in t[1]) if (t[1].hasOwnProperty(e)) switch (n(t[1][e])) {
			case "object":
				t[0][e] = o({}, t[0][e], t[1][e]);
				break;
			case "array":
				t[0][e] = t[1][e].slice(0);
				break;
			default:
				t[0][e] = t[1][e]
		}
		return 2 < t.length ? o.apply(null, [t[0]].concat(Array.prototype.slice.call(t, 2))) : t[0]
	}
	function s(e) {
		return e = Math.round(255 * e).toString(16), 1 === e.length ? "0" + e : e
	}
	function a(e, t, i, n) {
		e.addEventListener ? e[n ? "removeEventListener" : "addEventListener"](t, i, !1) : e.attachEvent && e[n ? "detachEvent" : "attachEvent"]("on" + t, i)
	}
	function l(e, c) {
		function f(e, t, i, n) {
			return k[0 | e][Math.round(Math.min((t - i) / (n - i) * B, B))]
		}
		function d() {
			T.legend.fps !== j && (T.legend.fps = j, T.legend[v] = j ? "FPS" : "ms"), L = j ? A.fps : A.duration, T.count[v] = L > 999 ? "999+" : L.toFixed(L > 99 ? 0 : M.decimals)
		}
		function m() {
			for (I = h(), N < I - M.threshold && (A.fps -= A.fps / Math.max(1, 60 * M.smoothing / M.interval), A.duration = 1e3 / A.fps), E = M.history; E--;) G[E] = 0 === E ? A.fps : G[E - 1], $[E] = 0 === E ? A.duration : $[E - 1];
			if (d(), M.heat) {
				if (z.length) for (E = z.length; E--;) z[E].el.style[C[z[E].name].heatOn] = j ? f(C[z[E].name].heatmap, A.fps, 0, M.maxFps) : f(C[z[E].name].heatmap, A.duration, M.threshold, 0);
				if (T.graph && C.column.heatOn) for (E = O.length; E--;) O[E].style[C.column.heatOn] = j ? f(C.column.heatmap, G[E], 0, M.maxFps) : f(C.column.heatmap, $[E], M.threshold, 0)
			}
			if (T.graph) for (F = 0; F < M.history; F++) O[F].style.height = (j ? G[F] ? Math.round(P / M.maxFps * Math.min(G[F], M.maxFps)) : 0 : $[F] ? Math.round(P / M.threshold * Math.min($[F], M.threshold)) : 0) + "px"
		}
		function b() {
			20 > M.interval ? (_ = p(b), m()) : (_ = setTimeout(b, M.interval), R = p(m))
		}
		function w(e) {
			e = e || window.event, e.preventDefault ? (e.preventDefault(), e.stopPropagation()) : (e.returnValue = !1, e.cancelBubble = !0), A.toggle()
		}
		function x() {
			M.toggleOn && a(T.container, M.toggleOn, w, 1), e.removeChild(T.container)
		}
		function S() {
			if (T.container && x(), C = l.theme[M.theme], k = C.compiledHeatmaps || [], !k.length && C.heatmaps.length) {
				for (F = 0; F < C.heatmaps.length; F++) for (k[F] = [], E = 0; B >= E; E++) {
					var t, n = k[F],
						r = E;
					t = .33 / B * E;
					var o = C.heatmaps[F].saturation,
						h = C.heatmaps[F].lightness,
						c = void 0,
						u = void 0,
						p = void 0,
						f = p = void 0,
						m = c = u = void 0,
						m = void 0,
						p = .5 >= h ? h * (1 + o) : h + o - h * o;
					0 === p ? t = "#000" : (f = 2 * h - p, u = (p - f) / p, t *= 6, c = Math.floor(t), m = t - c, m *= p * u, 0 === c || 6 === c ? (c = p, u = f + m, p = f) : 1 === c ? (c = p - m, u = p, p = f) : 2 === c ? (c = f, u = p, p = f + m) : 3 === c ? (c = f, u = p - m) : 4 === c ? (c = f + m, u = f) : (c = p, u = f, p -= m), t = "#" + s(c) + s(u) + s(p)), n[r] = t
				}
				C.compiledHeatmaps = k
			}
			T.container = i(document.createElement("div"), C.container), T.count = T.container.appendChild(i(document.createElement("div"), C.count)), T.legend = T.container.appendChild(i(document.createElement("div"), C.legend)), T.graph = M.graph ? T.container.appendChild(i(document.createElement("div"), C.graph)) : 0, z.length = 0;
			for (var v in T) T[v] && C[v].heatOn && z.push({
				name: v,
				el: T[v]
			});
			if (O.length = 0, T.graph) for (T.graph.style.width = M.history * C.column.width + (M.history - 1) * C.column.spacing + "px", E = 0; E < M.history; E++) O[E] = T.graph.appendChild(i(document.createElement("div"), C.column)), O[E].style.position = "absolute", O[E].style.bottom = 0, O[E].style.right = E * C.column.width + E * C.column.spacing + "px", O[E].style.width = C.column.width + "px", O[E].style.height = "0px";
			i(T.container, M), d(), e.appendChild(T.container), T.graph && (P = T.graph.clientHeight), M.toggleOn && ("click" === M.toggleOn && (T.container.style.cursor = "pointer"), a(T.container, M.toggleOn, w))
		}
		"object" === n(e) && e.nodeType === t && (c = e, e = document.body), e || (e = document.body);
		var C, k, I, _, R, P, L, E, F, A = this,
			M = o({}, l.defaults, c || {}),
			T = {}, O = [],
			B = 100,
			z = [],
			D = 0,
			V = M.threshold,
			H = 0,
			N = h() - V,
			G = [],
			$ = [],
			j = "fps" === M.show;
		A.options = M, A.fps = 0, A.duration = 0, A.isPaused = 0, A.tickStart = function() {
			H = h()
		}, A.tick = function() {
			I = h(), D = I - N, V += (D - V) / M.smoothing, A.fps = 1e3 / V, A.duration = N > H ? V : I - H, N = I
		}, A.pause = function() {
			return _ && (A.isPaused = 1, clearTimeout(_), u(_), u(R), _ = R = 0), A
		}, A.resume = function() {
			return _ || (A.isPaused = 0, b()), A
		}, A.set = function(e, t) {
			return M[e] = t, j = "fps" === M.show, -1 !== r(e, g) && S(), -1 !== r(e, y) && i(T.container, M), A
		}, A.showDuration = function() {
			return A.set("show", "ms"), A
		}, A.showFps = function() {
			return A.set("show", "fps"), A
		}, A.toggle = function() {
			return A.set("show", j ? "ms" : "fps"), A
		}, A.hide = function() {
			return A.pause(), T.container.style.display = "none", A
		}, A.show = function() {
			return A.resume(), T.container.style.display = "block", A
		}, A.destroy = function() {
			A.pause(), x(), A.tick = A.tickStart = function() {}
		}, S(), b()
	}
	var h, c = e.performance;
	h = c && (c.now || c.webkitNow) ? c[c.now ? "now" : "webkitNow"].bind(c) : function() {
		return +new Date
	};
	for (var u = e.cancelAnimationFrame || e.cancelRequestAnimationFrame, p = e.requestAnimationFrame, c = ["moz", "webkit", "o"], f = 0, d = 0, m = c.length; m > d && !u; ++d) p = (u = e[c[d] + "CancelAnimationFrame"] || e[c[d] + "CancelRequestAnimationFrame"]) && e[c[d] + "RequestAnimationFrame"];
	u || (p = function(t) {
		var i = h(),
			n = Math.max(0, 16 - (i - f));
		return f = i + n, e.setTimeout(function() {
			t(i + n)
		}, n)
	}, u = function(e) {
		clearTimeout(e)
	});
	var v = "string" === n(document.createElement("div").textContent) ? "textContent" : "innerText";
	l.extend = o, window.FPSMeter = l, l.defaults = {
		interval: 100,
		smoothing: 10,
		show: "fps",
		toggleOn: "click",
		decimals: 1,
		maxFps: 60,
		threshold: 100,
		position: "absolute",
		zIndex: 10,
		left: "5px",
		top: "5px",
		right: "auto",
		bottom: "auto",
		margin: "0 0 0 0",
		theme: "dark",
		heat: 0,
		graph: 0,
		history: 20
	};
	var g = ["toggleOn", "theme", "heat", "graph", "history"],
		y = "position zIndex left top right bottom margin".split(" ")
}(window),
function(e, t) {
	t.theme = {};
	var i = t.theme.base = {
		heatmaps: [],
		container: {
			heatOn: null,
			heatmap: null,
			padding: "5px",
			minWidth: "95px",
			height: "30px",
			lineHeight: "30px",
			textAlign: "right",
			textShadow: "none"
		},
		count: {
			heatOn: null,
			heatmap: null,
			position: "absolute",
			top: 0,
			right: 0,
			padding: "5px 10px",
			height: "30px",
			fontSize: "24px",
			fontFamily: "Consolas, Andale Mono, monospace",
			zIndex: 2
		},
		legend: {
			heatOn: null,
			heatmap: null,
			position: "absolute",
			top: 0,
			left: 0,
			padding: "5px 10px",
			height: "30px",
			fontSize: "12px",
			lineHeight: "32px",
			fontFamily: "sans-serif",
			textAlign: "left",
			zIndex: 2
		},
		graph: {
			heatOn: null,
			heatmap: null,
			position: "relative",
			boxSizing: "padding-box",
			MozBoxSizing: "padding-box",
			height: "100%",
			zIndex: 1
		},
		column: {
			width: 4,
			spacing: 1,
			heatOn: null,
			heatmap: null
		}
	};
	t.theme.dark = t.extend({}, i, {
		heatmaps: [{
			saturation: .8,
			lightness: .8
		}],
		container: {
			background: "#222",
			color: "#fff",
			border: "1px solid #1a1a1a",
			textShadow: "1px 1px 0 #222"
		},
		count: {
			heatOn: "color"
		},
		column: {
			background: "#3f3f3f"
		}
	}), t.theme.light = t.extend({}, i, {
		heatmaps: [{
			saturation: .5,
			lightness: .5
		}],
		container: {
			color: "#666",
			background: "#fff",
			textShadow: "1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)",
			boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
		},
		count: {
			heatOn: "color"
		},
		column: {
			background: "#eaeaea"
		}
	}), t.theme.colorful = t.extend({}, i, {
		heatmaps: [{
			saturation: .5,
			lightness: .6
		}],
		container: {
			heatOn: "backgroundColor",
			background: "#888",
			color: "#fff",
			textShadow: "1px 1px 0 rgba(0,0,0,.2)",
			boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
		},
		column: {
			background: "#777",
			backgroundColor: "rgba(0,0,0,.2)"
		}
	}), t.theme.transparent = t.extend({}, i, {
		heatmaps: [{
			saturation: .8,
			lightness: .5
		}],
		container: {
			padding: 0,
			color: "#fff",
			textShadow: "1px 1px 0 rgba(0,0,0,.5)"
		},
		count: {
			padding: "0 5px",
			height: "40px",
			lineHeight: "40px"
		},
		legend: {
			padding: "0 5px",
			height: "40px",
			lineHeight: "42px"
		},
		graph: {
			height: "40px"
		},
		column: {
			width: 5,
			background: "#999",
			heatOn: "backgroundColor",
			opacity: .5
		}
	})
}(window, FPSMeter), pc.Angle = function(e) {
	this._theta = e / pc.Angle.RA || 0, this._normalize()
}, pc.Angle.RA = 180 / Math.PI, pc.Angle.prototype = {
	clone: function() {
		var e = new pc.Angle;
		return e._theta = this._theta, e
	},
	copy: function(e) {
		return this._theta = e._theta, this
	},
	dot: function(e) {
		return this.x * e.x + this.y * e.y
	},
	lerp: function(e, t) {
		var i = this.distance(e);
		if (i) return Math.abs(i) < t ? (this._theta = e._theta, this) : (this._theta += Math.sign(i) * t, this._normalize(), this)
	},
	distance: function(e) {
		var t = e._theta - this._theta;
		return Math.abs(t) > Math.PI ? (Math.PI2 - Math.abs(t)) * (-1 * Math.sign(t)) : t
	},
	fromVec2: function(e) {
		return e instanceof Array || (e = e.data), this._theta = Math.atan2(e[0], e[1]), this
	},
	_normalize: function() {
		return this._theta -= Math.PI2 * Math.floor((this._theta + Math.PI) / Math.PI2), this
	}
}, Object.defineProperty(pc.Angle.prototype, "radians", {
	get: function() {
		return this._theta
	},
	set: function(e) {
		this._theta = e, this._normalize()
	}
}), Object.defineProperty(pc.Angle.prototype, "degrees", {
	get: function() {
		return this._theta * pc.Angle.RA
	},
	set: function(e) {
		this._theta = e / pc.Angle.RA, this._normalize()
	}
}), Object.defineProperty(pc.Angle.prototype, "x", {
	get: function() {
		return Math.sin(this._theta)
	}
}), Object.defineProperty(pc.Angle.prototype, "y", {
	get: function() {
		return Math.cos(this._theta)
	}
}), pc.Vec2.prototype.fromAngle = function(e) {
	return this.data[0] = Math.sin(e._theta), this.data[1] = Math.cos(e._theta), this
}, Math.sign = Math.sign || function(e) {
	return 0 === e || isNaN(e) ? e : e > 0 ? 1 : -1
}, Math.PI2 = 2 * Math.PI;
var Garage = new pc.Script("garage");
Garage.attributes.add("garage", {
	type: "entity"
}), Garage.attributes.add("totalStraightRoads", {
	type: "number",
	"default": 7
}), Garage.v1 = new pc.Vec3, Garage.GLOW_TIME = .4, Garage.prototype.initialize = function() {
	this.poolGarage = new EntityPool(this.garage, 2), this.poolGarage.on("free", this.onFreePoolItem, this), this.app.on("app:reset", this.reset, this), this.app.on("level:addBlock", this.onBlockAdded, this), this.app.on("level:removeBlock", this.onBlockRemoved, this), this.app.on("player:level", this.onLevel, this), this.blocksUntilStraight = this.getBlocksLeftTillStraight(), this.straightRoads = 0, this.garages = {}, this.current = null, this.glowTimer = -1
}, Garage.prototype.update = function(e) {
	if (this.glowTimer > 0) {
		this.glowTimer -= e;
		var t = this.current.model.model.meshInstances[2],
			i = 2 / Garage.GLOW_TIME,
			n = 1 - (i * this.glowTimer - 1) * (i * this.glowTimer - 1);
		t.material.setParameter("material_opacity", n), this.glowTimer < 0 && t.material.setParameter("material_opacity", .01)
	}
}, Garage.prototype.getBlocksLeftTillStraight = function() {
	return this.entity.script.score.levelDistance
}, Garage.prototype.reset = function() {
	this.poolGarage.freeAll(), this.blocksUntilStraight = this.getBlocksLeftTillStraight(), this.straightRoads = 0, this.garages = {}
}, Garage.prototype.onBlockAdded = function(e) {
	this.straightRoads && (this.straightRoads === this.totalStraightRoads && this.spawnGarage(e), this.straightRoads--, 0 === this.straightRoads && (this.app.level.forceStraight = !1)), this.blocksUntilStraight--, 0 === this.blocksUntilStraight && (this.blocksUntilStraight = this.getBlocksLeftTillStraight(), this.app.level.forceStraight = !0, this.straightRoads = this.totalStraightRoads)
}, Garage.prototype.onBlockRemoved = function(e) {
	this.garages[e.getGuid()] && (this.poolGarage.free(this.garages[e.getGuid()]), delete this.garages[e.getGuid()], this.current = null, this.glowTimer = -1)
}, Garage.prototype.spawnGarage = function(e) {
	var t = this.poolGarage.alloc();
	t.model.model.meshInstances[1].castShadow = !0, t.model.model.meshInstances[1].receiveShadow = !0, this.app.root.addChild(t);
	var i = e.getLocalEulerAngles();
	t.setLocalEulerAngles(i);
	var n = Garage.v1;
	n.copy(e.getLocalPosition()), i.y < 80 ? n.x += 4 : n.z -= 4, n.y = .02, t.setLocalPosition(n), t.enabled = !0, this.garages[e.getGuid()] = t, this.current = t, this.app.fire("garage:spawn", t)
}, Garage.prototype.onFreePoolItem = function(e) {
	e.enabled = !1;
	var t = e.getParent();
	t && t.removeChild(e)
}, Garage.prototype.onLevel = function(e) {
	this.current.model.model.meshInstances[2]._hidden = !1, this.glowTimer = Garage.GLOW_TIME
};
var Autoplay = new pc.Script("autoplay");
Autoplay.attributes.add("player", {
	type: "entity"
}), Autoplay.attributes.add("level", {
	type: "entity"
}), Autoplay.prototype.postInitialize = function() {
	return this.app.autoplay ? (this.app.on("app:reset", this.reset, this), void this.reset()) : void(this.enabled = !1)
}, Autoplay.prototype.reset = function() {
	this.currentBlock = 0
}, Autoplay.prototype.swap = function(e) {
	this.currentBlock = e.currentBlock, this.enabled = e.enabled, this.player = e.player, this.level = e.level, this.app.off("app:reset", e.reset, e), this.app.on("app:reset", this.reset, this)
}, Autoplay.prototype.update = function(e) {
	var t = this.player.script.player,
		i = this.level.script.level;
	if (t.block + 1 !== this.currentBlock) {
		var n = i.getBlockType(t.block),
			r = i.getBlockType(t.block + 1);
		if (n !== r) {
			var o = this.player.getLocalPosition(),
				s = Math.floor(o.x / 8),
				a = Math.ceil(o.z / 8);
			if (n === BLOCK_CORNER_RIGHT) {
				if (o.z > 8 * a) return;
				t.toggleDirection(), this.currentBlock = t.block + 1
			} else if (n === BLOCK_CORNER_LEFT) {
				if (o.x < 8 * s) return;
				t.toggleDirection(), this.currentBlock = t.block + 1
			}
		}
	}
};
var EntityPool = function(e, t) {
	this._template = e, this._pool = [], this._freelist = [], this._nextFree = 0, this._allocated = 0, this._total = 0, this.expand(t), pc.events.attach(this)
};
EntityPool.prototype = {
	expand: function(e) {
		for (var t = this._total; e > t; t++) this._pool.push(this._template.clone()), this._freelist.push(!0);
		this._total = e
	},
	alloc: function() {
		var e = this._pool[this._nextFree];
		if (this._freelist[this._nextFree] = !1, this._allocated++, this._allocated >= this._total) {
			var t = this._total < 20 ? 2 * this._total : this._total + 20;
			this.expand(t)
		}
		for (var i = 0; !this._freelist[this._nextFree];) i++, this._nextFree++, this._nextFree >= this._total && (this._nextFree = 0);
		return this.fire("alloc", e), e
	},
	free: function(e) {
		var t = this._pool.indexOf(e);
		return -1 === t || this._freelist[t] ? void 0 : (this._freelist[t] = !0, this._allocated--, this.fire("free", e), !0)
	},
	freeAll: function() {
		for (var e = 0; e < this._total; e++) {
			var t = this._pool[e];
			this._freelist[e] || (this._freelist[e] = !0, this.fire("free", t))
		}
		this._allocated = 0
	}
};
var StaticGarage = new pc.Script("staticGarage");
StaticGarage.prototype.initialize = function() {
	this.state = !0, this.entity.model.model.meshInstances[1].castShadow = !0, this.entity.model.model.meshInstances[1].receiveShadow = !0, this.app.on("player:current", this.onCurrent, this), this.app.on("app:reset", this.onCurrent, this)
}, StaticGarage.prototype.onCurrent = function(e) {
	e = e || 0, this.state && e > 3 ? (this.state = !1, this.entity.enabled = !1) : !this.state && 3 > e && (this.state = !0, this.entity.enabled = !0)
};
var Trail = new pc.Script("trail");
Trail.attributes.add("numQuads", {
	type: "number",
	"default": "32"
}), Trail.attributes.add("quadWidth", {
	type: "number",
	"default": .5
}), Trail.attributes.add("quadLength", {
	type: "number",
	"default": .5
}), Trail.attributes.add("y", {
	type: "number",
	"default": 1.153
}), Trail.attributes.add("pivot", {
	type: "entity"
}), Trail.attributes.add("texture", {
	type: "asset",
	assetType: "texture"
}), Trail.attributes.add("shaderVS", {
	type: "asset",
	assetType: "shader"
}), Trail.attributes.add("shaderPS", {
	type: "asset",
	assetType: "shader"
}), Trail.prototype.initialize = function() {
	this.lastPos = new pc.Vec3, this.tmp = new pc.Vec3, this.end = 0, this.level = 1;
	var e = [],
		t = [];
	this.numPoints = this.numQuads + 1, this.positions = new Float32Array(4 * this.numPoints);
	var i, n, r = (this.quadWidth, this.quadLength, 0);
	for (i = 0; i < this.numPoints; i++) n = i, e.push(0), e.push(.5), e.push(n), e.push(0), e.push(-.5), e.push(n);
	for (i = 0; i < this.numQuads; i++) t.push(r), t.push(r + 1), t.push(r + 3), t.push(r + 3), t.push(r + 2), t.push(r), r += 2;
	var o = this.app.graphicsDevice,
		s = pc.scene.procedural.createMesh(o, e, {
			indices: t
		}),
		a = new pc.Material;
	a.cullMode = pc.CULLFACE_NONE, a.alphaWrite = !1, a.blend = !0, a.blendType = pc.BLEND_NORMAL, a.depthWrite = !1, pc.shaderChunks.collectAttribs = function(e) {
		for (var t = {}, i = 0, n = e.indexOf("attribute"); n >= 0;) {
			var r = e.indexOf(";", n),
				o = e.lastIndexOf(" ", r),
				s = e.substr(o + 1, r - (o + 1));
			"aPosition" == s ? t.aPosition = pc.SEMANTIC_POSITION : "vertex_position" == s ? t.vertex_position = pc.SEMANTIC_POSITION : "vertex_normal" == s ? t.vertex_normal = pc.SEMANTIC_NORMAL : (t[s] = "ATTR" + i, i++), n = e.indexOf("attribute", n + 1)
		}
		return t
	}, a.setShader(pc.shaderChunks.createShaderFromCode(o, "#define KEYS " + this.numPoints + "\n" + this.shaderVS.resource, this.shaderPS.resource, "trail")), this.material = a;
	var l = this.entity.model.model.meshInstances[0];
	l.node = this.entity, l.mesh = s, l.material = a, l.cull = !1, this.material.setParameter("width", this.quadWidth), this.texture.resource && this.material.setParameter("texture", this.texture.resource), this.texture.on("load", function() {
		this.material.setParameter("texture", this.texture.resource)
	}, this), this.app.assets.load(this.texture), this.app.on("app:reset", this.reset, this)
}, Trail.prototype.update = function(e) {
	if (this.pivot) {
		var t = this.pivot.getPosition();
		t.y = this.y, this.material.setParameter("sourcePos", t.data);
		var i = this.tmp.copy(this.lastPos).sub(t).length();
		this.material.setParameter("dist", i / this.quadLength), this.material.setParameter("end", this.end);
		var n = i > this.quadLength;
		if (n) {
			this.lastPos.copy(t);
			for (var r = 4 * this.numPoints, o = r - 1; o >= 4; o--) this.positions[o] = this.positions[o - 4];
			this.positions[0] = t.x, this.positions[1] = t.y, this.positions[2] = t.z, this.positions[3] = this.level, this.end++, this.end === this.numPoints && (this.end = this.numPoints - 1), this.material.setParameter("positions[0]", this.positions), this.material.setParameter("dist", 0), this.material.setParameter("end", this.end)
		}
	}
}, Trail.prototype.reset = function() {
	if (this.pivot) {
		var e, t = this.pivot.getPosition();
		for (t.y = this.y, e = 0; e < this.positions.length; e += 4) this.positions[e] = t.x, this.positions[e + 1] = t.y, this.positions[e + 2] = t.z, this.positions[e + 3] = 0
	}
}, pc.Entity.prototype.addChild = function(e) {
	pc.GraphNode.prototype.addChild.call(this, e)
};
var STATIC_MESHES = !0,
	tempSphere = new pc.BoundingSphere;
pc.ForwardRenderer.prototype._isVisible = function(e, t) {
	return t._hidden ? !1 : (meshPos = t.aabb.center, t.node._dirtyScale && (t._aabb._radius = t._aabb.halfExtents.length(), t.node._dirtyScale = !1), tempSphere.radius = t._aabb._radius, tempSphere.center = meshPos, e._frustum.containsSphere(tempSphere))
};
