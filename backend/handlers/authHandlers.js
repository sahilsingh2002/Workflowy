const { User } = require('../connectDB/allCollections');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {authenticateUser} = require('../middlewares/auth');
const cookieParser = require('cookie-parser');
const validator = require("email-validator");

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
  
module.exports = (socket, io) => {
    socket.on("login",async (data,callback)=>{
        const {username,password} = data;
        try {
            const user = User();
            const userData = await user.findOne({ username });
        
            if (!userData) {
              return res.status(400).json({ status: false, message: "Incorrect username" });
            }
            const isValidPass = await comparePasswords(password, userData.password);
    if (!isValidPass) {
     callback({ status: false, message: "Incorrect password" });
    }
    const token = generateToken({ id:userData._id });
   
   console.log(socket.request);
    socket.req.res.cookie("user",token,{ domain:"localhost", path:'/'});
   callback({ status: true, message: "Login successful",data: {
        name:userData.name,
        username:userData.username,
        email:userData.email,
      }});
        } catch (err) {
            console.error("Error in post_login:", err);
    callback({ status: false, message: "An error occurred" });
        }
    });


    socket.on("signup",async (data,callback)=>{
        const { username,name, email, password } = data.user;
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
    } });
  } catch (err) {
    console.error("Error in post_signup:", err);
    return res.status(500).json({ status: false, message: "An error occurred" });
  }
    })
}