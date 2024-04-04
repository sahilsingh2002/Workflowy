const {User} = require('../connectDB/allCollections');
const jwt = require ("jsonwebtoken");
module.exports.get_signup=(req,res)=>{
  return 0;
}
const handleErr=({name,email,password})=>{
  if(!name || !email || !password){
    return (false);
  }
  return (true);
}
module.exports.post_signup=(req,res)=>{
  const {name,email,password} =req.body;
  try{
    const user = User();
      const isthere = handleErr({name,email,password});
      if(isthere){

        user.insertOne({name:name,email:email,password:password});
        res.json({status:200,message:"User Created Successfully"});
      }
      res.json({status:false,message:"send all data"});
    
    
  }
  catch(err){
    console.log(err);
  }
}
module.exports.post_login=(req,res)=>{
  const {username,password} = req.body;
  try{
    const user = User();
    const data = user.findOne({username});
    if(!data){
      res.json({status:false,message:"incorrect username"});

    }
    if(data.password!==password){
      res.json({status:false,message:"password is incorrect!"});
    }
    res.json({status:true});
  }
  catch(err){
    res.json({status:false,message:"err: "+err});
  }
}
