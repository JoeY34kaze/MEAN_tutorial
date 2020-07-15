const Post = require('../models/post');

//--------------------- NEccessary Logic above

module.exports.getPost = async function(req,res){
  var response = await get_post(req.params._id);
  if(response)//tko je naredu u videu lekcija /68-ish
    res.status(200).json(response);
  else
    res.status(404).json({});
}

module.exports.getAll = async function(req,res){
  var all_posts = await get_all();
  status=404;
  if(all_posts)
    status=200;
  res.status(status).json( {message: 'Posts fetched successfully!', posts : all_posts} );//tkole nastimamo status!!! omg so easy
}

module.exports.savePost = async function(req,res){
  console.log("saving post.. ");
  //201 ok, new resource was created

  var save_post_response = await save_post(req);
  console.dir(save_post_response.saved_object);
  if(save_post!=null){
    if(save_post_response.saved_object!=null){
      if (save_post_response.saved_object._id!=null){
        res.status(200).json({message : "saved", post:{

            //OLD STYLE :  rabmo ubistvu povozt _id z id

          id: save_post_response.saved_object._id,
          title : save_post_response.saved_object.title,
          content : save_post_response.saved_object.content,
          imagePath : save_post_response.saved_object.imagePath


          // NEW STYLE
          /*
          ...save_post_response.saved_object,
          id: save_post_response.saved_object._id
          */
        }});
        return;
      }
    }
  }
  res.status(500).json();
}

module.exports.deletePost = async function (req,res){
  status = await delete_post(req.params._id);
  console.log(status);
  m="Deleted successfully!";
   if(status !=200)
    m="Error when deleting post."
  res.status(status).json({message : m});
}

module.exports.updatePost = async function(req,res){
  var update_post_result = await update_post(req.body, req.params._id);
  if(update_post_result!=null){
    if(update_post_result.updated_object!=null){

      res.status(200).json({message : "updated", postId: req.params._id});//vrnemo ISTI id ker smo ga shranil v bazo. nismo mogli ne-shranit v bazo
      return;

    }
  }
  res.status(500).json();
}

//---------------------------------------------------------METHODS

async function get_post(_id){
  const post = await Post.findById(_id);
  return post;
}

async function get_all(){
  const posts = await Post.find();
  return posts;//error se pohandla baje v app.js, ce vrnemo prazno pa tudi v zunanji metodi
}

async function save_post(req){
  //.... database code n stuff
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });

  console.log("  2saving... : "+post);
  const save_result = await post.save();//ob uspesni shranitvi nam vrne objekt k smo ga shranil
  console.log(save_result);

  if(save_result==null)
  return {status:500, saved_object : null};
  return {status:200, saved_object : save_result};
}

async function delete_post(_id){
  const deleted_post = await Post.deleteOne({_id : _id});
  //console.log(deleted_post);
  if(deleted_post!=null)return 200;
  else return 500;
}

async function update_post(data, _id){
  const new_post=new Post({
    _id:_id,//brez tega vrze error ker pravi da nebo brisal pa delal novga objekta.
    title:data.title,
    content:data.content
  });
  var result = await Post.updateOne({_id : _id}, new_post);

  if(result!=null)
    { if(result.nModified>0){
        return {status:200, updated_object:result}
      } else{
        return {status:500,updated_object:null};
      }
    }
    else{
      return {status:500,updated_object:null};
    }
}
