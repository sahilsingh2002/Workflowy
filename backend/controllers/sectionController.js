// section schema : board:objectId ref board required, title: string,untitled
const { ObjectId } = require("mongodb");
const { Sections, Tasks } = require("../connectDB/allCollections");

module.exports.create = async(req,res)=>{
  const id = req.query.id;
  const sect = Sections();
  try{
    const result = await sect.insertOne({
      title:"untitled",
      workspace:new ObjectId(id),
      tasks:[],
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    res.status(201).json({status:true,section:result});
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
      $set:{
        title:req.body.title,
        description:req.body.description,
        updated_at: Date.now(),
        tasks:[],
      }
    }
    const section = sect.updateOne(filter,updateDoc);
    res.status(200).json(section);
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}

module.exports.deleter = async(req,res)=>{
  const sectId = req.query.id;
  const sect = Sections();
  const tasks = Tasks();
  try{
    await tasks.deleteMany({section: new ObjectId(sectId)});
    await sect.deleteOne({_id:new ObjectId(sectId)});
    res.status(202).json('deleted');
  }
  catch(err){
    res.status(500).json({status:false,error:err});
  }
}
