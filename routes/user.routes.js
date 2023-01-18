const express = require("express");
const jwt = require("jsonwebtoken");
const middelware = require("../middelware");
const config = require("../config");
const router = express.Router();
const User = require("../model/user.model");

router.route("/register").post((req, res) => {
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
  });
  user
    .save()
    .then(() => {
      sendToken(req.body.userName, "تم إنشاء مستخدم جديد بنجاح", res, true);
    })
    .catch((err) => {
      err.msg = "إسم المستخدم موجود حاول غيير إسم المستخدم";
      const msg = { err: err };
      res.status(500).json({ result: false, data: msg });
    });
});

router.route("/:userName").get(middelware.chechToken, (req, res) => {
  User.findOne({ userName: req.params.userName }, (err, data) => {
    if (err) return res.status(500).json({ msg: err });
    res.json({
      result: true,
      data: data,
    });
  });
});

router.route("/login").post((req, res) => {
  User.findOne(
    {
      userName: req.body.userName,
    },
    (errro, result) => {
      if (errro) {
        return res.status(500).json({ msg: errro });
      }
      if (result === null) {
        res.status(403).json({ result: false, msg: "إسم المستخدم غير موجود" });
      } else {
        //login
        if (
          result.password === req.body.password &&
          result.userName === req.body.userName
        ) {
          sendToken(req.body.userName, "تم تسجيل الدخول بنجاح", res, true);
        } else if (result.password !== req.body.password) {
          res.json({ msg: "كلمة المرور غير صحيحة" });
        }
      }
    }
  );
});

router.route("/details").get(middelware.chechToken, (req, res) => {
  console.log(req.decode);
  User.findOne({ userName: req.decode.userName }, (err, data) => {
    if (err) {
      return res.status(500).json({ result: false, msg: "Error", data: err });
    } else {
      return res.status(200).json({ result: true, msg: "Success", data: data });
    }
  });
});

router.route("/update/:userName").patch(middelware.chechToken, (req, res) => {
  User.findOneAndUpdate(
    {
      userName: req.params.userName,
    },
    {
      $set: { password: req.body.password, userName: req.body.userName },
    },
    (error, data) => {
      if (error) return res.status(500).json({ result: false, msg: error });
      const msg = {
        result: true,
        msg: "تم تغيير كلمة السر بنجاح",

        data: data,
      };

      return res.json(msg);
    }
  );
});

router.route("/delete/:userName").delete(middelware.chechToken, (req, res) => {
  User.findOneAndDelete({ userName: req.params.userName }, (error, data) => {
    if (error) return res.status(500).json({ result: false, msg: errro });
    const msg = {
      msg: "تم حذف المستخدم بنجاح",
      data: data,
    };
    return res.json(msg);
  });
});

const sendToken = (userName, msg, res, result) => {
  let token = jwt.sign({ userName: userName }, config.key, {
    expiresIn: "24h",
  });
  res.json({ result: result, token: token, msg: msg });
};
module.exports = router;
