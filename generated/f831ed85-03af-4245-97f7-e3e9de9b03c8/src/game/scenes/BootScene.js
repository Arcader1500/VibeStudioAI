// BootScene — initializes game settings
export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot') }

  preload() {
    // Load minimal loading screen assets if needed
  }

  create() {
    this.scene.start('Preload')
  }
}
