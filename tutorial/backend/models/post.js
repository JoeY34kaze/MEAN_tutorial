const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title : {type : String, required : true},
  content : {type : String, required : true},
  imagePath : {type : String, required : true},
  creator : {type: mongoose.Schema.Types.ObjectId, required : true, ref : "User"}//_id od User.model
});

module.exports = mongoose.model('Post',postSchema);
