class Cuerpo extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,type) {
        super(scene, x,y,type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
    }

}
export default Cuerpo;