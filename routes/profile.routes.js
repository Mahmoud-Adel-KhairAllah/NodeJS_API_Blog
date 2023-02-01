const express = require("express");
const router = express.Router();
const Profile = require("../model/profile.model");
const User = require("../model/user.model");
const middleware = require("../middelware");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.userName + ".jpg");
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
    // fileFilter: fileFilter,
});

//adding and update profile image
router
  .route("/add/image")
  .patch(middleware.checkToken, upload.single("img"), (req, res) => {
    console.log(req.file.path+"<================path");
    Profile.findOneAndUpdate(
      { userName: req.decoded.userName },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true },
      (err, profile) => {
        if (err) return res.status(500).send(err);
        if(profile!=null){
          const response = {
            message: "تم رفع الصورة بنجاح",
            data: profile,
          };
          return res.status(200).send(response);
        }else{
          const response = {
            message: "لم يتم رفع الصورة ",
            data: profile,
          };
          return res.status(200).send(response);
        }
        
      }
    );
  });

router.route("/add").post(middleware.checkToken, (req, res) => {
  const profile = Profile({
    userName: req.decoded.userName,
    name: req.body.name,
    profession: req.body.profession,
    DOB: req.body.DOB,
    titleLine: req.body.titleLine,
    about: req.body.about,
  });
  profile
    .save()
    .then(() => {
      return res.json({ result:true,msg: "تم إنشاء المعلومات الشخصية بنجاح" });
    })
    .catch((err) => {
      return res.status(400).json({ result: false,msg: "لم يتم إنشاء المعلومات الشخصية" });
    });
});

router.route("/checkProfile").get(middleware.checkToken,(req,res)=>{
  Profile.findOne({userName:req.decoded.userName},(err,result)=>{
    if(err)return res.json({err:err});
    else if(result==null){
      return res.json({Status:false})
    }else{
      return res.json({Status:true})

    }
  })
});

router.route("/getData").get(middleware.checkToken,(req,res)=>{
  Profile.findOne({userName:req.decoded.userName},(err,result)=>{
    if(err)return res.json({err:err});
     if(result===null){
      return res.json({data:[]})
    }else{
      return res.json({data:result})

    }
  })
});

router.route('/update').post(middleware.checkToken,(req,res)=>{
  let profile={};
   Profile.findOne({userName:req.decoded.userName},(err,result)=>{
    if(err)return res.json({err:err});
     if(result==null){
     profile={};
    }else{
      profile=result;

    }
  });
  
  Profile.findOneAndUpdate({userName:req.decoded.userName},{
    $set:{
      userName:req.body.userName?req.body.userName:profile.userName,
      name:req.body.name?req.body.name:profile.name,
      profession:req.body.profession?req.body.profession:profile.profession,
      titleLine:req.body.titleLine?req.body.titleLine:profile.titleLine,
      DOB:req.body.DOB?req.body.DOB:profile.DOB,
      about:req.body.about?req.body.about:profile.about,
    }
  },{new:true},(err,result)=>{
    if(err)return res.json({err:err});
    if(result!==null){
      return res.json({result:true,msg:"تم تحديث المعلومات  الشخصية بنجاح",data:result})
    }else{
      return res.json({result:false,msg:"لم يتم تحديث البيانات",data:[]})
    }
  })
  
});

module.exports = router;