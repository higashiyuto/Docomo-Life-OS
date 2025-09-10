const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Atlasに接続成功');
    }catch(err){
        console.log('MongoDB 接続エラー: ', err);
        process.exit(1);
    }
};

module.exports = connectDB;