import StartGame from './scenes/startGame.js';
import Game from './scenes/game.js';
import GameOver from './scenes/game_over.js';

console.log(Game)

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1000,
    height: 640,
    scene: [StartGame, Game, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 750
            },
            debug: false
        }
    }
})