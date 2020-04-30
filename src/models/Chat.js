const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
  nicksend: String,
  nickres: String,
  msg: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
//
// const ChatSchema = new Schema({
//   nick: String,
//   msg: [{
//     nick:{type:String},
//     mensaje:{type:String},
//     created: { type: Date, default: Date.now }
//   }],
//   created: { type: Date, default: Date.now }
// });
//
// module.exports = mongoose.model('Usuario', ChatSchema);