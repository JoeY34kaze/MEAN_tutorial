const User = require('../models/user');
const bcrypt = require('bcrypt');


module.exports.createNewUser = async function(req,res){
  const email = req.body.email;
  const password = req.body.password;
  let result=null;
  const duplicate_search_query = await findUser(email,password);
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
  }else{
    console.log("User not created.");
    return null;
  }
}


async function findUser(email,password){
  const result = await User.findOne({email:email});

  if(result){
    console.log("User found: "+result);
    return result;
  }else{
    console.log("User not found.");
    return null;
  }
}
