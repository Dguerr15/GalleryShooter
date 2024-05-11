class Start extends Phaser.Scene {
    constructor(){
        super("Start");
    }
    preload(){
        this.my = {sprite: {}};
        this.load.image('background', 'assets/GSMap.png');
    }
    create(){
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        background.setDepth(-1);
        background.setAlpha(0.5);

        this.add.text(140, 150, 'Sky Invaders',
        { 
            fontFamily: 'Times, serif',
            fontSize: 42,
            color: "#4FFFF6"
        });
        this.add.text(200, 500, 'A = Left\nD = Right\nSpace = Shoot',
        { 
            fontFamily: 'Times, serif',
            fontSize: 20,
            color: "#4FFFF6"
        });
        this.add.text(50, 350, 'Click to Start the Game',
        { 
            fontFamily: 'Times, serif',
            fontSize: 42,
            color: "#4FFFF6"
        });
    }
    update(){
        let my = this.my;
        let pointer = this.input.activePointer;
        if (pointer.isDown){
            this.scene.start("GalleryShooter");
        }
    }
}