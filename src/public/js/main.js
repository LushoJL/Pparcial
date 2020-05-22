let usuaAc;
$(function () {

    // socket.io client side connection
   const socket = io.connect();
    //navbar
    const $usuario = $('#tituloNavbar');

    // obteniendo los elementos del DOM del form de chat interfaz
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // obteniendo los elementos de dom de from nickname
    const $nickForm = $('#nickForm');// el formulario <from></form>
    const $nickError = $('#nickError');//texto para el error <p></p>
    const $nickname = $('#nickname'); //caja de texto para ingresar el nombr de ususario<input></input>
    const $typing = $('#typing');
    let $otroUsuario="";
    usuaAc=$nickname.val();
    // obtener los nombres de usuarios del dom

    //evento de input texto
    $("input#message").on("keyup", function () {
        if ($(this).val()!=""){
            socket.emit('escribiendo',1);

        }else{
            socket.emit('escribiendo',0);
        }
    });
    socket.on("typing", data=>{
        $typing.html(`<span class="badge badge-pill badge-secondary">${data.text}</span>`);
    })





    //capturar el formulario de nickform
    $nickForm.submit(e => {
      e.preventDefault();
      //enviando nuevo usuario
      socket.emit('new user', $nickname.val(), data => {
        if(data!="false") {
          $('#nickWrap').hide();
          $('#contentWrap').show();
          $('#message').focus();
           $usuario.html(`${data}`);
           $otroUsuario = data;
        } else {
          $nickError.html(`
            <div class="alert alert-danger">
              Ese usuario ya existe
            </div>
          `);
        }
      });
      $nickname.val('');
    });

    // eventos
    $messageForm.submit( e => {
      e.preventDefault();
      //envia el mensaje al servidor
      socket.emit('send message', $messageBox.val(), data => {
      $chat.append(`<p class="error">${data}</p>`)
      });

      //vacia el input
         $typing.html(``);
      $messageBox.val('');
    });

    //recibe los datos del mensaje
    socket.on('new message', data => {
      displayMsg(data, 1);
    });

    //lista a los nombres de usuarios
    socket.on('usernames', data => {
        $(" tr ").remove();
      for(let i = 0; i < data.length; i++) {
          if (data[i]==$otroUsuario){
              $("table#usernames").append('<tr class="bg-danger"><td><a id="ver"><i class="fas fa-user"></i>'+data[i]+'</a></td></tr>')
          }else{
              $("table#usernames").append('<tr><td><a id="ver"><i class="fas fa-user"></i>'+data[i]+'</a></td></tr>')

          }
      }
    });




    $(document).on('click','#usuario', function(){ //esta función se ejecutará en todos los casos
        alert("Hola" + $('#usuario').text());
    });
    socket.on('whisper', data => {
      $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    //carga los antiguos mensajes
    socket.on('load old msgs', msgs => {
      for(let i = msgs.length -1; i >=0 ; i--) {
        displayMsg(msgs[i], 1);
      }
    });

    //muestra los mensajes en div chat
    function displayMsg(data,va) {
            if (data.nickres=="grupo"){
                $chat.append(`<p class="msg"><b>${data.nicksend}</b>: ${data.msg}</p>`);
            }else if (va==1){
                $chat.append(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
            }


    }









    let $usuarioLogueado = "";
    const $cardp = $('#idCard');


    $(" table#usernames tbody  ").on("click","a#ver",function(e){

        const $clic=$(this).parent().parent().find("td:nth-child(1)").text();

        if ($otroUsuario != $clic){
            $usuarioLogueado= $clic;
            $("#chatPri p").remove();
            socket.emit('chat privado',$usuarioLogueado,$otroUsuario)
            //carga los antiguos mensajes

            $('#cabezerapriv').text($otroUsuario+ " y "+ $usuarioLogueado+" Chateando");
            $('#cprivate').show();

        }

    });

    socket.on('load old msgs private' , msgs=> {
        for(let i = msgs.length -1; i >=0 ; i--) {
            displayMsgprivete(msgs[i]);
        }
    });


    // obteniendo los elementos del DOM del form de chat interfaz
    const $messageFormp = $('#messagePri-form');//formulario
    const $messageBoxp = $('#messagePri'); //caja de texto
    const $messageFormGame = $('#messagegGame-form'); //formulario de boton de juego
    const $chatp = $('#chatPri'); //el contenedor del form
    const $typingp = $('#typingpri');


    $("input#messagePri").on("keyup", function () {
        if ($(this).val()!=""){
            socket.emit('escribiendop',$otroUsuario,1);

        }else{
            socket.emit('escribiendop',$otroUsuario,0);
        }
    });
    socket.on("typingp", data=>{
        if (data.nick!=$otroUsuario) $typingp.html(`<span class="badge badge-pill badge-secondary">${data.nick}${data.text}</span>`);
    })



    // eventos
    //ennviando boton de juego
const $aceptarJuego=$('#aceptarJuego')//formulario para aceptar juego
    $messageFormGame.submit(a =>{

        a.preventDefault();//no actualiza la pagina

        socket.emit('desafio juego',$usuarioLogueado,$otroUsuario)
    });

    socket.on('juguemos',data=>{
        if (data.desafiante!=$usuarioLogueado){
            $aceptarJuego.append(`<button class="btn active" style="color: white"><i class="fas fa-location-arrow"></i> JUGUEMOS</button>`);

        }else{
            $aceptarJuego.append(`<p class=""><i class="fas fa-location-arrow"></i> afiaste</p>`);
        }
    })

    $aceptarJuego.submit(a=>{
        a.preventDefault();
        socket.emit('abrir modal',$usuarioLogueado,$otroUsuario);

    })
    socket.on('abriendo modal',(data)=>{
        if (data.player1===$usuarioLogueado ||data.player2===$usuarioLogueado ){
            $('#juego').modal('show');
            socket.emit('iniciar el juego',data.player1,data.player2);
        }


    })

    //enviando mensaje
    $messageFormp.submit( a => {
        a.preventDefault();
      //  $chatp.append('<p class="msg"><b>'+$otroUsuario+'</b>: '+ $messageBoxp.val()+'</p>');
        //envia el mensaje al servidor
        socket.emit('send message private', $messageBoxp.val(),$usuarioLogueado, data => {
            $chatp.append(`<p class="error">${data}</p>`)
        });

        //vacia el input
        $typingp.html(``);
        $messageBoxp.val('');
    });

    //recibe los datos del mensaje
    socket.on('new message private', data => {
        displayMsgprivete(data);
    });




    //muestra los mensajes en div chat
    function displayMsgprivete(data) {

        $chatp.append(`<p class="msg messa"><b>${data.nicksend}</b>: ${data.msg}</p>`);


    }


});