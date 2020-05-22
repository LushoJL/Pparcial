import Cuerpo from "../gameObjects/cuerpo.js";

// socket.io client side connection



class Scene_uno extends Phaser.Scene {

     x = 185.6;
     y = 300;


//velocidad
     velx = 800;
    vely = 0;
    velmax = this.velx;
    velymax = 2800;
    dirx = this.velx;
     velcu0y = 0;
     velcu1y = 0;
    velcu2y = 0;
    velcu3y = 0;
    velcu4y = 0;
    velcu5y = 0;

//contador para cambiar cara
     contador = 0;


//si la cara colisiono con el lapiz
     collisioncara = false;

//numero aorio para lapiz
     contadorlapiz = 0;


//puntos
     puntos = 0;
     contadorcara = 0;
     contadorcaraAnterior = 0;

//texto
     mostrartext=false;
//tiempo
     socket;//variable socket
     timer;
     timerFin;//tiempo
//finnnnnn
     fin=false;

//iniciar
     inicio=false;
     esperandoOtroJugador=false;
//nombre rival
     usuario; rival;puntajerival;nombrerival;
//cargado
     cargado=true;
     puntoRival=0;



    constructor(usuRival,usuAct) {
        super({key: "Scene_uno"});
        this.rival=usuRival;
        this.usuario=usuAct;
    }

