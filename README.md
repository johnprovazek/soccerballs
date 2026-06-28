# soccerballs

## Description

This project was created to display prototype designs for soccer balls that follow the standard 32-panel layout (a [truncated icosahedron](https://en.wikipedia.org/wiki/Truncated_icosahedron) composed of 20 hexagons and 12 pentagons).
This idea was inspired by the videos of [jonpaulsballs](https://www.youtube.com/@jonpaulsballs) and his [tutorial](https://www.youtube.com/watch?v=5Ch738OjDr0) on how to build a standard 32-panel soccer ball.
This project can be used to prototype designs before following his [tutorial](https://www.youtube.com/watch?v=5Ch738OjDr0) and building a soccer ball of your own.

A demo of this 3D soccer ball prototype viewer can be accessed at [johnprovazek.com/soccerballs](https://www.johnprovazek.com/soccerballs/).

Built using Vite, TypeScript, and the [three.js](https://threejs.org/) library.

<div align="center">
  <picture>
    <img src="https://repository-images.githubusercontent.com/776272736/08fae59d-82a5-4af2-b719-298e319e38df" width="830px" alt="Project Thumbnail Image">
  </picture>
</div>

## Usage

### Texture Design

To get started designing your own soccer ball, you will need to create textures of your own.
Start by navigating through the [hexagon](public/images/hexagon/) and [pentagon](public/images/pentagon/) directories.
Within these directories, you will find a handful of example textures that may serve as helpful references when building out your own custom designs.

When prototyping new designs, it is recommended to mock up textures in a simple drawing application before building them out with vector graphics.
Included in this project are [hexagon](public/images/hexagon/template.png) and [pentagon](public/images/pentagon/template.png) texture templates in PNG format.
These are provided to help with mocking up textures when using a simple drawing application.
These texture templates have twelve points along the shape edges.
These points are intended to be helpful guides when lining up your designs that go across the edges of hexagon and pentagon panels.
The hexagon and pentagon edges have an equal length in both of these templates.
This means you can use the same size scale when designing across both shapes.

### Vector Graphics

Also included in this project are [hexagon](public/images/hexagon/template.svg) and [pentagon](public/images/pentagon/template.svg) texture templates in SVG format.
These are provided to help with finalizing your textures in a vector graphics editor.

#### Exact Edge Point Coordinates

If you would like to start directly with exact edge point coordinates instead of the SVG templates, these are also provided.
Expand the _Diagram & Coordinates Table_ below to find a helpful diagram and table showing the UV and SVG edge point coordinates.
The SVG columns in this table list coordinates based on an SVG with 1024 × 1024 dimensions.
These are the same dimensions used in the example textures found in this project.
Also included are the UV coordinates.
These are provided if you would like to use a different design system or calculate new edge point coordinates for different dimensions other than 1024 × 1024.

<details>
  <summary style="font-size: 1rem; font-weight: 600; cursor: pointer;">Diagram & Coordinates Table</summary>
  <div align="center">
    <h3> Diagram </h3>
    <picture>
      <img src="./public/images/coordinate-diagram.svg" width="830px" alt="Hexagon and Pentagon Coordinate Diagram">
    </picture>
    <h3> Coordinates Table </h3>

| Point      | Hex_UV_X | Hex_UV_Y | Hex_SVG_X   | Hex_SVG_Y  | Pent_UV_X | Pent_UV_Y | Pent_SVG_X | Pent_SVG_Y |
| ---------- | -------- | -------- | ----------- | ---------- | --------- | --------- | ---------- | ---------- |
| **A0/F12** | 0.25     | 0.933013 | 256         | 68.594688  | 0.25      | 0.844095  | 256        | 159.64672  |
| **A1**     | 0.291667 | 0.933013 | 298.667008  | 68.594688  | 0.291667  | 0.844095  | 298.667008 | 159.64672  |
| **A2**     | 0.333333 | 0.933013 | 341.332992  | 68.594688  | 0.333333  | 0.844095  | 341.333    | 159.64672  |
| **A3**     | 0.375    | 0.933013 | 384         | 68.594688  | 0.375     | 0.844095  | 384        | 159.64672  |
| **A4**     | 0.416667 | 0.933013 | 426.667008  | 68.594688  | 0.416667  | 0.844095  | 426.667008 | 159.64672  |
| **A5**     | 0.458333 | 0.933013 | 469.332992  | 68.594688  | 0.458333  | 0.844095  | 469.333    | 159.64672  |
| **A6**     | 0.5      | 0.933013 | 512         | 68.594688  | 0.5       | 0.844095  | 512        | 159.64672  |
| **A7**     | 0.541667 | 0.933013 | 554.667008  | 68.594688  | 0.541667  | 0.844095  | 554.667008 | 159.64672  |
| **A8**     | 0.583333 | 0.933013 | 597.332992  | 68.594688  | 0.583333  | 0.844095  | 597.333    | 159.64672  |
| **A9**     | 0.625    | 0.933013 | 640         | 68.594688  | 0.625     | 0.844095  | 640        | 159.64672  |
| **A10**    | 0.666667 | 0.933013 | 682.667008  | 68.594688  | 0.666667  | 0.844095  | 682.667008 | 159.64672  |
| **A11**    | 0.708333 | 0.933013 | 725.332992  | 68.594688  | 0.708333  | 0.844095  | 725.333    | 159.64672  |
| **B0/A12** | 0.75     | 0.933013 | 768         | 68.594688  | 0.75      | 0.844095  | 768        | 159.64672  |
| **B1**     | 0.770833 | 0.896929 | 789.332992  | 105.544704 | 0.762876  | 0.804468  | 781.185024 | 200.224768 |
| **B2**     | 0.791667 | 0.860844 | 810.667008  | 142.495744 | 0.775751  | 0.764840  | 794.369024 | 240.80384  |
| **B3**     | 0.8125   | 0.824760 | 832         | 179.44576  | 0.788627  | 0.725213  | 807.554048 | 281.381888 |
| **B4**     | 0.833333 | 0.788675 | 853.332992  | 216.3968   | 0.801503  | 0.685586  | 820.739072 | 321.959936 |
| **B5**     | 0.854167 | 0.752591 | 874.667008  | 253.346816 | 0.814378  | 0.645958  | 833.923072 | 362.539008 |
| **B6**     | 0.875    | 0.716506 | 896         | 290.297856 | 0.827254  | 0.606331  | 847.108096 | 403.117056 |
| **B7**     | 0.895833 | 0.680422 | 917.332992  | 327.247872 | 0.840130  | 0.566704  | 860.29312  | 443.695104 |
| **B8**     | 0.916667 | 0.644338 | 938.667008  | 364.197888 | 0.853005  | 0.527076  | 873.47712  | 484.274176 |
| **B9**     | 0.937500 | 0.608253 | 960         | 401.148928 | 0.865881  | 0.487449  | 886.662144 | 524.852224 |
| **B10**    | 0.958333 | 0.572169 | 981.332992  | 438.098944 | 0.878757  | 0.447822  | 899.847168 | 565.430272 |
| **B11**    | 0.979167 | 0.536084 | 1002.667008 | 475.049984 | 0.891632  | 0.408194  | 913.031168 | 606.009344 |
| **C0/B12** | 1        | 0.5      | 1024        | 512        | 0.904508  | 0.368567  | 926.216192 | 646.587392 |
| **C1**     | 0.979167 | 0.463916 | 1002.667008 | 548.950016 | 0.870799  | 0.344076  | 891.698176 | 671.666176 |
| **C2**     | 0.958333 | 0.427831 | 981.332992  | 585.901056 | 0.837090  | 0.319585  | 857.18016  | 696.74496  |
| **C3**     | 0.9375   | 0.391747 | 960         | 622.851072 | 0.803381  | 0.295094  | 822.662144 | 721.823744 |
| **C4**     | 0.916667 | 0.355662 | 938.667008  | 659.802112 | 0.769672  | 0.270603  | 788.144128 | 746.902528 |
| **C5**     | 0.895833 | 0.319578 | 917.332992  | 696.752128 | 0.735963  | 0.246112  | 753.626112 | 771.981312 |
| **C6**     | 0.875    | 0.283494 | 896         | 733.702144 | 0.702254  | 0.221621  | 719.108096 | 797.060096 |
| **C7**     | 0.854167 | 0.247409 | 874.667008  | 770.653184 | 0.668545  | 0.197130  | 684.59008  | 822.13888  |
| **C8**     | 0.833333 | 0.211325 | 853.332992  | 807.6032   | 0.634836  | 0.172639  | 650.072064 | 847.217664 |
| **C9**     | 0.8125   | 0.175240 | 832         | 844.55424  | 0.601127  | 0.148148  | 615.554048 | 872.296448 |
| **C10**    | 0.791667 | 0.139156 | 810.667008  | 881.504256 | 0.567418  | 0.123657  | 581.036032 | 897.375232 |
| **C11**    | 0.770833 | 0.103071 | 789.332992  | 918.455296 | 0.533709  | 0.099166  | 546.518016 | 922.454016 |
| **D0/C12** | 0.75     | 0.066987 | 768         | 955.405312 | 0.5       | 0.074675  | 512        | 947.5328   |
| **D1**     | 0.708333 | 0.066987 | 725.332992  | 955.405312 | 0.466291  | 0.099166  | 477.481984 | 922.454016 |
| **D2**     | 0.666667 | 0.066987 | 682.667008  | 955.405312 | 0.432582  | 0.123657  | 442.963968 | 897.375232 |
| **D3**     | 0.625    | 0.066987 | 640         | 955.405312 | 0.398873  | 0.148148  | 408.445952 | 872.296448 |
| **D4**     | 0.583333 | 0.066987 | 597.332992  | 955.405312 | 0.365164  | 0.172639  | 373.927936 | 847.217664 |
| **D5**     | 0.541667 | 0.066987 | 554.667008  | 955.405312 | 0.331455  | 0.197130  | 339.40992  | 822.13888  |
| **D6**     | 0.5      | 0.066987 | 512         | 955.405312 | 0.297746  | 0.221621  | 304.891904 | 797.060096 |
| **D7**     | 0.458333 | 0.066987 | 469.332992  | 955.405312 | 0.264037  | 0.246112  | 270.373888 | 771.981312 |
| **D8**     | 0.416667 | 0.066987 | 426.667008  | 955.405312 | 0.230328  | 0.270603  | 235.855872 | 746.902528 |
| **D9**     | 0.375    | 0.066987 | 384         | 955.405312 | 0.196619  | 0.295094  | 201.337856 | 721.823744 |
| **D10**    | 0.333333 | 0.066987 | 341.332992  | 955.405312 | 0.162910  | 0.319585  | 166.81984  | 696.74496  |
| **D11**    | 0.291667 | 0.066987 | 298.667008  | 955.405312 | 0.129201  | 0.344076  | 132.301824 | 671.666176 |
| **E0/D12** | 0.25     | 0.066987 | 256         | 955.405312 | 0.095492  | 0.368567  | 97.783808  | 646.587392 |
| **E1**     | 0.229167 | 0.103071 | 234.667008  | 918.455296 | 0.108368  | 0.408194  | 110.968832 | 606.009344 |
| **E2**     | 0.208333 | 0.139156 | 213.332992  | 881.504256 | 0.121243  | 0.447822  | 124.152832 | 565.430272 |
| **E3**     | 0.1875   | 0.175240 | 192         | 844.55424  | 0.134119  | 0.487449  | 137.337856 | 524.852224 |
| **E4**     | 0.166667 | 0.211325 | 170.667008  | 807.6032   | 0.146995  | 0.527076  | 150.52288  | 484.274176 |
| **E5**     | 0.145833 | 0.247409 | 149.332992  | 770.653184 | 0.159870  | 0.566704  | 163.70688  | 443.695104 |
| **E6**     | 0.125    | 0.283494 | 128         | 733.702144 | 0.172746  | 0.606331  | 176.891904 | 403.117056 |
| **E7**     | 0.104167 | 0.319578 | 106.667008  | 696.752128 | 0.185622  | 0.645958  | 190.076928 | 362.539008 |
| **E8**     | 0.083333 | 0.355662 | 85.332992   | 659.802112 | 0.198497  | 0.685586  | 203.260928 | 321.959936 |
| **E9**     | 0.0625   | 0.391747 | 64          | 622.851072 | 0.211373  | 0.725213  | 216.445952 | 281.381888 |
| **E10**    | 0.041667 | 0.427831 | 42.667008   | 585.901056 | 0.224249  | 0.764840  | 229.630976 | 240.80384  |
| **E11**    | 0.020833 | 0.463916 | 21.332992   | 548.950016 | 0.237124  | 0.804468  | 242.814976 | 200.224768 |
| **F0/E12** | 0        | 0.5      | 0           | 512        | -         | -         | -          | -          |
| **F1**     | 0.020833 | 0.536084 | 21.332992   | 475.049984 | -         | -         | -          | -          |
| **F2**     | 0.041667 | 0.572169 | 42.667008   | 438.098944 | -         | -         | -          | -          |
| **F3**     | 0.0625   | 0.608253 | 64          | 401.148928 | -         | -         | -          | -          |
| **F4**     | 0.083333 | 0.644338 | 85.332992   | 364.197888 | -         | -         | -          | -          |
| **F5**     | 0.104167 | 0.680422 | 106.667008  | 327.247872 | -         | -         | -          | -          |
| **F6**     | 0.125    | 0.716506 | 128         | 290.297856 | -         | -         | -          | -          |
| **F7**     | 0.145833 | 0.752591 | 149.332992  | 253.346816 | -         | -         | -          | -          |
| **F8**     | 0.166667 | 0.788675 | 170.667008  | 216.3968   | -         | -         | -          | -          |
| **F9**     | 0.1875   | 0.824760 | 192         | 179.44576  | -         | -         | -          | -          |
| **F10**    | 0.208333 | 0.860844 | 213.332992  | 142.495744 | -         | -         | -          | -          |
| **F11**    | 0.229167 | 0.896929 | 234.667008  | 105.544704 | -         | -         | -          | -          |

  </div>
</details>

### Setup

Once you have designed your textures, place them in the appropriate [hexagon](public/images/hexagon/) and [pentagon](public/images/pentagon/) directories.
Next, you will need to reference these files in [soccer-balls.json](public/data/soccer-balls.json).
Each soccer ball design should have a name, 20 hexagon panels, and 12 pentagon panels.
Each panel should contain the name of the texture file, the rotation value, and an optional ID to help with debugging.

You should now be ready to launch the application and start viewing your designs.

> **Tip:** To help with configuring the rotation value for specific panels, toggle the `SHOW_DEBUG` flag in [constants.ts](src/constants.ts) to display individual panel IDs on the 3D model.

## Credits

[jonpaulsballs](https://www.youtube.com/@jonpaulsballs) is the YouTube channel that inspired this project.

[Dr. Andrew Marsh's Polyhedron Generator](https://drajmarsh.bitbucket.io/poly3d.html) was used to generate the initial 3D soccer ball shape.
On his website, you can set the base polyhedron to _icosahedron_ and the conway polyhedra notation to _I(1)u9_ to generate the same object this project started with.
