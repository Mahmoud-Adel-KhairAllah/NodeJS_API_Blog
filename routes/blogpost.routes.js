const express=require("express");
const router=express.Router();
const BlogPost=require('../model/blogpost.model');
const middelware=require('../middelware');
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + ".jpg");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
    fileFilter: fileFilter,
});

//adding cover image
router
  .route("/add/coverImage/:id")
  .patch(middelware.checkToken, upload.single("img"), (req, res) => {
    BlogPost.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true },
      (err, result) => {
        if (err) return res.send(err);
       
        return res.status(200).send(result);
      }
    );
  });
router.route('/add').post(middelware.checkToken,(req,res)=>{
     const blogPost=new BlogPost({
          userName:req.decoded.userName,
          title:req.body.title,
          body:req.body.body,
     });
     blogPost.save().then((result)=>{
          res.json({data:result});
     }).catch((error)=>{
          res.json({error:error});
     })
});

router.route('/getOwnBlog').get(middelware.checkToken,(req,res)=>{
     BlogPost.find({
          userName:req.decoded.userName
     },(err,data)=>{
          if(err) return res.json({err:err});
          else if(data==null){
               return res.json({msg:"لا يوجد لديك منشورات",data:[]});
          }else if(data!=null){
               return res.json({data:data});
          }
     })
});

router.route('/getOtherBlog').get(middelware.checkToken,(req,res)=>{
     BlogPost.find({userName:{$ne:req.decoded.userName}},
          (err,data)=>{
               if(err) return res.json({err:err});
               else if(data==null){
                    return res.json({msg:"لا يوجد منشورات",data:[]});
               }else if(data!=null){
                    return res.json({data:data});
               }  
     });
});

router.route('/getAllBlog').get((req,res)=>{
     BlogPost.find(
          (err,data)=>{
               if(err) return res.json({err:err});
               else if(data==null){
                    return res.json({msg:"لا يوجد منشورات",data:[]});
               }else if(data!=null){
                    return res.json({data:data});
               }  
     });
});

router.route('/delete/:id').delete((req,res)=>{
BlogPost.findOneAndDelete({$and:[{userName:req.decoded.userName},{_id:req.params.id}]},(err,data)=>{
     if(err) return res.json({err:err});
               else if(data==null){
                    return res.json({msg:"لا يوجد منشور",data:[]});
               }else if(data!=null){
                    return res.json({msg:"تم حذف المنشور",data:data});
               }  
})
});

router.route('/update/:id').patch(middelware.checkToken,(req,res)=>{
     let blogPost={};
     BlogPost.findOne({$and:[{userName:req.decoded.userName},{_id:req.params.id}]},(err,data)=>{
          if(err) return res.json({err:err});
          if(data!=null){
               blogPost=data;
          }else{
               blogPost={};
          }
     });
     BlogPost.findOneAndUpdate({$and:[{userName:req.decoded.userName},{_id:req.params.id}]},{
          $set:{
               title:req.body.title?req.body.title:blogPost.title,
               body:req.body.body?req.body.body:blogPost.body,
          }

     },{new:true},(err,data)=>{
          if(err) return res.json({err:err});
          if(data!=null){
               return res.json({msg:"تم تحديث المنشور",data:data});
          }else{
               return res.json({msg:"لم يتم التحديث",data:[]});

          }
     })
})

module.exports=router;
