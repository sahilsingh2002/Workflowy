const { ObjectId } = require("mongodb");
const {
  User,
  Workspaces,
  Sections,
  Tasks,
} = require("../connectDB/allCollections");
const {getStorage,ref,getDownloadURL,uploadBytesResumable,deleteObject,refFromURL} = require("firebase/storage")



// boards : user : objectId(ref - user), icon:string, default : 📃,  title:string default:untitled, description string, default: add description here, 🟢 you can add multiline desc. here., position : type:number, favourite L { type:boolean, def false} favpos type:number, default:0

module.exports.addWorkspace = async (req, res) => {
  const { username } = req.body;

  try {
    const workspace = Workspaces();
    const boardcount = await workspace.countDocuments();
    const position = boardcount > 0 ? boardcount : 0;

    const user = User();
    const userDetails = await user.findOne({ _id:new ObjectId(req.id) });

    const result = await workspace.insertOne({
      name: "untitled",
      sections: [],
      content: "add description here, 🟢 you can add multiline desc. here.",
      position: position,
      
      perms:[{id:userDetails?._id,role:'owner'}],
      icon: "1f4c3",
      favourite: false,
      favpos: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    const need = result.insertedId;

    const data = await workspace.findOne({ _id: need });

    res.status(201).json({ status: true, name: "untitled", board: data });
  } catch (err) {
    console.error("Error in making workspace:", err);
    return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
  }
};
module.exports.getWorkspaces = async (req, res) => {
  const { username } = req.query;
  try {
    const user = User();
    const workspace = Workspaces();
   
    const cursor = await workspace
      .find({ perms:{$elemMatch:{id: new ObjectId(req.id)}}})
      .sort({position:1});
    const workspaceIds = await cursor.toArray();
    

    res.status(200).json(workspaceIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports.getOnepage = async (req, res) => {
  const id = req.query.id;
  const user = req.id;
  

  const workspace = Workspaces();
  const sectioner = Sections();
  const tasker = Tasks();
  try {
    
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(id),
          perms: {
            $elemMatch: {
              id: new ObjectId(user)
            }
          }
        }
      },
      {
        $lookup: {
          from: "section",
          localField: "_id",
          foreignField: "workspace",
          as: "sections"
        }
      },
      {
        $unwind: {
          path: "$sections",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "task",
          localField: "sections._id",
          foreignField: "section",
          as: "sections.tasks"
        }
      },
      {
      $set: {
        'sections.tasks': {
          $cond: {
            if: { $isArray: '$sections.tasks' },
            then: {
              $sortArray: {
                input: '$sections.tasks',
                sortBy: { position: -1 }
              }
            },
            else: null
          }
        }
      }
    },
      {
        $group: {
          _id: "$_id",
          details: {
            $first: "$$ROOT"
          },
          sections: {
            $push: "$sections"
          }
        }
      },
      {
        $set:{
          "details.sections":{
            $filter:{
              input:"$sections",
              as:"section",
              cond:{$ne:['$$section',{}]}
            }
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: "$details"
        }
      }
    ]
    const resultArray = await workspace.aggregate(pipeline);
    const resarr = await resultArray.toArray();
    const result = resarr[0];
    console.log("here",result);
    const role = await result?.perms?.find(perms=>perms.id.equals(new ObjectId(req.id)));
    res.status(200).json({ status: true, page: { result }, roles:role?.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports.updatePosition = async (req, res) => {
  const { workspaces } = req.body;
  const workspace = Workspaces();
  try {
    for (let key =0; key < workspaces.length;key++) {
      const worksp = workspaces[key];
      
     

      
      

      const result = await workspace.findOneAndUpdate({ _id: new ObjectId(worksp._id) },  
      {$set: {
        'position': key,
      },
    }
    );
     
      
      
    }
    res.status(200).json("updated");
  } catch (err) {
    console.error("Error in updatePosition:", err);
    return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
  }
};

module.exports.update = async (req, res) => {
  const id = req.query.id;

  const { title, description, favourite, favpos, icon } = req.body;

  const workspace = Workspaces();
  try {
    // if (title === "") req.body.title = "Untitled";
    // if (description === "") req.body.description = "Add description here";
    const currWorkspace = await workspace.findOne({ _id: new ObjectId(id) });

    if (!currWorkspace) return res.status(404).json("board not found");
   
    const filter = { _id: currWorkspace._id };
    const updateDocument = {
      $set: req.body,
    };
    const worksp = await workspace.updateOne(filter, updateDocument);

    res.status(200).json({ status: true, board: worksp });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
  }
};
module.exports.getFavorite = async (req, res) => {
  const workspace = Workspaces();
  try {
    
    const cursor = await workspace
      .find({ perms:{$elemMatch:{id: new ObjectId(req.id), role:'owner'}}, favourite: true })
      .sort({favpos:1});
    const favourites = await cursor.toArray();
    

    res.status(200).json({ favourites: favourites });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports.updateFavPos = async (req, res) => {
  const { workspaces } = req.body;
  const workspace = Workspaces();
  try {
    for (let key=0;key<workspaces.length;key++) {
      const worksp = workspaces[key];
      
      const filter = { _id: new ObjectId(worksp._id) };
      const updateDocument = {
        $set: {
          favpos: key,
        },
      };

      const result = await workspace.findOneAndUpdate(filter, updateDocument);
      
    }
    res.status(200).json("updated");
  } catch (err) {
    console.error("Error in updatePosition:", err);
    return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
  }
};
module.exports.searchUser = async(req,res)=>{
  const {user,username} = req.body;
  if(!user || user.length===0) return res.status(400);
 
  const workspaces = Workspaces();
  const usern = User();
  try{
    const result = await usern.find({
      $or:[
        {
          name:{
            $regex:user,
            $options:"i"
          },
        },
        {
          username:{
            $regex:user,
            $options:'i',
          }
        }
      ]
    });
    let arrRes = await result.toArray();
    const a = arrRes.filter(u=>u.username!==username);

    return res.status(200).json({hello:a});
  }
  catch (err) {
    console.error("Error in searching:", err);
    return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
  }
}
module.exports.removal = async (req, res) => {
    const id = req.query.id;
    const sect = Sections();
    const Task = Tasks();
    const workspaces = Workspaces();
    try{
        const cursor = await sect.find({workspace:new ObjectId(id)});
        const sections = await cursor.toArray();
        for(const section of sections){
            await Task.deleteMany({section:section._id});
        }
        await sect.deleteMany({workspace:new ObjectId(id)});
        
        const currWork = await workspaces.findOne({_id:new ObjectId(id)});
        
        if(currWork.favourite){
          const favourites = await workspaces.find({
            perms:{$elemMatch:{id: currWork.owner, role:'owner'}},
            favourite: true,
            _id: { $ne: id },
          }).sort('favpos');
          const count = favourites.toArray();
          for (let key = 0; key < count.length; key++) {
            const element = count[key];
           
            const filt = { _id: element._id };
            const updateDoc = {
              $set: {
                favpos: key,
              },
            };
            const ans = await workspaces.updateOne(filt, updateDoc);
          }
        }
        await workspaces.deleteOne({_id:new ObjectId(id)});
        const cursor2 = await workspaces.find({perms:{$elemMatch:{id: new ObjectId(req.id), role:'owner'}}}).sort('position');
        const work = await cursor2.toArray();

        for (const key in work) {
          const worksp = work[key];
         
          const filter = { _id: worksp._id };
          const updateDocument = {
            $set: {
              position: key,
            },
          };
    
          const result = await workspaces.updateOne(filter, updateDocument);
        }
        res.status(202).json({status:true,message:"workspace deleted"});
    }
    catch(err){
      return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
    }
};
module.exports.updateUser = async(req,res)=>{
  const { userid, role, boardId } = req.body;

  const workspace = Workspaces();
  try {
    const existingWorkspace = await workspace.findOne({_id: new ObjectId(boardId), 'perms.id': new ObjectId(userid)});
    
    if (existingWorkspace) {
      // ObjectId exists in the perms array, update the role
      const result = await workspace.findOneAndUpdate(
        {
          _id: new ObjectId(boardId),
          'perms.id': new ObjectId(userid)
        },
        {
          $set: { 'perms.$.role': role === null ? 'reader' : role }
        },
        { returnOriginal: false } // To return the updated document
      );
   
      res.status(200).json({ result: result });
    } else {
      // ObjectId doesn't exist in the perms array, push a new object
      const result = await workspace.findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        {
          $push: { perms: { id: new ObjectId(userid), role: role === null ? 'reader' : role } }
        },
        { returnOriginal: false } // To return the updated document
      );
     
      res.status(200).json({ result: result });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
  }
  
}
const giveCurrentDateTime = ()=>{
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date+' '+time;
  return dateTime;
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
