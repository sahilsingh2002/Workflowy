import Sidebar from '@/components/sidebar/Sidebar'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import {Divider, Textarea} from "@nextui-org/react";

import { Star, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import {Picker} from 'emoji-mart';
import { TiStarFullOutline } from "react-icons/ti";
import Picker from '@/components/emoji-picker/Picker';
import { useDispatch, useSelector } from 'react-redux';
import { setWork } from '@/redux/slices/workspaceSlice';
import { setFav } from '@/redux/slices/favouriteSlice';
function Workspaces() {
  let timer;
  const timeout = 500;
  const dispatch = useDispatch();
  const {workspaceId} = useParams();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [icon, setIcon] = useState('');
  
  const workspaces = useSelector(state=>state.workspace.value);
  const favlist = useSelector(state=>state.favourite.value);
  
  useEffect(()=>{
    const handleGetpage = async(id:string)=>{
      
        const sendReqConfig = {
          method:"GET",
          url:`/api/workspace/getPage?id=${id}`,
      }
        try {
          const result = await axios(sendReqConfig);

          console.log("res",result);
          setTitle(result?.data?.page?.result?.name);
          setDescription(result?.data?.page?.result?.content);
          setSections(result?.data?.page?.result?.sections);
          setIcon(result?.data?.page?.result?.icon);
          setIsFav(result?.data?.page?.result?.favourite);
        } catch (error) {
          console.log("Error : ",error);
        }
     }
     handleGetpage(workspaceId);
    
   },[workspaceId]);

   const updateTitle =async(e)=>{
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
   const updateDescription = async(e)=>{
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
    if(isFav){
      const tempfav = [...favlist];
    const favindex = tempfav.findIndex(e=>e._id === workspaceId);
    tempfav[favindex]={...tempfav[favindex], favourite: !isFav}
    dispatch(setFav(tempfav));
    }
    setIsFav(!isFav);
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
        const result = await axios(sendReqConfig);
        console.log(result);
       
      }
    catch(err){
      console.log(err);
    }
  }
  return (<>
      <Sidebar/>
    <div className='flex flex-col w-full mx-5'>

   
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
        <Button color='black' variant={"ghost"} size={"icon"} className='rounded-full'>
          <Trash className='h-5 w-5'/>
        </Button>
      </div>
      <div className='py-[10px] px-[50px]'>
          {/*emoji picker */}
          <Picker icon={icon} onChange = {onIconChange}/>
      <div>
        <Textarea onChange={updateTitle} placeholder='Untitled' value={title} minRows={1} className='w-full h-fit p-0 border-0 text-[2rem]  resize-none   border-neutral-300' />
      </div>
      <div>
        <Textarea isMultiline value={description} onChange={updateDescription}  placeholder='Add A Description'  className='w-full p-0 border-0 font-semibold text-[0.8rem] resize-none border-neutral-300' />
      </div>
      </div>
      <div>
        <div className='flex items-center justify-between py-3'>
          <Button variant={"ghost"}>
            Add Section
          </Button>
        <div className='text-sm font-[700]'>
          {sections.length} sections
        </div>
        </div>
        <Divider orientation='horizontal' className='margin-[10px]'/>
        {/* kanban */}
       
      </div>
      </div>
      
      </>
  )
}

export default Workspaces