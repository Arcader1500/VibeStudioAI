import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Nothing to load for boot
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
