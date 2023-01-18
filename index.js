const express=require('express');
const app=express();
const mongoose = require('mongoose');
const port=process.env.port||1000;

mongoose.connect('mongodb://127.0.0.1:27017/Blog',{useNewURLParser:true,useUnifiedTopology:true});
const connection=mongoose.connection;
connection.once('open',()=>{
     console.log('Mongodb connected');
});

app.use(express.json())
const userRoute=require('./routes/user.routes');
app.use('/user',userRoute);

app.route('/').get((req,res)=>{
res.json('welcome API')
});
app.listen(port,()=>{
     console.log('index.js start')
});