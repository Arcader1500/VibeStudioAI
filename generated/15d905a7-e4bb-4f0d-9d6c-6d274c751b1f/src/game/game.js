// VibeStudio AI — Generated Game Configuration
// Blueprint: A Simple Tower Defense Game
import BootScene    from './scenes/BootScene.js'
import PreloadScene from './scenes/PreloadScene.js'
import MenuScene    from './scenes/MenuScene.js'
import GameScene    from './scenes/GameScene.js'
import GameOverScene from './scenes/GameOverScene.js'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#0a0a12',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    disableWebAudio: false,
  },
}

export default new Phaser.Game(config)
