const {MongoClient} = require('mongodb');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const port = 3000;
const app = express();
const URI = process.env.MONGODB_URI;
let db;
const connect = async()=>{
  try{
    const client = new MongoClient(URI);
    await client.connect()
    db = client.db("MindGrid");
    console.log("mongoDB connected");

  }
  catch(err){
    console.log("mongoDB error: ", err);
  }
}
const disconnect = async()=>{
  if(db){
    db.close();
    console.log("disconnected from DB"); 
  }
}
const getDB =()=>{
  return db;
}



module.exports ={connect, disconnect, getDB};