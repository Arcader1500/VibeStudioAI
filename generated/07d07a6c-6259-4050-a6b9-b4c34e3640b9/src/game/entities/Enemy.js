import Phaser from 'phaser';

export default class Enemy {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'hazard');
    this.sprite.setVelocityX(-120);
    this.sprite.setBounce(1);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setDepth(5);
  }

  update() {
    // Remove if off screen left
    if (this.sprite.x < -50) {
      this.sprite.destroy();
      this.scene.enemies = this.scene.enemies.filter(e => e !== this);
    }
  }
}
