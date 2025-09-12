import Player from "./player"

export default function (player: Player, keysPressed, paused) {
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
