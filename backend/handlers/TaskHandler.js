const { ObjectId } = require("mongodb");
const {
  Workspaces,
  Sections,
  Tasks,
} = require("../connectDB/allCollections");

module.exports = (socket,io)=>{
  socket.on('createtask',async(data,callback)=>{
    const {sectionId,user,id} = data;
    
    const sect = Sections();
    const tasker = Tasks();
    try{
      const section = await sect.findOne({_id:new ObjectId(sectionId)});
      const cursor = await tasker.find({section:new ObjectId(sectionId)}).count();
      const task = await tasker.insertOne({
          section: new ObjectId(sectionId),
          position:cursor>0?cursor:0,
          title:"",
          content:"",
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by:user,
          updated_by:user,
      });
      const T = await tasker.findOne({_id:task.insertedId});
      
      
      const result = await sect.updateOne({_id:section._id},{
        $push:{
          tasks:task.insertedId
        }
      });
     
      
      io.to(id).emit("addtask",({task:T}));
    callback({status:true,task:T});
    }
    catch(err){
     callback({status:false,error:err});
    }
  })
  socket.on('updateposition',async(data,callback)=>{
    const {
      resourceList,
      destinationList,
      resourceSectionId,
      destinationSectionId,
      workspaceId
    } = data;
    
    const tasker = Tasks();
    const resourceListRev = resourceList.reverse();
    const destinationListRev = destinationList.reverse();
    try{
      if(resourceSectionId!==destinationSectionId){
        for(let key=0;key<resourceListRev.length;key++){
          
          const result = await tasker.findOneAndUpdate({_id:new ObjectId(resourceListRev[key]._id)},
          {$set:{
            section:new ObjectId(resourceSectionId),
            position:key,
            updated_at:Date.now(),
  
          }})
          console.log(result);
        }
      }
      for (let key = 0; key < destinationListRev.length; key++) {
        await tasker.findOneAndUpdate({_id:new ObjectId(destinationListRev[key]._id)},
          {$set:{
            section:new ObjectId(destinationSectionId),
            position:key,
          }})
        
      }
      // callback({status:true});
      socket.to(workspaceId).emit("getWorkspaces",{hello:"hello"})
    }
    catch(err){
      console.log({status:false,error:err});
    }
  })
  socket.on('deleteTask',async(data,callback)=>{
    const {taskId,boardId} = data;
  const tasker = Tasks();
  try{
    const curr = await tasker.findOne({_id:new ObjectId(taskId)});
    await tasker.deleteOne({_id:new ObjectId(taskId)});  
    const cursor = await tasker.find({section : curr.section}).sort({'position':1});
    const tasks = await cursor.toArray();
    for(let key=0;key<tasks.length;key++){
      await tasker.findOneAndUpdate({_id:tasks[key]._id},
      {$set:{position:key}});
    }
    socket.to(boardId).emit("deleteit",(data));
  }
  catch(err){
    console.log({status:false,error:err});
  }
  })
  socket.on("updatetask",async(data,callback)=>{
    const {taskId,workspaceId,changes} = data;
  const tasker = Tasks();
  try{
    const task = await tasker.findOneAndUpdate({_id:new ObjectId(taskId)},
  {$set:changes});
  callback({status:true,task:task});
  }
  catch(err){
    callback({status:false,error:err});
  }
  })
  socket.on("sendData",(data)=>{
    // console.log(data);
    socket.to(data.boardId).emit("haveData",data);
  })
}