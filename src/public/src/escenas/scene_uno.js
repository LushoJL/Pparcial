import Cuerpo from "../gameObjects/cuerpo.js";

// socket.io client side connection


let x = 185.6, y = 300;

//goma y lapiz
let grupoGoma, goma, lapiz;

//cuerpo
let caras, cara1, cara2, cara3, cara4, cara5;
let cuerpo0, cuerpo1, cuerpo2, cuerpo3, cuerpo4, cuerpo5;

//tweens de goma y cuerpo
let tweengoma1, tweengoma2, tweengoma3, tweengoma4, tweengomaD1, tweengomaD2, tweengomaU1, tweengomaU2;
let tweenlapiz, tweenlapizU, tweenlapizdown;

//tweens de fondo
let tweenfondo;

//velocidad
let velx = 800, vely = 0, velmax = velx, velymax = 2800;
let dirx = velx;
let velcu0y = 0, velcu1y = 0, velcu2y = 0, velcu3y = 0, velcu4y = 0, velcu5y = 0;

//contador para cambiar cara
let contador = 0;


//si la cara colisiono con el lapiz
let collisioncara = false;

//numero aletorio para lapiz
let aleatorio, contadorlapiz = 0;
let gomaVieja;

//puntos
let puntos = 0, contadorcara = 0, contadorcaraAnterior = 0;

//texto
let Mipuntaje, tiempo, suma, mostrartext=false;
//tiempo
let socket;//variable socket
let timer,timerFin;//tiempo
//finnnnnn
let fin=false;

//iniciar
let inicio=false;
let esperandoOtroJugador=false;
//nombre rival
let usuario, rival,puntajerival,nombrerival;
//cargado
let cargado=true;
let puntoRival=0;
class Scene_uno extends Phaser.Scene {
    constructor(usuRival,usuAct) {
        super({key: "Scene_uno"});
        rival=usuRival;
        usuario=usuAct;
    }

