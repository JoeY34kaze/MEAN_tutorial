
module.exports.getAll = async function(req,res){
  var all_posts = await get_all();
  status=404;
  if(all_posts!=null)
    if(all_posts.length>0)
      status=200;
  res.status(status).json( {message: 'Posts fetched successfully!', posts : all_posts} );//tkole nastimamo status!!! omg so easy
}

module.exports.savePost = async function(req,res){
  console.log("saving post -> "+req.body);
  //201 ok, new resource was created
  var save_post_response = await save_post(req.body);
  res.status(save_post_response.status).json({message: save_post_response.message});
}

//---------------------------------------------------------METHODS


async function get_all(){
  return    [
    {id:"identifier_1",title:"title 1 from REST",content:"content for 1"},
    {id:"identifier_2",title:"title 2 from REST",content:"content for 2"}
  ];
}

async function save_post(p){
  //.... database code n stuff
  return {status:200, message : "Sucessfully saved!"};
}
