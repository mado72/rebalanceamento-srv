'use strict';

const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://user:pass@localhost:27017/rebalanceamento'; // 'mongodb://mongouserdb:mongopwd@localhost:27017/admin';
    
console.log(`Usando conexão com ${mongoURI}`);
mongoose.Promise = global.Promise;

const connectWithRetry = async() => {
    const options = {
        "retryWrites": true,
        "w": "majority",
        "authSource": "admin",
    };
    // const options = { 
    //     "retryWrites":true,
    //     "w":majority,
    //     "authSource": "admin",
    //     "useNewUrlParser": true 
    // };

    try {
        mongoose.set('strictQuery', false)
        // mongoose.connect(mongoURI) 
        mongoose.connect(mongoURI, options) 
        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log('Mongo connected')
        });
    }
    catch(error) {
        console.error(`${new Date().toLocaleString()} Failed to connect to mongo on startup - retrying in 5 sec`, error);
        setTimeout(connectWithRetry, 5000);
//        process.exit()
    }
};

connectWithRetry();
