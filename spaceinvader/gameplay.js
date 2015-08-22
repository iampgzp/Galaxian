/**
 * Created by jipei on 8/20/15.
 */

window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});
    var player;
    var shoot;
    var canShoot;
    var score = 0;
    function preload () {

        game.load.image('airplane', 'airplane.png');
        game.load.image('bullet','bullet.png');

    }

    function create () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        player = game.add.sprite(game.world.centerX, game.world.height - 50, 'airplane');
        player.scale.setTo(0.5,0.5);
        player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;


        shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.time.events.loop(Phaser.Timer.SECOND*0.3, allowShooting, this);


        var w = 800;
        var h = 600;

        score_label = game.add.text(20, 20, 'Score', { font: '24px Arial', fill: '#fff'});

        // Create a label to use as a button
        pause_label = game.add.text(w - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.events.onInputUp.add(function () {
            // When the paus button is pressed, we pause the game
            game.paused = true;
            // And a label to illustrate which menu item was chosen. (This is not necessary)
            choiseLabel = game.add.text(w/2, h-150, 'Click anywhere to continue', { font: '30px Arial', fill: '#fff' });
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


    function allowShooting() {
        canShoot = true;
        score++;
    }

    function update () {
        score_label.text = 'score  ' + score ;
        var cursors = game.input.keyboard.createCursorKeys();

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

        }


        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown)
        {
            player.body.velocity.y = -100;
        }
        if (cursors.down.isDown){
            player.body.velocity.y = 100;
        }

        if (shoot.isDown && canShoot){

            var bullet = game.add.sprite(player.x, player.y, 'bullet');
            bullet.scale.setTo(0.5,0.5);
            bullet.anchor.setTo(0.5, 0.5);
            game.physics.arcade.enable(bullet);
            bullet.body.velocity.y = -10000;
            //canShoot = false;
        }

    }
};