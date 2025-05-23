const mongoose=require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectDB=()=>{

    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then((conn)=>{
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    })
    .catch((err)=>{
        console.log(`Error: ${err.message}`);
    })

};
module.exports=connectDB;
