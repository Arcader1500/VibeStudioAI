// Enemy entity
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, target) {
    super(scene, x, y, 'enemy')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setScale(2).setDepth(9)

    this.hp     = 2
    this.speed  = 80
    this.target = target
    this.alive  = true
    this.setCollideWorldBounds(true)
  }

  update() {
    if (!this.alive || !this.target?.active) return
    this.scene.physics.moveToObject(this, this.target, this.speed)
  }

  takeDamage(amount) {
    this.hp -= amount
    this.setTint(0xffffff)
    this.scene.time.delayedCall(80, () => this.setTint(0xf87171))
    if (this.hp <= 0) {
      this.alive = false
      this.destroy()
    }
  }
}
