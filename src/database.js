const mongoose = require('mongoose');
// mongodb+srv://<username>:<password>@joven-j4sp6.mongodb.net/test?retryWrites=true&w=majority
// mongoose.connect('mongodb://localhost/ChatLucho', {
//     useNewUrlParser: true
// })
mongoose.connect('mongodb+srv://lushojl:92089910@joven-j4sp6.mongodb.net/ChatLucho?retryWrites=true&w=majority', {
    useNewUrlParser: true
})
  .then(db => console.log('db conectada'))
  .catch(err => console.log(err));