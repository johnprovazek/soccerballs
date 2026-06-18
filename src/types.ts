export interface MissingTexture {
  key: string; // Unique key to indicate missing texture.
  type: "hexagon" | "pentagon"; // Type of geometric shape (hexagon or pentagon).
  path: string; // File path to the missing texture that needs to be loaded.
}

export interface Shape {
  type: "hexagon" | "pentagon"; // Type of geometric shape (hexagon or pentagon).
  count: number; // Number of this shape on the soccer ball (20 hexagons, 12 pentagons).
  triangles: number; // Number of triangles needed to render this shape (54 for hexagons, 45 for pentagons).
  sides: number; // Number of sides for the shape (6 for hexagons, 5 for pentagons).
}

interface Panel {
  d: string; // Design ("a", "b", "c", "d").
  r: number; // Rotation (0-5 for hexagons; 0-4 for pentagons).
  i?: string; // ID ("A", "B", "C").
}

interface Design {
  name: string; // Soccer ball design name
  hexagon: Panel[]; // List of hexagon panels.
  pentagon: Panel[]; // List of pentagon panels.
}

export interface SoccerBallData {
  v: number[]; // Position vertices of the soccer ball geometry.
  uv: number[]; // UV coordinates for texturing the soccer ball geometry.
  designs: Design[]; // List of soccer ball designs, each with a name and panel configuration.
}
