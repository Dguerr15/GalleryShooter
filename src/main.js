// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 500,
    height: 700,
    scene: [Start,GalleryShooter,End],
    fps: { forceSetTimeOut: true, target: 30 }
}

const game = new Phaser.Game(config);