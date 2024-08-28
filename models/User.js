const mongoose=require('mongoose');
const  {Schema} =mongoose
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    posts:{
        type: Number,
        default: 0
    },
    date:{
        type: Date,
        default: Date.now
    },

  });

  module.exports=mongoose.model('user',UserSchema)