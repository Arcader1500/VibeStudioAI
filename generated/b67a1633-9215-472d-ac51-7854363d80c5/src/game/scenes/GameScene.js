import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import UI from '../entities/UI.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;

        // Background
        this.add.image(400, 300, 'background');

        // World bounds
        this.physics.world.setBounds(0, 0, 3200, 600);
        this.cameras.main.setBounds(0, 0, 3200, 600);

        // Platforms group
        this.platforms = this.physics.add.staticGroup();

        // Ground
        this.ground = this.platforms.create(1600, 584, 'platform');
        this.ground.setScale(50, 1).refreshBody(); // long ground

        // Additional platforms (example)
        this.platforms.create(400, 400, 'platform');
        this.platforms.create(800, 300, 'platform');
        this.platforms.create(1200, 450, 'platform');
        this.platforms.create(2000, 350, 'platform');
        this.platforms.create(2400, 250, 'platform');
        this.platforms.create(2800, 400, 'platform');

        // Spikes group
        this.spikes = this.physics.add.staticGroup();
        // Place spikes on some platforms
        this.spikes.create(500, 368, 'spike');
        this.spikes.create(900, 268, 'spike');
        this.spikes.create(1300, 418, 'spike');
        this.spikes.create(2100, 318, 'spike');
        this.spikes.create(2500, 218, 'spike');
        this.spikes.create(2900, 368, 'spike');

        // Coins group
        this.coins = this.physics.add.staticGroup();
        // Place coins
        this.coins.create(600, 200, 'coin');
        this.coins.create(1000, 150, 'coin');
        this.coins.create(1400, 300, 'coin');
        this.coins.create(1800, 200, 'coin');
        this.coins.create(2200, 150, 'coin');
        this.coins.create(2600, 100, 'coin');
        this.coins.create(3000, 200, 'coin');

        // Portal
        this.portal = this.physics.add.staticSprite(3100, 536, 'portal');
        this.portal.body.setAllowGravity(false);

        // Player
        this.player = new Player(this, 100, 500);
        this.physics.add.collider(this.player, this.platforms);

        // Colliders
        this.physics.add.overlap(this.player, this.spikes, this.hitSpike, null, this);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.portal, this.reachPortal, null, this);

        // Camera follow player
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // UI
        this.ui = new UI(this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Pause
        this.keyEsc.on('down', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    update() {
        if (this.gameOver) return;

        // Player movement
        const speed = 300;
        let moveX = 0;
        if (this.cursors.left.isDown || this.keyA.isDown) {
            moveX = -speed;
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
            moveX = speed;
        }
        this.player.setVelocityX(moveX);

        // Rotate on space
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
            this.player.rotateBall();
        }

        // Check if fallen off screen
        if (this.player.y > 650) {
            this.loseLife();
        }
    }

    hitSpike(player, spike) {
        this.loseLife();
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.score += 10;
        this.ui.updateScore(this.score);
    }

    reachPortal(player, portal) {
        // Win
        this.scene.start('GameOverScene', { score: this.score, won: true });
    }

    loseLife() {
        this.lives -= 1;
        this.ui.updateLives(this.lives);
        if (this.lives <= 0) {
            this.gameOver = true;
            this.player.setVelocity(0, 0);
            this.player.setActive(false);
            this.scene.start('GameOverScene', { score: this.score, won: false });
        } else {
            // Reset player position
            this.player.setPosition(100, 500);
            this.player.setVelocity(0, 0);
        }
    }
}
