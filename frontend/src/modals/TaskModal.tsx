
import {Modal, ModalContent, ModalBody, useDisclosure, Textarea, Divider} from "@nextui-org/react"
import { Trash } from "lucide-react";
import  { useEffect, useRef, useState } from 'react'
import Moment from 'moment'
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import JoditEditor from 'jodit-react';
import { RootState } from "@/redux/store";

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        simpleUpload: {
            // The URL that the images are uploaded to.
            uploadUrl: 'YOUR_UPLOAD_URL',

            // Enable the XMLHttpRequest.withCredentials property.
            withCredentials: false,

            // Headers sent along with the XMLHttpRequest to the upload server.
            headers: {
                // Example header
                'X-CSRF-TOKEN': 'CSRF-Token',
            }
        }
    } )
    .catch( error => {
        console.error( error );
    } );

let timer;
const timeOut = 500;
let isModalClosed = false;
function TaskModal({boardId,tasks, onClose,onUpdate,onDelete, currRole}) {
  const user = useSelector((state:RootState)=>state.user);
  const {isOpen, onOpen} = useDisclosure();
  const [task, setTask] = useState(tasks);
  const [title,setTitle] = useState('');
  const [content, setContent] = useState("");
  
  
  useEffect(()=>{
    setTask(tasks);
    setTitle(tasks!==undefined?tasks.title:'');
    setContent(tasks!==undefined?tasks.content:'');
  },[tasks]);
  console.log(tasks);
  const onCloser =()=> {
    isModalClosed = true;

    onUpdate(task);
    onClose();
  }

  const deleteTask = async()=>{
    const sendReqConfig = {
      method:"DELETE",
      url:`/api/workspace/${boardId}/tasks/${task._id}`,
    }
    try{
      const result = await axios(sendReqConfig);
      onDelete(task);
      setTask(undefined);
    }
    catch(err){
      console.log(err);
    }
  }
  const updateTitle = async(e)=>{
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async()=>{
      const sendReqConfig = {
        method:"PUT",
        url:`/api/workspace/${boardId}/tasks/${task._id}`,
        data:{
          title:newTitle,
          updated_by:user.username
        }
      }
      try{
        const result = await axios(sendReqConfig);
        console.log("res",result);
       
       const newTask = task;
       newTask.updated_by = user.username;
      
       onUpdate(newTask);
      }
      catch(err){
        console.log(err);
      }

    },timeOut);
    task.title = newTitle;
    setTitle(newTitle);
    onUpdate(task);
  }
  const updateContent = async(e)=>{
    clearTimeout(timer);
    const ndata = e;
    console.log(e);
    if(!isModalClosed){

   
    
    timer = setTimeout(async()=>{
      const sendReqConfig = {
        method:"PUT",
        url:`/api/workspace/${boardId}/tasks/${task._id}`,
        data:{
          content:ndata,
          updated_by:user.username
        }
      }
      try{
        const result = await axios(sendReqConfig);
        console.log("res",result);
       
      }
      catch(err){
        console.log(err);
      }

    },timeOut);
    task.content = ndata;
    setContent(ndata);
    onUpdate(task);
  }
  }
  const editor = useRef(null);
  
  return (
    <>
  
   <Modal size="3xl" className="flex" backdrop="blur" isOpen={task !== undefined} onClose={onCloser}>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalBody className="border border-black" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-end w-[100%]">
            <Button size="icon" className="-mt-2 mx-3" disabled={currRole==='reader'} variant="ghost" onClick={deleteTask}>
              <Trash />
            </Button>
          </div>
          <div className="flex h-[100%] flex-col py-[2rem] px-[5rem]">
            <Textarea
              placeholder='Untitled'
              value={title}
              onChange={updateTitle}
              disabled={currRole==='reader'}
              minRows={1}
              className='w-full h-fit p-0 border-0 text-[2rem]  resize-none   border-neutral-300'
            />
          </div>
          <div className="font-semibold flex justify-between">
            {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            {task!== undefined ? <div>Last seen by : {task.updated_by}</div>:''}
          </div>
          <Divider />
          <div className="relative h-[80%] overflow-x-hidden overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
            <CKEditor id="ckeditor"
              editor={ClassicEditor}
              disabled={currRole==='reader'}
              data={content}
              onChange={updateContent}
              config={{
                toolbar: {
                  items: [
                    // Add other toolbar items here
                    'imageInsert', // This adds the image insert button to the toolbar
                  ],
                },
                image: {
                  toolbar: [
                    'imageTextAlternative',
                    'imageStyle:full',
                    'imageStyle:side',
                  ],
                },
             }}
              
            />
            {/* <JoditEditor
			ref={editor}
			value={content}
			onChange={(e)=>updateContent(e)}
		/> */}
           
          </div>
        </ModalBody>
      </>
    )}
  </ModalContent>
</Modal>

</>
   
  )
}

export default TaskModal