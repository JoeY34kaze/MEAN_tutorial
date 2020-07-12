
module.exports.getAll = async function(req,res){
  var all_posts = await get_all();
  status=404;
  if(all_posts!=null)
    if(all_posts.length>0)
      status=200;
  res.status(status).json( {message: 'Posts fetched successfully!', posts : all_posts} );//tkole nastimamo status!!! omg so easy
}

async function get_all(){
  return    [
    {id:"identifier_1",title:"title 1 from REST",content:"content for 1"},
    {id:"identifier_2",title:"title 2 from REST",content:"content for 2"}
  ];
}
