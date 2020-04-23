const mongoose= require('mongoose');

//-------Schema setup---->
const postSchema = new mongoose.Schema({
    name: String,
    content: String
});

module.exports = mongoose.model('post' , postSchema);