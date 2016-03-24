/**
 * Created by 111 on 16/3/21.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Lists = new Schema({
  id : String,
  content : String,
  accomplish : Boolean
});

mongoose.connect();

//exports.List = mongoose.model('List',Lists);