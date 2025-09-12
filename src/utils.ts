import { Graphics, Container } from "pixi.js";

export function debugGrid(container: Container, width: number, height: number) {
    const graphics = new Graphics();

    container.addChild(graphics);

    for (let i = 0; i <= container.width; i += width) {
        graphics.moveTo(i, 0);
        graphics.lineTo(i, container.height);
    }
    for (let i = 0; i <= container.height; i += height) {
        graphics.moveTo(0, i);
        graphics.lineTo(container.width, i);
    }

    graphics.stroke("red");
}
