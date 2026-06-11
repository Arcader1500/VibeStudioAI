// MenuScene — start screen
export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu') }

  create() {
    const { width, height } = this.cameras.main

    // Background tiles
    for (let x = 0; x < width;  x += 32)
    for (let y = 0; y < height; y += 32)
      this.add.image(x, y, 'tile').setOrigin(0, 0)

    // Title
    this.add.text(width/2, height/3, 'A SIMPLE TOWER DEFENSE GAME', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#4f6ef7',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.add.text(width/2, height/3 + 50, 'ARCADE • MEDIUM', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff60',
    }).setOrigin(0.5)

    // Start prompt
    const startText = this.add.text(width/2, height * 0.65, 'PRESS SPACE TO START', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5)

    // Blink
    this.tweens.add({ targets: startText, alpha: 0, duration: 600, yoyo: true, repeat: -1 })

    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'))
    this.input.once('pointerdown', () => this.scene.start('Game'))
  }
}
