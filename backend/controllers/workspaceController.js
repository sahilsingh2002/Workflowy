const {User,Workspaces, Pages, Tasks} = require("../connectDB/allCollections");

module.exports.addWorkspace = async(req,res)=>{
    const {username,parentId} = req.body;
   
    try{
        const workspace = Workspaces();
        const user = User();
        const userDetails = await user.findOne({username:username});
        
        
        const result = await workspace.insertOne({name:"untitled",content:"",owner:userDetails?._id,isArchived:false,isPublished:false,parentId:parentId,created_at:Date.now()});
        const response = await user.updateOne(
            {_id:userDetails._id},
        {$push:{"workspaces":result.insertedId}});
        
        res.status(201).json({status:true,name:"untitled"});
        
    }
   
    catch (err) {
        console.error("Error in making workspace:", err);
            return res.status(500).json({ status: false, message: "An error occurred" });
          }
}
module.exports.getWorkspaces = async (req, res) => {
    const { username } = req.body;
    try {
        const user = User();
        const workspace = Workspaces();
        const userDetails = await user.findOne({ username: username });
        const workspaceIds = userDetails.workspaces;

        var allnames = [];
        await Promise.all(workspaceIds.map(async (id) => {
            const work = await workspace.findOne({ _id: id, isArchived: false }); // Filter by _id and isArchived
            if (work) {
                const data = { name: work.name, id: work._id };
                allnames.push(data);
            }
        }));
        console.log(allnames);
        res.status(200).json({ status: true, workspacer: allnames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

module.exports.getOnepage = async(req,res)=>{
    const id = req.body.id;
    console.log(id);
    const workspace = Workspaces();
    try {
        const result = await workspace.findOne({_id:id});
        console.log(result);
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