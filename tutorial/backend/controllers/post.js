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
  const pageSize = req.query.pageSize;
  const currentPage = req.query.currentPage;


  var search_query_response = await get_all(pageSize,currentPage);
  status=404;
  if(search_query_response)
    status=200;
  res.status(status).json( {message: 'Posts fetched successfully!', posts : search_query_response.posts, maxPosts:search_query_response.maxPosts} );//tkole nastimamo status!!! omg so easy
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
          imagePath : save_post_response.saved_object.imagePath,
          creator : save_post_response.saved_object.creator


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
  status = await delete_post(req);
  console.log(status);
  m="Deleted successfully!";
   if(status !=200)
    m="Error when deleting post."
  res.status(status).json({message : m});
}

module.exports.updatePost = async function(req,res){
  var update_post_result = await update_post(req);
  if(update_post_result!=null){
    if(update_post_result.updated_object!=null){

      res.status(200).json({message : "updated", postId: req.params._id, imagePath:update_post_result.updated_object.imagePath});//vrnemo ISTI id ker smo ga shranil v bazo. nismo mogli ne-shranit v bazo
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

async function get_all(pageSize, currentPage){

  const postQuery = Post.find();

  if(pageSize && currentPage){
    console.log("page size; "+pageSize+"  currentPage: "+currentPage);
    if(currentPage<1)currentPage=1;

    postQuery
      .skip(pageSize * (currentPage-1))//we skip the first n posts.(previous pages)
      .limit(parseInt(pageSize));
  }

  const numberOfPosts = await Post.count();
  const posts = await postQuery;
  return {posts :posts, maxPosts : numberOfPosts};//error se pohandla baje v app.js, ce vrnemo prazno pa tudi v zunanji metodi
}

async function save_post(req){
  //.... database code n stuff
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.tokenData.userId
  });

  console.log("  2saving... : "+post);
  const save_result = await post.save();//ob uspesni shranitvi nam vrne objekt k smo ga shranil
  console.log(save_result);

  if(save_result==null)
  return {status:500, saved_object : null};
  return {status:200, saved_object : save_result};
}

async function delete_post(req){
  const deleted_post = await Post.deleteOne({_id : req.params._id, creator : req.tokenData.userId});
  //console.log(deleted_post);
  if(deleted_post.n>0)return 200;
  else return 500;
}

async function update_post(req){
  let imagePath=req.body.imagePath;//image path we already have
  if(req.file){
    const url = req.protocol + "://" + req.get("host");//image path that was newly uploaded
    imagePath=url + "/images/" + req.file.filename;
  }

  const new_post = new Post({
    _id:req.body.id,//brez tega vrze error ker pravi da nebo brisal pa delal novga objekta.
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator : req.tokenData.userId
  });
  var result = await Post.updateOne({_id : req.body.id, creator : req.tokenData.userId}, new_post);

  console.log(result);
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
