Zero: A Minimal Static HTML Engine
=====================

Output a static site using Gulp tasks based on [Considering a Static Site Tool? Learn Gulp.](https://medium.com/objects-in-space/considering-a-static-site-tool-learn-gulp-2fd5f9821fc4)

![zero logo](https://github.com/tomgenoni/zero-static-html-engine/blob/master/assets/i/zero.svg)

## Features

- Pages and partials using [Swig](http://paularmstrong.github.io/swig/)
- Sass/Compass compilation
- Preview server with Browsersync CSS injection and auto-reloaad
- Watch processes recompiles HTML and static assets
- Everything is compiled into the `_build` directory

## Usage

Install gulp dependencies:

     npm install

In a terminal window run:

     gulp

And it should open your browser to  [http://localhost:3000](http://localhost:3000). This displays the flat-file content of the `_build` directory.

## Troubleshooting

- If you're unable to run npm install without errors try running the following as you may have a permissions issue. Taken from solution to [NPM throws error without sudo](http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo).

     ``sudo chown -R `whoami` ~/.npm``
