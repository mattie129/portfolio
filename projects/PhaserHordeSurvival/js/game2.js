


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
    scene: {
        //scene : [GameScene]
        preload: preload,
        create: create,
        update: update,
    },
    callbacks: {
        postBoot: function (game) {
            game.canvas.style.width = '60%';
            game.canvas.style.height = '60%';
        }
    }
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

/*
class GameScene extends Phaser.Scene{
    constructor(){
        super({key: 'GameScene', active: true})
    }
   
}
*/

var game = new Phaser.Game(config);
/*
game.state.add('GameScene', new GameScene());
game.state.start('GameScene');

*/


//var game = new Phaser.Game(config);

function preload ()
{
    
    info = new Settings(2);
    let allSprites;
    this.load.image('background', 'assets/testmap.png');
    this.load.image('player', 'assets/playerMonkey.png');
    this.load.image('enemy', 'assets/bullet7.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('xp', 'assets/xp.png');
    this.load.image('statBar', 'assets/chocolate.png');

    let bg;

    let pause;

    let player;
    var healthBar;
    let xpRequirements;

    let keyW;
    let keyA;
    let keyS;
    let keyD;
    let APressed = false;
    let DPressed = false;

    let keyO;
    let enemyControl;


    let enemies;
 

    let autoShoot;
    let bullets;
    
    let xpGroup;
    let xpToAdd;

    let levelUp = false;

}


function create ()
{    
    console.log("1");
    
    pause = false; //set to true to pause game for upgrade menu

    //background
    bg = this.add.image(0,0, 'background').setOrigin(0, 0);
    bg.setScale(info.scaleUp);
    let overlay = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000, 0.5);
    overlay.setOrigin(0);
    overlay.setScale(info.scaleUp*2);
    console.log("1");


    //player
    player = this.physics.add.sprite(info.tile, info.tile, 'player');
    player.setScale(0.26);
    player.autoShootSpeed = 1000;
    player.maxHp = 100
    player.hp = player.maxHp;
    player.speed = 4;
    player.xp = 0;
    player.level = 1;
    xpRequirements = [4, 8, 10, 15, 20, 25, 30];
    player.maxXp = xpRequirements[player.level-1];

    player.setCollideWorldBounds(true);
    console.log("1");

    //player health bar
    //this.barBackground = this.add.sprite(100,100,'statBar');
    //this.barBackground.scale = 0.1;
    //this.barBackground.width = 20;
    //this.barBackground.height = 2;
    this.hpBarForeground = this.add.graphics();
    this.hpBarForeground.fillStyle(0xFF0000, 100);
    this.hpBarForeground.fillRect(0, 0, config.width, 20);
    this.hpBarForeground.setScrollFactor(0);
    

    //player xp bar
    console.log("1");
   

    this.xpBarForeground = this.add.graphics();
    this.xpBarForeground.fillStyle(0x4bd1ff, 100);
    this.xpBarForeground.fillRect(0, 20, config.width, 20);
    
    this.xpBarForeground.setScrollFactor(0);

    //this.upgradeButton1 = this.add.button();

    //upgradeButton1 = this.add.graphics(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game');
    //upgradeButton1.setOrigin(0.5);
    //upgradeButton1.setPadding(10);
    //upgradeButton1.setStyle({ backgroundColor: '#111' });
    //upgradeButton1.setInteractive({ useHandCursor: true });
    //upgradeButton1.on('pointerdown', () => console.log() );
    //upgradeButton1.on('pointerover', () => upgradeButton1.setStyle({ fill: '#f39c12' }));
    //upgradeButton1.on('pointerout', () => upgradeButton1.setStyle({ fill: '#FFF' }));

    //camera follow player
    this.cameras.main.setBounds(0,0,bg.displayWidth, bg.displayHeight);
    this.physics.world.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
    this.cameras.main.startFollow(player);
    console.log("1")
    

    
    //auto shooter
    bullets  = this.physics.add.group();
    autoShoot = this.time.addEvent({ delay: player.autoShootSpeed, callback: autoShooter, callbackScope: this, loop: true });
    console.log(this);

    //controls
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


    levelUp = false;
    console.log("1");


    

    //create enemy group
    enemies = this.physics.add.group({
        /*
        key: 'enemy',
        repeat: 7,
        setXY: { d: info.tile, y: info.tile*4, stepX: info.tile },
        */
    });
    /*s
    for(let i=0; i<8; i++){
        let e = this.physics.add.sprite(info.tile*i+3, info.tile*6, 'enemy');
        enemies.add(e);
    }
    */

    //create xp group
    xpGroup = this.physics.add.group({

    });
    console.log("1");

    xpToAdd = {
        x : -1,
        y : -1
    }
    //auto enemy spawn
    autoEnemySpawn = this.time.addEvent({delay: 400, callback: randomEnemySpawn, callbackScope: this, loop: true});


    //call function on each enemy
    
    Phaser.Actions.Call(enemies.getChildren(), function(b) {
        b.setScale(info.scaleUp);
        b.speed = [0, 2];
        b.body.setBounce(60);
    }, this);

    //player/enemy collider
    this.physics.add.collider(player, enemies, function (player, enemy) {
        player.setVelocity(0);
        enemy.destroy();
        player.hp-=20;
        
    })

    //enemy/bullet collider

    this.physics.add.collider(bullets, enemies, function (bullet, enemy) {
        xpToAdd.x = enemy.x;
        xpToAdd.y = enemy.y;
        if(bullet.canCollide){
            enemy.destroy();
            bullet.canCollide = false;
        }
        bullet.destroy();
    })
    
    //player/xp collider
    this.physics.add.collider(player, xpGroup, function (player, xp) {
        player.xp +=1;
        xp.destroy();

        //showUpgradeWindow(game, game.add);
        

        if(player.xp == player.maxXp){
            //to do: level up
            //pause = true;
            

            player.level +=1;
            
            if (player.level <= xpRequirements.length){
                player.maxXp = xpRequirements[player.level-1];
            } else{
                player.maxXp = xpRequirements[xpRequirements.length-1];
            }


            levelUp = true;
            
            player.xp = 0;
            







            //pause = false;
            
            
        }
    })

    console.log("1");

    
    



}