    create() {


        socket = io.connect();
        socket.on('esperando juegador',()=>{
            esperandoOtroJugador=true;
            timer = this.time.addEvent({ delay: 40000 });
        });
        socket.on('punto del otro equipo',(data)=>{
            if (data.rival==rival){
                puntoRival=data.puntos;
            }
        })

        this.fondo = this.physics.add.image(400, 300, "fondo");
        //cuerpo bob sponja
        this.add.image(400, 300, "agua");

        this.creandocuerpo();
        this.personaje = this.add.image(cara1.x + 14, cara1.y + 155, "personaje").setOrigin(0, 0);

        //creando goma y lapiz
        grupoGoma = this.physics.add.group();
        lapiz = this.physics.add.image(50, -550, 'lapiz');
        lapiz.setImmovable(true);
        lapiz.setScale(0.4, 0.4);

        //grupo 1
        goma = grupoGoma.create(160, 100, 'goma');
        goma = grupoGoma.create(1113, 100, 'goma');

        //grupo 2
        goma = grupoGoma.create(-313, -500, 'goma');
        goma = grupoGoma.create(640, -500, 'goma');
        grupoGoma.children.iterate((x) => {
            x.body.setAllowGravity(false);
            x.body.immovable = true;

        })
        //creando fondos
        this.add.image(800, 600, "cblue").setOrigin(1, 1);
        this.add.image(0, 600, "cred").setOrigin(0, 1);

        tweengoma1 = this.tweens.add({
            targets: grupoGoma.children.entries[0],
            duration: 1000,
            repeat: -1,
            x: -313,
            yoyo: true
        });
        tweengoma2 = this.tweens.add({
            targets: grupoGoma.children.entries[1],
            duration: 1000,
            repeat: -1,
            x: 640,
            yoyo: true
        });
        // grupo 2 de goma
        tweengoma3 = this.tweens.add({
            targets: grupoGoma.children.entries[2],
            duration: 1000,
            repeat: -1,
            x: 160,
            yoyo: true
        });
        tweengoma4 = this.tweens.add({
            targets: grupoGoma.children.entries[3],
            duration: 1000,
            repeat: -1,
            x: 1113,
            yoyo: true
        });
        //lapiz
        tweenlapiz = this.tweens.add({
            targets: lapiz,
            duration: 1000,
            repeat: -1,
            x: 750,
            yoyo: true
        });
        tweenlapizU = this.tweens.add({
            targets: lapiz,
            duration: 300,
            y: 100,
            onComplete: () => {
                if (!tweenlapiz.isPlaying()) tweenlapiz.resume();
            }

        }).pause();
        tweenlapizdown = this.tweens.add({
            targets: lapiz,
            duration: 300,
            scaleX: 0,
            scaleY: 0,
            onComplete: () => {

                lapiz.y = -550;
                lapiz.setScale(0.4, 0.4);
                if (gomaVieja === 2) {
                    tweengomaU2.play();
                } else {
                    tweengomaU1.play();
                }
            }
        }).pause()

        //tweens de y=-500 a y = 200
        tweengomaU1 = this.tweens.add({
            targets: [grupoGoma.children.entries[0], grupoGoma.children.entries[1]],
            duration: 300,
            y: 100,
            onComplete: () => {
                tweengoma1.resume();
                tweengoma2.resume();
            },

        }).pause();//grupo 1
        tweengomaU2 = this.tweens.add({
            targets: [grupoGoma.children.entries[2], grupoGoma.children.entries[3]],
            duration: 300,
            y: 100,
            onComplete: () => {
                tweengoma3.resume();
                tweengoma4.resume();
            }
        }).pause();//grupo 2

        //tweens de posicion y =200 a y=650
        tweengomaD1 = this.tweens.add({
            targets: [grupoGoma.children.entries[0], grupoGoma.children.entries[1]],
            duration: 200,
            y: 650,
            onComplete: () => {

                grupoGoma.children.entries[0].y = -500;
                grupoGoma.children.entries[1].y = -500;
                if (aleatorio === contadorlapiz) {
                    gomaVieja = 2;
                    tweenlapizU.play();
                } else {
                    tweengomaU2.play();
                }

            }
        }).pause();
        tweengomaD2 = this.tweens.add({
            targets: [grupoGoma.children.entries[2], grupoGoma.children.entries[3]],
            duration: 300,
            y: 650,
            onComplete: () => {

                grupoGoma.children.entries[2].y = -500;
                grupoGoma.children.entries[3].y = -500;
                if (aleatorio === contadorlapiz) {
                    gomaVieja = 1;
                    tweenlapizU.play();

                } else {
                    tweengomaU1.play();
                }
            }
        }).pause();

        //tweens para fondo
        tweenfondo=this.tweens.add({
            targets:this.fondo,
            duration:40000,
            y:800,
             })

        //numero aleatorio para lapiz
        aleatorio = this.numeroRandom(2, 5);

        //fisicas
        this.fisicas();

        //evento tecla espacio
        this.input.keyboard.on("keydown_SPACE", () => {
        if (esperandoOtroJugador){

            if (!inicio){
                inicio=true;
            }
            if (!fin){
                if (tweengoma1.isPlaying()) {
                    tweengoma1.pause();
                    tweengoma2.pause();
                } else if (tweengoma3.isPlaying()) {
                    tweengoma3.pause();
                    tweengoma4.pause();
                } else if (tweenlapiz.isPlaying()) {
                    tweenlapiz.pause();
                }
                velx = 0;
                vely = -velymax;
                velcu0y = -velymax;
                velcu1y = -velymax;
                velcu2y = -velymax;
                velcu3y = -velymax;
                velcu4y = -velymax;
                velcu5y = -velymax;
            }
        }

                });

        //grafico para el tiempo
        var graphics = this.add.graphics();
        graphics.lineStyle(100, 0x000000);
        graphics.strokeCircle(815, -15, 70);

        // textos
        Mipuntaje = this.add.text(50, 540, '0', {
            font: '30px Arial', fill: '#030303'
        });
        puntajerival = this.add.text(710, 540, '0', {
            font: '30px Arial', fill: '#030303'
        });
        this.add.text(710, 510, rival, {
            font: '30px Arial', fill: '#030303'
        });
        this.add.text(50, 510, 'tú', {
            font: '30px Arial', fill: '#030303'
        });
        tiempo = this.add.text(720, 5, '0', {
            font: '70px Arial', fill: '#ffffff'
        });
        suma = this.add.text(160, 150, '0', {
            font: '70px Arial', fill: '#ffffff'
        });
    }

    numeroRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    update(time, delta) {

        puntajerival.setText([
            puntoRival
        ]);
        console.log("rival "+ rival + " punto "+puntoRival);
        this.personaje.x = cara1.x - 100;
        this.personaje.y = cara1.y + 155;
        if (cargado){
            socket.emit('carga completa de juego');
            cargado=false;
        }

       if (esperandoOtroJugador){
           timerFin=(timer.getElapsed()/1000).toFixed();
           tiempo.setText([
               30-timerFin
           ]);
           console.log(timerFin)

           if ( timerFin<=30){
               console.log("verdadero")
               if (inicio){
                   this.movex();
                   this.cambioCara();
                   if (tweenlapizU.isPlaying()) {
                       contadorlapiz = 0;
                   }
                   Mipuntaje.setText([
                       puntos
                   ]);
                   socket.emit('puntos rival',{
                       puntos:puntos,
                       rival:usuario,
                   })
                   this.puntaje();

               }

           }else{

               x = 185.6, y = 300;
               velx = 800, vely = 0, velmax = velx, velymax = 2800, dirx = velx;
               velcu0y = 0, velcu1y = 0, velcu2y = 0, velcu3y = 0, velcu4y = 0, velcu5y = 0, contador = 0,collisioncara = false,
                   puntos = 0, contadorcara = 0, contadorcaraAnterior = 0, mostrartext=false, timer="", fin=false, inicio=false;
               this.scene.remove("Scene_uno");
               this.scene.start("Pruebas")
           }
       }





    }

    ifpuntos = true;

    puntaje() {
        this.vereficaCuerpo();

        if (lapiz.y < 0) {
            if (cara1.y < 10 && this.ifpuntos) {
                if ((contadorcaraAnterior <= contadorcara) && contadorcaraAnterior!==0) {

                    puntos += contadorcara * 2;
                    suma.setText([
                        'PERFECT!! +'+contadorcara+' x2',
                    ]);
                    this.ifpuntos = false;
                } else {
                    suma.setText([
                        'MUY BIEN +'+contadorcara,
                    ]);
                    puntos += contadorcara;
                    this.ifpuntos = false;
                }
                contadorcaraAnterior = contadorcara;


            } else if (cara1.y > 10) {
                this.ifpuntos = true;
            }


        }


    }

    //vereficar cuantas caras hay
    vereficaCuerpo() {
        for (var i = 0; i < 1; i++) {
            contador = 0;
            contadorcara = 2;
            if (cuerpo0.y > 600) contador++;//1 1
            else contadorcara += 2;
            if (cuerpo1.y > 600) contador++;//2 4
            else contadorcara += 2;
            if (cuerpo2.y > 600) contador++;//3 4
            else contadorcara += 2;
            if (cuerpo3.y > 600) contador++;//4 6
            else contadorcara += 2;
            if (cuerpo4.y > 600) contador++;//5 8
            else contadorcara += 2;
            if (cuerpo5.y > 600) contador++;//6 10
            else contadorcara += 2;
        }
    }

    //cambio de cara
    cambioCara() {
        this.vereficaCuerpo();
        if (contador == 0) this.zIndexcara(1, 0, 0, 0, 0);
        else if (contador <= 2) this.zIndexcara(0, 1, 0, 0, 0);
        else if (contador <= 4) this.zIndexcara(0, 0, 1, 0, 0);
        else if (contador === 5) this.zIndexcara(0, 0, 0, 1, 0);
        else this.zIndexcara(0, 0, 0, 0, 1);
    }

    //funcion de cambiar cara
    zIndexcara(a, b, c, d, e) {
        cara1.setDepth(a);
        cara2.setDepth(b);
        cara3.setDepth(c);
        cara4.setDepth(d);
        cara5.setDepth(e);
    }

