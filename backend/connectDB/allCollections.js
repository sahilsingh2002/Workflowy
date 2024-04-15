const {getDB} = require("./connectToDB");

const User = ()=>{
  const db = getDB();
  const users = db.collection("user");
  return users;
}
const Workspaces = ()=>{
  const db = getDB();

  const workspaces = db.collection("workspace");
  return workspaces;
}
const Pages = ()=>{
  const db = getDB();

  const pages = db.collection("page");
  return pages;
}
const Tasks = ()=>{
  const db = getDB();

  const tasks = db.collection("task");
  return tasks;
}

module.exports = {User,Workspaces,Pages,Tasks};
