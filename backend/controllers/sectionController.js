// section schema : board:objectId ref board required, title: string,untitled
const { ObjectId } = require("mongodb");
const { Sections, Tasks, Workspaces } = require("../connectDB/allCollections");

module.exports.create = async(req,res)=>{
  const id = req.params.workspaceId;
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

    res.status(201).json({status:true,section:sectionmain});
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}

module.exports.update = async(req,res)=>{
  const sectId = req.query.id;
  const sect = Sections();
  try{
    const filter = {_id:new ObjectId(sectId)};
    const updateDoc = {
      $set:req.body
    }
    console.log(updateDoc);
    
    const section = await sect.updateOne(filter,updateDoc);
    res.status(200).json(section);
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}

module.exports.deleter = async(req,res)=>{
  const sectId = req.query.id;
  const {workspaceId} = req.params;
  const sect = Sections();
  const tasks = Tasks();
  const worksp = Workspaces();
  try{
    await tasks.deleteMany({section: new ObjectId(sectId)});
    await sect.deleteOne({_id:new ObjectId(sectId)});
   const result =  await worksp.findOneAndUpdate({_id:new ObjectId(workspaceId)},
  {$pull:{sections:new ObjectId(sectId)}});
  console.log(result);
    res.status(202).json('deleted');
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}