function showUpgradeWindow(game){
    
    //var upgradeWindow = game.add.graphics();
    
    /*
    
    game.upgradeWindow = game.add.graphics();
    game.upgradeWindow.fillStyle(0x888888, 1);
    game.upgradeWindow.fillPath();
    game.upgradeWindow.x = 50;
    game.upgradeWindow.y = 50;
    game.upgradeWindow.displayHeight = 100;
    game.upgradeWindow.diaplayWidth = 100;
    */
}



function update(){
    
    
    
    
    //GUI//
    this.hpBarForeground.scaleX = player.hp/player.maxHp;
    this.xpBarForeground.scaleX = player.xp/player.maxXp;
    
    
    if(player.hp < 1){ //to do: make this activate only once 
        player.destroy();
        autoEnemySpawn.remove(false);
        pause = true;
    }

    
    


    

    
    //drop xp//
    if (xpToAdd.x>=0){
        let xp = this.physics.add.sprite(xpToAdd.x, xpToAdd.y, 'xp');

        xp.setScale(0.05);
        
        xpGroup.add(xp);
        xpToAdd.x = -1;
        xpToAdd.y = -1;
    }

    //game movement when not paused.
    if (!pause){
        //Player WASD Movement
        if(keyW.isDown){
            player.y -=player.speed;
        }
        if (keyA.isDown && DPressed == true){
            player.x -=2*player.speed;
        }
        else if(keyA.isDown){
            player.x -=player.speed;
            APressed = true;
        } else{
            APressed = false;
        }

        if (keyD.isDown && APressed == true){
            player.x +=player.speed*2
        }
        else if (keyD.isDown){
            player.x +=player.speed
            DPressed = true;
        } else{
            DPressed = false;
        }
        if(keyS.isDown){
            player.y +=player.speed;
        }
        //bullet movement
        Phaser.Actions.Call(bullets.getChildren(), function(b) {
            if (b.closestEnemy.scene){ //check if closest enemy is still in game scene
                this.physics.velocityFromRotation(Phaser.Math.Angle.Between(b.x, b.y, b.closestEnemy.x, b.closestEnemy.y), 300, b.body.velocity)
                b.rotation =  Phaser.Math.Angle.Between(b.x, b.y, b.closestEnemy.x, b.closestEnemy.y);
            } else{
                this.physics.velocityFromRotation(b.rotation, 300, b.body.velocity)
            }
        }, this);


        //enemy movement
        
        enemies.children.each(function(b){
            this.physics.velocityFromRotation(Phaser.Math.Angle.Between(b.x, b.y, player.x, player.y), 100, b.body.velocity)
            if((player.x>b.x-info.tile && player.x< b.x+info.tile)&&(player.y>b.y-info.tile && player.y< b.y+info.tile)){ //extra collision parameters because default is buggy
                player.hp-=20;
                b.destroy();
            }
        }, this);
    } else{
        enemies.children.each(function(b){
            b.body.velocity.x =0;
            b.body.velocity.y =0;
        }, this);
    }
     
    if (levelUp == true){
        //increase bullet speed

        player.autoShootSpeed = player.autoShootSpeed * 0.85;
            
        //remove auto shooter
        autoShoot.remove(false);
        autoShoot = null;
        //restart auto shooter

        //console.log(game);
        autoShoot = this.time.addEvent({ delay: player.autoShootSpeed, callback: autoShooter, callbackScope: this, loop: true });



        //upgrade menu


        levelUp = false;
        
    }
    
}

function clickUpgrade(button){

}

function randomEnemySpawn(){
    let xVal = (Math.random() * bg.width * info.scaleUp);
    let yVal = (Math.random() * bg.height * info.scaleUp);

    let playerZone = 12;

    while((player.x>xVal-info.tile*playerZone && player.x< xVal+info.tile*playerZone)&&(player.y>yVal-info.tile*playerZone && player.y<yVal+info.tile*playerZone)){ //don't let enemy spawn within playerZone tiles
        xVal = (Math.random() * bg.width * info.scaleUp);
        yVal = (Math.random() * bg.height * info.scaleUp);
    }


    let e = this.physics.add.sprite(xVal, yVal, 'enemy');
    enemies.add(e); 
    

}



function autoShooter(){
    
    let closestEnemy;
    //db.angle = Phaser.Math.Angle.Between(b.x, b.y, closestEnemy.x, closestEnemy.y);
    Phaser.Actions.Call(enemies.getChildren(), function(b) {
        if (!closestEnemy ||  Phaser.Math.Distance.BetweenPoints(player, b) <  Phaser.Math.Distance.BetweenPoints(player, closestEnemy)){
            closestEnemy = b;
        }
    }, this);

    if(closestEnemy){
        let b = this.physics.add.sprite(player.x, player.y, 'bullet');
        b.setScale(0.1);
        b.rotation =  Phaser.Math.Angle.Between(b.x, b.y, closestEnemy.x, closestEnemy.y);
        b.closestEnemy = closestEnemy;
        b.canCollide = true;
        bullets.add(b);
    }   
    //bullets.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'bullet');
}



function setValue(bar, percentage){
    bar.scaleX = percentage/100;
}