const mongoose = require("mongoose");



const BlogPost =new mongoose.Schema(
  {
    userName:String,
    title: String,
    body: String,
    coverImage: {
      type:String,
      default:""},
    like:{
      type:Number,
      default:0},
    share:{
      type:Number,
      default:0},
    comment: {
      type:Number,
      default:0},
      createdAt: {
        type: String,
   
  
      }
   
  }
);

module.exports = mongoose.model("BlogPost", BlogPost);