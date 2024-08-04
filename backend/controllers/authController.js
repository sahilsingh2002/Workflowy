const { User } = require('../connectDB/allCollections');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {authenticateUser} = require('../middlewares/auth');
const cookieParser = require('cookie-parser');
const validator = require("email-validator");
const { ObjectId } = require('mongodb');



const handleUserExists = async ({ username, user }) => {
  const existingUser = await user.findOne({ username });
  
  return existingUser ? true : false;
};

const handlemailExists = async ({ email, user }) => {
  const existingUser = await user.findOne({ email });
  
  return existingUser ? true : false;
};
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, 'MindGrid_adm', { expiresIn: '1h' });
};

module.exports.isUser = async(req,res)=>{
  const {username} = req.body;
  try{
    const user = User();
    const userExists = await handleUserExists({ username, user });
    
    
    if(userExists){
      return res.status(400).json({ status: false, message: "Username already exists" });
    }
    return res.status(200).json({ status: true, message: "Unique Username" });
  }
  catch(err){
    console.error("Error in username:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
}
module.exports.isUserEmail = async(req,res)=>{
  const {email} = req.body;
  try{
    const user = User();
    const valid = validator.validate(email);
    if(!valid){
      return res.status(400).json({ status: false, message: "Email is not a valid one" });
    }
    const userExists = await handlemailExists({ email, user });
    
    if(userExists){
      return res.status(400).json({ status: false, message: "Email already exists" });
    }
    return res.status(200).json({ status: true, message: "Unique Email" });
  }
  catch(err){
    console.error("Error in Email:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
}
module.exports.post_signup = async (req, res) => {
  const { username,name, email, password } = req.body;
  try {
    if (!username ||!name || !email || !password) {
      return res.status(400).json({ status: false, message: "Please provide all required fields" });
    }
   
    const hashPass = await hashPassword(password);

    const user = User();
    const userExists = await handleUserExists({ username, user });
    const emailExists = await handleUserExists({ email, user });

    if (userExists | emailExists) {
      return res.status(400).json({ status: false, message: "user already exists" });
    }



    const result = await user.insertOne({ username,name, email, password: hashPass });
    const id = result.insertedId;
    const token = generateToken({ id });
    res.cookie("user",token);
    return res.status(201).json({ status: true, message: "User created successfully", data:{
      username, email, name
    },token:token });
  } catch (err) {
    console.error("Error in post_signup:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
};
module.exports.authing = async(req,res)=>{
  try{
    const userId = req.id;

    const user = User();
    const result = await user.findOne({_id:new ObjectId(userId)});
    console.log("res",result);
  
    res.json({ name:result.name, email:result.email, username:result.username,role:'owner'});
  }
  catch(err){
    console.error("Error in authing:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }


  // Fetch details based on userId and send response
}

module.exports.post_login = async (req, res) => {

  const { username, password } = req.body;
  try {
    const user = User();
    const userData = await user.findOne({ username });

    if (!userData) {
      return res.status(400).json({ status: false, message: "Incorrect username" });
    }
    
    
    const isValidPass = await comparePasswords(password, userData.password);
    if (!isValidPass) {
      return res.status(400).json({ status: false, message: "Incorrect password" });
    }
    const token = generateToken({ id:userData._id });
   
    res.cookie("user",token,{ domain:"localhost", path:'/'});

    return res.json({ status: true, message: "Login successful",data: {
      name:userData.name,
      username:userData.username,
      email:userData.email,
    },token:token});
  } catch (err) {
    console.error("Error in post_login:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
};
module.exports.Logout_user = (req,res)=>{
  res.cookie("user",'', {maxAge:0, path: '/', domain: 'localhost' });
  res.end();
  
}
