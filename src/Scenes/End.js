class End extends Phaser.Scene {
    constructor(){
        super("End");
    }
    preload(){
        this.load.image('background', 'assets/GSMap.png');
    }
    create(){
        const score = this.scene.settings.data.score;
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        background.setDepth(-1);
        background.setAlpha(0.5);
        this.add.text(130, 350, 'Final Score: ' + score,{ 
            fontFamily: 'Times, serif',
            fontSize: 42,
            color: "#F00000"
        });
        this.add.text(150, 150, 'Game\n Over',
        { 
            fontFamily: 'Times, serif',
            fontSize: 72,
            color: "#F00000"
        });
        this.add.text(100, 570, 'by David Guerrero-Pantoja',
        { 
            fontFamily: 'Times, serif',
            fontSize: 30,
            color: "#F00000"
        });
        this.add.text(150, 470, 'press r to restart',
        { 
            fontFamily: 'Times, serif',
            fontSize: 30,
            color: "#F00000"
        });

        this.RKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
    update(){
        if (this.RKey.isDown) {
            this.scene.start('GalleryShooter')
        }
    }
}