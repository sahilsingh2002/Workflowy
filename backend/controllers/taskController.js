// schema : section:objectId, ref section requ, title: string, def :"", content : string,def: "", pos : type:num
const { ObjectId } = require('mongodb');
const {Tasks,Sections} = require('../connectDB/allCollections');

const {getStorage,ref,getDownloadURL,uploadBytesResumable,deleteObject,refFromURL} = require("firebase/storage")

module.exports.createTask = async(req,res)=>{
  const sectionId = req.query.id
  const {user} = req.body
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
    
    const result = await sect.findOneAndUpdate({_id:section._id},{
      $push:{
        tasks:task.insertedId
      }
    });
    res.status(201).json({status:true,task:T});
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}
module.exports.update = async(req,res)=>{
  const {taskId} = req.params;
  const {user} = req.body;
  const tasker = Tasks();
  try{
    const task = await tasker.findOneAndUpdate({_id:new ObjectId(taskId)},
  {$set:req.body});
  res.status(200).json({status:true,task:task});
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}

module.exports.deleter = async(req,res)=>{
  const {taskId} = req.params;
  const tasker = Tasks();
  try{
    const curr = await tasker.findOne({_id:new ObjectId(taskId)});
    await tasker.deleteOne({_id:new ObjectId(taskId)});  
    const cursor = await tasker.find({section : curr.section}).sort('position');
    const tasks = await cursor.toArray();
    for(let key=0;key<tasks.length;key++){
      await tasker.findOneAndUpdate({_id:tasks[key]._id},
      {$set:{position:key}});
    }

    res.status(202).json('deleted');
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}
const giveCurrentDateTime = ()=>{
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+' '+time;
  return dateTime;
}
module.exports.updatePosition = async(req,res)=>{
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId
  } = req.body;
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
    res.status(200).json({status:true});
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }

}
module.exports.uploadImage = async(req,res)=>{
  try {
    const storage = getStorage();
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage,`files/${req.file.originalname +"------" + dateTime}`);
     const metadata = {
      contentType:req.file.mimetype,
     };
     const snapshot = await uploadBytesResumable(storageRef,req.file.buffer,metadata);
     const downloadURL = await getDownloadURL(snapshot.ref);
     console.log('File successfully uploaded');

     return res.send({link:downloadURL});
  } catch (err) {
    return res.status(400).send({err:err.message});
  }
}
module.exports.deleteImage = async(req,res)=>{
  try{
    const storage = getStorage();
   
  }
  catch (err) {
    return res.status(400).send({err:err.message});
  }
}
  
