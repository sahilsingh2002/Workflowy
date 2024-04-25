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
const Sections = ()=>{
  const db = getDB();

  const sections = db.collection("section");
  return sections;
}
const Tasks = ()=>{
  const db = getDB();

  const tasks = db.collection("task");
  return tasks;
}

module.exports = {User,Workspaces,Sections,Tasks};
