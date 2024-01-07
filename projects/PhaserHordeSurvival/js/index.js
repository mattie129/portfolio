import 'phaser';
import GameScene from './js/game2.js';
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#333333',
    scale: {
        zoom:4
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    /*scene: {
        preload: preload,
        create: create,
        update: update     
    },
    callbacks: {
        postBoot: function (game) {
            game.canvas.style.width = '60%';
            game.canvas.style.height = '60%';
        }
    }*/
};

class Settings{
    constructor(scaleUp){
        this.scaleUp = scaleUp; 
        this.grid = 16;
        this.tile = this.grid * scaleUp;
    }
}


class enemy{
    constructor(xSpeed, ySpeed){
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }
}

var game = new Phaser.game(config);

class Game extends Phaser.Game{
    constructor(){
        super(config);
        this.scene.add('Game', GameScene);
        this.scene.start('Game');
    }
}

window.onload = function () {
    window.game = new Game();
}