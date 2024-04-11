const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
module.exports.authenticateUser = async(req,res,next)=>{
  try{
    const token = req.cookies.user;
    console.log(token);
    
    if(token){
      const secret = "workflowy_adm";
      jwt.verify(token,secret,(err,decoded)=>{
        if (err) {
          console.error('Error:', err.message);
          res.status(401).json({ error: 'Unauthorized' }); // Unauthorized if token is invalid
        }
        else{
          const id = decoded.id;
          req.id = id;
          console.log(req.id);
          next();
        }
      })
    }
    else {
      res.status(401).json({ error: 'Unauthorized' }); // Unauthorized if token is missing
    }
  }
  catch(err){
    console.log(err);
  }
}



