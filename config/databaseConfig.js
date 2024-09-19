const mongoose= require('mongoose');

const MONGODB_URL=process.env.MONGODB_URL || "mongodb://localhost:27017";

const databaseconnect=() =>{
    mongoose.connect(MONGODB_URL)
    .then((conn)=> console.log(`Connected to network:${conn.connection.host}`))
    .catch((err)=>console.log(err.message));
}


module.exports = databaseconnect;