    movex() {

        cara1.body.setVelocity(velx, vely);
        cara2.body.setVelocity(velx, vely);
        cara3.body.setVelocity(velx, vely);
        cara4.body.setVelocity(velx, vely);
        cara5.body.setVelocity(velx, vely);
        cuerpo0.body.setVelocity(velx, velcu0y);
        cuerpo1.body.setVelocity(velx, velcu1y);
        cuerpo2.body.setVelocity(velx, velcu2y);
        cuerpo3.body.setVelocity(velx, velcu3y);
        cuerpo4.body.setVelocity(velx, velcu4y);
        cuerpo5.body.setVelocity(velx, velcu5y);
        //cuando llega al piso
        if (cara1.y > 300) {
            this.acomodarcuerpo();
            //activa los tweent si la cara collisiono con la goma
            if (collisioncara && grupoGoma.children.entries[0].y > 0) {
                tweengoma1.resume();
                tweengoma2.resume();
                collisioncara = false;
            } else if (collisioncara && grupoGoma.children.entries[3].y > 0) {
                tweengoma3.resume();
                tweengoma4.resume();
                collisioncara = false;
            }
        }
        //cambia el sentido de rebote de bob esponja en X y Y
        if (cara1.x >= 700 && vely === 0) {//verefica si bob llego a al maximo del canvas y la velocidad esta en x
            velx = -velmax;
            dirx = velx;
        } else if (cara1.x <= 185 && vely === 0) {// verifica si bob llego al inicio de canvas y la velocidad esta en x
            velx = velmax;
            dirx = velx;
        } else if (cara1.y <= 0 && velx === 0) { //verifica si bob esta en el rango Y del canvas
            vely = velymax;
            velcu0y = velymax;
            velcu1y = velymax;
            velcu2y = velymax;
            velcu3y = velymax;
            velcu4y = velymax;
            velcu5y = velymax;

            //esto manda hacia abajo si la cara de bobo colisiona con el borde de arriba
            if (!collisioncara && !tweengomaD1.isPlaying() && grupoGoma.children.entries[0].y > 0) {//esto verefica si el esta el grupo 1 de gomas para que se vaya
                tweengomaD1.play();//baja hacia abajo
                contadorlapiz++;//para que aparezca el lapiz
                mostrartext=true;//para que muestre el numero que se esta sumando

            } else if (!collisioncara && !tweengomaD2.isPlaying() && grupoGoma.children.entries[3].y > 0) {//esto verefica si el esta el grupo 2 de gomas para que se vaya
                tweengomaD2.play();//baja hacia abajo
                contadorlapiz++; //para que aparezca el lapiz
                mostrartext=true;//para que muestre el numero que se esta sumando


            } else if (!collisioncara && !tweenlapiz.isPlaying() && lapiz.y > 0) {//esto verefica si esta el lapiz para que se vaya
                tweenlapizdown.play();
                collisioncara = false; //para que aparezca el lapiz
                mostrartext=true;//para que muestre el numero que se esta sumando

            }

        }


    }

    creandocuerpo() {
        caras = this.add.group();
        cara5 = new Cuerpo(this, x, y, 'caraCinco');
        cara4 = new Cuerpo(this, x, y, 'caraCuatro');
        cara3 = new Cuerpo(this, x, y, 'caraTres');
        cara2 = new Cuerpo(this, x, y, 'caraDos');
        cara1 = new Cuerpo(this, x, y, "caraUno");
        caras = this.add.group();
        caras.create(cara1);
        caras.create(cara2);
        caras.create(cara3);
        caras.create(cara4);
        caras.create(cara5);

        cuerpo3 = new Cuerpo(this, cara1.x - 1.8, cara1.y, 'bobtres');
        cuerpo4 = new Cuerpo(this, cara1.x + 24.4, cara1.y, 'bobcuatro');
        cuerpo5 = new Cuerpo(this, cara1.x + 50.6, cara1.y, 'bobcinco');

        cuerpo2 = new Cuerpo(this, cara1.x - 106.2, cara1.y, 'bobdos');
        cuerpo1 = new Cuerpo(this, cara1.x - 131.4, cara1.y, 'bobuno');
        cuerpo0 = new Cuerpo(this, cara1.x - 157.6, cara1.y, 'bobcero');

        cara1.setOrigin(1, 0);
        cara2.setOrigin(1, 0);
        cara3.setOrigin(1, 0);
        cara4.setOrigin(1, 0);
        cara5.setOrigin(1, 0);
        cuerpo0.setOrigin(1, 0);
        cuerpo1.setOrigin(1, 0);
        cuerpo2.setOrigin(1, 0);

        cuerpo3.setOrigin(0, 0);
        cuerpo4.setOrigin(0, 0);
        cuerpo5.setOrigin(0, 0);


    }