    create() {


        this.socket = io.connect();
        this.socket.on('esperando juegador',()=>{
            this.esperandoOtroJugador=true;
            this.timer = this.time.addEvent({ delay: 40000 });
        });
        this.socket.on('punto del otro equipo',(data)=>{
            if (data.rival==this.rival){
                this.puntoRival=data.puntos;
            }
        })

        this.fondo = this.physics.add.image(400, 300, "fondo");
        //cuerpo bob sponja
        this.add.image(400, 300, "agua");

        this.creandocuerpo();
        this.personaje = this.add.image(this.cara1.x + 14, this.cara1.y + 155, "personaje").setOrigin(0, 0);

        //creando goma y lapiz
        this.grupoGoma = this.physics.add.group();
        this.lapiz = this.physics.add.image(50, -550, 'lapiz');
        this.lapiz.setImmovable(true);
        this.lapiz.setScale(0.4, 0.4);

        //grupo 1
        this.goma = this.grupoGoma.create(160, 100, 'goma');
        this.goma = this.grupoGoma.create(1113, 100, 'goma');

        //grupo 2
        this.goma = this.grupoGoma.create(-313, -500, 'goma');
        this.goma = this.grupoGoma.create(640, -500, 'goma');
        this.grupoGoma.children.iterate((x) => {
            x.body.setAllowGravity(false);
            x.body.immovable = true;

        })
        //creando fondos
        this.add.image(800, 600, "cblue").setOrigin(1, 1);
        this.add.image(0, 600, "cred").setOrigin(0, 1);

        this.tweengoma1 = this.tweens.add({
            targets: this.grupoGoma.children.entries[0],
            duration: 1000,
            repeat: -1,
            x: -313,
            yoyo: true
        });
        this.tweengoma2 = this.tweens.add({
            targets: this.grupoGoma.children.entries[1],
            duration: 1000,
            repeat: -1,
            x: 640,
            yoyo: true
        });
        // grupo 2 de goma
        this.tweengoma3 = this.tweens.add({
            targets: this.grupoGoma.children.entries[2],
            duration: 1000,
            repeat: -1,
            x: 160,
            yoyo: true
        });
        this.tweengoma4 = this.tweens.add({
            targets: this.grupoGoma.children.entries[3],
            duration: 1000,
            repeat: -1,
            x: 1113,
            yoyo: true
        });
        //lapiz
        this.tweenlapiz = this.tweens.add({
            targets: this.lapiz,
            duration: 1000,
            repeat: -1,
            x: 750,
            yoyo: true
        });
        this.tweenlapizU = this.tweens.add({
            targets: this.lapiz,
            duration: 300,
            y: 100,
            onComplete: () => {
                if (!this.tweenlapiz.isPlaying()) this.tweenlapiz.resume();
            }

        }).pause();
        this.tweenlapizdown = this.tweens.add({
            targets: this.lapiz,
            duration: 300,
            scaleX: 0,
            scaleY: 0,
            onComplete: () => {

                this.lapiz.y = -550;
                this.lapiz.setScale(0.4, 0.4);
                if (this.gomaVieja === 2) {
                    this.tweengomaU2.play();
                } else {
                    this.tweengomaU1.play();
                }
            }
        }).pause()

        //tweens de y=-500 a y = 200
        this.tweengomaU1 = this.tweens.add({
            targets: [this.grupoGoma.children.entries[0], this.grupoGoma.children.entries[1]],
            duration: 300,
            y: 100,
            onComplete: () => {
                this.tweengoma1.resume();
                this.tweengoma2.resume();
            },

        }).pause();//grupo 1
        this.tweengomaU2 = this.tweens.add({
            targets: [this.grupoGoma.children.entries[2], this.grupoGoma.children.entries[3]],
            duration: 300,
            y: 100,
            onComplete: () => {
                this.tweengoma3.resume();
                this.tweengoma4.resume();
            }
        }).pause();//grupo 2

        //tweens de posicion y =200 a y=650
        this.tweengomaD1 = this.tweens.add({
            targets: [this.grupoGoma.children.entries[0], this.grupoGoma.children.entries[1]],
            duration: 200,
            y: 650,
            onComplete: () => {

                this.grupoGoma.children.entries[0].y = -500;
                this.grupoGoma.children.entries[1].y = -500;
                if (this.aleatorio === this.contadorlapiz) {
                    this.gomaVieja = 2;
                    this.tweenlapizU.play();
                } else {
                    this.tweengomaU2.play();
                }

            }
        }).pause();
        this.tweengomaD2 = this.tweens.add({
            targets: [this.grupoGoma.children.entries[2], this.grupoGoma.children.entries[3]],
            duration: 300,
            y: 650,
            onComplete: () => {

                this.grupoGoma.children.entries[2].y = -500;
                this.grupoGoma.children.entries[3].y = -500;
                if (this.aleatorio === this.contadorlapiz) {
                    this.gomaVieja = 1;
                    this.tweenlapizU.play();

                } else {
                    this.tweengomaU1.play();
                }
            }
        }).pause();

        //tweens para fondo
        this.tweenfondo=this.tweens.add({
            targets:this.fondo,
            duration:40000,
            y:800,
             })

        //numero aleatorio para lapiz
        this.aleatorio = this.numeroRandom(2, 5);

        //fisicas
        this.fisicas();

        //evento tecla espacio
        this.input.keyboard.on("keydown_SPACE", () => {
        if (this.esperandoOtroJugador){

            if (!this.inicio){
                this.inicio=true;
            }
            if (!this.fin){
                if (this.tweengoma1.isPlaying()) {
                    this.tweengoma1.pause();
                    this.tweengoma2.pause();
                } else if (this.tweengoma3.isPlaying()) {
                    this.tweengoma3.pause();
                    this.tweengoma4.pause();
                } else if (this.tweenlapiz.isPlaying()) {
                    this.tweenlapiz.pause();
                }
                this.velx = 0;
                this.vely = -this.velymax;
                this.velcu0y = -this.velymax;
                this.velcu1y = -this.velymax;
                this.velcu2y = -this.velymax;
                this.velcu3y = -this.velymax;
                this.velcu4y = -this.velymax;
                this.velcu5y = -this.velymax;
            }
        }else{
            console.log("esperando otros jugador");
        }

                });

        //grafico para el tiempo
        var graphics = this.add.graphics();
        graphics.lineStyle(100, 0x000000);
        graphics.strokeCircle(815, -15, 70);

        // textos
        this.Mipuntaje = this.add.text(50, 540, '0', {
            font: '30px Arial', fill: '#030303'
        });
        this.puntajerival = this.add.text(710, 540, '0', {
            font: '30px Arial', fill: '#030303'
        });
        this.add.text(710, 510, this.rival, {
            font: '30px Arial', fill: '#030303'
        });
        this.add.text(50, 510, 'tú', {
            font: '30px Arial', fill: '#030303'
        });
        this.tiempo = this.add.text(720, 5, '0', {
            font: '70px Arial', fill: '#ffffff'
        });
        this.suma = this.add.text(160, 150, '0', {
            font: '70px Arial', fill: '#ffffff'
        });
    }

    numeroRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    update(time, delta) {
        console.log(this.cargado+" "+this.esperandoOtroJugador + " "+ this.inicio)
        this.puntajerival.setText([
            this.puntoRival
        ]);

        this.personaje.x = this.cara1.x - 100;
        this.personaje.y = this.cara1.y + 155;
        if (this.cargado){
            this.socket.emit('carga completa de juego');
            this.cargado=false;
        }

       if (this.esperandoOtroJugador){
           this.timerFin=(this.timer.getElapsed()/1000).toFixed();
           this.tiempo.setText([
               30-this.timerFin
           ]);


           if ( this.timerFin<=30){
               console.log("verdadero")
               if (this.inicio){
                   this.movex();
                   this.cambioCara();
                   if (this.tweenlapizU.isPlaying()) {
                       this.contadorlapiz = 0;
                   }
                   this.Mipuntaje.setText([
                       this.puntos
                   ]);
                   this.socket.emit('puntos rival',{
                       puntos:this.puntos,
                       rival:this.usuario,
                   })
                   this.puntaje();

               }

           }else{


               this.scene.remove("Scene_uno");
               this.scene.start("Pruebas")
           }
       }





    }

    ifpuntos = true;

    puntaje() {
        this.vereficaCuerpo();

        if (this.lapiz.y < 0) {
            if (this.cara1.y < 10 && this.ifpuntos) {
                if ((this.contadorcaraAnterior <= this.contadorcara) && this.contadorcaraAnterior!==0) {

                    this.puntos += this.contadorcara * 2;
                    this.suma.setText([
                        'PERFECT!! +'+this.contadorcara+' x2',
                    ]);
                    this.ifpuntos = false;
                } else {
                    this.suma.setText([
                        'MUY BIEN +'+this.contadorcara,
                    ]);
                    this.puntos += this.contadorcara;
                    this.ifpuntos = false;
                }
                this.contadorcaraAnterior = this.contadorcara;


            } else if (this.cara1.y > 10) {
                this.ifpuntos = true;
            }


        }


    }

    //vereficar cuantas caras hay
    vereficaCuerpo() {
        for (var i = 0; i < 1; i++) {
            this.contador = 0;
            this.contadorcara = 2;
            if (this.cuerpo0.y > 600) this.contador++;//1 1
            else this.contadorcara += 2;
            if (this.cuerpo1.y > 600) this.contador++;//2 4
            else this.contadorcara += 2;
            if (this.cuerpo2.y > 600) this.contador++;//3 4
            else this.contadorcara += 2;
            if (this.cuerpo3.y > 600) this.contador++;//4 6
            else this.contadorcara += 2;
            if (this.cuerpo4.y > 600) this.contador++;//5 8
            else this.contadorcara += 2;
            if (this.cuerpo5.y > 600) this.contador++;//6 10
            else this.contadorcara += 2;
        }
    }

    //cambio de cara
    cambioCara() {
        this.vereficaCuerpo();
        if (this.contador == 0) this.zIndexcara(1, 0, 0, 0, 0);
        else if (this.contador <= 2) this.zIndexcara(0, 1, 0, 0, 0);
        else if (this.contador <= 4) this.zIndexcara(0, 0, 1, 0, 0);
        else if (this.contador === 5) this.zIndexcara(0, 0, 0, 1, 0);
        else this.zIndexcara(0, 0, 0, 0, 1);
    }

    //funcion de cambiar cara
    zIndexcara(a, b, c, d, e) {
        this.cara1.setDepth(a);
        this.cara2.setDepth(b);
        this.cara3.setDepth(c);
        this.cara4.setDepth(d);
        this.cara5.setDepth(e);
    }

