import {
    Application,
    Assets,
    Container,
    Sprite,
    Graphics,
    AnimatedSprite,
    Texture,
    Spritesheet,
    BlurFilter,
} from "pixi.js";

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

let app: Application;
let paused = false;

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

    const player = new Player();

    const world = new World();

    const menu = new Menu(world);

    input(player);

    world.display();
    world.addChild(player);
    app.ticker.add((time) => {
        menu.run();
        if (!paused) {
            player.movement();
        }
    });
})();

let keysPressed = { Escape: false };

function input(player: Player) {
    addEventListener("keydown", (e) => {
        if (
            ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
        ) {
            e.preventDefault();
            keysPressed[e.key] = true;
        }
        if (e.key === "Escape") {
            keysPressed[e.key] = !keysPressed[e.key];
            paused = !paused;
        }
    });

    addEventListener("keyup", (e) => {
        if (keysPressed[e.key] === undefined || e.key === "Escape") {
            return;
        }
        keysPressed[e.key] = false;
        player.playAnimation("idle");
    });
}

class Menu extends Container {
    graphics: Graphics;
    filter: BlurFilter;
    world: Container;

    constructor(world: Container) {
        super();
        this.graphics = new Graphics();
        this.filter = new BlurFilter();
        this.world = world;
        this.zIndex = 20;
        this.addChild(this.graphics);
        app.stage.addChild(this);
    }

    run() {
        if (keysPressed["Escape"]) {
            this.visible = true;
            this.world.filters = [this.filter];
        } else {
            this.visible = false;
            this.world.filters = null;
        }
        this.graphics.clear()
        this.container();
    }

    container() {
        const width = app.screen.width / 2.2;
        const height = app.screen.height / 1.2;

        this.graphics
            .roundRect(
                app.screen.width / 2 - width / 2,
                app.screen.height / 2 - height / 2,
                width,
                height,
                10
            ).fill({color: 0x000000, alpha: 0.4})
    }
}

class Player extends Container {
    sheet: Spritesheet;
    idle: AnimatedSprite;
    run: AnimatedSprite;
    currentAnimation: null | AnimatedSprite;
    animations: { idle?: AnimatedSprite; run?: AnimatedSprite };

    constructor() {
        super();
        this.sheet = Assets.get("assets/pawn.json");
        this.currentAnimation = null;
        this.animations = {};
        this.idle = new AnimatedSprite(this.sheet.animations["idle"]);
        this.idle.animationSpeed = 0.15;
        this.animations.idle = this.idle;
        this.addChild(this.idle);
        this.run = new AnimatedSprite(this.sheet.animations["run"]);
        this.run.animationSpeed = 0.15;
        this.animations.run = this.run;
        this.addChild(this.run);

        for (const anim in this.animations) {
            this.animations[anim].visible = false;
        }

        this.pivot.x = this.sheet.textures["idle_frame1.png"].orig.width / 2;
        this.pivot.y = this.sheet.textures["idle_frame1.png"].orig.height / 2;
        this.playAnimation("idle");
        console.log(this.sheet.textures["idle_frame1.png"].orig);
    }

    movement() {
        if (keysPressed["ArrowUp"]) {
            this.position.y -= 3;
            this.playAnimation("run");
        }
        if (keysPressed["ArrowDown"]) {
            this.position.y += 3;
            this.playAnimation("run");
        }
        if (keysPressed["ArrowLeft"]) {
            this.position.x -= 3;
            this.setDirection("left");
            this.playAnimation("run");
        }
        if (keysPressed["ArrowRight"]) {
            this.position.x += 3;
            this.setDirection("right");
            this.playAnimation("run");
        }
    }

    playAnimation(animationName: string) {
        const newAnimation = this.animations[animationName];

        if (!newAnimation || newAnimation === this.currentAnimation) {
            return;
        }

        if (this.currentAnimation) {
            this.currentAnimation.stop();
            this.currentAnimation.visible = false;
        }

        newAnimation.visible = true;
        newAnimation.play();
        this.currentAnimation = newAnimation;
    }

    setDirection(direction) {
        if (direction === "left") {
            this.scale.x = -1;
        } else if (direction === "right") {
            this.scale.x = 1;
        }
    }
}

class World extends Container {
    grass: Sprite;

    constructor() {
        super();
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
        app.stage.addChild(this);
    }
}
