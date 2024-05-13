const { ObjectId } = require("mongodb");
const {
  User,
  Workspaces,
  Sections,
  Tasks,
} = require("../connectDB/allCollections");



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
    console.log("req",req.id);
    const cursor = await workspace
      .find({ perms:{$elemMatch:{id: new ObjectId(req.id)}}})
      .sort({position:1});
    const workspaceIds = await cursor.toArray();
    console.log("work",workspaceIds);

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
    const result = await workspace.findOne({perms:{$elemMatch:{id: new ObjectId(req.id)}}, _id: new ObjectId(id) });
    console.log("result",result);

    if (!result) return res.status(404).json({status:false,message:"board not found"});
    
    const cursor = await sectioner.find({ workspace: new ObjectId(id) });
    const sections = await cursor.toArray();

    console.log("sections",sections);
    if (sections) {
      for (const section of sections) {
        const cursor = await tasker
          .find({ section: section._id }).sort("-position");

          const tasks = await cursor.toArray();
          section.tasks = tasks;
      //   section = tasks;
      }
      result.sections = sections;
      
      
    }
    const role = await result.perms.find(perms=>perms.id.equals(new ObjectId(req.id)));
    
    

    res.status(200).json({ status: true, page: { result }, roles:role.role });
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
      console.log(result);
      
      
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
    if (title === "") req.body.title = "Untitled";
    if (description === "") req.body.description = "Add description here";
    const currWorkspace = await workspace.findOne({ _id: new ObjectId(id) });

    if (!currWorkspace) return res.status(404).json("board not found");
    if (favourite !== undefined && currWorkspace.favourite !== favourite) {
      const favourites = await workspace.find({
        perms:{$elemMatch:{id: currWorkspace.owner, role:'owner'}},
        favourite: true,
        _id: { $ne: id },
      }).sort('favpos');
      // const favourites = await cursor.toArray();
      const count = await favourites.toArray();

      if (favourite) {
        console.log("here");
      } else {
        console.log(count.length);

        for (let key = 0; key < count.length; key++) {
          const element = count[key];
          console.log(element._id);
          const filt = { _id: element._id };
          const updateDoc = {
            $set: {
              favpos: key,
            },
          };
          const ans = await workspace.updateOne(filt, updateDoc);
        }
      }
    }

    const filter = { _id: currWorkspace._id };
    const updateDocument = {
      $set: {
        name: title,
        content: description,
        favourite: favourite,
        icon: icon,
        favpos: favpos,
      },
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
    console.log(favourites);

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
      console.log(worksp);
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
  console.log(user);
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
    const workspaces = Workspaces();
    try{
        const cursor = await sect.find({workspace:new ObjectId(id)});
        const sections = await cursor.toArray();
        for(const section of sections){
            await sect.deleteMany({_id:section._id});
        }
        await sect.deleteMany({workspace:new ObjectId(id)});
        console.log("id",id);
        const currWork = await workspaces.findOne({_id:new ObjectId(id)});
        console.log(currWork);
        if(currWork.favourite){
          const favourites = await workspaces.find({
            perms:{$elemMatch:{id: currWork.owner, role:'owner'}},
            favourite: true,
            _id: { $ne: id },
          }).sort('favpos');
          const count = favourites.toArray();
          for (let key = 0; key < count.length; key++) {
            const element = count[key];
            console.log(element._id);
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
      console.log(result);
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
      console.log(result);
      res.status(200).json({ result: result });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "An error occurred" });
  }
  
}
