import Sidebar from '@/components/sidebar/Sidebar'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import {Divider, Textarea} from "@nextui-org/react";

import { Star, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import {Picker} from 'emoji-mart';
import { TiStarFullOutline } from "react-icons/ti";
function Workspaces() {
  const {workspaceId} = useParams();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [icon, setIcon] = useState('');
  useEffect(()=>{
    const handleGetpage = async(id)=>{
      
        const sendReqConfig = {
          method:"GET",
          url:`/api/workspace/getPage?id=${id}`,
      }
        try {
          const result = await axios(sendReqConfig);
          console.log(result);
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
    
   },[]);
  return (<>
      <Sidebar/>
    <div className='flex flex-col w-full mx-5'>

   
      <div className='flex  justify-between w-[100%]'>
        <Button variant = {"ghost"} size={'icon'} className='rounded-full'>
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
      <div>
        <Textarea  placeholder='Untitled' value={title} minRows={1} className='w-full h-fit p-0 border-0 text-[2rem]  resize-none   border-neutral-300' />
      </div>
      <div>
        <Textarea isMultiline value={description}   placeholder='Add A Description'  className='w-full p-0 border-0 font-semibold text-[0.8rem] resize-none border-neutral-300' />
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