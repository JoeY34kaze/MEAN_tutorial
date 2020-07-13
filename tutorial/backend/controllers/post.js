const Post = require('../models/post');

module.exports.getAll = async function(req,res){
  var all_posts = await get_all();
  status=404;
  if(all_posts!=null)
    if(all_posts.length>0)
      status=200;
  res.status(status).json( {message: 'Posts fetched successfully!', posts : all_posts} );//tkole nastimamo status!!! omg so easy
}

module.exports.savePost = async function(req,res){
  console.log("saving post -> "+req.body.title);
  //201 ok, new resource was created
  var save_post_response = await save_post(req.body);
  res.status(save_post_response.status).json({message: save_post_response.message});
}

//---------------------------------------------------------METHODS


async function get_all(){
  const posts = await Post.find();
  return posts;//error se pohandla baje v app.js, ce vrnemo prazno pa tudi v zunanji metodi
}

async function save_post(p){
  //.... database code n stuff
  const post = new Post({
    title : p.title,
    content : p.content
  });

  const save_result = await post.save();//ob uspesni shranitvi nam vrne objekt k smo ga shranil
  console.log(save_result);

  if(save_result==null)
  return {status:500, message : "error whens saving!"};

  return {status:200, message : "Sucessfully saved!"};
}
