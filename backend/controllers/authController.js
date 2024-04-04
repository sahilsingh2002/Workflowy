const {User} = require('../connectDB/allCollections');
const jwt = require ("jsonwebtoken");
module.exports.get_signup=(req,res)=>{
  return 0;
}
const handleErr=({name,email,password})=>{
  if(!name || !email || !password){
    res.json({status:400,message:"please fill all data"});
  }
}
module.exports.post_signup=(req,res)=>{
  const {name,email,password} =req.body;
  try{
    const user = User();
    handleErr({name:name,email:email,password:password});
    user.insertOne({name:name,email:email,password:password});
    res.json({status:200,message:"User Created Successfully"});
    
  }
  catch(err){
    console.log(err);
  }
}
