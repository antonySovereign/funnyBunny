import Carrot from './carrot.js'

export default class Game extends Phaser.Scene{

    carrotsCollected = 0;

    constructor(){
        super('game');
    }

    init(){this.carrotsCollected = 0}

    player_1;
    platforms;
    cursors;
    carrots;
    carrotsCollectedText;
    sandPlatforms;
    firstSandPlatform;
    platformY;
    platformY = 1;

    preload(){
        this.load.image('background', '../../assets/bg_layer1.png');
        this.load.image('ground-sand', '../../assets/ground_sand.png');
        this.load.image('platform_1', '../../assets/ground_grass.png');
        this.load.image('player_1', '../../assets/bunny1_ready.png');
        this.load.image('player_1_jump', '../../assets/bunny1_jump.png');
        this.load.image('player_1_hurt', '../../assets/bunny1_hurt.png');
        this.load.audio('jump', '../../assets/jump.mp3')

        this.cursors = this.input.keyboard.createCursorKeys();

        this.load.image('carrot', '../../assets/carrot.png')
    }
    create(){
        this.add.image(240, 320, 'background').setScrollFactor(1, 0);
        
        this.sandPlatforms = this.physics.add.staticGroup();
        this.firstSandPlatform = this.sandPlatforms.create(240, 950, 'ground-sand').setScale(0.5);
        this.firstSandPlatform.body.updateFromGameObject();
        
        this.platforms = this.physics.add.staticGroup();

        for (let i=0; i<5; ++i){
            const x = Phaser.Math.Between(-100, 600);
            const y = 200 * i;

            const platform = this.platforms.create(x, y, 'platform_1').setScale(0.5);
            platform.body.updateFromGameObject();
        }

        this.player_1 = this.physics.add.sprite(240, 850, 'player_1').setScale(0.5);
        this.physics.add.collider(this.platforms, this.player_1);
        this.physics.add.collider(this.sandPlatforms, this.player_1);
        this.player_1.body.checkCollision.up = false;
        this.player_1.body.checkCollision.left = false;
        this.player_1.body.checkCollision.right = false;

        this.cameras.main.startFollow(this.player_1);
        this.cameras.main.setDeadzone(this.scale.width * 1.5)

        this.carrots = this.physics.add.group({
            classType: Carrot
        })
        this.physics.add.collider(this.platforms, this.carrots)

        const style = { color: "#000", fontSize: 24 };
        this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style)
        .setScrollFactor(0)
        .setOrigin(0.5, 0)

        this.physics.add.overlap(
            this.player_1,
            this.carrots,
            this.handleCollectCarrot,
            undefined,
            this
        )

    }

    update(t, dt){
        const touchingDown = this.player_1.body.touching.down;
        if(touchingDown){ 
            this.player_1.setVelocityY(-800 - this.platformY);
            this.player_1.setTexture('player_1_jump')
            this.sound.play('jump')
        }

        const vy = this.player_1.body.velocity.y;
        if(vy > 0 && this.player_1.texture.key !== 'player_1') this.player_1.setTexture('player_1')


        this.platforms.children.iterate(child => {
            const platform = child;
            const scrollY = this.cameras.main.scrollY;
            if(platform.y >= scrollY + 700){
                platform.y = scrollY - Phaser.Math.Between(50, 100) - this.platformY;
                platform.x = Phaser.Math.Between(-200, 700);
                platform.body.updateFromGameObject();

                this.physics.world.disableBody(this.firstSandPlatform.body);
                this.firstSandPlatform.disableBody(true, true)

                this.addCarrotAbove(platform)
            }

            if(this.cursors.right.isDown && !touchingDown) this.player_1.setVelocityX(200);
            else if(this.cursors.left.isDown && !touchingDown) this.player_1.setVelocityX(-200);
            else this.player_1.setVelocityX(0)
        })

        const bottomPlatform = this.findBottomMostPlatform();
        if(this.player_1.y > bottomPlatform.y + 100) this.player_1.setTexture('player_1_hurt')
        if(this.player_1.y > bottomPlatform.y + 600){
            this.scene.start('game-over')
            this.platformY = 1;
        }

        if(this.player_1.x < -300 || this.player_1.x > 750){ this.scene.start('game-over'); this.platformY = 1; };
    }

    addCarrotAbove(sprite){
        const y = sprite.y - sprite.displayHeight;

        const carrot = this.carrots.get(sprite.x, y, 'carrot');
        carrot.setActive(true);
        carrot.setVisible(true);

        this.add.existing(carrot);

        carrot.body.setSize(carrot.width, carrot.height);

        this.physics.world.enable(carrot)

        return carrot;
    }

    handleCollectCarrot(player, carrot){
        this.physics.world.disableBody(carrot.body)
        this.carrots.killAndHide(carrot);

        this.carrotsCollected++;
        this.platformY += 8;

        const value = "Carrots: "+ this.carrotsCollected;
        this.carrotsCollectedText.text = value;
    }

    findBottomMostPlatform(){
        const platforms = this.platforms.getChildren();
        let bottomPlatform = platforms[0];

        for (let i=0; i<platforms.length; i++){
            const platform = platforms[i];

            if(platform.y < bottomPlatform.y) continue;
            bottomPlatform = platform;
        }

        return bottomPlatform;
    }

}
