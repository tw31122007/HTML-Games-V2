// Author: www.mahdi7s.com

var MathH = {
    clamp: function (num, min, max) {
        return Math.min(max, Math.max(num, min));
    }
};

var BodyUserData = function (objectRoll, fullHealth) {
    var self = this,
        currentHealth = fullHealth;

    this.isDead = false;
    this.isContacted = false;
    this.getObjectRoll = function () {
        return objectRoll;
    };
    this.getFullHealth = function () {
        return fullHealth;
    };
    this.getHealth = function () {
        return self.currentHealth;
    };
    this.damage = function (impulse) {
        this.isDead = ((currentHealth -= impulse) <= 0);
    };
}

var GameObjectRoll = {
    Enemy: "ENEMY!",
    Wood: "Wood!",
    Bird: "BIRD!"
};
Object.freeze(GameObjectRoll); // So it's like an enum

var b2Body = Box2D.Dynamics.b2Body,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2Shape = Box2D.Collision.Shapes.b2Shape,
    b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3,
    b2AABB = Box2D.Collision.b2AABB,
    b2Bound = Box2D.Collision.b2Bound,
    b2BoundValues = Box2D.Collision.b2BoundValues,
    b2Collision = Box2D.Collision.b2Collision,
    b2ContactID = Box2D.Collision.b2ContactID,
    b2ContactPoint = Box2D.Collision.b2ContactPoint,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2Distance = Box2D.Collision.b2Distance,
    b2DistanceInput = Box2D.Collision.b2DistanceInput,
    b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
    b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
    b2DynamicTree = Box2D.Collision.b2DynamicTree,
    b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
    b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
    b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2Manifold = Box2D.Collision.b2Manifold,
    b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
    b2Point = Box2D.Collision.b2Point,
    b2RayCastInput = Box2D.Collision.b2RayCastInput,
    b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
    b2Segment = Box2D.Collision.b2Segment,
    b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
    b2Simplex = Box2D.Collision.b2Simplex,
    b2SimplexCache = Box2D.Collision.b2SimplexCache,
    b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
    b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
    b2TOIInput = Box2D.Collision.b2TOIInput,
    b2World = Box2D.Dynamics.b2World,
    b2WorldManifold = Box2D.Collision.b2WorldManifold,
    ClipVertex = Box2D.Collision.ClipVertex,
    Features = Box2D.Collision.Features,
    IBroadPhase = Box2D.Collision.IBroadPhase;

