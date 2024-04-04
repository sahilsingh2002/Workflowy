
const express = require('express');
const {connect} = require('./connectDB/connectToDB');
const authRoutes = require('./routes/authRoutes')

const port = 3000;
const app = express();

app.use(express.json());
connect();
app.listen(port,()=>{
  console.log("app started on port " + port);
});
app.use('/',authRoutes);