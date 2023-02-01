const express=require('express');
const app=express();
const mongoose = require('mongoose');
const port=process.env.port||1000;

mongoose.connect('mongodb+srv://Mahmoud:rlS04KeJiZMH5Zy7@atlascluster.5cxc0r7.mongodb.net/Blog?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(() => console.log('Connected!'));
const connection=mongoose.connection;
connection.once('open',()=>{
     console.log('Mongodb connected');
});

app.use("/uploads",express.static("uploads"));


app.use(express.json());


//User
//Profile
//BlogPost
const userRoute=require('./routes/user.routes');
const profileRoute=require('./routes/profile.routes');
const blogRoute=require('./routes/blogpost.routes');
app.use('/user',userRoute);
app.use('/profile',profileRoute);
app.use('/blogPost',blogRoute);
app.route('/').get((req,res)=>{
res.json('welcome API')
});
app.listen(port,"0.0.0.0",()=>{
     console.log('index.js start')
});