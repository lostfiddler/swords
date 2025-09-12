import {Container, Sprite, Assets, AnimatedSprite, Texture, Application} from "pixi.js"

// World data structure (2 = grass w/ foam, 1 = grass, 0 = water)
const worldGrid = [
    [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2],
    [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

export default class World extends Container {
    app: Application;
    grass: Sprite;

    constructor(app: Application) {
        super();
        this.app = app;
        this.grass = new Sprite(Assets.get("assets/floor.png"));
        this.position.set(
            app.screen.width / 2 - this.grass.width / 2,
            app.screen.height / 2 - this.grass.height / 2
        );
    }

    foam() {
        const foam: AnimatedSprite[] = [];
        const textures: Texture[] = [];

        for (let i = 1; i <= 8; i++) {
            const foamTexture =
                Assets.get("assets/foam.json").textures[`frame${i}.png`];

            textures.push(foamTexture);
        }

        for (let y = 0; y < worldGrid.length; y++) {
            for (let x = 0; x < worldGrid[y].length; x++) {
                // refer to comment by worldGrid decleration
                if (worldGrid[y][x] === 2) {
                    const f = new AnimatedSprite(textures);
                    f.animationSpeed = 0.1;
                    f.play();

                    f.x = x * 64 - 64;
                    f.y = y * 64 - 64;
                    foam.push(f);
                }
            }
        }
        return foam;
    }

    display() {
        this.addChild(...this.foam());
        this.addChild(this.grass);
        this.app.stage.addChild(this);
    }
}
