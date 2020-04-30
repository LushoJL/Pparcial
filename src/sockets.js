const Chat = require('./models/Chat');
const User = require('./models/User');
let $usuario="";
module.exports = io => {

  let users = {};

  io.on('connection', async socket => {

    //escribiendo
    socket.on("escribiendo", val=>{
      if (val==1){
        io.sockets.emit('typing', {
          text:"Alguien esta escribiendo",
        });
      }else {
        io.sockets.emit('typing', {
          text:"",
        });
      }
    });

    socket.on("escribiendop",(nick, val)=>{
      if (val==1){
        io.sockets.emit('typingp', {
          nick:nick,
          text:" esta escribiendo",
        });
      }else {
        io.sockets.emit('typingp', {
          nick:"",
          text:"",
        });
      }
    });

    let messages = await Chat.find({nickres:"grupo"}).limit(8).sort('-created'); //buscar de la base de datos los mensajes

    socket.emit('load old msgs', messages);//carga los mensajes de la base de datos


    socket.on('chat privado', async (nickres,nicksend)=>{
      console.log("nicksend "+nicksend+ " nickres "+ nickres+ " esos llegaron")
      try {
        const reg = await Chat.find({ nicksend: {$in: [nicksend, nickres] }, nickres:{$in: [nicksend, nickres] }}).sort('-created');
        console.log(reg)
        if (reg){
          socket.emit('load old msgs private', reg);//carga los mensajes de la base de datos
        }
      }catch (e) {
        console.log(e);
      };
    })
    //crea nuevo usuario
    socket.on('new user', async (data, cb) => {
      try {
        const reg = await User.findOne({nick:data});
        if (!reg){
          var newUser = new User({
            nick: data,
          });
          await newUser.save();//metodo que ingresa a la base de datos
        }
      }catch (e) {
        console.log(e);
      };

      if (data in users) {
        cb("false");
      } else {
        cb(data);
        socket.nickname = data;
        $usuario=socket.nickname;
        users[socket.nickname] = socket;
        updateNicknames();
      };
    });

    // recibe el mensaje de un cliente
    socket.on('send message', async (data, cb) => {
      var msg = data.trim();

      if (msg.substr(0, 3) === '/w ') {
        msg = msg.substr(3);
        var index = msg.indexOf(' ');
        if(index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            // envia mensaje privado
            users[name].emit('whisper', {
              msg,
              nick: socket.nickname 
            });
          } else {
            cb('Error! Ingrese un usuario valido');
          }
        } else {
          cb('Error! ingrese su mensaje');
        }
      } else {
        //guarda a la base de datos
        var newMsg = new Chat({
          nicksend: socket.nickname,
          nickres: "grupo",
          msg,
        });
        await newMsg.save();//metodo que ingresa a la base de datos

        //reenvia a todos los usuarios
        io.sockets.emit('new message', {
          msg,
          nick: socket.nickname
        });
      }
    });
  //cuando un usuario se desconecta
    socket.on('disconnect', data => {
      if(!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames() {
      io.sockets.emit('usernames', Object.keys(users));
    }










    // recibe el mensaje de un cliente privado
    socket.on('send message private', async (data,nickp, cb) => {
      var msg = data.trim();
      console.log(msg+nickp);
      var newMsg = new Chat({
        nicksend: socket.nickname,
        nickres: nickp,
        msg,
      });
      await newMsg.save();//metodo que ingresa a la base de datos

      //reenvia a todos los usuarios
      io.sockets.emit('new message private', {
        msg,
        nicksend: socket.nickname,
        nickres:nickp
      });
    });




  });

}
