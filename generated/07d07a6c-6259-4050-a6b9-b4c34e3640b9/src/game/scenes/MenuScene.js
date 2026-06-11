import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#222222');
    
    const title = this.add.text(400, 200, 'Roll & Rotate', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const startText = this.add.text(400, 320, 'Press SPACE or Tap to Start', {
      fontSize: '20px',
      fill: '#aaaaaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const controlsText = this.add.text(400, 400, 'A/D or Arrow Keys to move\nSPACE or Tap to rotate block', {
      fontSize: '14px',
      fill: '#888888',
      fontFamily: 'monospace',
      align: 'center'
    }).setOrigin(0.5);

    // Input to start
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    this.input.once('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
