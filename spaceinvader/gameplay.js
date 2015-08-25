/**
 * Created by jipei on 8/20/15.
 */

const SPEED = 1;
const BULLETSPEED = 1;

window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update, render:render});
    var player;
    var monsters;
    var bullets;
    var monsterSpeed=100;
    var canShoot;

    var cursor;
    var shootKey;

    var score = 0;
    var win_label;
    var gameEnd = false;
    
    function preload () {
        // load assets
        game.load.image('airplane', 'airplane.png');
        game.load.image('bullet','bullet.png');
	    game.load.image('monster', 'monster.png');
    }

    function create () {
        // Create game world physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create player
        player = game.add.sprite(game.world.centerX, game.world.height - 50, 'airplane');
        player.scale.setTo(0.5,0.5);
        player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;

        // Create bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        // shoot key and cursor key
        shootKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        cursors = game.input.keyboard.createCursorKeys();

        // shoot speed
        game.time.events.loop(Phaser.Timer.SECOND*SPEED, allowShooting, this);

        // Create monsters
        monsters = game.add.group();
        monsters.enableBody = true;
        for (var i = 0; i < 4; ++i) {
            var monster = monsters.create(400, i * 30 + 150, 'monster');
            for (var j = 1; j < 5; ++j) {
            var monster = monsters.create(400 + j * 30, i * 30 + 150, 'monster');
            var monster = monsters.create(400 - j * 30, i * 30 + 150, 'monster');
            }
        }
        monsters.setAll('body.velocity.x', monsterSpeed);
        game.time.events.loop(Phaser.Timer.SECOND*2, monsterDir, this);

        // Create game score
        score_label = game.add.text(20, 20, 'Score', { font: '24px Arial', fill: '#fff'});

        // Create a label to use as a button
        pause_label = game.add.text(game.world.width - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.events.onInputUp.add(function () {
            // When the paus button is pressed, we pause the game
            game.paused = true;
            // And a label to illustrate which menu item was chosen. (This is not necessary)
            choiseLabel = game.add.text(game.world.width/2, game.world.height-150, 'Click anywhere to continue', { font: '30px Arial', fill: '#fff' });
            choiseLabel.anchor.setTo(0.5, 0.5);
        });
        // Add a input listener that can help us return from being paused
        game.input.onDown.add(unpause, self);
        // And finally the method that handels the pause menu
        function unpause(event){
            // Only act if paused
            if(game.paused){
                choiseLabel.destroy();
                // Unpause the game
                game.paused = false;
            }
        };
    }

    function update () {
        // Reset player speed
        player.body.velocity.x = 0;

        // Move the player
        if (cursors.left.isDown) {
            player.body.velocity.x = -150;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 150;
        }

        // Move the monsters

        //console.log("User '%s' not authenticated.", monsters.getBounds.x);
        if (monsters.getBounds.left < 100){
            monsters.setAll('body.velocity.x', 100);
        }else if (monsters.getBounds.left + monsters.getBounds.width > 700){
            monster.setAll('body.velocity.x', -100);
        }

        // Shoot
        if (shootKey.isDown && canShoot){
            var bullet = bullets.create(player.x, player.y - 30, 'bullet');
            bullet.scale.setTo(0.5,0.5);
            bullet.body.velocity.y = -1000*BULLETSPEED;
            canShoot = false;
        }

	    // Check Collision
	    game.physics.arcade.overlap(bullets, monsters, killMonster, null, this);

        // Check score
        score_label.text = 'score  ' + score ;

        // Check win
        if(monsters.total == 0 && gameEnd == false){
            win_label = game.add.text(game.world.centerX,game.world.centerY,'You Win', { font: '24px Arial', fill: '#fff' });
            win_label.anchor.setTo(0.5,0.5);
            game.time.events.add(Phaser.Timer.SECOND*3, restart, this);
            gameEnd = true;
        }

    }

    function allowShooting() {
        canShoot = true;
    }

    function restart() {
        // reset monster
        for (var i = 0; i < 4; ++i) {
            var monster = monsters.create(400, i * 30 + 150, 'monster');
            for (var j = 1; j < 5; ++j) {
                var monster = monsters.create(400 + j * 30, i * 30 + 150, 'monster');
                var monster = monsters.create(400 - j * 30, i * 30 + 150, 'monster');
            }
        }
        win_label.destroy();

        gameEnd = false;
    }

    function monsterDir() {
        monsterSpeed = -monsterSpeed;
        monsters.setAll('body.velocity.x', monsterSpeed);
    }

    function killMonster (bullet, monster) {
	    monster.kill();
	    bullet.kill();
	    score++;
    }

    function render() {

    }
};
