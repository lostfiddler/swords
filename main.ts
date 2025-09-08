import {
    Application,
    Assets,
    Container,
    Sprite,
    Graphics,
    AnimatedSprite,
    Texture,
    Spritesheet,
} from "pixi.js";

// Map data structure (2 = grass w/ foam, 1 = grass, 0 = water)
const mapGrid = [
    [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2],
    [0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

let app: Application;

(async () => {
    app = new Application();

    await app.init({ background: "#1099bb", resizeTo: window });

    document.body.appendChild(app.canvas);

    await Assets.load(["assets/floor.png", "assets/foam.json"]);

    // enable pixi dev tools
    globalThis.__PIXI_APP__ = app;

    const map = new Map(Assets.get("assets/floor.png"));

    map.run();
})();

class Map extends Sprite {
    container: Container;

    constructor(texture: Texture) {
        super(texture);
        this.container = new Container();
        this.container.position.set(
            app.screen.width / 2 - this.width / 2,
            app.screen.height / 2 - this.height / 2
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

        for (let y = 0; y < mapGrid.length; y++) {
            for (let x = 0; x < mapGrid[y].length; x++) {
                // refer to comment by mapGrid decleration
                if (mapGrid[y][x] === 2) {
                    const f = new AnimatedSprite(textures);
                    f.animationSpeed = 0.1;
                    f.play();

                    f.x = x * 64 - 64;
                    f.y = y * 64 - 64;
                    foam.push(f)
                }
            }
        }
        return foam;
    }

    run() {
        this.container.addChild(...this.foam())
        this.container.addChild(this);
        app.stage.addChild(this.container);
    }
}
