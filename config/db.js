const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,   
    })
    .then((data)=>console.log(`Db connect ${data.connection.host}`))
    .catch(err=>console.log(err))
}