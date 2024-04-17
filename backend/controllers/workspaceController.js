const { ObjectId } = require("mongodb");
const {User,Workspaces, Sections, Tasks} = require("../connectDB/allCollections");

// boards : user : objectId(ref - user), icon:string, default : 📃,  title:string default:untitled, description string, default: add description here, 🟢 you can add multiline desc. here., position : type:number, favourite L { type:boolean, def false} favpos type:number, default:0 

module.exports.addWorkspace = async(req,res)=>{
    const {username,parentId} = req.body;
   
    try{
        const workspace = Workspaces();
        const boardcount = await workspace.countDocuments();
        const position = boardcount>0?boardcount:0;
        
       
        const user = User();
        const userDetails = await user.findOne({username:username});
        
        
        const result = await workspace.insertOne({name:"untitled",sections:[],content:"add description here, 🟢 you can add multiline desc. here.",position:position,owner:userDetails?._id,icon:"📃",favourite:false,favpos:0,created_at:Date.now()});
        const need = result.insertedId;
        console.log(need);
        const data = await workspace.findOne({_id:need});

        
        res.status(201).json({status:true,name:"untitled",board:data});
        
    }
   
    catch (err) {
        console.error("Error in making workspace:", err);
            return res.status(500).json({ status: false, message: "An error occurred" });
          }
}
module.exports.getWorkspaces = async (req, res) => {
    const { username } = req.query;
    try {
        const user = User();
        const workspace = Workspaces();
        const userDetails = await user.findOne({ username: username });
        const cursor = await workspace.find({ owner: userDetails?._id }).sort('-position');
        const workspaceIds = await cursor.toArray();
       console.log(workspaceIds);

        var allnames = [];
        await Promise.all(workspaceIds.map(async (work) => {
            
                const data = { name: work.name, id: work._id };
                allnames.push(data);
            
        }));
        console.log(allnames);
        res.status(200).json(workspaceIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

module.exports.getOnepage = async(req,res)=>{
    const id = req.query.id;
    
    const workspace = Workspaces();
    const sectioner = Sections();
    const tasker = Tasks();
    try {
        const result = await workspace.findOne({ _id: new ObjectId(id) });
        console.log(result);
        if(!result) return res.status(404).json("board not found");
        const sections = await sectioner.findOne({workspace:id});
        if(sections){

            for(const section of sections){
                const tasks = await tasker.find({section:section._id}).populate('section').sort('-position');
                section = tasks;
            }
            result.sections = sections;
        }
        
         
        res.status(200).json({status:true,page:{result}});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }

}
module.exports.archive = async(req,res)=>{
    const id = req.body.id;
    console.log("id", id);
    const workspace = Workspaces();
    try {
        
        const result = await workspace.findOneAndUpdate({"_id":id},
        {"$set":{"isArchived":true}});
        console.log("res",result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
        
    }
}
module.exports.updatePosition = async(req,res)=>{
    const { workspaces} = req.body;
    const workspace = Workspaces();
    try{
        for(const key in workspaces.reverse()){
            const worksp = workspaces[key];
            const filter = { _id: worksp._id };
            const updateDocument = {
                $set: {
                    position:key,
                },
             };
           
           const result =  await workspace.updateOne(filter, updateDocument);
        }
        res.status(200).json('updated');
    }
    catch(err){
        console.error("Error in updatePosition:", err);
        return res.status(500).json({ status: false, message: "An error occurred" });
    }
}
module.exports.update = async(req,res)=>{
    const {id} = req.params;
    const {title,description, favourite} = req.body;
    const workspace = Workspaces();
    try {
        if(title ==='') req.body.title = 'Untitled';
        if(description ==='') req.body.description = 'Add description here';
        const currWorkspace = await workspace.findOne({_id:id});
        if(!currWorkspace) return res.status(404).json("board not found");
        if(favourite!==undefined && currWorkspace.favourite!==favourite){
            const cursor = await workspace.find({owner:currWorkspace.owner,favourite:true,_id:{$ne:id}})
            const favourites = await cursor.toArray();
            if(favourite) req.body.favpos = favourites.length>0?favouritecount:0;
            else{
                for(const key in favourites){
                    const element = favourites[key];
                    await element.update({
                        favpos:key
                    })
                }
            }
        } 
        const worksp = await workspace.findOneAndUpdate({_id:id},
        {"$set":req.body})
        res.status(200).json({status:true,board:worksp});
    } catch (error) {
        return res.status(500).json({ status: false, message: "An error occurred" });
    }
}