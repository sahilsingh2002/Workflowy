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
    console.log("clients: " , clients);

    // io.to(id).emit("getWorkspaces",({hello:"hello"}));
   callback({ status: true, board: worksp });
  } catch (error) {
    console.log(error);
    callback({status:false,error:error});
  }
  });
  socket.on('getroom',(data)=>{
    
    console.log(data);
    socket.join(data);
  });
}