// GameOverScene — end screen with score
export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver') }

  init(data) {
    this.finalScore = data.score ?? 0
    this.finalWave  = data.wave  ?? 1
  }

  create() {
    const { width, height } = this.cameras.main

    this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8)

    this.add.text(width/2, height/3, 'GAME OVER', {
      fontFamily: 'monospace', fontSize: '48px',
      color: '#f87171', stroke: '#000', strokeThickness: 6,
    }).setOrigin(0.5)

    this.add.text(width/2, height/2, `Score: ${this.finalScore}   Wave: ${this.finalWave}`, {
      fontFamily: 'monospace', fontSize: '20px', color: '#ffffff',
    }).setOrigin(0.5)

    const restart = this.add.text(width/2, height * 0.7, '[ PLAY AGAIN ]', {
      fontFamily: 'monospace', fontSize: '18px', color: '#4f6ef7',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    restart.on('pointerover',  () => restart.setColor('#7090fb'))
    restart.on('pointerout',   () => restart.setColor('#4f6ef7'))
    restart.on('pointerdown',  () => this.scene.start('Game'))
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'))
  }
}
