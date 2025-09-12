import { Spritesheet, AnimatedSprite, Container, Assets } from "pixi.js";

export default class Player extends Container {
    keysPressed: {};
    sheet: Spritesheet;
    idle: AnimatedSprite;
    run: AnimatedSprite;
    currentAnimation: null | AnimatedSprite;
    animations: { idle?: AnimatedSprite; run?: AnimatedSprite };

    constructor(keysPressed: {}) {
        super();
        this.keysPressed = keysPressed;

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
        if (this.keysPressed["ArrowUp"]) {
            this.position.y -= 3;
            this.playAnimation("run");
        }
        if (this.keysPressed["ArrowDown"]) {
            this.position.y += 3;
            this.playAnimation("run");
        }
        if (this.keysPressed["ArrowLeft"]) {
            this.position.x -= 3;
            this.setDirection("left");
            this.playAnimation("run");
        }
        if (this.keysPressed["ArrowRight"]) {
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

    setDirection(direction: string) {
        if (direction === "left") {
            this.scale.x = -1;
        } else if (direction === "right") {
            this.scale.x = 1;
        }
    }
}