var b2 = (function () {
    var self = this,
        deadsCount = 0,
        userScore = 0,
        world,
        enableDebugDraw = false,
        bodies = [],
        PTMRatio = 30.0,
        toWorld = function (n) {
            return n / PTMRatio;
        },
        toScreen = function (n) {
            return n * PTMRatio;
        },
        b2AngleToCCRotation = function (n) {
            return (-1 * cc.RADIANS_TO_DEGREES(n));
        },
        CCRotationToB2Angle = function (n) {
            return cc.DEGREES_TO_RADIANS(-1 * n);
        };

    var contactListener = new b2ContactListener();
    contactListener.BeginContact = function (contact) {
        var bodyA = contact.GetFixtureA()
            .GetBody(),
            bodyB = contact.GetFixtureB()
                .GetBody(),
            bAData = bodyA.GetUserData(),
            bBData = bodyB.GetUserData();

        var setContacted = function (data) {
            data && (data.isContacted = true);
        };

        setContacted(bAData);
        setContacted(bBData);
    };
    contactListener.EndContact = function (contact) {};
    contactListener.PreSolve = function (contact, oldManifold) {};
    contactListener.PostSolve = function (contact, impulse) {
        var bodyA = contact.GetFixtureA()
            .GetBody(),
            bodyB = contact.GetFixtureB()
                .GetBody(),
            bAData = bodyA.GetUserData(),
            bBData = bodyB.GetUserData();

        var imp0 = impulse.normalImpulses[0];
        if (imp0 <= 2) return; // prevent little impulses

        var damage = function (bodyData) {
            if (!bodyData || (bodyData.getHealth() == bodyData.getFullHealth() && imp0 < 12)) return;

            var objRoll = bodyData.getObjectRoll();
            if (objRoll === GameObjectRoll.Enemy  || objRoll === GameObjectRoll.Wood /**/ ) {
                bodyData.damage(imp0);
            }
        };

        damage(bAData);
        damage(bBData);
    };

    return {
        toWorld: function (n) {
            return toWorld(n);
        },
        toScreen: function (n) {
            return toScreen(n);
        },
        initWorld: function () {
            deadsCount = userScore = 0;
            world = new b2World(new b2Vec2(0, - 10), true);
            world.SetContinuousPhysics(true);
            world.SetContactListener(contactListener);
            bodies = [];
        },
        getUserScore: function () {
            return userScore;
        },
        enablePhysicsFor: function (desc) {
            var bodyDef = new b2BodyDef(),
                scale = {
                    x: desc.sprite.getScaleX(),
                    y: desc.sprite.getScaleY()
                },
                anch = desc.sprite.getAnchorPointInPoints(),
                anchPoint = cc.p(anch.x * scale.x, anch.y * scale.y),
                position = desc.sprite.getPosition(),
                contentSize = desc.sprite.getContentSize(),
                size = {
                    width: contentSize.width * scale.x,
                    height: contentSize.height * scale.y
                },
                center = cc.p(position.x - anchPoint.x + size.width / 2, position.y - anchPoint.y + size.height / 2);

            bodyDef.type = desc.type === "static" ? b2Body.b2_staticBody : desc.type === "dynamic" ? b2Body.b2_dynamicBody : b2Body.b2_kinematicBody;

            bodyDef.position.Set(toWorld(center.x), toWorld(center.y));
            bodyDef.angle = CCRotationToB2Angle(desc.sprite.getRotation());

            var fixDef = new b2FixtureDef();
            switch (desc.shape) {
            case "circle":
                fixDef.shape = new b2CircleShape(toWorld(desc.radius || (size.height / 2)));
                break;
            case "box":
                fixDef.shape = new b2PolygonShape();
                fixDef.shape.SetAsBox(toWorld(size.width) / 2, toWorld(size.height) / 2);
                break;
            }

            fixDef.density = desc.density || 1;
            fixDef.friction = desc.friction || 0.5;
            fixDef.restitution = desc.restitution || 0.1;

            var body = world.CreateBody(bodyDef);
            body.CreateFixture(fixDef);

            desc.userData && body.SetUserData(desc.userData);

            body.sprite = desc.sprite;
            desc.sprite.body = body;

            bodies.push(body);
        },
        simulate: function () {
            world.Step(1 / 60, // fixed time step
            10, // velocity iterations
            10); // position iterations

            enableDebugDraw && world.DrawDebugData();

            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i],
                    bodyData = body.GetUserData(),
                    bPos = body.GetPosition(),
                    bAngle = body.GetAngle();

                if (bodyData && bodyData.isDead) {
                    world.DestroyBody(body);

                    userScore = (++deadsCount) * 1000;
                    body.sprite.runAction(cc.FadeOut.create(0.5));
                    body.SetUserData(null);

                    continue;
                }

                var scale = {
                    x: body.sprite.getScaleX(),
                    y: body.sprite.getScaleY()
                },
                anch = body.sprite.getAnchorPointInPoints(),
                    anchPoint = cc.p(anch.x * scale.x, anch.y * scale.y),
                    position = body.sprite.getPosition(),
                    contentSize = body.sprite.getContentSize(),
                    size = {
                        width: contentSize.width * scale.x,
                        height: contentSize.height * scale.y
                    };

                body.sprite.setPosition(cc.p(toScreen(bPos.x) + anchPoint.x - size.width / 2, toScreen(bPos.y) + anchPoint.y - size.height / 2));
                body.sprite.setRotation(b2AngleToCCRotation(bAngle));
            }

            world.ClearForces();
        },
        debugDraw: function (enable) {
            if ((enableDebugDraw = enable)) {
                var debugDraw = new b2DebugDraw();
                debugDraw.SetSprite(document.getElementsByTagName("canvas")[0].getContext("2d"));
                debugDraw.SetDrawScale(PTMRatio);
                debugDraw.SetFillAlpha(0.5);
                debugDraw.SetLineThickness(1.0);
                debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                world.SetDebugDraw(debugDraw);
            }
        }
    };
}());