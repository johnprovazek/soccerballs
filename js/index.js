import * as THREE from "three";
import { TrackballControls } from "three-trackball-controls";
import { getFov } from "./utils.js";
import {
  CAMERA_START_DISTANCE,
  FAR_PLANE,
  MARGIN_PERCENTAGE,
  MAX_DISTANCE,
  MIN_DISTANCE,
  NEAR_PLANE,
  PADDING_PERCENTAGE,
  ROTATE_SPEED,
  SOCCER_BALL_DIAMETER,
  SOCCER_BALL_NAME_CHARACTER_LIMIT,
  TRANSPARENT_PNG_URI,
  ZOOM_SPEED,
} from "./constants.js";

// HTML Elements.
const soccerBallViewer = document.getElementById("soccer-ball-viewer");
const prevButton = document.getElementById("soccer-ball-button-prev");
const nextButton = document.getElementById("soccer-ball-button-next");
const loadingSymbol = document.getElementById("loading-symbol");
const soccerBallName = document.querySelector("#soccer-ball-name-text");
const soccerBallButtons = document.querySelectorAll(".soccer-ball-button");

// Geometry and texture variables.
let soccerBalls; // JSON object containing position vertices, UV mapping, and texture information.
let soccerBallIndex = 0; // Index to track current soccer ball being displayed in viewer.
let geometry = null; // Geometry containing soccer ball vertices.
let mesh = null; // Soccer ball mesh.
let materials = []; // List of materials for each soccer ball design.
let textures = {}; // Key-pair mapping of textures on the soccer balls.
let images = []; // List of keys to images that have been loaded and updated in the textures and materials.
let stitchImages = [null, null]; // Hexagon and pentagon stitch images.

// Defining soccer ball hexagon and pentagon shape details.
const shapes = [
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

// Full height of the soccer ball and window border that is used to position the soccer ball in the viewer.
const fullHeight = SOCCER_BALL_DIAMETER / (1 - (MARGIN_PERCENTAGE + PADDING_PERCENTAGE) / 50);

// Soccer ball viewer mode (debug, stitch, or default).
const MODE = "stitch";

// Setting up three.js
const textureLoader = new THREE.TextureLoader();
const initialAspectRatio = soccerBallViewer.clientWidth / soccerBallViewer.clientHeight;
const fieldOfView = getFov(fullHeight, initialAspectRatio, CAMERA_START_DISTANCE);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fieldOfView, initialAspectRatio, NEAR_PLANE, FAR_PLANE);
camera.position.set(0, 0, CAMERA_START_DISTANCE);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const threeCanvas = renderer.domElement;
renderer.setSize(soccerBallViewer.clientWidth, soccerBallViewer.clientHeight);
soccerBallViewer.appendChild(renderer.domElement);
const controls = new TrackballControls(camera, renderer.domElement);
controls.minDistance = MIN_DISTANCE;
controls.maxDistance = MAX_DISTANCE;
controls.zoomSpeed = ZOOM_SPEED;
controls.rotateSpeed = ROTATE_SPEED;
controls.noPan = true;

// Window onload function.
window.onload = () => {
  loadJSON("data/soccer-balls.json", (text) => {
    // Parsing JSON file containing position vertices, UV mapping, and texture information into an object.
    soccerBalls = JSON.parse(text);
    // Removing debug soccer ball if not in debug mode.
    if (MODE != "debug" && soccerBalls["designs"].some((d) => d.name.toLowerCase() === "debug")) {
      const debugIndex = soccerBalls["designs"].findIndex((d) => d.name.toLowerCase() === "debug");
      soccerBalls["designs"].splice(debugIndex, 1);
    }
    loadDefaultTexture(); // Loads default textures to be overwritten.
    loadDefaultMaterial(); // Loads default materials to be overwritten.
    loadGeometry(); // Handles loading position, UV mapping, and groups for each shape.
    loadMesh(); // Loads mesh with default textures, material and geometry.
    loadSoccerBall(0); // Handles loading the soccer ball design.
    loadDebugging(); // Handles loading debugging features if they're enabled.
    animate(); // Runs the animation routine.
    // Handles pressing the previous soccer ball button.
    prevButton.addEventListener("click", () => {
      changeSoccerBall(-1);
    });
    // Handles pressing the next soccer ball button.
    nextButton.addEventListener("click", () => {
      changeSoccerBall(1);
    });
    // Adjusting the controls rotation speed based on the camera distance.
    controls.addEventListener("change", () => {
      const cameraDistance = Math.sqrt(
        Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) + Math.pow(camera.position.z, 2)
      );
      controls.rotateSpeed = cameraDistance < 5 ? (cameraDistance - 2) / 3 + 0.5 : ROTATE_SPEED;
    });
  });
};

