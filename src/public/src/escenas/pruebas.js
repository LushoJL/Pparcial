import Bootloader from "./bootloader.js"
import Scene_uno from "./scene_uno.js";
let socket;
let usuario;
class Pruebas extends Phaser.Scene {
    constructor() {
        super({key: "Pruebas"});
    }

    create () {
        let usuRival;
       socket = io.connect();
       socket.on('nombre de usuario', (data)=>{
           $(document).ready(function(){
               usuario=$('#tituloNavbar').text();
           });
       })
       socket.on('activa juego', (data)=>{
           console.log("player 2 es " +data.player2+ " player 1 es " +data.player1)

           if (data.player1===usuario || data.player2===usuario){
                if (data.player1!=usuario){
                    usuRival=data.player1;
                    console.log("entro true player 1 es " +data.player1+ " usuario es " +usuario)
                }else{
                    usuRival=data.player2;
                    console.log("entro false player 2 es " +data.player2+ " usuario es " +usuario)

                }
               this.scene.add('Scene_uno', new Scene_uno(usuRival,usuario));
               this.scene.start('Scene_uno');
               this.scene.stop('Pruebas');
           }
       })
   }
}

export default Pruebas;

