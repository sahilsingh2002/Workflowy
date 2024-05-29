const { ObjectId } = require("mongodb");
const {
  Workspaces,
  Sections,
  Tasks,
} = require("../connectDB/allCollections");

module.exports = (socket,io)=>{
  socket.on('create',async(data,callback)=>{
    const {id} = data;
    const sect = Sections();
    const workspace = Workspaces();
    try{
      const result = await sect.insertOne({
        title:"untitled",
        workspace:new ObjectId(id),
        tasks:[],
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      const mainId = result.insertedId;
      
      
      const sectionmain = await sect.findOne({_id:mainId});
      const filter = {_id:sectionmain.workspace};
      const updateDoc = {
        $push:{
          sections:mainId,
        }
      }
      const section = await workspace.findOneAndUpdate(filter,updateDoc);
  
      socket.to(id).emit("getSections",({section:sectionmain,user:data.user}));
      callback({status:true,section:sectionmain});
    }
    catch(err){
      callback({status:false,error:err});
    }
  })
  socket.on('updatesection',async(data,callback)=>{
    const {sectId} = data;
    
    const sect = Sections();
    try{
      const filter = {_id:new ObjectId(sectId)};
      const updateDoc = {
        $set:data.changes
      }
      
      const section = await sect.updateOne(filter,updateDoc);
      io.to(data.workid).emit("getWorkspaces",({hello:"hello"}));
      
      
    }
    catch(err){
      console.log(err);
    }
  })
  socket.on('deletesection',async(data)=>{
    const {workspaceId,sectId} = data;
    const sect = Sections();
  const tasks = Tasks();
  const worksp = Workspaces();
  try{
    await tasks.deleteMany({section: new ObjectId(sectId)});
    await sect.deleteOne({_id:new ObjectId(sectId)});
   const result =  await worksp.findOneAndUpdate({_id:new ObjectId(workspaceId)},
  {$pull:{sections:new ObjectId(sectId)}});
  console.log(result);
  io.to(workspaceId).emit("removesection",({sectId:sectId}));
  }
  catch(err){
   console.log(err);
  }
  })
}