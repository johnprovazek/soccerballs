// Scales the camera field of view to keep the sphere in view at the starting distance.
export const getFov = (diameter, aspect, distance) => {
  let a = diameter / 2;
  const b = distance;
  if (aspect < 1) {
    a = a / aspect;
  }
  let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  return Math.asin(a / c) * (180 / Math.PI) * 2;
};
