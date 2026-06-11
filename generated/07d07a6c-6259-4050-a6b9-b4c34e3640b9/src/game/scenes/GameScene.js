import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import UI from '../entities/UI.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#4466aa');
    
    // Create level groups
    this.groundGroup = this.physics.add.staticGroup();
    this.hazardGroup = this.physics.add.staticGroup();
    this.portalGroup = this.physics.add.staticGroup();
    this.rotateBlockGroup = this.physics.add.staticGroup();
    
    // Build level
    this.buildLevel();
    
    // Create player
    this.player = new Player(this, 100, 500);
    
    // Create enemies
    this.enemies = [];
    this.spawnTimer = this.time.addEvent({
      delay: 3000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
    
    // Collisions
    this.physics.add.collider(this.player.sprite, this.groundGroup);
    this.physics.add.collider(this.player.sprite, this.rotateBlockGroup);
    
    this.physics.add.overlap(this.player.sprite, this.hazardGroup, this.hitHazard, null, this);
    this.physics.add.overlap(this.player.sprite, this.portalGroup, this.reachPortal, null, this);
    
    // UI
    this.ui = new UI(this);
    
    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    this.input.on('pointerdown', () => {
      if (!this.gameOver) {
        this.player.rotateBlock();
      }
    });
  }

  buildLevel() {
    // Ground
    for (let x = 0; x < 800; x += 16) {
      this.groundGroup.create(x, 584, 'ground');
    }
    
    // Platforms
    this.groundGroup.create(200, 400, 'ground');
    this.groundGroup.create(216, 400, 'ground');
    this.groundGroup.create(232, 400, 'ground');
    
    this.groundGroup.create(500, 300, 'ground');
    this.groundGroup.create(516, 300, 'ground');
    this.groundGroup.create(532, 300, 'ground');
    this.groundGroup.create(548, 300, 'ground');
    
    this.groundGroup.create(100, 200, 'ground');
    this.groundGroup.create(116, 200, 'ground');
    
    // Hazards
    this.hazardGroup.create(300, 568, 'hazard');
    this.hazardGroup.create(400, 400, 'hazard');
    this.hazardGroup.create(600, 284, 'hazard');
    
    // Portal (exit)
    this.portalGroup.create(700, 100, 'portal');
    
    // Rotatable blocks
    this.rotateBlockGroup.create(400, 500, 'rotateBlock');
    this.rotateBlockGroup.create(550, 200, 'rotateBlock');
  }

  spawnEnemy() {
    if (this.gameOver) return;
    const enemy = new Enemy(this, 800, Phaser.Math.Between(100, 500));
    this.enemies.push(enemy);
    this.physics.add.collider(enemy.sprite, this.groundGroup);
    this.physics.add.overlap(this.player.sprite, enemy.sprite, this.hitEnemy, null, this);
  }

  hitHazard(playerSprite, hazard) {
    this.playerHit();
  }

  hitEnemy(playerSprite, enemySprite) {
    this.playerHit();
  }

  playerHit() {
    if (this.gameOver) return;
    this.lives--;
    this.ui.updateLives(this.lives);
    if (this.lives <= 0) {
      this.endGame();
    } else {
      this.player.sprite.setPosition(100, 500);
      this.player.sprite.setVelocity(0, 0);
    }
  }

  reachPortal(playerSprite, portal) {
    this.endGame(true);
  }

  endGame(won = false) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.spawnTimer.remove();
    this.scene.start('GameOverScene', { won: won, score: this.score });
  }

  update(time, delta) {
    if (this.gameOver) return;
    
    // Player movement
    let moveX = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) {
      moveX = -200;
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      moveX = 200;
    }
    this.player.sprite.setVelocityX(moveX);
    
    // Rotate block on space
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.player.rotateBlock();
    }
    
    // Check if player fell off screen
    if (this.player.sprite.y > 620) {
      this.playerHit();
    }
    
    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update();
    });
    
    // Update UI
    this.ui.updateScore(this.score);
  }
}
