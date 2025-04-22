# soccerballs

## Description

This project was created to display prototype designs for soccer balls that follow the standard 32 piece design ([Truncated Icosahedron](https://en.wikipedia.org/wiki/Truncated_icosahedron)) built from 12 pentagons and 20 hexagons.
This idea was inspired by the videos of [jonpaulsballs](https://www.youtube.com/@jonpaulsballs/videos) and his [tutorial](https://www.youtube.com/watch?v=TGMWMHw8OpA&ab_channel=jonpaulsballs) on how to build a standard 32 piece soccer ball.
This project can be used to prototype designs before following his [tutorial](https://www.youtube.com/watch?v=TGMWMHw8OpA&ab_channel=jonpaulsballs) and building a soccer ball of your own design.
A demo of this soccer ball prototype 3D viewer can be accessed at [johnprovazek.com/soccerballs](https://www.johnprovazek.com/soccerballs/).

Built using vanilla JavaScript and the [three.js](https://threejs.org/) library.

<div align="center">
  <picture>
    <img src="https://repository-images.githubusercontent.com/776272736/d366a10c-b9f5-48ec-9a88-0c8265ad382c" width="830px">
  </picture>
</div>

## Usage

After cloning this repo navigate to the [templates](images/textures/templates/) directory.
Here you will find a handful of helpful images to assist you with designing textures of your own.
These images were created to to help with designing for the UV mapping between the soccer ball panel shapes and the textures.

It may also be helpful to look at the designs found in the [panels](images/textures/panels/) directory for inspiration.

Once you have designed your panels, place them in the appropriate subdirectory under the [panels](images/textures/panels/) directory to correspond with the shape.
Note that this script is currently setup to only accept panels in the PNG format.

Next you will need to reference these files in the [soccer-balls.json](images/data/soccer-balls.json) file.

Each soccer ball design contains a name, hexagon array, and pentagon array.
The hexagon and pentagon arrays contain the name of the texture file (without the file extension) and the rotation number for the texture.
Follow the format of the [soccer-balls.json](images/data/soccer-balls.json) file when adding your own designs.

## Credits

[jonpaulsballs](https://www.youtube.com/@jonpaulsballs/videos) was the YouTube channel that inspired this project.

[Dr. Andrew Marsh's Polyhedron Generator](https://drajmarsh.bitbucket.io/poly3d.html) was used to generate the initial 3D soccer ball shape.
On his website you can set the base polyhedron to _icosahedron_ and the conway polyhedra notation to _I(1)u9_ to generate the same object this project started with.

## Bugs & Improvements

- The UV mapping for the pentagon shape could use improvement to match the "inflation" in the hexagon UV mapping. Setting this project's mode to "debug" will clearly show this issue.
- Add the panel number in the debug overlay.
- The stitching image could use improvement ( adobe illustrator ).
- Design real prototypes with clean SVGs ( adobe illustrator ).
