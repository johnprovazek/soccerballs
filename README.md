# soccerballs

## Description

This project was created to display prototype designs for soccer balls that follow the standard 32 piece design ([Truncated Icosahedron](https://en.wikipedia.org/wiki/Truncated_icosahedron)) built from 12 pentagons and 20 hexagons. This idea was inspired by the videos of [jonpaulsballs](https://www.youtube.com/@jonpaulsballs/videos) and his [tutorial](https://www.youtube.com/watch?v=TGMWMHw8OpA&ab_channel=jonpaulsballs) on how to build a standard 32 piece soccer ball. This project can be used to prototype designs before following his [tutorial](https://www.youtube.com/watch?v=TGMWMHw8OpA&ab_channel=jonpaulsballs) and building a soccer ball of your own design. A demo of this soccer ball prototype 3D viewer can be accessed at [johnprovazek.com/soccerballs](https://www.johnprovazek.com/soccerballs/).

Built using vanilla JavaScript and the [three.js](https://threejs.org/) library.

<div align="center">
  <picture>
    <img src="https://repository-images.githubusercontent.com/776272736/da18c78f-70f2-4457-84b6-30958441115e" width="830px">
  </picture>
</div>

## Installation

This project was built using vanilla JavaScript and the [three.js](https://threejs.org/) library. This project is currently setup to use the [three.js](https://threejs.org/) library from the CDN but could easily be [reconfigured](https://threejs.org/docs/index.html#manual/en/introduction/Installation) to use the npm package. Clone this repo to get started designing soccer balls of your own.

## Usage

After cloning this repo navigate to the [templates](images/textures/templates/) directory. Here you will find a handful of helpful image files to assist you with designing textures of your own. These image files were created to to help with designing for the UV mapping between the soccer ball panel shapes and the textures.

It may be helpful to look at the designs in the [panels](images/textures/panels/) directory for inspiration.

Once you have designed your panels, place them in the appropriate subdirectory under the [panels](images/textures/panels/) directory to correspond with the shape. Note that this script is currently setup to only accept panels in the PNG format.

Next you will need to reference these files in the [soccerball.json](images/data/soccerballs.json) file.

Each soccer ball design contains a name, hexagon array, and pentagon array. The soccer ball name is limited to 16 characters. The hexagon and pentagon arrays contain the name of the texture file (without the file extension) and the rotation number for the texture. Follow the format of the [soccerball.json](images/data/soccerballs.json) file when adding your own designs.

## Credits

[jonpaulsballs](https://www.youtube.com/@jonpaulsballs/videos) was the YouTube channel that inspired this project.

[Dr. Andrew Marsh's Polyhedron Generator](https://drajmarsh.bitbucket.io/poly3d.html) was used to generate the initial 3D soccer ball shape. On his website you can set the base polyhedron to "icosahedron" and the conway polyhedra notation to "I(1)u9" to generate the same object this project started with.

## Bugs & Improvements

- The UV mapping for the pentagon shape could use improvement to match the "inflation" in the hexagon UV mapping. Setting this project's mode to "debug" will clearly show this issue.
- Add the panel number in the debug overlay.
- The stitching image could use improvement ( adobe illustrator ).
- Design real prototypes with clean SVGs ( adobe illustrator ).
- Add a loading animation when toggling between soccer balls and applying the new textures.
