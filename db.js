const mongoose = require('mongoose');
const mongoURI= `${process.env.REACT_APP_MONGO_URI}`;
console.log(mongoURI);
//const mongoURI="mongodb://localhost:27017/Phodit"
const connectToMongo =() =>{
    mongoose.connect(mongoURI).then(()=>{
        console.log('Connected to Mongo successfully');
    }).catch((e)=>console.log(e.message))
}

module.exports= connectToMongo;
