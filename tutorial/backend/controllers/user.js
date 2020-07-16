const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWTSECRET='asdkjhdsiusdfuhoiqweo823i8939823d9h823db98h23d9823h89233oi38938dh83gi83d29238er7tliew7w87';


module.exports.createNewUser = async function(req,res){
  const email = req.body.email;
  const password = req.body.password;
  let result=null;
  const duplicate_search_query = await findUser(email);
  console.log(duplicate_search_query);
  if(duplicate_search_query==null){
    result = createNew(email,password);
    if(result){
      res.status(201);
    }else
      res.status(500);
  }else{
    res.status(500);
  }
  res.json(result);
}

module.exports.login = async function(req,res){
  const token = await find_user_with_login(req.body.email,req.body.password);
  if(token){
    res.status(200);
  }
  else{
    res.status(404);
  }
  res.json({token:token, time: 3600});
}


//---------------------------------------------------------------------------------------------------------------
async function createNew(email,password){//prej smo pogledal da ne obstaja
  console.log("creating password...");
  const hashedPass= await bcrypt.hash(password,10);

  console.log("creating user...");
  const user = new User({email:email, password:hashedPass});
  const result = await User.create(user);

  if(result){
    console.log("User created: "+result);
    return result;
  }else{password
    console.log("User not created.");
    return null;
  }
}


async function findUser(email){
  const result = await User.findOne({email:email});

  if(result){
    console.log("User found: "+result);
    return result;
  }else{
    console.log("User not found.");
    return null;
  }
}

async function find_user_with_login(email,password){


  const user = await User.findOne({email : email});
  if(!user)return null;

  const match = await bcrypt.compare(password, user.password);
  if(!match) return null;

  const token = jwt.sign({email:user.email, userId:user._id}, JWTSECRET, {expiresIn: "1h"});

  return token;

}