// Window onresize function.
window.onresize = () => {
  const aspect = soccerBallViewer.clientWidth / soccerBallViewer.clientHeight;
  camera.fov = getFov(fullHeight, aspect, CAMERA_START_DISTANCE);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(soccerBallViewer.clientWidth, soccerBallViewer.clientHeight);
  controls.handleResize();
};

// Handles loading in a JSON file.
const loadJSON = (file, callback) => {
  const rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
};

// Loads default textures to be overwritten.
const loadDefaultTexture = () => {
  const transparentTexture = textureLoader.load(TRANSPARENT_PNG_URI);
  for (let i = 0; i < shapes.length; i++) {
    const type = shapes[i]["type"];
    const sides = shapes[i]["sides"];
    for (let j = 0; j < soccerBalls["designs"].length; j++) {
      for (let k = 0; k < soccerBalls["designs"][j][type].length; k++) {
        const panelName = soccerBalls["designs"][j][type][k]["t"];
        const key = `${panelName}_${type}`;
        textures[key] = Array(sides).fill(transparentTexture);
      }
    }
  }
};

// Loads default materials to be overwritten.
const loadDefaultMaterial = () => {
  for (let i = 0; i < soccerBalls["designs"].length; i++) {
    const material = [];
    for (let j = 0; j < shapes.length; j++) {
      const type = shapes[j]["type"];
      for (let k = 0; k < soccerBalls["designs"][i][type].length; k++) {
        const panelName = soccerBalls["designs"][i][type][k]["t"];
        const key = `${panelName}_${type}`;
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
};

// Handles loading position, uv mapping, and groups for each shape.
const loadGeometry = () => {
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
      const endIndex = startIndex + shapes[i]["triangles"] * 3;
      geometry.addGroup(startIndex, endIndex, groupIndex);
      startIndex = endIndex;
      groupIndex = groupIndex + 1;
    }
  }
};

// Loads mesh with default textures, material and geometry.
const loadMesh = () => {
  mesh = new THREE.Mesh(geometry, materials[0]);
  scene.add(mesh);
};

// Handles changing the soccer ball index.
const changeSoccerBall = (value) => {
  const totalSoccerBalls = soccerBalls["designs"].length;
  soccerBallIndex = (soccerBallIndex + value + totalSoccerBalls) % totalSoccerBalls;
  loadSoccerBall(soccerBallIndex);
};

// Handles loading the soccer ball design.
const loadSoccerBall = async (index) => {
  try {
    const missingImages = findMissingImages(index);
    if (missingImages.length > 0) {
      loadingSymbol.classList.remove("hidden");
      soccerBallViewer.classList.remove("grab-cursor");
      threeCanvas.classList.add("blur");
      await loadStitchImages();
      await loadPanelTextures(missingImages);
    }
    const newMaterials = updateMaterials(index);
    updateMeshAndUI(index, newMaterials);
  } catch (error) {
    console.error("Failed to load soccer ball design:", error);
    loadingSymbol.classList.add("hidden");
  }
};

// Checking for missing images.
const findMissingImages = (designIndex) => {
  const missingImages = [];
  const design = soccerBalls.designs[designIndex];
  for (const shape of shapes) {
    const type = shape.type;
    if (design[type]) {
      for (const panel of design[type]) {
        const panelName = panel.t;
        const key = `${panelName}_${type}`;
        if (!images.includes(key) && !missingImages.some((missingImage) => missingImage.key === key)) {
          missingImages.push({
            key: key,
            type: type,
            path: `images/textures/panels/${type}/${panelName}.png`,
          });
        }
      }
    }
  }
  return missingImages;
};

// Loads stitch images.
const loadStitchImages = () => {
  if (MODE === "default" || !stitchImages.some((stitchImage) => stitchImage === null)) {
    return Promise.resolve();
  }
  const promises = shapes.map((shape, i) => {
    if (stitchImages[i] === null) {
      return new Promise((resolve, reject) => {
        const stitchImage = new Image();
        stitchImage.onload = () => {
          stitchImages[i] = stitchImage;
          resolve();
        };
        stitchImage.onerror = reject;
        stitchImage.src = `images/textures/templates/${shape.type}/stitch.png`;
      });
    }
    return Promise.resolve();
  });
  return Promise.all(promises);
};

// Loads the base panel images and generates all the required rotated textures.
const loadPanelTextures = (newImages) => {
  const promises = newImages.map((newImageData) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = async () => {
        try {
          const shape = shapes.find((shape) => shape.type === newImageData.type);
          const stitchIndex = MODE !== "default" ? shapes.findIndex((shape) => shape.type === newImageData.type) : -1;
          const stitchImage = stitchIndex !== -1 ? stitchImages[stitchIndex] : null;
          const rotatedTextures = await createRotatedTexturesForImage(image, shape, stitchImage);
          images.push(newImageData.key);
          textures[newImageData.key] = rotatedTextures;
          resolve();
        } catch (error) {
          console.error(`Error processing image ${newImageData.key}:`, error);
          reject(error);
        }
      };
      image.onerror = (error) => {
        console.error(`Failed to load image: ${newImageData.path}`);
        reject(error);
      };
      image.src = newImageData.path;
    });
  });
  return Promise.all(promises);
};

