const { User } = require('../connectDB/allCollections');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {authenticateUser} = require('../middlewares/auth');



const handleUserExists = async ({ username, user }) => {
  const existingUser = await user.findOne({ username });
  console.log(existingUser);
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
  return jwt.sign({ id: user.id }, 'workflowy_adm', { expiresIn: '1h' });
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
module.exports.post_signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ status: false, message: "Please provide all required fields" });
    }
   
    const hashPass = await hashPassword(password);

    const user = User();
    const userExists = await handleUserExists({ username, user });

    if (userExists) {
      return res.status(400).json({ status: false, message: "Username already exists" });
    }


    const result = await user.insertOne({ username, email, password: hashPass });
    const id = result.insertedId;
    const token = generateToken({ id });
    res.cookie("user",token,{maxAge: 3600});
    return res.status(201).json({ status: true, message: "User created successfully", token:token });
  } catch (err) {
    console.error("Error in post_signup:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
};
module.exports.authing = async(req,res)=>{
  const userc = req.user;
  console.log(userc);
  res.json({ user: req.user });
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
    res.cookie("user",token,{maxAge: 3600});

    return res.json({ status: true, message: "Login successful" });
  } catch (err) {
    console.error("Error in post_login:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
};
