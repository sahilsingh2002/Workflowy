const {getDB} = require("./connectToDB");

const User = ()=>{
  const db = getDB();
  const users = db.collection("user");
  return users;
}
module.exports = {User};