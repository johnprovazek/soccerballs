import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { createTextureFromCanvas, drawStrokedText, fetchJSON, getBaseUrl, getFov, scaleUV } from "./utils.js";
import * as CONFIG from "./constants.js";
import type { MissingTexture, Shape, SoccerBallData } from "./types.js";

// HTML elements.
let soccerBallViewer: HTMLDivElement;
let prevButton: HTMLDivElement;
let nextButton: HTMLDivElement;
let loadingSymbol: HTMLDivElement;
let soccerBallName: SVGTextElement;
let soccerBallButtons: NodeListOf<HTMLDivElement>;
let threeCanvas: HTMLCanvasElement;

// three.js engine variables.
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: TrackballControls;

// three.js meshes.
const baseMesh: THREE.Mesh = new THREE.Mesh(new THREE.BufferGeometry(), []);
const stitchMesh: THREE.Mesh = new THREE.Mesh(new THREE.BufferGeometry(), []);
const debugMesh: THREE.Mesh = new THREE.Mesh(new THREE.BufferGeometry(), []);

// Soccer ball data.
let soccerBallIndex: number = 0;
let isBallLoading: boolean = false;
let soccerBallsData!: SoccerBallData;
const baseTextureMap: Record<string, THREE.Texture[]> = {};
const debugTextureMap: Record<string, THREE.Texture[]> = {};
const stitchTextureMap: Record<string, THREE.Texture> = {};

window.onload = async () => {
  // Setting up HTML elements.
  soccerBallViewer = document.getElementById("soccer-ball-viewer") as HTMLDivElement;
  prevButton = document.getElementById("soccer-ball-button-prev") as HTMLDivElement;
  nextButton = document.getElementById("soccer-ball-button-next") as HTMLDivElement;
  loadingSymbol = document.getElementById("loading-symbol") as HTMLDivElement;
  soccerBallName = document.querySelector("#soccer-ball-name-text") as SVGTextElement;
  soccerBallButtons = document.querySelectorAll<HTMLDivElement>(".soccer-ball-button");

  // Setting up three.js.
  const viewerWidth = soccerBallViewer.clientWidth;
  const viewerHeight = soccerBallViewer.clientHeight;
  const aspect = viewerWidth / viewerHeight;
  const fov = getFov(CONFIG.FULL_HEIGHT, aspect, CONFIG.CAMERA_START_DISTANCE);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, aspect, CONFIG.NEAR_PLANE, CONFIG.FAR_PLANE);
  camera.position.set(0, 0, CONFIG.CAMERA_START_DISTANCE);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  threeCanvas = renderer.domElement;
  renderer.setSize(viewerWidth, viewerHeight);
  soccerBallViewer.appendChild(threeCanvas);
  controls = new TrackballControls(camera, threeCanvas);
  controls.minDistance = CONFIG.MIN_DISTANCE;
  controls.maxDistance = CONFIG.MAX_DISTANCE;
  controls.zoomSpeed = CONFIG.ZOOM_SPEED;
  controls.rotateSpeed = CONFIG.ROTATE_SPEED;
  controls.noPan = CONFIG.NO_PAN;

  // Setting up application.
  try {
    // Fetching soccer ball data.
    soccerBallsData = await fetchJSON<SoccerBallData>(getBaseUrl("data/soccer-balls.json"));

    // Setting up geometry and meshes.
    const geometry = buildGeometry(soccerBallsData);
    setupMeshLayer(baseMesh, geometry, true);
    setupMeshLayer(stitchMesh, geometry, CONFIG.SHOW_STITCHES);
    setupMeshLayer(debugMesh, geometry, CONFIG.SHOW_DEBUG);

    // Setting up stitch textures.
    if (CONFIG.SHOW_STITCHES) {
      await initializeStitchTextures();
    }

    // Adding debug ball and debugging features.
    if (CONFIG.SHOW_DEBUG) {
      soccerBallsData.designs.unshift(CONFIG.DEBUG_BALL_DESIGN);
      addDebuggingFeatures(geometry);
    }

    // Loading the active soccer ball.
    await loadActiveSoccerBall();

    // Running the animation routine.
    animate();

    // Setting up event listeners.
    prevButton.addEventListener("click", () => handleNavigation(-1));
    nextButton.addEventListener("click", () => handleNavigation(1));
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    controls.addEventListener("change", handleControls);
  } catch (error) {
    console.error("Initialization failure:", error);
    setLoadingState(false);
    soccerBallName.textContent = "Error";
  }
};

