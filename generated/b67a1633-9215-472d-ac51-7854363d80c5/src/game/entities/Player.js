import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ball');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setGravityY(0); // gravity handled by scene
        this.body.setBounce(0.2);
        this.body.setDrag(50);
    }

    rotateBall() {
        // Rotate 90 degrees
        this.rotation += Math.PI / 2;
    }
}
