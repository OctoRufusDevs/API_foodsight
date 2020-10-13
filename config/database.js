const Mongoose = require("mongoose");

// const dbhost = process.env.DBHOST;
// const dbport = process.env.DBPORT;
// const dbname =  process.env.DBNAME ;

const uri = process.env.DBURI;

//mongod.exe --bind_ip 0.0.0.0
const connect = async () => {

    try{
        await Mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("DB Connection successful")
    }catch(error){
        console.log("DB not connected");
        process.exit(1);
    }
};

module.exports = {
    connect,
}