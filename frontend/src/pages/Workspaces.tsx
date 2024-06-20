import Sidebar from '@/components/sidebar/Sidebar'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Textarea} from "@nextui-org/react";
import { Trash, UserPlus } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegStar,FaStar  } from "react-icons/fa6";
import Picker from '@/components/emoji-picker/Picker';
import { useDispatch, useSelector } from 'react-redux';
import { setWork } from '@/redux/slices/workspaceSlice';
import { setFav } from '@/redux/slices/favouriteSlice';
import Kanban from '@/components/sections/Kanban';
import { RootState } from '@/redux/store';
import { changeRole } from '@/redux/slices/userSlice';
import ShareModal from '@/modals/ShareModal';
import DescriptionModal from '@/modals/DescriptionModal';
import { useSocket } from '@/context/SocketContext';


function Workspaces() {
  const {socket} = useSocket();
  let timer:ReturnType<typeof setTimeout>;
  const navigate = useNavigate();
  const [access,setAccess] = useState(false);
  const dispatch = useDispatch();
  const {workspaceId} = useParams();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [icon, setIcon] = useState('');
  const [share,setShare]= useState(false);
  const [isOpen,setIsOpen] = useState(false);
  const [coll,setColl] = useState(false);
  const workspaces = useSelector((state:RootState)=>state.workspace.value);
  const favlist = useSelector((state:RootState)=>state.favourite.value);
  const user = useSelector((state:RootState)=>state.user);
  

  
  
  const handleGetpage = async(id:string)=>{
    console.log("here");
    
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
        
      } catch (error) {
        console.log("Error : ",error);
        
        // navigate(`/workspace/`)
      }
   }
  useEffect(()=>{
    const makenewTitle = (data)=>{

      console.log(data);
      setTitle(data.name);
    }
    const makenewIcon = (data)=>{
      console.log(data);
      setIcon(data.icon);
    }
    const getWorkspaces = (data)=>{
      console.log(data);
      handleGetpage(workspaceId);
    }
     socket?.on('makenewTitle',makenewTitle)
    socket?.on('getnewIcon',makenewIcon)
    socket?.on('getWorkspaces',getWorkspaces);
     socket?.emit('getroom',workspaceId);
     
    return ()=>{
      socket?.emit('leaveroom',workspaceId);
      socket?.off('makenewTitle',makenewTitle);
      socket?.off('getnewIcon',makenewIcon);
      socket?.off('getWorkspaces',getWorkspaces);
    
    }
   },[workspaceId,socket]);
   
   const updateTitle = async(e:ChangeEvent<HTMLInputElement>)=>{
    
    clearTimeout(timer);
    const newTitle = e.target.value;
    // socket?.emit('setNewTitle',{title:newTitle,id:workspaceId});
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
        // timer = setTimeout(async()=>{
          // const sendReqConfig = {
          //   method:"PUT",
          //   url:`/api/workspace/update?id=${workspaceId}`,
          //   data:{
          //     id:workspaceId,
          //    changes:{ name:newTitle},
          //    }
             
          //  }
           try{
            console.log(socket);
            //  const result = await axios(sendReqConfig);
            socket?.emit('update',{id:workspaceId, changes:{name:newTitle}},(response)=>{
              if(response.status){
                 console.log(response);

              }
              else{
                console.error('Error creating workspace:', response.message);
              }
            });
           }
         catch(err){
           console.log(err);
         }
        // },timeout);
   }
   const onIconChange = async(newIcon:string)=>{
    const temp = [...workspaces];
    const index = temp.findIndex(e=>e._id === workspaceId);
    temp[index]={...temp[index], icon: newIcon}
    // if(isFav){
    //   const tempfav = [...favlist];
    // const favindex = tempfav.findIndex(e=>e._id === workspaceId);
    // tempfav[favindex]={...tempfav[favindex], icon: newIcon}
    // dispatch(setFav(tempfav));
    // }
    dispatch(setWork(temp));
     
      try{
        socket?.emit('update',{id:workspaceId, changes:{icon:newIcon}},(response)=>{
          if(response.status){
             console.log(response);

          }
          else{
            console.error('Error creating workspace:', response.message);
          }
        });
       
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
      <Sidebar modal={coll}/>
    <div className='flex flex-col w-full mx-5 overflow-hidden '>

   {
    user.role==='owner' && 
      <div className='flex justify-end w-[100%]'>
        
        <Button variant = {"ghost"} size={'icon'} className='rounded-full dark:hover:bg-[#22272b] ' onClick={addFav}>
          {
            !isFav?(
              <FaRegStar className='h-5 w-5 '/>
            ):(

              <FaStar className='h-5 w-5'/>
            )
          }
        </Button>
        <div>

        <Button color='black' variant={"ghost"} size={"icon"} className='rounded-full dark:hover:bg-[#22272b]' onClick={deleteWork}>
          <Trash className='h-5 w-5'/>
        </Button>
        <Button color='black' variant={"ghost"} size={"icon"} className='rounded-full dark:hover:bg-[#22272b]' onClick={()=>{setShare(true)}}>
        <UserPlus className='h-5 w-5'/>
        </Button>
       
        </div>
      </div>
   }
      <div className='py-[10px]'>
          <Picker icon={icon} onChange = {onIconChange}/>
      <div className='lg:flex lg:items-center'>
        <Textarea onChange={updateTitle} disabled={user.role==='reader'} placeholder='Untitled' value={title} minRows={1} className=' w-full h-fit p-0 border-0 text-[2rem] lg:text-[3rem]  resize-none   border-neutral-300' />
        <DescriptionModal setColl = {setColl} currRole={user.role} boardId={workspaceId} isOpened={isOpen} description={description} onClose={()=>setIsOpen(false)} titled={title}/>
      </div>
      </div>
      <div >
        <Kanban datar={sections} boardeId={workspaceId}/>
      </div>
      </div>
      <div>
        <ShareModal currRole={user.role} share = {share} onClose = {()=>{setShare(false)}} boardId={workspaceId}/>
      </div>
      </>:<>
      "no path"
      <Button onClick={()=>{navigate("/home")}}> return to Home</Button>
      </>}
      </>
  )
}

export default Workspaces