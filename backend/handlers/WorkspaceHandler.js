const { ObjectId } = require("mongodb");
const {
  User,
  Workspaces,
  Sections,
  Tasks,
} = require("../connectDB/allCollections");

module.exports = (socket,io)=>{
  
  socket.on('update',async(data,callback)=>{
  const {id,changes} = data;
  try {
    const workspace = Workspaces();
    const currWorkspace = await workspace.findOne({ _id: new ObjectId(id) });
    if (!currWorkspace)callback({status:false,message:"board not found"});
    const filter = { _id: currWorkspace._id };
    const updateDocument = {
      $set: changes,
    };
    const worksp = await workspace.updateOne(filter, updateDocument);
    const clients = io.sockets.adapter.rooms.get(id);
    console.log(clients);
    if(changes.name){

      socket.to(id).emit("makenewTitle",changes);
    }
    else if(changes.icon){
      console.log(changes.icon);
      socket.to(id).emit("getnewIcon",changes);
    }
    else if(changes.content){
      socket.to(id).emit("getnewContent",changes);
    }
   callback({ status: true, board: worksp });
  } catch (error) {
    console.log(error);
    callback({status:false,error:error});
  }
  });
  socket.on('getroom',(data)=>{
    
    console.log(data);
    socket.join(data);
    socket.emit('getWorkspaces',data);
  });
  socket.on('leaveroom',(data)=>{
    console.log("left",data);
    socket.leave(data);
  })
}