// Creates rotated textures for a base image.
const createRotatedTexturesForImage = (baseImage, shape, stitchImage) => {
  const numSides = shape.sides;
  const texturePromises = [];
  for (let i = 0; i < numSides; i++) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((Math.PI / 180) * (360 / numSides) * i * -1);
    context.translate(-canvas.width / 2, -canvas.height / 2);
    context.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);
    if ((MODE === "stitch" || MODE === "debug") && stitchImage) {
      context.drawImage(stitchImage, 0, 0, canvas.width, canvas.height);
    }
    if (MODE === "debug") {
      drawDebugInfo(context, canvas, i, shape);
    }
    const texturePromise = new Promise((resolve) => {
      const dataURL = canvas.toDataURL("image/png");
      textureLoader.load(dataURL, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.center = new THREE.Vector2(0.5, 0.5);
        texture.flipY = false;
        resolve(texture);
      });
    });
    texturePromises.push(texturePromise);
  }
  return Promise.all(texturePromises);
};

// Draws debug info on panel.
const drawDebugInfo = (context, canvas, rotationIndex, shape) => {
  context.fillStyle = "white";
  context.font = "600 80px Courier";
  context.strokeStyle = "black";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.lineWidth = 15;
  const rotationNumberText = `R:${rotationIndex}`;
  context.strokeText(rotationNumberText, canvas.width / 2, canvas.height / 2);
  context.fillText(rotationNumberText, canvas.width / 2, canvas.height / 2);
  const numSides = shape.sides;
  for (let k = 0; k < numSides; k++) {
    const sideNum = (rotationIndex + k) % numSides;
    const coords = shape.coordinates[k];
    context.strokeText(sideNum, canvas.width * coords[0], canvas.height * coords[1]);
    context.fillText(sideNum, canvas.width * coords[0], canvas.height * coords[1]);
  }
};

// Creates the material array for the selected design using loaded textures.
const updateMaterials = (designIndex) => {
  const material = [];
  const design = soccerBalls.designs[designIndex];
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    const type = shape.type;
    if (design[type]) {
      for (const panel of design[type]) {
        const panelName = panel.t;
        const key = `${panelName}_${type}`;
        let rotation = panel.r;
        if (rotation < 0 || rotation >= shape.sides) {
          console.warn(
            `Invalid rotation value (${rotation}) used for ${shape.name} (type ${type}). Expected 0 to ${
              shape.sides - 1
            }. Setting rotation to 0.`
          );
          rotation = 0;
        }
        if (textures[key] && textures[key][rotation]) {
          material.push(
            new THREE.MeshBasicMaterial({
              map: textures[key][rotation],
              side: THREE.BackSide,
            })
          );
        } else {
          console.error(`Texture not found for key: ${key}, rotation: ${rotation}. Using placeholder.`);
          material.push(new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.BackSide }));
        }
      }
    }
  }
  return material;
};

// Updates the mesh with new materials.
const updateMeshAndUI = (designIndex, newMaterials) => {
  mesh.material = newMaterials;
  materials[designIndex] = newMaterials;
  const design = soccerBalls.designs[designIndex];
  const name = design.name;
  soccerBallName.textContent =
    name.length > SOCCER_BALL_NAME_CHARACTER_LIMIT ? name.slice(0, SOCCER_BALL_NAME_CHARACTER_LIMIT) : name;
  soccerBallIndex = designIndex;
  const showButtons = soccerBalls.designs.length > 1;
  soccerBallButtons.forEach((button) => {
    button.classList.toggle("hidden", !showButtons);
  });
  loadingSymbol.classList.add("hidden");
  soccerBallViewer.classList.add("grab-cursor");
  threeCanvas.classList.remove("blur");
};

// Handles loading debugging features if they're enabled.
const loadDebugging = () => {
  if (MODE === "debug") {
    // Adding wireframe to sphere.
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    mesh.add(wireframe);
    // Adding helper axes X (red), Y (green), Z (blue).
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // Adding points to the viewer to help with vertices and texture mapping.
    const group = new THREE.Group();
    scene.add(group);
    const dotTexture = textureLoader.load("images/dot.png");
    dotTexture.colorSpace = THREE.SRGBColorSpace;
    const dots = [];
    const collection = [0, 15, 50, 79, 142, 160]; // Collection of vertices to plot on graph.
    const pArray = geometry.attributes.position.array;
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
};

// Runs the animation routine.
const animate = () => {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
