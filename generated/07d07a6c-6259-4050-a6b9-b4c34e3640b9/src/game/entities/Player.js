import Phaser from 'phaser';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'ball');
    this.sprite.setCircle(8);
    this.sprite.setBounce(0.2);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setDepth(10);
  }

  rotateBlock() {
    // Find nearby rotatable blocks
    const blocks = this.scene.rotateBlockGroup.getChildren();
    blocks.forEach(block => {
      const dist = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y,
        block.x, block.y
      );
      if (dist < 40) {
        // Rotate the block 90 degrees
        block.angle += 90;
        // Update physics body to match rotation
        block.body.updateFromGameObject();
        // Score points for rotating
        this.scene.score += 10;
      }
    });
  }
}
