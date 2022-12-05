!function() {
    "use strict";
    function BaseMesh(e, t, r) {
        this.module = e,
        this.wgl = t,
        this.wireframe = r,
        this.initializeFace = this.module.cwrap("initializeFace", null, []),
        this.step = this.module.cwrap("step", "number", ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"]),
        this.setVertex = this.module.cwrap("setVertex", "number", ["number", "number", "number", "number"]),
        this.getFacePositionData = this.module.cwrap("getFacePositionData", "number", []),
        this.getFaceNormalData = this.module.cwrap("getFaceNormalData", "number", []),
        this.getFaceVertexCount = this.module.cwrap("getFaceVertexCount", "number", []),
        this.getWrinkleStrengths = this.module.cwrap("getWrinkleStrengths", "number", []),
        this.getMouthiness = this.module.cwrap("getMouthiness", "number", []),
        this.getFaceIndexData = this.module.cwrap("getFaceIndexData", "number", []),
        this.getFaceIndexCount = this.module.cwrap("getFaceIndexCount", "number", []),
        this.getHiddenTriangles = this.module.cwrap("getHiddenTriangles", "number", []),
        this.getHiddenTriangleCount = this.module.cwrap("getHiddenTriangleCount", "number", []),
        this.rayIntersect = this.module.cwrap("rayIntersect", "number", ["number", "number", "number", "number", "number", "number"]),
        this.computeVolume = this.module.cwrap("computeVolume", "number", []),
        this.computeArea = this.module.cwrap("computeArea", "number", []),
        this.computeQuality = this.module.cwrap("computeQuality", "number", []),
        this.computeAverageSpeed = this.module.cwrap("computeAverageSpeed", "number", []),
        this.computeEyeVolume = this.module.cwrap("computeEyeVolume", "number", ["number"]),
        this.computeEyeAverageSpeed = this.module.cwrap("computeEyeAverageSpeed", "number", ["number"]),
        this.initializeFace(),
        this.vertexCount = this.getFaceVertexCount(),
        this.textureWidth = Math.ceil(Math.sqrt(this.vertexCount)),
        this.textureHeight = this.textureWidth,
        this.basePositionsTexture = t.buildTexture(t.RGBA, t.FLOAT, this.textureWidth, this.textureHeight, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.NEAREST, t.NEAREST),
        this.baseNormalsTexture = t.buildTexture(t.RGBA, t.FLOAT, this.textureWidth, this.textureHeight, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.NEAREST, t.NEAREST),
        this.baseVertexBuffer = t.createBuffer();
        for (var n = [], i = 0; i < this.vertexCount; ++i) {
            var o = (i % this.textureWidth + .5) / this.textureWidth
              , a = (Math.floor(i / this.textureWidth) + .5) / this.textureHeight;
            n.push(o),
            n.push(a)
        }
        if (t.bufferData(this.baseVertexBuffer, t.ARRAY_BUFFER, new Float32Array(n), t.STATIC_DRAW),
        this.baseIndices = this.module.HEAPU16.subarray(this.getFaceIndexData() >> 1, (this.getFaceIndexData() >> 1) + this.getFaceIndexCount()),
        this.wireframe) {
            for (var s = [], i = 0; i < this.baseIndices.length; i += 3) {
                var u = this.baseIndices[i + 0]
                  , l = this.baseIndices[i + 1]
                  , c = this.baseIndices[i + 2];
                s.push(u),
                s.push(l),
                s.push(l),
                s.push(c),
                s.push(c),
                s.push(u)
            }
            this.renderingIndexBuffer = t.buildBuffer(t.ELEMENT_ARRAY_BUFFER, new Uint16Array(s), t.STATIC_DRAW),
            this.renderingIndexCount = s.length
        } else
            this.baseIndexBuffer = t.buildBuffer(t.ELEMENT_ARRAY_BUFFER, this.baseIndices, t.STATIC_DRAW),
            this.renderingIndexBuffer = this.baseIndexBuffer,
            this.renderingIndexCount = this.baseIndices.length;
        this.restBasePositions = this.module.HEAPF32.subarray(this.getFacePositionData() >> 2, (this.getFacePositionData() >> 2) + 3 * this.getFaceVertexCount()).slice(0),
        this.restBaseNormals = this.module.HEAPF32.subarray(this.getFaceNormalData() >> 2, (this.getFaceNormalData() >> 2) + 3 * this.getFaceVertexCount()).slice(0),
        this.wrinkleStrengths = this.module.HEAPF32.subarray(this.getWrinkleStrengths() >> 2, (this.getWrinkleStrengths() >> 2) + this.getFaceVertexCount()),
        this.mouthinesses = this.module.HEAPF32.subarray(this.getMouthiness() >> 2, (this.getMouthiness() >> 2) + this.getFaceVertexCount()),
        this.hiddenTriangles = this.module.HEAPU16.subarray(this.getHiddenTriangles() >> 1, (this.getHiddenTriangles() >> 1) + this.getHiddenTriangleCount()),
        this.basePositionsData = new Float32Array(this.textureWidth * this.textureHeight * 4),
        this.baseNormalsData = new Float32Array(this.textureWidth * this.textureHeight * 4)
    }
    function extractVectorFromArray(e, t) {
        return [e[3 * t + 0], e[3 * t + 1], e[3 * t + 2]]
    }
    function BaseTriangle(e, t, r) {
        this.a = e,
        this.b = t,
        this.c = r,
        this.wrinkleIndices = [],
        this.hidden = !1
    }
    function Triangle(e, t, r, n) {
        this.a = e,
        this.b = t,
        this.c = r,
        this.hidden = n,
        this.isBeyondBorder = !1
    }
    function BaseAssociation(e, t) {
        this.baseTriangleIndex = e,
        this.barycentricCoordinates = t
    }
    function Vertex(e) {
        this.baseAssociations = e,
        this.neighbours = [],
        this.opposites = [],
        this.triangles = [],
        this.isOnBorder = !1,
        this.isBeyondBorder = !1,
        this.wrinkleStrength = 1,
        this.mouthiness = 0
    }
    function mix(e, t, r) {
        return (1 - r) * e + r * t
    }
    function mixBarycentric(e, t, r) {
        return [mix(e[0], t[0], r), mix(e[1], t[1], r), mix(e[2], t[2], r)]
    }
    function RawWrinkleMesh(e, t, r, n, i) {
        function o(e, t) {
            return e < t ? (5e4 * e + t).toFixed(0) : (5e4 * t + e).toFixed(0)
        }
        function a(e, t) {
            var r = o(e, t);
            if (this.midpointMap[r] !== undefined)
                return h = this.midpointMap[r];
            for (var n = new Vertex([]), i = this.vertices[e], a = this.vertices[t], s = 0; s < i.baseAssociations.length; ++s)
                for (var u = i.baseAssociations[s], l = 0; l < a.baseAssociations.length; ++l) {
                    var c = a.baseAssociations[l];
                    u.baseTriangleIndex === c.baseTriangleIndex && n.baseAssociations.push(new BaseAssociation(u.baseTriangleIndex,mixBarycentric(u.barycentricCoordinates, c.barycentricCoordinates, .5)))
                }
            this.vertices.push(n);
            var h = this.vertices.length - 1;
            return this.midpointMap[r] = h,
            h
        }
        function s(e, t, r) {
            var n = o(e, t);
            if (S[n] === undefined)
                S[n] = r;
            else {
                var i = S[n];
                this.vertices[r].opposites.push(i),
                this.vertices[i].opposites.push(r)
            }
        }
        this.subdivisions = e,
        this.vertices = [],
        this.baseTriangles = [],
        this.triangles = [],
        this.midpointMap = {};
        for (T = 0; T < r.length; T += 3) {
            w = new BaseTriangle(r[T + 0],r[T + 1],r[T + 2]);
            this.baseTriangles.push(w),
            this.triangles.push(new Triangle(r[T + 0],r[T + 1],r[T + 2],!1))
        }
        for (T = 0; T < t.hiddenTriangles.length; ++T) {
            var u = t.hiddenTriangles[T];
            this.baseTriangles[u].hidden = !0,
            this.triangles[u].hidden = !0
        }
        for (T = 0; T < t.vertexCount; ++T)
            this.vertices.push(new Vertex([]));
        for (T = 0; T < this.baseTriangles.length; ++T) {
            y = this.baseTriangles[T];
            this.vertices[y.a].baseAssociations.push(new BaseAssociation(T,[1, 0, 0])),
            this.vertices[y.b].baseAssociations.push(new BaseAssociation(T,[0, 1, 0])),
            this.vertices[y.c].baseAssociations.push(new BaseAssociation(T,[0, 0, 1]))
        }
        a = a.bind(this);
        for (T = 0; T < this.subdivisions; ++T) {
            for (var l = [], c = 0; c < this.triangles.length; ++c) {
                var h = (y = this.triangles[c]).a
                  , d = y.b
                  , f = y.c
                  , _ = a(h, d)
                  , m = a(d, f)
                  , p = a(f, h);
                l.push(new Triangle(h,_,p,y.hidden)),
                l.push(new Triangle(d,m,_,y.hidden)),
                l.push(new Triangle(f,p,m,y.hidden)),
                l.push(new Triangle(_,m,p,y.hidden))
            }
            this.triangles = l
        }
        for (var g = [], T = 0; T < this.vertices.length; ++T)
            g[T] = !1;
        for (T = 0; T < this.triangles.length; ++T)
            (y = this.triangles[T]).hidden || (g[y.a] = !0,
            g[y.b] = !0,
            g[y.c] = !0);
        for (T = 0; T < this.triangles.length; ++T)
            (y = this.triangles[T]).hidden && (g[y.a] || g[y.b] || g[y.c]) && (g[y.a] ? this.vertices[y.a].isOnBorder = !0 : this.vertices[y.a].isBeyondBorder = !0,
            g[y.b] ? this.vertices[y.b].isOnBorder = !0 : this.vertices[y.b].isBeyondBorder = !0,
            g[y.c] ? this.vertices[y.c].isOnBorder = !0 : this.vertices[y.c].isBeyondBorder = !0,
            g[y.a] = !0,
            g[y.b] = !0,
            g[y.c] = !0,
            y.isBeyondBorder = !0);
        for (var E = [], v = 0, T = 0; T < this.vertices.length; ++T)
            g[T] ? (E[T] = v,
            v += 1) : E[T] = -1;
        for (var A = [], T = 0; T < this.triangles.length; ++T)
            if (!(y = this.triangles[T]).hidden || y.isBeyondBorder) {
                var M = y.isBeyondBorder
                  , x = new Triangle(E[y.a],E[y.b],E[y.c],y.hidden);
                x.isBeyondBorder = M,
                A.push(x)
            }
        this.triangles = A;
        for (var b = [], T = 0; T < this.vertices.length; ++T)
            g[T] && b.push(this.vertices[T]);
        this.vertices = b;
        for (T = 0; T < this.triangles.length; ++T) {
            var y = this.triangles[T];
            this.vertices[y.a].triangles.push(y),
            this.vertices[y.b].triangles.push(y),
            this.vertices[y.c].triangles.push(y)
        }
        for (var R = [0, 1, 2, 3, 4, 5], T = 0; T < this.vertices.length; ++T)
            this.vertices[T].isBeyondBorder ? this.vertices[T].neighbours = R : this.vertices[T].sortTriangles(T);
        var S = {};
        s = s.bind(this);
        for (T = 0; T < this.triangles.length; ++T)
            s((y = this.triangles[T]).a, y.b, y.c),
            s(y.b, y.c, y.a),
            s(y.c, y.a, y.b);
        for (var P = [0, 1, 2, 3, 4, 5], T = 0; T < this.vertices.length; ++T)
            this.vertices[T].isBeyondBorder && (this.vertices[T].opposites = P);
        for (var C = [], T = 0; T < this.triangles.length; ++T)
            this.triangles[T].isBeyondBorder || C.push(this.triangles[T]);
        this.triangles = C;
        for (T = 0; T < this.vertices.length; ++T) {
            var D = this.vertices[T]
              , I = D.baseAssociations[0]
              , w = this.baseTriangles[I.baseTriangleIndex]
              , N = I.barycentricCoordinates[0]
              , F = I.barycentricCoordinates[1]
              , L = I.barycentricCoordinates[2];
            D.wrinkleStrength = N * n[w.a] + F * n[w.b] + L * n[w.c],
            D.mouthiness = N * i[w.a] + F * i[w.b] + L * i[w.c],
            (D.isOnBorder || D.isBeyondBorder) && (D.wrinkleStrength = 0)
        }
        for (T = 0; T < this.vertices.length; ++T)
            for (c = 0; c < this.vertices[T].baseAssociations.length; ++c)
                this.baseTriangles[this.vertices[T].baseAssociations[c].baseTriangleIndex].wrinkleIndices.push(T)
    }
    function getMouthRing(e, t) {
        for (var r = {}, n = -1, i = 0; i < e.triangles.length; ++i) {
            var o = e.triangles[i]
              , a = e.vertices[o.a]
              , s = e.vertices[o.b]
              , u = e.vertices[o.c];
            a.mouthiness === t && s.mouthiness === t && u.mouthiness > t && (r[o.a] = o.b,
            -1 === n && (n = o.a)),
            s.mouthiness === t && u.mouthiness === t && a.mouthiness > t && (r[o.b] = o.c,
            -1 === n && (n = o.b)),
            u.mouthiness === t && a.mouthiness === t && s.mouthiness > t && (r[o.c] = o.a,
            -1 === n && (n = o.c))
        }
        for (var l = [n]; r[l[l.length - 1]] !== l[0]; )
            l.push(r[l[l.length - 1]]);
        return l
    }
    function clamp(e, t, r) {
        return e < t && (e = t),
        e > r && (e = r),
        e
    }
    function smoothstep(e, t, r) {
        return (r = clamp((r - e) / (t - e), 0, 1)) * r * (3 - 2 * r)
    }
    function mod(e, t) {
        var r = e % t;
        return r < 0 ? r + t : r
    }
    function MouthRing(e, t, r) {
        this.mouthiness = e,
        this.mouthPoints = t,
        this.smoothingIterations = r,
        this.positions = new Float32Array(3 * this.mouthPoints.length),
        this.positionsTemp = new Float32Array(3 * this.mouthPoints.length)
    }
    function MouthPoint(e, t) {
        this.wrinkleIndex = e,
        this.baseAssociation = t
    }
    function Mouth(e, t) {
        function r(r) {
            for (var n = [], i = getMouthRing(e, r), o = 0; o < i.length; ++o)
                n.push(new MouthPoint(i[o],e.vertices[i[o]].baseAssociations[0]));
            this.mouthRings.push(new MouthRing(r,n,t))
        }
        this.mouthRings = [],
        r = r.bind(this);
        for (var n = .5 * Math.pow(.5, e.subdivisions), i = 0; i < 1; i += n)
            r(i);
        for (var o = 0; o < e.vertices.length; ++o) {
            var a = e.vertices[o];
            1 === a.mouthiness && this.mouthRings.push(new MouthRing(1,[new MouthPoint(o,a.baseAssociations[0])],t))
        }
    }
    function WrinkleMesh(e, t, r, n, i, o, a, s) {
        function u(t) {
            return e.buildTexture(e.RGBA, e.FLOAT, c, h, t, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.NEAREST, e.NEAREST)
        }
        var l = this.rawMesh = new RawWrinkleMesh(t,r,r.baseIndices,r.wrinkleStrengths,r.mouthinesses);
        this.mouth = new Mouth(l,s);
        for (var c = this.textureWidth = Math.ceil(Math.sqrt(l.vertices.length)), h = this.textureHeight = c, d = [], f = 0; f < l.vertices.length; ++f) {
            var _ = (f % c + .5) / c
              , m = (Math.floor(f / c) + .5) / h;
            d.push(_),
            d.push(m)
        }
        this.vertexBuffer = e.createBuffer(),
        e.bufferData(this.vertexBuffer, e.ARRAY_BUFFER, new Float32Array(d), e.STATIC_DRAW);
        for (var p = [], f = 0; f < l.triangles.length; ++f) {
            var g = l.triangles[f];
            a ? (p.push(g.a),
            p.push(g.b),
            p.push(g.b),
            p.push(g.c),
            p.push(g.c),
            p.push(g.a)) : (p.push(g.a),
            p.push(g.b),
            p.push(g.c))
        }
        this.indexBuffer = e.createBuffer(),
        e.bufferData(this.indexBuffer, e.ELEMENT_ARRAY_BUFFER, new Uint16Array(p), e.STATIC_DRAW),
        this.wrinkleIndexCount = p.length;
        for (var T = new Float32Array(c * h * 4), E = new Float32Array(c * h * 4), v = new Float32Array(c * h * 4), A = new Float32Array(c * h * 4), M = new Float32Array(c * h * 4), x = new Float32Array(c * h * 4), b = new Float32Array(c * h * 4), y = new Float32Array(c * h * 4), f = 0; f < c * h; ++f)
            if (f < l.vertices.length) {
                for (var R = l.vertices[f], S = R.baseAssociations[0], P = l.baseTriangles[S.baseTriangleIndex], C = R.wrinkleStrength, D = R.mouthiness, I = 0; I < 4; ++I)
                    b[4 * f + I] = C,
                    y[4 * f + I] = D;
                T[4 * f + 0] = P.a,
                T[4 * f + 1] = P.b,
                T[4 * f + 2] = P.c,
                T[4 * f + 3] = 0,
                E[4 * f + 0] = S.barycentricCoordinates[0],
                E[4 * f + 1] = S.barycentricCoordinates[1],
                E[4 * f + 2] = S.barycentricCoordinates[2],
                E[4 * f + 3] = 0,
                v[4 * f + 0] = R.neighbours[0],
                v[4 * f + 1] = R.neighbours[1],
                v[4 * f + 2] = R.neighbours[2],
                v[4 * f + 3] = R.neighbours[3],
                A[4 * f + 0] = R.neighbours[4],
                A[4 * f + 1] = R.neighbours.length > 5 ? R.neighbours[5] : -1,
                A[4 * f + 2] = -1,
                A[4 * f + 3] = -1,
                M[4 * f + 0] = R.opposites[0],
                M[4 * f + 1] = R.opposites[1],
                M[4 * f + 2] = R.opposites[2],
                M[4 * f + 3] = R.opposites[3],
                x[4 * f + 0] = R.opposites[4],
                x[4 * f + 1] = R.opposites.length > 5 ? R.opposites[5] : -1,
                x[4 * f + 2] = -1,
                x[4 * f + 3] = -1
            } else
                for (I = 0; I < 4; ++I)
                    T[4 * f + I] = 0,
                    E[4 * f + I] = 0,
                    v[4 * f + I] = -1,
                    A[4 * f + I] = -1,
                    M[4 * f + I] = -1,
                    x[4 * f + I] = -1,
                    b[4 * f + I] = 0,
                    y[4 * f + I] = 0;
        this.wrinkleAssociationTexture = u(T),
        this.wrinkleBarycentricCoordinatesTexture = u(E),
        this.neighboursTextureA = u(v),
        this.neighboursTextureB = u(A),
        this.oppositesTextureA = u(M),
        this.oppositesTextureB = u(x),
        this.wrinkleStrengthTexture = u(b),
        this.mouthinessTexture = u(y),
        this.neighboursDistancesTextureA = u(null),
        this.neighboursDistancesTextureB = u(null),
        this.oppositesDistancesTextureA = u(null),
        this.oppositesDistancesTextureB = u(null),
        this.positionsTexture = u(null),
        this.positionsTextureTemp = u(null),
        this.normalsTexture = u(null),
        this.attachmentPositionsTexture = u(null),
        this.fixedTexture = e.buildTexture(e.RGBA, e.UNSIGNED_BYTE, c, h, null, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.NEAREST, e.NEAREST)
    }
    function WrinkleSimulator(e, t) {
        this.wgl = e,
        this.wireframe = t,
        this.attachmentPositionsProgram = e.createProgram(Shaders["fullscreen.vert"], Shaders["attachmentpositions.frag"], {
            a_position: 0
        }),
        this.attachmentConstraintProgram = e.createProgram(Shaders["fullscreen.vert"], Shaders["attachmentconstraint.frag"], {
            a_position: 0
        }),
        this.distanceConstraintProgram = e.createProgram(Shaders["fullscreen.vert"], Shaders["distanceconstraint.frag"], {
            a_position: 0
        }),
        this.normalsProgram = e.createProgram(Shaders["fullscreen.vert"], Shaders["normals.frag"], {
            a_position: 0
        }),
        this.copyProgram = e.createProgram(Shaders["fullscreen.vert"], Shaders["copy.frag"], {
            a_position: 0
        }),
        this.constraintDistanceProgram = e.createProgram(Shaders["fullscreen.vert"], Shaders["constraintdistance.frag"], {
            a_position: 0
        }),
        this.markFixedProgram = e.createProgram(Shaders["markfixed.vert"], Shaders["markfixed.frag"], {
            a_index: 0
        }),
        this.setPositionProgram = e.createProgram(Shaders["setposition.vert"], Shaders["setposition.frag"], {
            a_index: 0,
            a_position: 1
        }),
        this.quadVertexBuffer = e.createBuffer(),
        e.bufferData(this.quadVertexBuffer, e.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), e.STATIC_DRAW),
        this.markBuffer = e.createBuffer(),
        this.mouthIndicesBuffer = e.createBuffer(),
        this.mouthPositionsBuffer = e.createBuffer(),
        this.framebuffer = e.createFramebuffer(),
        this.initialized = !1,
        this.wrinkleMeshes = {}
    }
    function swap(e, t, r) {
        var n = e[t];
        e[t] = e[r],
        e[r] = n
    }
    function StaticSkin(e, t, r, n, i) {
        for (var o = this.rawMesh = new RawWrinkleMesh(1,t,t.baseIndices,t.wrinkleStrengths,t.mouthinesses), a = [], s = 0; s < o.triangles.length; ++s) {
            var u = o.triangles[s];
            a.push(u.a),
            a.push(u.b),
            a.push(u.c)
        }
        this.indexBuffer = e.buildBuffer(e.ELEMENT_ARRAY_BUFFER, new Uint16Array(a), e.STATIC_DRAW),
        this.indexCount = a.length;
        for (var l = new Float32Array(3 * o.vertices.length), c = new Float32Array(3 * o.vertices.length), h = new Float32Array(o.vertices.length), s = 0; s < o.vertices.length; ++s) {
            var d = o.vertices[s]
              , f = d.baseAssociations[0]
              , _ = o.baseTriangles[f.baseTriangleIndex];
            l[3 * s + 0] = _.a,
            l[3 * s + 1] = _.b,
            l[3 * s + 2] = _.c,
            c[3 * s + 0] = f.barycentricCoordinates[0],
            c[3 * s + 1] = f.barycentricCoordinates[1],
            c[3 * s + 2] = f.barycentricCoordinates[2],
            h[s] = d.mouthiness
        }
        this.associationsBuffer = e.buildBuffer(e.ARRAY_BUFFER, l, e.STATIC_DRAW),
        this.barycentricCoordinatesBuffer = e.buildBuffer(e.ARRAY_BUFFER, c, e.STATIC_DRAW),
        this.mouthinessesBuffer = e.buildBuffer(e.ARRAY_BUFFER, h, e.STATIC_DRAW)
    }
    function Light(e, t, r, n, i) {
        this.azimuth = t,
        this.elevation = r,
        this.distance = n,
        this.brightness = i,
        this.wgl = e,
        this.near = .1,
        this.far = 100,
        this.recomputeViewMatrix(),
        this.projectionMatrix = Matrix4.makePerspective(new Float32Array(16), Math.PI / 4, 1, this.near, this.far),
        this.projectionViewMatrix = Matrix4.premultiply(new Float32Array(16), this.viewMatrix, this.projectionMatrix),
        this.shadowMapWidth = 1024,
        this.depthColorTexture = e.buildTexture(e.RGBA, e.UNSIGNED_BYTE, this.shadowMapWidth, this.shadowMapWidth, null, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.LINEAR, e.LINEAR),
        this.depthTexture = e.buildTexture(e.DEPTH_COMPONENT, e.UNSIGNED_SHORT, this.shadowMapWidth, this.shadowMapWidth, null, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.LINEAR, e.LINEAR)
    }
    function ShadowRenderer(e, t) {
        this.wgl = e,
        this.wireframe = t,
        this.wgl.getExtension("WEBGL_depth_texture"),
        this.skinDepthProgram = e.createProgram(Shaders["skindepth.vert"], Shaders["skindepth.frag"], {
            a_textureCoordinates: 0
        }),
        this.eyeDepthProgram = e.createProgram(Shaders["eyedepth.vert"], Shaders["eyedepth.frag"], {
            a_position: 0
        }),
        this.hairDepthProgram = e.createProgram("#define DEPTH 1 \n" + Shaders["hair.vert"], Shaders["hairdepth.frag"]),
        this.staticSkinDepthProgram = e.createProgram("#define DEPTH 1 \n" + Shaders["staticskin.vert"], Shaders["skindepth.frag"]),
        this.framebuffer = e.createFramebuffer()
    }
    function gaussian(e, t) {
        for (var r = [], n = 0; n < 3; ++n) {
            var i = t / (.001 + falloff[n]);
            r[n] = Math.exp(-i * i / (2 * e)) / (2 * Math.PI * e)
        }
        return r
    }
    function profile(e) {
        return Vector3.addList([], [Vector3.multiplyByScalar([], gaussian(.0484, e), .1), Vector3.multiplyByScalar([], gaussian(.187, e), .118), Vector3.multiplyByScalar([], gaussian(.567, e), .113), Vector3.multiplyByScalar([], gaussian(1.99, e), .358), Vector3.multiplyByScalar([], gaussian(7.41, e), .078)])
    }
    function generateSamples(e) {
        for (var t = e > 20 ? 3 : 2, r = [], n = 2 * t / (e - 1), i = 0; i < e; ++i) {
            var o = i * n - t
              , a = o < 0 ? -1 : 1;
            r.push(t * a * Math.abs(Math.pow(o, 2)) / Math.pow(t, 2))
        }
        for (var s = [], i = 0; i < e; ++i) {
            var u = ((i > 0 ? Math.abs(r[i] - r[i - 1]) : 0) + (i < e - 1 ? Math.abs(r[i] - r[i + 1]) : 0)) / 2;
            profile(r[i]);
            (l = Vector3.multiplyByScalar([], profile(r[i]), u))[3] = r[i],
            s.push(l)
        }
        for (var l = s[Math.floor(e / 2)], i = Math.floor(e / 2); i > 0; --i)
            s[i] = s[i - 1];
        s[0] = l;
        for (var c = Vector3.addList([], s), i = 0; i < e; ++i)
            s[i][0] /= c[0],
            s[i][1] /= c[1],
            s[i][2] /= c[2];
        var h = [.58, .2, 0];
        s[0][0] = 1 * (1 - h[0]) + h[0] * s[0][0],
        s[0][1] = 1 * (1 - h[1]) + h[1] * s[0][1],
        s[0][2] = 1 * (1 - h[2]) + h[2] * s[0][2];
        for (i = 1; i < e; ++i)
            Vector3.multiply(s[i], s[i], h);
        return s
    }
    function createSSSBlurShader(e) {
        var t = generateSamples(e)
          , r = ["precision highp float;", "varying vec2 v_coordinates;", "uniform sampler2D u_colorTexture;", "uniform sampler2D u_depthTexture;", "uniform vec2 u_direction;", "uniform vec2 u_resolution;", "uniform mat4 u_projectionMatrix;", "uniform float u_near;", "uniform float u_far;", "float linearizeDepth (float depth, float near, float far) {", "depth = 2.0 * depth - 1.0;", "return 2.0 * near * far / (far + near - depth * (far - near));", "}", "void main () {", "vec4 color = texture2D(u_colorTexture, v_coordinates);", "if (color.a == 0.0) discard;", "vec3 colorM = color.rgb;", "float z = linearizeDepth(texture2D(u_depthTexture, v_coordinates).r, u_near, u_far);", "float width = 0.2;", "vec4 corner = vec4(width, width, z, 1.0);", "corner = u_projectionMatrix * corner;", "corner.xyz /= corner.w;", "corner.xy *= 0.5;", "corner.xy = abs(corner.xy);", "vec3 kernel0 = " + ("vec3(" + t[0][0].toFixed(10) + "," + t[0][1].toFixed(10) + "," + t[0][2].toFixed(10) + ")") + ";", "vec3 colorBlurred = colorM;", "colorBlurred *= kernel0;", "vec2 delta = u_direction * corner.xy;"].join("\n");
        r += "\n";
        for (var n = 1; n < t.length; ++n) {
            var i = t[n]
              , o = "sample" + n.toFixed(0);
            r += ["vec4 " + o + " = texture2D(u_colorTexture, v_coordinates + delta * " + i[3].toFixed(10) + ");", o + ".rgb = mix(colorM, " + o + ".rgb, step(0.5, " + o + ".a));", "colorBlurred.rgb += vec3(" + i[0].toFixed(10) + "," + i[1].toFixed(10) + "," + i[2].toFixed(10) + ") * " + o + ".rgb;"].join("\n"),
            r += "\n"
        }
        return r += ["gl_FragColor = vec4(colorBlurred, 1.0);", "}"].join("\n")
    }
    function generateGridOffsets(e, t) {
        var r = []
          , n = .5 / (e / 2) - 1
          , i = 1 / (e / 2);
        n *= t,
        i *= t;
        for (var o = 0; o < e; ++o)
            for (var a = 0; a < e; ++a)
                r.push([n + a * i, n + o * i]);
        return r
    }
    function generateShadowFunction(e, t) {
        for (var r = generateGridOffsets(e, t / 1024), n = ["float shadow = 0.0;"], i = 1 / r.length, o = 0; o < r.length; ++o) {
            var a = r[o]
              , s = "vec2(" + a[0].toFixed(8) + "," + a[1].toFixed(8) + ")";
            n.push("shadow += " + i.toFixed(8) + " * texture2DShadowLerp(depthTexture, resolution, lightSpaceCoordinates + " + s + ", lightSpacePosition.z - 0.0001);")
        }
        return n.push("return shadow;"),
        n.join("\n")
    }
    function generateLightingCommon(e, t) {
        return Shaders["lightingcommon.glsl"].replace("<shadow>", generateShadowFunction(e, t))
    }
    function Renderer(e, t) {
        this.canvas = e,
        this.wgl = t,
        this.programSets = {
            0: {
                sssBlurProgram: t.createProgram(Shaders["fullscreen.vert"], createSSSBlurShader(13), {
                    a_position: 0
                })
            },
            1: {
                sssBlurProgram: t.createProgram(Shaders["fullscreen.vert"], createSSSBlurShader(17), {
                    a_position: 0
                })
            }
        },
        this.lightingCommons = {
            0: generateLightingCommon(3, 5),
            1: generateLightingCommon(4, 5)
        },
        this.compositeProgram = t.createProgram(Shaders["fullscreen.vert"], Shaders["composite.frag"], {
            a_position: 0
        }),
        this.fxaaProgram = t.createProgram(Shaders["fullscreen.vert"], Shaders["fxaa.frag"], {
            a_position: 0
        }),
        this.backgroundProgram = t.createProgram(Shaders["background.vert"], Shaders["background.frag"], {
            a_position: 0
        }),
        this.imageProgram = t.createProgram(Shaders["image.vert"], Shaders["image.frag"], {
            a_position: 0
        }),
        this.staticSkinProgram = t.createProgram(Shaders["staticskin.vert"], this.lightingCommons[0] + Shaders["wrinkle.frag"]),
        this.quadVertexBuffer = t.createBuffer(),
        t.bufferData(this.quadVertexBuffer, t.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), t.STATIC_DRAW),
        this.cameraPosition = [0, 0, 1.7],
        this.viewMatrix = Matrix4.makeTranslation(new Float32Array(16), -this.cameraPosition[0], -this.cameraPosition[1], -this.cameraPosition[2]),
        this.lights = [new Light(t,-1,0,5,1), new Light(t,1,0,5,.2)],
        this.framebuffer = t.createFramebuffer(),
        this.colorTexture = t.buildTexture(t.RGBA, t.UNSIGNED_BYTE, this.canvas.width, this.canvas.height, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.LINEAR, t.LINEAR),
        this.colorTextureTemp = t.buildTexture(t.RGBA, t.UNSIGNED_BYTE, this.canvas.width, this.canvas.height, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.LINEAR, t.LINEAR),
        this.depthTexture = t.buildTexture(t.DEPTH_COMPONENT, t.UNSIGNED_SHORT, this.canvas.width, this.canvas.height, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.LINEAR, t.LINEAR),
        this.shadowRenderer = new ShadowRenderer(t),
        this.fov = MIN_FOV,
        this.targetFOV = this.fov,
        this.canvas.addEventListener("wheel", function(e) {
            var t = e.deltaY;
            this.targetFOV = t > 0 ? MAX_FOV : MIN_FOV
        }
        .bind(this))
    }
    function Eye(e, t, r) {
        this.module = e,
        this.wgl = t,
        this.index = r,
        this.getEyePositionData = this.module.cwrap("getEyePositionData", "number", ["number"]),
        this.getEyeNormalData = this.module.cwrap("getEyeNormalData", "number", ["number"]),
        this.getEyeVertexCount = this.module.cwrap("getEyeVertexCount", "number", ["number"]),
        this.getEyeIndices = this.module.cwrap("getEyeIndices", "number", ["number"]),
        this.getEyeIndexCount = this.module.cwrap("getEyeIndexCount", "number", ["number"]),
        this.getEyeIndex = this.module.cwrap("getEyeIndex", "number", ["number"]),
        this.baseIndex = this.getEyeIndex(r),
        this.indices = this.module.HEAPU16.subarray(this.getEyeIndices(r) >> 1, (this.getEyeIndices(r) >> 1) + this.getEyeIndexCount()),
        this.vertices = this.module.HEAPF32.subarray(this.getEyePositionData(r) >> 2, (this.getEyePositionData(r) >> 2) + 3 * this.getEyeVertexCount(r)),
        this.normals = this.module.HEAPF32.subarray(this.getEyeNormalData(r) >> 2, (this.getEyeNormalData(r) >> 2) + 3 * this.getEyeVertexCount(r)),
        this.positionsBuffer = t.buildBuffer(t.ARRAY_BUFFER, this.vertices, t.STATIC_DRAW),
        this.normalsBuffer = t.buildBuffer(t.ARRAY_BUFFER, this.normals, t.STATIC_DRAW),
        this.indexBuffer = t.buildBuffer(t.ELEMENT_ARRAY_BUFFER, this.indices, t.STATIC_DRAW),
        this.indicesCount = this.indices.length,
        this.lookDirection = [0, 0, 1]
    }
    function Ear(e, t, r) {
        this.module = e,
        this.wgl = t,
        this.index = r,
        this.getPositionData = this.module.cwrap("getEarPositionData", "number", ["number"]),
        this.getNormalData = this.module.cwrap("getEarNormalData", "number", ["number"]),
        this.getVertexCount = this.module.cwrap("getEarVertexCount", "number", ["number"]),
        this.getIndices = this.module.cwrap("getEarIndices", "number", ["number"]),
        this.getIndexCount = this.module.cwrap("getEarIndexCount", "number", ["number"]),
        this.indices = this.module.HEAPU16.subarray(this.getIndices(this.index) >> 1, (this.getIndices(this.index) >> 1) + this.getIndexCount(this.index)),
        this.vertices = this.module.HEAPF32.subarray(this.getPositionData(this.index) >> 2, (this.getPositionData(this.index) >> 2) + 3 * this.getVertexCount(this.index)),
        this.normals = this.module.HEAPF32.subarray(this.getNormalData(this.index) >> 2, (this.getNormalData(this.index) >> 2) + 3 * this.getVertexCount(this.index)),
        this.positionsBuffer = t.buildBuffer(t.ARRAY_BUFFER, this.vertices, t.STATIC_DRAW),
        this.normalsBuffer = t.buildBuffer(t.ARRAY_BUFFER, this.normals, t.STATIC_DRAW),
        this.indexBuffer = t.buildBuffer(t.ELEMENT_ARRAY_BUFFER, this.indices, t.STATIC_DRAW),
        this.indicesCount = this.indices.length
    }
    function Triangle$1(e, t, r) {
        this.a = e,
        this.b = t,
        this.c = r
    }
    function BaseAssociation$1(e, t) {
        this.baseTriangleIndex = e,
        this.barycentricCoordinates = t
    }
    function Vertex$1(e) {
        this.baseAssociations = e,
        this.restPosition = [0, 0, 0]
    }
    function mix$1(e, t, r) {
        return (1 - r) * e + r * t
    }
    function mixBarycentric$1(e, t, r) {
        return [mix$1(e[0], t[0], r), mix$1(e[1], t[1], r), mix$1(e[2], t[2], r)]
    }
    function interpolateBarycentric$1(e, t, r, n, i, o) {
        for (var a = [], s = 0; s < e.length; ++s)
            a[s] = e[s] * n + t[s] * i + r[s] * o;
        return a
    }
    function PNMesh(e, t, r, n) {
        function i(e, t) {
            return e < t ? (5e4 * e + t).toFixed(0) : (5e4 * t + e).toFixed(0)
        }
        function o(e, t) {
            var r = i(e, t);
            if (this.midpointMap[r] !== undefined)
                return h = this.midpointMap[r];
            for (var n = new Vertex$1([]), o = this.vertices[e], a = this.vertices[t], s = 0; s < o.baseAssociations.length; ++s)
                for (var u = o.baseAssociations[s], l = 0; l < a.baseAssociations.length; ++l) {
                    var c = a.baseAssociations[l];
                    u.baseTriangleIndex === c.baseTriangleIndex && (n.baseAssociations.push(new BaseAssociation$1(u.baseTriangleIndex,mixBarycentric$1(u.barycentricCoordinates, c.barycentricCoordinates, .5))),
                    1)
                }
            this.vertices.push(n);
            var h = this.vertices.length - 1;
            return this.midpointMap[r] = h,
            h
        }
        this.vertices = [],
        this.baseTriangles = [],
        this.triangles = [],
        this.midpointMap = {};
        for (p = 0; p < r.length; p += 3) {
            var a = new Triangle$1(r[p + 0],r[p + 1],r[p + 2]);
            this.baseTriangles.push(a),
            this.triangles.push(new Triangle$1(r[p + 0],r[p + 1],r[p + 2]))
        }
        for (p = 0; p < t; ++p)
            this.vertices.push(new Vertex$1([]));
        for (p = 0; p < this.baseTriangles.length; ++p) {
            var s = this.baseTriangles[p];
            this.vertices[s.a].baseAssociations.push(new BaseAssociation$1(p,[1, 0, 0])),
            this.vertices[s.b].baseAssociations.push(new BaseAssociation$1(p,[0, 1, 0])),
            this.vertices[s.c].baseAssociations.push(new BaseAssociation$1(p,[0, 0, 1]))
        }
        o = o.bind(this);
        for (p = 0; p < e; ++p) {
            for (var u = [], l = 0; l < this.triangles.length; ++l) {
                var c = (s = this.triangles[l]).a
                  , h = s.b
                  , d = s.c
                  , f = o(c, h)
                  , _ = o(h, d)
                  , m = o(d, c);
                u.push(new Triangle$1(c,f,m,s.hidden)),
                u.push(new Triangle$1(h,_,f,s.hidden)),
                u.push(new Triangle$1(d,m,_,s.hidden)),
                u.push(new Triangle$1(f,_,m,s.hidden))
            }
            this.triangles = u
        }
        for (var p = 0; p < this.vertices.length; ++p) {
            var g = this.vertices[p]
              , T = g.baseAssociations[0]
              , E = (a = this.baseTriangles[T.baseTriangleIndex]).a
              , v = a.b
              , A = a.c
              , M = [n[3 * E + 0], n[3 * E + 1], n[3 * E + 2]]
              , x = [n[3 * v + 0], n[3 * v + 1], n[3 * v + 2]]
              , b = [n[3 * A + 0], n[3 * A + 1], n[3 * A + 2]];
            g.restPosition = interpolateBarycentric$1(M, x, b, T.barycentricCoordinates[0], T.barycentricCoordinates[1], T.barycentricCoordinates[2])
        }
    }
    function HairMesh(e, t, r, n, i) {
        for (var o = new PNMesh(t,r,n,i), a = [], s = 0; s < o.triangles.length; ++s) {
            var u = o.triangles[s];
            a.push(u.a),
            a.push(u.b),
            a.push(u.c)
        }
        this.indexBuffer = e.buildBuffer(e.ELEMENT_ARRAY_BUFFER, new Uint16Array(a), e.STATIC_DRAW),
        this.indexCount = a.length;
        for (var l = new Float32Array(3 * o.vertices.length), c = new Float32Array(3 * o.vertices.length), h = new Float32Array(3 * o.vertices.length), s = 0; s < o.vertices.length; ++s) {
            var d = o.vertices[s]
              , f = d.baseAssociations[0]
              , _ = o.baseTriangles[f.baseTriangleIndex];
            l[3 * s + 0] = _.a,
            l[3 * s + 1] = _.b,
            l[3 * s + 2] = _.c,
            c[3 * s + 0] = f.barycentricCoordinates[0],
            c[3 * s + 1] = f.barycentricCoordinates[1],
            c[3 * s + 2] = f.barycentricCoordinates[2],
            h[3 * s + 0] = d.restPosition[0],
            h[3 * s + 1] = d.restPosition[1],
            h[3 * s + 2] = d.restPosition[2]
        }
        this.associationsBuffer = e.buildBuffer(e.ARRAY_BUFFER, l, e.STATIC_DRAW),
        this.barycentricCoordinatesBuffer = e.buildBuffer(e.ARRAY_BUFFER, c, e.STATIC_DRAW),
        this.restPositionsBuffer = e.buildBuffer(e.ARRAY_BUFFER, h, e.STATIC_DRAW)
    }
    function generate3DPerturbationTexture(e, t) {
        for (var r = new Uint8Array(t * t * t * 4), n = 0; n < t * t * t * 4; ++n)
            r[n] = Math.floor(256 * Math.random());
        return e.buildTexture(e.RGBA, e.UNSIGNED_BYTE, t * t, t, r, e.REPEAT, e.REPEAT, e.LINEAR, e.LINEAR)
    }
    function Hair(e, t) {
        this.module = e,
        this.wgl = t,
        this.getHairPositionData = this.module.cwrap("getHairPositionData", "number", []),
        this.getHairNormalData = this.module.cwrap("getHairNormalData", "number", []),
        this.getHairVertexCount = this.module.cwrap("getHairVertexCount", "number", []),
        this.getHairIndexData = this.module.cwrap("getHairIndexData", "number", []),
        this.getHairIndexCount = this.module.cwrap("getHairIndexCount", "number", []),
        this.baseTextureWidth = Math.ceil(Math.sqrt(this.getHairVertexCount())),
        this.baseTextureHeight = this.baseTextureWidth,
        this.basePositionsTexture = t.buildTexture(t.RGBA, t.FLOAT, this.baseTextureWidth, this.baseTextureHeight, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.NEAREST, t.NEAREST),
        this.baseNormalsTexture = t.buildTexture(t.RGBA, t.FLOAT, this.baseTextureWidth, this.baseTextureHeight, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.NEAREST, t.NEAREST),
        this.baseRestPositions = this.module.HEAPF32.subarray(this.getHairPositionData() >> 2, (this.getHairPositionData() >> 2) + 3 * this.getHairVertexCount()),
        this.hairIndices = this.module.HEAPU16.subarray(this.getHairIndexData() >> 1, (this.getHairIndexData() >> 1) + this.getHairIndexCount()),
        this.perturbationTexture3DWidth = 32,
        this.perturbationTexture3D = generate3DPerturbationTexture(t, this.perturbationTexture3DWidth),
        this.basePositionsData = new Float32Array(this.baseTextureWidth * this.baseTextureHeight * 4),
        this.baseNormalsData = new Float32Array(this.baseTextureWidth * this.baseTextureHeight * 4),
        this.meshes = {}
    }
    function Nose(e, t) {
        this.module = e,
        this.wgl = t,
        this.getNosePositionData = this.module.cwrap("getNosePositionData", "number", []),
        this.getNoseNormalData = this.module.cwrap("getNoseNormalData", "number", []),
        this.getNoseVertexCount = this.module.cwrap("getNoseVertexCount", "number", []),
        this.getNoseIndices = this.module.cwrap("getNoseIndices", "number", []),
        this.getNoseIndexCount = this.module.cwrap("getNoseIndexCount", "number", []),
        this.indices = this.module.HEAPU16.subarray(this.getNoseIndices() >> 1, (this.getNoseIndices() >> 1) + this.getNoseIndexCount()),
        this.vertices = this.module.HEAPF32.subarray(this.getNosePositionData() >> 2, (this.getNosePositionData() >> 2) + 3 * this.getNoseVertexCount()),
        this.normals = this.module.HEAPF32.subarray(this.getNoseNormalData() >> 2, (this.getNoseNormalData() >> 2) + 3 * this.getNoseVertexCount()),
        this.positionsBuffer = t.buildBuffer(t.ARRAY_BUFFER, new Float32Array(this.vertices), t.STATIC_DRAW),
        this.normalsBuffer = t.buildBuffer(t.ARRAY_BUFFER, new Float32Array(this.normals), t.STATIC_DRAW),
        this.indexBuffer = t.buildBuffer(t.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), t.STATIC_DRAW),
        this.indicesCount = this.indices.length
    }
    function QualitySelector(e, t) {
        var r = this.buttons = [document.getElementById("quality-medium"), document.getElementById("quality-high")];
        this.currentValue = e;
        for (var n = 0; n < this.buttons.length; ++n) {
            var i = this;
            !function() {
                var e = n;
                r[e].addEventListener("click", function() {
                    t(e),
                    i.currentValue = e,
                    i.refresh()
                })
            }()
        }
        this.changeCallback = t,
        this.refresh()
    }
    function Plane(e, t) {
        this.point = e,
        this.normal = t
    }
    function createImageTexture(e, t, r) {
        var n = new Image;
        n.onload = function() {
            var t = e.createTexture();
            e.pixelStorei(e.TEXTURE_2D, t, e.UNPACK_FLIP_Y_WEBGL, !0),
            e.pixelStorei(e.TEXTURE_2D, t, e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0),
            e.setTextureFiltering(e.TEXTURE_2D, t, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.LINEAR, e.LINEAR),
            e.texImage2D(e.TEXTURE_2D, t, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, n),
            e.pixelStorei(e.TEXTURE_2D, t, e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
            e.pixelStorei(e.TEXTURE_2D, t, e.UNPACK_FLIP_Y_WEBGL, !1),
            r({
                texture: t,
                width: n.width,
                height: n.height
            })
        }
        ,
        n.src = t
    }
    function loadScript(e, t) {
        var r = document.createElement("script");
        r.onload = t,
        r.src = e,
        document.body.appendChild(r)
    }
    function Face(e, t, r) {
        function n() {
            c < u.length ? (t(c / (u.length - 1)),
            u[c](function() {
                requestAnimationFrame(n)
            }),
            c += 1) : (this.audioParameters = {},
            this.mouseX = 0,
            this.mouseY = 0,
            this.draggingTriangleIndex = -1,
            this.lastDraggingTriangleIndex = -1,
            this.faceRotation = Quaternion.makeIdentity([]),
            i.addEventListener("mousedown", function(e) {
                0 === e.button && this.onMouseDown(e)
            }
            .bind(this)),
            document.addEventListener("mouseup", function(e) {
                this.onMouseUp(e)
            }
            .bind(this)),
            document.addEventListener("mousemove", function(e) {
                this.onMouseMove(e)
            }
            .bind(this)),
            i.addEventListener("touchstart", this.onTouchStart.bind(this)),
            i.addEventListener("touchmove", this.onTouchMove.bind(this)),
            i.addEventListener("touchend", this.onTouchEnd.bind(this)),
            i.addEventListener("touchcancel", this.onTouchCancel.bind(this)),
            this.quality = Quality.Medium,
            this.onLoaded(),
            this.framesSinceStart = 0,
            this.framesAtFirstDrag = -1)
        }
        this.onProgress = t,
        this.onLoaded = r,
        this.isSimplified = e,
        this.hasUnlockedAudio = !1;
        var i = this.canvas = document.createElement("canvas");
        i.width = window.innerWidth,
        i.height = window.innerHeight;
        var o = this.wgl = WrappedGL.create(i, {
            antialias: !1
        });
        o.getExtension("OES_texture_float"),
        o.getExtension("WEBGL_depth_texture");
        var a, s = "object" == typeof WebAssembly, u = [function(e) {
            s ? (console.log("using webassembly"),
            (a = FaceLib()).onRuntimeInitialized = e) : (console.log("using asm.js"),
            loadScript("face-asm.js", function() {
                a = FaceLibAsm(),
                e()
            }
            .bind(this)))
        }
        , function(e) {
            this.baseMesh = new BaseMesh(a,o,WIREFRAME),
            e()
        }
        , function(e) {
            this.hair = new Hair(a,o),
            this.hair.createMesh(0),
            e()
        }
        , function(e) {
            this.isSimplified || this.hair.createMesh(1),
            e()
        }
        , function(e) {
            this.isSimplified ? (this.staticSkin = new StaticSkin(o,this.baseMesh,this.baseMesh.baseIndices,this.baseMesh.wrinkleStrengths,this.baseMesh.mouthinesses),
            this.wrinkleSimulator = null) : (this.wrinkleSimulator = new WrinkleSimulator(o,WIREFRAME),
            this.staticSkin = null),
            e()
        }
        , function(e) {
            this.isSimplified || this.wrinkleSimulator.createMesh(0, this.baseMesh, this.baseMesh.baseIndices, this.baseMesh.wrinkleStrengths, this.baseMesh.mouthinesses),
            e()
        }
        , function(e) {
            this.isSimplified || this.wrinkleSimulator.createMesh(1, this.baseMesh, this.baseMesh.baseIndices, this.baseMesh.wrinkleStrengths, this.baseMesh.mouthinesses),
            e()
        }
        , function(e) {
            this.leftEye = new Eye(a,o,0),
            this.rightEye = new Eye(a,o,1),
            this.nose = new Nose(a,o),
            this.leftEar = new Ear(a,o,0),
            this.rightEar = new Ear(a,o,1),
            e()
        }
        , function(e) {
            this.renderer = new Renderer(i,o),
            e()
        }
        , function(e) {
            this.renderer.createPrograms(0, 0),
            e()
        }
        , function(e) {
            this.renderer.createPrograms(0, 1),
            e()
        }
        , function(e) {
            this.renderer.createPrograms(0, 2),
            e()
        }
        , function(e) {
            this.renderer.createPrograms(0, 3),
            e()
        }
        , function(e) {
            this.isSimplified || this.renderer.createPrograms(1, 0),
            e()
        }
        , function(e) {
            this.isSimplified || this.renderer.createPrograms(1, 1),
            e()
        }
        , function(e) {
            this.isSimplified || this.renderer.createPrograms(1, 2),
            e()
        }
        , function(e) {
            this.isSimplified || this.renderer.createPrograms(1, 3),
            e()
        }
        , function(e) {
            createImageTexture(o, "pull.png", function(t) {
                this.promptImage = t,
                e()
            }
            .bind(this))
        }
        , function(e) {
            function t() {
                this.canvas.width = window.innerWidth,
                this.canvas.height = window.innerHeight,
                this.renderer.onResize()
            }
            t = t.bind(this),
            window.addEventListener("resize", function(e) {
                t()
            }
            .bind(this)),
            t(),
            e()
        }
        , function(e) {
            this.webAudioContext = new (window.AudioContext || window.webkitAudioContext),
            this.blockSize = 2048,
            this.heavy = new facesynth_AudioLib(a,{
                blockSize: this.blockSize,
                sampleRate: this.webAudioContext.sampleRate
            }),
            e()
        }
        ];
        if (!s)
            for (l = 0; l < 20; ++l)
                u.push(function(e) {
                    this.heavy.preprocess(10),
                    e()
                });
        u.push(function(e) {
            this.webAudioProcessor = this.webAudioContext.createScriptProcessor(this.blockSize, this.heavy.getNumInputChannels(), Math.max(this.heavy.getNumOutputChannels(), 1)),
            this.lastAudioProcessTime = (new Date).getTime();
            var t = this;
            this.webAudioProcessor.onaudioprocess = function(e) {
                t.lastAudioProcessTime = (new Date).getTime(),
                t.heavy.process(e)
            }
            ,
            this.webAudioProcessor.connect(this.webAudioContext.destination),
            e()
        });
        for (var l = 0; l < u.length; ++l)
            u[l] = u[l].bind(this);
        var c = 0;
        (n = n.bind(this))()
    }
    function isMobile() {
        return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)
    }
    function hasWebAudioSupport() {
        return window.AudioContext || window.webkitAudioContext
    }
    var FaceLib = function(FaceLib) {
        function globalEval(e) {
            eval.call(null, e)
        }
        function assert(e, t) {
            e || abort("Assertion failed: " + t)
        }
        function getCFunc(ident) {
            var func = Module["_" + ident];
            if (!func)
                try {
                    func = eval("_" + ident)
                } catch (e) {}
            return assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)"),
            func
        }
        function setValue(e, t, r, n) {
            switch ("*" === (r = r || "i8").charAt(r.length - 1) && (r = "i32"),
            r) {
            case "i1":
            case "i8":
                HEAP8[e >> 0] = t;
                break;
            case "i16":
                HEAP16[e >> 1] = t;
                break;
            case "i32":
                HEAP32[e >> 2] = t;
                break;
            case "i64":
                tempI64 = [t >>> 0, (tempDouble = t,
                +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
                HEAP32[e >> 2] = tempI64[0],
                HEAP32[e + 4 >> 2] = tempI64[1];
                break;
            case "float":
                HEAPF32[e >> 2] = t;
                break;
            case "double":
                HEAPF64[e >> 3] = t;
                break;
            default:
                abort("invalid type for setValue: " + r)
            }
        }
        function getValue(e, t, r) {
            switch ("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"),
            t) {
            case "i1":
            case "i8":
                return HEAP8[e >> 0];
            case "i16":
                return HEAP16[e >> 1];
            case "i32":
            case "i64":
                return HEAP32[e >> 2];
            case "float":
                return HEAPF32[e >> 2];
            case "double":
                return HEAPF64[e >> 3];
            default:
                abort("invalid type for setValue: " + t)
            }
            return null
        }
        function allocate(e, t, r, n) {
            var i, o;
            "number" == typeof e ? (i = !0,
            o = e) : (i = !1,
            o = e.length);
            var a, s = "string" == typeof t ? t : null;
            if (a = r == ALLOC_NONE ? n : ["function" == typeof _malloc ? _malloc : Runtime.staticAlloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][r === undefined ? ALLOC_STATIC : r](Math.max(o, s ? 1 : t.length)),
            i) {
                var u, n = a;
                for (assert(0 == (3 & a)),
                u = a + (-4 & o); n < u; n += 4)
                    HEAP32[n >> 2] = 0;
                for (u = a + o; n < u; )
                    HEAP8[n++ >> 0] = 0;
                return a
            }
            if ("i8" === s)
                return e.subarray || e.slice ? HEAPU8.set(e, a) : HEAPU8.set(new Uint8Array(e), a),
                a;
            for (var l, c, h, d = 0; d < o; ) {
                var f = e[d];
                "function" == typeof f && (f = Runtime.getFunctionIndex(f)),
                0 !== (l = s || t[d]) ? ("i64" == l && (l = "i32"),
                setValue(a + d, f, l),
                h !== l && (c = Runtime.getNativeTypeSize(l),
                h = l),
                d += c) : d++
            }
            return a
        }
        function getMemory(e) {
            return staticSealed ? runtimeInitialized ? _malloc(e) : Runtime.dynamicAlloc(e) : Runtime.staticAlloc(e)
        }
        function Pointer_stringify(e, t) {
            if (0 === t || !e)
                return "";
            for (var r, n = 0, i = 0; ; ) {
                if (r = HEAPU8[e + i >> 0],
                n |= r,
                0 == r && !t)
                    break;
                if (i++,
                t && i == t)
                    break
            }
            t || (t = i);
            var o = "";
            if (n < 128) {
                for (var a; t > 0; )
                    a = String.fromCharCode.apply(String, HEAPU8.subarray(e, e + Math.min(t, 1024))),
                    o = o ? o + a : a,
                    e += 1024,
                    t -= 1024;
                return o
            }
            return Module.UTF8ToString(e)
        }
        function AsciiToString(e) {
            for (var t = ""; ; ) {
                var r = HEAP8[e++ >> 0];
                if (!r)
                    return t;
                t += String.fromCharCode(r)
            }
        }
        function stringToAscii(e, t) {
            return writeAsciiToMemory(e, t, !1)
        }
        function UTF8ArrayToString(e, t) {
            for (var r = t; e[r]; )
                ++r;
            if (r - t > 16 && e.subarray && UTF8Decoder)
                return UTF8Decoder.decode(e.subarray(t, r));
            for (var n, i, o, a, s, u = ""; ; ) {
                if (!(n = e[t++]))
                    return u;
                if (128 & n)
                    if (i = 63 & e[t++],
                    192 != (224 & n))
                        if (o = 63 & e[t++],
                        224 == (240 & n) ? n = (15 & n) << 12 | i << 6 | o : (a = 63 & e[t++],
                        240 == (248 & n) ? n = (7 & n) << 18 | i << 12 | o << 6 | a : (s = 63 & e[t++],
                        n = 248 == (252 & n) ? (3 & n) << 24 | i << 18 | o << 12 | a << 6 | s : (1 & n) << 30 | i << 24 | o << 18 | a << 12 | s << 6 | 63 & e[t++])),
                        n < 65536)
                            u += String.fromCharCode(n);
                        else {
                            var l = n - 65536;
                            u += String.fromCharCode(55296 | l >> 10, 56320 | 1023 & l)
                        }
                    else
                        u += String.fromCharCode((31 & n) << 6 | i);
                else
                    u += String.fromCharCode(n)
            }
        }
        function UTF8ToString(e) {
            return UTF8ArrayToString(HEAPU8, e)
        }
        function stringToUTF8Array(e, t, r, n) {
            if (!(n > 0))
                return 0;
            for (var i = r, o = r + n - 1, a = 0; a < e.length; ++a) {
                var s = e.charCodeAt(a);
                if (s >= 55296 && s <= 57343 && (s = 65536 + ((1023 & s) << 10) | 1023 & e.charCodeAt(++a)),
                s <= 127) {
                    if (r >= o)
                        break;
                    t[r++] = s
                } else if (s <= 2047) {
                    if (r + 1 >= o)
                        break;
                    t[r++] = 192 | s >> 6,
                    t[r++] = 128 | 63 & s
                } else if (s <= 65535) {
                    if (r + 2 >= o)
                        break;
                    t[r++] = 224 | s >> 12,
                    t[r++] = 128 | s >> 6 & 63,
                    t[r++] = 128 | 63 & s
                } else if (s <= 2097151) {
                    if (r + 3 >= o)
                        break;
                    t[r++] = 240 | s >> 18,
                    t[r++] = 128 | s >> 12 & 63,
                    t[r++] = 128 | s >> 6 & 63,
                    t[r++] = 128 | 63 & s
                } else if (s <= 67108863) {
                    if (r + 4 >= o)
                        break;
                    t[r++] = 248 | s >> 24,
                    t[r++] = 128 | s >> 18 & 63,
                    t[r++] = 128 | s >> 12 & 63,
                    t[r++] = 128 | s >> 6 & 63,
                    t[r++] = 128 | 63 & s
                } else {
                    if (r + 5 >= o)
                        break;
                    t[r++] = 252 | s >> 30,
                    t[r++] = 128 | s >> 24 & 63,
                    t[r++] = 128 | s >> 18 & 63,
                    t[r++] = 128 | s >> 12 & 63,
                    t[r++] = 128 | s >> 6 & 63,
                    t[r++] = 128 | 63 & s
                }
            }
            return t[r] = 0,
            r - i
        }
        function stringToUTF8(e, t, r) {
            return stringToUTF8Array(e, HEAPU8, t, r)
        }
        function lengthBytesUTF8(e) {
            for (var t = 0, r = 0; r < e.length; ++r) {
                var n = e.charCodeAt(r);
                n >= 55296 && n <= 57343 && (n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++r)),
                n <= 127 ? ++t : t += n <= 2047 ? 2 : n <= 65535 ? 3 : n <= 2097151 ? 4 : n <= 67108863 ? 5 : 6
            }
            return t
        }
        function demangle(e) {
            var t = Module.___cxa_demangle || Module.__cxa_demangle;
            if (t) {
                try {
                    var r = e.substr(1)
                      , n = lengthBytesUTF8(r) + 1
                      , i = _malloc(n);
                    stringToUTF8(r, i, n);
                    var o = _malloc(4)
                      , a = t(i, 0, 0, o);
                    if (0 === getValue(o, "i32") && a)
                        return Pointer_stringify(a)
                } catch (s) {} finally {
                    i && _free(i),
                    o && _free(o),
                    a && _free(a)
                }
                return e
            }
            return Runtime.warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"),
            e
        }
        function demangleAll(e) {
            var t = /__Z[\w\d_]+/g;
            return e.replace(t, function(e) {
                var t = demangle(e);
                return e === t ? e : e + " [" + t + "]"
            })
        }
        function jsStackTrace() {
            var e = new Error;
            if (!e.stack) {
                try {
                    throw new Error(0)
                } catch (t) {
                    e = t
                }
                if (!e.stack)
                    return "(no stack trace available)"
            }
            return e.stack.toString()
        }
        function stackTrace() {
            var e = jsStackTrace();
            return Module.extraStackTrace && (e += "\n" + Module.extraStackTrace()),
            demangleAll(e)
        }
        function alignUp(e, t) {
            return e % t > 0 && (e += t - e % t),
            e
        }
        function updateGlobalBuffer(e) {
            Module.buffer = buffer = e
        }
        function updateGlobalBufferViews() {
            Module.HEAP8 = HEAP8 = new Int8Array(buffer),
            Module.HEAP16 = HEAP16 = new Int16Array(buffer),
            Module.HEAP32 = HEAP32 = new Int32Array(buffer),
            Module.HEAPU8 = HEAPU8 = new Uint8Array(buffer),
            Module.HEAPU16 = HEAPU16 = new Uint16Array(buffer),
            Module.HEAPU32 = HEAPU32 = new Uint32Array(buffer),
            Module.HEAPF32 = HEAPF32 = new Float32Array(buffer),
            Module.HEAPF64 = HEAPF64 = new Float64Array(buffer)
        }
        function abortOnCannotGrowMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
        }
        function enlargeMemory() {
            abortOnCannotGrowMemory()
        }
        function getTotalMemory() {
            return TOTAL_MEMORY
        }
        function callRuntimeCallbacks(e) {
            for (; e.length > 0; ) {
                var t = e.shift();
                if ("function" != typeof t) {
                    var r = t.func;
                    "number" == typeof r ? t.arg === undefined ? Module.dynCall_v(r) : Module.dynCall_vi(r, t.arg) : r(t.arg === undefined ? null : t.arg)
                } else
                    t()
            }
        }
        function preRun() {
            if (Module.preRun)
                for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length; )
                    addOnPreRun(Module.preRun.shift());
            callRuntimeCallbacks(__ATPRERUN__)
        }
        function ensureInitRuntime() {
            runtimeInitialized || (runtimeInitialized = !0,
            callRuntimeCallbacks(__ATINIT__))
        }
        function preMain() {
            callRuntimeCallbacks(__ATMAIN__)
        }
        function exitRuntime() {
            callRuntimeCallbacks(__ATEXIT__),
            runtimeExited = !0
        }
        function postRun() {
            if (Module.postRun)
                for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length; )
                    addOnPostRun(Module.postRun.shift());
            callRuntimeCallbacks(__ATPOSTRUN__)
        }
        function addOnPreRun(e) {
            __ATPRERUN__.unshift(e)
        }
        function addOnInit(e) {
            __ATINIT__.unshift(e)
        }
        function addOnPreMain(e) {
            __ATMAIN__.unshift(e)
        }
        function addOnExit(e) {
            __ATEXIT__.unshift(e)
        }
        function addOnPostRun(e) {
            __ATPOSTRUN__.unshift(e)
        }
        function intArrayFromString(e, t, r) {
            var n = r > 0 ? r : lengthBytesUTF8(e) + 1
              , i = new Array(n)
              , o = stringToUTF8Array(e, i, 0, i.length);
            return t && (i.length = o),
            i
        }
        function intArrayToString(e) {
            for (var t = [], r = 0; r < e.length; r++) {
                var n = e[r];
                n > 255 && (n &= 255),
                t.push(String.fromCharCode(n))
            }
            return t.join("")
        }
        function writeStringToMemory(e, t, r) {
            Runtime.warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");
            var n, i;
            r && (i = t + lengthBytesUTF8(e),
            n = HEAP8[i]),
            stringToUTF8(e, t, Infinity),
            r && (HEAP8[i] = n)
        }
        function writeArrayToMemory(e, t) {
            HEAP8.set(e, t)
        }
        function writeAsciiToMemory(e, t, r) {
            for (var n = 0; n < e.length; ++n)
                HEAP8[t++ >> 0] = e.charCodeAt(n);
            r || (HEAP8[t >> 0] = 0)
        }
        function addRunDependency(e) {
            runDependencies++,
            Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies)
        }
        function removeRunDependency(e) {
            if (runDependencies--,
            Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies),
            0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher),
            runDependencyWatcher = null),
            dependenciesFulfilled)) {
                var t = dependenciesFulfilled;
                dependenciesFulfilled = null,
                t()
            }
        }
        function integrateWasmJS(Module) {
            function lookupImport(e, t) {
                var r = info;
                if (e.indexOf(".") < 0)
                    r = (r || {})[e];
                else {
                    var n = e.split(".");
                    r = ((r = (r || {})[n[0]]) || {})[n[1]]
                }
                return t && (r = (r || {})[t]),
                r === undefined && abort("bad lookupImport to (" + e + ")." + t),
                r
            }
            function mergeMemory(e) {
                var t = Module.buffer;
                e.byteLength < t.byteLength && Module.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
                var r = new Int8Array(t)
                  , n = new Int8Array(e);
                memoryInitializer || r.set(n.subarray(Module.STATIC_BASE, Module.STATIC_BASE + Module.STATIC_BUMP), Module.STATIC_BASE),
                n.set(r),
                updateGlobalBuffer(e),
                updateGlobalBufferViews()
            }
            function fixImports(e) {
                return e
            }
            function getBinary() {
                try {
                    var e;
                    if (Module.wasmBinary)
                        e = Module.wasmBinary,
                        e = new Uint8Array(e);
                    else {
                        if (!Module.readBinary)
                            throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
                        e = Module.readBinary(wasmBinaryFile)
                    }
                    return e
                } catch (t) {
                    abort(t)
                }
            }
            function getBinaryPromise() {
                return Module.wasmBinary || "function" != typeof fetch ? new Promise(function(e, t) {
                    e(getBinary())
                }
                ) : fetch(wasmBinaryFile, {
                    credentials: "same-origin"
                }).then(function(e) {
                    if (!e.ok)
                        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                    return e.arrayBuffer()
                })
            }
            function doJustAsm(global, env, providedBuffer) {
                return "function" == typeof Module.asm && Module.asm !== methodHandler || (Module.asmPreload ? Module.asm = Module.asmPreload : eval(Module.read(asmjsCodeFile))),
                "function" != typeof Module.asm ? (Module.printErr("asm evalling did not set the module properly"),
                !1) : Module.asm(global, env, providedBuffer)
            }
            function doNativeWasm(e, t, r) {
                function n(e) {
                    (exports = e.exports).memory && mergeMemory(exports.memory),
                    Module.asm = exports,
                    Module.usingWasm = !0,
                    removeRunDependency("wasm-instantiate")
                }
                if ("object" != typeof WebAssembly)
                    return Module.printErr("no native wasm support detected"),
                    !1;
                if (!(Module.wasmMemory instanceof WebAssembly.Memory))
                    return Module.printErr("no native wasm Memory in use"),
                    !1;
                if (t.memory = Module.wasmMemory,
                info.global = {
                    NaN: NaN,
                    Infinity: Infinity
                },
                info["global.Math"] = e.Math,
                info.env = t,
                addRunDependency("wasm-instantiate"),
                Module.instantiateWasm)
                    try {
                        return Module.instantiateWasm(info, n)
                    } catch (i) {
                        return Module.printErr("Module.instantiateWasm callback failed with error: " + i),
                        !1
                    }
                return getBinaryPromise().then(function(e) {
                    return WebAssembly.instantiate(e, info)
                }).then(function(e) {
                    n(e.instance)
                })["catch"](function(e) {
                    Module.printErr("failed to asynchronously prepare wasm: " + e),
                    abort(e)
                }),
                {}
            }
            function doWasmPolyfill(e, t, r, n) {
                if ("function" != typeof WasmJS)
                    return Module.printErr("WasmJS not detected - polyfill not bundled?"),
                    !1;
                var i = WasmJS({});
                i.outside = Module,
                i.info = info,
                i.lookupImport = lookupImport,
                assert(r === Module.buffer),
                info.global = e,
                info.env = t,
                assert(r === Module.buffer),
                t.memory = r,
                assert(t.memory instanceof ArrayBuffer),
                i.providedTotalMemory = Module.buffer.byteLength;
                var o;
                o = "interpret-binary" === n ? getBinary() : Module.read("interpret-asm2wasm" == n ? asmjsCodeFile : wasmTextFile);
                var a;
                if ("interpret-asm2wasm" == n)
                    a = i._malloc(o.length + 1),
                    i.writeAsciiToMemory(o, a),
                    i._load_asm2wasm(a);
                else if ("interpret-s-expr" === n)
                    a = i._malloc(o.length + 1),
                    i.writeAsciiToMemory(o, a),
                    i._load_s_expr2wasm(a);
                else {
                    if ("interpret-binary" !== n)
                        throw "what? " + n;
                    a = i._malloc(o.length),
                    i.HEAPU8.set(o, a),
                    i._load_binary2wasm(a, o.length)
                }
                return i._free(a),
                i._instantiate(a),
                Module.newBuffer && (mergeMemory(Module.newBuffer),
                Module.newBuffer = null),
                exports = i.asmExports
            }
            var method = Module.wasmJSMethod || "native-wasm";
            Module.wasmJSMethod = method;
            var wasmTextFile = Module.wasmTextFile || "face-wasm.wast"
              , wasmBinaryFile = Module.wasmBinaryFile || "face-wasm.wasm"
              , asmjsCodeFile = Module.asmjsCodeFile || "face-wasm.temp.asm.js";
            "function" == typeof Module.locateFile && (wasmTextFile = Module.locateFile(wasmTextFile),
            wasmBinaryFile = Module.locateFile(wasmBinaryFile),
            asmjsCodeFile = Module.locateFile(asmjsCodeFile));
            var wasmPageSize = 65536
              , asm2wasmImports = {
                "f64-rem": function(e, t) {
                    return e % t
                },
                "f64-to-int": function(e) {
                    return 0 | e
                },
                "i32s-div": function(e, t) {
                    return (0 | e) / (0 | t) | 0
                },
                "i32u-div": function(e, t) {
                    return (e >>> 0) / (t >>> 0) >>> 0
                },
                "i32s-rem": function(e, t) {
                    return (0 | e) % (0 | t) | 0
                },
                "i32u-rem": function(e, t) {
                    return (e >>> 0) % (t >>> 0) >>> 0
                },
                "debugger": function() {}
            }
              , info = {
                global: null,
                env: null,
                asm2wasm: asm2wasmImports,
                parent: Module
            }
              , exports = null
              , WasmTypes = {
                none: 0,
                i32: 1,
                i64: 2,
                f32: 3,
                f64: 4
            };
            Module.asmPreload = Module.asm;
            var asmjsReallocBuffer = Module.reallocBuffer
              , wasmReallocBuffer = function(e) {
                e = alignUp(e, Module.usingWasm ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE);
                var t = Module.buffer
                  , r = t.byteLength;
                if (!Module.usingWasm)
                    return exports.__growWasmMemory((e - r) / wasmPageSize),
                    Module.buffer !== t ? Module.buffer : null;
                try {
                    return -1 !== Module.wasmMemory.grow((e - r) / wasmPageSize) ? Module.buffer = Module.wasmMemory.buffer : null
                } catch (n) {
                    return null
                }
            };
            Module.reallocBuffer = function(e) {
                return "asmjs" === finalMethod ? asmjsReallocBuffer(e) : wasmReallocBuffer(e)
            }
            ;
            var finalMethod = "";
            Module.asm = function(e, t, r) {
                if (e = fixImports(e),
                !(t = fixImports(t)).table) {
                    var n = Module.wasmTableSize;
                    n === undefined && (n = 1024);
                    var i = Module.wasmMaxTableSize;
                    "object" == typeof WebAssembly && "function" == typeof WebAssembly.Table ? i !== undefined ? t.table = new WebAssembly.Table({
                        initial: n,
                        maximum: i,
                        element: "anyfunc"
                    }) : t.table = new WebAssembly.Table({
                        initial: n,
                        element: "anyfunc"
                    }) : t.table = new Array(n),
                    Module.wasmTable = t.table
                }
                t.memoryBase || (t.memoryBase = Module.STATIC_BASE),
                t.tableBase || (t.tableBase = 0);
                for (var o, a = method.split(","), s = 0; s < a.length; s++) {
                    var u = a[s];
                    if (finalMethod = u,
                    "native-wasm" === u) {
                        if (o = doNativeWasm(e, t))
                            break
                    } else if ("asmjs" === u) {
                        if (o = doJustAsm(e, t, r))
                            break
                    } else if ("interpret-asm2wasm" === u || "interpret-s-expr" === u || "interpret-binary" === u) {
                        if (o = doWasmPolyfill(e, t, r, u))
                            break
                    } else
                        abort("bad method: " + u)
                }
                if (!o)
                    throw "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods";
                return o
            }
            ;
            var methodHandler = Module.asm
        }
        function __ZSt18uncaught_exceptionv() {
            return !!__ZSt18uncaught_exceptionv.uncaught_exception
        }
        function ___resumeException(e) {
            throw EXCEPTIONS.last || (EXCEPTIONS.last = e),
            e + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
        }
        function ___cxa_find_matching_catch() {
            var e = EXCEPTIONS.last;
            if (!e)
                return 0 | (Runtime.setTempRet0(0),
                0);
            var t = EXCEPTIONS.infos[e]
              , r = t.type;
            if (!r)
                return 0 | (Runtime.setTempRet0(0),
                e);
            var n = Array.prototype.slice.call(arguments);
            Module.___cxa_is_pointer_type(r);
            ___cxa_find_matching_catch.buffer || (___cxa_find_matching_catch.buffer = _malloc(4)),
            HEAP32[___cxa_find_matching_catch.buffer >> 2] = e,
            e = ___cxa_find_matching_catch.buffer;
            for (var i = 0; i < n.length; i++)
                if (n[i] && Module.___cxa_can_catch(n[i], r, e))
                    return e = HEAP32[e >> 2],
                    t.adjusted = e,
                    0 | (Runtime.setTempRet0(n[i]),
                    e);
            return e = HEAP32[e >> 2],
            0 | (Runtime.setTempRet0(r),
            e)
        }
        function ___cxa_throw(e, t, r) {
            throw EXCEPTIONS.infos[e] = {
                ptr: e,
                adjusted: e,
                type: t,
                destructor: r,
                refcount: 0,
                caught: !1,
                rethrown: !1
            },
            EXCEPTIONS.last = e,
            "uncaught_exception"in __ZSt18uncaught_exceptionv ? __ZSt18uncaught_exceptionv.uncaught_exception++ : __ZSt18uncaught_exceptionv.uncaught_exception = 1,
            e + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
        }
        function _abort() {
            Module.abort()
        }
        function _pthread_once(e, t) {
            _pthread_once.seen || (_pthread_once.seen = {}),
            e in _pthread_once.seen || (Module.dynCall_v(t),
            _pthread_once.seen[e] = 1)
        }
        function _pthread_getspecific(e) {
            return PTHREAD_SPECIFIC[e] || 0
        }
        function _pthread_key_create(e, t) {
            return 0 == e ? ERRNO_CODES.EINVAL : (HEAP32[e >> 2] = PTHREAD_SPECIFIC_NEXT_KEY,
            PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY] = 0,
            PTHREAD_SPECIFIC_NEXT_KEY++,
            0)
        }
        function _pthread_setspecific(e, t) {
            return e in PTHREAD_SPECIFIC ? (PTHREAD_SPECIFIC[e] = t,
            0) : ERRNO_CODES.EINVAL
        }
        function ___cxa_allocate_exception(e) {
            return _malloc(e)
        }
        function ___cxa_pure_virtual() {
            throw ABORT = !0,
            "Pure virtual function called!"
        }
        function ___cxa_begin_catch(e) {
            var t = EXCEPTIONS.infos[e];
            return t && !t.caught && (t.caught = !0,
            __ZSt18uncaught_exceptionv.uncaught_exception--),
            t && (t.rethrown = !1),
            EXCEPTIONS.caught.push(e),
            EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(e)),
            e
        }
        function _emscripten_memcpy_big(e, t, r) {
            return HEAPU8.set(HEAPU8.subarray(t, t + r), e),
            e
        }
        function ___syscall6(e, t) {
            SYSCALLS.varargs = t;
            try {
                var r = SYSCALLS.getStreamFromFD();
                return FS.close(r),
                0
            } catch (n) {
                return "undefined" != typeof FS && n instanceof FS.ErrnoError || abort(n),
                -n.errno
            }
        }
        function ___setErrNo(e) {
            return Module.___errno_location && (HEAP32[Module.___errno_location() >> 2] = e),
            e
        }
        function ___gxx_personality_v0() {}
        function ___syscall140(e, t) {
            SYSCALLS.varargs = t;
            try {
                var r = SYSCALLS.getStreamFromFD()
                  , n = (SYSCALLS.get(),
                SYSCALLS.get())
                  , i = SYSCALLS.get()
                  , o = SYSCALLS.get()
                  , a = n;
                return FS.llseek(r, a, o),
                HEAP32[i >> 2] = r.position,
                r.getdents && 0 === a && 0 === o && (r.getdents = null),
                0
            } catch (s) {
                return "undefined" != typeof FS && s instanceof FS.ErrnoError || abort(s),
                -s.errno
            }
        }
        function ___syscall146(e, t) {
            SYSCALLS.varargs = t;
            try {
                var r = SYSCALLS.get()
                  , n = SYSCALLS.get()
                  , i = SYSCALLS.get()
                  , o = 0;
                ___syscall146.buffer || (___syscall146.buffers = [null, [], []],
                ___syscall146.printChar = function(e, t) {
                    var r = ___syscall146.buffers[e];
                    assert(r),
                    0 === t || 10 === t ? ((1 === e ? Module.print : Module.printErr)(UTF8ArrayToString(r, 0)),
                    r.length = 0) : r.push(t)
                }
                );
                for (var a = 0; a < i; a++) {
                    for (var s = HEAP32[n + 8 * a >> 2], u = HEAP32[n + (8 * a + 4) >> 2], l = 0; l < u; l++)
                        ___syscall146.printChar(r, HEAPU8[s + l]);
                    o += u
                }
                return o
            } catch (c) {
                return "undefined" != typeof FS && c instanceof FS.ErrnoError || abort(c),
                -c.errno
            }
        }
        function invoke_vi(e, t) {
            try {
                Module.dynCall_vi(e, t)
            } catch (r) {
                if ("number" != typeof r && "longjmp" !== r)
                    throw r;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iiii(e, t, r, n) {
            try {
                return Module.dynCall_iiii(e, t, r, n)
            } catch (i) {
                if ("number" != typeof i && "longjmp" !== i)
                    throw i;
                Module.setThrew(1, 0)
            }
        }
        function invoke_viiiiii(e, t, r, n, i, o, a) {
            try {
                Module.dynCall_viiiiii(e, t, r, n, i, o, a)
            } catch (s) {
                if ("number" != typeof s && "longjmp" !== s)
                    throw s;
                Module.setThrew(1, 0)
            }
        }
        function invoke_vii(e, t, r) {
            try {
                Module.dynCall_vii(e, t, r)
            } catch (n) {
                if ("number" != typeof n && "longjmp" !== n)
                    throw n;
                Module.setThrew(1, 0)
            }
        }
        function invoke_viiiii(e, t, r, n, i, o) {
            try {
                Module.dynCall_viiiii(e, t, r, n, i, o)
            } catch (a) {
                if ("number" != typeof a && "longjmp" !== a)
                    throw a;
                Module.setThrew(1, 0)
            }
        }
        function invoke_viiii(e, t, r, n, i) {
            try {
                Module.dynCall_viiii(e, t, r, n, i)
            } catch (o) {
                if ("number" != typeof o && "longjmp" !== o)
                    throw o;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iiidi(e, t, r, n, i) {
            try {
                return Module.dynCall_iiidi(e, t, r, n, i)
            } catch (o) {
                if ("number" != typeof o && "longjmp" !== o)
                    throw o;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iiidii(e, t, r, n, i, o) {
            try {
                return Module.dynCall_iiidii(e, t, r, n, i, o)
            } catch (a) {
                if ("number" != typeof a && "longjmp" !== a)
                    throw a;
                Module.setThrew(1, 0)
            }
        }
        function invoke_di(e, t) {
            try {
                return Module.dynCall_di(e, t)
            } catch (r) {
                if ("number" != typeof r && "longjmp" !== r)
                    throw r;
                Module.setThrew(1, 0)
            }
        }
        function invoke_ii(e, t) {
            try {
                return Module.dynCall_ii(e, t)
            } catch (r) {
                if ("number" != typeof r && "longjmp" !== r)
                    throw r;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iiiff(e, t, r, n, i) {
            try {
                return Module.dynCall_iiiff(e, t, r, n, i)
            } catch (o) {
                if ("number" != typeof o && "longjmp" !== o)
                    throw o;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iif(e, t, r) {
            try {
                return Module.dynCall_iif(e, t, r)
            } catch (n) {
                if ("number" != typeof n && "longjmp" !== n)
                    throw n;
                Module.setThrew(1, 0)
            }
        }
        function invoke_viii(e, t, r, n) {
            try {
                Module.dynCall_viii(e, t, r, n)
            } catch (i) {
                if ("number" != typeof i && "longjmp" !== i)
                    throw i;
                Module.setThrew(1, 0)
            }
        }
        function invoke_v(e) {
            try {
                Module.dynCall_v(e)
            } catch (t) {
                if ("number" != typeof t && "longjmp" !== t)
                    throw t;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iiiii(e, t, r, n, i) {
            try {
                return Module.dynCall_iiiii(e, t, r, n, i)
            } catch (o) {
                if ("number" != typeof o && "longjmp" !== o)
                    throw o;
                Module.setThrew(1, 0)
            }
        }
        function invoke_fii(e, t, r) {
            try {
                return Module.dynCall_fii(e, t, r)
            } catch (n) {
                if ("number" != typeof n && "longjmp" !== n)
                    throw n;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iii(e, t, r) {
            try {
                return Module.dynCall_iii(e, t, r)
            } catch (n) {
                if ("number" != typeof n && "longjmp" !== n)
                    throw n;
                Module.setThrew(1, 0)
            }
        }
        function invoke_iiif(e, t, r, n) {
            try {
                return Module.dynCall_iiif(e, t, r, n)
            } catch (i) {
                if ("number" != typeof i && "longjmp" !== i)
                    throw i;
                Module.setThrew(1, 0)
            }
        }
        function ExitStatus(e) {
            this.name = "ExitStatus",
            this.message = "Program terminated with exit(" + e + ")",
            this.status = e
        }
        function run(e) {
            function t() {
                Module.calledRun || (Module.calledRun = !0,
                ABORT || (ensureInitRuntime(),
                preMain(),
                Module.onRuntimeInitialized && Module.onRuntimeInitialized(),
                Module._main && shouldRunNow && Module.callMain(e),
                postRun()))
            }
            e = e || Module.arguments,
            null === preloadStartTime && (preloadStartTime = Date.now()),
            runDependencies > 0 || (preRun(),
            runDependencies > 0 || Module.calledRun || (Module.setStatus ? (Module.setStatus("Running..."),
            setTimeout(function() {
                setTimeout(function() {
                    Module.setStatus("")
                }, 1),
                t()
            }, 1)) : t()))
        }
        function exit(e, t) {
            t && Module.noExitRuntime || (Module.noExitRuntime || (ABORT = !0,
            EXITSTATUS = e,
            STACKTOP = initialStackTop,
            exitRuntime(),
            Module.onExit && Module.onExit(e)),
            ENVIRONMENT_IS_NODE && process.exit(e),
            Module.quit(e, new ExitStatus(e)))
        }
        function abort(e) {
            Module.onAbort && Module.onAbort(e),
            e !== undefined ? (Module.print(e),
            Module.printErr(e),
            e = JSON.stringify(e)) : e = "",
            ABORT = !0,
            EXITSTATUS = 1;
            var t = "abort(" + e + ") at " + stackTrace() + "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
            throw abortDecorators && abortDecorators.forEach(function(r) {
                t = r(t, e)
            }),
            t
        }
        FaceLib = FaceLib || {};
        var Module = FaceLib, Module;
        Module || (Module = (void 0 !== FaceLib ? FaceLib : null) || {});
        var moduleOverrides = {};
        for (var key in Module)
            Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
        var ENVIRONMENT_IS_WEB = !1
          , ENVIRONMENT_IS_WORKER = !1
          , ENVIRONMENT_IS_NODE = !1
          , ENVIRONMENT_IS_SHELL = !1;
        if (Module.ENVIRONMENT)
            if ("WEB" === Module.ENVIRONMENT)
                ENVIRONMENT_IS_WEB = !0;
            else if ("WORKER" === Module.ENVIRONMENT)
                ENVIRONMENT_IS_WORKER = !0;
            else if ("NODE" === Module.ENVIRONMENT)
                ENVIRONMENT_IS_NODE = !0;
            else {
                if ("SHELL" !== Module.ENVIRONMENT)
                    throw new Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");
                ENVIRONMENT_IS_SHELL = !0
            }
        else
            ENVIRONMENT_IS_WEB = "object" == typeof window,
            ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
            ENVIRONMENT_IS_NODE = "object" == typeof process && "function" == typeof require && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER,
            ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (ENVIRONMENT_IS_NODE) {
            Module.print || (Module.print = console.log),
            Module.printErr || (Module.printErr = console.warn);
            var nodeFS, nodePath;
            Module.read = function(e, t) {
                nodeFS || (nodeFS = require("fs")),
                nodePath || (nodePath = require("path")),
                e = nodePath.normalize(e);
                var r = nodeFS.readFileSync(e);
                return t ? r : r.toString()
            }
            ,
            Module.readBinary = function(e) {
                var t = Module.read(e, !0);
                return t.buffer || (t = new Uint8Array(t)),
                assert(t.buffer),
                t
            }
            ,
            Module.load = function(e) {
                globalEval(read(e))
            }
            ,
            Module.thisProgram || (process.argv.length > 1 ? Module.thisProgram = process.argv[1].replace(/\\/g, "/") : Module.thisProgram = "unknown-program"),
            Module.arguments = process.argv.slice(2),
            "undefined" != typeof module && (module.exports = Module),
            process.on("uncaughtException", function(e) {
                if (!(e instanceof ExitStatus))
                    throw e
            }),
            Module.inspect = function() {
                return "[Emscripten Module object]"
            }
        } else if (ENVIRONMENT_IS_SHELL)
            Module.print || (Module.print = print),
            "undefined" != typeof printErr && (Module.printErr = printErr),
            "undefined" != typeof read ? Module.read = read : Module.read = function() {
                throw "no read() available"
            }
            ,
            Module.readBinary = function(e) {
                if ("function" == typeof readbuffer)
                    return new Uint8Array(readbuffer(e));
                var t = read(e, "binary");
                return assert("object" == typeof t),
                t
            }
            ,
            "undefined" != typeof scriptArgs ? Module.arguments = scriptArgs : void 0 !== arguments && (Module.arguments = arguments),
            "function" == typeof quit && (Module.quit = function(e, t) {
                quit(e)
            }
            );
        else {
            if (!ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER)
                throw "Unknown runtime environment. Where are we?";
            if (Module.read = function(e) {
                var t = new XMLHttpRequest;
                return t.open("GET", e, !1),
                t.send(null),
                t.responseText
            }
            ,
            ENVIRONMENT_IS_WORKER && (Module.readBinary = function(e) {
                var t = new XMLHttpRequest;
                return t.open("GET", e, !1),
                t.responseType = "arraybuffer",
                t.send(null),
                new Uint8Array(t.response)
            }
            ),
            Module.readAsync = function(e, t, r) {
                var n = new XMLHttpRequest;
                n.open("GET", e, !0),
                n.responseType = "arraybuffer",
                n.onload = function() {
                    200 == n.status || 0 == n.status && n.response ? t(n.response) : r()
                }
                ,
                n.onerror = r,
                n.send(null)
            }
            ,
            void 0 !== arguments && (Module.arguments = arguments),
            "undefined" != typeof console)
                Module.print || (Module.print = function(e) {
                    console.log(e)
                }
                ),
                Module.printErr || (Module.printErr = function(e) {
                    console.warn(e)
                }
                );
            else {
                var TRY_USE_DUMP = !1;
                Module.print || (Module.print = TRY_USE_DUMP && "undefined" != typeof dump ? function(e) {
                    dump(e)
                }
                : function(e) {}
                )
            }
            ENVIRONMENT_IS_WORKER && (Module.load = importScripts),
            "undefined" == typeof Module.setWindowTitle && (Module.setWindowTitle = function(e) {
                document.title = e
            }
            )
        }
        !Module.load && Module.read && (Module.load = function(e) {
            globalEval(Module.read(e))
        }
        ),
        Module.print || (Module.print = function() {}
        ),
        Module.printErr || (Module.printErr = Module.print),
        Module.arguments || (Module.arguments = []),
        Module.thisProgram || (Module.thisProgram = "./this.program"),
        Module.quit || (Module.quit = function(e, t) {
            throw t
        }
        ),
        Module.print = Module.print,
        Module.printErr = Module.printErr,
        Module.preRun = [],
        Module.postRun = [];
        for (var key in moduleOverrides)
            moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
        moduleOverrides = undefined;
        var Runtime = {
            setTempRet0: function(e) {
                return tempRet0 = e,
                e
            },
            getTempRet0: function() {
                return tempRet0
            },
            stackSave: function() {
                return STACKTOP
            },
            stackRestore: function(e) {
                STACKTOP = e
            },
            getNativeTypeSize: function(e) {
                switch (e) {
                case "i1":
                case "i8":
                    return 1;
                case "i16":
                    return 2;
                case "i32":
                    return 4;
                case "i64":
                    return 8;
                case "float":
                    return 4;
                case "double":
                    return 8;
                default:
                    if ("*" === e[e.length - 1])
                        return Runtime.QUANTUM_SIZE;
                    if ("i" === e[0]) {
                        var t = parseInt(e.substr(1));
                        return assert(t % 8 == 0),
                        t / 8
                    }
                    return 0
                }
            },
            getNativeFieldSize: function(e) {
                return Math.max(Runtime.getNativeTypeSize(e), Runtime.QUANTUM_SIZE)
            },
            STACK_ALIGN: 16,
            prepVararg: function(e, t) {
                return "double" === t || "i64" === t ? 7 & e && (assert(4 == (7 & e)),
                e += 4) : assert(0 == (3 & e)),
                e
            },
            getAlignSize: function(e, t, r) {
                return r || "i64" != e && "double" != e ? e ? Math.min(t || (e ? Runtime.getNativeFieldSize(e) : 0), Runtime.QUANTUM_SIZE) : Math.min(t, 8) : 8
            },
            dynCall: function(e, t, r) {
                return r && r.length ? Module["dynCall_" + e].apply(null, [t].concat(r)) : Module["dynCall_" + e].call(null, t)
            },
            functionPointers: [],
            addFunction: function(e) {
                for (var t = 0; t < Runtime.functionPointers.length; t++)
                    if (!Runtime.functionPointers[t])
                        return Runtime.functionPointers[t] = e,
                        2 * (1 + t);
                throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
            },
            removeFunction: function(e) {
                Runtime.functionPointers[(e - 2) / 2] = null
            },
            warnOnce: function(e) {
                Runtime.warnOnce.shown || (Runtime.warnOnce.shown = {}),
                Runtime.warnOnce.shown[e] || (Runtime.warnOnce.shown[e] = 1,
                Module.printErr(e))
            },
            funcWrappers: {},
            getFuncWrapper: function(e, t) {
                assert(t),
                Runtime.funcWrappers[t] || (Runtime.funcWrappers[t] = {});
                var r = Runtime.funcWrappers[t];
                return r[e] || (1 === t.length ? r[e] = function() {
                    return Runtime.dynCall(t, e)
                }
                : 2 === t.length ? r[e] = function(r) {
                    return Runtime.dynCall(t, e, [r])
                }
                : r[e] = function() {
                    return Runtime.dynCall(t, e, Array.prototype.slice.call(arguments))
                }
                ),
                r[e]
            },
            getCompilerSetting: function(e) {
                throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
            },
            stackAlloc: function(e) {
                var t = STACKTOP;
                return STACKTOP = STACKTOP + e | 0,
                STACKTOP = STACKTOP + 15 & -16,
                t
            },
            staticAlloc: function(e) {
                var t = STATICTOP;
                return STATICTOP = STATICTOP + e | 0,
                STATICTOP = STATICTOP + 15 & -16,
                t
            },
            dynamicAlloc: function(e) {
                var t = HEAP32[DYNAMICTOP_PTR >> 2]
                  , r = -16 & (t + e + 15 | 0);
                return HEAP32[DYNAMICTOP_PTR >> 2] = r,
                r >= TOTAL_MEMORY && !enlargeMemory() ? (HEAP32[DYNAMICTOP_PTR >> 2] = t,
                0) : t
            },
            alignMemory: function(e, t) {
                return e = Math.ceil(e / (t || 16)) * (t || 16)
            },
            makeBigInt: function(e, t, r) {
                return r ? +(e >>> 0) + 4294967296 * +(t >>> 0) : +(e >>> 0) + 4294967296 * +(0 | t)
            },
            GLOBAL_BASE: 1024,
            QUANTUM_SIZE: 4,
            __dummy__: 0
        };
        Module.Runtime = Runtime;
        var ABORT = 0, EXITSTATUS = 0, cwrap, ccall;
        !function() {
            function parseJSFunc(e) {
                var t = e.toString().match(sourceRegex).slice(1);
                return {
                    arguments: t[0],
                    body: t[1],
                    returnValue: t[2]
                }
            }
            function ensureJSsource() {
                if (!JSsource) {
                    JSsource = {};
                    for (var e in JSfuncs)
                        JSfuncs.hasOwnProperty(e) && (JSsource[e] = parseJSFunc(JSfuncs[e]))
                }
            }
            var JSfuncs = {
                stackSave: function() {
                    Runtime.stackSave()
                },
                stackRestore: function() {
                    Runtime.stackRestore()
                },
                arrayToC: function(e) {
                    var t = Runtime.stackAlloc(e.length);
                    return writeArrayToMemory(e, t),
                    t
                },
                stringToC: function(e) {
                    var t = 0;
                    if (null !== e && e !== undefined && 0 !== e) {
                        var r = 1 + (e.length << 2);
                        stringToUTF8(e, t = Runtime.stackAlloc(r), r)
                    }
                    return t
                }
            }
              , toC = {
                string: JSfuncs.stringToC,
                array: JSfuncs.arrayToC
            };
            ccall = function(e, t, r, n, i) {
                var o = getCFunc(e)
                  , a = []
                  , s = 0;
                if (n)
                    for (var u = 0; u < n.length; u++) {
                        var l = toC[r[u]];
                        l ? (0 === s && (s = Runtime.stackSave()),
                        a[u] = l(n[u])) : a[u] = n[u]
                    }
                var c = o.apply(null, a);
                if ("string" === t && (c = Pointer_stringify(c)),
                0 !== s) {
                    if (i && i.async)
                        return void EmterpreterAsync.asyncFinalizers.push(function() {
                            Runtime.stackRestore(s)
                        });
                    Runtime.stackRestore(s)
                }
                return c
            }
            ;
            var sourceRegex = /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/
              , JSsource = null;
            cwrap = function cwrap(ident, returnType, argTypes) {
                argTypes = argTypes || [];
                var cfunc = getCFunc(ident)
                  , numericArgs = argTypes.every(function(e) {
                    return "number" === e
                })
                  , numericRet = "string" !== returnType;
                if (numericRet && numericArgs)
                    return cfunc;
                var argNames = argTypes.map(function(e, t) {
                    return "$" + t
                })
                  , funcstr = "(function(" + argNames.join(",") + ") {"
                  , nargs = argTypes.length;
                if (!numericArgs) {
                    ensureJSsource(),
                    funcstr += "var stack = " + JSsource.stackSave.body + ";";
                    for (var i = 0; i < nargs; i++) {
                        var arg = argNames[i]
                          , type = argTypes[i];
                        if ("number" !== type) {
                            var convertCode = JSsource[type + "ToC"];
                            funcstr += "var " + convertCode.arguments + " = " + arg + ";",
                            funcstr += convertCode.body + ";",
                            funcstr += arg + "=(" + convertCode.returnValue + ");"
                        }
                    }
                }
                var cfuncname = parseJSFunc(function() {
                    return cfunc
                }).returnValue;
                if (funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");",
                !numericRet) {
                    var strgfy = parseJSFunc(function() {
                        return Pointer_stringify
                    }).returnValue;
                    funcstr += "ret = " + strgfy + "(ret);"
                }
                return numericArgs || (ensureJSsource(),
                funcstr += JSsource.stackRestore.body.replace("()", "(stack)") + ";"),
                funcstr += "return ret})",
                eval(funcstr)
            }
        }(),
        Module.ccall = ccall,
        Module.cwrap = cwrap,
        Module.setValue = setValue,
        Module.getValue = getValue;
        var ALLOC_NORMAL = 0
          , ALLOC_STACK = 1
          , ALLOC_STATIC = 2
          , ALLOC_DYNAMIC = 3
          , ALLOC_NONE = 4;
        Module.ALLOC_NORMAL = ALLOC_NORMAL,
        Module.ALLOC_STACK = ALLOC_STACK,
        Module.ALLOC_STATIC = ALLOC_STATIC,
        Module.ALLOC_DYNAMIC = ALLOC_DYNAMIC,
        Module.ALLOC_NONE = ALLOC_NONE,
        Module.allocate = allocate,
        Module.getMemory = getMemory,
        Module.Pointer_stringify = Pointer_stringify,
        Module.AsciiToString = AsciiToString,
        Module.stringToAscii = stringToAscii;
        var UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : undefined;
        Module.UTF8ArrayToString = UTF8ArrayToString,
        Module.UTF8ToString = UTF8ToString,
        Module.stringToUTF8Array = stringToUTF8Array,
        Module.stringToUTF8 = stringToUTF8,
        Module.lengthBytesUTF8 = lengthBytesUTF8;
        var UTF16Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : undefined;
        Module.stackTrace = stackTrace;
        var WASM_PAGE_SIZE = 65536, ASMJS_PAGE_SIZE = 16777216, HEAP, buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, STATIC_BASE, STATICTOP, staticSealed, STACK_BASE, STACKTOP, STACK_MAX, DYNAMIC_BASE, DYNAMICTOP_PTR;
        STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0,
        staticSealed = !1;
        var TOTAL_STACK = Module.TOTAL_STACK || 5242880
          , TOTAL_MEMORY = Module.TOTAL_MEMORY || 16777216;
        if (TOTAL_MEMORY < TOTAL_STACK && Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")"),
        Module.buffer ? buffer = Module.buffer : "object" == typeof WebAssembly && "function" == typeof WebAssembly.Memory ? (Module.wasmMemory = new WebAssembly.Memory({
            initial: TOTAL_MEMORY / WASM_PAGE_SIZE,
            maximum: TOTAL_MEMORY / WASM_PAGE_SIZE
        }),
        buffer = Module.wasmMemory.buffer) : buffer = new ArrayBuffer(TOTAL_MEMORY),
        updateGlobalBufferViews(),
        HEAP32[0] = 1668509029,
        HEAP16[1] = 25459,
        115 !== HEAPU8[2] || 99 !== HEAPU8[3])
            throw "Runtime error: expected the system to be little-endian!";
        Module.HEAP = HEAP,
        Module.buffer = buffer,
        Module.HEAP8 = HEAP8,
        Module.HEAP16 = HEAP16,
        Module.HEAP32 = HEAP32,
        Module.HEAPU8 = HEAPU8,
        Module.HEAPU16 = HEAPU16,
        Module.HEAPU32 = HEAPU32,
        Module.HEAPF32 = HEAPF32,
        Module.HEAPF64 = HEAPF64;
        var __ATPRERUN__ = []
          , __ATINIT__ = []
          , __ATMAIN__ = []
          , __ATEXIT__ = []
          , __ATPOSTRUN__ = []
          , runtimeInitialized = !1
          , runtimeExited = !1;
        if (Module.addOnPreRun = addOnPreRun,
        Module.addOnInit = addOnInit,
        Module.addOnPreMain = addOnPreMain,
        Module.addOnExit = addOnExit,
        Module.addOnPostRun = addOnPostRun,
        Module.intArrayFromString = intArrayFromString,
        Module.intArrayToString = intArrayToString,
        Module.writeStringToMemory = writeStringToMemory,
        Module.writeArrayToMemory = writeArrayToMemory,
        Module.writeAsciiToMemory = writeAsciiToMemory,
        Math.imul && -5 === Math.imul(4294967295, 5) || (Math.imul = function(e, t) {
            var r = 65535 & e
              , n = 65535 & t;
            return r * n + ((e >>> 16) * n + r * (t >>> 16) << 16) | 0
        }
        ),
        Math.imul = Math.imul,
        !Math.fround) {
            var froundBuffer = new Float32Array(1);
            Math.fround = function(e) {
                return froundBuffer[0] = e,
                froundBuffer[0]
            }
        }
        Math.fround = Math.fround,
        Math.clz32 || (Math.clz32 = function(e) {
            e >>>= 0;
            for (var t = 0; t < 32; t++)
                if (e & 1 << 31 - t)
                    return t;
            return 32
        }
        ),
        Math.clz32 = Math.clz32,
        Math.trunc || (Math.trunc = function(e) {
            return e < 0 ? Math.ceil(e) : Math.floor(e)
        }
        ),
        Math.trunc = Math.trunc;
        var Math_abs = Math.abs
          , Math_cos = Math.cos
          , Math_sin = Math.sin
          , Math_tan = Math.tan
          , Math_acos = Math.acos
          , Math_asin = Math.asin
          , Math_atan = Math.atan
          , Math_atan2 = Math.atan2
          , Math_exp = Math.exp
          , Math_log = Math.log
          , Math_sqrt = Math.sqrt
          , Math_ceil = Math.ceil
          , Math_floor = Math.floor
          , Math_pow = Math.pow
          , Math_imul = Math.imul
          , Math_fround = Math.fround
          , Math_round = Math.round
          , Math_min = Math.min
          , Math_clz32 = Math.clz32
          , Math_trunc = Math.trunc
          , runDependencies = 0
          , runDependencyWatcher = null
          , dependenciesFulfilled = null;
        Module.addRunDependency = addRunDependency,
        Module.removeRunDependency = removeRunDependency,
        Module.preloadedImages = {},
        Module.preloadedAudios = {};
        var memoryInitializer = null;
        integrateWasmJS(Module);
        var ASM_CONSTS = [];
        STATIC_BASE = Runtime.GLOBAL_BASE,
        STATICTOP = STATIC_BASE + 41296,
        __ATINIT__.push({
            func: function() {
                __GLOBAL__sub_I_face_cpp()
            }
        }),
        memoryInitializer = Module.wasmJSMethod.indexOf("asmjs") >= 0 || Module.wasmJSMethod.indexOf("interpret-asm2wasm") >= 0 ? "face-wasm.js.mem" : null;
        var STATIC_BUMP = 41296;
        Module.STATIC_BASE = STATIC_BASE,
        Module.STATIC_BUMP = STATIC_BUMP;
        var tempDoublePtr = STATICTOP;
        STATICTOP += 16,
        Module._roundf = _roundf;
        var EXCEPTIONS = {
            last: 0,
            caught: [],
            infos: {},
            deAdjust: function(e) {
                if (!e || EXCEPTIONS.infos[e])
                    return e;
                for (var t in EXCEPTIONS.infos)
                    if (EXCEPTIONS.infos[t].adjusted === e)
                        return t;
                return e
            },
            addRef: function(e) {
                e && EXCEPTIONS.infos[e].refcount++
            },
            decRef: function(e) {
                if (e) {
                    var t = EXCEPTIONS.infos[e];
                    assert(t.refcount > 0),
                    t.refcount--,
                    0 !== t.refcount || t.rethrown || (t.destructor && Module.dynCall_vi(t.destructor, e),
                    delete EXCEPTIONS.infos[e],
                    ___cxa_free_exception(e))
                }
            },
            clearRef: function(e) {
                e && (EXCEPTIONS.infos[e].refcount = 0)
            }
        };
        Module._memset = _memset;
        var PTHREAD_SPECIFIC = {}
          , PTHREAD_SPECIFIC_NEXT_KEY = 1
          , ERRNO_CODES = {
            EPERM: 1,
            ENOENT: 2,
            ESRCH: 3,
            EINTR: 4,
            EIO: 5,
            ENXIO: 6,
            E2BIG: 7,
            ENOEXEC: 8,
            EBADF: 9,
            ECHILD: 10,
            EAGAIN: 11,
            EWOULDBLOCK: 11,
            ENOMEM: 12,
            EACCES: 13,
            EFAULT: 14,
            ENOTBLK: 15,
            EBUSY: 16,
            EEXIST: 17,
            EXDEV: 18,
            ENODEV: 19,
            ENOTDIR: 20,
            EISDIR: 21,
            EINVAL: 22,
            ENFILE: 23,
            EMFILE: 24,
            ENOTTY: 25,
            ETXTBSY: 26,
            EFBIG: 27,
            ENOSPC: 28,
            ESPIPE: 29,
            EROFS: 30,
            EMLINK: 31,
            EPIPE: 32,
            EDOM: 33,
            ERANGE: 34,
            ENOMSG: 42,
            EIDRM: 43,
            ECHRNG: 44,
            EL2NSYNC: 45,
            EL3HLT: 46,
            EL3RST: 47,
            ELNRNG: 48,
            EUNATCH: 49,
            ENOCSI: 50,
            EL2HLT: 51,
            EDEADLK: 35,
            ENOLCK: 37,
            EBADE: 52,
            EBADR: 53,
            EXFULL: 54,
            ENOANO: 55,
            EBADRQC: 56,
            EBADSLT: 57,
            EDEADLOCK: 35,
            EBFONT: 59,
            ENOSTR: 60,
            ENODATA: 61,
            ETIME: 62,
            ENOSR: 63,
            ENONET: 64,
            ENOPKG: 65,
            EREMOTE: 66,
            ENOLINK: 67,
            EADV: 68,
            ESRMNT: 69,
            ECOMM: 70,
            EPROTO: 71,
            EMULTIHOP: 72,
            EDOTDOT: 73,
            EBADMSG: 74,
            ENOTUNIQ: 76,
            EBADFD: 77,
            EREMCHG: 78,
            ELIBACC: 79,
            ELIBBAD: 80,
            ELIBSCN: 81,
            ELIBMAX: 82,
            ELIBEXEC: 83,
            ENOSYS: 38,
            ENOTEMPTY: 39,
            ENAMETOOLONG: 36,
            ELOOP: 40,
            EOPNOTSUPP: 95,
            EPFNOSUPPORT: 96,
            ECONNRESET: 104,
            ENOBUFS: 105,
            EAFNOSUPPORT: 97,
            EPROTOTYPE: 91,
            ENOTSOCK: 88,
            ENOPROTOOPT: 92,
            ESHUTDOWN: 108,
            ECONNREFUSED: 111,
            EADDRINUSE: 98,
            ECONNABORTED: 103,
            ENETUNREACH: 101,
            ENETDOWN: 100,
            ETIMEDOUT: 110,
            EHOSTDOWN: 112,
            EHOSTUNREACH: 113,
            EINPROGRESS: 115,
            EALREADY: 114,
            EDESTADDRREQ: 89,
            EMSGSIZE: 90,
            EPROTONOSUPPORT: 93,
            ESOCKTNOSUPPORT: 94,
            EADDRNOTAVAIL: 99,
            ENETRESET: 102,
            EISCONN: 106,
            ENOTCONN: 107,
            ETOOMANYREFS: 109,
            EUSERS: 87,
            EDQUOT: 122,
            ESTALE: 116,
            ENOTSUP: 95,
            ENOMEDIUM: 123,
            EILSEQ: 84,
            EOVERFLOW: 75,
            ECANCELED: 125,
            ENOTRECOVERABLE: 131,
            EOWNERDEAD: 130,
            ESTRPIPE: 86
        }
          , _llvm_pow_f32 = Math_pow;
        Module._memcpy = _memcpy;
        var SYSCALLS = {
            varargs: 0,
            get: function(e) {
                return SYSCALLS.varargs += 4,
                HEAP32[SYSCALLS.varargs - 4 >> 2]
            },
            getStr: function() {
                return Pointer_stringify(SYSCALLS.get())
            },
            get64: function() {
                var e = SYSCALLS.get()
                  , t = SYSCALLS.get();
                return assert(e >= 0 ? 0 === t : -1 === t),
                e
            },
            getZero: function() {
                assert(0 === SYSCALLS.get())
            }
        };
        Module._sbrk = _sbrk,
        Module._memmove = _memmove,
        Module._llvm_bswap_i32 = _llvm_bswap_i32;
        var _llvm_sqrt_f32 = Math_sqrt;
        __ATEXIT__.push(function() {
            var e = Module._fflush;
            e && e(0);
            var t = ___syscall146.printChar;
            if (t) {
                var r = ___syscall146.buffers;
                r[1].length && t(1, 10),
                r[2].length && t(2, 10)
            }
        }),
        DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC),
        STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP),
        STACK_MAX = STACK_BASE + TOTAL_STACK,
        DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX),
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE,
        staticSealed = !0,
        Module.wasmTableSize = 4218,
        Module.wasmMaxTableSize = 4218,
        Module.asmGlobalArg = {
            Math: Math,
            Int8Array: Int8Array,
            Int16Array: Int16Array,
            Int32Array: Int32Array,
            Uint8Array: Uint8Array,
            Uint16Array: Uint16Array,
            Uint32Array: Uint32Array,
            Float32Array: Float32Array,
            Float64Array: Float64Array,
            NaN: NaN,
            Infinity: Infinity
        },
        Module.asmLibraryArg = {
            abort: abort,
            assert: assert,
            enlargeMemory: enlargeMemory,
            getTotalMemory: getTotalMemory,
            abortOnCannotGrowMemory: abortOnCannotGrowMemory,
            invoke_vi: invoke_vi,
            invoke_iiii: invoke_iiii,
            invoke_viiiiii: invoke_viiiiii,
            invoke_vii: invoke_vii,
            invoke_viiiii: invoke_viiiii,
            invoke_viiii: invoke_viiii,
            invoke_iiidi: invoke_iiidi,
            invoke_iiidii: invoke_iiidii,
            invoke_di: invoke_di,
            invoke_ii: invoke_ii,
            invoke_iiiff: invoke_iiiff,
            invoke_iif: invoke_iif,
            invoke_viii: invoke_viii,
            invoke_v: invoke_v,
            invoke_iiiii: invoke_iiiii,
            invoke_fii: invoke_fii,
            invoke_iii: invoke_iii,
            invoke_iiif: invoke_iiif,
            _pthread_getspecific: _pthread_getspecific,
            _llvm_sqrt_f32: _llvm_sqrt_f32,
            _pthread_setspecific: _pthread_setspecific,
            ___cxa_throw: ___cxa_throw,
            _pthread_key_create: _pthread_key_create,
            _abort: _abort,
            ___setErrNo: ___setErrNo,
            ___syscall6: ___syscall6,
            ___cxa_begin_catch: ___cxa_begin_catch,
            _llvm_pow_f32: _llvm_pow_f32,
            ___syscall146: ___syscall146,
            _pthread_once: _pthread_once,
            _emscripten_memcpy_big: _emscripten_memcpy_big,
            ___gxx_personality_v0: ___gxx_personality_v0,
            ___syscall140: ___syscall140,
            ___resumeException: ___resumeException,
            ___cxa_find_matching_catch: ___cxa_find_matching_catch,
            ___cxa_pure_virtual: ___cxa_pure_virtual,
            ___cxa_allocate_exception: ___cxa_allocate_exception,
            __ZSt18uncaught_exceptionv: __ZSt18uncaught_exceptionv,
            DYNAMICTOP_PTR: DYNAMICTOP_PTR,
            tempDoublePtr: tempDoublePtr,
            ABORT: ABORT,
            STACKTOP: STACKTOP,
            STACK_MAX: STACK_MAX
        };
        var asm = Module.asm(Module.asmGlobalArg, Module.asmLibraryArg, buffer);
        Module.asm = asm;
        var _computeArea = Module._computeArea = function() {
            return Module.asm._computeArea.apply(null, arguments)
        }
          , _computeVolume = Module._computeVolume = function() {
            return Module.asm._computeVolume.apply(null, arguments)
        }
          , _getEyeIndices = Module._getEyeIndices = function() {
            return Module.asm._getEyeIndices.apply(null, arguments)
        }
          , _hv_setPrintHook = Module._hv_setPrintHook = function() {
            return Module.asm._hv_setPrintHook.apply(null, arguments)
        }
          , _getFaceNormalData = Module._getFaceNormalData = function() {
            return Module.asm._getFaceNormalData.apply(null, arguments)
        }
          , _getHiddenTriangleCount = Module._getHiddenTriangleCount = function() {
            return Module.asm._getHiddenTriangleCount.apply(null, arguments)
        }
          , _getEyeNormalData = Module._getEyeNormalData = function() {
            return Module.asm._getEyeNormalData.apply(null, arguments)
        }
          , _rayIntersect = Module._rayIntersect = function() {
            return Module.asm._rayIntersect.apply(null, arguments)
        }
          , _getHairNormalData = Module._getHairNormalData = function() {
            return Module.asm._getHairNormalData.apply(null, arguments)
        }
          , _hv_sendFloatToReceiver = Module._hv_sendFloatToReceiver = function() {
            return Module.asm._hv_sendFloatToReceiver.apply(null, arguments)
        }
          , stackSave = Module.stackSave = function() {
            return Module.asm.stackSave.apply(null, arguments)
        }
          , _roundf = Module._roundf = function() {
            return Module.asm._roundf.apply(null, arguments)
        }
          , _getEarNormalData = Module._getEarNormalData = function() {
            return Module.asm._getEarNormalData.apply(null, arguments)
        }
          , establishStackSpace = Module.establishStackSpace = function() {
            return Module.asm.establishStackSpace.apply(null, arguments)
        }
          , setThrew = Module.setThrew = function() {
            return Module.asm.setThrew.apply(null, arguments)
        }
          , _setVertex = Module._setVertex = function() {
            return Module.asm._setVertex.apply(null, arguments)
        }
          , _getHairIndexCount = Module._getHairIndexCount = function() {
            return Module.asm._getHairIndexCount.apply(null, arguments)
        }
          , _hv_sendFloatToReceiverWithDelay = Module._hv_sendFloatToReceiverWithDelay = function() {
            return Module.asm._hv_sendFloatToReceiverWithDelay.apply(null, arguments)
        }
          , _getMouthiness = Module._getMouthiness = function() {
            return Module.asm._getMouthiness.apply(null, arguments)
        }
          , _getFaceIndexCount = Module._getFaceIndexCount = function() {
            return Module.asm._getFaceIndexCount.apply(null, arguments)
        }
          , _computeQuality = Module._computeQuality = function() {
            return Module.asm._computeQuality.apply(null, arguments)
        }
          , _getWrinkleStrengths = Module._getWrinkleStrengths = function() {
            return Module.asm._getWrinkleStrengths.apply(null, arguments)
        }
          , _getNoseVertexCount = Module._getNoseVertexCount = function() {
            return Module.asm._getNoseVertexCount.apply(null, arguments)
        }
          , _getEarIndices = Module._getEarIndices = function() {
            return Module.asm._getEarIndices.apply(null, arguments)
        }
          , _hv_msg_init = Module._hv_msg_init = function() {
            return Module.asm._hv_msg_init.apply(null, arguments)
        }
          , _hv_table_setLength = Module._hv_table_setLength = function() {
            return Module.asm._hv_table_setLength.apply(null, arguments)
        }
          , _hv_stringToHash = Module._hv_stringToHash = function() {
            return Module.asm._hv_stringToHash.apply(null, arguments)
        }
          , ___errno_location = Module.___errno_location = function() {
            return Module.asm.___errno_location.apply(null, arguments)
        }
          , ___cxa_is_pointer_type = Module.___cxa_is_pointer_type = function() {
            return Module.asm.___cxa_is_pointer_type.apply(null, arguments)
        }
          , _hv_msg_getByteSize = Module._hv_msg_getByteSize = function() {
            return Module.asm._hv_msg_getByteSize.apply(null, arguments)
        }
          , stackRestore = Module.stackRestore = function() {
            return Module.asm.stackRestore.apply(null, arguments)
        }
          , _getFaceVertexCount = Module._getFaceVertexCount = function() {
            return Module.asm._getFaceVertexCount.apply(null, arguments)
        }
          , _getNosePositionData = Module._getNosePositionData = function() {
            return Module.asm._getNosePositionData.apply(null, arguments)
        }
          , _computeAverageSpeed = Module._computeAverageSpeed = function() {
            return Module.asm._computeAverageSpeed.apply(null, arguments)
        }
          , _initializeFace = Module._initializeFace = function() {
            return Module.asm._initializeFace.apply(null, arguments)
        }
          , _hv_msg_getTimestamp = Module._hv_msg_getTimestamp = function() {
            return Module.asm._hv_msg_getTimestamp.apply(null, arguments)
        }
          , _getNoseIndexCount = Module._getNoseIndexCount = function() {
            return Module.asm._getNoseIndexCount.apply(null, arguments)
        }
          , _hv_table_getBuffer = Module._hv_table_getBuffer = function() {
            return Module.asm._hv_table_getBuffer.apply(null, arguments)
        }
          , _hv_msg_hasFormat = Module._hv_msg_hasFormat = function() {
            return Module.asm._hv_msg_hasFormat.apply(null, arguments)
        }
          , _getEyePositionData = Module._getEyePositionData = function() {
            return Module.asm._getEyePositionData.apply(null, arguments)
        }
          , stackAlloc = Module.stackAlloc = function() {
            return Module.asm.stackAlloc.apply(null, arguments)
        }
          , _getNoseIndices = Module._getNoseIndices = function() {
            return Module.asm._getNoseIndices.apply(null, arguments)
        }
          , _getEarVertexCount = Module._getEarVertexCount = function() {
            return Module.asm._getEarVertexCount.apply(null, arguments)
        }
          , getTempRet0 = Module.getTempRet0 = function() {
            return Module.asm.getTempRet0.apply(null, arguments)
        }
          , _getHairVertexCount = Module._getHairVertexCount = function() {
            return Module.asm._getHairVertexCount.apply(null, arguments)
        }
          , _memset = Module._memset = function() {
            return Module.asm._memset.apply(null, arguments)
        }
          , setTempRet0 = Module.setTempRet0 = function() {
            return Module.asm.setTempRet0.apply(null, arguments)
        }
          , _hv_msg_getFloat = Module._hv_msg_getFloat = function() {
            return Module.asm._hv_msg_getFloat.apply(null, arguments)
        }
          , __GLOBAL__sub_I_face_cpp = Module.__GLOBAL__sub_I_face_cpp = function() {
            return Module.asm.__GLOBAL__sub_I_face_cpp.apply(null, arguments)
        }
          , _hv_getNumInputChannels = Module._hv_getNumInputChannels = function() {
            return Module.asm._hv_getNumInputChannels.apply(null, arguments)
        }
          , _getEyeVertexCount = Module._getEyeVertexCount = function() {
            return Module.asm._getEyeVertexCount.apply(null, arguments)
        }
          , _getFaceIndexData = Module._getFaceIndexData = function() {
            return Module.asm._getFaceIndexData.apply(null, arguments)
        }
          , _computeEyeVolume = Module._computeEyeVolume = function() {
            return Module.asm._computeEyeVolume.apply(null, arguments)
        }
          , _emscripten_get_global_libc = Module._emscripten_get_global_libc = function() {
            return Module.asm._emscripten_get_global_libc.apply(null, arguments)
        }
          , _getHiddenTriangles = Module._getHiddenTriangles = function() {
            return Module.asm._getHiddenTriangles.apply(null, arguments)
        }
          , _getEarPositionData = Module._getEarPositionData = function() {
            return Module.asm._getEarPositionData.apply(null, arguments)
        }
          , _getEyeIndex = Module._getEyeIndex = function() {
            return Module.asm._getEyeIndex.apply(null, arguments)
        }
          , _hv_msg_setFloat = Module._hv_msg_setFloat = function() {
            return Module.asm._hv_msg_setFloat.apply(null, arguments)
        }
          , _hv_sendBangToReceiver = Module._hv_sendBangToReceiver = function() {
            return Module.asm._hv_sendBangToReceiver.apply(null, arguments)
        }
          , _hv_getNumOutputChannels = Module._hv_getNumOutputChannels = function() {
            return Module.asm._hv_getNumOutputChannels.apply(null, arguments)
        }
          , _computeEyeAverageSpeed = Module._computeEyeAverageSpeed = function() {
            return Module.asm._computeEyeAverageSpeed.apply(null, arguments)
        }
          , _getEyeIndexCount = Module._getEyeIndexCount = function() {
            return Module.asm._getEyeIndexCount.apply(null, arguments)
        }
          , _llvm_bswap_i32 = Module._llvm_bswap_i32 = function() {
            return Module.asm._llvm_bswap_i32.apply(null, arguments)
        }
          , runPostSets = Module.runPostSets = function() {
            return Module.asm.runPostSets.apply(null, arguments)
        }
          , _getHairPositionData = Module._getHairPositionData = function() {
            return Module.asm._getHairPositionData.apply(null, arguments)
        }
          , ___cxa_can_catch = Module.___cxa_can_catch = function() {
            return Module.asm.___cxa_can_catch.apply(null, arguments)
        }
          , _free = Module._free = function() {
            return Module.asm._free.apply(null, arguments)
        }
          , _memcpy = Module._memcpy = function() {
            return Module.asm._memcpy.apply(null, arguments)
        }
          , _hv_table_getLength = Module._hv_table_getLength = function() {
            return Module.asm._hv_table_getLength.apply(null, arguments)
        }
          , _step = Module._step = function() {
            return Module.asm._step.apply(null, arguments)
        }
          , _memmove = Module._memmove = function() {
            return Module.asm._memmove.apply(null, arguments)
        }
          , _hv_samplesToMilliseconds = Module._hv_samplesToMilliseconds = function() {
            return Module.asm._hv_samplesToMilliseconds.apply(null, arguments)
        }
          , _getHairIndexData = Module._getHairIndexData = function() {
            return Module.asm._getHairIndexData.apply(null, arguments)
        }
          , _hv_sendMessageToReceiverV = Module._hv_sendMessageToReceiverV = function() {
            return Module.asm._hv_sendMessageToReceiverV.apply(null, arguments)
        }
          , _malloc = Module._malloc = function() {
            return Module.asm._malloc.apply(null, arguments)
        }
          , _hv_processInline = Module._hv_processInline = function() {
            return Module.asm._hv_processInline.apply(null, arguments)
        }
          , _hv_delete = Module._hv_delete = function() {
            return Module.asm._hv_delete.apply(null, arguments)
        }
          , _sbrk = Module._sbrk = function() {
            return Module.asm._sbrk.apply(null, arguments)
        }
          , _hv_sendSymbolToReceiver = Module._hv_sendSymbolToReceiver = function() {
            return Module.asm._hv_sendSymbolToReceiver.apply(null, arguments)
        }
          , _getEarIndexCount = Module._getEarIndexCount = function() {
            return Module.asm._getEarIndexCount.apply(null, arguments)
        }
          , _hv_facesynth_new_with_options = Module._hv_facesynth_new_with_options = function() {
            return Module.asm._hv_facesynth_new_with_options.apply(null, arguments)
        }
          , _getNoseNormalData = Module._getNoseNormalData = function() {
            return Module.asm._getNoseNormalData.apply(null, arguments)
        }
          , _hv_setSendHook = Module._hv_setSendHook = function() {
            return Module.asm._hv_setSendHook.apply(null, arguments)
        }
          , _hv_facesynth_new = Module._hv_facesynth_new = function() {
            return Module.asm._hv_facesynth_new.apply(null, arguments)
        }
          , _getFacePositionData = Module._getFacePositionData = function() {
            return Module.asm._getFacePositionData.apply(null, arguments)
        }
          , dynCall_vi = Module.dynCall_vi = function() {
            return Module.asm.dynCall_vi.apply(null, arguments)
        }
          , dynCall_iiii = Module.dynCall_iiii = function() {
            return Module.asm.dynCall_iiii.apply(null, arguments)
        }
          , dynCall_viiiiii = Module.dynCall_viiiiii = function() {
            return Module.asm.dynCall_viiiiii.apply(null, arguments)
        }
          , dynCall_vii = Module.dynCall_vii = function() {
            return Module.asm.dynCall_vii.apply(null, arguments)
        }
          , dynCall_viiiii = Module.dynCall_viiiii = function() {
            return Module.asm.dynCall_viiiii.apply(null, arguments)
        }
          , dynCall_viiii = Module.dynCall_viiii = function() {
            return Module.asm.dynCall_viiii.apply(null, arguments)
        }
          , dynCall_iiidi = Module.dynCall_iiidi = function() {
            return Module.asm.dynCall_iiidi.apply(null, arguments)
        }
          , dynCall_iiidii = Module.dynCall_iiidii = function() {
            return Module.asm.dynCall_iiidii.apply(null, arguments)
        }
          , dynCall_di = Module.dynCall_di = function() {
            return Module.asm.dynCall_di.apply(null, arguments)
        }
          , dynCall_ii = Module.dynCall_ii = function() {
            return Module.asm.dynCall_ii.apply(null, arguments)
        }
          , dynCall_iiiff = Module.dynCall_iiiff = function() {
            return Module.asm.dynCall_iiiff.apply(null, arguments)
        }
          , dynCall_iif = Module.dynCall_iif = function() {
            return Module.asm.dynCall_iif.apply(null, arguments)
        }
          , dynCall_viii = Module.dynCall_viii = function() {
            return Module.asm.dynCall_viii.apply(null, arguments)
        }
          , dynCall_v = Module.dynCall_v = function() {
            return Module.asm.dynCall_v.apply(null, arguments)
        }
          , dynCall_iiiii = Module.dynCall_iiiii = function() {
            return Module.asm.dynCall_iiiii.apply(null, arguments)
        }
          , dynCall_fii = Module.dynCall_fii = function() {
            return Module.asm.dynCall_fii.apply(null, arguments)
        }
          , dynCall_iii = Module.dynCall_iii = function() {
            return Module.asm.dynCall_iii.apply(null, arguments)
        }
          , dynCall_iiif = Module.dynCall_iiif = function() {
            return Module.asm.dynCall_iiif.apply(null, arguments)
        }
        ;
        if (Runtime.stackAlloc = Module.stackAlloc,
        Runtime.stackSave = Module.stackSave,
        Runtime.stackRestore = Module.stackRestore,
        Runtime.establishStackSpace = Module.establishStackSpace,
        Runtime.setTempRet0 = Module.setTempRet0,
        Runtime.getTempRet0 = Module.getTempRet0,
        Module.asm = asm,
        memoryInitializer)
            if ("function" == typeof Module.locateFile ? memoryInitializer = Module.locateFile(memoryInitializer) : Module.memoryInitializerPrefixURL && (memoryInitializer = Module.memoryInitializerPrefixURL + memoryInitializer),
            ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
                var data = Module.readBinary(memoryInitializer);
                HEAPU8.set(data, Runtime.GLOBAL_BASE)
            } else {
                addRunDependency("memory initializer");
                var applyMemoryInitializer = function(e) {
                    e.byteLength && (e = new Uint8Array(e)),
                    HEAPU8.set(e, Runtime.GLOBAL_BASE),
                    Module.memoryInitializerRequest && delete Module.memoryInitializerRequest.response,
                    removeRunDependency("memory initializer")
                };
                function doBrowserLoad() {
                    Module.readAsync(memoryInitializer, applyMemoryInitializer, function() {
                        throw "could not load memory initializer " + memoryInitializer
                    })
                }
                if (Module.memoryInitializerRequest) {
                    function useRequest() {
                        var e = Module.memoryInitializerRequest;
                        if (200 !== e.status && 0 !== e.status)
                            return console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: " + e.status + ", retrying " + memoryInitializer),
                            void doBrowserLoad();
                        applyMemoryInitializer(e.response)
                    }
                    Module.memoryInitializerRequest.response ? setTimeout(useRequest, 0) : Module.memoryInitializerRequest.addEventListener("load", useRequest)
                } else
                    doBrowserLoad()
            }
        Module.then = function(e) {
            if (Module.calledRun)
                e(Module);
            else {
                var t = Module.onRuntimeInitialized;
                Module.onRuntimeInitialized = function() {
                    t && t(),
                    e(Module)
                }
            }
            return Module
        }
        ,
        ExitStatus.prototype = new Error,
        ExitStatus.prototype.constructor = ExitStatus;
        var initialStackTop, preloadStartTime = null, calledMain = !1;
        dependenciesFulfilled = function e() {
            Module.calledRun || run(),
            Module.calledRun || (dependenciesFulfilled = e)
        }
        ,
        Module.callMain = Module.callMain = function(e) {
            function t() {
                for (var e = 0; e < 3; e++)
                    n.push(0)
            }
            e = e || [],
            ensureInitRuntime();
            var r = e.length + 1
              , n = [allocate(intArrayFromString(Module.thisProgram), "i8", ALLOC_NORMAL)];
            t();
            for (var i = 0; i < r - 1; i += 1)
                n.push(allocate(intArrayFromString(e[i]), "i8", ALLOC_NORMAL)),
                t();
            n.push(0),
            n = allocate(n, "i32", ALLOC_NORMAL);
            try {
                exit(Module._main(r, n, 0), !0)
            } catch (a) {
                if (a instanceof ExitStatus)
                    return;
                if ("SimulateInfiniteLoop" == a)
                    return void (Module.noExitRuntime = !0);
                var o = a;
                a && "object" == typeof a && a.stack && (o = [a, a.stack]),
                Module.printErr("exception thrown: " + o),
                Module.quit(1, a)
            } finally {
                calledMain = !0
            }
        }
        ,
        Module.run = Module.run = run,
        Module.exit = Module.exit = exit;
        var abortDecorators = [];
        if (Module.abort = Module.abort = abort,
        Module.preInit)
            for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; )
                Module.preInit.pop()();
        var shouldRunNow = !0;
        return Module.noInitialRun && (shouldRunNow = !1),
        Module.noExitRuntime = !0,
        run(),
        FaceLib
    };
    "object" == typeof module && module.exports && (module.exports = FaceLib);
    var facesynth_AudioLib = function(e, t) {
        this.module = e,
        this.sampleRate = t.sampleRate || 44100,
        this.blockSize = t.blockSize || 2048,
        this.heavyContext = this.module._hv_facesynth_new_with_options(this.sampleRate, 1e3, 1e3, 0);
        var r = this.blockSize * this.getNumOutputChannels();
        this.processBuffer = new Float32Array(this.module.HEAPF32.buffer,this.module._malloc(r * Float32Array.BYTES_PER_ELEMENT),r)
    };
    facesynth_AudioLib.prototype.preprocess = function(e) {
        for (var t = 0; t < e; ++t)
            this.setFloatParameters({
                dragging: Math.round(Math.random()),
                drag_delta_x: Math.random(),
                drag_delta_y: Math.random(),
                drag_delta_z: Math.random(),
                drag_distance: Math.random(),
                area: Math.random(),
                volume: Math.random(),
                slap: Math.round(Math.random())
            }),
            this.module._hv_processInline(this.heavyContext, null, this.processBuffer.byteOffset, this.blockSize)
    }
    ;
    var parameterInHashes = {
        area: 4151558017,
        average_eye_speed_left: 3085292019,
        average_eye_speed_right: 3570594550,
        average_speed: 391381125,
        drag_delta_x: 3329552188,
        drag_delta_y: 267539172,
        drag_delta_z: 3741941297,
        drag_distance: 920435809,
        dragging: 308932237,
        eye_volume_left: 4022162512,
        eye_volume_right: 268517835,
        init: 3057527446,
        quality: 2140652628,
        slap: 1362531630,
        vol_gloop: 2641398440,
        vol_master: 101509169,
        vol_slap: 1010567384,
        vol_slosh: 4260744706,
        vol_stretch: 4033315804,
        volume: 2976130901
    };
    facesynth_AudioLib.prototype.process = function(e) {
        this.module._hv_processInline(this.heavyContext, null, this.processBuffer.byteOffset, this.blockSize);
        for (var t = 0; t < this.getNumOutputChannels(); ++t)
            for (var r = e.outputBuffer.getChannelData(t), n = t * this.blockSize, i = 0; i < this.blockSize; ++i)
                r[i] = this.processBuffer[n + i]
    }
    ,
    facesynth_AudioLib.prototype.getNumInputChannels = function() {
        return this.heavyContext ? this.module._hv_getNumInputChannels(this.heavyContext) : -1
    }
    ,
    facesynth_AudioLib.prototype.getNumOutputChannels = function() {
        return this.heavyContext ? this.module._hv_getNumOutputChannels(this.heavyContext) : -1
    }
    ,
    facesynth_AudioLib.prototype.setFloatParameter = function(e, t) {
        this.heavyContext && this.module._hv_sendFloatToReceiver(this.heavyContext, parameterInHashes[e], parseFloat(t))
    }
    ,
    facesynth_AudioLib.prototype.setFloatParameterWithDelay = function(e, t, r) {
        this.heavyContext && this.module._hv_sendFloatToReceiverWithDelay(this.heavyContext, parameterInHashes[e], parseFloat(t), r)
    }
    ,
    facesynth_AudioLib.prototype.setFloatParameters = function(e) {
        for (var t in e)
            this.setFloatParameter(t, e[t])
    }
    ,
    facesynth_AudioLib.prototype.setFloatParametersWithDelay = function(e, t) {
        for (var r in e)
            this.setFloatParameterWithDelay(r, e[r], t)
    }
    ;
    var WrappedGL = function() {
        function e(e) {
            this.gl = e;
            for (r = 0; r < l.length; r += 1)
                this[l[r]] = e[l[r]];
            this.changedParameters = {},
            this.parameters = {
                framebuffer: {
                    defaults: [null],
                    setter: function(t) {
                        e.bindFramebuffer(e.FRAMEBUFFER, t)
                    },
                    usedInDraw: !0,
                    usedInClear: !0,
                    usedInRead: !0
                },
                program: {
                    defaults: [{
                        program: null
                    }],
                    setter: function(t) {
                        e.useProgram(t.program)
                    },
                    usedInDraw: !0
                },
                viewport: {
                    defaults: [0, 0, 0, 0],
                    setter: e.viewport,
                    usedInDraw: !0,
                    usedInClear: !0
                },
                indexBuffer: {
                    defaults: [null],
                    setter: function(t) {
                        e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t)
                    },
                    usedInDraw: !0
                },
                depthTest: {
                    defaults: [!1],
                    setter: function(t) {
                        t ? e.enable(e.DEPTH_TEST) : e.disable(e.DEPTH_TEST)
                    },
                    usedInDraw: !0
                },
                depthFunc: {
                    defaults: [e.LESS],
                    setter: e.depthFunc,
                    usedInDraw: !0
                },
                cullFace: {
                    defaults: [!1],
                    setter: function(t) {
                        t ? e.enable(e.CULL_FACE) : e.disable(e.CULL_FACE)
                    },
                    usedInDraw: !0
                },
                frontFace: {
                    defaults: [e.CCW],
                    setter: e.frontFace
                },
                blend: {
                    defaults: [!1],
                    setter: function(t) {
                        t ? e.enable(e.BLEND) : e.disable(e.BLEND)
                    },
                    usedInDraw: !0
                },
                blendEquation: {
                    defaults: [e.FUNC_ADD, e.FUNC_ADD],
                    setter: e.blendEquationSeparate,
                    usedInDraw: !0
                },
                blendFunc: {
                    defaults: [e.ONE, e.ZERO, e.ONE, e.ZERO],
                    setter: e.blendFuncSeparate,
                    usedInDraw: !0
                },
                polygonOffsetFill: {
                    defaults: [!1],
                    setter: function(t) {
                        t ? e.enable(e.POLYGON_OFFSET_FILL) : e.disable(e.POLYGON_OFFSET_FILL)
                    },
                    usedInDraw: !0
                },
                polygonOffset: {
                    defaults: [0, 0],
                    setter: e.polygonOffset,
                    usedInDraw: !0
                },
                scissorTest: {
                    defaults: [!1],
                    setter: function(t) {
                        t ? e.enable(e.SCISSOR_TEST) : e.disable(e.SCISSOR_TEST)
                    },
                    usedInDraw: !0,
                    usedInClear: !0
                },
                scissor: {
                    defaults: [0, 0, 0, 0],
                    setter: e.scissor,
                    usedInDraw: !0,
                    usedInClear: !0
                },
                colorMask: {
                    defaults: [!0, !0, !0, !0],
                    setter: e.colorMask,
                    usedInDraw: !0,
                    usedInClear: !0
                },
                depthMask: {
                    defaults: [!0],
                    setter: e.depthMask,
                    usedInDraw: !0,
                    usedInClear: !0
                },
                clearColor: {
                    defaults: [0, 0, 0, 0],
                    setter: e.clearColor,
                    usedInClear: !0
                },
                clearDepth: {
                    defaults: [1],
                    setter: e.clearDepth,
                    usedInClear: !0
                }
            };
            for (var t = e.getParameter(e.MAX_VERTEX_ATTRIBS), r = 0; r < t; ++r)
                this.parameters["attributeArray" + r.toString()] = {
                    defaults: [null, 0, null, !1, 0, 0],
                    setter: function() {
                        var t = r;
                        return function(r, n, i, o, a, s) {
                            null !== r && (e.bindBuffer(e.ARRAY_BUFFER, r),
                            e.vertexAttribPointer(t, n, i, o, a, s),
                            e.enableVertexAttribArray(t))
                        }
                    }(),
                    usedInDraw: !0
                };
            for (var n = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), r = 0; r < n; ++r)
                this.parameters["texture" + r.toString()] = {
                    defaults: [e.TEXTURE_2D, null],
                    setter: function() {
                        var t = r;
                        return function(r, n) {
                            e.activeTexture(e.TEXTURE0 + t),
                            e.bindTexture(r, n)
                        }
                    }(),
                    usedInDraw: !0
                };
            this.uniformSetters = {
                "1i": e.uniform1i,
                "2i": e.uniform2i,
                "3i": e.uniform3i,
                "4i": e.uniform4i,
                "1f": e.uniform1f,
                "2f": e.uniform2f,
                "3f": e.uniform3f,
                "4f": e.uniform4f,
                "1fv": e.uniform1fv,
                "2fv": e.uniform2fv,
                "3fv": e.uniform3fv,
                "4fv": e.uniform4fv,
                matrix2fv: e.uniformMatrix2fv,
                matrix3fv: e.uniformMatrix3fv,
                matrix4fv: e.uniformMatrix4fv
            },
            this.defaultTextureUnit = 0
        }
        function t(e) {
            var t = 0;
            for (var r in e)
                e.hasOwnProperty(r) && (t += 1);
            return t
        }
        function r(e, t, r) {
            var n = e.createShader(t);
            return e.shaderSource(n, r),
            e.compileShader(n),
            e.getShaderParameter(n, e.COMPILE_STATUS) || console.log(e.getShaderInfoLog(n)),
            n
        }
        function n(e, t, n, i) {
            this.uniformLocations = {},
            this.uniforms = {};
            var o = e.gl
              , a = r(o, o.VERTEX_SHADER, t)
              , s = r(o, o.FRAGMENT_SHADER, n)
              , u = this.program = o.createProgram();
            if (o.attachShader(u, a),
            o.attachShader(u, s),
            i !== undefined)
                for (var l in i)
                    o.bindAttribLocation(u, i[l], l);
            o.linkProgram(u),
            this.attributeLocations = {};
            for (var c = o.getProgramParameter(u, o.ACTIVE_ATTRIBUTES), h = 0; h < c; ++h) {
                l = o.getActiveAttrib(u, h).name;
                this.attributeLocations[l] = o.getAttribLocation(u, l)
            }
            for (var d = this.uniformLocations = {}, f = o.getProgramParameter(u, o.ACTIVE_UNIFORMS), h = 0; h < f; h += 1) {
                var _ = o.getActiveUniform(u, h)
                  , m = o.getUniformLocation(u, _.name);
                d[_.name] = m
            }
        }
        function i(e) {
            this.wgl = e,
            this.changedParameters = {}
        }
        function o(e, t) {
            for (var r = 0; r < e.length; ++r)
                if (e[r] !== t[r])
                    return !1;
            return !0
        }
        function a(e) {
            i.call(this, e),
            this.uniforms = {}
        }
        function s(e) {
            i.call(this, e)
        }
        function u(e) {
            i.call(this, e)
        }
        var l = ["ACTIVE_ATTRIBUTES", "ACTIVE_ATTRIBUTE_MAX_LENGTH", "ACTIVE_TEXTURE", "ACTIVE_UNIFORMS", "ACTIVE_UNIFORM_MAX_LENGTH", "ALIASED_LINE_WIDTH_RANGE", "ALIASED_POINT_SIZE_RANGE", "ALPHA", "ALPHA_BITS", "ALWAYS", "ARRAY_BUFFER", "ARRAY_BUFFER_BINDING", "ATTACHED_SHADERS", "BACK", "BLEND", "BLEND_COLOR", "BLEND_DST_ALPHA", "BLEND_DST_RGB", "BLEND_EQUATION", "BLEND_EQUATION_ALPHA", "BLEND_EQUATION_RGB", "BLEND_SRC_ALPHA", "BLEND_SRC_RGB", "BLUE_BITS", "BOOL", "BOOL_VEC2", "BOOL_VEC3", "BOOL_VEC4", "BROWSER_DEFAULT_WEBGL", "BUFFER_SIZE", "BUFFER_USAGE", "BYTE", "CCW", "CLAMP_TO_EDGE", "COLOR_ATTACHMENT0", "COLOR_BUFFER_BIT", "COLOR_CLEAR_VALUE", "COLOR_WRITEMASK", "COMPILE_STATUS", "COMPRESSED_TEXTURE_FORMATS", "CONSTANT_ALPHA", "CONSTANT_COLOR", "CONTEXT_LOST_WEBGL", "CULL_FACE", "CULL_FACE_MODE", "CURRENT_PROGRAM", "CURRENT_VERTEX_ATTRIB", "CW", "DECR", "DECR_WRAP", "DELETE_STATUS", "DEPTH_ATTACHMENT", "DEPTH_BITS", "DEPTH_BUFFER_BIT", "DEPTH_CLEAR_VALUE", "DEPTH_COMPONENT", "DEPTH_COMPONENT16", "DEPTH_FUNC", "DEPTH_RANGE", "DEPTH_STENCIL", "DEPTH_STENCIL_ATTACHMENT", "DEPTH_TEST", "DEPTH_WRITEMASK", "DITHER", "DONT_CARE", "DST_ALPHA", "DST_COLOR", "DYNAMIC_DRAW", "ELEMENT_ARRAY_BUFFER", "ELEMENT_ARRAY_BUFFER_BINDING", "EQUAL", "FASTEST", "FLOAT", "FLOAT_MAT2", "FLOAT_MAT3", "FLOAT_MAT4", "FLOAT_VEC2", "FLOAT_VEC3", "FLOAT_VEC4", "FRAGMENT_SHADER", "FRAMEBUFFER", "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", "FRAMEBUFFER_BINDING", "FRAMEBUFFER_COMPLETE", "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", "FRAMEBUFFER_UNSUPPORTED", "FRONT", "FRONT_AND_BACK", "FRONT_FACE", "FUNC_ADD", "FUNC_REVERSE_SUBTRACT", "FUNC_SUBTRACT", "GENERATE_MIPMAP_HINT", "GEQUAL", "GREATER", "GREEN_BITS", "HIGH_FLOAT", "HIGH_INT", "INCR", "INCR_WRAP", "INFO_LOG_LENGTH", "INT", "INT_VEC2", "INT_VEC3", "INT_VEC4", "INVALID_ENUM", "INVALID_FRAMEBUFFER_OPERATION", "INVALID_OPERATION", "INVALID_VALUE", "INVERT", "KEEP", "LEQUAL", "LESS", "LINEAR", "LINEAR_MIPMAP_LINEAR", "LINEAR_MIPMAP_NEAREST", "LINES", "LINE_LOOP", "LINE_STRIP", "LINE_WIDTH", "LINK_STATUS", "LOW_FLOAT", "LOW_INT", "LUMINANCE", "LUMINANCE_ALPHA", "MAX_COMBINED_TEXTURE_IMAGE_UNITS", "MAX_CUBE_MAP_TEXTURE_SIZE", "MAX_FRAGMENT_UNIFORM_VECTORS", "MAX_RENDERBUFFER_SIZE", "MAX_TEXTURE_IMAGE_UNITS", "MAX_TEXTURE_SIZE", "MAX_VARYING_VECTORS", "MAX_VERTEX_ATTRIBS", "MAX_VERTEX_TEXTURE_IMAGE_UNITS", "MAX_VERTEX_UNIFORM_VECTORS", "MAX_VIEWPORT_DIMS", "MEDIUM_FLOAT", "MEDIUM_INT", "MIRRORED_REPEAT", "NEAREST", "NEAREST_MIPMAP_LINEAR", "NEAREST_MIPMAP_NEAREST", "NEVER", "NICEST", "NONE", "NOTEQUAL", "NO_ERROR", "NUM_COMPRESSED_TEXTURE_FORMATS", "ONE", "ONE_MINUS_CONSTANT_ALPHA", "ONE_MINUS_CONSTANT_COLOR", "ONE_MINUS_DST_ALPHA", "ONE_MINUS_DST_COLOR", "ONE_MINUS_SRC_ALPHA", "ONE_MINUS_SRC_COLOR", "OUT_OF_MEMORY", "PACK_ALIGNMENT", "POINTS", "POLYGON_OFFSET_FACTOR", "POLYGON_OFFSET_FILL", "POLYGON_OFFSET_UNITS", "RED_BITS", "RENDERBUFFER", "RENDERBUFFER_ALPHA_SIZE", "RENDERBUFFER_BINDING", "RENDERBUFFER_BLUE_SIZE", "RENDERBUFFER_DEPTH_SIZE", "RENDERBUFFER_GREEN_SIZE", "RENDERBUFFER_HEIGHT", "RENDERBUFFER_INTERNAL_FORMAT", "RENDERBUFFER_RED_SIZE", "RENDERBUFFER_STENCIL_SIZE", "RENDERBUFFER_WIDTH", "RENDERER", "REPEAT", "REPLACE", "RGB", "RGB5_A1", "RGB565", "RGBA", "RGBA4", "SAMPLER_2D", "SAMPLER_CUBE", "SAMPLES", "SAMPLE_ALPHA_TO_COVERAGE", "SAMPLE_BUFFERS", "SAMPLE_COVERAGE", "SAMPLE_COVERAGE_INVERT", "SAMPLE_COVERAGE_VALUE", "SCISSOR_BOX", "SCISSOR_TEST", "SHADER_COMPILER", "SHADER_SOURCE_LENGTH", "SHADER_TYPE", "SHADING_LANGUAGE_VERSION", "SHORT", "SRC_ALPHA", "SRC_ALPHA_SATURATE", "SRC_COLOR", "STATIC_DRAW", "STENCIL_ATTACHMENT", "STENCIL_BACK_FAIL", "STENCIL_BACK_FUNC", "STENCIL_BACK_PASS_DEPTH_FAIL", "STENCIL_BACK_PASS_DEPTH_PASS", "STENCIL_BACK_REF", "STENCIL_BACK_VALUE_MASK", "STENCIL_BACK_WRITEMASK", "STENCIL_BITS", "STENCIL_BUFFER_BIT", "STENCIL_CLEAR_VALUE", "STENCIL_FAIL", "STENCIL_FUNC", "STENCIL_INDEX", "STENCIL_INDEX8", "STENCIL_PASS_DEPTH_FAIL", "STENCIL_PASS_DEPTH_PASS", "STENCIL_REF", "STENCIL_TEST", "STENCIL_VALUE_MASK", "STENCIL_WRITEMASK", "STREAM_DRAW", "SUBPIXEL_BITS", "TEXTURE", "TEXTURE0", "TEXTURE1", "TEXTURE2", "TEXTURE3", "TEXTURE4", "TEXTURE5", "TEXTURE6", "TEXTURE7", "TEXTURE8", "TEXTURE9", "TEXTURE10", "TEXTURE11", "TEXTURE12", "TEXTURE13", "TEXTURE14", "TEXTURE15", "TEXTURE16", "TEXTURE17", "TEXTURE18", "TEXTURE19", "TEXTURE20", "TEXTURE21", "TEXTURE22", "TEXTURE23", "TEXTURE24", "TEXTURE25", "TEXTURE26", "TEXTURE27", "TEXTURE28", "TEXTURE29", "TEXTURE30", "TEXTURE31", "TEXTURE_2D", "TEXTURE_BINDING_2D", "TEXTURE_BINDING_CUBE_MAP", "TEXTURE_CUBE_MAP", "TEXTURE_CUBE_MAP_NEGATIVE_X", "TEXTURE_CUBE_MAP_NEGATIVE_Y", "TEXTURE_CUBE_MAP_NEGATIVE_Z", "TEXTURE_CUBE_MAP_POSITIVE_X", "TEXTURE_CUBE_MAP_POSITIVE_Y", "TEXTURE_CUBE_MAP_POSITIVE_Z", "TEXTURE_MAG_FILTER", "TEXTURE_MIN_FILTER", "TEXTURE_WRAP_S", "TEXTURE_WRAP_T", "TRIANGLES", "TRIANGLE_FAN", "TRIANGLE_STRIP", "UNPACK_ALIGNMENT", "UNPACK_COLORSPACE_CONVERSION_WEBGL", "UNPACK_FLIP_Y_WEBGL", "UNPACK_PREMULTIPLY_ALPHA_WEBGL", "UNSIGNED_BYTE", "UNSIGNED_INT", "UNSIGNED_SHORT", "UNSIGNED_SHORT_4_4_4_4", "UNSIGNED_SHORT_5_5_5_1", "UNSIGNED_SHORT_5_6_5", "VALIDATE_STATUS", "VENDOR", "VERSION", "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", "VERTEX_ATTRIB_ARRAY_ENABLED", "VERTEX_ATTRIB_ARRAY_NORMALIZED", "VERTEX_ATTRIB_ARRAY_POINTER", "VERTEX_ATTRIB_ARRAY_SIZE", "VERTEX_ATTRIB_ARRAY_STRIDE", "VERTEX_ATTRIB_ARRAY_TYPE", "VERTEX_SHADER", "VIEWPORT", "ZERO"];
        return e.create = function(t, r) {
            var n = null;
            try {
                n = t.getContext("webgl", r) || t.getContext("experimental-webgl", r)
            } catch (i) {
                return null
            }
            return null === n ? null : new e(n)
        }
        ,
        e.checkWebGLSupport = function(t, r) {
            e.checkWebGLSupportWithExtensions([], t, function(e, t) {
                r()
            })
        }
        ,
        e.checkWebGLSupportWithExtensions = function(e, t, r) {
            var n = document.createElement("canvas")
              , i = null;
            try {
                i = n.getContext("webgl") || n.getContext("experimental-webgl")
            } catch (s) {
                return void r(!1, [])
            }
            if (null !== i) {
                for (var o = [], a = 0; a < e.length; ++a)
                    null === i.getExtension(e[a]) && o.push(e[a]);
                o.length > 0 ? r(!0, o) : t()
            } else
                r(!1, [])
        }
        ,
        e.prototype.getSupportedExtensions = function() {
            return this.gl.getSupportedExtensions()
        }
        ,
        e.prototype.getExtension = function(e) {
            var t = this.gl;
            if ("ANGLE_instanced_arrays" === e) {
                var r = t.getExtension("ANGLE_instanced_arrays");
                if (null !== r) {
                    this.instancedExt = r;
                    for (var n = t.getParameter(t.MAX_VERTEX_ATTRIBS), i = 0; i < n; ++i)
                        this.parameters["attributeDivisor" + i.toString()] = {
                            defaults: [0],
                            setter: function() {
                                var e = i;
                                return function(t) {
                                    r.vertexAttribDivisorANGLE(e, t)
                                }
                            }(),
                            usedInDraw: !0
                        };
                    return a.prototype.vertexAttribPointer = function(e, t, r, n, i, o, a) {
                        return this.setParameter("attributeArray" + t.toString(), [e, r, n, i, o, a]),
                        this.changedParameters.hasOwnProperty("attributeDivisor" + t.toString()) && this.setParameter("attributeDivisor" + t.toString(), [0]),
                        this
                    }
                    ,
                    a.prototype.vertexAttribDivisorANGLE = function(e, t) {
                        return this.setParameter("attributeDivisor" + e.toString(), [t]),
                        this
                    }
                    ,
                    this.drawArraysInstancedANGLE = function(e, t, r, n, i) {
                        this.resolveDrawState(e),
                        this.instancedExt.drawArraysInstancedANGLE(t, r, n, i)
                    }
                    ,
                    this.drawElementsInstancedANGLE = function(e, t, r, n, i, o) {
                        this.resolveDrawState(e),
                        this.instancedExt.drawElementsInstancedANGLE(t, r, n, i, o)
                    }
                    ,
                    {}
                }
                return null
            }
            return t.getExtension(e)
        }
        ,
        e.prototype.getParameter = function(e) {
            return this.gl.getParameter(e)
        }
        ,
        e.prototype.canRenderToTexture = function(e) {
            var t = this.gl
              , r = this.createFramebuffer()
              , n = this.buildTexture(t.RGBA, e, 1, 1, null, t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE, t.NEAREST, t.NEAREST);
            this.framebufferTexture2D(r, t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, n, 0);
            var i = this.checkFramebufferStatus(r) === t.FRAMEBUFFER_COMPLETE;
            return this.deleteFramebuffer(r),
            this.deleteTexture(n),
            i
        }
        ,
        e.prototype.checkFramebufferStatus = function(e) {
            return this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, e),
            this.changedParameters.framebuffer = e,
            this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER)
        }
        ,
        e.prototype.getShaderPrecisionFormat = function(e, t) {
            return this.gl.getShaderPrecisionFormat(e, t)
        }
        ,
        e.prototype.hasHalfFloatTextureSupport = function() {
            var e = this.getExtension("OES_texture_half_float");
            return null !== e && (null !== this.getExtension("OES_texture_half_float_linear") && !!this.canRenderToTexture(e.HALF_FLOAT_OES))
        }
        ,
        e.prototype.hasFloatTextureSupport = function() {
            return null !== this.getExtension("OES_texture_float") && null !== this.getExtension("OES_texture_float_linear") && !!this.canRenderToTexture(this.FLOAT)
        }
        ,
        e.prototype.resolveState = function(e, t) {
            this.gl;
            for (var r in this.changedParameters)
                this.changedParameters.hasOwnProperty(r) && (e.changedParameters.hasOwnProperty(r) || this.parameters[r][t] && (this.parameters[r].setter.apply(this.gl, this.parameters[r].defaults),
                delete this.changedParameters[r]));
            for (var r in e.changedParameters)
                e.changedParameters.hasOwnProperty(r) && (this.changedParameters.hasOwnProperty(r) && o(this.changedParameters[r], e.changedParameters[r]) || (this.changedParameters[r] = e.changedParameters[r],
                this.parameters[r].setter.apply(this.gl, this.changedParameters[r])))
        }
        ,
        e.prototype.resolveDrawState = function(e) {
            var t = this.gl;
            this.resolveState(e, "usedInDraw");
            var r = e.changedParameters.program[0];
            for (var n in e.uniforms)
                if (e.uniforms.hasOwnProperty(n)) {
                    var i = [r.uniformLocations[n]].concat(e.uniforms[n].value);
                    this.uniformSetters[e.uniforms[n].type].apply(t, i)
                }
        }
        ,
        e.prototype.drawArrays = function(e, t, r, n) {
            this.resolveDrawState(e),
            this.gl.drawArrays(t, r, n)
        }
        ,
        e.prototype.drawElements = function(e, t, r, n, i) {
            this.resolveDrawState(e),
            this.gl.drawElements(t, r, n, i)
        }
        ,
        e.prototype.resolveClearState = function(e) {
            this.resolveState(e, "usedInClear")
        }
        ,
        e.prototype.clear = function(e, t) {
            this.resolveClearState(e),
            this.gl.clear(t)
        }
        ,
        e.prototype.resolveReadState = function(e) {
            this.resolveState(e, "usedInRead")
        }
        ,
        e.prototype.readPixels = function(e, t, r, n, i, o, a, s) {
            this.resolveReadState(e),
            this.gl.readPixels(t, r, n, i, o, a, s)
        }
        ,
        e.prototype.finish = function() {
            return this.gl.finish(),
            this
        }
        ,
        e.prototype.flush = function() {
            return this.gl.flush(),
            this
        }
        ,
        e.prototype.getError = function() {
            return this.gl.getError()
        }
        ,
        e.prototype.createFramebuffer = function() {
            return this.gl.createFramebuffer()
        }
        ,
        e.prototype.framebufferTexture2D = function(e, t, r, n, i, o) {
            return this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, e),
            this.changedParameters.framebuffer = e,
            this.gl.framebufferTexture2D(t, r, n, i, o),
            this
        }
        ,
        e.prototype.framebufferRenderbuffer = function(e, t, r, n, i) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, e),
            this.changedParameters.framebuffer = e,
            this.gl.framebufferRenderbuffer(t, r, n, i)
        }
        ,
        e.prototype.drawBuffers = function(e, t) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, e),
            this.changedParameters.framebuffer = e,
            this.drawExt.drawBuffersWEBGL(t)
        }
        ,
        e.prototype.createTexture = function() {
            return this.gl.createTexture()
        }
        ,
        e.prototype.bindTextureForEditing = function(e, t) {
            this.gl.activeTexture(this.gl.TEXTURE0 + this.defaultTextureUnit),
            this.gl.bindTexture(e, t),
            this.changedParameters["texture" + this.defaultTextureUnit.toString()] = [e, t]
        }
        ,
        e.prototype.texImage2D = function(e, t) {
            var r = Array.prototype.slice.call(arguments, 2);
            return r.unshift(e),
            this.bindTextureForEditing(e, t),
            this.gl.texImage2D.apply(this.gl, r),
            this
        }
        ,
        e.prototype.texSubImage2D = function(e, t) {
            var r = Array.prototype.slice.call(arguments, 2);
            return r.unshift(e),
            this.bindTextureForEditing(e, t),
            this.gl.texSubImage2D.apply(this.gl, r),
            this
        }
        ,
        e.prototype.texParameteri = function(e, t, r, n) {
            return this.bindTextureForEditing(e, t),
            this.gl.texParameteri(e, r, n),
            this
        }
        ,
        e.prototype.texParameterf = function(e, t, r, n) {
            return this.bindTextureForEditing(e, t),
            this.gl.texParameterf(e, r, n),
            this
        }
        ,
        e.prototype.pixelStorei = function(e, t, r, n) {
            return this.bindTextureForEditing(e, t),
            this.gl.pixelStorei(r, n),
            this
        }
        ,
        e.prototype.setTextureFiltering = function(e, t, r, n, i, o) {
            var a = this.gl;
            return this.bindTextureForEditing(e, t),
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, r),
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, n),
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, i),
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, o),
            this
        }
        ,
        e.prototype.generateMipmap = function(e, t) {
            return this.bindTextureForEditing(e, t),
            this.gl.generateMipmap(e),
            this
        }
        ,
        e.prototype.buildTexture = function(e, t, r, n, i, o, a, s, u) {
            var l = this.createTexture();
            return this.rebuildTexture(l, e, t, r, n, i, o, a, s, u),
            l
        }
        ,
        e.prototype.rebuildTexture = function(e, t, r, n, i, o, a, s, u, l) {
            return this.texImage2D(this.TEXTURE_2D, e, 0, t, n, i, 0, t, r, o).setTextureFiltering(this.TEXTURE_2D, e, a, s, u, l),
            this
        }
        ,
        e.prototype.createRenderbuffer = function() {
            return this.gl.createRenderbuffer()
        }
        ,
        e.prototype.renderbufferStorage = function(e, t, r, n, i) {
            return this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, e),
            this.gl.renderbufferStorage(t, r, n, i),
            this
        }
        ,
        e.prototype.createBuffer = function() {
            return this.gl.createBuffer()
        }
        ,
        e.prototype.bufferData = function(e, t, r, n) {
            var i = this.gl;
            t === i.ARRAY_BUFFER || t === i.ELEMENT_ARRAY_BUFFER && (this.changedParameters.indexBuffer = [e]),
            i.bindBuffer(t, e),
            i.bufferData(t, r, n)
        }
        ,
        e.prototype.buildBuffer = function(e, t, r) {
            var n = this.createBuffer();
            return this.bufferData(n, e, t, r),
            n
        }
        ,
        e.prototype.bufferSubData = function(e, t, r, n) {
            var i = this.gl;
            t === i.ARRAY_BUFFER || t === i.ELEMENT_ARRAY_BUFFER && (this.changedParameters.indexBuffer = [e]),
            i.bindBuffer(t, e),
            i.bufferSubData(t, r, n)
        }
        ,
        e.prototype.createProgram = function(e, t, r) {
            return new n(this,e,t,r)
        }
        ,
        e.loadTextFiles = function(e, t) {
            for (var r = 0, n = {}, i = 0; i < e.length; ++i) {
                var o = e[i];
                !function() {
                    var i = o
                      , a = new XMLHttpRequest;
                    a.onreadystatechange = function() {
                        if (4 === a.readyState) {
                            var o = a.responseText;
                            n[i] = o,
                            (r += 1) === e.length && t(n)
                        }
                    }
                    ,
                    a.open("GET", i, !0),
                    a.send()
                }()
            }
        }
        ,
        e.prototype.createProgramFromFiles = function(t, r, n, i, o) {
            var a = this
              , s = [];
            Array.isArray(t) ? s = s.concat(t) : s.push(t),
            Array.isArray(r) ? s = s.concat(r) : s.push(r),
            e.loadTextFiles(s, function(e) {
                var o = [];
                if (Array.isArray(t))
                    for (u = 0; u < t.length; ++u)
                        o.push(e[t[u]]);
                else
                    o.push(e[t]);
                var s = [];
                if (Array.isArray(r))
                    for (var u = 0; u < r.length; ++u)
                        s.push(e[r[u]]);
                else
                    s.push(e[r]);
                var l = a.createProgram(o.join("\n"), s.join("\n"), n);
                i(l)
            })
        }
        ,
        e.prototype.createProgramsFromFiles = function(e, r, n) {
            var i = t(e)
              , o = 0
              , a = {};
            for (var s in e)
                if (e.hasOwnProperty(s)) {
                    var u = e[s]
                      , l = this;
                    !function() {
                        var e = s;
                        l.createProgramFromFiles(u.vertexShader, u.fragmentShader, u.attributeLocations, function(t) {
                            a[e] = t,
                            ++o === i && r(a)
                        })
                    }()
                }
        }
        ,
        e.prototype.createDrawState = function() {
            return new a(this)
        }
        ,
        e.prototype.createClearState = function() {
            return new s(this)
        }
        ,
        e.prototype.createReadState = function() {
            return new u(this)
        }
        ,
        e.prototype.deleteBuffer = function(e) {
            this.gl.deleteBuffer(e)
        }
        ,
        e.prototype.deleteFramebuffer = function(e) {
            this.gl.deleteFramebuffer(e)
        }
        ,
        e.prototype.deleteTexture = function(e) {
            this.gl.deleteTexture(e)
        }
        ,
        n.prototype.getAttribLocation = function(e) {
            return this.attributeLocations[e]
        }
        ,
        i.prototype.setParameter = function(e, t) {
            o(t, this.wgl.parameters[e].defaults) ? this.changedParameters.hasOwnProperty(e) && delete this.changedParameters[e] : this.changedParameters[e] = t
        }
        ,
        i.prototype.clone = function() {
            var e = new this.constructor(this.wgl);
            for (var t in this.changedParameters)
                if (this.changedParameters.hasOwnProperty(t)) {
                    for (var r = this.changedParameters[t], n = [], i = 0; i < r.length; ++i)
                        n.push(r[i]);
                    e.changedParameters[t] = n
                }
            return e
        }
        ,
        a.prototype = Object.create(i.prototype),
        a.prototype.constructor = i,
        a.prototype.bindFramebuffer = function(e) {
            return this.setParameter("framebuffer", [e]),
            this
        }
        ,
        a.prototype.viewport = function(e, t, r, n) {
            return this.setParameter("viewport", [e, t, r, n]),
            this
        }
        ,
        a.prototype.enable = function(e) {
            return e === this.wgl.DEPTH_TEST ? this.setParameter("depthTest", [!0]) : e === this.wgl.BLEND ? this.setParameter("blend", [!0]) : e === this.wgl.CULL_FACE ? this.setParameter("cullFace", [!0]) : e === this.wgl.POLYGON_OFFSET_FILL ? this.setParameter("polygonOffsetFill", [!0]) : e === this.wgl.SCISSOR_TEST && this.setParameter("scissorTest", [!0]),
            this
        }
        ,
        a.prototype.disable = function(e) {
            return e === this.wgl.DEPTH_TEST ? this.setParameter("depthTest", [!1]) : e === this.wgl.BLEND ? this.setParameter("blend", [!1]) : e === this.wgl.CULL_FACE ? this.setParameter("cullFace", [!1]) : e === this.wgl.POLYGON_OFFSET_FILL ? this.setParameter("polygonOffsetFill", [!1]) : e === this.wgl.SCISSOR_TEST && this.setParameter("scissorTest", [!1]),
            this
        }
        ,
        a.prototype.vertexAttribPointer = function(e, t, r, n, i, o, a) {
            return this.setParameter("attributeArray" + t.toString(), [e, r, n, i, o, a]),
            this.instancedExt && this.changedParameters.hasOwnProperty("attributeDivisor" + t.toString()) && this.setParameter("attributeDivisor" + t.toString(), [0]),
            this
        }
        ,
        a.prototype.bindIndexBuffer = function(e) {
            return this.setParameter("indexBuffer", [e]),
            this
        }
        ,
        a.prototype.depthFunc = function(e) {
            return this.setParameter("depthFunc", [e]),
            this
        }
        ,
        a.prototype.frontFace = function(e) {
            return this.setParameter("frontFace", [e]),
            this
        }
        ,
        a.prototype.blendEquation = function(e) {
            return this.blendEquationSeparate(e, e),
            this
        }
        ,
        a.prototype.blendEquationSeparate = function(e, t) {
            return this.setParameter("blendEquation", [e, t]),
            this
        }
        ,
        a.prototype.blendFunc = function(e, t) {
            return this.blendFuncSeparate(e, t, e, t),
            this
        }
        ,
        a.prototype.blendFuncSeparate = function(e, t, r, n) {
            return this.setParameter("blendFunc", [e, t, r, n]),
            this
        }
        ,
        a.prototype.scissor = function(e, t, r, n) {
            return this.setParameter("scissor", [e, t, r, n]),
            this
        }
        ,
        a.prototype.useProgram = function(e) {
            return this.setParameter("program", [e]),
            this
        }
        ,
        a.prototype.bindTexture = function(e, t, r) {
            return this.setParameter("texture" + e.toString(), [t, r]),
            this
        }
        ,
        a.prototype.colorMask = function(e, t, r, n) {
            return this.setParameter("colorMask", [e, t, r, n]),
            this
        }
        ,
        a.prototype.depthMask = function(e) {
            return this.setParameter("depthMask", [e]),
            this
        }
        ,
        a.prototype.polygonOffset = function(e, t) {
            return this.setParameter("polygonOffset", [e, t]),
            this
        }
        ,
        a.prototype.uniformTexture = function(e, t, r, n) {
            return this.uniform1i(e, t),
            this.bindTexture(t, r, n),
            this
        }
        ,
        a.prototype.uniform1i = function(e, t) {
            return this.uniforms[e] = {
                type: "1i",
                value: [t]
            },
            this
        }
        ,
        a.prototype.uniform2i = function(e, t, r) {
            return this.uniforms[e] = {
                type: "2i",
                value: [t, r]
            },
            this
        }
        ,
        a.prototype.uniform3i = function(e, t, r, n) {
            return this.uniforms[e] = {
                type: "3i",
                value: [t, r, n]
            },
            this
        }
        ,
        a.prototype.uniform4i = function(e, t, r, n, i) {
            return this.uniforms[e] = {
                type: "4i",
                value: [t, r, n, i]
            },
            this
        }
        ,
        a.prototype.uniform1f = function(e, t) {
            return this.uniforms[e] = {
                type: "1f",
                value: t
            },
            this
        }
        ,
        a.prototype.uniform2f = function(e, t, r) {
            return this.uniforms[e] = {
                type: "2f",
                value: [t, r]
            },
            this
        }
        ,
        a.prototype.uniform3f = function(e, t, r, n) {
            return this.uniforms[e] = {
                type: "3f",
                value: [t, r, n]
            },
            this
        }
        ,
        a.prototype.uniform4f = function(e, t, r, n, i) {
            return this.uniforms[e] = {
                type: "4f",
                value: [t, r, n, i]
            },
            this
        }
        ,
        a.prototype.uniform1fv = function(e, t) {
            return this.uniforms[e] = {
                type: "1fv",
                value: t
            },
            this
        }
        ,
        a.prototype.uniform2fv = function(e, t) {
            return this.uniforms[e] = {
                type: "2fv",
                value: t
            },
            this
        }
        ,
        a.prototype.uniform3fv = function(e, t) {
            return this.uniforms[e] = {
                type: "3fv",
                value: t
            },
            this
        }
        ,
        a.prototype.uniform4fv = function(e, t) {
            return this.uniforms[e] = {
                type: "4fv",
                value: t
            },
            this
        }
        ,
        a.prototype.uniformMatrix2fv = function(e, t, r) {
            return this.uniforms[e] = {
                type: "matrix2fv",
                value: [t, r]
            },
            this
        }
        ,
        a.prototype.uniformMatrix3fv = function(e, t, r) {
            return this.uniforms[e] = {
                type: "matrix3fv",
                value: [t, r]
            },
            this
        }
        ,
        a.prototype.uniformMatrix4fv = function(e, t, r) {
            return this.uniforms[e] = {
                type: "matrix4fv",
                value: [t, r]
            },
            this
        }
        ,
        s.prototype = Object.create(i.prototype),
        s.prototype.constructor = s,
        s.prototype.bindFramebuffer = function(e) {
            return this.setParameter("framebuffer", [e]),
            this
        }
        ,
        s.prototype.clearColor = function(e, t, r, n) {
            return this.setParameter("clearColor", [e, t, r, n]),
            this
        }
        ,
        s.prototype.clearDepth = function(e) {
            return this.setParameter("clearDepth", [e]),
            this
        }
        ,
        s.prototype.colorMask = function(e, t, r, n) {
            return this.setParameter("colorMask", [e, t, r, n]),
            this
        }
        ,
        s.prototype.depthMask = function(e) {
            return this.setParameter("depthMask", [e]),
            this
        }
        ,
        s.prototype.enable = function(e) {
            return e === this.wgl.SCISSOR_TEST && this.setParameter("scissorTest", [!0]),
            this
        }
        ,
        s.prototype.disable = function(e) {
            return e === this.wgl.SCISSOR_TEST && this.setParameter("scissorTest", [!1]),
            this
        }
        ,
        s.prototype.scissor = function(e, t, r, n) {
            return this.setParameter("scissor", [e, t, r, n]),
            this
        }
        ,
        u.prototype = Object.create(i.prototype),
        u.prototype.constructor = u,
        u.prototype.bindFramebuffer = function(e) {
            return this.setParameter("framebuffer", [e]),
            this
        }
        ,
        e
    }();
    Float32Array.prototype.slice || Object.defineProperty(Float32Array.prototype, "slice", {
        value: Array.prototype.slice
    }),
    BaseMesh.prototype.intersect = function(e, t) {
        return this.rayIntersect(e[0], e[1], e[2], t[0], t[1], t[2])
    }
    ,
    BaseMesh.prototype.update = function(e, t, r, n, i, o, a, s) {
        var u = this.wgl;
        this.step(e[0], e[1], e[2], e[3], t, r, n[0], n[1], n[2], i, o, a[0], a[1], a[2], s[0], s[1], s[2]);
        var l = this.module.HEAPF32.subarray(this.getFacePositionData() >> 2, (this.getFacePositionData() >> 2) + 3 * this.getFaceVertexCount())
          , c = this.module.HEAPF32.subarray(this.getFaceNormalData() >> 2, (this.getFaceNormalData() >> 2) + 3 * this.getFaceVertexCount());
        this.positions = l,
        this.normals = c;
        for (var h = 0; h < this.textureWidth * this.textureHeight; ++h)
            if (h < l.length / 3)
                this.basePositionsData[4 * h + 0] = l[3 * h + 0],
                this.basePositionsData[4 * h + 1] = l[3 * h + 1],
                this.basePositionsData[4 * h + 2] = l[3 * h + 2],
                this.basePositionsData[4 * h + 3] = 0,
                this.baseNormalsData[4 * h + 0] = c[3 * h + 0],
                this.baseNormalsData[4 * h + 1] = c[3 * h + 1],
                this.baseNormalsData[4 * h + 2] = c[3 * h + 2],
                this.baseNormalsData[4 * h + 3] = 0;
            else
                for (var d = 0; d < 4; ++d)
                    this.basePositionsData[4 * h + d] = 0,
                    this.baseNormalsData[4 * h + d] = 0;
        u.texImage2D(u.TEXTURE_2D, this.basePositionsTexture, 0, u.RGBA, this.textureWidth, this.textureHeight, 0, u.RGBA, u.FLOAT, this.basePositionsData),
        u.texImage2D(u.TEXTURE_2D, this.baseNormalsTexture, 0, u.RGBA, this.textureWidth, this.textureHeight, 0, u.RGBA, u.FLOAT, this.baseNormalsData)
    }
    ,
    BaseMesh.prototype.getPosition = function(e) {
        return extractVectorFromArray(this.positions, e)
    }
    ,
    BaseMesh.prototype.getNormal = function(e) {
        return extractVectorFromArray(this.normals, e)
    }
    ,
    BaseMesh.prototype.getRestPosition = function(e) {
        var t = this.baseIndices[3 * e];
        return extractVectorFromArray(this.restBasePositions, t)
    }
    ,
    Vertex.prototype.findTriangle = function(e, t) {
        for (var r = 0; r < this.triangles.length; ++r) {
            var n = this.triangles[r];
            if (n.a === e && n.b === t || n.b === e && n.c === t || n.c === e && n.a === t)
                return n
        }
    }
    ,
    Vertex.prototype.sortTriangles = function(e) {
        var t = []
          , r = this.triangles[0]
          , n = r;
        do {
            t.push(n),
            n.a === e ? n = this.findTriangle(n.b, e) : n.b === e ? n = this.findTriangle(n.c, e) : n.c === e && (n = this.findTriangle(n.a, e))
        } while (n !== r);this.triangles = t;
        for (var i = 0; i < this.triangles.length; ++i) {
            var o = this.triangles[i];
            o.a === e ? this.neighbours.push(o.b) : o.b === e ? this.neighbours.push(o.c) : o.c === e && this.neighbours.push(o.a)
        }
    }
    ;
    var Shaders = {
        "attachmentconstraint.frag": "precision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_positionsTexture;\nuniform sampler2D u_attachmentPositionsTexture;\nuniform sampler2D u_strengthsTexture;\n\nvoid main () {\n    vec3 position = texture2D(u_positionsTexture, v_coordinates).rgb;\n    vec3 attachmentPosition = texture2D(u_attachmentPositionsTexture, v_coordinates).rgb;\n    float strength = texture2D(u_strengthsTexture, v_coordinates).r;\n\n    float RADIUS = 0.008 * strength;\n\n    float dist = distance(position, attachmentPosition);\n\n    if (dist > RADIUS) {\n        position = position + ((dist - RADIUS) * (attachmentPosition - position) / dist);\n    }\n\n    gl_FragColor = vec4(position, 0.0);\n}\n",
        "attachmentpositions.frag": "//this shader computes the attachment location for each wrinkle mesh point by interpolating the base mesh\n\nprecision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_basePositionsTexture;\nuniform sampler2D u_baseNormalsTexture;\nuniform vec2 u_baseTextureResolution;\n\nuniform sampler2D u_wrinkleAssociationsTexture;\nuniform sampler2D u_wrinkleBarycentricCoordinatesTexture;\n\n//use slight offsets to compensate for floating point inaccuracy\nvec2 getBaseTextureCoordinates (float index) {\n    return (vec2(floor(mod((index + 0.5), u_baseTextureResolution.x)), floor((index + 0.5) / u_baseTextureResolution.x)) + 0.5) / u_baseTextureResolution;\n}\n\nvoid main () {\n    vec3 associations = texture2D(u_wrinkleAssociationsTexture, v_coordinates).rgb;\n    vec3 barycentricCoordinates = texture2D(u_wrinkleBarycentricCoordinatesTexture, v_coordinates).rgb;\n\n    float u = barycentricCoordinates.y;\n    float v = barycentricCoordinates.z;\n    float w = barycentricCoordinates.x;\n\n    vec3 p1 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.x)).rgb;\n    vec3 p2 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.y)).rgb;\n    vec3 p3 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.z)).rgb;\n\n    vec3 n1 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.x)).rgb;\n    vec3 n2 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.y)).rgb;\n    vec3 n3 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.z)).rgb;\n\n    vec3 b300 = p1;\n    vec3 b030 = p2;\n    vec3 b003 = p3;\n\n    vec3 b210 = (2.0 * p1 + p2 - dot(p2 - p1, n1) * n1) / 3.0;\n    vec3 b120 = (2.0 * p2 + p1 - dot(p1 - p2, n2) * n2) / 3.0;\n    vec3 b021 = (2.0 * p2 + p3 - dot(p3 - p2, n2) * n2) / 3.0;\n    vec3 b012 = (2.0 * p3 + p2 - dot(p2 - p3, n3) * n3) / 3.0;\n    vec3 b102 = (2.0 * p3 + p1 - dot(p1 - p3, n3) * n3) / 3.0;\n    vec3 b201 = (2.0 * p1 + p3 - dot(p3 - p1, n1) * n1) / 3.0;\n\n    vec3 E = (b210 + b120 + b021 + b012 + b102 + b201) / 6.0;\n    vec3 V = (p1 + p2 + p3) / 3.0;\n\n    vec3 b111 = E + (E - V) / 2.0;\n\n    float u2 = u * u;\n    float u3 = u2 * u;\n\n    float v2 = v * v;\n    float v3 = v2 * v;\n\n    float w2 = w * w;\n    float w3 = w2 * w;\n\n    vec3 position = b300 * w3 + b030 * u3 + b003 * v3\n        + b210 * 3.0 * w2 * u + b120 * 3.0 * w * u2 + b201 * 3.0 * w2 * v\n        + b021 * 3.0 * u2 * v + b102 * 3.0 * w * v2 + b012 * 3.0 * u * v2\n        + b111 * 6.0 * w * u * v;\n\n\n    gl_FragColor = vec4(position, 0.0);\n}\n",
        "background.frag": "precision highp float;\n\nvarying vec2 v_position;\n\nuniform vec2 u_scale;\nuniform vec3 u_color;\n\nvoid main () {\n    vec3 direction = normalize(vec3(\n    \tv_position * u_scale,\n    \t-1.0));\n\n    float factor = 1.0 - pow(max(-direction.z, 0.0), 0.3);\n    vec3 color = (u_color - factor) * 0.6;\n\n    gl_FragColor = vec4(color, 1.0);\n}\n",
        "background.vert": "precision highp float;\n\nattribute vec2 a_position;\n\nvarying vec2 v_position;\n\nvoid main () {\n\tv_position = a_position;\n    gl_Position = vec4(a_position, 0.999, 1.0);\n}\n",
        "composite.frag": "precision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_colorTexture;\n\nvoid main () {\n    gl_FragColor = vec4(texture2D(u_colorTexture, v_coordinates).rgb, 1.0);\n}\n",
        "constraintdistance.frag": "precision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_positionsTexture;\nuniform vec2 u_resolution;\n\nuniform sampler2D u_connectionsTexture;\n\n//use slight offsets to compensate for floating point inaccuracy\nvec2 getBaseTextureCoordinates (float index) {\n    return (vec2(floor(mod((index + 0.5), u_resolution.x)), floor((index + 0.5) / u_resolution.x)) + 0.5) / u_resolution;\n}\n\nvoid main () {\n    vec3 center = texture2D(u_positionsTexture, v_coordinates).rgb;\n    vec4 connections = texture2D(u_connectionsTexture, v_coordinates).rgba;\n\n    vec3 a = texture2D(u_positionsTexture, getBaseTextureCoordinates(connections.x)).rgb;\n    vec3 b = texture2D(u_positionsTexture, getBaseTextureCoordinates(connections.y)).rgb;\n    vec3 c = texture2D(u_positionsTexture, getBaseTextureCoordinates(connections.z)).rgb;\n    vec3 d = texture2D(u_positionsTexture, getBaseTextureCoordinates(connections.w)).rgb;\n\n    float aL = distance(center, a);\n    float bL = distance(center, b);\n    float cL = distance(center, c);\n    float dL = distance(center, d);\n\n\n    gl_FragColor = vec4(aL, bL, cL, dL);\n}\n",
        "copy.frag": "precision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_texture;\n\nvoid main () {\n    gl_FragColor = texture2D(u_texture, v_coordinates);\n}\n",
        "distanceconstraint.frag": "//computes the distance between the vertex and those it's connected to\n\nprecision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_positionsTexture;\nuniform vec2 u_resolution;\n\nuniform sampler2D u_neighboursTextureA;\nuniform sampler2D u_neighboursTextureB;\n\nuniform sampler2D u_distancesTextureA;\nuniform sampler2D u_distancesTextureB;\n\nuniform sampler2D u_fixedTexture;\n\nuniform sampler2D u_strengthsTexture;\n\nuniform int u_respectFixed;\n\n//use slight offsets to compensate for floating point inaccuracy\nvec2 getBaseTextureCoordinates (float index) {\n    return (vec2(floor(mod((index + 0.5), u_resolution.x)), floor((index + 0.5) / u_resolution.x)) + 0.5) / u_resolution;\n}\n\nvec3 getDelta (vec3 center, vec3 other, float restLength) {\n    restLength *= 1.0;\n\n    float dist = distance(center, other);\n\n    vec3 delta = 1.5 * (dist - restLength) * (other - center) / dist;\n\n    return delta;\n}\n\nvoid main () {\n    vec3 center = texture2D(u_positionsTexture, v_coordinates).rgb;\n    float isFixed = texture2D(u_fixedTexture, v_coordinates).r;\n\n    vec4 neighboursA = texture2D(u_neighboursTextureA, v_coordinates).rgba;\n    vec4 neighboursB = texture2D(u_neighboursTextureB, v_coordinates).rgba;\n\n    vec3 a = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.x)).rgb;\n    vec3 b = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.y)).rgb;\n    vec3 c = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.z)).rgb;\n    vec3 d = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.w)).rgb;\n    vec3 e = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursB.x)).rgb;\n    vec3 f = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursB.y)).rgb;\n\n    vec4 distancesA = texture2D(u_distancesTextureA, v_coordinates).rgba;\n    vec4 distancesB = texture2D(u_distancesTextureB, v_coordinates).rgba;\n\n    float aL = distancesA.x;\n    float bL = distancesA.y;\n    float cL = distancesA.z;\n    float dL = distancesA.w;\n    float eL = distancesB.x;\n    float fL = distancesB.y;\n\n\n    vec3 offset = vec3(0.0);\n\n    offset += getDelta(center, a, aL);\n    offset += getDelta(center, b, bL);\n    offset += getDelta(center, c, cL);\n    offset += getDelta(center, d, dL);\n    offset += getDelta(center, e, eL);\n    if (neighboursB.y >= 0.0) offset += getDelta(center, f, fL);\n\n    float count = neighboursB.y >= 0.0 ? 6.0 : 5.0;\n\n    float strength = texture2D(u_strengthsTexture, v_coordinates).r;\n\n    gl_FragColor = vec4(center + strength * offset / count, 0.0);\n\n    if (isFixed > 0.5 && u_respectFixed == 1) gl_FragColor = vec4(center, 0.0); \n\n}\n\n",
        "eye.frag": "//requires lightingcommon.glsl\n\nvarying vec3 v_baseNormal;\n\nuniform float u_pupilNoiseOffset;\nuniform vec3 u_eyePosition;\n\nuniform vec3 u_lookDirection;\n\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n\t\t+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\nvec3 closestPointOnAxis (vec3 base, vec3 direction, vec3 point) {\n    return base + dot(point - base, direction) * direction;\n}\n\nfloat distanceFromAxis (vec3 base, vec3 direction, vec3 point) {\n    return distance(point, closestPointOnAxis(base, direction, point));\n}\n\nvec3 eyeColor (vec3 point) {\n    //closest point on cylinder axis\n    vec3 closestPoint = closestPointOnAxis(u_eyePosition, u_lookDirection, point);\n\n    if (dot(u_lookDirection, v_worldPosition - u_eyePosition) < 0.0) return vec3(1.0);\n\n    vec3 offset = point - closestPoint;\n\n    //find plane of cylinder\n    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), u_lookDirection));\n    vec3 up = cross(u_lookDirection, right);\n\n    //project onto cylinder plane\n    float x = dot(offset, right);\n    float y = dot(offset, up);\n\n    float PUPIL_FREQUENCY = 8.0;\n\n    float theta = mod(atan(y, x) + PI + u_pupilNoiseOffset, 2.0 * PI);\n    float r = 0.025 + snoise(vec2(PUPIL_FREQUENCY * theta / (2.0 * PI), 0.0)) * 0.003;\n\n    return length(vec2(x, y)) < r ? vec3(0.0) : vec3(1.0);\n}\n\n/*\nvec3 eyeColor (vec3 point) {\n    return distanceFromAxis(u_eyePosition, u_lookDirection, point) < 0.03 ? vec3(0.0) : vec3(1.0);\n}\n*/\n\nvoid main () {\n    vec3 normal = normalize(v_normal);\n\n    vec3 albedo = eyeColor(v_worldPosition);\n\n    float roughness = 0.05;\n    float F0 = 0.35;\n\n    vec3 color = shadeSurfaceWithLights(v_worldPosition, normal, albedo, roughness, F0);\n\n    gl_FragColor = vec4(gammaCorrect(color), 1.0);\n}\n",
        "eye.vert": "precision highp float;\n\nattribute vec3 a_position;\nattribute vec3 a_normal;\n\nuniform mat4 u_projectionViewMatrix;\nuniform mat4 u_modelMatrix;\n\nvarying vec3 v_normal;\nvarying vec3 v_baseNormal;\nvarying vec3 v_worldPosition;\n\nvoid main () {\n    v_normal = normalize((u_modelMatrix * vec4(a_normal, 0.0)).xyz);\n    v_baseNormal = v_normal;\n    v_worldPosition = (u_modelMatrix * vec4(a_position, 1.0)).xyz;\n\n    gl_Position = u_projectionViewMatrix * vec4(v_worldPosition, 1.0);\n}\n",
        "eyedepth.frag": "precision highp float;\n\nvoid main () {\n    gl_FragColor = vec4(0.0);\n}\n",
        "eyedepth.vert": "precision highp float;\n\nattribute vec3 a_position;\n\nuniform mat4 u_projectionViewModelMatrix;\n\nvoid main () {\n    gl_Position = u_projectionViewModelMatrix * vec4(a_position, 1.0);\n}\n",
        "fullscreen.vert": "precision highp float;\n\nattribute vec2 a_position;\n\nvarying vec2 v_coordinates;\n\nvoid main () {\n    v_coordinates = a_position * 0.5 + 0.5;\n\n    gl_Position = vec4(a_position, 0.0, 1.0);\n}\n",
        "fxaa.frag": "precision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_input;\n\nuniform vec2 u_resolution;\n\nuniform float u_scale;\n\nconst float FXAA_SPAN_MAX = 8.0;\nconst float FXAA_REDUCE_MUL = 1.0 / 8.0;\nconst float FXAA_REDUCE_MIN = 1.0 / 128.0;\n \nvoid main () {\n    vec2 delta = 1.0 / u_resolution;\n\n    vec3 rgbNW = texture2D(u_input, v_coordinates + vec2(-1.0, -1.0) * delta).rgb;\n    vec3 rgbNE = texture2D(u_input, v_coordinates + vec2(1.0, -1.0) * delta).rgb;\n    vec3 rgbSW = texture2D(u_input, v_coordinates + vec2(-1.0, 1.0) * delta).rgb;\n    vec3 rgbSE = texture2D(u_input, v_coordinates + vec2(1.0, 1.0) * delta).rgb;\n    vec3 rgbM = texture2D(u_input, v_coordinates).rgb;\n\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    vec2 dir = vec2(\n        -((lumaNW + lumaNE) - (lumaSW + lumaSE)),\n        ((lumaNW + lumaSW) - (lumaNE + lumaSE)));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX), dir * rcpDirMin)) * delta.xy;\n\n    vec3 rgbA = 0.5 * (texture2D(u_input, v_coordinates.xy + dir * (1.0 / 3.0 - 0.5)).xyz + texture2D(u_input, v_coordinates.xy + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (texture2D(u_input, v_coordinates.xy + dir * -0.5).xyz + texture2D(u_input, v_coordinates.xy + dir * 0.5).xyz);\n    float lumaB = dot(rgbB, luma);\n    if (lumaB < lumaMin || lumaB > lumaMax) {\n        gl_FragColor = vec4(rgbA, 1.0) * u_scale;\n    } else {\n        gl_FragColor = vec4(rgbB, 1.0) * u_scale;\n    }\n}\n",
        "hair.frag": "uniform sampler2D u_perturbationTexture3D;\nuniform float u_perturbationTextureWidth;\n\nuniform vec3 u_hairAlbedo;\n\nvarying vec3 v_restPosition;\n\n//coordinates are in pixel space\nvec4 texture3D(sampler2D texture, vec3 coordinates, vec3 resolution) {\n    coordinates = mod(coordinates, vec3(resolution));\n\n    //belowZIndex and aboveZIndex don't have the 0.5 offset\n    float belowZIndex = floor(coordinates.z - 0.5);\n    float aboveZIndex = belowZIndex + 1.0;\n\n    //we interpolate the z\n    float fraction = fract(coordinates.z - 0.5);\n\n    vec2 belowCoordinates = vec2(\n        belowZIndex * resolution.x + coordinates.x,\n        coordinates.y) / vec2(resolution.x * resolution.z, resolution.y);\n\n    vec2 aboveCoordinates = vec2(\n        aboveZIndex * resolution.x + coordinates.x,\n        coordinates.y) / vec2(resolution.x * resolution.z, resolution.y);\n\n    return mix(texture2D(texture, belowCoordinates), texture2D(texture, aboveCoordinates), fraction);\n}\n\nvoid main () {\n    vec3 normal = normalize(v_normal);\n\n    vec3 peturbation = texture3D(u_perturbationTexture3D, v_restPosition * 400.0, vec3(u_perturbationTextureWidth)).rgb * 2.0 - 1.0;\n    normal = normalize(v_normal + peturbation * 0.07);\n\n    if (!gl_FrontFacing) {\n        normal *= -1.0;\n    }\n\n    float roughness = 0.5;\n    float F0 = 0.05;\n\n    vec3 color = shadeSurfaceWithLights(v_worldPosition, normal, u_hairAlbedo, roughness, F0);\n\n    gl_FragColor = vec4(gammaCorrect(color), 1.0);\n}\n",
        "hair.vert": "//define DEPTH for depth only\n\nprecision highp float;\n\nattribute vec3 a_associations;\nattribute vec3 a_barycentricCoordinates;\n\n#ifndef DEPTH\nattribute vec3 a_restPosition;\n#endif\n\n#ifndef DEPTH\nuniform mat4 u_projectionViewMatrix;\nuniform mat4 u_modelMatrix;\n#else\nuniform mat4 u_projectionViewModelMatrix;\n#endif\n\nuniform sampler2D u_basePositionsTexture;\nuniform sampler2D u_baseNormalsTexture;\nuniform vec2 u_baseTextureResolution;\n\n#ifndef DEPTH\nvarying vec3 v_normal;\nvarying vec3 v_worldPosition;\nvarying vec3 v_restPosition;\n#endif\n\n//use slight offsets to compensate for floating point inaccuracy\nvec2 getBaseTextureCoordinates (float index) {\n    return (vec2(floor(mod((index + 0.5), u_baseTextureResolution.x)), floor((index + 0.5) / u_baseTextureResolution.x)) + 0.5) / u_baseTextureResolution;\n}\n\nvoid main () {\n    vec3 associations = a_associations;\n    vec3 barycentricCoordinates = a_barycentricCoordinates;\n\n    #ifndef DEPTH\n    v_restPosition = a_restPosition;\n    #endif\n\n    float u = barycentricCoordinates.y;\n    float v = barycentricCoordinates.z;\n    float w = barycentricCoordinates.x;\n\n    vec3 p1 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.x)).rgb;\n    vec3 p2 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.y)).rgb;\n    vec3 p3 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.z)).rgb;\n\n    vec3 n1 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.x)).rgb;\n    vec3 n2 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.y)).rgb;\n    vec3 n3 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.z)).rgb;\n\n    vec3 b300 = p1;\n    vec3 b030 = p2;\n    vec3 b003 = p3;\n\n    vec3 b210 = (2.0 * p1 + p2 - dot(p2 - p1, n1) * n1) / 3.0;\n    vec3 b120 = (2.0 * p2 + p1 - dot(p1 - p2, n2) * n2) / 3.0;\n    vec3 b021 = (2.0 * p2 + p3 - dot(p3 - p2, n2) * n2) / 3.0;\n    vec3 b012 = (2.0 * p3 + p2 - dot(p2 - p3, n3) * n3) / 3.0;\n    vec3 b102 = (2.0 * p3 + p1 - dot(p1 - p3, n3) * n3) / 3.0;\n    vec3 b201 = (2.0 * p1 + p3 - dot(p3 - p1, n1) * n1) / 3.0;\n\n    vec3 E = (b210 + b120 + b021 + b012 + b102 + b201) / 6.0;\n    vec3 V = (p1 + p2 + p3) / 3.0;\n\n    vec3 b111 = E + (E - V) / 2.0;\n\n    float u2 = u * u;\n    float u3 = u2 * u;\n\n    float v2 = v * v;\n    float v3 = v2 * v;\n\n    float w2 = w * w;\n    float w3 = w2 * w;\n\n    vec3 position = b300 * w3 + b030 * u3 + b003 * v3\n        + b210 * 3.0 * w2 * u + b120 * 3.0 * w * u2 + b201 * 3.0 * w2 * v\n        + b021 * 3.0 * u2 * v + b102 * 3.0 * w * v2 + b012 * 3.0 * u * v2\n        + b111 * 6.0 * w * u * v;\n\n\n    #ifndef DEPTH\n\n    vec3 n200 = n1;\n    vec3 n020 = n2;\n    vec3 n002 = n3;\n\n    vec3 n110 = normalize(n1 + n2 - (2.0 * dot(p2 - p1, n1 + n2) / dot(p2 - p1, p2 - p1)) * (p2 - p1));\n    vec3 n011 = normalize(n2 + n3 - (2.0 * dot(p3 - p2, n2 + n3) / dot(p3 - p2, p3 - p2)) * (p3 - p2));\n    vec3 n101 = normalize(n3 + n1 - (2.0 * dot(p1 - p3, n3 + n1) / dot(p1 - p3, p1 - p3)) * (p1 - p3));\n\n    v_normal = normalize(n200 * w2 + n020 * u2 + n002 * v2 + n110 * w * u + n011 * u * v + n101 * w * v);\n    v_normal = normalize(n200 * w + n020 * u + n002 * v);\n\n    v_normal = (u_modelMatrix * vec4(v_normal, 0.0)).xyz;\n    v_worldPosition = (u_modelMatrix * vec4(position, 1.0)).xyz;\n\n    gl_Position = u_projectionViewMatrix * vec4(v_worldPosition, 1.0);\n\n    #else\n\n    gl_Position = u_projectionViewModelMatrix * vec4(position, 1.0);\n\n    #endif\n}\n\n",
        "hairdepth.frag": "precision highp float;\n\nvoid main () {\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n}\n",
        "image.frag": "precision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_image;\nuniform float u_alpha;\n\nvoid main () {\n\tgl_FragColor = texture2D(u_image, v_coordinates) * u_alpha;\n}",
        "image.vert": "precision highp float;\n\nattribute vec2 a_position;\n\nvarying vec2 v_coordinates;\n\nvoid main () {\n\tv_coordinates = a_position * 0.5 + 0.5;\n    gl_Position = vec4(a_position, 0.999, 1.0);\n}\n",
        "lightingcommon.glsl": "precision highp float;\nprecision highp sampler2D;\n\nuniform vec3 u_cameraPosition;\n\nuniform vec3 u_lightPosition0;\nuniform mat4 u_lightProjectionViewMatrix0;\nuniform sampler2D u_shadowDepthTexture0;\nuniform vec2 u_shadowResolution0;\nuniform vec3 u_lightColor0;\nuniform float u_lightNear0;\nuniform float u_lightFar0;\n\nuniform vec3 u_lightPosition1;\nuniform mat4 u_lightProjectionViewMatrix1;\nuniform sampler2D u_shadowDepthTexture1;\nuniform vec2 u_shadowResolution1;\nuniform vec3 u_lightColor1;\nuniform float u_lightNear1;\nuniform float u_lightFar1;\n\nuniform vec3 u_skinAlbedo;\n\nvarying vec3 v_normal;\nvarying vec3 v_worldPosition;\n\nconst float PI = 3.14159265;\n\nfloat square (float x) {\n    return x * x;\n}\n\nfloat fresnel (float F0, float lDotH) {\n    float f = pow(1.0 - lDotH, 5.0);\n\n    return (1.0 - F0) * f + F0;\n}\n\nfloat GGX (float alpha, float nDotH) {\n    float a2 = square(alpha);\n\n    return a2 / (PI * square(square(nDotH) * (a2 - 1.0) + 1.0));\n}\n\nfloat GGGX (float alpha, float nDotL, float nDotV) {\n    float a2 = square(alpha);\n\n    float gl = nDotL + sqrt(a2 + (1.0 - a2) * square(nDotL));\n    float gv = nDotV + sqrt(a2 + (1.0 - a2) * square(nDotV));\n\n    return 1.0 / (gl * gv);\n}\n\nfloat saturate (float x) {\n    return clamp(x, 0.0, 1.0);\n}\n\nfloat specularBRDF (vec3 lightDirection, vec3 eyeDirection, vec3 normal, float roughness, float F0) {\n    vec3 halfVector = normalize(lightDirection + eyeDirection);\n\n    float nDotH = saturate(dot(normal, halfVector));\n    float nDotL = saturate(dot(normal, lightDirection));\n    float nDotV = saturate(dot(normal, eyeDirection));\n    float lDotH = saturate(dot(lightDirection, halfVector));\n\n    float D = GGX(roughness, nDotH);\n    float G = GGGX(roughness, nDotL, nDotV);\n    float F = fresnel(F0, lDotH);\n\n    return D * G * F;\n}\n\nfloat texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n    return step( compare, texture2D( depths, uv ).r );\n}\n\nfloat texture2DShadow( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n    return texture2DCompare(depths, uv, compare);\n}\n\nfloat texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n    const vec2 offset = vec2(0.0, 1.0);\n\n    vec2 texelSize = vec2(1.0) / size;\n    vec2 centroidUV = floor(uv * size + 0.5) / size;\n\n    float lb = texture2DCompare(depths, centroidUV + texelSize * offset.xx, compare );\n    float lt = texture2DCompare(depths, centroidUV + texelSize * offset.xy, compare );\n    float rb = texture2DCompare(depths, centroidUV + texelSize * offset.yx, compare );\n    float rt = texture2DCompare(depths, centroidUV + texelSize * offset.yy, compare );\n\n    vec2 f = fract(uv * size + 0.5);\n\n    float a = mix(lb, lt, f.y);\n    float b = mix(rb, rt, f.y);\n    float c = mix(a, b, f.x);\n\n    return c;\n}\n\nfloat getShadow (vec3 worldPosition, mat4 projectionViewMatrix, sampler2D depthTexture, vec2 resolution) {\n    vec4 lightSpacePosition = projectionViewMatrix * vec4(worldPosition, 1.0);\n    lightSpacePosition /= lightSpacePosition.w;\n    lightSpacePosition = lightSpacePosition * 0.5 + 0.5;\n    vec2 lightSpaceCoordinates = lightSpacePosition.xy;\n\n    <shadow>\n}\n\nfloat linearizeDepth (float depth, float near, float far) {\n    return 2.0 * near * far / (far + near - (2.0 * depth - 1.0) * (far - near)); \n}\n\nvec3 getTransmittedColor (vec3 worldPosition, vec3 normal, vec3 lightDirection, vec3 lightColor, mat4 lightProjectionViewMatrix, sampler2D depthTexture, float lightNear, float lightFar) {\n    vec3 shrunkPosition = worldPosition - normal * 0.01;\n    vec4 lightSpacePosition2 = lightProjectionViewMatrix * vec4(shrunkPosition, 1.0);\n    lightSpacePosition2 /= lightSpacePosition2.w;\n    lightSpacePosition2 = lightSpacePosition2 * 0.5 + 0.5;\n    vec2 lightSpaceCoordinates2 = lightSpacePosition2.xy;\n\n    float lightSample = texture2D(depthTexture, lightSpaceCoordinates2).r;\n    float d = abs(linearizeDepth(lightSample, lightNear, lightFar) - linearizeDepth(lightSpacePosition2.z, lightNear, lightFar)) * 20.0;\n\n    float dd = -d * d;\n    vec3 profile = vec3(0.233, 0.455, 0.649) * exp(dd / 0.0064) +\n                     vec3(0.1,   0.336, 0.344) * exp(dd / 0.0484) +\n                     vec3(0.118, 0.198, 0.0)   * exp(dd / 0.187)  +\n                     vec3(0.113, 0.007, 0.007) * exp(dd / 0.567)  +\n                     vec3(0.358, 0.004, 0.0)   * exp(dd / 1.99)   +\n                     vec3(0.078, 0.0,   0.0)   * exp(dd / 7.41);\n\n    return profile * 1.0 * saturate(0.6 + dot(lightDirection, -normal)) * lightColor;\n}\n\nvec3 shadeSurfaceWithLightWithoutShadow (vec3 worldPosition, vec3 normal, vec3 albedo, float roughness, float F0, vec3 lightPosition, vec3 lightColor, mat4 projectionViewMatrix, sampler2D depthTexture, vec2 depthResolution) {\n    vec3 eyeDirection = normalize(u_cameraPosition - worldPosition);\n    vec3 lightDirection = normalize(lightPosition - worldPosition);\n\n    float diffuse = saturate(dot(lightDirection, normal));\n    float specular = specularBRDF(lightDirection, eyeDirection, normal, roughness, F0);\n\n    vec3 color = (diffuse * 1.0 * albedo + specular * 1.0) * lightColor;\n\n    return color;\n}\n\nvec3 shadeSurfaceWithLight (vec3 worldPosition, vec3 normal, vec3 albedo, float roughness, float F0, vec3 lightPosition, vec3 lightColor, mat4 projectionViewMatrix, sampler2D depthTexture, vec2 depthResolution) {\n    float shadow = getShadow(worldPosition, projectionViewMatrix, depthTexture, depthResolution);\n\n    vec3 color = shadeSurfaceWithLightWithoutShadow(worldPosition, normal, albedo, roughness, F0, lightPosition, lightColor, projectionViewMatrix, depthTexture, depthResolution) * shadow;\n\n    return color;\n}\n\nvec3 shadeSurfaceWithLights (vec3 worldPosition, vec3 normal, vec3 albedo, float roughness, float F0) {\n    vec3 total = shadeSurfaceWithLight(worldPosition, normal, albedo, roughness, F0, u_lightPosition0, u_lightColor0, u_lightProjectionViewMatrix0, u_shadowDepthTexture0, u_shadowResolution0);\n    total += shadeSurfaceWithLight(worldPosition, normal, albedo, roughness, F0, u_lightPosition1, u_lightColor1, u_lightProjectionViewMatrix1, u_shadowDepthTexture1, u_shadowResolution1);\n\n    return total;\n}\n\nvec3 shadeSurfaceWithLightsWithTransmittance (vec3 worldPosition, vec3 normal, vec3 albedo, float roughness, float F0) {\n    vec3 total = shadeSurfaceWithLights(worldPosition, normal, albedo, roughness, F0);    \n\n    total += getTransmittedColor(worldPosition, normal, normalize(u_lightPosition0 - worldPosition), u_lightColor0, u_lightProjectionViewMatrix0, u_shadowDepthTexture0, u_lightNear0, u_lightFar0); \n    total += getTransmittedColor(worldPosition, normal, normalize(u_lightPosition1 - worldPosition), u_lightColor1, u_lightProjectionViewMatrix1, u_shadowDepthTexture1, u_lightNear1, u_lightFar1);\n\n    return total;\n}\n\n\nvec3 shadeSkin (vec3 worldPosition, vec3 normal) {\n    vec3 albedo = u_skinAlbedo;\n    float roughness = 0.3;\n    float F0 = 0.35;\n\n    return shadeSurfaceWithLightsWithTransmittance(worldPosition, normal, albedo, roughness, F0);\n}\n\nvec3 gammaCorrect (vec3 color) {\n    float GAMMA = 2.2;\n    return pow(color, vec3(1.0 / GAMMA));\n}\n",
        "markfixed.frag": "precision highp float;\n\nvoid main () {\n    gl_FragColor = vec4(1.0);\n}\n",
        "markfixed.vert": "precision highp float;\n\nattribute float a_index;\n\nuniform vec2 u_resolution;\n\nvoid main () {\n    float x = mod(a_index, u_resolution.x);\n    float y = floor(a_index / u_resolution.x);\n\n    vec2 coordinates = vec2(x + 0.5, y + 0.5) / u_resolution;\n\n    gl_PointSize = 1.0;\n\n    gl_Position = vec4(coordinates * 2.0 - 1.0, 0.0, 1.0);\n}\n",
        "normals.frag": "//computes the normal for a point on the wrinkle mesh using neighbouring positions\n\nprecision highp float;\n\nvarying vec2 v_coordinates;\n\nuniform sampler2D u_positionsTexture;\nuniform vec2 u_resolution;\n\nuniform sampler2D u_neighboursTextureA;\nuniform sampler2D u_neighboursTextureB;\n\n//use slight offsets to compensate for floating point inaccuracy\nvec2 getBaseTextureCoordinates (float index) {\n    return (vec2(floor(mod((index + 0.5), u_resolution.x)), floor((index + 0.5) / u_resolution.x)) + 0.5) / u_resolution;\n}\n\nvoid main () {\n    vec3 center = texture2D(u_positionsTexture, v_coordinates).rgb;\n\n    vec4 neighboursA = texture2D(u_neighboursTextureA, v_coordinates).rgba;\n    vec4 neighboursB = texture2D(u_neighboursTextureB, v_coordinates).rgba;\n\n    vec3 a = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.x)).rgb;\n    vec3 b = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.y)).rgb;\n    vec3 c = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.z)).rgb;\n    vec3 d = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursA.w)).rgb;\n    vec3 e = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursB.x)).rgb;\n    vec3 f = texture2D(u_positionsTexture, getBaseTextureCoordinates(neighboursB.y)).rgb;\n\n    vec3 normal = vec3(0.0);\n\n    //assumes vertex has either 5 or 6 neighbours\n    normal += cross(a - center, b - center);\n    normal += cross(b - center, c - center);\n    normal += cross(c - center, d - center);\n    normal += cross(d - center, e - center);\n\n    if (neighboursB.y >= 0.0) {\n        normal += cross(e - center, f - center);\n        normal += cross(f - center, a - center);\n    } else {\n        normal += cross(e - center, a - center);\n    }\n    \n    normal = normalize(normal);\n\n    gl_FragColor = vec4(-normal, 0.0);\n}\n",
        "nose.frag": "//needs lightingcommon.glsl\n\nvoid main () {\n    vec3 normal = normalize(v_normal);\n\n    if (!gl_FrontFacing) {\n        normal *= -1.0;\n    }\n\n    vec3 color = shadeSkin(v_worldPosition, normal);\n\n    gl_FragColor = vec4(gammaCorrect(color), 1.0);\n}\n",
        "nose.vert": "precision highp float;\n\nattribute vec3 a_position;\nattribute vec3 a_normal;\n\nuniform mat4 u_projectionViewMatrix;\nuniform mat4 u_modelMatrix;\n\nvarying vec3 v_worldPosition;\nvarying vec3 v_normal;\n\nvoid main () {\n    v_normal = normalize((u_modelMatrix * vec4(a_normal, 0.0)).xyz);\n    v_worldPosition = (u_modelMatrix * vec4(a_position, 1.0)).xyz;\n\n    gl_Position = u_projectionViewMatrix * vec4(v_worldPosition, 1.0);\n}\n",
        "setposition.frag": "precision highp float;\n\nvarying vec3 v_position;\n\nvoid main () {\n    gl_FragColor = vec4(v_position, 0.0);\n}\n",
        "setposition.vert": "precision highp float;\n\nattribute float a_index;\nattribute vec3 a_position;\n\nuniform vec2 u_resolution;\n\nvarying vec3 v_position;\n\n//use slight offsets to compensate for floating point inaccuracy\nvec2 getBaseTextureCoordinates (float index) {\n    return (vec2(floor(mod((index + 0.5), u_resolution.x)), floor((index + 0.5) / u_resolution.x)) + 0.5) / u_resolution;\n}\n\nvoid main () {\n    v_position = a_position;\n\n    gl_PointSize = 1.0;\n\n    vec2 coordinates = getBaseTextureCoordinates(a_index);\n\n    gl_Position = vec4(coordinates * 2.0 - 1.0, 0.0, 1.0);\n}\n",
        "skindepth.frag": "precision highp float;\n\nvoid main () {\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n}\n",
        "skindepth.vert": "precision highp float;\n\nattribute vec2 a_textureCoordinates;\n\nuniform sampler2D u_positionsTexture;\nuniform sampler2D u_normalsTexture;\n\nuniform mat4 u_projectionViewModelMatrix;\n\nvoid main () {\n    vec3 position = texture2D(u_positionsTexture, a_textureCoordinates).rgb;\n    vec3 normal = texture2D(u_normalsTexture, a_textureCoordinates).rgb;\n\n    gl_Position = u_projectionViewModelMatrix * vec4(position, 1.0);\n}\n",
        "staticskin.vert": "//define DEPTH for depth only\n\nprecision highp float;\n\nattribute vec3 a_associations;\nattribute vec3 a_barycentricCoordinates;\n\n#ifndef DEPTH\nattribute float a_mouthiness;\n#endif\n\n#ifndef DEPTH\nuniform mat4 u_projectionViewMatrix;\nuniform mat4 u_modelMatrix;\n#else\nuniform mat4 u_projectionViewModelMatrix;\n#endif\n\nuniform sampler2D u_basePositionsTexture;\nuniform sampler2D u_baseNormalsTexture;\nuniform vec2 u_baseTextureResolution;\n\n#ifndef DEPTH\nvarying vec3 v_normal;\nvarying vec3 v_worldPosition;\nvarying float v_mouthiness;\n#endif\n\n//use slight offsets to compensate for floating point inaccuracy\nvec2 getBaseTextureCoordinates (float index) {\n    return (vec2(floor(mod((index + 0.5), u_baseTextureResolution.x)), floor((index + 0.5) / u_baseTextureResolution.x)) + 0.5) / u_baseTextureResolution;\n}\n\nvoid main () {\n    vec3 associations = a_associations;\n    vec3 barycentricCoordinates = a_barycentricCoordinates;\n\n    #ifndef DEPTH\n    v_mouthiness = a_mouthiness;\n    #endif\n\n    float u = barycentricCoordinates.y;\n    float v = barycentricCoordinates.z;\n    float w = barycentricCoordinates.x;\n\n    vec3 p1 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.x)).rgb;\n    vec3 p2 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.y)).rgb;\n    vec3 p3 = texture2D(u_basePositionsTexture, getBaseTextureCoordinates(associations.z)).rgb;\n\n    vec3 n1 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.x)).rgb;\n    vec3 n2 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.y)).rgb;\n    vec3 n3 = texture2D(u_baseNormalsTexture, getBaseTextureCoordinates(associations.z)).rgb;\n\n    vec3 b300 = p1;\n    vec3 b030 = p2;\n    vec3 b003 = p3;\n\n    vec3 b210 = (2.0 * p1 + p2 - dot(p2 - p1, n1) * n1) / 3.0;\n    vec3 b120 = (2.0 * p2 + p1 - dot(p1 - p2, n2) * n2) / 3.0;\n    vec3 b021 = (2.0 * p2 + p3 - dot(p3 - p2, n2) * n2) / 3.0;\n    vec3 b012 = (2.0 * p3 + p2 - dot(p2 - p3, n3) * n3) / 3.0;\n    vec3 b102 = (2.0 * p3 + p1 - dot(p1 - p3, n3) * n3) / 3.0;\n    vec3 b201 = (2.0 * p1 + p3 - dot(p3 - p1, n1) * n1) / 3.0;\n\n    vec3 E = (b210 + b120 + b021 + b012 + b102 + b201) / 6.0;\n    vec3 V = (p1 + p2 + p3) / 3.0;\n\n    vec3 b111 = E + (E - V) / 2.0;\n\n    float u2 = u * u;\n    float u3 = u2 * u;\n\n    float v2 = v * v;\n    float v3 = v2 * v;\n\n    float w2 = w * w;\n    float w3 = w2 * w;\n\n    vec3 position = b300 * w3 + b030 * u3 + b003 * v3\n        + b210 * 3.0 * w2 * u + b120 * 3.0 * w * u2 + b201 * 3.0 * w2 * v\n        + b021 * 3.0 * u2 * v + b102 * 3.0 * w * v2 + b012 * 3.0 * u * v2\n        + b111 * 6.0 * w * u * v;\n\n\n    #ifndef DEPTH\n\n    vec3 n200 = n1;\n    vec3 n020 = n2;\n    vec3 n002 = n3;\n\n    vec3 n110 = normalize(n1 + n2 - (2.0 * dot(p2 - p1, n1 + n2) / dot(p2 - p1, p2 - p1)) * (p2 - p1));\n    vec3 n011 = normalize(n2 + n3 - (2.0 * dot(p3 - p2, n2 + n3) / dot(p3 - p2, p3 - p2)) * (p3 - p2));\n    vec3 n101 = normalize(n3 + n1 - (2.0 * dot(p1 - p3, n3 + n1) / dot(p1 - p3, p1 - p3)) * (p1 - p3));\n\n    //v_normal = normalize(n200 * w + n020 * u + n002 * v);\n    v_normal = normalize(n200 * w2 + n020 * u2 + n002 * v2 + n110 * w * u + n011 * u * v + n101 * w * v);\n\n    v_normal = (u_modelMatrix * vec4(v_normal, 0.0)).xyz;\n    v_worldPosition = (u_modelMatrix * vec4(position, 1.0)).xyz;\n\n    gl_Position = u_projectionViewMatrix * vec4(v_worldPosition, 1.0);\n\n    #else\n\n    gl_Position = u_projectionViewModelMatrix * vec4(position, 1.0);\n\n    #endif\n}\n",
        "wrinkle.frag": "//needs lightingcommon.glsl\n\nvarying float v_mouthiness;\n\nuniform vec3 u_mouthColor;\n\nvoid main () {\n    vec3 normal = normalize(v_normal);\n    if (!gl_FrontFacing) {\n        normal *= -1.0;\n    }\n\n    vec3 color = shadeSkin(v_worldPosition, normal);\n\n    float mouthFactor = smoothstep(0.15, 0.125, v_mouthiness);\n    if (gl_FrontFacing) {\n        color = mix(u_mouthColor, color, mouthFactor);\n    }\n\n    gl_FragColor = vec4(gammaCorrect(color), mouthFactor);\n}\n",
        "wrinkle.vert": "precision highp float;\n\nattribute vec2 a_textureCoordinates;\n\nuniform sampler2D u_positionsTexture;\nuniform sampler2D u_normalsTexture;\nuniform sampler2D u_mouthinessTexture;\n\nuniform mat4 u_modelMatrix;\nuniform mat4 u_projectionViewMatrix;\n\nvarying vec3 v_normal;\nvarying vec3 v_worldPosition;\nvarying float v_mouthiness;\n\nvoid main () {\n    vec3 position = texture2D(u_positionsTexture, a_textureCoordinates).rgb;\n    vec3 normal = texture2D(u_normalsTexture, a_textureCoordinates).rgb;\n    v_mouthiness = texture2D(u_mouthinessTexture, a_textureCoordinates).r;\n\n    v_normal = normalize((u_modelMatrix * vec4(normal, 0.0)).xyz);\n    v_worldPosition = (u_modelMatrix * vec4(position, 1.0)).xyz;\n\n    gl_Position = u_projectionViewMatrix * vec4(v_worldPosition, 1.0);\n}\n"
    }
      , Utilities = {
        clamp: function(e, t, r) {
            return Math.max(t, Math.min(r, e))
        },
        getMousePosition: function(e, t) {
            var r = t.getBoundingClientRect();
            return {
                x: e.clientX - r.left,
                y: e.clientY - r.top
            }
        }
    }
      , Quaternion = {
        identity: function() {
            return [0, 0, 0, 1]
        },
        makeIdentity: function(e) {
            return e[0] = 0,
            e[1] = 0,
            e[2] = 0,
            e[3] = 1,
            e
        },
        length: function(e) {
            return e[0] * e[0] + e[1] * e[1] + e[2] * e[2] + e[3] * e[3]
        },
        invert: function(e, t) {
            var r = 1 / (t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3]);
            return e[0] = -t[0] * r,
            e[1] = -t[1] * r,
            e[2] = -t[2] * r,
            e[3] = t[3] * r,
            e
        },
        multiply: function(e, t, r) {
            var n = t[0]
              , i = t[1]
              , o = t[2]
              , a = t[3]
              , s = r[0]
              , u = r[1]
              , l = r[2]
              , c = r[3];
            return e[0] = s * n - u * i - l * o - c * a,
            e[1] = s * i + u * n + l * a - c * o,
            e[2] = s * o - u * a + l * n + c * i,
            e[3] = s * a + u * o - l * i + c * n,
            e
        },
        normalize: function(e, t) {
            var r = 1 / Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3]);
            return e[0] = t[0] * r,
            e[1] = t[1] * r,
            e[2] = t[2] * r,
            e[3] = t[3] * r,
            e
        },
        fromAxisAngle: function(e, t, r) {
            return e[0] = t[0] * Math.sin(r / 2),
            e[1] = t[1] * Math.sin(r / 2),
            e[2] = t[2] * Math.sin(r / 2),
            e[3] = Math.cos(r / 2),
            e
        },
        slerp: function(e, t, r, n) {
            var i, o, a, s, u, l = t[0], c = t[1], h = t[2], d = t[3], f = r[0], _ = r[1], m = r[2], p = r[3];
            return (o = l * f + c * _ + h * m + d * p) < 0 && (o = -o,
            f = -f,
            _ = -_,
            m = -m,
            p = -p),
            1 - o > 1e-6 ? (i = Math.acos(o),
            a = Math.sin(i),
            s = Math.sin((1 - n) * i) / a,
            u = Math.sin(n * i) / a) : (s = 1 - n,
            u = n),
            e[0] = s * l + u * f,
            e[1] = s * c + u * _,
            e[2] = s * h + u * m,
            e[3] = s * d + u * p,
            Quaternion.normalize(e, e),
            e
        }
    }
      , Vector3 = {
        set: function(e, t, r, n) {
            return e[0] = t,
            e[1] = r,
            e[2] = n,
            e
        },
        copy: function(e, t) {
            return e[0] = t[0],
            e[1] = t[1],
            e[2] = t[2],
            e
        },
        clone: function(e) {
            return [e[0], e[1], e[2]]
        },
        dot: function(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2]
        },
        scaleAndAdd: function(e, t, r, n) {
            return e[0] = t[0] + r[0] * n,
            e[1] = t[1] + r[1] * n,
            e[2] = t[2] + r[2] * n,
            e
        },
        cross: function(e, t, r) {
            var n = t[0]
              , i = t[1]
              , o = t[2]
              , a = r[0]
              , s = r[1]
              , u = r[2];
            return e[0] = i * u - o * s,
            e[1] = o * a - n * u,
            e[2] = n * s - i * a,
            e
        },
        coneClamp: function(e, t, r, n) {
            if (Vector3.dot(t, r) < -.9999)
                return e;
            var i = Math.acos(Vector3.dot(t, r));
            if (i > n) {
                var o = Vector3.normalize([], Vector3.cross([], r, t))
                  , a = Quaternion.fromAxisAngle([], o, i - n);
                return Vector3.multiplyByQuaternion(e, r, a),
                e
            }
            return e
        },
        rotateTowards: function(e, t, r, n) {
            var i = Math.acos(Vector3.dot(t, r));
            n > i && (n = i);
            var o = Vector3.normalize([], Vector3.cross([], t, r))
              , a = Quaternion.fromAxisAngle([], o, n);
            return Vector3.multiplyByQuaternion(e, t, a),
            e
        },
        add: function(e, t, r) {
            return e[0] = t[0] + r[0],
            e[1] = t[1] + r[1],
            e[2] = t[2] + r[2],
            e
        },
        multiply: function(e, t, r) {
            return e[0] = t[0] * r[0],
            e[1] = t[1] * r[1],
            e[2] = t[2] * r[2],
            e
        },
        addList: function(e, t) {
            e[0] = 0,
            e[1] = 0,
            e[2] = 0;
            for (var r = 0; r < t.length; ++r)
                e[0] += t[r][0],
                e[1] += t[r][1],
                e[2] += t[r][2];
            return e
        },
        subtract: function(e, t, r) {
            return e[0] = t[0] - r[0],
            e[1] = t[1] - r[1],
            e[2] = t[2] - r[2],
            e
        },
        multiplyByScalar: function(e, t, r) {
            return e[0] = t[0] * r,
            e[1] = t[1] * r,
            e[2] = t[2] * r,
            e
        },
        multiplyByQuaternion: function(e, t, r) {
            var n = t[0]
              , i = t[1]
              , o = t[2]
              , a = r[3]
              , s = r[0]
              , u = r[1]
              , l = r[2]
              , c = a * n + u * o - l * i
              , h = a * i + l * n - s * o
              , d = a * o + s * i - u * n
              , f = -s * n - u * i - l * o;
            return e[0] = f * -s + c * a + h * -l - d * -u,
            e[1] = f * -u + h * a + d * -s - c * -l,
            e[2] = f * -l + d * a + c * -u - h * -s,
            e
        },
        normalize: function(e, t) {
            var r = t[0]
              , n = t[1]
              , i = t[2]
              , o = 1 / Math.sqrt(r * r + n * n + i * i);
            return e[0] = r * o,
            e[1] = n * o,
            e[2] = i * o,
            e
        },
        distance: function(e, t) {
            var r = t[0] - e[0]
              , n = t[1] - e[1]
              , i = t[2] - e[2];
            return Math.sqrt(r * r + n * n + i * i)
        },
        distance2: function(e, t) {
            var r = t[0] - e[0]
              , n = t[1] - e[1]
              , i = t[2] - e[2];
            return r * r + n * n + i * i
        },
        length: function(e) {
            return Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2])
        },
        slerp: function(e, t, r, n) {
            var i = Vector3.dot(t, r);
            i = Utilities.clamp(i, 0, 1);
            for (var o = Math.acos(i) * n, a = Vector3.subtract([], r, Vector3.multiplyByScalar([], t, i)), s = 0; s < 3; ++s)
                e[s] = t[s] * Math.cos(o) + a[s] * Math.sin(o);
            return e
        },
        pow: function(e, t, r) {
            return e[0] = Math.pow(t[0], r),
            e[1] = Math.pow(t[1], r),
            e[2] = Math.pow(t[2], r),
            e
        },
        hsvToRGB: function(e, t) {
            var r = t[0]
              , n = t[1]
              , i = t[2]
              , o = 6 * (r %= 1)
              , a = (t = i * n) * (1 - Math.abs(o % 2 - 1))
              , s = Math.floor(o)
              , u = [t, a, 0, 0, a, t][s]
              , l = [a, t, t, a, 0, 0][s]
              , c = [0, 0, a, t, t, a][s]
              , h = i - t;
            return u += h,
            l += h,
            c += h,
            e[0] = u,
            e[1] = l,
            e[2] = c,
            e
        },
        rgbToHSV: function(e, t) {
            var r, n, i, o, a, s = t[0], u = t[1], l = t[2], c = Math.max(s, u, l), h = c - Math.min(s, u, l), d = function(e) {
                return (c - e) / 6 / h + .5
            };
            return 0 == h ? o = a = 0 : (a = h / c,
            r = d(s),
            n = d(u),
            i = d(l),
            s === c ? o = i - n : u === c ? o = 1 / 3 + r - i : l === c && (o = 2 / 3 + n - r),
            o < 0 ? o += 1 : o > 1 && (o -= 1)),
            e[0] = o,
            e[1] = a,
            e[2] = c,
            e
        }
    };
    MouthRing.prototype.setBasePositions = function(e, t, r) {
        for (var n = [0, 0, 0], i = .03 * -smoothstep(0, .2, this.mouthiness), o = 0; o < this.mouthPoints.length; ++o) {
            for (var a = this.mouthPoints[o].baseAssociation, s = e[a.baseTriangleIndex].a, u = e[a.baseTriangleIndex].b, l = e[a.baseTriangleIndex].c, c = a.barycentricCoordinates[0], h = a.barycentricCoordinates[1], d = a.barycentricCoordinates[2], f = 0; f < 3; ++f)
                n[f] = c * r[3 * s + f] + h * r[3 * u + f] + d * r[3 * l + f];
            Vector3.normalize(n, n);
            for (f = 0; f < 3; ++f) {
                var _ = c * t[3 * s + f] + h * t[3 * u + f] + d * t[3 * l + f];
                this.positions[3 * o + f] = _ + n[f] * i
            }
        }
    }
    ,
    MouthRing.prototype.update = function(e, t, r) {
        if (this.setBasePositions(e, t, r),
        1 !== this.mouthPoints.length)
            for (var n = 0; n < this.smoothingIterations; ++n) {
                for (var i = 0; i < this.mouthPoints.length; ++i)
                    for (var o = mod(i - 1, this.mouthPoints.length), a = mod(i + 1, this.mouthPoints.length), s = 0; s < 3; ++s) {
                        var u = this.positions[3 * o + s]
                          , l = this.positions[3 * a + s]
                          , c = this.positions[3 * i + s]
                          , h = .5 * (l - c) + .5 * (u - c);
                        this.positionsTemp[3 * i + s] = this.positions[3 * i + s] + .5 * h
                    }
                var d = this.positions;
                this.positions = this.positionsTemp,
                this.positionsTemp = d
            }
    }
    ,
    WrinkleSimulator.prototype.createMesh = function(e, t, r, n, i) {
        var o = this.wgl;
        0 === e ? this.wrinkleMeshes[0] = new WrinkleMesh(o,1,t,t.baseIndices,t.wrinkleStrengths,t.mouthinesses,this.wireframe,3) : 1 === e && (this.wrinkleMeshes[1] = new WrinkleMesh(o,2,t,t.baseIndices,t.wrinkleStrengths,t.mouthinesses,this.wireframe,5))
    }
    ,
    WrinkleSimulator.prototype.getWrinkleMesh = function(e) {
        return this.wrinkleMeshes[e]
    }
    ,
    WrinkleSimulator.prototype.computeAttachmentPositions = function(e, t, r, n, i, o, a, s) {
        var u = this.wgl;
        u.framebufferTexture2D(this.framebuffer, u.FRAMEBUFFER, u.COLOR_ATTACHMENT0, u.TEXTURE_2D, t, 0);
        var l = u.createDrawState().useProgram(this.attachmentPositionsProgram).bindFramebuffer(this.framebuffer).viewport(0, 0, e.textureWidth, e.textureHeight).uniformTexture("u_basePositionsTexture", 0, u.TEXTURE_2D, i).uniformTexture("u_baseNormalsTexture", 1, u.TEXTURE_2D, o).uniformTexture("u_wrinkleAssociationsTexture", 2, u.TEXTURE_2D, e.wrinkleAssociationTexture).uniformTexture("u_wrinkleBarycentricCoordinatesTexture", 3, u.TEXTURE_2D, e.wrinkleBarycentricCoordinatesTexture).uniform2f("u_baseTextureResolution", r, n).vertexAttribPointer(this.quadVertexBuffer, 0, 2, u.FLOAT, !1, 0, 0);
        u.drawArrays(l, u.TRIANGLE_STRIP, 0, 4);
        for (var c = [], h = [], d = e.mouth, f = 0; f < d.mouthRings.length; ++f) {
            var _ = d.mouthRings[f];
            _.update(e.rawMesh.baseTriangles, a, s);
            for (var m = 0; m < _.mouthPoints.length; ++m) {
                var p = _.mouthPoints[m];
                c.push(p.wrinkleIndex),
                h.push(_.positions[3 * m + 0]),
                h.push(_.positions[3 * m + 1]),
                h.push(_.positions[3 * m + 2])
            }
        }
        u.bufferData(this.mouthIndicesBuffer, u.ARRAY_BUFFER, new Float32Array(c), u.STATIC_DRAW),
        u.bufferData(this.mouthPositionsBuffer, u.ARRAY_BUFFER, new Float32Array(h), u.STATIC_DRAW);
        var g = u.createDrawState().useProgram(this.setPositionProgram).bindFramebuffer(this.framebuffer).viewport(0, 0, e.textureWidth, e.textureHeight).uniform2f("u_resolution", e.textureWidth, e.textureHeight).vertexAttribPointer(this.mouthIndicesBuffer, 0, 1, u.FLOAT, !1, 0, 0).vertexAttribPointer(this.mouthPositionsBuffer, 1, 3, u.FLOAT, !1, 0, 0);
        u.drawArrays(g, u.POINTS, 0, c.length)
    }
    ,
    WrinkleSimulator.prototype.computeConstraintDistance = function(e, t, r) {
        var n = this.wgl;
        n.framebufferTexture2D(this.framebuffer, n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, r, 0);
        var i = n.createDrawState().useProgram(this.constraintDistanceProgram).bindFramebuffer(this.framebuffer).viewport(0, 0, e.textureWidth, e.textureHeight).uniformTexture("u_positionsTexture", 0, n.TEXTURE_2D, e.attachmentPositionsTexture).uniformTexture("u_connectionsTexture", 1, n.TEXTURE_2D, t).uniform2f("u_resolution", e.textureWidth, e.textureHeight).vertexAttribPointer(this.quadVertexBuffer, 0, 2, n.FLOAT, !1, 0, 0);
        n.drawArrays(i, n.TRIANGLE_STRIP, 0, 4)
    }
    ,
    WrinkleSimulator.prototype.update = function(e, t, r, n, i, o, a, s, u) {
        function l(e, t, r, n, i) {
            c.framebufferTexture2D(this.framebuffer, c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, h.positionsTextureTemp, 0);
            var o = c.createDrawState().useProgram(this.distanceConstraintProgram).bindFramebuffer(this.framebuffer).viewport(0, 0, h.textureWidth, h.textureHeight).uniformTexture("u_positionsTexture", 0, c.TEXTURE_2D, h.positionsTexture).uniformTexture("u_neighboursTextureA", 1, c.TEXTURE_2D, e).uniformTexture("u_neighboursTextureB", 2, c.TEXTURE_2D, t).uniformTexture("u_distancesTextureA", 3, c.TEXTURE_2D, r).uniformTexture("u_distancesTextureB", 4, c.TEXTURE_2D, n).uniformTexture("u_fixedTexture", 5, c.TEXTURE_2D, h.fixedTexture).uniformTexture("u_strengthsTexture", 6, c.TEXTURE_2D, h.wrinkleStrengthTexture).uniform2f("u_resolution", h.textureWidth, h.textureHeight).uniform1i("u_respectFixed", i ? 1 : 0).vertexAttribPointer(this.quadVertexBuffer, 0, 2, c.FLOAT, !1, 0, 0);
            c.drawArrays(o, c.TRIANGLE_STRIP, 0, 4),
            swap(h, "positionsTexture", "positionsTextureTemp")
        }
        var c = this.wgl
          , h = this.getWrinkleMesh(u);
        if (!this.initialized) {
            for (var d in this.wrinkleMeshes) {
                h = this.wrinkleMeshes[d];
                this.computeAttachmentPositions(h, h.positionsTexture, e, t, r, n, i, o),
                this.computeAttachmentPositions(h, h.attachmentPositionsTexture, e, t, r, n, i, o),
                this.computeConstraintDistance(h, h.neighboursTextureA, h.neighboursDistancesTextureA),
                this.computeConstraintDistance(h, h.neighboursTextureB, h.neighboursDistancesTextureB),
                this.computeConstraintDistance(h, h.oppositesTextureA, h.oppositesDistancesTextureA),
                this.computeConstraintDistance(h, h.oppositesTextureB, h.oppositesDistancesTextureB)
            }
            this.initialized = !0
        }
        if (this.computeAttachmentPositions(h, h.attachmentPositionsTexture, e, t, r, n, i, o),
        a) {
            var f = new Float32Array(h.rawMesh.baseTriangles[s].wrinkleIndices);
            c.bufferData(this.markBuffer, c.ARRAY_BUFFER, f, c.STATIC_DRAW),
            c.framebufferTexture2D(this.framebuffer, c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, h.fixedTexture, 0),
            c.clear(c.createClearState().bindFramebuffer(this.framebuffer), c.COLOR_BUFFER_BIT);
            var _ = c.createDrawState().useProgram(this.markFixedProgram).bindFramebuffer(this.framebuffer).viewport(0, 0, h.textureWidth, h.textureHeight).uniform2f("u_resolution", h.textureWidth, h.textureHeight).vertexAttribPointer(this.markBuffer, 0, 1, c.FLOAT, !1, 0, 0);
            c.drawArrays(_, c.POINTS, 0, f.length)
        }
        l = l.bind(this);
        for (d = 0; d < 15; ++d) {
            c.framebufferTexture2D(this.framebuffer, c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, h.positionsTextureTemp, 0);
            var m = c.createDrawState().useProgram(this.attachmentConstraintProgram).bindFramebuffer(this.framebuffer).viewport(0, 0, h.textureWidth, h.textureHeight).uniformTexture("u_positionsTexture", 0, c.TEXTURE_2D, h.positionsTexture).uniformTexture("u_attachmentPositionsTexture", 1, c.TEXTURE_2D, h.attachmentPositionsTexture).uniformTexture("u_strengthsTexture", 2, c.TEXTURE_2D, h.wrinkleStrengthTexture).uniform2f("u_resolution", h.textureWidth, h.textureHeight).vertexAttribPointer(this.quadVertexBuffer, 0, 2, c.FLOAT, !1, 0, 0);
            0 === d && (c.drawArrays(m, c.TRIANGLE_STRIP, 0, 4),
            swap(h, "positionsTexture", "positionsTextureTemp"));
            var p = d < 14;
            l(h.neighboursTextureA, h.neighboursTextureB, h.neighboursDistancesTextureA, h.neighboursDistancesTextureB, p),
            l(h.oppositesTextureA, h.oppositesTextureB, h.oppositesDistancesTextureA, h.oppositesDistancesTextureB, p)
        }
        c.framebufferTexture2D(this.framebuffer, c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, h.normalsTexture, 0);
        var g = c.createDrawState().useProgram(this.normalsProgram).bindFramebuffer(this.framebuffer).viewport(0, 0, h.textureWidth, h.textureHeight).uniformTexture("u_positionsTexture", 0, c.TEXTURE_2D, h.positionsTexture).uniformTexture("u_neighboursTextureA", 1, c.TEXTURE_2D, h.neighboursTextureA).uniformTexture("u_neighboursTextureB", 2, c.TEXTURE_2D, h.neighboursTextureB).uniform2f("u_resolution", h.textureWidth, h.textureHeight).vertexAttribPointer(this.quadVertexBuffer, 0, 2, c.FLOAT, !1, 0, 0);
        c.drawArrays(g, c.TRIANGLE_STRIP, 0, 4)
    }
    ;
    var Matrix4 = {
        set: function(e, t, r, n, i, o, a, s, u, l, c, h, d, f, _, m, p) {
            e[0] = t,
            e[1] = r,
            e[2] = n,
            e[3] = i,
            e[4] = o,
            e[5] = a,
            e[6] = s,
            e[7] = u,
            e[8] = l,
            e[9] = c,
            e[10] = h,
            e[11] = d,
            e[12] = f,
            e[13] = _,
            e[14] = m,
            e[15] = p
        },
        copy: function(e, t) {
            for (var r = 0; r < 16; r++)
                e[r] = t[r]
        },
        makeIdentity: function(e) {
            return e[0] = 1,
            e[1] = 0,
            e[2] = 0,
            e[3] = 0,
            e[4] = 0,
            e[5] = 1,
            e[6] = 0,
            e[7] = 0,
            e[8] = 0,
            e[9] = 0,
            e[10] = 1,
            e[11] = 0,
            e[12] = 0,
            e[13] = 0,
            e[14] = 0,
            e[15] = 1,
            e
        },
        makeTranslation: function(e, t, r, n) {
            return Matrix4.makeIdentity(e),
            e[12] = t,
            e[13] = r,
            e[14] = n,
            e
        },
        makeXRotation: function(e, t) {
            return e[0] = 1,
            e[1] = 0,
            e[2] = 0,
            e[3] = 0,
            e[4] = 0,
            e[5] = Math.cos(t),
            e[6] = Math.sin(t),
            e[7] = 0,
            e[8] = 0,
            e[9] = -Math.sin(t),
            e[10] = Math.cos(t),
            e[11] = 0,
            e[12] = 0,
            e[13] = 0,
            e[14] = 0,
            e[15] = 1,
            e
        },
        makeYRotation: function(e, t) {
            return e[0] = Math.cos(t),
            e[1] = 0,
            e[2] = -Math.sin(t),
            e[3] = 0,
            e[4] = 0,
            e[5] = 1,
            e[6] = 0,
            e[7] = 0,
            e[8] = Math.sin(t),
            e[9] = 0,
            e[10] = Math.cos(t),
            e[11] = 0,
            e[12] = 0,
            e[13] = 0,
            e[14] = 0,
            e[15] = 1,
            e
        },
        transformPosition: function(e, t, r) {
            var n = t[0]
              , i = t[1]
              , o = t[2];
            return e[0] = r[0] * n + r[4] * i + r[8] * o + r[12],
            e[1] = r[1] * n + r[5] * i + r[9] * o + r[13],
            e[2] = r[2] * n + r[6] * i + r[10] * o + r[14],
            e[3] = r[3] * n + r[7] * i + r[11] * o + r[15],
            e
        },
        transformDirection: function(e, t, r) {
            var n = t[0]
              , i = t[1]
              , o = t[2];
            return e[0] = r[0] * n + r[4] * i + r[8] * o,
            e[1] = r[1] * n + r[5] * i + r[9] * o,
            e[2] = r[2] * n + r[6] * i + r[10] * o,
            e[3] = r[3] * n + r[7] * i + r[11] * o,
            e
        },
        multiplyVector: function(e, t, r) {
            var n = r[0]
              , i = r[1]
              , o = r[2]
              , a = r[3];
            return e[0] = t[0] * n + t[4] * i + t[8] * o + t[12] * a,
            e[1] = t[1] * n + t[5] * i + t[9] * o + t[13] * a,
            e[2] = t[2] * n + t[6] * i + t[10] * o + t[14] * a,
            e[3] = t[3] * n + t[7] * i + t[11] * o + t[15] * a,
            e
        },
        premultiply: function(e, t, r) {
            var n = r[0]
              , i = r[4]
              , o = r[8]
              , a = r[12]
              , s = r[1]
              , u = r[5]
              , l = r[9]
              , c = r[13]
              , h = r[2]
              , d = r[6]
              , f = r[10]
              , _ = r[14]
              , m = r[3]
              , p = r[7]
              , g = r[11]
              , T = r[15]
              , E = t[0]
              , v = t[1]
              , A = t[2]
              , M = t[3];
            return e[0] = n * E + i * v + o * A + a * M,
            e[1] = s * E + u * v + l * A + c * M,
            e[2] = h * E + d * v + f * A + _ * M,
            e[3] = m * E + p * v + g * A + T * M,
            E = t[4],
            v = t[5],
            A = t[6],
            M = t[7],
            e[4] = n * E + i * v + o * A + a * M,
            e[5] = s * E + u * v + l * A + c * M,
            e[6] = h * E + d * v + f * A + _ * M,
            e[7] = m * E + p * v + g * A + T * M,
            E = t[8],
            v = t[9],
            A = t[10],
            M = t[11],
            e[8] = n * E + i * v + o * A + a * M,
            e[9] = s * E + u * v + l * A + c * M,
            e[10] = h * E + d * v + f * A + _ * M,
            e[11] = m * E + p * v + g * A + T * M,
            E = t[12],
            v = t[13],
            A = t[14],
            M = t[15],
            e[12] = n * E + i * v + o * A + a * M,
            e[13] = s * E + u * v + l * A + c * M,
            e[14] = h * E + d * v + f * A + _ * M,
            e[15] = m * E + p * v + g * A + T * M,
            e
        },
        transpose: function(e, t) {
            if (e === t) {
                var r = t[1]
                  , n = t[2]
                  , i = t[3]
                  , o = t[6]
                  , a = t[7]
                  , s = t[11];
                t[1] = t[4],
                t[4] = r,
                t[2] = t[8],
                t[8] = n,
                t[3] = t[12],
                t[12] = i,
                t[6] = t[9],
                t[9] = o,
                t[7] = t[13],
                t[13] = a,
                t[11] = t[14],
                t[14] = s
            } else
                e[0] = t[0],
                e[1] = t[4],
                e[2] = t[8],
                e[3] = t[12],
                e[4] = t[1],
                e[5] = t[5],
                e[6] = t[9],
                e[7] = t[13],
                e[8] = t[2],
                e[9] = t[6],
                e[10] = t[10],
                e[11] = t[14],
                e[12] = t[3],
                e[13] = t[7],
                e[14] = t[11],
                e[15] = t[15]
        },
        invert: function(e, t) {
            var r = t[0]
              , n = t[4]
              , i = t[8]
              , o = t[12]
              , a = t[1]
              , s = t[5]
              , u = t[9]
              , l = t[13]
              , c = t[2]
              , h = t[6]
              , d = t[10]
              , f = t[14]
              , _ = t[3]
              , m = t[7]
              , p = t[11]
              , g = t[15]
              , T = d * g
              , E = f * p
              , v = h * g
              , A = f * m
              , M = h * p
              , x = d * m
              , b = c * g
              , y = f * _
              , R = c * p
              , S = d * _
              , P = c * m
              , C = h * _
              , D = i * l
              , I = o * u
              , w = n * l
              , N = o * s
              , F = n * u
              , L = i * s
              , O = r * l
              , B = o * a
              , U = r * u
              , H = i * a
              , k = r * s
              , V = n * a
              , W = T * s + A * u + M * l - (E * s + v * u + x * l)
              , G = E * a + b * u + S * l - (T * a + y * u + R * l)
              , X = v * a + y * s + P * l - (A * a + b * s + C * l)
              , z = x * a + R * s + C * u - (M * a + S * s + P * u)
              , Y = 1 / (r * W + n * G + i * X + o * z);
            return e[0] = Y * W,
            e[1] = Y * G,
            e[2] = Y * X,
            e[3] = Y * z,
            e[4] = Y * (E * n + v * i + x * o - (T * n + A * i + M * o)),
            e[5] = Y * (T * r + y * i + R * o - (E * r + b * i + S * o)),
            e[6] = Y * (A * r + b * n + C * o - (v * r + y * n + P * o)),
            e[7] = Y * (M * r + S * n + P * i - (x * r + R * n + C * i)),
            e[8] = Y * (D * m + N * p + F * g - (I * m + w * p + L * g)),
            e[9] = Y * (I * _ + O * p + H * g - (D * _ + B * p + U * g)),
            e[10] = Y * (w * _ + B * m + k * g - (N * _ + O * m + V * g)),
            e[11] = Y * (L * _ + U * m + V * p - (F * _ + H * m + k * p)),
            e[12] = Y * (w * d + L * f + I * h - (F * f + D * h + N * d)),
            e[13] = Y * (U * f + D * c + B * d - (O * d + H * f + I * c)),
            e[14] = Y * (O * h + V * f + N * c - (k * f + w * c + B * h)),
            e[15] = Y * (k * d + F * c + H * h - (U * h + V * d + L * c)),
            e
        },
        fromQuaternion: function(e, t) {
            var r = t[3]
              , n = t[0]
              , i = t[1]
              , o = t[2];
            return e[0] = 1 - 2 * i * i - 2 * o * o,
            e[1] = 2 * n * i + 2 * r * o,
            e[2] = 2 * n * o - 2 * r * i,
            e[3] = 0,
            e[4] = 2 * n * i - 2 * r * o,
            e[5] = 1 - 2 * n * n - 2 * o * o,
            e[6] = 2 * i * o + 2 * r * n,
            e[7] = 0,
            e[8] = 2 * n * o + 2 * r * i,
            e[9] = 2 * i * o - 2 * r * n,
            e[10] = 1 - 2 * n * n - 2 * i * i,
            e[11] = 0,
            e[12] = 0,
            e[13] = 0,
            e[14] = 0,
            e[15] = 1,
            e
        },
        makePerspective: function(e, t, r, n, i) {
            var o = 1 / Math.tan(t / 2)
              , a = 1 / (n - i);
            return e[0] = o / r,
            e[1] = 0,
            e[2] = 0,
            e[3] = 0,
            e[4] = 0,
            e[5] = o,
            e[6] = 0,
            e[7] = 0,
            e[8] = 0,
            e[9] = 0,
            e[10] = (i + n) * a,
            e[11] = -1,
            e[12] = 0,
            e[13] = 0,
            e[14] = 2 * i * n * a,
            e[15] = 0,
            e
        },
        makePerspectiveHorizontal: function(e, t, r, n, i) {
            var o = 1 / Math.tan(t / 2)
              , a = 1 / (n - i);
            return e[0] = o,
            e[1] = 0,
            e[2] = 0,
            e[3] = 0,
            e[4] = 0,
            e[5] = o * r,
            e[6] = 0,
            e[7] = 0,
            e[8] = 0,
            e[9] = 0,
            e[10] = (i + n) * a,
            e[11] = -1,
            e[12] = 0,
            e[13] = 0,
            e[14] = 2 * i * n * a,
            e[15] = 0,
            e
        },
        makeLookAt: function(e, t, r, n) {
            var i = t[0] - r[0]
              , o = t[1] - r[1]
              , a = t[2] - r[2]
              , s = Math.sqrt(i * i + o * o + a * a);
            i /= s,
            o /= s,
            a /= s;
            var u = n[2] * o - n[1] * a
              , l = n[0] * a - n[2] * i
              , c = n[1] * i - n[0] * o
              , h = Math.sqrt(u * u + l * l + c * c)
              , d = o * (c /= h) - a * (l /= h)
              , f = a * (u /= h) - i * c
              , _ = i * l - o * u
              , m = Math.sqrt(d * d + f * f + _ * _);
            return d /= m,
            f /= m,
            _ /= m,
            e[0] = u,
            e[1] = l,
            e[2] = c,
            e[3] = 0,
            e[4] = d,
            e[5] = f,
            e[6] = _,
            e[7] = 0,
            e[8] = i,
            e[9] = o,
            e[10] = a,
            e[11] = 0,
            e[12] = -(u * t[0] + l * t[1] + c * t[2]),
            e[13] = -(d * t[0] + f * t[1] + _ * t[2]),
            e[14] = -(i * t[0] + o * t[1] + a * t[2]),
            e[15] = 1,
            e
        },
        makeOrthographic: function(e, t, r, n, i, o, a) {
            return e[0] = 2 / (r - t),
            e[1] = 0,
            e[2] = 0,
            e[3] = 0,
            e[4] = 0,
            e[5] = 2 / (i - n),
            e[6] = 0,
            e[7] = 0,
            e[8] = 0,
            e[9] = 0,
            e[10] = -2 / (a - o),
            e[11] = 0,
            e[12] = -(r + t) / (r - t),
            e[13] = -(i + n) / (i - n),
            e[14] = -(a + o) / (a - o),
            e[15] = 1,
            e
        }
    };
    Light.prototype.recomputeViewMatrix = function() {
        this.viewMatrix = Matrix4.makeIdentity(new Float32Array(16), new Float32Array(16));
        var e = Matrix4.makeXRotation(new Float32Array(16), this.elevation)
          , t = Matrix4.makeYRotation(new Float32Array(16), this.azimuth)
          , r = Matrix4.makeTranslation(new Float32Array(16), 0, 0, -this.distance);
        Matrix4.premultiply(this.viewMatrix, this.viewMatrix, t),
        Matrix4.premultiply(this.viewMatrix, this.viewMatrix, e),
        Matrix4.premultiply(this.viewMatrix, this.viewMatrix, r)
    }
    ,
    Light.prototype.getPosition = function() {
        return [this.distance * Math.sin(Math.PI / 2 - this.elevation) * Math.sin(-this.azimuth), this.distance * Math.cos(Math.PI / 2 - this.elevation), this.distance * Math.sin(Math.PI / 2 - this.elevation) * Math.cos(-this.azimuth)]
    }
    ,
    ShadowRenderer.prototype.renderForLight = function(e, t, r, n, i, o, a, s, u, l, c, h, d) {
        function f(e) {
            var t = _.createDrawState().bindFramebuffer(this.framebuffer).enable(_.DEPTH_TEST).viewport(0, 0, h.shadowMapWidth, h.shadowMapWidth).depthMask(!0).colorMask(!1, !1, !1, !1).uniformMatrix4fv("u_projectionViewModelMatrix", !1, m).vertexAttribPointer(e.positionsBuffer, 0, 3, _.FLOAT, !1, 0, 0).bindIndexBuffer(e.indexBuffer).useProgram(this.eyeDepthProgram);
            _.drawElements(t, _.TRIANGLES, e.indicesCount, _.UNSIGNED_SHORT, 0)
        }
        var _ = this.wgl;
        _.framebufferTexture2D(this.framebuffer, _.FRAMEBUFFER, _.COLOR_ATTACHMENT0, _.TEXTURE_2D, h.depthColorTexture, 0),
        _.framebufferTexture2D(this.framebuffer, _.FRAMEBUFFER, _.DEPTH_ATTACHMENT, _.TEXTURE_2D, h.depthTexture, 0),
        _.clear(_.createClearState().bindFramebuffer(this.framebuffer), _.COLOR_BUFFER_BIT | _.DEPTH_BUFFER_BIT);
        var m = Matrix4.premultiply(new Float32Array(16), e, h.projectionViewMatrix);
        if (i) {
            var p = _.createDrawState().bindFramebuffer(this.framebuffer).enable(_.DEPTH_TEST).viewport(0, 0, h.shadowMapWidth, h.shadowMapWidth).depthMask(!0).colorMask(!1, !1, !1, !1).uniformMatrix4fv("u_projectionViewModelMatrix", !1, m).uniformTexture("u_basePositionsTexture", 2, _.TEXTURE_2D, t.basePositionsTexture).uniformTexture("u_baseNormalsTexture", 3, _.TEXTURE_2D, t.baseNormalsTexture).uniform2f("u_baseTextureResolution", t.textureWidth, t.textureHeight).vertexAttribPointer(n.associationsBuffer, this.staticSkinDepthProgram.getAttribLocation("a_associations"), 3, _.FLOAT, !1, 0, 0).vertexAttribPointer(n.barycentricCoordinatesBuffer, this.staticSkinDepthProgram.getAttribLocation("a_barycentricCoordinates"), 3, _.FLOAT, !1, 0, 0).bindIndexBuffer(n.indexBuffer).useProgram(this.staticSkinDepthProgram);
            _.drawElements(p, _.TRIANGLES, n.indexCount, _.UNSIGNED_SHORT, 0)
        } else {
            var g = r.getWrinkleMesh(d)
              , T = _.createDrawState().bindFramebuffer(this.framebuffer).viewport(0, 0, h.shadowMapWidth, h.shadowMapWidth).enable(_.DEPTH_TEST).depthMask(!0).colorMask(!1, !1, !1, !1).vertexAttribPointer(g.vertexBuffer, 0, 2, _.FLOAT, _.FALSE, 0, 0).bindIndexBuffer(g.indexBuffer).uniformMatrix4fv("u_projectionViewModelMatrix", !1, m).uniformTexture("u_positionsTexture", 0, _.TEXTURE_2D, g.positionsTexture).uniformTexture("u_normalsTexture", 1, _.TEXTURE_2D, g.normalsTexture).useProgram(this.skinDepthProgram);
            _.drawElements(T, g.wireframe ? _.LINES : _.TRIANGLES, g.wrinkleIndexCount, _.UNSIGNED_SHORT, 0)
        }
        (f = f.bind(this))(o),
        f(a);
        var E = function(e) {
            var t = _.createDrawState().bindFramebuffer(this.framebuffer).enable(_.DEPTH_TEST).viewport(0, 0, h.shadowMapWidth, h.shadowMapWidth).depthMask(!0).colorMask(!1, !1, !1, !1).uniformMatrix4fv("u_projectionViewModelMatrix", !1, m).vertexAttribPointer(e.positionsBuffer, 0, 3, _.FLOAT, !1, 0, 0).bindIndexBuffer(e.indexBuffer).useProgram(this.eyeDepthProgram);
            _.drawElements(t, _.TRIANGLES, e.indicesCount, _.UNSIGNED_SHORT, 0)
        }
        .bind(this);
        E(u),
        E(l),
        E(c);
        var v = s.getMesh(d)
          , A = _.createDrawState().bindFramebuffer(this.framebuffer).enable(_.DEPTH_TEST).viewport(0, 0, h.shadowMapWidth, h.shadowMapWidth).depthMask(!0).colorMask(!1, !1, !1, !1).uniformMatrix4fv("u_projectionViewModelMatrix", !1, m).uniformTexture("u_basePositionsTexture", 2, _.TEXTURE_2D, s.basePositionsTexture).uniformTexture("u_baseNormalsTexture", 3, _.TEXTURE_2D, s.baseNormalsTexture).uniform2f("u_baseTextureResolution", s.baseTextureWidth, s.baseTextureHeight).vertexAttribPointer(v.associationsBuffer, this.hairDepthProgram.getAttribLocation("a_associations"), 3, _.FLOAT, !1, 0, 0).vertexAttribPointer(v.barycentricCoordinatesBuffer, this.hairDepthProgram.getAttribLocation("a_barycentricCoordinates"), 3, _.FLOAT, !1, 0, 0).bindIndexBuffer(v.indexBuffer).useProgram(this.hairDepthProgram);
        _.drawElements(A, _.TRIANGLES, v.indexCount, _.UNSIGNED_SHORT, 0)
    }
    ,
    ShadowRenderer.prototype.render = function(e, t, r, n, i, o, a, s, u, l, c, h, d) {
        for (var f = 0; f < h.length; ++f)
            this.renderForLight(e, t, r, n, i, o, a, s, u, l, c, h[f], d)
    }
    ;
    var falloff = [1, .37, .3]
      , MIN_FOV = .5 * Math.PI
      , MAX_FOV = .62 * Math.PI
      , GAMMA = 2.2
      , NON_LINEAR_SKIN_COLOR = Vector3.multiplyByScalar([], [255, 201, 167], 1 / 255)
      , LINEAR_SKIN_COLOR = Vector3.pow([], NON_LINEAR_SKIN_COLOR, GAMMA)
      , HAIR_ALBEDO = Vector3.pow([], Vector3.multiplyByScalar([], [152, 100, 52], 1 / 255), GAMMA)
      , NON_LINEAR_SKIN_HSV = Vector3.rgbToHSV([], NON_LINEAR_SKIN_COLOR)
      , BACKGROUND_COLOR = Vector3.hsvToRGB([], [NON_LINEAR_SKIN_HSV[0] + .5, .9, .4])
      , NON_LINEAR_MOUTH_COLOR = Vector3.multiplyByScalar([], [126, 13, 12], .5 / 255)
      , LINEAR_MOUTH_COLOR = Vector3.pow([], NON_LINEAR_MOUTH_COLOR, GAMMA)
      , NEAR = .1
      , FAR = 100;
    Renderer.prototype.createPrograms = function(e, t) {
        var r = this.wgl;
        0 === t ? this.programSets[e].wrinkleProgram = r.createProgram(Shaders["wrinkle.vert"], this.lightingCommons[e] + Shaders["wrinkle.frag"], {
            a_textureCoordinates: 0
        }) : 1 === t ? this.programSets[e].hairProgram = r.createProgram(Shaders["hair.vert"], this.lightingCommons[e] + Shaders["hair.frag"]) : 2 === t ? this.programSets[e].eyeProgram = r.createProgram(Shaders["eye.vert"], this.lightingCommons[e] + Shaders["eye.frag"], {
            a_position: 0,
            a_normal: 1
        }) : 3 === t && (this.programSets[e].appendageProgram = r.createProgram(Shaders["nose.vert"], this.lightingCommons[e] + Shaders["nose.frag"], {
            a_position: 0,
            a_normal: 1
        }))
    }
    ,
    Renderer.prototype.onResize = function() {
        var e = this.wgl;
        e.rebuildTexture(this.colorTexture, e.RGBA, e.UNSIGNED_BYTE, this.canvas.width, this.canvas.height, null, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.LINEAR, e.LINEAR),
        e.rebuildTexture(this.colorTextureTemp, e.RGBA, e.UNSIGNED_BYTE, this.canvas.width, this.canvas.height, null, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.LINEAR, e.LINEAR),
        e.rebuildTexture(this.depthTexture, e.DEPTH_COMPONENT, e.UNSIGNED_SHORT, this.canvas.width, this.canvas.height, null, e.CLAMP_TO_EDGE, e.CLAMP_TO_EDGE, e.LINEAR, e.LINEAR)
    }
    ,
    Renderer.prototype.setLightingUniforms = function(e, t) {
        var r = this.lights[0]
          , n = this.wgl;
        e.uniformMatrix4fv("u_projectionViewMatrix", !1, this.projectionViewMatrix).uniformMatrix4fv("u_modelMatrix", !1, this.modelMatrix).uniform3f("u_cameraPosition", this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]).uniform3f("u_skinAlbedo", LINEAR_SKIN_COLOR[0], LINEAR_SKIN_COLOR[1], LINEAR_SKIN_COLOR[2]);
        for (var i = 0; i < this.lights.length; ++i) {
            r = this.lights[i];
            e.uniform3f("u_lightPosition" + i.toFixed(0), r.getPosition()[0], r.getPosition()[1], r.getPosition()[2]).uniform3f("u_lightColor" + i.toFixed(0), r.brightness, r.brightness, r.brightness).uniformTexture("u_shadowDepthTexture" + i.toFixed(0), t + i, n.TEXTURE_2D, r.depthTexture).uniform2f("u_shadowResolution" + i.toFixed(0), r.shadowMapWidth, r.shadowMapWidth).uniformMatrix4fv("u_lightProjectionViewMatrix" + i.toFixed(0), !1, r.projectionViewMatrix).uniform1f("u_lightNear" + i.toFixed(0), r.near).uniform1f("u_lightFar" + i.toFixed(0), r.far)
        }
    }
    ,
    Renderer.prototype.update = function() {
        this.fov += .05 * (this.targetFOV - this.fov),
        this.canvas.width > this.canvas.height ? this.projectionMatrix = Matrix4.makePerspective(new Float32Array(16), this.fov, this.canvas.width / this.canvas.height, NEAR, FAR) : this.projectionMatrix = Matrix4.makePerspectiveHorizontal(new Float32Array(16), this.fov, this.canvas.width / this.canvas.height, NEAR, FAR),
        this.projectionViewMatrix = Matrix4.premultiply(new Float32Array(16), this.viewMatrix, this.projectionMatrix)
    }
    ,
    Renderer.prototype.render = function(e, t, r, n, i, o, a, s, u, l, c, h, d, f, _) {
        function m(e, t) {
            var r = g.createDrawState().bindFramebuffer(this.framebuffer).enable(g.DEPTH_TEST).viewport(0, 0, this.canvas.width, this.canvas.height).vertexAttribPointer(e.positionsBuffer, 0, 3, g.FLOAT, !1, 0, 0).vertexAttribPointer(e.normalsBuffer, 1, 3, g.FLOAT, !1, 0, 0).bindIndexBuffer(e.indexBuffer).uniform3f("u_eyePosition", e.position[0], e.position[1], e.position[2]).uniform1f("u_pupilNoiseOffset", t).uniform3f("u_lookDirection", e.lookDirection[0], e.lookDirection[1], e.lookDirection[2]).useProgram(p.eyeProgram);
            this.setLightingUniforms(r, 0),
            g.drawElements(r, g.TRIANGLES, e.indicesCount, g.UNSIGNED_SHORT, 0)
        }
        var p = this.programSets[_];
        this.projectionViewMatrix = Matrix4.premultiply(new Float32Array(16), this.viewMatrix, this.projectionMatrix),
        this.modelMatrix = e;
        var g = this.wgl;
        this.shadowRenderer.render(e, t, r, n, i, o, a, s, u, l, c, this.lights, _),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.colorTexture, 0),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.TEXTURE_2D, this.depthTexture, 0),
        g.clear(g.createClearState().bindFramebuffer(this.framebuffer), g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.colorTextureTemp, 0),
        g.clear(g.createClearState().bindFramebuffer(this.framebuffer), g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.colorTexture, 0);
        var T = s.getMesh(_)
          , E = g.createDrawState().bindFramebuffer(this.framebuffer).enable(g.DEPTH_TEST).viewport(0, 0, this.canvas.width, this.canvas.height).uniformTexture("u_basePositionsTexture", 0, g.TEXTURE_2D, s.basePositionsTexture).uniformTexture("u_baseNormalsTexture", 1, g.TEXTURE_2D, s.baseNormalsTexture).uniformTexture("u_perturbationTexture3D", 2, g.TEXTURE_2D, s.perturbationTexture3D).uniform1f("u_perturbationTextureWidth", s.perturbationTexture3DWidth).uniform2f("u_baseTextureResolution", s.baseTextureWidth, s.baseTextureHeight).uniform3f("u_hairAlbedo", HAIR_ALBEDO[0], HAIR_ALBEDO[1], HAIR_ALBEDO[2]).vertexAttribPointer(T.associationsBuffer, p.hairProgram.getAttribLocation("a_associations"), 3, g.FLOAT, !1, 0, 0).vertexAttribPointer(T.barycentricCoordinatesBuffer, p.hairProgram.getAttribLocation("a_barycentricCoordinates"), 3, g.FLOAT, !1, 0, 0).vertexAttribPointer(T.restPositionsBuffer, p.hairProgram.getAttribLocation("a_restPosition"), 3, g.FLOAT, !1, 0, 0).bindIndexBuffer(T.indexBuffer).useProgram(p.hairProgram);
        if (this.setLightingUniforms(E, 3),
        E.colorMask(!1, !1, !1, !1),
        g.drawElements(E, g.TRIANGLES, T.indexCount, g.UNSIGNED_SHORT, 0),
        i) {
            var v = g.createDrawState().bindFramebuffer(this.framebuffer).enable(g.DEPTH_TEST).viewport(0, 0, this.canvas.width, this.canvas.height).uniformTexture("u_basePositionsTexture", 0, g.TEXTURE_2D, t.basePositionsTexture).uniformTexture("u_baseNormalsTexture", 1, g.TEXTURE_2D, t.baseNormalsTexture).uniform2f("u_baseTextureResolution", t.textureWidth, t.textureHeight).uniform3f("u_hairAlbedo", HAIR_ALBEDO[0], HAIR_ALBEDO[1], HAIR_ALBEDO[2]).vertexAttribPointer(n.associationsBuffer, this.staticSkinProgram.getAttribLocation("a_associations"), 3, g.FLOAT, !1, 0, 0).vertexAttribPointer(n.barycentricCoordinatesBuffer, this.staticSkinProgram.getAttribLocation("a_barycentricCoordinates"), 3, g.FLOAT, !1, 0, 0).vertexAttribPointer(n.mouthinessesBuffer, this.staticSkinProgram.getAttribLocation("a_mouthiness"), 1, g.FLOAT, !1, 0, 0).uniform3f("u_mouthColor", LINEAR_MOUTH_COLOR[0], LINEAR_MOUTH_COLOR[1], LINEAR_MOUTH_COLOR[2]).bindIndexBuffer(n.indexBuffer).useProgram(this.staticSkinProgram);
            this.setLightingUniforms(v, 3),
            v.colorMask(!1, !1, !1, !1),
            g.drawElements(v, g.TRIANGLES, n.indexCount, g.UNSIGNED_SHORT, 0),
            v.colorMask(!0, !0, !0, !0),
            v.depthFunc(g.LEQUAL),
            g.drawElements(v, g.TRIANGLES, n.indexCount, g.UNSIGNED_SHORT, 0)
        } else {
            var A = r.getWrinkleMesh(_)
              , M = g.createDrawState().bindFramebuffer(this.framebuffer).viewport(0, 0, this.canvas.width, this.canvas.height).enable(g.DEPTH_TEST).vertexAttribPointer(A.vertexBuffer, 0, 2, g.FLOAT, g.FALSE, 0, 0).bindIndexBuffer(A.indexBuffer).uniformTexture("u_positionsTexture", 0, g.TEXTURE_2D, A.positionsTexture).uniformTexture("u_normalsTexture", 1, g.TEXTURE_2D, A.normalsTexture).uniformTexture("u_mouthinessTexture", 2, g.TEXTURE_2D, A.mouthinessTexture).uniform3f("u_mouthColor", LINEAR_MOUTH_COLOR[0], LINEAR_MOUTH_COLOR[1], LINEAR_MOUTH_COLOR[2]).useProgram(p.wrinkleProgram);
            this.setLightingUniforms(M, 3),
            M.colorMask(!1, !1, !1, !1),
            g.drawElements(M, A.wireframe ? g.LINES : g.TRIANGLES, A.wrinkleIndexCount, g.UNSIGNED_SHORT, 0),
            M.colorMask(!0, !0, !0, !0),
            M.depthFunc(g.LEQUAL),
            g.drawElements(M, A.wireframe ? g.LINES : g.TRIANGLES, A.wrinkleIndexCount, g.UNSIGNED_SHORT, 0)
        }
        var x = function(e) {
            var t = g.createDrawState().bindFramebuffer(this.framebuffer).viewport(0, 0, this.canvas.width, this.canvas.height).enable(g.DEPTH_TEST).vertexAttribPointer(e.positionsBuffer, 0, 3, g.FLOAT, g.FALSE, 0, 0).vertexAttribPointer(e.normalsBuffer, 1, 3, g.FLOAT, g.FALSE, 0, 0).bindIndexBuffer(e.indexBuffer).useProgram(p.appendageProgram);
            this.setLightingUniforms(t, 0),
            g.drawElements(t, g.TRIANGLES, e.indicesCount, g.UNSIGNED_SHORT, 0)
        }
        .bind(this);
        x(u),
        x(l),
        x(c),
        g.clear(g.createClearState().clearColor(0, 0, 0, 1), g.COLOR_BUFFER_BIT, g.DEPTH_BUFFER_BIT),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.TEXTURE_2D, null, 0);
        var b = g.createDrawState().viewport(0, 0, this.canvas.width, this.canvas.height).vertexAttribPointer(this.quadVertexBuffer, 0, 2, g.FLOAT, !1, 0, 0).uniformTexture("u_depthTexture", 1, g.TEXTURE_2D, this.depthTexture).uniform2f("u_resolution", this.canvas.width, this.canvas.height).uniformMatrix4fv("u_projectionMatrix", !1, this.projectionMatrix).uniform1f("u_near", NEAR).uniform1f("u_far", FAR).useProgram(p.sssBlurProgram);
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.colorTextureTemp, 0),
        b.bindFramebuffer(this.framebuffer).uniformTexture("u_colorTexture", 0, g.TEXTURE_2D, this.colorTexture).uniform2f("u_direction", 1, 0),
        g.drawArrays(b, g.TRIANGLE_STRIP, 0, 4),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.colorTexture, 0),
        b.bindFramebuffer(this.framebuffer).uniformTexture("u_colorTexture", 0, g.TEXTURE_2D, this.colorTextureTemp).uniform2f("u_direction", 0, 1),
        g.drawArrays(b, g.TRIANGLE_STRIP, 0, 4),
        m = m.bind(this),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.colorTexture, 0),
        g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.TEXTURE_2D, this.depthTexture, 0),
        m(o, 0),
        m(a, 123),
        E.colorMask(!0, !0, !0, !0),
        E.depthFunc(g.LEQUAL),
        g.drawElements(E, g.TRIANGLES, T.indexCount, g.UNSIGNED_SHORT, 0);
        var y = g.createDrawState().bindFramebuffer(this.framebuffer).viewport(0, 0, this.canvas.width, this.canvas.height).enable(g.DEPTH_TEST).depthMask(!1).vertexAttribPointer(this.quadVertexBuffer, 0, 2, g.FLOAT, !1, 0, 0).useProgram(this.backgroundProgram).uniformMatrix4fv("u_projectionViewMatrix", !1, this.projectionViewMatrix).uniform3f("u_cameraPosition", this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]).uniform3f("u_color", BACKGROUND_COLOR[0], BACKGROUND_COLOR[1], BACKGROUND_COLOR[2]);
        if (this.canvas.width > this.canvas.height ? y.uniform2f("u_scale", Math.tan(this.fov / 2) * this.canvas.width / this.canvas.height, Math.tan(this.fov / 2)) : y.uniform2f("u_scale", Math.tan(this.fov / 2), Math.tan(this.fov / 2) * this.canvas.height / this.canvas.width),
        g.drawArrays(y, g.TRIANGLE_STRIP, 0, 4),
        0 === f) {
            R = g.createDrawState().bindFramebuffer(null).viewport(0, 0, this.canvas.width, this.canvas.height).vertexAttribPointer(this.quadVertexBuffer, 0, 2, g.FLOAT, !1, 0, 0).uniformTexture("u_input", 0, g.TEXTURE_2D, this.colorTexture).uniform2f("u_resolution", this.canvas.width, this.canvas.height).uniform1f("u_scale", h).useProgram(this.fxaaProgram);
            g.drawArrays(R, g.TRIANGLE_STRIP, 0, 4)
        } else {
            g.framebufferTexture2D(this.framebuffer, g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, this.colorTextureTemp, 0);
            var R = g.createDrawState().bindFramebuffer(this.framebuffer).viewport(0, 0, this.canvas.width, this.canvas.height).vertexAttribPointer(this.quadVertexBuffer, 0, 2, g.FLOAT, !1, 0, 0).uniformTexture("u_input", 0, g.TEXTURE_2D, this.colorTexture).uniform2f("u_resolution", this.canvas.width, this.canvas.height).uniform1f("u_scale", h).useProgram(this.fxaaProgram);
            g.drawArrays(R, g.TRIANGLE_STRIP, 0, 4);
            var S = [0, -.85, 0, 1];
            Matrix4.multiplyVector(S, this.projectionViewMatrix, S);
            var P = this.canvas.height * (S[1] / S[3] * .5 + .5) - .06 * this.canvas.height
              , C = Math.floor(this.canvas.width / 2 - d.width / 2)
              , D = g.createDrawState().bindFramebuffer(this.framebuffer).viewport(C, P - d.height, d.width, d.height).enable(g.DEPTH_TEST).depthMask(!1).vertexAttribPointer(this.quadVertexBuffer, 0, 2, g.FLOAT, !1, 0, 0).useProgram(this.imageProgram).enable(g.BLEND).blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA).uniformTexture("u_image", 0, g.TEXTURE_2D, d.texture).uniform1f("u_alpha", f);
            g.drawArrays(D, g.TRIANGLE_STRIP, 0, 4);
            var I = g.createDrawState().bindFramebuffer(null).viewport(0, 0, this.canvas.width, this.canvas.height).vertexAttribPointer(this.quadVertexBuffer, 0, 2, g.FLOAT, !1, 0, 0).uniformTexture("u_colorTexture", 0, g.TEXTURE_2D, this.colorTextureTemp).useProgram(this.compositeProgram);
            g.drawArrays(I, g.TRIANGLE_STRIP, 0, 4)
        }
    }
    ,
    Renderer.prototype.getRayDirection = function(e, t) {
        var r = 2 * Math.atan(1 / this.projectionMatrix[5])
          , n = [e * Math.tan(r / 2) * (this.canvas.width / this.canvas.height), t * Math.tan(r / 2), -1]
          , i = Matrix4.invert([], this.viewMatrix)
          , o = Matrix4.transformDirection([], n, i);
        return Vector3.normalize(o, o),
        o
    }
    ,
    Eye.prototype.update = function(e, t, r) {
        var n = this.wgl;
        this.vertices = this.module.HEAPF32.subarray(this.getEyePositionData(this.index) >> 2, (this.getEyePositionData(this.index) >> 2) + 3 * this.getEyeVertexCount(this.index)),
        this.normals = this.module.HEAPF32.subarray(this.getEyeNormalData(this.index) >> 2, (this.getEyeNormalData(this.index) >> 2) + 3 * this.getEyeVertexCount(this.index)),
        n.bufferData(this.positionsBuffer, n.ARRAY_BUFFER, this.vertices, n.DYNAMIC_DRAW),
        n.bufferData(this.normalsBuffer, n.ARRAY_BUFFER, this.normals, n.DYNAMIC_DRAW),
        this.position = [e.positions[3 * this.baseIndex + 0], e.positions[3 * this.baseIndex + 1], e.positions[3 * this.baseIndex + 2]];
        var i = [e.normals[3 * this.baseIndex + 0], e.normals[3 * this.baseIndex + 1], e.normals[3 * this.baseIndex + 2]];
        Vector3.multiplyByQuaternion(this.position, this.position, r),
        Vector3.multiplyByQuaternion(i, i, r);
        var o = Vector3.normalize([], Vector3.subtract([], t, this.position));
        Vector3.coneClamp(o, i, o, 1.3),
        Vector3.slerp(this.lookDirection, this.lookDirection, o, .7)
    }
    ,
    Ear.prototype.update = function(e) {
        var t = this.wgl;
        this.vertices = this.module.HEAPF32.subarray(this.getPositionData(this.index) >> 2, (this.getPositionData(this.index) >> 2) + 3 * this.getVertexCount(this.index)),
        this.normals = this.module.HEAPF32.subarray(this.getNormalData(this.index) >> 2, (this.getNormalData(this.index) >> 2) + 3 * this.getVertexCount(this.index)),
        t.bufferData(this.positionsBuffer, t.ARRAY_BUFFER, this.vertices, t.DYNAMIC_DRAW),
        t.bufferData(this.normalsBuffer, t.ARRAY_BUFFER, this.normals, t.DYNAMIC_DRAW)
    }
    ,
    Hair.prototype.createMesh = function(e) {
        var t = this.wgl;
        0 === e ? this.meshes[0] = new HairMesh(t,1,this.getHairVertexCount(),this.hairIndices,this.baseRestPositions) : 1 === e && (this.meshes[1] = new HairMesh(t,2,this.getHairVertexCount(),this.hairIndices,this.baseRestPositions))
    }
    ,
    Hair.prototype.getMesh = function(e) {
        return this.meshes[e]
    }
    ,
    Hair.prototype.update = function() {
        for (var e = this.wgl, t = this.module.HEAPF32.subarray(this.getHairPositionData() >> 2, (this.getHairPositionData() >> 2) + 3 * this.getHairVertexCount()), r = this.module.HEAPF32.subarray(this.getHairNormalData() >> 2, (this.getHairNormalData() >> 2) + 3 * this.getHairVertexCount()), n = 0; n < this.baseTextureWidth * this.baseTextureHeight; ++n)
            if (n < t.length / 3)
                this.basePositionsData[4 * n + 0] = t[3 * n + 0],
                this.basePositionsData[4 * n + 1] = t[3 * n + 1],
                this.basePositionsData[4 * n + 2] = t[3 * n + 2],
                this.basePositionsData[4 * n + 3] = 0,
                this.baseNormalsData[4 * n + 0] = r[3 * n + 0],
                this.baseNormalsData[4 * n + 1] = r[3 * n + 1],
                this.baseNormalsData[4 * n + 2] = r[3 * n + 2],
                this.baseNormalsData[4 * n + 3] = 0;
            else
                for (var i = 0; i < 4; ++i)
                    this.basePositionsData[4 * n + i] = 0,
                    this.baseNormalsData[4 * n + i] = 0;
        e.texImage2D(e.TEXTURE_2D, this.basePositionsTexture, 0, e.RGBA, this.baseTextureWidth, this.baseTextureHeight, 0, e.RGBA, e.FLOAT, this.basePositionsData),
        e.texImage2D(e.TEXTURE_2D, this.baseNormalsTexture, 0, e.RGBA, this.baseTextureWidth, this.baseTextureHeight, 0, e.RGBA, e.FLOAT, this.baseNormalsData)
    }
    ,
    Nose.prototype.update = function(e) {
        var t = this.wgl;
        this.vertices = this.module.HEAPF32.subarray(this.getNosePositionData() >> 2, (this.getNosePositionData() >> 2) + 3 * this.getNoseVertexCount()),
        this.normals = this.module.HEAPF32.subarray(this.getNoseNormalData() >> 2, (this.getNoseNormalData() >> 2) + 3 * this.getNoseVertexCount()),
        t.bufferData(this.positionsBuffer, t.ARRAY_BUFFER, this.vertices, t.DYNAMIC_DRAW),
        t.bufferData(this.normalsBuffer, t.ARRAY_BUFFER, this.normals, t.DYNAMIC_DRAW)
    }
    ;
    var Quality = {
        Medium: 0,
        High: 1
    };
    QualitySelector.prototype.refresh = function() {
        for (var e = 0; e < this.buttons.length; ++e)
            e === this.currentValue ? this.buttons[e].className = "quality quality-selected" : this.buttons[e].className = "quality quality-unselected"
    }
    ;
    var Maths = {
        clamp: function(e, t, r) {
            return Math.max(t, Math.min(r, e))
        },
        smoothstep: function(e, t, r) {
            return (r = Maths.clamp((r - e) / (t - e), 0, 1)) * r * (3 - 2 * r)
        }
    }
      , WIREFRAME = !1;
    Plane.prototype.distanceToPoint = function(e) {
        return Vector3.dot(Vector3.subtract([], e, this.point), this.normal)
    }
    ,
    Plane.prototype.intersectionDistance = function(e, t) {
        var r = Vector3.dot(this.normal, t);
        return Vector3.dot(Vector3.subtract([], this.point, e), this.normal) / r
    }
    ,
    Plane.prototype.intersect = function(e, t) {
        var r = Vector3.dot(this.normal, t)
          , n = Vector3.dot(Vector3.subtract([], this.point, e), this.normal) / r;
        return Vector3.add([], e, Vector3.multiplyByScalar([], t, n))
    }
    ,
    Face.prototype.onMouseDown = function(e) {
        var t = Utilities.getMousePosition(e, this.canvas);
        this.mouseX = t.x / this.canvas.width * 2 - 1,
        this.mouseY = -(t.y / this.canvas.height * 2 - 1);
        var r = this.renderer.getRayDirection(this.mouseX, this.mouseY)
          , n = Quaternion.invert([], this.faceRotation)
          , i = this.baseMesh.intersect(Vector3.multiplyByQuaternion([], this.renderer.cameraPosition, n), Vector3.multiplyByQuaternion([], r, n));
        -1 !== i ? (this.draggingTriangleIndex = i,
        this.lastDraggingTriangleIndex = -1,
        -1 === this.framesAtFirstDrag && (this.framesAtFirstDrag = this.framesSinceStart)) : this.draggingTriangleIndex = -1
    }
    ,
    Face.prototype.onMouseMove = function(e) {
        var t = Utilities.getMousePosition(e, this.canvas);
        this.mouseX = t.x / this.canvas.width * 2 - 1,
        this.mouseY = -(t.y / this.canvas.height * 2 - 1)
    }
    ,
    Face.prototype.onMouseUp = function(e) {
        -1 !== this.draggingTriangleIndex && (this.lastDraggingTriangleIndex = this.draggingTriangleIndex),
        this.draggingTriangleIndex = -1
    }
    ,
    Face.prototype.onTouchStart = function(e) {
        if (e.preventDefault(),
        1 === e.touches.length && (this.onMouseDown(e.targetTouches[0]),
        !this.hasUnlockedAudio)) {
            var t = this.webAudioContext
              , r = t.createBuffer(1, 1, t.sampleRate)
              , n = t.createBufferSource();
            n.buffer = r,
            n.connect(t.destination),
            n.start(0),
            this.hasUnlockedAudio = !0
        }
    }
    ,
    Face.prototype.onTouchMove = function(e) {
        e.preventDefault(),
        this.onMouseMove(e.targetTouches[0])
    }
    ,
    Face.prototype.onTouchEnd = function(e) {
        e.preventDefault(),
        e.touches.length > 0 || this.onMouseUp({})
    }
    ,
    Face.prototype.onTouchCancel = function(e) {
        e.preventDefault(),
        e.touches.length > 0 || this.onMouseUp({})
    }
    ,
    Face.prototype.start = function() {
        function e() {
            this.update(),
            requestAnimationFrame(e)
        }
        var t = document.createElement("div");
        if (document.body.appendChild(t),
        t.outerHTML = document.getElementById("main-template").innerHTML,
        this.isSimplified) {
            var r = document.getElementById("quality-container");
            r.parentNode.removeChild(r)
        } else
            this.qualitySelector = new QualitySelector(this.quality,function(e) {
                this.quality = e
            }
            .bind(this));
        this.heavy.setFloatParameters({
            vol_gloop: .8,
            vol_master: .6,
            vol_slap: .4,
            vol_slosh: .66,
            vol_stretch: .7
        }),
        this.heavy.setFloatParameter("init", 500),
        (e = e.bind(this))()
    }
    ,
    Face.prototype.update = function() {
        if (this.renderer.update(),
        this.audioParameters = {
            volume: this.baseMesh.computeVolume(),
            area: this.baseMesh.computeArea(),
            dragging: this.isDragging() ? 1 : 0
        },
        -1 !== this.lastDraggingTriangleIndex) {
            var e = this.baseMesh.baseIndices[3 * this.lastDraggingTriangleIndex];
            Vector3.length(this.baseMesh.getPosition(e)) < Vector3.length(this.baseMesh.getRestPosition(this.lastDraggingTriangleIndex)) && (this.audioParameters.slap = 1,
            this.lastDraggingTriangleIndex = -1)
        }
        var t = [0, 0, 0];
        this.isDragging() && (t = Vector3.subtract([], this.baseMesh.getPosition(this.baseMesh.baseIndices[3 * this.draggingTriangleIndex]), this.baseMesh.getRestPosition(this.draggingTriangleIndex))),
        this.audioParameters.drag_delta_x = t[0],
        this.audioParameters.drag_delta_y = t[1],
        this.audioParameters.drag_delta_z = t[2],
        this.audioParameters.drag_distance = Vector3.length(t);
        for (var r in this.audioParameters)
            Math.abs(this.audioParameters[r]) < 1e-4 && (this.audioParameters[r] = 0);
        var n = Math.max((new Date).getTime() - this.lastAudioProcessTime, 0);
        this.heavy.setFloatParametersWithDelay(this.audioParameters, n);
        var i = this.renderer.getRayDirection(this.mouseX, this.mouseY)
          , o = [0, 0, 0];
        if (this.isDragging()) {
            var a, s = this.baseMesh.getRestPosition(this.draggingTriangleIndex), u = Vector3.normalize([], s), l = Vector3.normalize([], [u[0], u[1], 0]), c = new Plane(s,[0, 0, 1]), h = new Plane(s,l), d = c.intersect(this.renderer.cameraPosition, i), f = 0;
            if (h.distanceToPoint(d) < 0) {
                var _ = Math.acos(Vector3.dot(u, [0, 0, 1])) + .1
                  , m = -h.distanceToPoint(d)
                  , p = Vector3.normalize([], Vector3.cross([], l, [0, 0, 1]))
                  , g = Math.min(_, 2 * Math.abs(m));
                a = Quaternion.fromAxisAngle([], p, g),
                f = .15 * g
            } else
                a = Quaternion.identity();
            var T = Quaternion.invert([], this.faceRotation)
              , E = Vector3.multiplyByQuaternion([], this.baseMesh.getRestPosition(this.draggingTriangleIndex), this.faceRotation);
            o = new Plane(Vector3.add([], E, [0, 0, f]),[0, 0, 1]).intersect(this.renderer.cameraPosition, i),
            Vector3.multiplyByQuaternion(o, o, T)
        } else
            a = Quaternion.identity();
        this.faceRotation = Quaternion.slerp([], this.faceRotation, a, this.isDragging() ? .1 : .05),
        this.baseMesh.update([0, 0, 0, 1], this.isDragging() ? 1 : 0, this.draggingTriangleIndex, o, this.isDragging() ? .8 : .97, 0, this.renderer.cameraPosition, i);
        var v = new Plane([0, 0, 1.2],[0, 0, 1]).intersect(this.renderer.cameraPosition, i);
        this.hair.update(),
        this.leftEye.update(this.baseMesh, v, this.faceRotation),
        this.rightEye.update(this.baseMesh, v, this.faceRotation),
        this.nose.update(),
        this.leftEar.update(),
        this.rightEar.update();
        var A = Matrix4.fromQuaternion(new Float32Array(16), this.faceRotation);
        this.isSimplified || this.wrinkleSimulator.update(this.baseMesh.textureWidth, this.baseMesh.textureHeight, this.baseMesh.basePositionsTexture, this.baseMesh.baseNormalsTexture, this.baseMesh.positions, this.baseMesh.normals, this.isDragging(), this.draggingTriangleIndex, this.quality),
        this.framesSinceStart += 1;
        var M = Maths.smoothstep(0, 30, this.framesSinceStart)
          , x = Maths.smoothstep(0, 30, this.framesSinceStart);
        if (-1 === this.framesAtFirstDrag)
            x *= 1;
        else {
            var b = this.framesSinceStart - this.framesAtFirstDrag;
            x *= b > 60 ? 0 : Maths.smoothstep(60, 0, b)
        }
        this.renderer.render(A, this.baseMesh, this.wrinkleSimulator, this.staticSkin, this.isSimplified, this.leftEye, this.rightEye, this.hair, this.nose, this.leftEar, this.rightEar, M, this.promptImage, x, this.quality)
    }
    ,
    Face.prototype.isDragging = function() {
        return -1 !== this.draggingTriangleIndex
    }
    ;
    var canvas = document.createElement("canvas")
      , wgl = WrappedGL.create(canvas);
    if (null !== wgl && null !== wgl.getExtension("OES_texture_float") && null !== wgl.getExtension("WEBGL_depth_texture") && hasWebAudioSupport()) {
        document.getElementById("placeholder").outerHTML = document.getElementById("loading-template").innerHTML;
        var isSimplified = isMobile()
          , face = new Face(isSimplified,function(e) {
            document.getElementById("loading-fill").style.width = Math.round(100 * e).toFixed(0) + "%"
        }
        ,function() {
            document.getElementById("loading-bar").className = "loading-bar-hidden",
            window.setTimeout(function() {
                face.start(),
                document.getElementById("loading-bar").outerHTML = "",
                document.body.appendChild(face.canvas)
            }, 200)
        }
        )
    } else
        document.getElementById("placeholder").outerHTML = document.getElementById("no-support-template").innerHTML
}();
