/*
The below predefining of values is because my teacher
is making me use strict to clean my lazy JS >:(
*/

"use strict";

var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var sun;
var ground;
var rollingGroundSphere;
var ball;
var rollingSpeed = 0.008;
var ballRollingSpeed;
var worldRadius = 26;
var heroRadius = 0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY = 1.86;
var bounceValue = 0.1;
var gravity = 0.005;
var leftLane = -1;
var rightLane = 1;
var middleLane = 0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval = 0.5;
var lastTreeReleaseTime = 0;
var treesInPath;
var treesPool;
var explodeParticleGeometry;
var particleCount = 20;
var explosionPower = 1.06;
var explodeParticles;
var titleText;
var scoreText;
var pausedText;
var highText;
var score;
var highScore;
var paused;

init();

function init() {
  createScene();
  update();
}

function createScene() {
  score = 0;
  highScore = 0;
  paused = false;
  treesInPath = [];
  treesPool = [];
  clock = new THREE.Clock();
  clock.start();
  ballRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;
  sphericalHelper = new THREE.Spherical();
  pathAngleValues = [1.52, 1.57, 1.62];

  sceneWidth = window.innerWidth - 20;
  sceneHeight = window.innerHeight - 20;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x8fd8ff, 0.09);

  camera = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight, 0.1, 1000);
  camera.position.z = 8.5;
  camera.position.y = 3.3;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor(0x8fd8ff, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sceneWidth, sceneHeight);
  dom = document.getElementById("game");
  dom.appendChild(renderer.domElement);
  
  createTreesPool();
  addWorld();
  addBall();
  addLight();
  createExplosionParticles();

  window.addEventListener("resize", onWindowResize, false);
  document.onkeydown = handleKeyDown;

  titleText = document.createElement("div");
  titleText.style.position = "absolute";
  titleText.style.fontFamily = "Dela Gothic One";
  titleText.style.textAlign = "center";
  titleText.innerHTML = "ROLLING FORESTS";
  titleText.style.top = 10 + "px";
  titleText.style.color = "#005000";
  if(window.innerWidth < 600) {
    titleText.style.fontSize = 24 + "px";
    titleText.style.left = window.innerWidth / 2 - 142.5 + "px";
  } else {
    titleText.style.fontSize = 32 + "px";
    titleText.style.left = window.innerWidth / 2 - 190 + "px";
  }
  document.body.appendChild(titleText);

  pausedText = document.createElement("div");
  pausedText.style.position = "absolute";
  pausedText.style.fontFamily = "Dela Gothic One";
  pausedText.style.fontWeight = "bold";
  pausedText.style.color = "#000";
  if(window.innerWidth < 600) {
    pausedText.style.fontSize = 12 + "px";
    pausedText.style.top = 45 + "px";
    pausedText.style.left = 15 + "px";
  } else {
    pausedText.style.fontSize = 24 + "px";
    pausedText.style.top = 50 + "px";
    pausedText.style.left = 30 + "px";
  }
  document.body.appendChild(pausedText);

  scoreText = document.createElement("div");
  scoreText.style.position = "absolute";
  scoreText.style.fontFamily = "Dela Gothic One";
  scoreText.style.fontWeight = "bold";
  scoreText.style.color = "#000";
  scoreText.innerHTML = "Score: 0";
  if(window.innerWidth < 600) {
    scoreText.style.fontSize = 12 + "px";
    scoreText.style.top = 65 + "px";
    scoreText.style.left = 15 + "px";
  } else {
    scoreText.style.fontSize = 24 + "px";
    scoreText.style.top = 80 + "px";
    scoreText.style.left = 30 + "px";
  }
  document.body.appendChild(scoreText);

  highText = document.createElement("div");
  highText.style.position = "absolute";
  highText.style.fontFamily = "Dela Gothic One";
  highText.style.fontWeight = "bold";
  highText.style.color = "#000";
  highText.innerHTML = "High Score: 0";
  if(window.innerWidth < 600) {
    highText.style.fontSize = 12 + "px";
    highText.style.top = 85 + "px";
    highText.style.left = 15 + "px";
  } else {
    highText.style.fontSize = 24 + "px";
    highText.style.top = 110 + "px";
    highText.style.left = 30 + "px";
  }
  document.body.appendChild(highText);
}

function createExplosionParticles() {
  explodeParticleGeometry = new THREE.Geometry();
  for (var i = 0; i < particleCount; i++) {
    var vertex = new THREE.Vector3();
    explodeParticleGeometry.vertices.push(vertex);
  }
  var pMaterial = new THREE.PointsMaterial({
    color: 0x187018,
    transparent: true,
    opacity: 1,
    size: 0.2,
  });
  explodeParticles = new THREE.Points(explodeParticleGeometry, pMaterial);
  scene.add(explodeParticles);
  explodeParticles.visible = false;
}