window.onresize = () => {
  const viewerWidth = soccerBallViewer.clientWidth;
  const viewerHeight = soccerBallViewer.clientHeight;
  const aspect = viewerWidth / viewerHeight;
  camera.fov = getFov(CONFIG.FULL_HEIGHT, aspect, CONFIG.CAMERA_START_DISTANCE);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(viewerWidth, viewerHeight);
  controls.handleResize();
};

// Runs the animation routine.
const animate = (): void => {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

// Loads in the hexagon and pentagon stitch textures.
const initializeStitchTextures = async (): Promise<void> => {
  await Promise.all(
    CONFIG.SHAPES.map(async (shape) => {
      try {
        const image = await loadImage(`images/${shape.type}/stitch.svg`);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        stitchTextureMap[shape.type] = createTextureFromCanvas(canvas);
      } catch (error) {
        console.error(`Failed to load stitch texture for ${shape.type}:`, error);
      }
    }),
  );
};

// Builds geometry including position, uv mapping, and groups for each shape.
const buildGeometry = (data: SoccerBallData): THREE.BufferGeometry => {
  const newGeometry = new THREE.BufferGeometry();
  newGeometry.setAttribute("position", new THREE.BufferAttribute(Float32Array.from(data.v), 3));
  const scaledUV = scaleUV(Float32Array.from(data.uv), CONFIG.UV_SCALE);
  newGeometry.setAttribute("uv", new THREE.BufferAttribute(scaledUV, 3));
  newGeometry.computeVertexNormals();
  let groupIndex = 0;
  let startIndex = 0;
  CONFIG.SHAPES.forEach(({ count, triangles }) => {
    for (let i = 0; i < count; i++) {
      newGeometry.addGroup(startIndex, triangles * 3, groupIndex);
      groupIndex++;
      startIndex += triangles * 3;
    }
  });
  return newGeometry;
};

// Sets up a mesh and adds it to the scene.
const setupMeshLayer = (mesh: THREE.Mesh, meshGeometry: THREE.BufferGeometry, shouldRender: boolean): void => {
  if (!shouldRender) {
    return;
  }
  mesh.geometry = meshGeometry;
  scene.add(mesh);
};

// Handles arrow key navigation, when pressing arrow keys down.
const handleKeyDown = (e: KeyboardEvent): void => {
  if (isBallLoading) {
    return;
  }
  if (e.key === "ArrowLeft") {
    prevButton.classList.add("active");
    handleNavigation(-1);
  } else if (e.key === "ArrowRight") {
    nextButton.classList.add("active");
    handleNavigation(1);
  }
};

// Handles arrow key navigation, when releasing arrow keys.
const handleKeyUp = (e: KeyboardEvent): void => {
  if (e.key === "ArrowLeft") {
    prevButton.classList.remove("active");
  } else if (e.key === "ArrowRight") {
    nextButton.classList.remove("active");
  }
};

// Handles soccer ball design navigation buttons.
const handleNavigation = (direction: number) => {
  if (isBallLoading) {
    return;
  }
  const totalSoccerBallsCount = soccerBallsData.designs.length;
  soccerBallIndex = (soccerBallIndex + direction + totalSoccerBallsCount) % totalSoccerBallsCount;
  loadActiveSoccerBall();
};

// Handles updating the rotation speed when controls change.
const handleControls = (): void => {
  const distance = camera.position.length();
  controls.rotateSpeed = distance < 5 ? (distance - 2) / 3 + 0.5 : CONFIG.ROTATE_SPEED;
};

// Loads the active soccer ball.
const loadActiveSoccerBall = async (): Promise<void> => {
  try {
    setLoadingState(true);
    const missingBaseTextures = findMissingBaseTextures();
    if (missingBaseTextures.length > 0) {
      await loadMissingBaseTextures(missingBaseTextures);
    }
    updateLayeredMaterials();

    // Updating HTML elements.
    const design = soccerBallsData.designs[soccerBallIndex];
    soccerBallName.textContent = design.name.slice(0, CONFIG.SOCCER_BALL_NAME_CHARACTER_LIMIT);
    setLoadingState(false);
  } catch (error) {
    console.error("Failed to swap ball view layers:", error);
    updateLayeredMaterials();
    soccerBallName.textContent = "Error";
    setLoadingState(false);
  }
};

// Toggles HTML element classes during loading.
const setLoadingState = (isLoading: boolean): void => {
  isBallLoading = isLoading;
  loadingSymbol.classList.toggle("hidden", !isLoading);
  soccerBallViewer.classList.toggle("grab-cursor", !isLoading);
  threeCanvas.classList.toggle("blur", isLoading);
  const disableButtons = isLoading || !soccerBallsData || soccerBallsData.designs.length <= 1;
  soccerBallButtons.forEach((button) => button.classList.toggle("disabled", disableButtons));
};

// Finds missing base textures on the current soccer ball.
const findMissingBaseTextures = (): MissingTexture[] => {
  const missingTextures: MissingTexture[] = [];
  const design = soccerBallsData.designs[soccerBallIndex];
  CONFIG.SHAPES.forEach((shape) => {
    design[shape.type].forEach((panel) => {
      const key = `${panel.d}_${shape.type}`;
      if (!baseTextureMap[key] && !missingTextures.some((image) => image.key === key)) {
        missingTextures.push({
          key,
          type: shape.type,
          path: `images/${shape.type}/${panel.d}`,
        });
      }
    });
  });
  return missingTextures;
};

// Loads missing base soccer ball textures.
const loadMissingBaseTextures = async (newBaseTextures: MissingTexture[]): Promise<void> => {
  const loadedBaseTextures: Record<string, THREE.Texture[]> = {};
  await Promise.all(
    newBaseTextures.map(async (newBaseTexture) => {
      try {
        const image = await loadImage(newBaseTexture.path);
        const shape = CONFIG.SHAPES.find((s) => s.type === newBaseTexture.type)!;
        const textures: THREE.Texture[] = [];
        const angle = (2 * Math.PI) / shape.sides;
        for (let i = 0; i < shape.sides; i++) {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.width = image.width;
          canvas.height = image.height;
          context.translate(canvas.width / 2, canvas.height / 2);
          context.rotate(-angle * i);
          context.translate(-canvas.width / 2, -canvas.height / 2);
          context.drawImage(image, 0, 0);
          textures.push(createTextureFromCanvas(canvas));
        }
        loadedBaseTextures[newBaseTexture.key] = textures;
      } catch (error) {
        console.error(`Failed to load base texture: ${newBaseTexture.path}`, error);
        throw error;
      }
    }),
  );
  Object.assign(baseTextureMap, loadedBaseTextures);
};

// Builds and applies materials to the mesh.
const updateLayeredMaterials = (): void => {
  const activeBaseMaterials: THREE.MeshBasicMaterial[] = [];
  const activeStitchMaterials: THREE.MeshBasicMaterial[] = [];
  const activeDebugMaterials: THREE.MeshBasicMaterial[] = [];

  // Building stitch materials.
  const stitchMaterials: Record<string, THREE.MeshBasicMaterial> = {};
  if (CONFIG.SHOW_STITCHES) {
    CONFIG.SHAPES.forEach((shape) => {
      stitchMaterials[shape.type] = new THREE.MeshBasicMaterial({
        map: stitchTextureMap[shape.type],
        transparent: true,
        side: THREE.BackSide,
      });
    });
  }

  // Building materials.
  const design = soccerBallsData.designs[soccerBallIndex];
  CONFIG.SHAPES.forEach((shape) => {
    design[shape.type].forEach((panel) => {
      const key = `${panel.d}_${shape.type}`;
      const textureArray = baseTextureMap[key];
      const hasValidRotation = panel.r >= 0 && panel.r < shape.sides;
      const rotation = hasValidRotation ? panel.r : 0;

      // Base materials.
      activeBaseMaterials.push(
        new THREE.MeshBasicMaterial({
          map: textureArray?.[rotation] || null,
          color: textureArray ? CONFIG.VALID_TEXTURE_COLOR : CONFIG.MISSING_TEXTURE_COLOR,
          side: THREE.BackSide,
        }),
      );

      // Stitch materials.
      if (CONFIG.SHOW_STITCHES) {
        activeStitchMaterials.push(stitchMaterials[shape.type]);
      }

      // Debug materials.
      if (CONFIG.SHOW_DEBUG) {
        activeDebugMaterials.push(
          new THREE.MeshBasicMaterial({
            map: getDebugTexture(shape, panel.i ?? "", panel.r),
            transparent: true,
            side: THREE.BackSide,
          }),
        );
      }
    });
  });

  // Applying materials to meshes.
  baseMesh.material = activeBaseMaterials;
  stitchMesh.material = activeStitchMaterials;
  debugMesh.material = activeDebugMaterials;
};

// Creates or returns a debug texture.
const getDebugTexture = (shape: Shape, id: string, rotation: number): THREE.Texture => {
  if (!debugTextureMap[id]) {
    debugTextureMap[id] = new Array(shape.sides);
  }
  if (debugTextureMap[id][rotation]) {
    return debugTextureMap[id][rotation];
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = CONFIG.TEXTURE_SIZE;
  canvas.height = CONFIG.TEXTURE_SIZE;
  Object.assign(context, CONFIG.DEBUG_TEXT_STYLE);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  if (id.length > 0) {
    drawStrokedText(context, `P:${id}`, centerX, centerY - CONFIG.DEBUG_MIDDLE_LABELS_OFFSET);
    drawStrokedText(context, `R:${rotation}`, centerX, centerY + CONFIG.DEBUG_MIDDLE_LABELS_OFFSET);
  } else {
    drawStrokedText(context, `R:${rotation}`, centerX, centerY);
  }
  const radiusFactor = CONFIG.DEBUG_SIDE_LABEL_OFFSET / (2 * Math.sin(Math.PI / shape.sides));
  const labelRadius = canvas.width * radiusFactor;
  for (let k = 0; k < shape.sides; k++) {
    const sideNum = ((rotation + k) % shape.sides).toString();
    const angle = Math.PI / 2 - (2 * Math.PI * k) / shape.sides;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    drawStrokedText(context, sideNum, x, y);
  }
  debugTextureMap[id][rotation] = createTextureFromCanvas(canvas);
  return debugTextureMap[id][rotation];
};

// Adds helpful debugging features to the soccer ball.
const addDebuggingFeatures = (debugGeometry: THREE.BufferGeometry): void => {
  // Adding wireframe.
  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(debugGeometry),
    new THREE.LineBasicMaterial({ color: CONFIG.DEBUG_WIREFRAME_COLOR }),
  );
  debugMesh.add(wireframe);
  // Adding helper X,Y,Z axes.
  const axesHelper = new THREE.AxesHelper(CONFIG.DEBUG_AXES_SIZE);
  scene.add(axesHelper);
  // Adding points to the soccer ball to help with vertices and texture mapping.
  const dotTexture = new THREE.TextureLoader().load("images/dot.png");
  dotTexture.colorSpace = THREE.SRGBColorSpace;
  const dots: THREE.Vector3[] = [];
  const positions = debugGeometry.attributes.position.array as Float32Array;
  CONFIG.DEBUG_VERTEX_INDICES.forEach((index) => {
    dots.push(new THREE.Vector3(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]));
  });
  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(dots);
  const pointsMaterial = new THREE.PointsMaterial({
    color: CONFIG.DEBUG_POINTS_COLOR,
    map: dotTexture,
    size: CONFIG.DEBUG_POINTS_SIZE,
    alphaTest: CONFIG.DEBUG_POINTS_ALPHA_TEST,
  });
  const debugPointsGroup = new THREE.Group();
  debugPointsGroup.add(new THREE.Points(pointsGeometry, pointsMaterial));
  debugMesh.add(debugPointsGroup);
};

