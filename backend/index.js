const express = require('express');
const {connect} = require('./connectDB/connectToDB');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const workspaceRoutes = require("./routes/workspaceRoutes")
const {createServer} = require('http');
const {getS3Image} = require('./controllers/workspaceController');


const {Server} = require("socket.io");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const port = 7000;
const app = express();
const server =createServer(app);

const io = new Server(server,{
  cors:{
    origin:true,
    credentials:true
 
  }
}
);

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

 
connect();
async function getUrl(){
  console.log(await getS3Image('testing.png'));
}
getUrl();

 
 
server.listen(port,()=>{
  console.log("server started on port " + port);
});

app.use('/api',authRoutes);
app.use('/api/workspace',workspaceRoutes)
app.use('/',cookieParser);

io.use(function(socket, next) {
  const cookiestring = socket?.handshake?.headers?.cookie;
  if(cookiestring) {
  
    const cookies = cookiestring.split('; ');
  const userCookie = cookies.find(cookie => cookie.trim().startsWith(`user=`));
  if (userCookie) {
    token = ( userCookie.split('=')[1]);
    if(token){
      const secret = "MindGrid_adm";
      console.log("doers");
      jwt.verify(token,secret,(err,decoded)=>{
        if (err) {
          console.error('Error:', err.message);
          next(new Error('not authorized')); // Unauthorized if token is invalid
        }
        else{
          const id = decoded.id;
          socket.handshake.auth = id;
          next();
        }
      })
    }
    else {
      next(new Error('not authorized')); // Unauthorized if token is missing
    }
  }
  else{
    console.log("ohh");
    next(new Error('not authorized'));
  }
}
else{
  next(new Error('not authorized'));
}
  // JWT HEWERERE
  
});
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  require('./handlers/WorkspaceHandler')(socket,io);
  require('./handlers/SectionHandlers')(socket,io);
  require('./handlers/TaskHandler')(socket,io);


  socket.on('disconnect', () => {

    console.log('User disconnected');
  });
});