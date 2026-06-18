# soccerballs

## Description

This project was created to display prototype designs for soccer balls that follow the standard 32 piece design ([Truncated Icosahedron](https://en.wikipedia.org/wiki/Truncated_icosahedron)) built with 20 hexagons and 12 pentagons.
This idea was inspired by the videos of [jonpaulsballs](https://www.youtube.com/@jonpaulsballs/videos) and his [tutorial](https://www.youtube.com/watch?v=TGMWMHw8OpA&ab_channel=jonpaulsballs) on how to build a standard 32 piece soccer ball.
This project can be used to prototype designs before following his [tutorial](https://www.youtube.com/watch?v=TGMWMHw8OpA&ab_channel=jonpaulsballs) and building a soccer ball of your own.
A demo of this soccer ball prototype 3D viewer can be accessed at [johnprovazek.com/soccerballs](https://www.johnprovazek.com/soccerballs/).

Built using Vite, TypeScript and the [three.js](https://threejs.org/) library.

<div align="center">
  <picture>
    <img src="https://repository-images.githubusercontent.com/776272736/d366a10c-b9f5-48ec-9a88-0c8265ad382c" width="830px">
  </picture>
</div>

## Usage

To get started designing your own soccer ball, you will need to create textures of your own.
Start by navigating through the [hexagon](public/images/hexagon/) and [pentagon](public/images/pentagon/) directories.
Within these directories you will find a handful of example textures that may assist you when creating textures of your own.

In addition to the example textures, there are also template textures in PNG and SVG formats.
Each template texture has 12 points along the shape edges.
These points can be used to line up the hexagon and pentagon shapes to create your own custom textures.

Once you have designed your textures, place them in the appropriate [hexagon](public/images/hexagon/) and [pentagon](public/images/hexagon/) directories.

Lastly, you will need to reference these files in [soccer-balls.json](public/data/soccer-balls.json).
Follow the formatting of the example textures found there.
Each soccer ball design should have a name, 20 hexagon panels, and 12 pentagon panels.
Each panel should contain the name of the texture file, the rotation value, and an optional ID to help with debugging.

## Credits

[jonpaulsballs](https://www.youtube.com/@jonpaulsballs/videos) was the YouTube channel that inspired this project.

[Dr. Andrew Marsh's Polyhedron Generator](https://drajmarsh.bitbucket.io/poly3d.html) was used to generate the initial 3D soccer ball shape.
On his website you can set the base polyhedron to _icosahedron_ and the conway polyhedra notation to _I(1)u9_ to generate the same object this project started with.

## Bugs & Improvements

- The stitching image could use improvement ( adobe illustrator ).
- Design real prototypes with clean SVGs ( adobe illustrator ).
