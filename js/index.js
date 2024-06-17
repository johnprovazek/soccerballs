import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

// Viewer mode options: 'debug', 'stitch', or 'default'.
// 'debug' : Adds debug features to help with development.
// 'stitch' : Adds a stitching overlay to panels.
// 'default' : No added styling or debugging features.
let mode = "stitch";

// Geometry and texture variables.
var soccerBalls; // JSON object containing position vertices, uv mapping, and texture information.
let soccerBallIndex = 0; // Index to track current soccer ball being displayed in viewer.
var geometry = null; // Geometry containing soccer ball vertices.
var mesh = null; // Soccer ball mesh.
var materials = []; // List of materials for each soccer ball design.
let textures = {}; // Key-pair mapping of textures on the soccer balls.
let images = []; // List of keys to images that have been loaded and updated in the textures and materials.
let stitchImages = [null, null]; // Hexagon and pentagon stitch images.

// Defining soccer ball hexagon and pentagon shape details.
let shapes = [
  {
    type: "hexagon",
    count: 20,
    triangles: 54,
    sides: 6,
    coordinates: [
      [0.5, 0.788675135],
      [0.75, 0.644337567],
      [0.75, 0.355662433],
      [0.5, 0.211324865],
      [0.25, 0.355662433],
      [0.25, 0.644337567],
    ],
  },
  {
    type: "pentagon",
    count: 12,
    triangles: 45,
    sides: 5,
    coordinates: [
      [0.5, 0.729396987],
      [0.718169499, 0.570887567],
      [0.634836166, 0.314413939],
      [0.365163834, 0.314413939],
      [0.281830501, 0.570887567],
    ],
  },
];

// Camera variables.
let distance = 5; // Camera start distance.
let diameter = 2; // Soccer ball diameter.
let marginPercentage = 10; // Margin percentage between soccer ball and window border to allow for name and buttons.
let paddingPercentage = 2; // Extra padding between soccer ball and window border.

// Full height of the soccer ball and window border that is used to position the soccer ball in the viewer.
let fullHeight = diameter / (1 - (marginPercentage + paddingPercentage) / 50);

// Setting up three.js
const textureLoader = new THREE.TextureLoader();
let container = document.getElementById("soccer-ball-viewer-container");
let initialAspectRatio = container.clientWidth / container.clientHeight;
let fov = getFov(fullHeight, initialAspectRatio, distance);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, initialAspectRatio, 1, 10);
camera.position.set(0, 0, distance);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
const controls = new TrackballControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 8;
controls.zoomSpeed = 0.8;
controls.rotateSpeed = 2;
controls.noPan = true;

// Window onload function.
window.onload = () => {
  loadJSON("data/soccerballs.json", function (text) {
    // Parsing JSON file containing position vertices, uv mapping, and texture information into an object.
    soccerBalls = JSON.parse(text);
    // Removing debug soccer ball if not in debug mode.
    if (mode != "debug" && soccerBalls["designs"].some((d) => d.name.toLowerCase() === "debug")) {
      let debugIndex = soccerBalls["designs"].findIndex((d) => d.name.toLowerCase() === "debug");
      soccerBalls["designs"].splice(debugIndex, 1);
    }
    // Making the soccer ball buttons visible if there is more than one design.
    if (soccerBalls["designs"].length > 1) {
      const buttons = document.querySelectorAll(".soccer-ball-button");
      buttons.forEach((button) => {
        button.classList.remove("hidden");
      });
    }
    loadDefaultTexture(); // Loads default textures to be overwritten.
    loadDefaultMaterial(); // Loads default materials to be overwritten.
    loadGeometry(); // Handles loading position, uv mapping, and groups for each shape.
    loadMesh(); // Loads mesh with default textures, material and geometry.
    loadSoccerBall(0); // Handles loading the soccer ball design.
    loadDebugging(); // Handles loading debugging features if they're enabled.
    animate(); // Runs the animation routine.
    // Handles pressing the 'previous' soccer ball button.
    document.getElementById("soccer-ball-button-prev").addEventListener("click", () => {
      changeSoccerBall(-1);
    });
    // Handles pressing the 'next' soccer ball button.
    document.getElementById("soccer-ball-button-next").addEventListener("click", () => {
      changeSoccerBall(1);
    });
    // Adjusting the controls rotation speed based on the camera distance.
    controls.addEventListener("change", () => {
      let cameraDistance = Math.sqrt(
        Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) + Math.pow(camera.position.z, 2)
      );
      controls.rotateSpeed = cameraDistance < 5 ? (cameraDistance - 2) / 3 + 0.5 : 2;
    });
  });
};

// Window onresize function.
window.onresize = () => {
  let aspect = container.clientWidth / container.clientHeight;
  camera.fov = getFov(fullHeight, aspect, distance);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  controls.handleResize();
};

