import * as THREE from "three";

// Converts an HTML Canvas to a Three.js CanvasTexture.
export const createTextureFromCanvas = (canvas: HTMLCanvasElement): THREE.CanvasTexture => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.center = new THREE.Vector2(0.5, 0.5);
  return texture;
};

// Draws stroked text on a canvas context.
export const drawStrokedText = (context: CanvasRenderingContext2D, text: string, x: number, y: number): void => {
  context.strokeText(text, x, y);
  context.fillText(text, x, y);
};

// Fetches JSON data from a specified URL.
export const fetchJSON = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load resource from ${url}: ${response.statusText}`);
  }
  return (await response.json()) as T;
};

// Adds base URL to a given path.
export const getBaseUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return (import.meta.env?.BASE_URL ?? "/") + cleanPath;
};

// Scales the camera field of view to keep the sphere in view at the starting distance.
export const getFov = (diameter: number, aspect: number, distance: number): number => {
  const radius = diameter / 2;
  const a = aspect < 1 ? radius / aspect : radius;
  const b = distance;
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  return Math.asin(a / c) * (180 / Math.PI) * 2;
};

// Loads an HTML image from path.
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image asset at path: ${src}`));
    image.src = src;
  });
};
