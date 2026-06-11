import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Create simple pixel art assets
    // Player ball (16x16)
    this.createCircleTexture('ball', 16, 0x4488ff);
    // Hazard block (16x16)
    this.createRectTexture('hazard', 16, 0xff4444);
    // Ground block (16x16)
    this.createRectTexture('ground', 16, 0x88aa44);
    // Portal (16x16)
    this.createCircleTexture('portal', 16, 0xffaa00);
    // Rotatable block (16x16)
    this.createRectTexture('rotateBlock', 16, 0xaa88ff);
    // Player lives icon
    this.createCircleTexture('life', 8, 0x44ff44);
  }

  create() {
    this.scene.start('MenuScene');
  }

  createCircleTexture(key, size, color) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color, 1);
    graphics.fillCircle(size / 2, size / 2, size / 2 - 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }

  createRectTexture(key, size, color) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color, 1);
    graphics.fillRect(2, 2, size - 4, size - 4);
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRect(2, 2, size - 4, size - 4);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }
}