// Handles loading in a JSON file.
function loadJSON(file, callback) {
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

// Scales the camera field of view to keep the sphere in view at the starting distance.
function getFov(diameter, aspect, distance) {
  let a = diameter / 2;
  let b = distance;
  if (aspect < 1) {
    a = a / aspect;
  }
  let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  return Math.asin(a / c) * (180 / Math.PI) * 2;
}

// Loads default textures to be overwritten.
function loadDefaultTexture() {
  const transparentTexture = textureLoader.load(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC"
  );
  for (let i = 0; i < shapes.length; i++) {
    let type = shapes[i]["type"];
    let sides = shapes[i]["sides"];
    for (let j = 0; j < soccerBalls["designs"].length; j++) {
      for (let k = 0; k < soccerBalls["designs"][j][type].length; k++) {
        let panelName = soccerBalls["designs"][j][type][k]["t"];
        let key = panelName + "_" + type;
        textures[key] = Array(sides).fill(transparentTexture);
      }
    }
  }
}

// Loads default materials to be overwritten.
function loadDefaultMaterial() {
  for (let i = 0; i < soccerBalls["designs"].length; i++) {
    let material = [];
    for (let j = 0; j < shapes.length; j++) {
      let type = shapes[j]["type"];
      for (let k = 0; k < soccerBalls["designs"][i][type].length; k++) {
        let panelName = soccerBalls["designs"][i][type][k]["t"];
        let key = panelName + "_" + type;
        material.push(
          new THREE.MeshBasicMaterial({
            map: textures[key][0],
            side: THREE.BackSide,
            transparent: true,
          })
        );
      }
      materials.push(material);
    }
  }
}

// Handles loading position, uv mapping, and groups for each shape.
function loadGeometry() {
  geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(Float32Array.from(soccerBalls["object"]["v"]), 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(Float32Array.from(soccerBalls["object"]["uv"]), 3));
  geometry.computeVertexNormals();
  geometry.clearGroups();
  // Creating group for each hexagon and pentagon.
  let groupIndex = 0;
  let startIndex = 0;
  for (let i = 0; i < shapes.length; i++) {
    for (let j = 0; j < shapes[i]["count"]; j++) {
      let endIndex = startIndex + shapes[i]["triangles"] * 3;
      geometry.addGroup(startIndex, endIndex, groupIndex);
      startIndex = endIndex;
      groupIndex = groupIndex + 1;
    }
  }
}

// Loads mesh with default textures, material and geometry.
function loadMesh() {
  mesh = new THREE.Mesh(geometry, materials[0]);
  scene.add(mesh);
}

// Handles loading the soccer ball design.
function loadSoccerBall(index) {
  // Checking for missing images.
  let missingImages = [];
  for (let i = 0; i < shapes.length; i++) {
    let type = shapes[i]["type"];
    for (let j = 0; j < soccerBalls["designs"][index][type].length; j++) {
      let panelName = soccerBalls["designs"][index][type][j]["t"];
      let key = panelName + "_" + type;
      if (!images.includes(key) && !missingImages.some((m) => m.key === key)) {
        missingImages.push({
          key: key,
          type: type,
          path: "images/textures/panels/" + type + "/" + panelName + ".png",
        });
      }
    }
  }
  // Loading textures and materials if missing images and updating the mesh if not.
  if (missingImages.length) {
    // Need to load the stitch textures prior to loading panel textures.
    if ((mode === "stitch" || mode === "debug") && stitchImages.some((s) => s === null)) {
      let stitchImagesLoaded = 0;
      for (let i = 0; i < shapes.length; i++) {
        const stitchImage = new Image();
        stitchImage.onload = function () {
          stitchImages[i] = stitchImage;
          stitchImagesLoaded = stitchImagesLoaded + 1;
          if (stitchImagesLoaded === stitchImages.length) {
            loadTextures();
          }
        };
        stitchImage.src = "images/textures/templates/" + shapes[i]["type"] + "/stitch.png";
      }
    } else {
      loadTextures();
    }
  } else {
    updateMesh();
  }
  // Loading textures.
  function loadTextures() {
    let numImagesLoaded = 0;
    let numTexturesLoaded = 0;
    let totalTextures = 0;
    for (let i = 0; i < missingImages.length; i++) {
      totalTextures = totalTextures + shapes.find((s) => s.type === missingImages[i]["type"])["sides"];
    }
    for (let i = 0; i < missingImages.length; i++) {
      const image = new Image();
      image.onload = function () {
        // Rotating images and creating textures.
        const rotationTextures = [];
        const shapeType = missingImages[i]["type"];
        var numSides = shapes.find((s) => s.type === shapeType)["sides"];
        for (let j = 0; j < numSides; j++) {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          context.translate(canvas.width / 2, canvas.height / 2);
          context.rotate((Math.PI / 180) * (360 / numSides) * j * -1);
          context.translate(-(canvas.width / 2), -(canvas.height / 2));
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          if (mode === "stitch" || mode === "debug") {
            let stitchIndex = shapes.findIndex((s) => s.type === shapeType);
            context.drawImage(stitchImages[stitchIndex], 0, 0, canvas.width, canvas.height);
          }
          if (mode === "debug") {
            context.fillStyle = "white";
            context.font = "600 80px Courier";
            context.strokeStyle = "black";
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.lineWidth = 15;
            let rotationNumberText = "R:" + j;
            context.strokeText(rotationNumberText, canvas.width / 2, canvas.height / 2);
            context.fillText(rotationNumberText, canvas.width / 2, canvas.height / 2);
            // Adding numbers to indicate base of rotations.
            for (let k = 0; k < numSides; k++) {
              let rotationNum = (j + k) % numSides;
              let rotationCoordinates = shapes.find((s) => s.type === shapeType)["coordinates"][k];
              context.strokeText(
                rotationNum,
                canvas.width * rotationCoordinates[0],
                canvas.height * rotationCoordinates[1]
              );
              context.fillText(
                rotationNum,
                canvas.width * rotationCoordinates[0],
                canvas.height * rotationCoordinates[1]
              );
            }
          }
          const rotationTexture = textureLoader.load(canvas.toDataURL("image/png"), function (texture) {
            numTexturesLoaded = numTexturesLoaded + 1;
            if (numImagesLoaded === missingImages.length && numTexturesLoaded === totalTextures) {
              updateMaterials();
            }
          });
          rotationTexture.colorSpace = THREE.SRGBColorSpace;
          rotationTexture.center = new THREE.Vector2(0.5, 0.5);
          rotationTexture.flipY = false;
          rotationTextures.push(rotationTexture);
        }
        images.push(missingImages[i]["key"]);
        textures[missingImages[i]["key"]] = rotationTextures;
        numImagesLoaded = numImagesLoaded + 1;
        if (numImagesLoaded === missingImages.length && numTexturesLoaded === totalTextures) {
          updateMaterials();
        }
      };
      image.src = missingImages[i]["path"];
    }
  }
  // Updating materials.
  function updateMaterials() {
    let material = [];
    for (let i = 0; i < shapes.length; i++) {
      let type = shapes[i]["type"];
      for (let j = 0; j < soccerBalls["designs"][index][type].length; j++) {
        let panelName = soccerBalls["designs"][index][type][j]["t"];
        let key = panelName + "_" + type;
        let rotation = soccerBalls["designs"][index][type][j]["r"];
        if (rotation < 0 || rotation > shapes[i]["sides"] - 1) {
          alert(
            "Invalid rotation value (" +
              rotation +
              ") used. For " +
              shapes[i]["name"] +
              " shapes use a number from 0 to " +
              String(shapes[i]["sides"] - 1) +
              ". Setting rotation value to 0."
          );
          rotation = 0;
        }
        material.push(
          new THREE.MeshBasicMaterial({
            map: textures[key][rotation],
            side: THREE.BackSide,
          })
        );
      }
    }
    materials[index] = material;
    updateMesh();
  }
  // Updating mesh.
  function updateMesh() {
    mesh.material = materials[index];
    // Adding soccer ball name (Trims names longer than 16 characters).
    const soccerBallName = document.querySelector("#soccer-ball-name-text");
    let name = soccerBalls["designs"][index]["name"];
    soccerBallName.textContent = name.length > 16 ? name.slice(0, 16) : name;
    // Updating the soccer ball index.
    soccerBallIndex = index;
  }
}

// Handles changing the soccer ball index.
function changeSoccerBall(value) {
  let totalSoccerBalls = soccerBalls["designs"].length;
  soccerBallIndex = soccerBallIndex + value;
  if (soccerBallIndex > totalSoccerBalls - 1) {
    soccerBallIndex = 0;
  } else if (soccerBallIndex < 0) {
    soccerBallIndex = totalSoccerBalls - 1;
  }
  loadSoccerBall(soccerBallIndex);
}

// Handles loading debugging features if they're enabled.
function loadDebugging() {
  if (mode === "debug") {
    // Adding wireframe to sphere.
    var wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    mesh.add(wireframe);
    // Adding helper axes X (red), Y (green), Z (blue).
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Adding points to the viewer to help with vertices and texture mapping.
    let group = new THREE.Group();
    scene.add(group);
    const loader = new THREE.TextureLoader();
    const dotTexture = loader.load("images/dot.png");
    dotTexture.colorSpace = THREE.SRGBColorSpace;
    const dots = [];
    let collection = [0, 15, 50, 79, 142, 160]; // Collection of vertices to plot on graph.
    let pArray = geometry.attributes.position.array;
    for (let i = 0; i < collection.length; i++) {
      let x = collection[i] * 3;
      const v = new THREE.Vector3(pArray[x], pArray[x + 1], pArray[x + 2]);
      dots.push(v);
    }
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xffff00,
      map: dotTexture,
      size: 0.2,
      alphaTest: 0.5,
    });
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(dots);
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);
  }
}

// Runs the animation routine.
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
