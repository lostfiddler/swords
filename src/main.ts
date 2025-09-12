import { Application, Assets } from "pixi.js";

import World from "./world";
import Menu from "./menu";
import Player from "./player";
import controllerInput from "./controllerInput";

let app: Application;
let paused = false;
let keysPressed = {};

(async () => {
    app = new Application();

    await app.init({ background: "#1099bb", resizeTo: window });

    document.body.appendChild(app.canvas);

    await Assets.load([
        "assets/floor.png",
        "assets/foam.json",
        "assets/pawn.json",
    ]);

    // enable pixi dev tools
    globalThis.__PIXI_APP__ = app;

    const player = new Player(keysPressed);

    const world = new World(app);

    const menu = new Menu(app, world, keysPressed);

    controllerInput(player, keysPressed, paused);

    world.display();
    world.addChild(player);
    app.ticker.add((_time) => {
        menu.run();
        if (!paused) {
            player.movement();
        }
    });
})();
