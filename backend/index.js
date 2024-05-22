const express = require('express');
const {connect} = require('./connectDB/connectToDB');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const workspaceRoutes = require("./routes/workspaceRoutes")
const sectionRoutes = require("./routes/sectionRoutes")
const taskRoutes = require("./routes/taskRoutes")
const {createServer} = require('http');
const {Server} = require("socket.io");
const jwt = require('jsonwebtoken');


const cors = require('cors');
const { authenticateUser } = require('./middlewares/auth');

const port = 7000;
const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors:{
     origin: "http://localhost:3000", credentials: true 
  }
});
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
connect();

server.listen(port,()=>{
  console.log("server started on port " + port);
});

app.use('/api',authRoutes);
app.use('/api/workspace',workspaceRoutes)
app.use('/api/workspace/:workspaceId/sections',sectionRoutes);
app.use('/api/workspace/:workspaceId/tasks',taskRoutes);
app.use('/',cookieParser);
io.use(function(socket, next) {
  var cookiestring = socket.request.headers.cookie;
  const cookies = cookiestring.split('; ');
 
  const userCookie = cookies.find(cookie => cookie.trim().startsWith(`user=`));
  if (userCookie) {
    console.log( userCookie.split('=')[1]);
    socket.request.res="hello";
    console.log(socket.request);
    next();
  }
  else{
    console.log("ohh");
    next(new Error('not authorized'));
  }
  // JWT HEWERERE
  
});
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  require('./handlers/WorkspaceHandler')(socket,io);

  socket.on('disconnect', () => {

    console.log('User disconnected');
  });
});