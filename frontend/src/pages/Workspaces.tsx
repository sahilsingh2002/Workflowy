import Sidebar from '@/components/sidebar/Sidebar'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Textarea} from "@nextui-org/react";
import { Share, Star, Trash, UserPlus } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { TiStarFullOutline } from "react-icons/ti";
import Picker from '@/components/emoji-picker/Picker';
import { useDispatch, useSelector } from 'react-redux';
import { setWork } from '@/redux/slices/workspaceSlice';
import { setFav } from '@/redux/slices/favouriteSlice';
import Kanban from '@/components/sections/Kanban';
import { RootState } from '@/redux/store';
import { changeRole } from '@/redux/slices/userSlice';
import ShareModal from '@/modals/ShareModal';
function Workspaces() {
  let timer:ReturnType<typeof setTimeout>;
  const navigate = useNavigate();
  const [access,setAccess] = useState(false);
  const timeout = 500;
  const dispatch = useDispatch();
  const {workspaceId} = useParams();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [icon, setIcon] = useState('');
  const [share,setShare]= useState(false);
  
  const workspaces = useSelector((state:RootState)=>state.workspace.value);
  const favlist = useSelector((state:RootState)=>state.favourite.value);
  const user = useSelector((state:RootState)=>state.user);
  
  
  useEffect(()=>{
    const handleGetpage = async(id:string)=>{
      
        const sendReqConfig = {
          method:"GET",
          url:`/api/workspace/getPage?id=${id}`,
      }
        try {
          const result = await axios(sendReqConfig);

          console.log("res",result);

          if(result.data.status===false){
          
            navigate('/home');
          }
          setTitle(result?.data?.page?.result?.name);
          setDescription(result?.data?.page?.result?.content);
          setSections(result?.data?.page?.result?.sections);
          setIcon(result?.data?.page?.result?.icon);
          setIsFav(result?.data?.page?.result?.favourite);
          setAccess(true);
          dispatch(changeRole(result?.data?.roles));
          console.log(result?.data.roles);
        } catch (error) {
          console.log("Error : ",error);
          
          // navigate(`/workspace/`)
        }
     }
     handleGetpage(workspaceId?workspaceId:'');
    
   },[workspaceId,navigate,dispatch]);

   const updateTitle = async(e:ChangeEvent<HTMLInputElement>)=>{
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);
    const temp = [...workspaces];
        const index = temp.findIndex(e=>e._id === workspaceId);
        temp[index]={...temp[index], name: newTitle}
        if(isFav){
          const tempfav = [...favlist];
        const favindex = tempfav.findIndex(e=>e._id === workspaceId);
        tempfav[favindex]={...tempfav[favindex], name: newTitle}
        dispatch(setFav(tempfav));
        }

        dispatch(setWork(temp));
        timer = setTimeout(async()=>{
          const sendReqConfig = {
            method:"PUT",
            url:`/api/workspace/update?id=${workspaceId}`,
            data:{
              title:newTitle,
              description,
              favourite:isFav,
              icon,
              favpos:temp[index].favpos,
             }
             
           }
           try{
             const result = await axios(sendReqConfig);
             console.log(result);
            
           }
         catch(err){
           console.log(err);
         }
        },timeout);
   }
   const updateDescription = async(e:ChangeEvent<HTMLInputElement>)=>{
    clearTimeout(timer);
    const newDesc = e.target.value;
    setDescription(newDesc);
    
    const temp = [...workspaces];
        const index = temp.findIndex(e=>e._id === workspaceId);
        temp[index]={...temp[index], content: newDesc}
        if(isFav){
          const tempfav = [...favlist];
        const favindex = tempfav.findIndex(e=>e._id === workspaceId);
        tempfav[favindex]={...tempfav[favindex], content: newDesc}
        dispatch(setFav(tempfav));
        }
        dispatch(setWork(temp));
        timer = setTimeout(async()=>{
          const sendReqConfig = {
            method:"PUT",
            url:`/api/workspace/update?id=${workspaceId}`,
            data:{
              title,
              description:newDesc,
              favourite:isFav,
              icon,
              favpos:temp[index].favpos,
             }
             
           }
           try{
             const result = await axios(sendReqConfig);
             console.log(result);
            
           }
         catch(err){
           console.log(err);
         }
        },timeout);
   }
   const onIconChange = async(newIcon:string)=>{
    const temp = [...workspaces];
    const index = temp.findIndex(e=>e._id === workspaceId);
    temp[index]={...temp[index], icon: newIcon}
    if(isFav){
      const tempfav = [...favlist];
    const favindex = tempfav.findIndex(e=>e._id === workspaceId);
    tempfav[favindex]={...tempfav[favindex], icon: newIcon}
    dispatch(setFav(tempfav));
    }
    dispatch(setWork(temp));
     const sendReqConfig = {
       method:"PUT",
       url:`/api/workspace/update?id=${workspaceId}`,
       data:{
         title,
         description,
         favourite:isFav,
         icon:newIcon,
         favpos:temp[index].favpos,
        }
        
      }
      try{
        const result = await axios(sendReqConfig);
        console.log(result);
       
      }
    catch(err){
      console.log(err);
    }
  }
   const addFav = async()=>{
    
   
    const temp = [...workspaces];
    const index = temp.findIndex(e=>e._id === workspaceId);
    temp[index]={...temp[index],favourite: !isFav}
    
    dispatch(setWork(temp));
     const sendReqConfig = {
       method:"PUT",
       url:`/api/workspace/update?id=${workspaceId}`,
       data:{
         title,
         description,
         favourite:!isFav,
         icon,
         favpos:temp[index].favpos,
        }

        
      }
      try{
        const faved = temp[index];
        const result = await axios(sendReqConfig);
        let newFav = [...favlist];
        if(isFav){
          newFav = newFav.filter(e=>e._id!==workspaceId);
        }
        else{
          console.log("asdas");
          newFav.unshift(faved);
        }
        console.log(result);
        dispatch(setFav(newFav));
        setIsFav(!isFav);
      }
    catch(err){
      console.log(err);
    }
  }
  const deleteWork = async()=>{
    const sendReqConfig = {
      method:"DELETE",
      url:`/api/workspace?id=${workspaceId}`,
    }
    try{
      const result = await axios(sendReqConfig);
      if(isFav){
        const newFavList = favlist.filter(e=>e._id!== workspaceId);
        dispatch(setFav(newFavList));
      }
      const newList = workspaces.filter(e=>e._id!== workspaceId);
      if(newList.length===0){
      navigate('/home');
      }
      else{
        navigate(`/workspace/${newList[0]._id}`);
      }
      console.log(result);
      dispatch(setWork(newList));
    }
    catch(err){
      console.log(err);
    }
  }
  console.log(user);
  return (<>

  {access ?<>
      <Sidebar/>
    <div className='flex flex-col w-[92%] mx-5'>

   {
    user.role==='owner' && 
      <div className='flex  justify-between w-[100%]'>
        
        <Button variant = {"ghost"} size={'icon'} className='rounded-full' onClick={addFav}>
          {
            !isFav?(
              <Star color='black' className='h-5 w-5 '/>
            ):(

              <TiStarFullOutline color='black' className='h-5 w-5'/>
            )
          }
        </Button>
        <div>

        <Button color='black' variant={"ghost"} size={"icon"} className='rounded-full' onClick={deleteWork}>
          <Trash className='h-5 w-5'/>
        </Button>
        <Button color='black' variant={"ghost"} size={"icon"} className='rounded-full' onClick={()=>{setShare(true)}}>
        <UserPlus className='h-5 w-5'/>
        </Button>
       
        </div>
      </div>
   }
      <div className='py-[10px]'>
          <Picker icon={icon} onChange = {onIconChange}/>
      <div>
        <Textarea onChange={updateTitle} disabled={user.role==='reader'} placeholder='Untitled' value={title} minRows={1} className='w-full h-fit p-0 border-0 text-[2rem]  resize-none   border-neutral-300' />
      </div>
      <div>
        <Textarea isMultiline value={description} disabled={user.role==='reader'} onChange={updateDescription}  placeholder='Add A Description'  className='w-full p-0 border-0 font-semibold text-[0.8rem] resize-none border-neutral-300' />
      </div>
      </div>
      <div>
        <Kanban datar={sections} boardeId={workspaceId}/>
      </div>
      <div>
        <ShareModal currRole={user.role} share = {share} onClose = {()=>{setShare(false)}} boardId={workspaceId}/>
      </div>
      </div>
      </>:<>
      "no path"
      <Button onClick={()=>{navigate("/home")}}> return to Home</Button>
      </>}
      </>
  )
}

export default Workspaces