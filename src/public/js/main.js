
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
    let $users="";
    // obtener los nombres de usuarios del dom

    //obtener usuario seleccionado



    //capturar el formulario de nickform
    $nickForm.submit(e => {
      e.preventDefault();
      //enviando nuevo usuario
      socket.emit('new user', $nickname.val(), data => {
        if(data!="false") {
          $('#nickWrap').hide();
          $('#contentWrap').show();
          $('#message').focus();
           $usuario.html(`
              ${data}
          `);
           $users = data;
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
          $("table#usernames").append('<tr><td><a id="ver"><i class="fas fa-user"></i>'+data[i]+'</a></td></tr>')
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









    let $userPri = "";
    const $cardp = $('#idCard');


    $(" table#usernames tbody  ").on("click","a#ver",function(e){

        const $clic=$(this).parent().parent().find("td:nth-child(1)").text();

        if ($users != $clic){
            $userPri= $clic;
            $("#chatPri p").remove();
            socket.emit('chat privado',$userPri,$users)
            //carga los antiguos mensajes

            $('#cabezerapriv').text($users+ " y "+ $userPri+" Chateando");
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
    const $chatp = $('#chatPri'); //el contenedor del form

    // eventos
    $messageFormp.submit( a => {
        a.preventDefault();
      //  $chatp.append('<p class="msg"><b>'+$users+'</b>: '+ $messageBoxp.val()+'</p>');
        //envia el mensaje al servidor
        socket.emit('send message private', $messageBoxp.val(),$userPri, data => {
            $chatp.append(`<p class="error">${data}</p>`)
        });

        //vacia el input
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