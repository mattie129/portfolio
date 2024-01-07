var config = {
    width:800,
    height:600,
    backgroundColor: '#333333',
    type: Phaser.AUTO,
    parent: 'game',
    scene:{
        preload: preload,
        create: create
    },
    scale:{
        zoom:2,
    },
    physics: {
        default: 'matter',
        matter: {
            debug:true,
            gravity:{y:0},
        }
    },
    plugins:{
        scene: [
            {
               plugin: PhaserMatterCollisionPlugin,
               key: 'matterCollision',
               mapping: 'matterCollision', 
            }
        ]
    }
}

var game = new Phaser.Game(config);


function preload ()
{
    this.load.setBaseURL('https://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

}
