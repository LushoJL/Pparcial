
import Bootloader from "./escenas/bootloader.js";
import Scene_uno from "./escenas/scene_uno.js"
import Pruebas from "./escenas/pruebas.js";
const config = {
    width:800,
    height:600,
    parent:"container",
    type: Phaser.AUTO,
    physics:{
        default:"arcade",
        "arcade":{
            gravity:{

            },
            // debug:true
        }
    },
    scene:[
        Bootloader,
        Pruebas,


    ]
}
new Phaser.Game(config);

