var a, h = h || {}, aa = new THREE.Color("rgb(0, 135, 255)"), ba = new THREE.Color("rgb(255, 187, 0)"), ca = new THREE.Color("rgb(255, 20, 0)"), da = new THREE.Color("rgb(118, 255, 0)"), m = "", n = "", p = "", r = "", u = "", v, w, x = !1, y = 0;
function ea() {
  document.querySelector("body").classList = "";
  document.querySelector("body").classList.add("editor");
  document.getElementById("loading").classList.remove("show");
  document.getElementById("wrapper").innerHTML = h.Sb;
  var b = document.querySelectorAll("#tools .button");
  for (i = 0;i < b.length;i++) {
    b[i].setAttribute("selected", "false"), b[i].addEventListener("click", function(b) {
      z(b.target);
    });
  }
  b = document.querySelectorAll("#pages .button");
  for (i = 0;i < b.length;i++) {
    b[i].setAttribute("selected", "false"), b[i].addEventListener("click", function(b) {
      A(b.target);
    });
  }
  b = document.querySelectorAll(".catalogue");
  for (i = 0;i < b.length;i++) {
    b[i].setAttribute("selected", "false");
  }
  b = document.querySelectorAll("#cat_tiles .button");
  for (i = 0;i < b.length;i++) {
    b[i].setAttribute("selected", "false"), b[i].addEventListener("click", function(b) {
      B(b.target);
    });
  }
  b = document.querySelectorAll("#cat_logic .button");
  for (i = 0;i < b.length;i++) {
    b[i].setAttribute("selected", "false"), b[i].addEventListener("click", function(b) {
      D(b.target);
    });
  }
  b = document.querySelectorAll("#cat_objects .button");
  for (i = 0;i < b.length;i++) {
    b[i].setAttribute("selected", "false"), b[i].addEventListener("click", function(b) {
      fa(b.target);
    });
  }
  b = document.getElementById("editorBtn");
  b.setAttribute("selected", "false");
  b.addEventListener("click", function(b) {
    "false" == b.target.getAttribute("selected") ? (b.target.setAttribute("selected", "true"), document.getElementById("content").style.visibility = "hidden") : (b.target.setAttribute("selected", "false"), document.getElementById("content").style.visibility = "visible");
    document.getElementById("data_activated").setAttribute("selected", "false");
    document.getElementById("data_speed").setAttribute("selected", "false");
    document.getElementById("data_delay").setAttribute("selected", "false");
    document.getElementById("data_waypoint").setAttribute("selected", "false");
    collectedScore = 0;
    h.camera.zoom = 1;
    h.camera.updateProjectionMatrix();
    if (h.i.O) {
      h.i.O = !1, h.timer.reset(), x && E(document.getElementById("toggle_waypoint")), void 0 != v && null != v && (v.material = w, v = null), h.Ub();
    } else {
      h.i.O = !0;
      h.D.mb.stop();
      for (b = h.level.ia.children.length - 1;0 <= b;b--) {
        var d = h.level.ia.children[b];
        h.level.ia.remove(h.level.ia.children[b]);
        h.G.remove(d);
      }
      for (b = 0;b < h.level.u.children.length;b++) {
        h.level.u.children[b].position.copy(h.level.u.children[b].X), h.level.u.children[b].V = 0, h.level.u.children[b].U = 0, h.level.u.children[b].visible = !0, "logic_switch" == h.level.u.children[b].name && (1 == h.level.u.children[b].$ ? (h.B.L(h.level.u.children[b].o, h.level.u.children[b].m, "on", .2), h.level.u.children[b].m = h.level.u.children[b].o.clipAction("on")) : (h.B.L(h.level.u.children[b].o, h.level.u.children[b].m, "off", .2), h.level.u.children[b].m = h.level.u.children[b].o.clipAction("off")))
        ;
      }
      h.G.remove(h.level.sa);
      void 0 == h.level.sa ? console.error("No map geometry found") : h.level.sa.geometry.dispose();
      h.level.M.visible = !0;
      h.level.ja.visible = !0;
      h.i.Ha.visible = !0;
    }
  });
  document.getElementById("home_new").addEventListener("click", function() {
    location.reload(!0);
  });
  document.getElementById("home_load").addEventListener("click", function() {
    document.getElementById("mapLoader").click();
  });
  document.getElementById("home_save").addEventListener("click", function() {
    var b = {type:"map", name:"map"};
    b.size = h.i.Hb * h.i.Gb;
    b.time = h.i.eb;
    b.cells = [];
    for (i = 0;i < h.level.cells.length;i++) {
      var d = {};
      d.name = h.level.cells[i].name;
      d.position = h.level.cells[i].position;
      d.variant = h.level.cells[i].variant;
      d.rotation = h.level.cells[i].rotation;
      d.group = h.level.cells[i].parent.name;
      d.waypoint = h.level.cells[i].A;
      d.originalActivated = h.level.cells[i].$;
      d.speed = h.level.cells[i].speed;
      d.delay = h.level.cells[i].S;
      b.cells.push(d);
    }
    b = JSON.stringify(b);
    b = new Blob([b], {type:"text/plain;charset=utf-8"});
    saveAs(b, "unnamed_map.json");
  });
  document.getElementById("mapLoader").addEventListener("change", function(b) {
    ga(b);
  });
  document.getElementById("home_timer").addEventListener("click", function() {
    h.i.eb = h.i.Wb;
    void 0 != document.getElementById("targetLap") && (document.getElementById("targetLap").innerHTML = h.timer.Ja(h.i.eb));
  });
  z(document.getElementById("tool_select"));
  A(document.getElementById("page_home"));
  B(document.getElementById("tile_ground"));
  D(document.getElementById("logic_start"));
  fa(document.getElementById("object_corner"));
  document.getElementById("delay_down").addEventListener("mousedown", function() {
    v.S -= 50;
    document.getElementById("output_delay").innerHTML = v.S;
  });
  document.getElementById("delay_up").addEventListener("mousedown", function() {
    v.S += 50;
    document.getElementById("output_delay").innerHTML = v.S;
  });
  document.getElementById("speed_down").addEventListener("mousedown", function() {
    v.speed -= 50;
    document.getElementById("output_speed").innerHTML = v.speed;
  });
  document.getElementById("speed_up").addEventListener("mousedown", function() {
    v.speed += 50;
    document.getElementById("output_speed").innerHTML = v.speed;
  });
  document.getElementById("activated_up").addEventListener("mousedown", function() {
    v.$ ? (v.$ = !1, "logic_switch" == v.name && (h.B.L(v.o, v.m, "off", .2), v.m = v.o.clipAction("off"))) : (v.$ = !0, "logic_switch" == v.name && (h.B.L(v.o, v.m, "on", .2), v.m = v.o.clipAction("on")));
    document.getElementById("output_activated").innerHTML = v.$;
  });
  document.getElementById("activated_down").addEventListener("mousedown", function() {
    v.$ ? (v.$ = !1, "logic_switch" == v.name && (h.B.L(v.o, v.m, "off", .2), v.m = v.o.clipAction("off"))) : (v.$ = !0, "logic_switch" == v.name && (h.B.L(v.o, v.m, "on", .2), v.m = v.o.clipAction("on")));
    document.getElementById("output_activated").innerHTML = v.$;
  });
  var d = document.getElementById("toggle_waypoint");
  d.setAttribute("selected", "false");
  d.addEventListener("click", function() {
    E(d);
  });
  document.getElementById("clear_waypoint").addEventListener("click", function() {
    1 < v.A.length && v.A.pop();
    h.i.Ha.remove(v.ca[v.ca.length - 1]);
    h.G.remove(v.ca[v.ca.length - 1]);
    v.ca.pop();
  });
  document.getElementById("variant_up").addEventListener("click", function() {
    void 0 != h.level.wa.getObjectByName(v.name + "_" + (v.variant + 1)) && (v.variant++, v.geometry = h.level.wa.getObjectByName(v.name + "_" + v.variant).geometry);
    document.getElementById("output_variant").innerHTML = v.variant;
    h.i.za = v.variant;
  });
  document.getElementById("variant_down").addEventListener("click", function() {
    void 0 != h.level.wa.getObjectByName(v.name + "_" + (v.variant - 1)) && (v.variant--, v.geometry = h.level.wa.getObjectByName(v.name + "_" + v.variant).geometry);
    document.getElementById("output_variant").innerHTML = v.variant;
    h.i.za = v.variant;
  });
}
function E(b) {
  x ? (x = !1, b.setAttribute("selected", "false")) : (x = !0, b.setAttribute("selected", "true"));
}
function z(b) {
  var d = document.querySelectorAll("#tools .button");
  for (i = 0;i < d.length;i++) {
    d[i].setAttribute("selected", "false");
  }
  b.setAttribute("selected", "true");
  m = b.id;
}
function A(b) {
  void 0 != v && null != v && (v.material = w);
  v = void 0;
  x && E(document.getElementById("toggle_waypoint"));
  var d = document.querySelectorAll("#pages .button"), f = document.querySelectorAll(".catalogue");
  for (i = 0;i < d.length;i++) {
    d[i].setAttribute("selected", "false");
  }
  for (i = 0;i < f.length;i++) {
    f[i].getAttribute("page") == b.id ? f[i].setAttribute("selected", "true") : f[i].setAttribute("selected", "false");
  }
  b.setAttribute("selected", "true");
  n = b.id;
  "page_home" == n ? h.i.Sa.color.set(aa) : "page_tiles" == n ? h.i.Sa.color.set(ba) : "page_logic" == n ? h.i.Sa.color.set(ca) : "page_objects" == n && h.i.Sa.color.set(da);
}
function B(b) {
  var d = document.querySelectorAll("#cat_tiles .button");
  for (i = 0;i < d.length;i++) {
    d[i].setAttribute("selected", "false");
  }
  b.setAttribute("selected", "true");
  p = b.id;
}
function D(b) {
  var d = document.querySelectorAll("#cat_logic .button");
  for (i = 0;i < d.length;i++) {
    d[i].setAttribute("selected", "false");
  }
  b.setAttribute("selected", "true");
  r = b.id;
}
function fa(b) {
  var d = document.querySelectorAll("#cat_objects .button");
  for (i = 0;i < d.length;i++) {
    d[i].setAttribute("selected", "false");
  }
  b.setAttribute("selected", "true");
  u = b.id;
}
function ga(b) {
  var d = b.target, f = new FileReader;
  f.onload = function() {
    h.nb();
    var b = f.result, b = JSON.parse(b), e = b.cells;
    void 0 != b.time && (h.i.eb = b.time);
    for (i = 0;i < e.length;i++) {
      b = 1, void 0 != e[i].variant && (b = e[i].variant), "group_tiles" == e[i].group ? h.level.Fb(e[i].name, b, new THREE.Vector3(e[i].position.x, e[i].position.y, e[i].position.z), e[i].rotation._z) : "group_logic" == e[i].group ? (b = h.level.Db(e[i].name, b, new THREE.Vector3(e[i].position.x, e[i].position.y, e[i].position.z), e[i].rotation._z), 0 < b.A.length && (b.A = e[i].waypoint.slice()), void 0 != e[i].originalActivated && (b.$ = e[i].originalActivated), b.speed = e[i].speed, b.S = e[i].delay) : 
      "group_objects" == e[i].group && h.level.Eb(e[i].name, b, new THREE.Vector3(e[i].position.x, e[i].position.y, e[i].position.z), e[i].rotation._z);
    }
    for (i = 0;i < h.level.u.children.length;i++) {
      void 0 != h.level.u.children[i].Ta && h.level.u.children[i].Ta();
    }
    A(document.getElementById("page_tiles"));
    document.getElementById("mapinfo").innerHTML = d.files[0].name;
    void 0 != document.getElementById("targetLap") && (document.getElementById("targetLap").innerHTML = h.timer.Ja(h.i.eb));
  };
  f.readAsText(d.files[0]);
}
document.addEventListener("click", function() {
  !h.i.O || void 0 != v && null != v || document.getElementById("properties").setAttribute("selected", "false");
});
document.addEventListener("wheel", function(b) {
  h.i.O && (0 < b.deltaY ? (h.camera.zoom -= .1, h.R.zoom -= .25) : 0 > b.deltaY && (h.camera.zoom += .1, h.R.zoom += .25), .2 > h.camera.zoom ? h.camera.zoom = .2 : 1.5 < h.camera.zoom && (h.camera.zoom = 1.5), h.camera.updateProjectionMatrix(), h.R.updateProjectionMatrix());
});
h = h || {};
h.level = h.level || {};
h.i = h.i || {};
h.B = h.B || {};
h.level.Fb = function(b, d, f, g) {
  var e = !0;
  if ("tile_wall" == b || "tile_pillar" == b) {
    e = !1;
  }
  var k;
  k = h.level.wa.getObjectByName(b + "_" + d).geometry;
  e = new F(k, h.level.ta, e);
  h.level.M.add(e);
  e.rotation.x = -Math.PI / 2;
  e.rotation.z = g;
  e.position.x = f.x;
  e.position.z = f.z;
  e.name = b;
  e.Da = e.name.substring(e.name.indexOf("_") + 1).toUpperCase();
  e.variant = d;
  h.level.cells.push(e);
};
h.level.Db = function(b, d, f, g) {
  var e, k, l = !1;
  setTimeout(function() {
    l = !0;
  }, 1E3);
  if ("logic_start" == b || "logic_end" == b || "logic_pickupSmall" == b || "logic_gate" == b) {
    e = h.level.wa.getObjectByName(b + "_" + d).geometry;
    k = h.level.ta;
    var c = new F(e, k);
    c.rotation.x = -Math.PI / 2;
    c.rotation.z = g;
    c.position.y = .1;
  } else {
    if ("receiver" == b) {
      console.log("receiver detected");
    } else {
      if ("empty_blocker" == b) {
        console.log("empty_blocker detected");
      } else {
        for (e = h.level.Oa[b], k = new THREE.MeshBasicMaterial({map:h.level.ob.map, transparent:!0, skinning:!0, side:THREE.DoubleSide}), c = new G(e, k), c.o = new THREE.AnimationMixer(c), g = 0;g < c.geometry.animations.length;++g) {
          c.o.clipAction(c.geometry.animations[g]);
        }
      }
    }
  }
  h.level.u.add(c);
  c.position.x = f.x;
  c.position.z = f.z;
  c.name = b;
  c.Da = c.name.substring(c.name.indexOf("_") + 1).toUpperCase();
  c.xa = !0;
  c.X.copy(c.position);
  c.variant = d;
  "logic_start" == b && (void 0 != document.getElementById("collected") && (document.getElementById("collected").innerHTML = 0), c.material = h.level.ta, c.position.y = 0, c.init = function() {
    h.level.da = 0;
    h.touch.Z = 0;
  }, "#editor" == h.ha && h.timer.reset(), c.ea = new F, c.ea.name = "empty_blocker", c.ea.Da = "empty_blocker", c.ea.gb = !1, c.init = function() {
    h.level.M.add(c.ea);
    c.ea.position.copy(c.position);
    for (var b = Math.round(THREE.Math.radToDeg(c.rotation.z));360 < b;) {
      b -= 360;
    }
    for (;-360 > b;) {
      b += 360;
    }
    if (0 == b || 360 == b || -360 == b) {
      c.ea.position.z += 3;
    }
    if (90 == b || -270 == b) {
      c.ea.position.x += 3;
    }
    if (-90 == b || 270 == b) {
      c.ea.position.x -= 3;
    }
    if (-180 == b || 180 == b) {
      c.ea.position.z -= 3;
    }
  }, c.ba = function() {
    h.level.M.remove(c.ea);
    h.G.remove(c.ea);
  });
  "logic_end" == b && (c.ended = !1, c.ga = function() {
    h.j.Ea("win", .2);
    if (0 == c.ended) {
      h.D.nd.play();
      h.D.mb.stop();
      h.timer.timeout(1);
      h.timer.Ga = !0;
      h.touch.Z = 0;
      h.timer.ya = !1;
      h.f.H.style.opacity = "0";
      h.f.J.style.opacity = "0";
      var b = THREE.Math.degToRad(45);
      h.Ya || (b = THREE.Math.degToRad(0));
      h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), b);
      "#editor" != h.ha ? (c.ended = !0, h.timer.running = !1, setTimeout(function() {
        var b = h.$c(), c = h.timer.Ja();
        H = !0;
        h.Yc(b, c);
        h.timer.reset();
      }, 2E3)) : (h.timer.running = !1, h.i.Wb = h.timer.time, void 0 != document.getElementById("lastLap") && (document.getElementById("lastLap").style.backgroundColor = "rgba(0, 128, 0, 0.45)"));
    }
  }, c.material = h.level.ta);
  "logic_pickupSmall" == b && (c.Pa = 1.5, c.rotation.z = h.B.Va(-45), c.ga = function() {
    1 == c.visible && (h.level.da += 1, c.visible = !1, h.j.qb.ic(), h.D.dc.play());
    void 0 != document.getElementById("collected") && (10 > h.level.da ? document.getElementById("collected").innerHTML = "0" + h.level.da : document.getElementById("collected").innerHTML = h.level.da);
  }, c.update = function(b) {
    c.rotation.z += 5 * b;
    c.position.distanceTo(h.j.position) <= c.Pa && c.ga();
  }, c.material = h.level.ta);
  "logic_gate" == b && (c.init = function() {
    if (!c.N) {
      for (var b = 0;b < h.level.M.children.length;b++) {
        h.level.M.children[b].position.x == c.X.x && h.level.M.children[b].position.z == c.X.z && (h.level.M.children[b].gb = !1);
      }
    }
  }, c.Ca = function(b) {
    "playing" != h.D.yb && h.running && l && h.D.od.play();
    c.N = b;
    for (b = 0;b < h.level.M.children.length;b++) {
      h.level.M.children[b].position.x == c.X.x && h.level.M.children[b].position.z == c.X.z && (h.level.M.children[b].gb = c.N);
    }
  }, c.update = function(b) {
    c.N ? -1.6 != c.position.y && (c.position.y = h.B.wb(c.position.y, -1.6, 20 * b)) : 0 != c.position.y && (c.position.y = h.B.wb(c.position.y, 0, 20 * b));
  }, c.material = h.level.ta);
  "logic_switch" == b && (c.m = c.o.clipAction("off"), h.ma.push(c.o), c.position.y = .2, 0 == c.A.length && c.A.push(c.X), c.Ta = function() {
    if ("#editor" == h.ha) {
      for (var b = 0;b < c.A.length - 1;b++) {
        var d = h.i.ab(c.A[0], c.A[b]);
        c.ca.push(d);
      }
    }
    1 == c.$ ? (h.B.L(c.o, c.m, "on", .2), c.m = c.o.clipAction("on")) : (h.B.L(c.o, c.m, "off", .2), c.m = c.o.clipAction("off"));
  }, c.init = function() {
    c.N = c.$;
    c.N ? "on" != c.m._clip.name && (h.B.L(c.o, c.m, "on", .2), c.m = c.o.clipAction("on")) : "off" != c.m._clip.name && (h.B.L(c.o, c.m, "off", .2), c.m = c.o.clipAction("off"));
    if (1 < c.A.length) {
      for (var b = 1;b < c.A.length;b++) {
        for (var d = 0;d < h.level.u.children.length;d++) {
          h.level.u.children[d].X.x == c.A[b].x && h.level.u.children[d].X.z == c.A[b].z && h.level.u.children[d].Ca(c.N);
        }
      }
    }
  }, c.ga = function() {
    "playing" != h.D.xb && l && h.D.jd.play();
    c.N ? (c.N = !1, h.B.L(c.o, c.m, "off", .2), c.m = c.o.clipAction("off")) : (c.N = !0, h.B.L(c.o, c.m, "on", .2), c.m = c.o.clipAction("on"));
    if (1 < c.A.length) {
      for (var b = 1;b < c.A.length;b++) {
        for (var d = 0;d < h.level.u.children.length;d++) {
          h.level.u.children[d].X.x == c.A[b].x && h.level.u.children[d].X.z == c.A[b].z && h.level.u.children[d].Ca(c.N);
        }
      }
    }
  }, c.Ca = function() {
    c.ga();
  }, c.update = function(b) {
    c.N && (c.rotation.y += 2 * b);
  });
  if ("logic_trapMovingSmall" == b) {
    c.position.y = 0;
    c.m = c.o.clipAction("test");
    h.ma.push(c.o);
    0 == c.A.length && c.A.push(c.X);
    c.Mb = !1;
    c.Pa = 1;
    c.U = 0;
    if (0 == c.speed || void 0 == c.speed) {
      c.speed = 2500;
    }
    void 0 == c.S && (c.S = 0);
    c.ga = function() {
      0 == h.j.ba && (c.xa && c.visible ? (h.j.ba = !0, h.timer.Ga = !0, h.j.Ea("kill", .2), setTimeout(h.rb, 500)) : (1 == c.visible && (c.visible = !1, h.level.da += 1, c.visible = !1, h.j.qb.ic(), h.D.dc.play()), void 0 != document.getElementById("collected") && (10 > h.level.da ? document.getElementById("collected").innerHTML = "0" + h.level.da : document.getElementById("collected").innerHTML = h.level.da)));
    };
    c.V = -c.S;
    c.cb = !1;
    c.Ta = function() {
      if ("#editor" == h.ha) {
        for (var b = 0;b < c.A.length - 1;b++) {
          var d = h.i.ab(c.A[b], c.A[b + 1]);
          c.ca.push(d);
        }
      }
    };
    c.init = function() {
      h.B.L(c.o, c.m, "on", .2);
      c.m = c.o.clipAction("on");
    };
    c.Ca = function(b) {
      c.N = b;
    };
    c.update = function(b) {
      new THREE.Vector3(c.position.x, -1.1, c.position.z);
      c.V += b * c.speed;
      "on" != c.m._clip.name && (h.B.L(c.o, c.m, "on", .2), c.m = c.o.clipAction("on"));
      c.position.distanceTo(h.j.position) <= c.Pa && c.ga();
      1 < c.A.length && (c.position.x != c.A[c.U].x ? (c.position.x = h.B.wb(c.position.x, c.A[c.U].x, b * c.speed / 1E3), c.position.x < c.A[c.U].x ? c.rotation.y = h.B.sb(c.rotation.y, Math.PI / 2, 10 * b) : c.position.x > c.A[c.U].x && (c.rotation.y = h.B.sb(c.rotation.y, -Math.PI / 2, 10 * b))) : c.position.z != c.A[c.U].z ? (c.position.z = h.B.wb(c.position.z, c.A[c.U].z, b * c.speed / 1E3), c.position.z < c.A[c.U].z ? c.rotation.y = h.B.sb(c.rotation.y, 0, 10 * b) : c.position.z > c.A[c.U].z && 
      (c.rotation.y = h.B.sb(c.rotation.y, Math.PI, 10 * b))) : (c.A[0].x == c.A[c.A.length - 1].x && c.A[0].z == c.A[c.A.length - 1].z ? c.U == c.A.length - 1 && (c.U = 0) : c.U == c.A.length - 1 ? c.Mb = !0 : 0 == c.U && (c.Mb = !1), c.N ? (c.xa = !0, c.Mb ? c.U-- : c.U++) : ("off" != c.m._clip.name && (h.B.L(c.o, c.m, "off", .2), c.m = c.o.clipAction("off"), c.xa = !1), h.D.mb.pause())));
    };
  }
  if ("logic_trapSpikes" == b) {
    c.position.y = 0;
    c.X.copy(c.position);
    c.Pa = 1;
    c.m = c.o.clipAction("on");
    h.ma.push(c.o);
    if (0 == c.speed || void 0 == c.speed) {
      c.speed = 400;
    }
    void 0 == c.S && (c.S = 0);
    c.ga = function() {
      c.xa && 0 == h.j.ba && (h.j.ba = !0, h.timer.Ga = !0, h.j.Ea("kill", .2), setTimeout(h.rb, 500));
    };
    c.Ca = function(b) {
      c.N = b;
    };
    c.V = -c.S;
    c.cb = !1;
    c.update = function(b) {
      c.V += b * c.speed;
      c.position.distanceTo(h.j.position) <= c.Pa && c.ga();
      1E3 <= c.V && c.N ? c.V = 0 : 500 <= c.V && c.N ? (c.xa = !0, h.B.L(c.o, c.m, "on", .05), c.m = c.o.clipAction("on"), 0 == c.cb && l && (h.D.jc._volume = THREE.Math.clamp(1 / c.position.distanceTo(h.j.position) * 2, 0, .5), h.D.jc.play(), c.cb = !0), c.position.distanceTo(h.j.position) <= c.Pa && c.ga()) : c.N ? (c.cb = !1, c.xa = !1, h.B.L(c.o, c.m, "off", .2), c.m = c.o.clipAction("off")) : (c.cb = !1, c.xa = !1, h.B.L(c.o, c.m, "inactive", .1), c.m = c.o.clipAction("inactive"));
    };
  }
  if ("logic_teleporter" == b) {
    var q = !1;
    c.material.side = THREE.DoubleSide;
    c.m = c.o.clipAction("on");
    h.ma.push(c.o);
    h.B.L(c.o, c.m, "on", .2);
    0 == c.A.length && c.A.push(c.X);
    c.position.y = .1;
    c.material.side = THREE.FrontSide;
    c.X.copy(c.position);
    b = h.level.Oa.logic_receiver;
    d = new THREE.MeshBasicMaterial({map:h.level.ob.map, transparent:!0, skinning:!0, side:THREE.DoubleSide});
    b = new G(b, d);
    b.o = new THREE.AnimationMixer(b);
    h.ma.push(b.o);
    for (g = 0;g < b.geometry.animations.length;++g) {
      b.o.clipAction(b.geometry.animations[g]);
    }
    b.m = b.o.clipAction("on");
    h.B.L(b.o, b.m, "on", .2);
    c.Y = b;
    c.Y.name = "receiver";
    c.init = function() {
      h.level.ia.add(c.Y);
      1 < c.A.length && c.Y.position.set(c.A[1].x, c.A[1].y, c.A[1].z);
    };
    c.ga = function() {
      q = !0;
      1 < c.A.length && c.N && (h.D.kd.play(), h.timer.timeout(.2), h.touch.W = !1, h.j.position.x = c.A[c.A.length - 1].x, h.j.position.z = c.A[c.A.length - 1].z, h.j.I.position.copy(h.j.position));
    };
    c.Ta = function() {
      if ("#editor" == h.ha) {
        for (var b = 0;b < c.A.length - 1;b++) {
          var d = h.i.ab(c.A[b], c.A[b + 1]);
          c.ca.push(d);
        }
      }
    };
    c.Ca = function(b) {
      c.N = b;
    };
    c.update = function() {
      h.timer.ya && (q = !1);
      c.N ? q ? ("beam" != c.m._clip.name && (h.B.L(c.o, c.m, "beam", .001), c.m = c.o.clipAction("beam")), "beam" != c.Y.m._clip.name && (h.B.L(c.Y.o, c.Y.m, "beam", .2), c.Y.m = c.Y.o.clipAction("beam"))) : ("on" != c.m._clip.name && (h.B.L(c.o, c.m, "on", .2), c.m = c.o.clipAction("on")), "on" != c.Y.m._clip.name && (h.B.L(c.Y.o, c.Y.m, "on", .2), c.Y.m = c.Y.o.clipAction("on"))) : ("off" != c.m._clip.name && (h.B.L(c.o, c.m, "off", .1), c.m = c.o.clipAction("off")), "off" != c.Y.m._clip.name && 
      (h.B.L(c.Y.o, c.Y.m, "off", .2), c.Y.m = c.Y.o.clipAction("off")));
    };
  }
  h.level.cells.push(c);
  return c;
};
h.level.Eb = function(b, d, f, g) {
  var e;
  e = h.level.wa.getObjectByName(b + "_" + d).geometry;
  e = new F(e, h.level.ta);
  h.level.ja.add(e);
  e.rotation.x = -Math.PI / 2;
  e.rotation.z = g;
  e.position.x = f.x;
  e.position.z = f.z;
  e.name = b;
  e.Da = e.name.substring(e.name.indexOf("_") + 1).toUpperCase();
  e.variant = d;
  h.level.cells.push(e);
};
h.i.ab = function(b, d) {
  var f = new THREE.Geometry;
  b.y = .1;
  d.y = .1;
  f.vertices.push(b);
  f.vertices.push(d);
  f = new THREE.Line(f, h.i.Xb);
  h.i.Ha.add(f);
  return f;
};
function F(b, d, f, g, e) {
  this.type = "Brick";
  this.X = new THREE.Vector3(0, 0, 0);
  this.U = 0;
  this.geometry = b;
  this.material = d;
  this.variant = 1;
  this.Da = "Brick";
  this.gb = f;
  this.Pa = e;
  this.speed = this.S = 0;
  this.A = [];
  this.ca = [];
  this.V = 0;
  this.xa = !1;
  this.N = this.$ = !0;
  this.Ca = function() {
  };
  this.update = function() {
  };
  this.tb = "z";
  THREE.Mesh.call(this, this.geometry, this.material);
  void 0 != g ? this.ga = g : this.ga = function() {
    return this.name;
  };
}
F.prototype = Object.create(THREE.Mesh.prototype);
F.prototype.constructor = F;
function G(b, d, f, g) {
  this.type = "SkinnedBrick";
  this.X = new THREE.Vector3(0, 0, 0);
  this.U = 0;
  this.geometry = b;
  this.material = d;
  this.variant = 1;
  this.Da = "Brick";
  this.speed = this.S = 0;
  this.A = [];
  this.ca = [];
  this.V = 0;
  this.xa = !1;
  this.N = this.$ = !0;
  this.Ca = function() {
  };
  this.update = function() {
  };
  this.tb = "y";
  THREE.Mesh.call(this, b, d);
  void 0 != f ? this.ga = f : this.ga = function() {
    return this.name;
  };
  this.bindMode = "attached";
  this.bindMatrix = new THREE.Matrix4;
  this.bindMatrixInverse = new THREE.Matrix4;
  b = [];
  if (this.geometry && void 0 !== this.geometry.bones) {
    for (var e = 0, k = this.geometry.bones.length;e < k;++e) {
      f = this.geometry.bones[e], d = new THREE.Bone(this), b.push(d), d.name = f.name, d.position.fromArray(f.pos), d.quaternion.fromArray(f.rotq), void 0 !== f.scl && d.scale.fromArray(f.scl);
    }
    e = 0;
    for (k = this.geometry.bones.length;e < k;++e) {
      f = this.geometry.bones[e], -1 !== f.parent && null !== f.parent ? b[f.parent].add(b[e]) : this.add(b[e]);
    }
  }
  this.normalizeSkinWeights();
  this.updateMatrixWorld(!0);
  this.bind(new THREE.Skeleton(b, void 0, g), this.matrixWorld);
}
G.prototype = Object.create(THREE.SkinnedMesh.prototype);
a = G.prototype;
a.constructor = G;
a.bind = function(b, d) {
  this.skeleton = b;
  void 0 === d && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), d = this.matrixWorld);
  this.bindMatrix.copy(d);
  this.bindMatrixInverse.getInverse(d);
};
a.pose = function() {
  this.skeleton.pose();
};
a.normalizeSkinWeights = function() {
  if (this.geometry instanceof THREE.Geometry) {
    for (var b = 0;b < this.geometry.skinWeights.length;b++) {
      var d = this.geometry.skinWeights[b], f = 1 / d.lengthManhattan();
      Infinity !== f ? d.multiplyScalar(f) : d.set(1, 0, 0, 0);
    }
  } else {
    if (this.geometry instanceof THREE.BufferGeometry) {
      for (var d = new THREE.Vector4, g = this.geometry.attributes.vd, b = 0;b < g.count;b++) {
        d.x = g.getX(b), d.y = g.getY(b), d.z = g.getZ(b), d.w = g.getW(b), f = 1 / d.lengthManhattan(), Infinity !== f ? d.multiplyScalar(f) : d.set(1, 0, 0, 0), g.setXYZW(b, d.x, d.y, d.z, d.w);
      }
    }
  }
};
a.updateMatrixWorld = function() {
  THREE.Mesh.prototype.updateMatrixWorld.call(this, !0);
  "attached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.matrixWorld) : "detached" === this.bindMode ? this.bindMatrixInverse.getInverse(this.bindMatrix) : console.warn("SkinnedBrick unrecognized bindMode: " + this.bindMode);
};
a.clone = function() {
  return (new this.constructor(this.geometry, this.material, this.useVertexTexture)).copy(this);
};
function ha() {
  this.Ga = this.running = !1;
  this.Ua = this.time = 0;
  this.reset = function() {
    this.time = 0;
    "#editor" != h.ha && (document.getElementById("timer").innerHTML = this.Ja());
    void 0 != document.getElementById("lastLap") && (document.getElementById("lastLap").innerHTML = this.Ja(), document.getElementById("lastLap").style.backgroundColor = "rgba(149, 15, 15, 0.58)");
  };
  this.Ja = function(b) {
    void 0 == b && (b = this.time);
    var d = Math.floor(b % 60);
    b = Math.floor(1E3 * b / 6E4 % 60);
    10 > d && (d = "0" + d);
    d = b + ":" + d;
    10 <= b && (d = "9:59");
    return d;
  };
  this.update = function(b) {
    this.Ua -= b;
    this.ya = 0 < this.Ua || this.Ga ? !1 : !0;
    1 == this.running && 0 >= this.Ua && (this.time += b, "#editor" != h.ha && (document.getElementById("timer").innerHTML = this.Ja()), void 0 != document.getElementById("lastLap") && (document.getElementById("lastLap").innerHTML = this.Ja(), document.getElementById("lastLap").style.backgroundColor = "rgba(0, 128, 123, 0.45)"));
  };
  this.timeout = function(b) {
    this.Ua = b;
  };
}
h = h || {};
h.B = h.B || {};
h.B.L = function(b, d, f, g) {
  b.stopAllAction();
  d.crossFadeTo(b.clipAction(f), g, !1).play();
};
h.B.sb = function(b, d, f) {
  b > 2 * Math.PI && (b -= 2 * Math.PI);
  0 > b && (b += 2 * Math.PI);
  d > 2 * Math.PI && (d -= 2 * Math.PI);
  0 > d && (d += 2 * Math.PI);
  b < d && d - b > Math.PI ? b += 2 * Math.PI : b > d && b - d > Math.PI && (d += 2 * Math.PI);
  return b * (1 - f) + d * f;
};
h.B.wb = function(b, d, f) {
  var g = 0;
  b < d ? g = d - b >= f ? b + f : d : b > d && (b - d >= f ? g = b - f : g = d);
  return g;
};
h.B.Va = function(b) {
  return b * Math.PI / 180;
};
h.B.Vc = function(b) {
  for (var d = new THREE.Geometry, f = b[0].material, g = 0;g < b.length;g++) {
    b[g].updateMatrix(), d.merge(b[g].geometry, b[g].matrix);
  }
  b = new THREE.Mesh(d, f);
  console.log("Level Geometry Merged");
  return b;
};
function ia() {
  Object.defineProperties(this, {position:{get:function() {
    return this.oa.position;
  }, set:function(b) {
    this.oa.position = b;
  }}, visible:{get:function() {
    return this.oa.visible;
  }, set:function(b) {
    this.oa.visible = b;
  }}});
  this.getWorldPosition = function() {
    return this.oa.getWorldPosition();
  };
  this.oa = new THREE.Object3D;
  this.Xa = new THREE.Object3D;
  this.oa.add(this.Xa);
  this.Wa = new THREE.Object3D;
  this.oa.add(this.Wa);
  this.Xa.position.x = -.2;
  this.Xa.position.z = .8;
  this.Wa.position.x = .2;
  this.Wa.position.z = .8;
  this.I = null;
  this.qb = {la:null, V:0, ic:function() {
    this.la.position.y = 4;
    this.V = 1;
  }, update:function(b, d, f) {
    this.V -= 2 * d;
    this.la.setRotationFromQuaternion(f.getWorldQuaternion());
    this.la.position.x = b.position.x;
    this.la.position.z = b.position.z;
    0 >= this.V ? this.la.visible && (this.la.visible = !1) : (this.la.visible || (this.la.visible = !0), this.la.position.y += 3 * d, this.la.material.opacity = this.V);
  }};
  this.update = function(b) {
    if ((this.ba || this.qa) && !this.Ob) {
      var d = Math.random();
      "playing" != h.D.ub && "playing" != h.D.vb && (.49 < d ? h.D.ad.play() : h.D.bd.play());
      this.Ob = !0;
    }
    d = new THREE.Vector3(this.position.x, this.I.position.y, this.position.z);
    1 == this.qa ? (this.I.position.y -= 5 * b, d.y -= Math.abs(b * this.I.position.y * 30), this.Ea("fall", .5)) : d.y = this.position.y;
    this.I.position.lerp(d, THREE.Math.clamp(b * h.ec * 1.8, 0, 1));
  };
  this.Ea = function(b, d) {
    this.m._clip.name != b && (h.B.L(this.o, this.m, b, d), this.m = this.o.clipAction(b));
  };
  this.m = this.o = null;
  this.Ob = this.ba = this.qa = !1;
}
h = h || {};
h.i = h.i || {};
h.level = h.level || {};
h.B = h.B || {};
h.Ya = !1;
h.i.bb = !1;
h.i.Ha = null;
h.i.Xb = null;
h.i.Wb = 0;
h.i.eb = 0;
h.level.cells = [];
h.level.wa = null;
h.level.Oa = {};
h.level.M = null;
h.level.u = null;
h.level.ja = null;
h.level.ia = null;
h.level.sa = null;
h.level.va = null;
h.i.Hb = 45;
h.i.Gb = 45;
h.i.Sa = null;
h.j = null;
h.running = !1;
h.touch = {Jb:{x:0, y:0}, active:{x:0, y:0}, margin:5, td:0, na:new THREE.Quaternion, W:!1, Z:0};
h.La = {pd:null};
h.qd = !1;
h.Vb = null;
h.ec = 8;
h.ha = window.location.hash;
h.Fa = new THREE.Clock;
h.delta = 0;
h.fa = null;
h.G = null;
h.camera = null;
h.R = null;
h.level.pa = null;
h.level.wd = null;
h.i.Ma = null;
h.timer = null;
h.level.da = 0;
h.dir = "no";
h.Sc = "no";
h.Hc = "no";
h.i.za = 1;
h.Qb = 30;
h.Rb = 40;
h.qc = .1;
h.pc = 1E3;
h.hb = new THREE.Vector3(0, 32, 22);
h.oc = new THREE.Vector3(0, 80, 64);
h.level.Na = !1;
h.fb = !0;
h.level.Tc = new THREE.Vector3(.2, 1.4, 1);
h.ma = [];
h.level.ta = null;
h.level.ob = null;
h.level.Yb = null;
h.i.Za = null;
h.Sb = "";
h.level.P = {url:"./maps/beta/04_babyEx_BrEx.json ./maps/beta/06_babyEx_BrEx.json ./maps/beta/map_egy_0002.json ./maps/beta/08_juniorEx_BrEx.json ./maps/beta/map_egy_0001.json ./maps/beta/map_egy_0004.json ./maps/beta/10_noviceEx_BrEx.json ./maps/beta/11_noviceEx_BrEx.json ./maps/beta/12_noviceEx_BrEx.json ./maps/beta/13_explorer_BrEx.json ./maps/beta/14_explorer_BrEx.json ./maps/beta/16_advanced_BrEx.json ./maps/beta/17_advanced_BrEx.json ./maps/beta/18_advanced_BrEx.json ./maps/beta/19_veteran_BrEx.json ./maps/beta/21_veteran_BrEx.json ./maps/beta/22_brave_BrEx.json ./maps/beta/23_brave_BrEx.json ./maps/beta/24_brave_BrEx.json ./maps/beta/25_brave_BrEx.json".split(" "), 
current:0, lb:0, Bb:0, loaded:[]};
h.ua = new THREE.Raycaster;
h.key = {up:!1, Ra:!1, left:!1, right:!1, w:!1, a:!1, s:!1, d:!1, bc:!1, ac:!1, ud:0};
h.f = {mode:"center", J:null, H:null, size:110, F:{active:{}, center:{}, right:{}, left:{}}, opacity:"", fixed:!0, enabled:!0, jb:{x:0, y:0}};
h.stats = null;
h.i.ua = new THREE.Raycaster;
h.i.mouse = new THREE.Vector2;
h.i.O = !1;
h.init = function() {
  h.fa = new THREE.WebGLRenderer({antialias:!h.Ya, logarithmicDepthBuffer:!1});
  h.fa.setPixelRatio(window.devicePixelRatio);
  h.fa.setSize(window.innerWidth, window.innerHeight);
  h.fa.domElement.setAttribute("id", "renderer");
  h.fa.setClearColor("#f0dbad");
  h.f.J = document.getElementById("vjoybase");
  h.f.H = document.getElementById("vjoystick");
  h.f.J.style.display = "initial";
  h.f.H.style.display = "initial";
  h.f.H.style.width = h.f.size + "px";
  h.f.H.style.height = h.f.size + "px";
  h.f.J.style.width = h.f.size + "px";
  h.f.J.style.height = h.f.size + "px";
  h.f.J.style.top = "0";
  h.f.J.style.left = "0";
  h.f.H.style.top = "0";
  h.f.H.style.left = "0";
  h.f.hc = function() {
    h.f.F.center = {x:window.innerWidth / 2 - h.f.size / 2, y:window.innerHeight - 1.5 * h.f.size};
    h.f.F.left = {x:1.5 * h.f.size - h.f.size, y:window.innerHeight - 1.5 * h.f.size};
    h.f.F.right = {x:window.innerWidth - 1.5 * h.f.size, y:window.innerHeight - 1.5 * h.f.size};
  };
  h.f.hc();
  "center" == h.f.mode ? h.f.F.active = h.f.F.center : "left" == h.f.mode ? h.f.F.active = h.f.F.left : "right" == h.f.mode && (h.f.F.active = h.f.F.right);
  window.innerWidth > window.innerHeight && "center" == h.f.mode && (h.f.F.active = h.f.F.right);
  !h.f.fixed && h.f.enabled ? (h.f.J.style.opacity = "0", h.f.H.style.opacity = "0") : h.f.fixed && h.f.enabled && (h.f.J.style.opacity = "1", h.f.H.style.opacity = "1", h.f.J.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)", h.f.H.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)");
  if ("#editor" == h.ha) {
    var b = document.getElementById("canvas");
    b.style.width = window.innerWidth;
    b.style.height = window.innerHeight;
    b.appendChild(h.fa.domElement);
  } else {
    1 == I && (h.stats = new Stats, document.body.appendChild(h.stats.domElement), h.stats.domElement.style.position = "absolute", h.stats.domElement.style.left = "50%", h.stats.domElement.style.top = "0"), document.getElementById("game").appendChild(h.fa.domElement);
  }
  h.G = new THREE.Scene;
  h.G.visible = !1;
  h.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, h.qc, h.pc);
  h.camera.fov = 1 < h.camera.aspect ? h.Qb : h.Rb;
  h.camera.updateProjectionMatrix();
  "#editor" == h.ha && (h.R = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 2E3), h.G.add(h.R), h.R.position.y = 50, h.R.rotation.x = -Math.PI / 2, h.R.zoom = 10, h.R.updateProjectionMatrix());
  h.level.pa = new THREE.Object3D;
  h.G.add(h.level.pa);
  h.level.pa.add(h.camera);
  h.camera.position.x = h.hb.x;
  h.camera.position.y = h.hb.y;
  h.camera.position.z = h.hb.z;
  h.camera.lookAt(0, 0, 0);
  b = new THREE.HemisphereLight("rgb(255, 255, 255)", "rgb(255, 255, 255)", .9);
  h.G.add(b);
  b = new THREE.DirectionalLight("rgb(255, 255, 255)", .2);
  b.position.copy(h.level.Tc);
  h.G.add(b);
  h.timer = new ha;
  h.j = new ia;
  h.j.visible = !1;
  h.i.Ma = new THREE.Object3D;
  h.i.Ma.visible = !1;
  if ("#editor" == h.ha) {
    for (h.i.O = !0, h.f.fixed = !1, h.f.J.style.opacity = "0", h.f.H.style.opacity = "0", b = new THREE.PlaneGeometry(3, 3), g1 = 0;g1 < h.i.Hb;g1++) {
      for (g2 = 0;g2 < h.i.Gb;g2++) {
        var d = new THREE.Mesh(b, h.i.Sa);
        d.rotation.x = -Math.PI / 2;
        h.i.Ma.add(d);
        d.position.x = 3 * (-g1 + Math.floor(h.i.Hb / 2));
        d.position.z = 3 * (-g2 + Math.floor(h.i.Gb / 2));
        d.position.y = .02;
      }
    }
  }
  h.j.I = new THREE.SkinnedMesh(h.ka.Jc, h.ka.Kc);
  h.j.I.visible = !1;
  h.j.qa = !1;
  h.j.ba = !1;
  h.G.add(h.j.I);
  h.j.I.position.copy(h.j.position);
  h.j.o = new THREE.AnimationMixer(h.j.I);
  for (b = 0;b < h.j.I.geometry.animations.length;++b) {
    h.j.o.clipAction(h.j.I.geometry.animations[b]);
  }
  h.j.o.clipAction("idle").reset().setEffectiveWeight(1).play();
  h.ma.push(h.j.o);
  h.j.m = h.j.o.clipAction("idle");
  h.level.M = new THREE.Object3D;
  h.level.u = new THREE.Object3D;
  h.level.ja = new THREE.Object3D;
  h.level.ia = new THREE.Object3D;
  h.i.Ha = new THREE.Object3D;
  h.level.M.name = "group_tiles";
  h.level.u.name = "group_logic";
  h.level.ja.name = "group_objects";
  h.level.ia.name = "group_dynamic";
  h.G.add(h.level.M);
  h.G.add(h.level.u);
  h.G.add(h.level.ja);
  h.G.add(h.level.ia);
  h.G.add(h.i.Ha);
  h.G.add(h.i.Ma);
  h.G.add(h.j.oa);
  h.j.position.set(0, 0, 0);
  h.G.add(h.ka.cc);
  h.j.qb.la = h.ka.cc;
  h.j.I.shadow = h.ka.Oc;
  h.j.I.shadow.rotation.x = h.B.Va(-90);
  h.j.I.add(h.j.I.shadow);
  h.j.I.shadow.position.y = .05;
  h.level.Zc = new THREE.Vector3(0, 0, 0);
  h.level.Zc.copy(h.j.position);
  h.camera.lookAt(h.level.pa.position);
  h.level.pa.rotation.y = 1 == !h.Ya ? h.B.Va(5) : h.B.Va(45);
  void 0 != h.ka.kc ? h.ka.kc.anisotropy = h.fa.getMaxAnisotropy() : console.warn("tile_atlas_map loading failed?");
  h.i.O ? (ea(), h.G.visible = !0) : h.Kb();
  h.Tb = new Hammer(h.fa.domElement);
  h.Tb.get("pan").set({direction:Hammer.DIRECTION_ALL, threshold:0});
  h.Tb.on("pan panstart panend pancancel tap", function(b) {
    h.fb = !1;
    if (!h.i.O && h.timer.ya && "tap" != b.type) {
      if ("panstart" == b.type) {
        var d = b.center.x, e = b.center.y, k = h.f.F.active.x + h.f.size / 2, l = h.f.F.active.y + h.f.size / 2;
        !h.f.fixed && h.f.enabled ? (h.f.J.style.transform = "translate(" + (b.center.x - h.f.size / 2) + "px, " + (b.center.y - h.f.size / 2) + "px)", h.f.J.style.opacity = "1", h.f.jb.x = d, h.f.jb.y = e) : h.f.fixed && h.f.enabled && (d = k - d, e = l - e, Math.sqrt(d * d + e * e) < h.f.size / 2 && (h.touch.W = !0));
      }
      "pan" == b.type && (e = {x:b.pointers[0].clientX, y:b.pointers[0].clientY}, h.f.fixed && h.f.enabled && h.touch.W ? (h.touch.Z = b.distance, h.touch.K = b.angle) : h.f.fixed || (h.touch.Z = b.distance, h.touch.K = b.angle, h.touch.W = !0), h.touch.Jb = e);
      if ("pancancel" == b.type || "panend" == b.type) {
        h.touch.W = !1, !h.f.fixed && h.f.enabled ? (h.f.J.style.transform = "translate(-500px, -500px)", h.f.H.style.transform = "translate(-500px, -500px)", h.f.H.style.opacity = "0") : h.f.fixed && h.f.enabled && (h.f.J.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)", h.f.H.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)");
      }
    } else {
      h.i.O ? (h.dir = "no", "pan" == b.type && (h.i.bb ? (h.R.translateX(h.delta * -b.velocityX * 1E3 * devicePixelRatio / window.innerWidth * h.camera.fov), h.R.translateY(h.delta * b.velocityY * 1E3 * devicePixelRatio / window.innerHeight * h.camera.fov)) : (h.level.pa.translateX(h.delta * -b.velocityX * 1E3 * devicePixelRatio / window.innerWidth * h.camera.fov), h.level.pa.translateZ(h.delta * -b.velocityY * 1E3 * devicePixelRatio / window.innerHeight * h.camera.fov)))) : (h.dir = "no", h.touch.W = 
      !1, !h.f.fixed && h.f.enabled ? (h.f.J.style.opacity = "0", h.f.H.style.opacity = "0") : h.f.fixed && h.f.enabled && (h.f.J.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)"));
    }
    if ("tap" == b.type && h.i.O && h.level.Na && (h.i.mouse.x = b.center.x / window.innerWidth * 2 - 1, h.i.mouse.y = b.center.y / window.innerHeight * -2 + 1, h.i.bb ? h.i.ua.setFromCamera(h.i.mouse, h.R) : h.i.ua.setFromCamera(h.i.mouse, h.camera), b = h.i.ua.intersectObjects(h.i.Ma.children), 0 < b.length)) {
      b = b[0].object;
      d = l = e = -1;
      for (k = 0;k < h.level.cells.length;k++) {
        h.level.cells[k].position.x == b.position.x && h.level.cells[k].position.z == b.position.z && (h.level.cells[k].parent == h.level.M && (e = k), h.level.cells[k].parent == h.level.u && (l = k), h.level.cells[k].parent == h.level.ja && (d = k));
      }
      if (x) {
        var c = new THREE.Vector3(b.position.x, 0, b.position.z);
        v.A.push(c);
        c = "logic_switch" != v.name ? h.i.ab(v.A[v.A.length - 2], v.A[v.A.length - 1]) : h.i.ab(v.A[0], v.A[v.A.length - 1]);
        v.ca.push(c);
      } else {
        -1 != e && "page_tiles" == n && "tool_select" == m ? (void 0 != v && null != v && (v.material = w), w = h.level.cells[e].material, h.level.cells[e].material = h.i.Za, v = h.level.cells[e], h.i.za = v.variant) : -1 != l && "page_logic" == n && "tool_select" == m ? (void 0 != v && null != v && (v.material = w), w = h.level.cells[l].material, h.level.cells[l].material = h.i.Za, v = h.level.cells[l], h.i.za = v.variant) : -1 != d && "page_objects" == n && "tool_select" == m ? (void 0 != v && 
        null != v && (v.material = w), w = h.level.cells[d].material, h.level.cells[d].material = h.i.Za, v = h.level.cells[d], h.i.za = v.variant) : (void 0 != v && null != v && (v.material = w), v = void 0);
        void 0 != v && null != v ? v.parent == h.level.u && "logic_teleporter" != v.name ? (document.getElementById("properties").setAttribute("selected", "true"), document.getElementById("output_alias").innerHTML = v.Da, document.getElementById("output_variant").innerHTML = v.variant, document.getElementById("output_activated").innerHTML = v.$, document.getElementById("output_speed").innerHTML = v.speed, document.getElementById("output_delay").innerHTML = v.S, document.getElementById("data_activated").setAttribute("selected", 
        "true"), document.getElementById("data_speed").setAttribute("selected", "true"), document.getElementById("data_delay").setAttribute("selected", "true"), 0 < v.A.length ? document.getElementById("data_waypoint").setAttribute("selected", "true") : document.getElementById("data_waypoint").setAttribute("selected", "false")) : "logic_teleporter" == v.name ? (document.getElementById("properties").setAttribute("selected", "true"), document.getElementById("output_alias").innerHTML = v.Da, document.getElementById("output_variant").innerHTML = 
        v.variant, document.getElementById("output_activated").innerHTML = v.$, document.getElementById("data_speed").setAttribute("selected", "false"), document.getElementById("data_delay").setAttribute("selected", "false"), document.getElementById("data_activated").setAttribute("selected", "true"), document.getElementById("data_waypoint").setAttribute("selected", "true")) : (document.getElementById("properties").setAttribute("selected", "true"), document.getElementById("output_alias").innerHTML = 
        v.Da, document.getElementById("output_variant").innerHTML = v.variant, document.getElementById("data_activated").setAttribute("selected", "false"), document.getElementById("data_speed").setAttribute("selected", "false"), document.getElementById("data_delay").setAttribute("selected", "false"), document.getElementById("data_waypoint").setAttribute("selected", "false")) : document.getElementById("properties").setAttribute("selected", "false");
        -1 != e && "page_tiles" == n && "tool_erase" == m ? (h.level.M.remove(h.level.cells[e]), h.level.cells.splice(e, 1)) : -1 != e && "page_tiles" == n && "tool_rotate" == m ? (h.level.cells[e].rotation.z -= Math.PI / 2, y = h.level.cells[e].rotation.z) : -1 == e && "page_tiles" == n && "tool_select" == m && (void 0 != h.level.wa.getObjectByName(p + "_" + h.i.za) ? c = h.i.za : c = 1, h.level.Fb(p, c, b.position, y));
        if (-1 != l && "page_logic" == n && "tool_erase" == m) {
          if (void 0 != h.level.cells[l].A) {
            for (k = h.level.cells[l].ca.length - 1;0 <= k;k--) {
              h.i.Ha.remove(h.level.cells[l].ca[k]), h.G.remove(h.level.cells[l].ca[k]);
            }
          }
          void 0 != h.level.cells[l].ba && h.level.cells[l].ba();
          h.level.u.remove(h.level.cells[l]);
          h.level.cells.splice(l, 1);
        } else {
          -1 != l && "page_logic" == n && "tool_rotate" == m ? (h.level.cells[l].rotation[h.level.cells[l].tb] -= Math.PI / 2, y = h.level.cells[l].rotation[h.level.cells[l].tb]) : -1 == l && "page_logic" == n && "tool_select" == m && h.level.Db(r, 1, b.position, y);
        }
        -1 != d && "page_objects" == n && "tool_erase" == m ? (h.level.ja.remove(h.level.cells[d]), h.level.cells.splice(d, 1)) : -1 != d && "page_objects" == n && "tool_rotate" == m ? (h.level.cells[d].rotation.z -= Math.PI / 2, y = h.level.cells[d].rotation.z) : -1 == d && "page_objects" == n && "tool_select" == m && (void 0 != h.level.wa.getObjectByName(u + "_" + h.i.za) ? c = h.i.za : c = 1, h.level.Eb(u, c, b.position, y));
      }
    }
  });
  h.Cb();
};
window.addEventListener("load", function() {
  h.Uc();
});
h = h || {};
h.level = h.level || {};
h.i = h.i || {};
h.B = h.B || {};
h.Cb = function() {
  h.delta = h.Fa.getDelta();
  h.delta = THREE.Math.clamp(h.delta, 0, .06);
  h.md();
  0 == H && (h.i.bb && h.i.O ? h.fa.render(h.G, h.R) : h.fa.render(h.G, h.camera), requestAnimationFrame(h.Cb));
};
h.md = function() {
  if (h.level.Na) {
    1 == I && "#editor" != h.ha && h.stats.begin();
    for (var b = h.ma.length, d = 0;d < b;d++) {
      h.ma[d].update(h.delta);
    }
    h.i.O ? (h.i.Ma.visible = !0, h.j.visible = !1, h.j.I.visible = !1, h.level.pa.rotation.y = h.B.Va(45), h.camera.position.lerp(h.oc, 2 * h.delta), h.running = !1) : h.running && (h.timer.update(h.delta), h.j.qb.update(h.j.I, h.delta, h.camera), h.camera.position.lerp(h.hb, 2 * h.delta), h.level.pa.position.lerp(h.j.getWorldPosition(), 2 * h.delta), h.level.ld(), h.i.Ma.visible = !1, h.fb && (h.key.up && h.key.left ? (h.touch.W = !0, h.touch.Z = 300, h.touch.K = 225) : h.key.up && h.key.right ? 
    (h.touch.W = !0, h.touch.Z = 300, h.touch.K = 315) : h.key.Ra && h.key.left ? (h.touch.W = !0, h.touch.Z = 300, h.touch.K = 125) : h.key.Ra && h.key.right ? (h.touch.W = !0, h.touch.Z = 300, h.touch.K = 45) : h.key.up && !h.key.Ra ? (h.touch.W = !0, h.touch.Z = 300, h.touch.K = 270) : h.key.Ra && !h.key.up ? (h.touch.W = !0, h.touch.Z = 300, h.touch.K = 90) : h.key.left && !h.key.right ? (h.touch.W = !0, h.touch.Z = 300, h.touch.K = 180) : h.key.right && !h.key.left ? (h.touch.W = !0, h.touch.Z = 
    300, h.touch.K = 0) : (h.touch.W = !1, h.touch.Z = 0)), h.touch.W && h.timer.ya && 0 < h.touch.Z && "win" != h.j.m._clip.name && !h.j.qa && !h.j.ba ? h.j.oa.quaternion.copy(h.touch.na) : h.Hc = "no", h.j.qa || h.j.ba || h.j.I.quaternion.slerp(h.touch.na, 20 * h.delta), h.touch.W && h.timer.ya ? (h.Wc(), h.j.qa || h.j.ba || "win" == h.j.m._clip.name || h.j.Ea("run", .2)) : ("idle" == h.j.m._clip.name || "win" == h.j.m._clip.name || h.j.qa || h.j.ba || h.j.Ea("idle", .2), h.f.fixed && h.f.enabled && 
    (h.f.H.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)")));
    h.j.update(h.delta);
    "no" != h.dir && (h.Sc = h.dir);
    1 == I && "#editor" != h.ha && h.stats.end();
  }
};
h.Wc = function() {
  var b = h.delta;
  ja && (-164 > h.touch.K ? h.touch.K = 180 : -95 > h.touch.K ? h.touch.K = -135 : -75 > h.touch.K ? h.touch.K = -90 : -15 > h.touch.K ? h.touch.K = -45 : 15 > h.touch.K ? h.touch.K = 0 : 75 > h.touch.K ? h.touch.K = 45 : 105 > h.touch.K ? h.touch.K = 90 : 155 > h.touch.K ? h.touch.K = 135 : 195 > h.touch.K && (h.touch.K = 180));
  var d = 0, f = h.level.M.children, g = h.level.ja.children;
  h.timer.running = !0;
  if (0 < h.touch.Z && !h.fb) {
    var d = THREE.Math.radToDeg(h.level.pa.rotation.y), e = new THREE.Vector2(h.touch.Jb.x, h.touch.Jb.y), k = 0;
    !h.f.fixed && h.f.enabled ? (h.f.H.style.opacity = "1", h.f.J.style.opacity = "1", k = new THREE.Vector2(h.f.jb.x, h.f.jb.y)) : h.f.fixed && (k = new THREE.Vector2(h.f.F.active.x + h.f.size / 2, h.f.F.active.y + h.f.size / 2));
    e.distanceTo(k) > h.f.size / 3 && e.lerp(k, 1 - 1 / e.distanceTo(k) * (h.f.size / 3));
    h.f.H.style.transform = "translate(" + (e.x - h.f.size / 2) + "px, " + (e.y - h.f.size / 2) + "px)";
  }
  var l = h.j.Xa.getWorldPosition(), c = h.j.Wa.getWorldPosition(), q = k = e = !1;
  for (i = 0;i < f.length;i++) {
    f[i].position.x < l.x + 1.5 && f[i].position.x > l.x - 1.5 && f[i].position.z < l.z + 1.5 && f[i].position.z > l.z - 1.5 && (e = !0, 0 == f[i].gb && (q = !0)), f[i].position.x < c.x + 1.5 && f[i].position.x > c.x - 1.5 && f[i].position.z < c.z + 1.5 && f[i].position.z > c.z - 1.5 && (e = !0, 0 == f[i].gb && (k = !0));
  }
  l = new THREE.Vector3;
  l.copy(h.j.oa.getWorldPosition());
  l.y += .4;
  h.ua.near = .1;
  h.ua.far = 1;
  var c = new THREE.Vector3, t = h.j.Wa.getWorldPosition();
  c.x = t.x - l.x;
  c.y = t.y + .4 - l.y;
  c.z = t.z - l.z;
  c.normalize();
  h.ua.set(l, c);
  t = h.ua.intersectObjects(g);
  0 < t.length && (k = !0);
  t = h.j.Xa.getWorldPosition();
  c.x = t.x - l.x;
  c.y = t.y + .4 - l.y;
  c.z = t.z - l.z;
  c.normalize();
  h.ua.set(l, c);
  t = h.ua.intersectObjects(g);
  0 < t.length && (q = !0);
  d = THREE.Math.degToRad(-(h.touch.K + 90 - d) + 180);
  h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), d);
  !h.timer.ya || h.j.qa || h.j.ba || (d = new THREE.Vector3(0, 0, 1), k && !q ? (--d.x, d.z = 0, d = d.normalize()) : !k && q && (d.x += 1, d.z = 0, d = d.normalize()), k && q || h.j.oa.translateOnAxis(d, b * h.ec), h.level.Lc(h.j.oa.getWorldPosition(), e, f));
};
h.level.Lc = function(b, d, f) {
  var g = null, e = !0, k = h.level.u.children;
  for (i = 0;i < k.length;i++) {
    k[i].position.x < b.x + 1.5 && k[i].position.x > b.x - 1.5 && k[i].position.z < b.z + 1.5 && k[i].position.z > b.z - 1.5 && (g = k[i]);
  }
  d && (e = !1);
  for (i = 0;i < f.length;i++) {
    f[i].position.x < b.x + 1.5 && f[i].position.x > b.x - 1.5 && f[i].position.z < b.z + 1.5 && f[i].position.z > b.z - 1.5 && (e = !1);
  }
  e && (h.timer.ya = !1, h.timer.Ua = .5, h.j.qa = !0, h.j.ba = !0, h.j.I.shadow.visible = !1, setTimeout(h.rb, 1E3));
  h.Vb != g && (h.Vb = g, null != g && g.ga());
};
h.level.ld = function() {
  var b = h.delta, d = h.level.u.children;
  for (i = 0;i < d.length;i++) {
    d[i].update(b);
  }
};
h.Kb = function() {
  var b = h.level.P.url[h.level.P.current];
  (new THREE.XHRLoader).load(b, function(b) {
    h.nb();
    var f;
    f = JSON.parse(b);
    b = f.cells;
    for (var g = h.level.P.lb = 0;g < b.length;g++) {
      "logic_pickupSmall" == b[g].name && h.level.P.lb++;
    }
    h.level.P.Bb = f.time;
    for (g = 0;g < b.length;g++) {
      f = 1, void 0 != b[g].variant && (f = b[g].variant), "group_tiles" == b[g].group ? h.level.Fb(b[g].name, f, new THREE.Vector3(b[g].position.x, b[g].position.y, b[g].position.z), b[g].rotation._z) : "group_logic" == b[g].group ? (f = h.level.Db(b[g].name, f, new THREE.Vector3(b[g].position.x, b[g].position.y, b[g].position.z), b[g].rotation._z), 0 < f.A.length && (f.A = b[g].waypoint.slice()), void 0 != b[g].originalActivated && (f.$ = b[g].originalActivated), f.speed = b[g].speed, f.S = b[g].delay) : 
      "group_objects" == b[g].group && h.level.Eb(b[g].name, f, new THREE.Vector3(b[g].position.x, b[g].position.y, b[g].position.z), b[g].rotation._z);
    }
    for (g = 0;g < h.level.u.children.length;g++) {
      void 0 != h.level.u.children[g].Ta && h.level.u.children[g].Ta();
    }
    h.Ub();
  }, function() {
  });
};
h.nb = function() {
  h.running = !1;
  for (var b = h.level.M.children.length - 1;0 <= b;b--) {
    h.level.M.remove(h.level.M.children[b]);
  }
  for (b = h.level.u.children.length - 1;0 <= b;b--) {
    for (var d = h.level.u.children[b].ca.length - 1;0 <= d;d--) {
      h.i.Ha.remove(h.level.u.children[b].ca[d]), h.G.remove(h.level.u.children[b].ca[d]);
    }
    h.level.u.remove(h.level.u.children[b]);
  }
  for (b = h.level.ja.children.length - 1;0 <= b;b--) {
    h.level.ja.remove(h.level.ja.children[b]);
  }
  h.level.cells = [];
  for (b = h.level.ia.children.length - 1;0 <= b;b--) {
    d = h.level.ia.children[b], h.level.ia.remove(h.level.ia.children[b]), h.G.remove(d);
  }
  for (b = h.ma.length - 1;0 <= b;b--) {
    h.G.remove(h.ma[b]);
  }
  h.ma = [];
  h.ma.push(h.j.o);
  h.D.mb.stop();
  void 0 == h.level.sa ? console.log("map geometry empty") : (h.G.remove(h.level.sa), h.level.sa.geometry.dispose());
  h.level.M.visible = !0;
  h.level.ja.visible = !0;
};
h.Ub = function() {
  for (var b = [], d = 0;d < h.level.u.children.length;d++) {
    "logic_start" == h.level.u.children[d].name && b.push(h.level.u.children[d]);
  }
  h.level.va = b[Math.floor(Math.random() * b.length)];
  if (void 0 == h.j || void 0 == h.level.va) {
    console.error("No Starting Point has been defined.");
  } else {
    h.i.Ha.visible = !1;
    h.level.da = 0;
    void 0 != document.getElementById("collected") && (document.getElementById("collected").innerHTML = "00");
    h.j.position.x = h.level.va.position.x;
    h.j.position.z = h.level.va.position.z;
    h.j.I.position.copy(h.j.position);
    b = new THREE.Matrix4;
    h.level.va.updateMatrix();
    b.extractRotation(h.level.va.matrix);
    d = new THREE.Vector3(0, 1, 0);
    d.applyMatrix4(b);
    d.normalize();
    -.5 > d.x ? h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 1.5 * Math.PI) : .5 < d.z ? h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0) : .5 < d.x ? h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), .5 * Math.PI) : h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    b = [];
    b = h.level.M.children;
    0 == b.length && console.error("No map geometry found! Is the map empty? Did you just press the button to see what would happen?");
    h.level.sa = h.B.Vc(b);
    h.level.sa.geometry.translate(0, 50, 0);
    h.level.M.visible = !1;
    h.G.add(h.level.sa);
    h.level.sa.position.y = -50;
    h.touch.W = !1;
    h.j.Ea("idle", .2);
    h.dir = "no";
    h.running = !0;
    h.j.visible = !0;
    h.j.I.visible = !0;
    for (b = 0;b < h.level.u.children.length;b++) {
      h.level.u.children[b].position.copy(h.level.u.children[b].X), h.level.u.children[b].V = -h.level.u.children[b].S, h.level.u.children[b].U = 0, void 0 != h.level.u.children[b].init && h.level.u.children[b].init();
    }
    h.timer.Ga = !1;
    h.level.pa.position.copy(h.j.getWorldPosition());
    h.G.visible = !0;
    h.f.fixed && (h.f.H.style.opacity = "1", h.f.J.style.opacity = "1");
  }
};
h.rb = function() {
  if (void 0 == h.level.va) {
    console.error("Cannot respawn without starting point. Define Starting Point!");
  } else {
    h.touch.W = !1;
    h.j.Ea("idle", .2);
    h.j.I.visible = !1;
    h.j.position.copy(h.level.va.position);
    h.j.I.position.copy(h.j.position);
    var b = new THREE.Matrix4;
    h.level.va.updateMatrix();
    b.extractRotation(h.level.va.matrix);
    var d = new THREE.Vector3(0, 1, 0);
    d.applyMatrix4(b);
    d.normalize();
    -.5 > d.x ? h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 1.5 * Math.PI) : .5 < d.z ? h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0) : .5 < d.x ? h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), .5 * Math.PI) : h.touch.na.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    h.timer.timeout(1);
    h.j.qa = !1;
    h.level.da = 0;
    void 0 != document.getElementById("collected") && (document.getElementById("collected").innerHTML = "00");
    for (i = 0;i < h.level.u.children.length;i++) {
      h.level.u.children[i].visible = !0, h.level.u.children[i].position.copy(h.level.u.children[i].X), h.level.u.children[i].V = -h.level.u.children[i].S, h.level.u.children[i].U = 0, "logic_end" == h.level.u.children[i].name && (h.level.u.children[i].ended = !1), void 0 != h.level.u.children[i].init && h.level.u.children[i].init();
    }
    h.timer.reset();
    h.timer.running = !1;
    h.dir = "no";
    h.touch.Z = 0;
    h.timer.Ga = !1;
    setTimeout(function() {
      h.j.I.shadow.visible = !0;
      h.j.I.position.y += 2;
      h.j.I.visible = !0;
      h.j.Ob = !1;
      h.D.dd.play();
      h.j.ba = !1;
    }, 300);
    !h.f.fixed && h.f.enabled ? (h.f.J.style.transform = "translate(-500px, -500px)", h.f.H.style.transform = "translate(-500px, -500px)", h.f.H.style.opacity = "0") : h.f.fixed && (h.f.H.style.opacity = "1", h.f.J.style.opacity = "1");
  }
};
h.$c = function() {
  return Math.round(1E5 / h.timer.time) * Math.max(1, h.level.da);
};
h.Yc = function(b, d) {
  var f = h.level.da, g = document.querySelector("#game");
  h.Mc(f, g);
  h.ib = g.querySelector(".backgroundOverlay");
  h.ib.classList.add("show");
  g.querySelector("#ingameUI").style.display = "none";
  g.querySelector("div.levelEnd").classList.remove("invisible");
  g.querySelector(".text.pointsTxt").innerHTML = b.toString();
  g.querySelector(".text.timeTxt").innerHTML = d + "/" + h.timer.Ja(h.level.P.Bb);
  g.querySelector(".text.extrasTxt").innerHTML = f + "/" + h.level.P.lb;
  h.f.H.style.opacity = "0";
  h.f.J.style.opacity = "0";
  h.touch.Z = 0;
  h.f.H.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)";
};
h.Mc = function(b, d) {
  var f = h.timer.time, g = h.level.P.url[h.level.P.current], e = 1;
  b >= h.level.P.lb && (e++, console.log("star pickup count achieved"));
  f <= h.level.P.Bb && (e++, console.log("star time achieved"));
  setTimeout(function() {
    h.D.ed.play();
  }, 500);
  f = new J(ka + g, !1);
  g = null != f.Aa ? !0 : !1;
  0 == g && (f.Aa = "1");
  if (1 < e) {
    var k = d.querySelectorAll("#levelEndStars .star");
    k[1].classList.add("animate");
    setTimeout(function() {
      h.D.fd.play();
    }, 1E3);
    if (0 == g || 2 > parseInt(f.Aa)) {
      f.Aa = "2";
    }
    2 < e && (k[2].classList.add("animate"), setTimeout(function() {
      h.D.gd.play();
    }, 1950), 0 == g || 3 > parseInt(f.Aa)) && (f.Aa = "3");
  }
};
h.Qc = function(b) {
  h.i.O || (h.fb = !0);
  null != h.timer && h.timer.ya ? (38 === b.keyCode && (h.dir = "up", h.key.up = !0, b.preventDefault()), 40 === b.keyCode && (h.dir = "down", h.key.Ra = !0, b.preventDefault()), 37 === b.keyCode && (h.dir = "left", h.key.left = !0), 39 === b.keyCode && (h.dir = "right", h.key.right = !0)) : (h.dir = "no", 38 !== b.keyCode && 40 !== b.keyCode || b.preventDefault());
  87 === b.keyCode && (h.key.w = !0, h.dir = "up", h.i.O && z(document.getElementById("tool_rotate")));
  65 === b.keyCode && (h.key.a = !0, h.dir = "left", h.i.O && A(document.getElementById("page_tiles")));
  83 === b.keyCode && (h.key.s = !0, h.dir = "down", h.i.O && A(document.getElementById("page_logic")));
  68 === b.keyCode && (h.key.d = !0, h.dir = "right", h.i.O && A(document.getElementById("page_objects")));
  81 === b.keyCode && (h.key.q = !0, h.i.O && z(document.getElementById("tool_select")));
  69 === b.keyCode && (h.key.e = !0, h.i.O && z(document.getElementById("tool_erase")));
  33 === b.keyCode && (h.key.bc = !0, h.i.O && (h.fa.setClearColor("#ffffff"), h.i.bb = !0));
  34 === b.keyCode && (h.key.ac = !0, h.i.O && (h.fa.setClearColor("#f0dbad"), h.i.bb = !1));
};
h.Rc = function(b) {
  38 === b.keyCode && (h.key.up = !1);
  40 === b.keyCode && (h.key.Ra = !1);
  37 === b.keyCode && (h.key.left = !1);
  39 === b.keyCode && (h.key.right = !1);
  87 === b.keyCode && (h.key.w = !1);
  65 === b.keyCode && (h.key.a = !1);
  83 === b.keyCode && (h.key.s = !1);
  68 === b.keyCode && (h.key.d = !1);
  81 === b.keyCode && (h.key.q = !1);
  69 === b.keyCode && (h.key.e = !1);
  33 === b.keyCode && (h.key.bc = !1);
  34 === b.keyCode && (h.key.ac = !1);
};
h.La.update = function(b) {
  if (null != h.timer && h.timer.ya) {
    if (.5 < b.Qa[0] || 1 == b.buttons[15].pressed) {
      h.dir = "right";
    }
    if (-.5 > b.Qa[0] || 1 == b.buttons[14].pressed) {
      h.dir = "left";
    }
    if (.5 < b.Qa[1] || 1 == b.buttons[13].pressed) {
      h.dir = "down";
    }
    if (-.5 > b.Qa[1] || 1 == b.buttons[12].pressed) {
      h.dir = "up";
    }
    !(.1 > Math.abs(b.Qa[0]) && .1 > Math.abs(b.Qa[1])) || b.buttons[12].pressed || b.buttons[13].pressed || b.buttons[14].pressed || b.buttons[15].pressed || (h.dir = "no");
  } else {
    h.dir = "no";
  }
};
window.addEventListener("keydown", h.Qc, !1);
window.addEventListener("keyup", h.Rc, !1);
window.addEventListener("resize", function() {
  document.body.scrollTop = 0;
  null != h.camera && (h.camera.aspect = window.innerWidth / window.innerHeight, h.f.hc(), "center" == h.f.mode ? h.f.F.active = h.f.F.center : "left" == h.f.mode ? h.f.F.active = h.f.F.left : "right" == h.f.mode && (h.f.F.active = h.f.F.right), window.innerWidth > window.innerHeight && "center" == h.f.mode && (h.f.F.active = h.f.F.right), h.f.fixed && (h.f.H.style.transform = "translate(" + h.f.F.active.x + "px, " + h.f.F.active.y + "px)", h.f.J.style.transform = "translate(" + h.f.F.active.x + 
  "px, " + h.f.F.active.y + "px)"), h.i.O && (h.R.left = window.innerWidth / -2, h.R.right = window.innerWidth / 2, h.R.top = window.innerHeight / 2, h.R.bottom = window.innerHeight / -2, h.R.updateProjectionMatrix()), h.camera.fov = 1 < h.camera.aspect ? h.Qb : h.Rb, h.camera.updateProjectionMatrix(), h.fa.setSize(window.innerWidth, window.innerHeight), h.G && h.fa.render(h.G, h.camera));
}, !0);
window.addEventListener("hashchange", function() {
  window.location.reload();
});
window.addEventListener("gamepadconnected", function(b) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", b.La.index, b.La.id, b.La.buttons.length, b.La.Qa.length);
});
window.addEventListener("gamepaddisconnected", function(b) {
  console.log("Gamepad disconnected from index %d: %s", b.La.index, b.La.id);
});
document.addEventListener("touchmove", function(b) {
  b.preventDefault();
});
var h = h || {}, ka = "labyrinth3d", I = !1, ja = !1, K = !1, H = !1, L;
h.Uc = function() {
  h.ka = {};
  M();
  L = new N;
  THREE.DefaultLoadingManager.onProgress = function() {
    void 0 != document.querySelector("#loading .percent") && (document.querySelector("#loading .percent").innerHTML = "LOADING");
  };
  THREE.DefaultLoadingManager.onLoad = function() {
    if ("#editor" == h.ha) {
      setTimeout(function() {
        h.init();
      }, 250), h.level.Na = !0;
    } else {
      if (0 == L.Na) {
        L.Na = !0;
        if (window.C()) {
          h.Ya = !0;
          h.fb = !1;
          for (var b = document.querySelector("div.instructions").getElementsByTagName("img"), c = 0;c < b.length;c++) {
            if (b[c].classList.contains("invisible")) {
              b[c].classList.remove("invisible");
              break;
            }
          }
        } else {
          h.f.fixed = !1;
        }
        h.pb = document.getElementById("mute");
        h.pb.addEventListener("click", L.Zb.bind(h));
        h.Lb = document.getElementById("settingsMute");
        h.Lb.addEventListener("click", L.Zb.bind(h));
        L.cd = Array.prototype.slice.call(document.querySelectorAll(".screen"));
        "playing" != h.D.Ab && h.D.Ic.play();
        L.add("menu", O);
        L.add("game", P);
        L.add("credits", Q);
        L.add("levelSelect", R);
        L.add("instructions", S);
        L.add("intro", T);
        L.start("menu");
      }
      L.Ia && (setTimeout(function() {
        L.Ia = !1;
        L.start("game");
        document.getElementById("loading").classList.remove("show");
      }, 3E3), h.level.Na = !0, h.timer.reset());
    }
    console.log("loading complete");
  };
  h.i.Xb = new THREE.LineBasicMaterial({color:65535});
  document.querySelector("body").classList.add("game");
  var b = new THREE.ObjectLoader, d = new THREE.JSONLoader, f = new THREE.TextureLoader, g = new THREE.XHRLoader, e = new U;
  g.load("./states/Loader.xml", function(b) {
    document.getElementById("loading").innerHTML = b;
  });
  g.load("./states/Editor.xml", function(b) {
    h.Sb = b;
  });
  for (var g = "menu game credits levelSelect instructions intro".split(" "), k = 0;k < g.length;k++) {
    e.load("./states/" + g[k] + ".xml", function() {
    });
  }
  d.load("./models/characters/char_01.json", function(b) {
    h.ka.Jc = b;
    f.load("./models/characters/char_01_tex.png", function(b) {
      b.minFilter = THREE.NearestMipMapLinearFilter;
      b.magFilter = THREE.NearestFilter;
      b = new THREE.MeshBasicMaterial({map:b, skinning:!0});
      h.ka.Kc = b;
    });
    f.load("./textures/coin.png", function(b) {
      b.minFilter = THREE.NearestMipMapLinearFilter;
      b.magFilter = THREE.NearestFilter;
      b = new THREE.MeshBasicMaterial({map:b, transparent:!0});
      var d = new THREE.PlaneGeometry(1, 1);
      b = new THREE.Mesh(d, b);
      b.visible = !1;
      h.ka.cc = b;
    });
    f.load("./models/characters/blobShadow.png", function(b) {
      b = new THREE.MeshBasicMaterial({map:b, transparent:!0, opacity:.3});
      var d = new THREE.CircleGeometry(.5, 16);
      h.ka.Oc = new THREE.Mesh(d, b);
    });
  });
  d.load("./models/model_atlas/logic_switch_1.json", function(b) {
    h.level.Oa.logic_switch = b;
  });
  d.load("./models/model_atlas/logic_teleporter_1.json", function(b) {
    h.level.Oa.logic_teleporter = b;
  });
  d.load("./models/model_atlas/logic_receiver_1.json", function(b) {
    h.level.Oa.logic_receiver = b;
  });
  d.load("./models/model_atlas/logic_spikeTrap_1.json", function(b) {
    h.level.Oa.logic_trapSpikes = b;
  });
  d.load("./models/model_atlas/logic_trapMovingSmall_1.json", function(b) {
    h.level.Oa.logic_trapMovingSmall = b;
  });
  f.load("./textures/editor/grid.png", function(b) {
    "#editor" == h.ha && (h.i.Sa = new THREE.MeshBasicMaterial({color:16777215, transparent:!0, map:b, opacity:1}));
  });
  b.load("./models/model_atlas/tile_atlas_01.json", function(b) {
    h.level.ta = new THREE.MeshLambertMaterial({transparent:!0});
    h.level.ob = new THREE.MeshBasicMaterial({skinning:!0, side:THREE.DoubleSide, transparent:!0, fog:!1});
    h.level.Yb = new THREE.MeshBasicMaterial({transparent:!0});
    h.i.Za = new THREE.MeshBasicMaterial({transparent:!0, color:65280, side:THREE.DoubleSide});
    for (k = 0;k < b.children.length;k++) {
      if ("Mesh" == b.children[k].type) {
        var c = b.children[k].material.map;
        b.children[k].material = h.level.ta;
      }
    }
    c.minFilter = THREE.NearestMipMapLinearFilter;
    c.magFilter = THREE.NearestFilter;
    h.ka.kc = c;
    h.level.ta.map = c;
    h.level.ob.map = c;
    h.level.Yb.map = c;
    h.i.Za.map = c;
    h.level.wa = b;
  });
  h.D = {muted:!1, Ab:"none", Ic:new Howl({urls:["sound/music_loop.m4a", "sound/music_loop.ogg"], loop:!0, volume:.8, onend:function() {
  }, onplay:function() {
    h.D.Ab = "playing";
  }, onpause:function() {
    h.D.Ab = "paused";
  }}), dc:new Howl({urls:["sound/pickup_01.m4a", "sound/pickup_01.ogg"], loop:!1, volume:.1}), xb:"none", jd:new Howl({urls:["sound/switch.m4a", "sound/switch.ogg"], loop:!1, volume:.5, onend:function() {
    h.D.xb = "stopped";
  }, onplay:function() {
    h.D.xb = "playing";
  }, onpause:function() {
    h.D.xb = "paused";
  }}), Ib:"none", mb:new Howl({urls:["sound/humming_01.m4a", "sound/humming_01.ogg"], loop:!0, volume:.1, onend:function() {
    h.D.Ib = "stopped";
  }, onplay:function() {
    h.D.Ib = "playing";
  }, onpause:function() {
    h.D.Ib = "paused";
  }}), yb:"none", od:new Howl({urls:["sound/wall.m4a", "sound/wall.ogg"], loop:!1, volume:.7, onend:function() {
    h.D.yb = "stopped";
  }, onplay:function() {
    h.D.yb = "playing";
  }, onpause:function() {
    h.D.yb = "paused";
  }}), jc:new Howl({urls:["sound/spikes.m4a", "sound/spikes.ogg"], loop:!1}), ub:"none", ad:new Howl({urls:["sound/scream_01.m4a", "sound/scream_01.ogg"], loop:!1, volume:1, onend:function() {
    h.D.ub = "stopped";
  }, onplay:function() {
    h.D.ub = "playing";
  }, onpause:function() {
    h.D.ub = "paused";
  }}), vb:"none", bd:new Howl({urls:["sound/scream_02.m4a", "sound/scream_02.ogg"], loop:!1, volume:1, onend:function() {
    h.D.vb = "stopped";
  }, onplay:function() {
    h.D.vb = "playing";
  }, onpause:function() {
    h.D.vb = "paused";
  }}), Nb:"none", dd:new Howl({urls:["sound/sigh_01.m4a", "sound/sigh_01.ogg"], loop:!1, volume:1, onend:function() {
    h.D.Nb = "stopped";
  }, onplay:function() {
    h.D.Nb = "playing";
  }, onpause:function() {
    h.D.Nb = "paused";
  }}), ed:new Howl({urls:["sound/star_01.m4a", "sound/star_01.ogg"], loop:!1, volume:1}), fd:new Howl({urls:["sound/star_02.m4a", "sound/star_02.ogg"], loop:!1, volume:1}), gd:new Howl({urls:["sound/star_03.m4a", "sound/star_03.ogg"], loop:!1, volume:1}), kd:new Howl({urls:["sound/teleport_01.m4a", "sound/teleport_01.ogg"], loop:!1, volume:1}), nd:new Howl({urls:["sound/victory_01.m4a", "sound/victory_01.ogg"], loop:!1, volume:1})};
};
window.C = function() {
  var b = !1, d = navigator.userAgent || navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(d) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(d.substr(0, 
  4))) {
    b = !0;
  }
  return b;
};
function la() {
  var b = !1, d = navigator.userAgent || navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(d) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(d.substr(0, 
  4))) {
    b = !0;
  }
  return b;
}
function U() {
  this.manager = THREE.DefaultLoadingManager;
  this.withCredentials = !1;
}
U.prototype.constructor = U;
U.prototype.load = function(b, d, f, g) {
  var e = 0;
  (new THREE.XHRLoader).load(b, function(d) {
    try {
      var f = document.querySelector("#wrapper");
      f.innerHTML = f.innerHTML + d;
      e++;
    } catch (c) {
      if (g) {
        g(c);
      } else {
        throw c;
      }
    }
    console.log("loaded xml from " + b);
  }, f, g);
};
function M() {
  var b = ma();
  !1 === b ? console.log("no IE/Edge or mobile Safari used") : "safari" == b ? (console.log("Mobile Safari"), document.querySelector("body").classList.add("mobileSafari")) : (12 <= b ? console.log("Edge " + b) : console.log("IE " + b), document.querySelector("body").classList.add("ieedge"));
  console.log(window.navigator.userAgent);
}
M.prototype.constructor = M;
function ma() {
  var b = window.navigator.userAgent, d = b.indexOf("MSIE ");
  if (0 < d) {
    return parseInt(b.substring(d + 5, b.indexOf(".", d)), 10);
  }
  if (0 < b.indexOf("Trident/")) {
    return d = b.indexOf("rv:"), parseInt(b.substring(d + 3, b.indexOf(".", d)), 10);
  }
  d = b.indexOf("Edge/");
  if (0 < d) {
    return parseInt(b.substring(d + 5, b.indexOf(".", d)), 10);
  }
  d = b.indexOf("iPhone;");
  return 0 < b.indexOf("Safari/") && 0 < d && -1 == b.indexOf("CriOS/") ? "safari" : !1;
}
Object.defineProperties(function(b, d) {
  this.Ba = b;
  this.Ka = d ? window.sessionStorage : window.localStorage;
}.prototype, {locked:{get:function() {
  var b;
  try {
    b = this.Ka.getItem(this.Ba);
  } catch (d) {
    b = null;
  }
  return b ? !1 : !0;
}, set:function(b) {
  try {
    b ? this.Ka.removeItem(this.Ba) : this.Ka.setItem(this.Ba, this.Ba);
  } catch (d) {
  }
}}});
function J(b, d) {
  this.Ba = b;
  this.Ka = d ? window.sessionStorage : window.localStorage;
}
Object.defineProperties(J.prototype, {Aa:{get:function() {
  var b;
  try {
    b = this.Ka.getItem(this.Ba);
  } catch (d) {
    b = null;
  }
  return b;
}, set:function(b) {
  try {
    0 == b ? this.Ka.removeItem(this.Ba) : this.Ka.setItem(this.Ba, b);
  } catch (d) {
  }
}}});
function N() {
  this.C = {};
  this.Ya = la();
  window.addEventListener("resize", function() {
    this.resize();
  }.bind(this));
  this.Ia = this.Na = !1;
}
N.prototype.Zb = function() {
  this.pb.classList.contains("mute") ? (Howler.unmute(), this.pb.classList.remove("mute"), this.Lb.classList.remove("mute")) : (Howler.mute(), this.pb.classList.add("mute"), this.Lb.classList.add("mute"));
};
N.prototype.add = function(b, d) {
  var f = Array.prototype.splice.call(arguments, 2);
  this.C[b] = new d;
  this.C[b].screen = document.querySelector("#" + b);
  this.C[b].init.apply(this.C[b], f);
};
N.prototype.start = function(b) {
  var d = Array.prototype.splice.call(arguments, 1);
  if (this.C[b]) {
    var f = document.querySelector("#" + b);
    this.cd.forEach(function(b) {
      "wrapper" != b.id && b.classList.remove("show");
    });
    this.C[b].load(function() {
      f.classList.add("show");
      this.C[b].show.apply(this.C[b], d);
      this.resize();
    }.bind(this));
  } else {
    console.warn('No state "' + b + '"');
  }
};
N.prototype.resize = function(b) {
  setTimeout(function() {
    var d = Math.min(1, window.innerWidth / 640, window.innerHeight / 960);
    I && console.log("scaling to " + d);
    for (var f = document.querySelectorAll(".scale"), g = 0;g < f.length;g++) {
      f[g].style.transform = "scale3d(" + d + ", " + d + ", 1)";
    }
    !b && this.aa && this.aa.resize(window.innerWidth, window.innerHeight, correctOrientation);
  }.bind(this), 500);
};
function V() {
}
V.prototype.init = function() {
};
V.prototype.show = function() {
};
V.prototype.hide = function() {
};
V.prototype.load = function(b) {
  b();
};
function O() {
}
O.prototype = Object.create(V.prototype);
a = O.prototype;
a.constructor = O;
a.init = function() {
  this.C = this.screen.querySelector("button.credits");
  this.C.addEventListener("click", function() {
    L.start("credits");
  });
  this.aa = this.screen.querySelector("button.play");
  this.aa.addEventListener("click", this.Gc.bind(this));
  this.T = this.screen.querySelector("button.tutorial");
  this.T.addEventListener("click", this.hd.bind(this));
  if (1 == I) {
    K = !0;
    var b = document.createElement("div");
    b.innerHTML = "levels unlocked";
    b.style.color = "green";
    b.style.position = "fixed";
    b.style.bottom = "100px";
    b.style.right = 0;
    b.style.fontSize = "x-large";
    b.addEventListener("click", function() {
      1 == K ? (K = !1, b.innerHTML = "levels locked", b.style.color = "crimson") : (K = !0, b.innerHTML = "levels unlocked", b.style.color = "green");
    }.bind(this));
    this.screen.appendChild(b);
  }
};
a.show = function() {
};
a.Gc = function() {
  document.getElementById("loading").classList.add("show");
  L.Ia = !0;
  L.start("intro");
};
a.hd = function() {
  document.getElementById("loading").classList.add("show");
  L.Ia = !0;
  L.start("intro");
};
function P() {
}
P.prototype = Object.create(V.prototype);
a = P.prototype;
a.constructor = P;
a.init = function() {
  this.ra = document.querySelector("#wrapper");
  this.T = document.querySelector("#mute");
  this.aa = this.screen.querySelector("#ingameUI");
  this.ib = this.screen.querySelector(".backgroundOverlay");
  this.nc = this.screen.querySelector("div.instructions");
  this.mc = this.screen.querySelector("#instructionsClose");
  this.mc.addEventListener("click", this.Nc.bind(this));
  this.lc = this.screen.querySelector("#notLast");
  this.$a = this.screen.querySelector("#last");
  this.Pb = this.screen.querySelector("div.settings");
  this.xc = this.screen.querySelector("#settingsOpen");
  this.xc.addEventListener("click", this.$b.bind(this));
  this.wc = this.screen.querySelector("#settingsClose");
  this.wc.addEventListener("click", this.kb.bind(this));
  this.yc = this.screen.querySelector("#settingsRepeat");
  this.yc.addEventListener("click", this.fc.bind(this));
  this.zc = this.screen.querySelector("#settingsSelectLevel");
  this.zc.addEventListener("click", this.gc.bind(this));
  this.rc = this.screen.querySelector("div.levelEnd");
  this.C = this.screen.querySelectorAll("#levelEndStars .star");
  this.uc = this.screen.querySelector("#levelEndRepeat");
  this.uc.addEventListener("click", this.fc.bind(this));
  this.tc = this.screen.querySelector("#levelEndNext");
  this.tc.addEventListener("click", this.Xc.bind(this));
  this.sc = this.screen.querySelector(".levelEndMainMenu");
  this.sc.addEventListener("click", this.Pc.bind(this));
  this.vc = this.screen.querySelector("#levelEndSelectLevel");
  this.vc.addEventListener("click", this.gc.bind(this));
};
a.show = function() {
  this.$b();
  this.kb();
  this.ra.style.pointerEvents = "none";
  this.T.style.display = "none";
  this.lc.classList.remove("last");
  this.$a.classList.add("notLast");
};
a.$b = function() {
  this.aa.style.display = "none";
  this.ib.classList.add("show");
  this.Pb.classList.add("visible");
  H = !0;
  h.timer.Ga = !0;
  h.timer.running = !1;
  h.f.H.style.opacity = "0";
  h.f.J.style.opacity = "0";
};
a.kb = function() {
  h.delta = h.Fa.getDelta();
  W(this);
  h.timer.Ga = !1;
  h.timer.running = !0;
  this.aa.style.display = "";
  this.Pb.classList.remove("visible");
  h.f.fixed && (h.f.H.style.opacity = "1", h.f.J.style.opacity = "1");
};
a.gc = function() {
  X(this);
  this.kb();
  W(this);
  h.nb();
  h.timer.running = !1;
  this.ra.style.pointerEvents = "auto";
  this.T.style.display = "";
  L.start("levelSelect");
  h.f.H.style.opacity = "0";
  h.f.J.style.opacity = "0";
};
a.fc = function() {
  h.delta = h.Fa.getDelta();
  W(this);
  this.kb();
  X(this);
  h.rb();
};
a.Xc = function() {
  h.level.P.url.length - 1 > h.level.P.current ? (na(), h.delta = h.Fa.getDelta(), X(this), W(this), h.level.P.current += 1, h.Kb()) : (this.lc.classList.add("last"), this.$a.classList.remove("notLast"));
};
a.Pc = function() {
  na();
  h.delta = h.Fa.getDelta();
  X(this);
  W(this);
  h.f.H.style.display = "none";
  h.f.J.style.display = "none";
  h.nb();
  this.ra.style.pointerEvents = "auto";
  this.T.style.display = "";
  L.start("menu");
};
a.Nc = function() {
  W(this);
  this.aa.style.display = "";
  this.nc.classList.add("invisible");
  h.delta = h.Fa.getDelta();
};
function X(b) {
  for (var d = 0;d < b.C.length;d++) {
    b.C[d].style.transform = "scale(0)", b.C[d].style.webkitTransform = "scale(0)", b.C[d].style.rd = "scale(0)", b.C[d].style.msTransform = "scale(0)", b.C[d].style.sd = "scale(0)", b.C[d].classList.remove("animate");
  }
  h.delta = h.Fa.getDelta();
  b.aa.style.display = "";
  b.rc.classList.add("invisible");
  h.f.H.style.opacity = "0";
  h.f.J.style.opacity = "0";
}
function W(b) {
  H && (H = !1, h.delta = h.Fa.getDelta(), h.Cb(), b.ib.classList.remove("show"));
}
function na() {
  document.getElementById("loading").classList.add("show");
  L.Ia = !0;
}
function Q() {
}
Q.prototype = Object.create(V.prototype);
Q.prototype.constructor = Q;
Q.prototype.init = function() {
  this.aa = this.screen.querySelector("button.menu");
  this.aa.addEventListener("click", function() {
    L.start("menu");
  });
};
Q.prototype.show = function() {
};
function R() {
}
R.prototype = Object.create(V.prototype);
R.prototype.constructor = R;
R.prototype.init = function() {
  function b() {
    g.removeEventListener(k ? "touchmove" : "mousemove", d);
    g.removeEventListener(k ? "touchend" : "mouseup", b);
    k || g.removeEventListener("mouseleave", b);
  }
  function d(b) {
    var c = k ? b.touches[0].screenY : b.clientY;
    g.scrollTop = g.scrollTop - (-e + c);
    e = c;
    b.preventDefault();
  }
  function f(c) {
    e = (k = "touches" in c) ? c.touches[0].screenY : c.clientY;
    g.addEventListener(k ? "touchmove" : "mousemove", d);
    g.addEventListener(k ? "touchend" : "mouseup", b);
    k || g.addEventListener("mouseleave", b);
  }
  this.ra = !0;
  this.aa = this.screen.querySelector("button.menu");
  this.aa.addEventListener("click", function() {
    L.start("menu");
  });
  var g = this.T = this.screen.querySelector(".scrollInsides"), e = 0, k = !1;
  this.T.addEventListener("touchstart", f);
  this.T.addEventListener("mousedown", f);
  this.C = this.screen.querySelector(".levelSelectMap");
  this.C.querySelector(".levelNumber").innerHTML = h.level.P.url.length.toString();
  var l = this.C.cloneNode(!0), c = document.createElement("Div");
  c.classList.add("levelPath");
  for (var q = h.level.P.url.length - 1;0 < q;q--) {
    l.querySelector(".levelNumber").innerHTML = 10 > q ? "0" + q : "" + q, 1 == q % 2 ? (l.querySelector(".levelBtn").classList.remove("odd"), l.querySelector(".levelBtn").classList.add("even"), c.classList.remove("odd"), c.classList.add("even")) : (l.querySelector(".levelBtn").classList.remove("even"), l.querySelector(".levelBtn").classList.add("odd"), c.classList.remove("even"), c.classList.add("odd")), l.querySelector(".levelBtnContainer").appendChild(c), this.C.innerHTML += l.innerHTML, 1 == 
    q && oa(this);
  }
};
R.prototype.show = function() {
  0 != this.ra && 1 != I || oa(this);
  this.T.scrollTop = this.T.scrollHeight;
};
function oa(b) {
  for (var d = b.C.querySelectorAll(".levelNumber"), f = b.C.querySelectorAll(".levelBtn"), g = h.level.P.url.length - 1, e = 0;e < h.level.P.url.length;e++) {
    var k = new J(ka + h.level.P.url[g], !1);
    if (null != k.Aa || 0 == g || 1 == K) {
      1 != d[e].zb && (d[e].addEventListener("click", b.$a.bind(b, g)), d[e].zb = !0);
      var l = f[e].querySelectorAll(".levelStar"), c = 0;
      null != k.Aa && (c = parseInt(k.Aa));
      for (k = 0;k < l.length;k++) {
        k < c ? l[k].classList.remove("hide") : l[k].classList.add("hide");
      }
      (0 < c || 1 == K) && "undefined" != typeof d[e - 1] && (d[e - 1].classList.remove("closed"), 1 != d[e - 1].zb && (d[e - 1].addEventListener("click", b.$a.bind(b, g + 1)), d[e - 1].zb = !0), d[e - 1].innerHTML = 10 > g + 2 ? "0" + (g + 2) : "" + (g + 2));
    } else {
      l = f[e].querySelectorAll(".levelStar");
      for (c = 0;c < l.length;c++) {
        l[c].classList.add("hide");
      }
      d[e].innerHTML = "";
      d[e].classList.add("closed");
    }
    g--;
    0 == e && (d[e].style.marginTop = "11%");
  }
}
R.prototype.$a = function(b) {
  console.log("loading " + h.level.P.url[b]);
  this.ra = !1;
  h.level.P.current = b;
  document.getElementById("loading").classList.add("show");
  L.Ia = !0;
  var d = document.getElementById("game").querySelector("canvas");
  setTimeout(function() {
    null != d ? h.Kb() : h.init();
    h.f && (h.f.J.style.display = "initial", h.f.H.style.display = "initial");
  }, 250);
};
function S() {
  this.data = [{"class":"i00", text:"Find the way through the labyrinth. Move with the arrow keys or use the joystick on touchscreens."}, {"class":"i01", text:"Collect as many coins as possible on the way. The stars show how well you mastered a level."}, {"class":"i02", text:"Step on the buttons to open and close various paths.."}, {"class":"i03", text:"Be careful, though!<br />Don't run into the spear traps and don't let the bugs get you!<br />You should also take care not to fall into the pit..."}];
  this.C = 0;
}
S.prototype = Object.create(V.prototype);
a = S.prototype;
a.constructor = S;
a.init = function() {
  this.T = this.screen.querySelector("button.next");
  this.T.addEventListener("click", this.Ac.bind(this));
  this.T = this.screen.querySelector("button.prev");
  this.T.addEventListener("click", this.Bc.bind(this));
  this.ra = this.screen.querySelector("button.playButton");
  this.ra.addEventListener("click", this.Cc.bind(this));
  this.aa = this.screen.querySelector("button.menu");
  this.aa.addEventListener("click", function() {
    L.start("menu");
  });
};
a.show = function() {
  this.C = 0;
  var b = this.screen.querySelector(".image");
  this.data.forEach(function(d) {
    b.classList.remove(d["class"]);
  }.bind(this));
  Y(this, 0);
};
a.Ac = function() {
  Y(this, 1);
};
a.Bc = function() {
  Y(this, -1);
};
function Y(b, d) {
  var f = b.screen.querySelector(".buttons"), g = b.C;
  b.C += d;
  if (0 > b.C) {
    b.C = 0;
  } else {
    if (b.C > b.data.length - 1) {
      b.C = b.data.length - 1;
      return;
    }
  }
  var e = b.screen.querySelector(".image"), k = b.screen.querySelector(".text");
  e.classList.remove(b.data[g]["class"]);
  e.classList.add(b.data[b.C]["class"]);
  k.innerHTML = b.data[b.C].text;
  f.classList.remove("first");
  f.classList.remove("last");
  0 == b.C ? f.classList.add("first") : b.C == b.data.length - 1 && f.classList.add("last");
}
a.Cc = function() {
  document.getElementById("loading").classList.add("show");
  L.Ia = !0;
  L.start("levelSelect");
};
function T() {
  this.data = [{"class":"i00"}, {"class":"i01"}, {"class":"i02"}, {"class":"i03"}];
  this.C = 0;
}
T.prototype = Object.create(V.prototype);
a = T.prototype;
a.constructor = T;
a.init = function() {
  this.T = this.screen.querySelector("button.next");
  this.T.addEventListener("click", this.Dc.bind(this));
  this.T = this.screen.querySelector("button.prev");
  this.T.addEventListener("click", this.Ec.bind(this));
  this.ra = this.screen.querySelector("button.playButton");
  this.ra.addEventListener("click", this.Fc.bind(this));
  this.aa = this.screen.querySelector("button.menu");
  this.aa.addEventListener("click", function() {
    L.start("menu");
  });
};
a.show = function() {
  this.C = 0;
  var b = this.screen.querySelector(".image");
  this.data.forEach(function(d) {
    b.classList.remove(d["class"]);
  }.bind(this));
  Z(this, 0);
};
a.Dc = function() {
  Z(this, 1);
};
a.Ec = function() {
  Z(this, -1);
};
function Z(b, d) {
  var f = b.screen.querySelector(".buttons"), g = b.C;
  b.C += d;
  if (0 > b.C) {
    b.C = 0;
  } else {
    if (b.C > b.data.length - 1) {
      b.C = b.data.length - 1;
      return;
    }
  }
  var e = b.screen.querySelector(".image");
  e.classList.remove(b.data[g]["class"]);
  e.classList.add(b.data[b.C]["class"]);
  f.classList.remove("first");
  f.classList.remove("last");
  0 == b.C ? f.classList.add("first") : b.C == b.data.length - 1 && f.classList.add("last");
}
a.Fc = function() {
  document.getElementById("loading").classList.add("show");
  L.Ia = !0;
  L.start("instructions");
};