    acomodarcuerpo() {
        //acomoda las cuerpo
        if (cuerpo0.y <= 400) cuerpo0.y = 300;
        else cuerpo0.y = 1500;
        if (cuerpo1.y <= 400) cuerpo1.y = 300;
        else cuerpo1.y = 1500;
        if (cuerpo2.y <= 400) cuerpo2.y = 300;
        else cuerpo2.y = 1500;
        if (cuerpo3.y <= 400) cuerpo3.y = 300;
        else cuerpo3.y = 1500;
        if (cuerpo4.y <= 400) cuerpo4.y = 300;
        else cuerpo4.y = 1500;
        if (cuerpo5.y <= 400) cuerpo5.y = 300;
        else cuerpo5.y = 1500;
        cara1.y = 300;
        cara2.y = 300;
        cara3.y = 300;
        cara4.y = 300;
        cara5.y = 300;
        //pone la velocidad de y en 0 y de x en direccion anterior
        vely = 0;
        velcu0y = 0;
        velcu1y = 0;
        velcu2y = 0;
        velcu3y = 0;
        velcu4y = 0;
        velcu5y = 0;
        velx = dirx;
    }

    fisicas() {
        this.physics.add.collider(cara1, grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(cara2, grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(cara3, grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(cara4, grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(cara5, grupoGoma, this.chocacara, null, this);

        this.physics.add.collider(cuerpo0, grupoGoma, this.chocacuerpo0, null, this);
        this.physics.add.collider(cuerpo1, grupoGoma, this.chocacuerpo1, null, this);
        this.physics.add.collider(cuerpo2, grupoGoma, this.chocacuerpo2, null, this);
        this.physics.add.collider(cuerpo3, grupoGoma, this.chocacuerpo3, null, this);
        this.physics.add.collider(cuerpo4, grupoGoma, this.chocacuerpo4, null, this);
        this.physics.add.collider(cuerpo5, grupoGoma, this.chocacuerpo5, null, this);

        this.physics.add.collider(cara1, lapiz, this.chocalapiz, null, this);
    }

    chocalapiz() {
        collisioncara = true;
        lapiz.y = -550;
        tweenlapiz.resume();
        cuerpo0.x = cara1.x - 157.6;
        cuerpo1.x = cara1.x - 131.4;
        cuerpo2.x = cara1.x - 106.2;
        cuerpo3.x = cara1.x - 1.8;
        cuerpo4.x = cara1.x + 24.4;
        cuerpo5.x = cara1.x + 50.6;

        cuerpo0.y = cara1.y
        cuerpo1.y = cara1.y
        cuerpo2.y = cara1.y
        cuerpo3.y = cara1.y
        cuerpo4.y = cara1.y
        cuerpo5.y = cara1.y
        if (gomaVieja === 2) {
            tweengomaU2.play();
        } else {
            tweengomaU1.play();
        }

    }

    chocacara() {
        this.c = true;
        collisioncara = true;
        vely = velymax;
        velcu0y = velymax;
        velcu1y = velymax;
        velcu2y = velymax;
        velcu3y = velymax;
        velcu4y = velymax;
        velcu5y = velymax;

    }

    chocacuerpo0() {

        if (!this.c) {
            velcu0y = 1200;
        }


    }

    chocacuerpo1() {

        if (!this.c) {
            velcu1y = 1200;
        }

    }

    chocacuerpo2() {


        if (!this.c) {
            velcu2y = 1200;

        }
    }

    chocacuerpo3() {
        if (!this.c) {
            velcu3y = 1200;

        }


    }

    chocacuerpo4() {
        if (!this.c) {
            velcu4y = 1200;

        }


    }

    chocacuerpo5() {
        if (!this.c) {
            velcu5y = 1200;

        }


    }

}

export default Scene_uno;