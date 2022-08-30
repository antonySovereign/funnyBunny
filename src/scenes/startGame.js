export default class StartGame extends Phaser.Scene {
    constructor(){
        super("start-game")
    }

    preload(){
        this.load.image('bg-start', '../../assets/gameOverBg.png');
    }

    create(){
        this.add.image(240, 320, 'bg-start').setScrollFactor(1, 0);
        const width = this.scale.width;
        const height = this.scale.height;

        this.text("Funny Bunny", width*0.5, height*0.5, 48);
        this.text("(press SPACE to start)", width*0.5, height*0.7, 30)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })
    }

    text(text, x, y, fontSize){
        this.add.text(x, y, text, {
            fontSize: fontSize
        }).setOrigin(0.5)
    }
}