    movex() {

        this.cara1.body.setVelocity(this.velx, this.vely);
        this.cara2.body.setVelocity(this.velx, this.vely);
        this.cara3.body.setVelocity(this.velx, this.vely);
        this.cara4.body.setVelocity(this.velx, this.vely);
        this.cara5.body.setVelocity(this.velx, this.vely);
        this.cuerpo0.body.setVelocity(this.velx, this.velcu0y);
        this.cuerpo1.body.setVelocity(this.velx, this.velcu1y);
        this.cuerpo2.body.setVelocity(this.velx, this.velcu2y);
        this.cuerpo3.body.setVelocity(this.velx, this.velcu3y);
        this.cuerpo4.body.setVelocity(this.velx, this.velcu4y);
        this.cuerpo5.body.setVelocity(this.velx, this.velcu5y);
        //cuando llega al piso
        if (this.cara1.y > 300) {
            this.acomodarcuerpo();
            //activa los tweent si la cara collisiono con la goma
            if (this.collisioncara && this.grupoGoma.children.entries[0].y > 0) {
                this.tweengoma1.resume();
                this.tweengoma2.resume();
                this.collisioncara = false;
            } else if (this.collisioncara && this.grupoGoma.children.entries[3].y > 0) {
                this.tweengoma3.resume();
                this.tweengoma4.resume();
                this.collisioncara = false;
            }
        }
        //cambia el sentido de rebote de bob esponja en X y Y
        if (this.cara1.x >= 700 && this.vely === 0) {//verefica si bob llego a al maximo del canvas y la velocidad esta en x
            this.velx = -this.velmax;
            this.dirx = this.velx;
        } else if (this.cara1.x <= 185 && this.vely === 0) {// verifica si bob llego al inicio de canvas y la velocidad esta en x
            this.velx = this.velmax;
            this.dirx = this.velx;
        } else if (this.cara1.y <= 0 && this.velx === 0) { //verifica si bob esta en el rango Y del canvas
            this.vely = this.velymax;
            this.velcu0y = this.velymax;
            this.velcu1y = this.velymax;
            this.velcu2y = this.velymax;
            this.velcu3y = this.velymax;
            this.velcu4y = this.velymax;
           this. velcu5y = this.velymax;

            //esto manda hacia abajo si la cara de bobo colisiona con el borde de arriba
            if (!this.collisioncara && !this.tweengomaD1.isPlaying() && this.grupoGoma.children.entries[0].y > 0) {//esto verefica si el esta el grupo 1 de gomas para que se vaya
                this.tweengomaD1.play();//baja hacia abajo
                this.contadorlapiz++;//para que aparezca el lapiz
                this.mostrartext=true;//para que muestre el numero que se esta sumando

            } else if (!this.collisioncara && !this.tweengomaD2.isPlaying() && this.grupoGoma.children.entries[3].y > 0) {//esto verefica si el esta el grupo 2 de gomas para que se vaya
                this.tweengomaD2.play();//baja hacia abajo
                this.contadorlapiz++; //para que aparezca el lapiz
               this.mostrartext=true;//para que muestre el numero que se esta sumando


            } else if (!this.collisioncara && !this.tweenlapiz.isPlaying() && this.lapiz.y > 0) {//esto verefica si esta el lapiz para que se vaya
                this.tweenlapizdown.play();
                this.collisioncara = false; //para que aparezca el lapiz
               this.mostrartext=true;//para que muestre el numero que se esta sumando

            }

        }


    }

    creandocuerpo() {
        this.caras = this.add.group();
        this.cara5 = new Cuerpo(this, this.x, this.y, 'caraCinco');
        this.cara4 = new Cuerpo(this, this.x, this.y, 'caraCuatro');
        this.cara3 = new Cuerpo(this, this.x, this.y, 'caraTres');
        this.cara2 = new Cuerpo(this, this.x, this.y, 'caraDos');
        this.cara1 = new Cuerpo(this, this.x, this.y, "caraUno");
        this.caras = this.add.group();
        this.caras.create(this.cara1);
        this.caras.create(this.cara2);
        this.caras.create(this.cara3);
        this.caras.create(this.cara4);
        this.caras.create(this.cara5);

        this.cuerpo3 = new Cuerpo(this, this.cara1.x - 1.8, this.cara1.y, 'bobtres');
        this.cuerpo4 = new Cuerpo(this, this.cara1.x + 24.4, this.cara1.y, 'bobcuatro');
        this.cuerpo5 = new Cuerpo(this, this.cara1.x + 50.6, this.cara1.y, 'bobcinco');

        this.cuerpo2 = new Cuerpo(this, this.cara1.x - 106.2, this.cara1.y, 'bobdos');
        this.cuerpo1 = new Cuerpo(this, this.cara1.x - 131.4, this.cara1.y, 'bobuno');
        this.cuerpo0 = new Cuerpo(this, this.cara1.x - 157.6, this.cara1.y, 'bobcero');

        this.cara1.setOrigin(1, 0);
        this.cara2.setOrigin(1, 0);
        this.cara3.setOrigin(1, 0);
        this.cara4.setOrigin(1, 0);
        this.cara5.setOrigin(1, 0);
        this.cuerpo0.setOrigin(1, 0);
        this.cuerpo1.setOrigin(1, 0);
        this.cuerpo2.setOrigin(1, 0);

        this.cuerpo3.setOrigin(0, 0);
        this.cuerpo4.setOrigin(0, 0);
        this.cuerpo5.setOrigin(0, 0);


    }

