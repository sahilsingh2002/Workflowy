const { ObjectId } = require("mongodb");
const {
  User,
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
  
      callback({status:true,section:sectionmain});
    }
    catch(err){
      callback({status:false,error:err});
    }
  })
}