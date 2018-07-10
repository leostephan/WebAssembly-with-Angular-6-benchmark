# Project

Angular website integrating webassembly computations built and used as content material for this article : http://blog.3ie.fr/webassembly-angular/

# AngularWasm

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## How to build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build. You can also run `npm install`.


## Launch the server

Run `ng serve --port 4200` for a dev server on port 4200, or simply run `npm start`.


## Create components

Run `ng generate component component-name` to generate a new component.

### Reminder

To compile C to WASM use the following instructions (you must install emsdk / emcc):

> ./emdsk update<br>
 ./emdsk update-tags<br>
 ./emdsk install latest<br>
 ./emdsk activate latest<br>
 source ./emdsk_env.sh

> cd app/src/wasm<br>
 emcc ./evaluator.c -Os -s WASM=1 -s MODULARIZE=1 -o ./evaluator.js

### Note

I added the raws .js and .wasm files in src/app/wasm in case of you were having trouble to compile emsdk by yourself ;-).

### Author

Léo Stephan
