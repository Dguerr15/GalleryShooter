class GalleryShooter extends Phaser.Scene {
    constructor(){
        super("GalleryShooter");
        this.my = {sprite: {}};
        this.playerSpeed = 10;
        this.shootCooldown = 15;
        this.currentCooldown = 0;
        this.level = 1;
        this.EnemiesLeft = 4;
        this.score = 0;
        this.Lives = 3;
        this.enemyBulletSpeed = 10;
        this.enemyShotCooldown = 65;
        this.enemyCurrentCooldown = 0;
        this.shooter = 0;
        this.isPlayerHit = false;
        this.immunityTime = 10;
        this.currentImmunity = 0;

    }
    preload(){
        this.load.image('ship', 'assets/ships/ship_0000.png');
        this.load.image('background', 'assets/GSMap.png'); 
        this.load.image('bullet', 'assets/Tiles/tile_0012.png')
        this.load.image('enemy', 'assets/ships/ship_0017.png');
        this.load.image('bigEnemy', 'assets/ships/ship_0015.png');
        this.load.audio('shoot', 'assets/Audio/laserRetro_003.ogg');
        this.load.audio('enemyShoot', 'assets/Audio/laserRetro_004.ogg');
        this.load.audio('explosion', 'assets/Audio/explosionCrunch_003.ogg')
        this.load.image('explosionFrame1', 'assets/Tiles/tile_0004.png');
        this.load.image('explosionFrame2', 'assets/Tiles/tile_0005.png');
        this.load.image('explosionFrame3', 'assets/Tiles/tile_0006.png');
        this.load.image('explosionFrame4', 'assets/Tiles/tile_0007.png');
    }
    create(){
        let my = this.my;
        this.init_game();
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        background.setDepth(-1);

        my.sprite.player = this.add.sprite(250, 650, "ship");
        my.sprite.player.setScale(1.5);

        this.SPACEKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.points = [
            441, 28,
            513, 159,
            700, 262,
            803, 279,
            850, 334,
            802, 437,
            750, 580,
            457, 616,
            300, 670,
        ];
        this.curve = new Phaser.Curves.Spline(this.points);

        this.bigPoints = [
            691, 12,
            693, 76,
            650, 132,
            518, 180,
            425, 203,
            410, 258,
            489, 325,
            664, 336,
            756, 356,
            748, 445,
            697, 508,
            525, 538,
            410, 549,
            430, 645,
            456, 736,
            548, 768,
            665, 781
        ]

        this.bigCurve = new Phaser.Curves.Spline(this.bigPoints); 

        this.emittedSprites = [];

        this.enemyBullets = [];

        this.enemiesGroup = this.add.group();

        this.createEnemies();

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        this.levelText = this.add.text(300, 16, 'Level: 1', { fontSize: '32px', fill: '#000' });

        this.livesText = this.add.text(300,650, 'Lives: 3', { fontSize: '32px', fill: '#000' })


        this.anims.create({
            key: 'explode',
            frames: [
                { key: 'explosionFrame1' },
                { key: 'explosionFrame2' },
                { key: 'explosionFrame3' },
                { key: 'explosionFrame4' }
            ],
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true 
        });
        
    }
    update(){
        let my = this.my;

        if(this.isPlayerHit){
            if (this.currentImmunity > this.immunityTime){
                this.isPlayerHit = false;
                this.currentImmunity = 0;
            }else{
                this.currentImmunity++;
            }
         
        }

        if (this.AKey.isDown) {
            my.sprite.player.x -= this.playerSpeed;
        } else if (this.DKey.isDown) {
            this.my.sprite.player.x += this.playerSpeed;
        }

        my.sprite.player.x = Phaser.Math.Clamp(my.sprite.player.x, 0, this.game.config.width);

        if (Phaser.Input.Keyboard.JustDown(this.SPACEKey) && this.currentCooldown<= 0) {
            let emittedSprite = this.add.sprite(this.my.sprite.player.x, this.my.sprite.player.y, 'bullet');
            this.emittedSprites.push(emittedSprite);
            this.currentCooldown = this.shootCooldown;
            this.sound.play('shoot', {
                volume: .3
             });
        }

        for (let i = 0; i < this.emittedSprites.length; i++) {
            let emittedSprite = this.emittedSprites[i];
            emittedSprite.y -= this.playerSpeed;
            if (emittedSprite.y < -100) { 
                emittedSprite.destroy();
                this.emittedSprites.splice(i, 1);
                i--;
            }
        }
        this.currentCooldown--;

        this.enemiesGroup.getChildren().forEach(enemyShip => {
            if (enemyShip.y > this.game.config.height || enemyShip.x < 0) {
                enemyShip.y = -enemyShip.displayHeight;
            }
        });
        
        if(this.shooter >= (this.EnemiesLeft-1)){
            this.shooter = 0 ;
        }else{
            this.shooter++;
        }
        let enemyShips = this.enemiesGroup.getChildren();
        let enemyShip = enemyShips[this.shooter];
        if (this.enemyCurrentCooldown <= 0) {
            this.createEnemyBullet(enemyShip);
            this.enemyCurrentCooldown = this.enemyShotCooldown/(this.EnemiesLeft);
            this.sound.play('enemyShoot', {
                volume: .3
             });
        }
        this.enemyCurrentCooldown--; 
        
        this.emittedSprites.forEach(bullet => {
            this.enemiesGroup.getChildren().forEach(enemyShip => {
                if (this.checkOverlap(bullet, enemyShip)) {
                    bullet.destroy();
                    enemyShip.destroy();
                    this.sound.play('explosion', {
                        volume: .7
                    });
                    let explosion = this.add.sprite(enemyShip.x, enemyShip.y, 'explosionFrame1').setScale(2);
                    explosion.play('explode');

                    this.score+=100;
                    this.scoreText.setText('Score: ' + this.score);
                    this.shooter = 0;
                    enemyShip = enemyShips[this.shooter];
                    this.EnemiesLeft--;
                    if (this.EnemiesLeft === 0) {
                        this.level++;
                        this.levelText.setText('Level: ' + this.level);
                        this.createEnemies();
                        this.EnemiesLeft = 4;
                        this.enemyCurrentCooldown = this.enemyShotCooldown;
                    }
                }
            });
        });
    
        for (let i = 0; i < this.enemyBullets.length; i++) {
            let enemyBullet = this.enemyBullets[i];
            enemyBullet.y += this.enemyBulletSpeed;
            if (enemyBullet.y > 700) { 
                enemyBullet.destroy();
                this.enemyBullets.splice(i, 1);
                i--;
            }
        }
        this.enemyCurrentCooldown--;

        if (!this.isPlayerHit) {
            this.enemyBullets.forEach(enemyBullet => {
                if (this.checkOverlap(this.my.sprite.player, enemyBullet)) {
                    enemyBullet.destroy();
                    this.sound.play('explosion', {
                        volume: .7
                     });
                    this.Lives--;
                    this.livesText.setText('Lives: ' + this.Lives);
                    this.isPlayerHit = true;

                    if (this.Lives === 0) {
                        this.scene.start("End", {score: this.score});
                    }
                }
            });
        }
    }
    
    createEnemies() {
        const enemyShip1 = this.add.follower(this.curve, 10, -30, "enemy");
        enemyShip1.angle = 180;
        enemyShip1.setScale(1.5);
        const enemyShip2 = this.add.follower(this.curve, 70, -30, "enemy");
        enemyShip2.angle = 180;
        enemyShip2.setScale(1.5);
        const enemyShip3 = this.add.follower(this.curve, 100, -30, "enemy");
        enemyShip3.angle = 180;
        enemyShip3.setScale(1.5);

        const BigShip = this.add.follower(this.bigCurve, 300, -30, "bigEnemy");
        BigShip.angle = 180;
        BigShip.setScale(4);
        this.enemiesGroup.addMultiple([enemyShip1, enemyShip2, enemyShip3, BigShip]);


        enemyShip1.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 8000*(Math.max(0.4,1 - this.level /20)),
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: false,
            rotationOffset: -90
        });
        enemyShip2.startFollow({
            from: 0,
            to: 1,
            delay: 5,
            duration: 5000*(Math.max(0.4,1 - this.level /20)),
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: false,
            rotationOffset: -90
        });
        enemyShip3.startFollow({
            from: 0,
            to: 1,
            delay: 30,
            duration: 4000*(Math.max(0.4,1 - this.level /20)),
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: false,
            rotationOffset: -90
        });
        BigShip.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 20000*(Math.max(0.6,1 - this.level /30)),
            ease: 'Sine.easeOutIn',
            repeat: -1,
            yoyo: false,
            rotateToPath: false,
            rotationOffset: -90
        });
    }

    checkOverlap(spriteA, spriteB) {
        let a = {
            x: spriteA.x,
            y: spriteA.y,
            rx: spriteA.width / 2,
            ry: spriteA.height / 2
        };
    
        let b = {
            x: spriteB.x,
            y: spriteB.y,
            rx: spriteB.width / 2,
            ry: spriteB.height / 2
        };
    
        if (Math.abs(a.x - b.x) > (a.rx + b.rx)) return false;
        if (Math.abs(a.y - b.y) > (a.ry + b.ry)) return false;
    
        return true;
    }

    createEnemyBullet(enemyShip) {
        let bullet = this.add.sprite(enemyShip.x, enemyShip.y, 'bullet');
        bullet.angle = 180;
        if(enemyShip.texture.key === 'bigEnemy'){
            bullet.setScale(3);
        }else{
            bullet.setScale(1.5);
        }
        this.enemyBullets.push(bullet);
    }
    init_game(){
        this.currentCooldown = 0;
        this.level = 1;
        this.EnemiesLeft = 4;
        this.score = 0;
        this.Lives = 3;
        this.enemyCurrentCooldown = 0;
        this.shooter = 0;
        this.isPlayerHit = false;
        this.currentImmunity = 0;
    }
}