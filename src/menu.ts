import {Graphics, BlurFilter, Container, Application} from "pixi.js";

export default class Menu extends Container {
    app: Application;
    graphics: Graphics;
    filter: BlurFilter;
    world: Container;
    screenWidth: number;
    screenHeight: number;
    keysPressed: {};

    constructor(app: Application, world: Container, keysPressed) {
        super();
        this.graphics = new Graphics();
        this.filter = new BlurFilter();
        this.world = world;
        this.keysPressed = keysPressed;
        this.zIndex = 20;
        this.screenWidth = app.screen.width;
        this.screenHeight = app.screen.height;
        this.addChild(this.graphics);
        app.stage.addChild(this);

        this.keysPressed["Escape"] = false;
    }

    run() {

        if (this.keysPressed["Escape"]) {
            this.visible = true;
            this.world.filters = [this.filter];
        } else {
            this.visible = false;
            this.world.filters = null;
        }
        this.graphics.clear();
        this.container();
    }

    container() {
        const width = this.screenWidth * 0.8
        const height = this.screenHeight * 0.8;

        this.graphics
            .roundRect(
                this.screenWidth * 0.5 - width * 0.5,
                this.screenHeight * 0.5 - height * 0.5,
                width,
                height,
                10
            )
            .fill({ color: 0x000000, alpha: 0.4 });
    }
}