// Loads an image from path, with optimization for SVGs.
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    // Handling SVG image types.
    if (url.toLowerCase().endsWith(".svg")) {
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch SVG file");
          return response.text();
        })
        .then((svgText) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, "image/svg+xml");
          const svgElement = doc.querySelector("svg");
          if (svgElement) {
            if (!svgElement.hasAttribute("viewBox")) {
              const width = svgElement.getAttribute("width") || `${CONFIG.TEXTURE_SIZE_FALLBACK}`;
              const height = svgElement.getAttribute("height") || `${CONFIG.TEXTURE_SIZE_FALLBACK}`;
              svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
            }
            svgElement.setAttribute("width", `${CONFIG.TEXTURE_SIZE}`);
            svgElement.setAttribute("height", `${CONFIG.TEXTURE_SIZE}`);
            const serializedSvg = new XMLSerializer().serializeToString(doc);
            const blob = new Blob([serializedSvg], { type: "image/svg+xml" });
            image.src = URL.createObjectURL(blob);
          } else {
            image.src = url;
          }
        })
        .catch((err) => {
          console.warn("SVG parsing failed, falling back to standard load", err);
          image.src = url;
        });
    } else {
      // Handling standard image types.
      image.src = url;
    }
    image.onload = () => {
      if (image.src.startsWith("blob:")) {
        URL.revokeObjectURL(image.src);
      }
      resolve(image);
    };
    image.onerror = (err) => {
      reject(err);
    };
  });
};
