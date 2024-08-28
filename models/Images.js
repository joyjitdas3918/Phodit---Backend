const mongoose=require('mongoose');
const {Schema}=mongoose;
const ImagesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,        
    },
    imagedata:{
        type: String,
        default:null
    },
    username:{
        type: String,
        required: true
    },
    parent:{
        type: String,
        default:""
    },
    children:{
        type: Array,
        default:[]
    },
    date:{
        type: Date,
        default: Date.now
    },
  });

  module.exports=mongoose.model('images',ImagesSchema)