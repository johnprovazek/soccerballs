import type { Shape } from "./types.js";

export const CAMERA_START_DISTANCE = 5; // Camera start distance.
export const DEBUG_AXES_SIZE = 100; // Size of the axes for debugging.
export const DEBUG_BALL_DESIGN = {
  // Debug ball design to help with texture mapping.
  name: "DEBUG",
  hexagon: [
    { d: "debug.png", r: 0, i: "A" },
    { d: "debug.png", r: 0, i: "B" },
    { d: "debug.png", r: 0, i: "C" },
    { d: "debug.png", r: 0, i: "D" },
    { d: "debug.png", r: 0, i: "E" },
    { d: "debug.png", r: 0, i: "F" },
    { d: "debug.png", r: 0, i: "G" },
    { d: "debug.png", r: 0, i: "H" },
    { d: "debug.png", r: 0, i: "I" },
    { d: "debug.png", r: 0, i: "J" },
    { d: "debug.png", r: 0, i: "K" },
    { d: "debug.png", r: 0, i: "L" },
    { d: "debug.png", r: 0, i: "M" },
    { d: "debug.png", r: 0, i: "N" },
    { d: "debug.png", r: 0, i: "O" },
    { d: "debug.png", r: 0, i: "P" },
    { d: "debug.png", r: 0, i: "Q" },
    { d: "debug.png", r: 0, i: "R" },
    { d: "debug.png", r: 0, i: "S" },
    { d: "debug.png", r: 0, i: "T" },
  ],
  pentagon: [
    { d: "debug.png", r: 0, i: "U" },
    { d: "debug.png", r: 0, i: "V" },
    { d: "debug.png", r: 0, i: "W" },
    { d: "debug.png", r: 0, i: "X" },
    { d: "debug.png", r: 0, i: "Y" },
    { d: "debug.png", r: 0, i: "Z" },
    { d: "debug.png", r: 0, i: "@" },
    { d: "debug.png", r: 0, i: "#" },
    { d: "debug.png", r: 0, i: "$" },
    { d: "debug.png", r: 0, i: "%" },
    { d: "debug.png", r: 0, i: "&" },
    { d: "debug.png", r: 0, i: "~" },
  ],
};
export const DEBUG_MIDDLE_LABELS_OFFSET = 60; // Offset for the debug labels at the center of the panel.
export const DEBUG_POINTS_ALPHA_TEST = 0.5; // Alpha test value for the points for debugging.
export const DEBUG_POINTS_COLOR = 0xffff00; // Color of the points for debugging.
export const DEBUG_POINTS_SIZE = 0.25; // Size of the points for debugging.
export const DEBUG_SIDE_LABEL_OFFSET = 0.3; // Distance to draw debug side labels.
export const DEBUG_TEXT_STYLE = {
  // Debug text styles.
  fillStyle: "white",
  font: "600 80px Courier",
  strokeStyle: "black",
  lineWidth: 15,
  textAlign: "center",
  textBaseline: "middle",
};
export const DEBUG_VERTEX_INDICES = []; // Vertex indices to label for debugging. Hexagon: [0, 15, 50, 79, 142, 160]
export const DEBUG_WIREFRAME_COLOR = 0x000000; // Wireframe color for debugging.
export const FAR_PLANE = 10; // Far plane for the perspective camera.
export const MAX_DISTANCE = 8; // Maximum distance camera can move.
export const MIN_DISTANCE = 2; // Minimum distance camera can move.
export const MISSING_TEXTURE_COLOR = 0xff69b4; // Color used for missing textures.
export const NEAR_PLANE = 1; // Near plane for the perspective camera.
export const NO_PAN = true; // Locks or unlocks the camera panning.
export const ROTATE_SPEED = 1.2; // Speed at which the camera can rotate move.
export const SHAPES: Shape[] = [
  // Shapes of soccer ball panels and their properties.
  {
    type: "hexagon",
    count: 20,
    triangles: 54,
    sides: 6,
  },
  {
    type: "pentagon",
    count: 12,
    triangles: 45,
    sides: 5,
  },
];
export const SHOW_DEBUG = false; // Debug overlay flag.
export const SHOW_STITCHES = true; // Stitches overlay flag.
export const SOCCER_BALL_NAME_CHARACTER_LIMIT = 16; // Maximum character count for a soccer ball name.
export const TEXTURE_SIZE = 1024; // Ideal texture height and width.
export const TEXTURE_SIZE_FALLBACK = 100; // Fallback texture height and width.
export const UV_SCALE = 0.995; // Scale applied to UV coordinates to fix texture edge gaps.
export const VALID_TEXTURE_COLOR = 0xffffff; // Base color for valid textures.
export const ZOOM_SPEED = 0.8; // Speed at which the view of the camera can move.

const SOCCER_BALL_DIAMETER = 2; // Soccer ball diameter.
const MARGIN_PERCENTAGE = 10; // Margin percentage between soccer ball and window border for name and buttons.
const PADDING_PERCENTAGE = 2; // Extra padding between soccer ball and window border.

// Full height of the soccer ball and window border that is used to position the soccer ball in the viewer.
export const FULL_HEIGHT = SOCCER_BALL_DIAMETER / (1 - (MARGIN_PERCENTAGE + PADDING_PERCENTAGE) / 50);
