class Bootloader extends Phaser.Scene{
    constructor() {
        super({key:"Bootloader"});
    }
    preload(){

        this.load.on("complete",()=>{
            this.scene.start("Pruebas");
        });




        //cargando cuerpo de bob esponja
        this.load.image("bobcero","./sprite/bobSponja/cuerpo/0.png");
        this.load.image("bobuno","./sprite/bobSponja/cuerpo/1.png");
        this.load.image("bobdos","./sprite/bobSponja/cuerpo/2.png");

        this.load.image("bobtres","./sprite/bobSponja/cuerpo/3.png");
        this.load.image("bobcuatro","./sprite/bobSponja/cuerpo/4.png");
        this.load.image("bobcinco","./sprite/bobSponja/cuerpo/5.png");

        //cargando cara de bob esponja
        this.load.image("caraUno","./sprite/bobSponja/cara/1.png");
        this.load.image("caraDos","./sprite/bobSponja/cara/2.png");
        this.load.image("caraTres","./sprite/bobSponja/cara/3.png");
        this.load.image("caraCuatro","./sprite/bobSponja/cara/4.png");
        this.load.image("caraCinco","./sprite/bobSponja/cara/5.png");


        //cargandp personaje
        this.load.image("personaje","./sprite/personaje/lucho.png");

        //cargando goma y lapiz
        this.load.image("goma","./sprite/goma/goma.png");
        this.load.image("lapiz","./sprite/goma/lapiz.png");

        //cargando fondo
        this.load.image("fondo","./sprite/fondo/fondo.png");
        this.load.image("agua","./sprite/fondo/agua.png");
        this.load.image("cred","./sprite/fondo/contenedorBlue.png");
        this.load.image("cblue","./sprite/fondo/contenedorRed.png");



    }
update(time, delta) {
    console.log(usuaAc);
}

}
export default Bootloader;