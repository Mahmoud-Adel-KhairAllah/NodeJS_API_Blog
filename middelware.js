const jwt = require("jsonwebtoken");
const config = require("./config");
let chechToken = (req, res, next) => {
  let token = req.headers["authorization"];
  console.log("-------->", token);
  if (!token) {
    return res.json({
      status: false,
      msg: "Token not provided",
    });
  }
  token = token.slice(7, token.length);
  if (token) {
    jwt.verify(token, config.key, (err, decode) => {
      if (err) {
        return res.json({
          status: false,
          msg: "Invalid Token",
        });
      } else {
        req.decode = decode;
        next();
      }
    });
  } else {
    return res.json({
      status: false,
      msg: "Token not provided",
    });
  }
};
module.exports = {
  chechToken: chechToken,
};
