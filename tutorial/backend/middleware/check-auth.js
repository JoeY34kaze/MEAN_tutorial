const jwt = require('jsonwebtoken');
const JWTSECRET='asdkjhdsiusdfuhoiqweo823i8939823d9h823db98h23d9823h89233oi38938dh83gi83d29238er7tliew7w87';


module.exports = (req,res,next)=>{
  try{
    //console.log("Checking token authentication...");
    //console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];//konvencija k smo si jo izbal. loh bi biu query parameter tud

    const tokenData = jwt.verify(token, JWTSECRET);
    console.log("token verified successfuly. : "+tokenData);
    next();
  }catch(error){
    console.log("Token authentication failed.");
    res.status(401).json({});
  }


}
