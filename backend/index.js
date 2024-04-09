
const express = require('express');
const {connect} = require('./connectDB/connectToDB');
const authRoutes = require('./routes/authRoutes')
const protectedRoutes = require('./routes/protectedRoutes');
const cors = require('cors');


const port = 7000;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
connect();
app.listen(port,()=>{
  console.log("app started on port " + port);
});
app.use('/api',authRoutes);
app.use('/api/auth',protectedRoutes);