    acomodarcuerpo() {
        //acomoda las cuerpo
        if (this.cuerpo0.y <= 400) this.cuerpo0.y = 300;
        else this.cuerpo0.y = 1500;
        if (this.cuerpo1.y <= 400) this.cuerpo1.y = 300;
        else this.cuerpo1.y = 1500;
        if (this.cuerpo2.y <= 400) this.cuerpo2.y = 300;
        else this.cuerpo2.y = 1500;
        if (this.cuerpo3.y <= 400) this.cuerpo3.y = 300;
        else this.cuerpo3.y = 1500;
        if (this.cuerpo4.y <= 400) this.cuerpo4.y = 300;
        else this.cuerpo4.y = 1500;
        if (this.cuerpo5.y <= 400) this.cuerpo5.y = 300;
        else this.cuerpo5.y = 1500;
        this.cara1.y = 300;
        this.cara2.y = 300;
        this.cara3.y = 300;
        this.cara4.y = 300;
        this.cara5.y = 300;
        //pone la velocidad de y en 0 y de x en direccion anterior
        this.vely = 0;
        this.velcu0y = 0;
        this.velcu1y = 0;
        this.velcu2y = 0;
        this.velcu3y = 0;
        this.velcu4y = 0;
        this.velcu5y = 0;
        this.velx = this.dirx;
    }

    fisicas() {
        this.physics.add.collider(this.cara1, this.grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(this.cara2, this.grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(this.cara3, this.grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(this.cara4, this.grupoGoma, this.chocacara, null, this);
        this.physics.add.collider(this.cara5, this.grupoGoma, this.chocacara, null, this);

        this.physics.add.collider(this.cuerpo0, this.grupoGoma, this.chocacuerpo0, null, this);
        this.physics.add.collider(this.cuerpo1, this.grupoGoma, this.chocacuerpo1, null, this);
        this.physics.add.collider(this.cuerpo2, this.grupoGoma, this.chocacuerpo2, null, this);
        this.physics.add.collider(this.cuerpo3, this.grupoGoma, this.chocacuerpo3, null, this);
        this.physics.add.collider(this.cuerpo4, this.grupoGoma, this.chocacuerpo4, null, this);
        this.physics.add.collider(this.cuerpo5, this.grupoGoma, this.chocacuerpo5, null, this);

        this.physics.add.collider(this.cara1, this.lapiz, this.chocalapiz, null, this);
    }

    chocalapiz() {
        this.collisioncara = true;
        this.lapiz.y = -550;
        this.tweenlapiz.resume();
        this.cuerpo0.x = this.cara1.x - 157.6;
        this.cuerpo1.x = this.cara1.x - 131.4;
        this.cuerpo2.x = this.cara1.x - 106.2;
        this.cuerpo3.x = this.cara1.x - 1.8;
        this.cuerpo4.x = this.cara1.x + 24.4;
        this.cuerpo5.x = this.cara1.x + 50.6;

        this.cuerpo0.y = this.cara1.y
        this.cuerpo1.y = this.cara1.y
        this.cuerpo2.y = this.cara1.y
        this.cuerpo3.y = this.cara1.y
        this.cuerpo4.y = this.cara1.y
        this.cuerpo5.y = this.cara1.y
        if (this.gomaVieja === 2) {
            this.tweengomaU2.play();
        } else {
            this.tweengomaU1.play();
        }

    }

    chocacara() {
        this.c = true;
        this.collisioncara = true;
        this.vely = this.velymax;
        this.velcu0y = this.velymax;
        this.velcu1y = this.velymax;
        this.velcu2y = this.velymax;
        this.velcu3y = this.velymax;
        this.velcu4y = this.velymax;
        this.velcu5y = this.velymax;

    }

    chocacuerpo0() {

        if (!this.c) {
            this.velcu0y = 1200;
        }


    }

    chocacuerpo1() {

        if (!this.c) {
            this.velcu1y = 1200;
        }

    }

    chocacuerpo2() {


        if (!this.c) {
            this.velcu2y = 1200;

        }
    }

    chocacuerpo3() {
        if (!this.c) {
            this.velcu3y = 1200;

        }


    }

    chocacuerpo4() {
        if (!this.c) {
            this.velcu4y = 1200;

        }


    }

    chocacuerpo5() {
        if (!this.c) {
            this.velcu5y = 1200;

        }


    }

}

export default Scene_uno;