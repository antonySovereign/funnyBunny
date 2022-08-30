export default class GameOver extends Phaser.Scene {
    constructor(){
        super("game-over")
    }

    preload(){
        this.load.image('bg-over', '../../assets/gameOverBg.png');
    }

    create(){
        this.add.image(240, 320, 'bg-over').setScrollFactor(1, 0);
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.text("Game Over", width*0.5, height*0.5, 48);
        this.text("(press SPACE to continue)", width*0.5, height*0.7, 35)
        
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