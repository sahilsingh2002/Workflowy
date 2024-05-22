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
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  require('./handlers/WorkspaceHandler')(socket,io);

  socket.on('disconnect', () => {

    console.log('User disconnected');
  });
});