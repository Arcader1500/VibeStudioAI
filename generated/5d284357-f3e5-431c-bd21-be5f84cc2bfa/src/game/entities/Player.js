// Player entity
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setScale(2).setDepth(10)
    this.setCollideWorldBounds(true)
    this.body.setSize(12, 14).setOffset(2, 2)

    this.speed = 175
    this.invincible = false
    this.shootAngle = 0
  }

  update(cursors, wasd, time) {
    const left  = cursors?.left.isDown  || wasd?.left.isDown
    const right = cursors?.right.isDown || wasd?.right.isDown
    const up    = cursors?.up.isDown    || wasd?.up.isDown
    const down  = cursors?.down.isDown  || wasd?.down.isDown

    this.setVelocity(0)

    
    if (left)  this.setVelocityX(-this.speed)
    if (right) this.setVelocityX( this.speed)
    if (up && this.body.touching.down) this.setVelocityY(-400)  // jump
    this.shootAngle = right || (!left && !right) ? 0 : 180
    
  }

  setInvincible(duration) {
    this.invincible = true
    this.setAlpha(0.4)
    this.scene.time.delayedCall(duration, () => {
      this.invincible = false
      this.setAlpha(1)
    })
  }
}
