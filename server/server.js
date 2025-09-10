require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`サーバ起動: http://localhost:${process.env.PORT}`);
});