function createTreesPool() {
  var maxTreesInPool = 10;
  var newTree;
  for (var i = 0; i < maxTreesInPool; i++) {
    newTree = createTree();
    treesPool.push(newTree);
  }
}

function handleKeyDown(keyEvent) {
  var validMove = true;
  if ((keyEvent.keyCode === 37 || keyEvent.keyCode === 65) && !paused) {
    if (currentLane == middleLane) {
      currentLane = leftLane;
    } else if (currentLane == rightLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else if ((keyEvent.keyCode === 39 || keyEvent.keyCode === 68) && !paused) {
    if (currentLane == middleLane) {
      currentLane = rightLane;
    } else if (currentLane == leftLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else if (keyEvent.keyCode === 80 || keyEvent.keyCode === 81) {
    if (paused) {
      pausedText.innerHTML = "";
      paused = false;
    } else {
      pausedText.innerHTML = "Game Paused";
      paused = true;
    }
  } else {
    if ((keyEvent.keyCode === 38  || keyEvent.keyCode === 87 || keyEvent.keyCode === 32) && !jumping && !paused) {  
      bounceValue = 0.11;
      jumping = true;
    }
    validMove = false;
  }
}

function handleSwipe(direction) {
  var validMove = true;
  if (direction == 'right' && !paused) {
    if (currentLane == middleLane) {
      currentLane = leftLane;
    } else if (currentLane == rightLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else if (direction == 'left' && !paused) {
    if (currentLane == middleLane) {
      currentLane = rightLane;
    } else if (currentLane == leftLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else if (direction == 'down') {
    if (paused) {
      pausedText.innerHTML = "";
      paused = false;
    } else {
      pausedText.innerHTML = "Game Paused";
      paused = true;
    }
  } else {
    if (direction == 'up' && !jumping && !paused) {  
      bounceValue = 0.11;
      jumping = true;
    }
    validMove = false;
  }
}

function addBall() {
  var sphereGeometry = new THREE.DodecahedronGeometry(heroRadius, 1);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xfc4503,
    shading: THREE.FlatShading,
  });

  ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
  ball.receiveShadow = true;
  ball.castShadow = true;
  scene.add(ball);
  ball.position.y = heroBaseY;
  ball.position.z = 4.8;
  currentLane = middleLane;
  ball.position.x = currentLane;

  jumping = false;
}

function addWorld() {
  var sides = 40;
  var tiers = 40;
  var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xeb8b73,
    shading: THREE.FlatShading,
  });

  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var nextVertexVector = new THREE.Vector3();
  var firstVertexVector = new THREE.Vector3();
  var offset = new THREE.Vector3();
  var currentTier = 1;
  var lerpValue = 0.5;
  var heightValue;
  var maxHeight = 0.07;
  for (var j = 1; j < tiers - 2; j++) {
    currentTier = j;
    for (var i = 0; i < sides; i++) {
      vertexIndex = currentTier * sides + 1;
      vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
      if (j % 2 !== 0) {
        if (i == 0) {
          firstVertexVector = vertexVector.clone();
        }
        nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
        if (i == sides - 1) {
          nextVertexVector = firstVertexVector;
        }
        lerpValue = Math.random() * (0.75 - 0.25) + 0.25;
        vertexVector.lerp(nextVertexVector, lerpValue);
      }
      heightValue = Math.random() * maxHeight - maxHeight / 2;
      offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
      sphereGeometry.vertices[i + vertexIndex] = vertexVector.add(offset);
    }
  }
  rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  rollingGroundSphere.receiveShadow = true;
  rollingGroundSphere.castShadow = false;
  rollingGroundSphere.rotation.z = -Math.PI / 2;
  scene.add(rollingGroundSphere);
  rollingGroundSphere.position.y = -24;
  rollingGroundSphere.position.z = 2;
  addWorldTrees();
}

function addLight() {
  var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
  scene.add(hemisphereLight);
  sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
  sun.position.set(12, 6, -7);
  sun.castShadow = true;
  scene.add(sun);
  sun.shadow.mapSize.width = 256;
  sun.shadow.mapSize.height = 256;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
}
function addPathTree() {
  var options = [0, 1, 2];
  var lane = Math.floor(Math.random() * 3);
  addTree(true, lane);
  options.splice(lane, 1);
  if (Math.random() > 0.5) {
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
}
function addWorldTrees() {
  var numTrees = 36;
  var gap = 6.28 / 36;
  for (var i = 0; i < numTrees; i++) {
    addTree(false, i * gap, true);
    addTree(false, i * gap, false);
  }
}

function addTree(inPath, row, isLeft) {
  var newTree;
  if (inPath) {
    if (treesPool.length == 0) return;
    newTree = treesPool.pop();
    newTree.visible = true;
    treesInPath.push(newTree);
    sphericalHelper.set(
      worldRadius - 0.3,
      pathAngleValues[row],
      -rollingGroundSphere.rotation.x + 4
    );
  } else {
    newTree = createTree();
    var forestAreaAngle = 0;
    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTree.position.setFromSpherical(sphericalHelper);
  var rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  var treeVector = newTree.position.clone().normalize();
  newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
  newTree.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

  rollingGroundSphere.add(newTree);
}

function createTree() {
  var sides = 8;
  var tiers = 6;
  var scalarMultiplier = Math.random() * (0.25 - 0.1) + 0.05;
  var midPointVector = new THREE.Vector3();
  var treeGeometry = new THREE.ConeGeometry(0.5, 1, sides, tiers);
  var treeMaterial = new THREE.MeshStandardMaterial({
    color: 0x33ff33,
    shading: THREE.FlatShading,
  });
  midPointVector = treeGeometry.vertices[0].clone();
  
  blowUpTree(treeGeometry.vertices, sides, 0, scalarMultiplier);
  tightenTree(treeGeometry.vertices, sides, 1);
  blowUpTree(treeGeometry.vertices, sides, 2, scalarMultiplier * 1.1, true);
  tightenTree(treeGeometry.vertices, sides, 3);
  blowUpTree(treeGeometry.vertices, sides, 4, scalarMultiplier * 1.2);
  tightenTree(treeGeometry.vertices, sides, 5);

  var treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop.castShadow = true;
  treeTop.receiveShadow = false;
  treeTop.position.y = 0.9;
  treeTop.rotation.y = Math.random() * Math.PI;

  var treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
  var trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0xc28830,
    shading: THREE.FlatShading,
  });
  var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
  treeTrunk.position.y = 0.25;

  var tree = new THREE.Object3D();
  tree.add(treeTrunk);
  tree.add(treeTop);
  return tree;
}

function blowUpTree(vertices, sides, currentTier, scalarMultiplier, odd) {
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var midPointVector = vertices[0].clone();
  var offset;
  for (var i = 0; i < sides; i++) {
    vertexIndex = currentTier * sides + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    if (odd) {
      if (i % 2 === 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y =
          vertices[i + vertexIndex + sides].y + 0.05;
      }
    } else {
      if (i % 2 !== 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y =
          vertices[i + vertexIndex + sides].y + 0.05;
      }
    }
  }
}

function tightenTree(vertices, sides, currentTier) {
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var midPointVector = vertices[0].clone();
  var offset;
  for (var i = 0; i < sides; i++) {
    vertexIndex = currentTier * sides + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    offset.normalize().multiplyScalar(0.06);
    vertices[i + vertexIndex].sub(offset);
  }
}

function update() {
  if (!paused) {
    rollingGroundSphere.rotation.x += rollingSpeed;
    ball.rotation.x -= ballRollingSpeed;
    if (ball.position.y <= heroBaseY) {
      jumping = false;
      bounceValue = Math.random() * 0.04 + 0.005;
    }
    ball.position.y += bounceValue;
    ball.position.x = THREE.Math.lerp(
      ball.position.x,
      currentLane,
      2 * clock.getDelta()
    ); 
    bounceValue -= gravity;
    if (clock.getElapsedTime() > treeReleaseInterval) {
      clock.start();
      addPathTree();
  
      score += 1;
      scoreText.innerHTML = `Score: ${score.toString()}`;
    }
  
    doTreeLogic();
    doExplosionLogic();
    render();
    doDifficultyLogic();
  }
  requestAnimationFrame(update);
}

function doTreeLogic() {
  var oneTree;
  var treePos = new THREE.Vector3();
  var treesToRemove = [];
  treesInPath.forEach(function (element, index) {
    oneTree = treesInPath[index];
    treePos.setFromMatrixPosition(oneTree.matrixWorld);
    if (treePos.z > 6 && oneTree.visible) {
      treesToRemove.push(oneTree);
    } else {
      if (treePos.distanceTo(ball.position) <= 0.6) {
        if (score > highScore) {
          highText.innerHTML = `High Score: ${score.toString()}`
          highScore = score;
        }
        score = 0;
        explode();
      }
    }
  });
  var fromWhere;
  treesToRemove.forEach(function (element, index) {
    oneTree = treesToRemove[index];
    fromWhere = treesInPath.indexOf(oneTree);
    treesInPath.splice(fromWhere, 1);
    treesPool.push(oneTree);
    oneTree.visible = false;
  });
}

function doExplosionLogic() {
  if (!explodeParticles.visible) {
    explodeParticles.material.opacity = 1;
    return;
  }
  for (var i = 0; i < particleCount; i++) {
    explodeParticleGeometry.vertices[i].multiplyScalar(explosionPower);
  }
  if (explosionPower > 1.005) {
    explosionPower -= 0.001;
    explodeParticles.material.opacity -= 0.025;
  } else {
    explodeParticles.visible = false;
  }
  explodeParticleGeometry.verticesNeedUpdate = true;
}

function explode() {
  explodeParticles.position.y = 2;
  explodeParticles.position.z = 4.8;
  explodeParticles.position.x = ball.position.x;
  for (var i = 0; i < particleCount; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = -0.2 + Math.random() * 0.4;
    vertex.y = -0.2 + Math.random() * 0.4;
    vertex.z = -0.2 + Math.random() * 0.4;
    explodeParticleGeometry.vertices[i] = vertex;
  }
  explosionPower = 1.07;
  explodeParticles.visible = true;
}

function doDifficultyLogic() {
  if (score === 0) {
    rollingSpeed = 0.008;
  } else if (rollingSpeed < 0.0095) {
    rollingSpeed += 0.00001
  }
  
  if (score === 0) {
    treeReleaseInterval = 0.5;
  } else if (treeReleaseInterval > 0.2) {
    treeReleaseInterval -= Math.log(score) / 1000
  }
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  sceneHeight = window.innerHeight - 20;
  sceneWidth = window.innerWidth - 20;
  titleText.style.left = window.innerWidth / 2 - 190 + "px";
  if(window.innerWidth < 600) {
    titleText.style.fontSize = 24 + "px";
    titleText.style.left = window.innerWidth / 2 - 142.5 + "px";
  } else {
    titleText.style.fontSize = 32 + "px";
    titleText.style.left = window.innerWidth / 2 - 190 + "px";
  }
  
  if(window.innerWidth < 600) {
    pausedText.style.fontSize = 12 + "px";
    pausedText.style.top = 45 + "px";
    pausedText.style.left = 15 + "px";
  } else {
    pausedText.style.fontSize = 24 + "px";
    pausedText.style.top = 50 + "px";
    pausedText.style.left = 30 + "px";
  }
  
  if(window.innerWidth < 600) {
    scoreText.style.fontSize = 12 + "px";
    scoreText.style.top = 65 + "px";
    scoreText.style.left = 15 + "px";
  } else {
    scoreText.style.fontSize = 24 + "px";
    scoreText.style.top = 80 + "px";
    scoreText.style.left = 30 + "px";
  }
  
  if(window.innerWidth < 600) {
    highText.style.fontSize = 12 + "px";
    highText.style.top = 85 + "px";
    highText.style.left = 15 + "px";
  } else {
    highText.style.fontSize = 24 + "px";
    highText.style.top = 110 + "px";
    highText.style.left = 30 + "px";
  }
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}

// https://stackoverflow.com/questions/15084675/how-to-implement-swipe-gestures-for-mobile-devices/58719294#58719294
function detectSwipe(id, func, deltaMin = 90) {
  const swipe_det = {
    sX: 0,
    sY: 0,
    eX: 0,
    eY: 0
  }

  const directions = Object.freeze({
    UP: 'up',
    DOWN: 'down',
    RIGHT: 'right',
    LEFT: 'left'
  })
  let direction = null
  const el = document.getElementById(id)
  el.addEventListener('touchstart', function(e) {
    const t = e.touches[0]
    swipe_det.sX = t.screenX
    swipe_det.sY = t.screenY
  }, false)
  el.addEventListener('touchmove', function(e) {
    // e.preventDefault();
    const t = e.touches[0]
    swipe_det.eX = t.screenX
    swipe_det.eY = t.screenY
  }, false)
  el.addEventListener('touchend', function(e) {
    const deltaX = swipe_det.eX - swipe_det.sX
    const deltaY = swipe_det.eY - swipe_det.sY

    if (deltaX ** 2 + deltaY ** 2 < deltaMin ** 2) return

    if (deltaY === 0 || Math.abs(deltaX / deltaY) > 1)
      direction = deltaX > 0 ? directions.LEFT : directions.RIGHT
    else
      direction = deltaY > 0 ? directions.DOWN : directions.UP

    if (direction && typeof func === 'function') func(el, direction)

    direction = null
  }, false)
}

detectSwipe('body', (el, dir) => handleSwipe(dir));