
const express = require('express');
const {connect} = require('./connectDB/connectToDB');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const workspaceRoutes = require("./routes/workspaceRoutes")

const cors = require('cors');


const port = 7000;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
connect();
app.listen(port,()=>{
  console.log("app started on port " + port);
});
app.use('/api',authRoutes);
app.use('/api/workspace',workspaceRoutes)
app.use('/',cookieParser);