
import {Modal, ModalContent, ModalBody, useDisclosure,Button, Textarea, Divider} from "@nextui-org/react"
import { Trash } from "lucide-react";
import React, { useEffect, useState } from 'react'
import Moment from 'moment'
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from "axios";

let timer;
const timeOut = 500;
let isModalClosed = false;
function TaskModal({boardId,tasks, onClose,onUpdate,onDelete}) {
  const {isOpen, onOpen} = useDisclosure();
  const [task, setTask] = useState(tasks);
  const [title,setTitle] = useState('');
  const [content, setContent] = useState('');
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
          title:newTitle
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
    task.title = newTitle;
    setTitle(newTitle);
    onUpdate(task);
  }
  const updateContent = async(event,editor)=>{
    clearTimeout(timer);
    const ndata = editor.getData();
    if(!isModalClosed){

   
    
    timer = setTimeout(async()=>{
      const sendReqConfig = {
        method:"PUT",
        url:`/api/workspace/${boardId}/tasks/${task._id}`,
        data:{
          content:ndata
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
  return (
    <>
  
   <Modal size="3xl" backdrop="blur" isOpen={task !== undefined} onClose={onCloser}>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalBody className="border border-black">
          <div className="flex items-center justify-end w-[100%]">
            <Button size="sm" variant="ghost" onPress={deleteTask}>
              <Trash />
            </Button>
          </div>
          <div className="flex h-[100%] flex-col py-[2rem] px-[5rem]">
            <Textarea
              placeholder='Untitled'
              value={title}
              onChange={updateTitle}
              minRows={1}
              className='w-full h-fit p-0 border-0 text-[2rem]  resize-none   border-neutral-300'
            />
          </div>
          <div className="font-semibold">
            {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
          </div>
          <Divider />
          <div className="relative h-[80%] overflow-x-hidden overflow-y-auto">
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onChange={updateContent}
              
            />
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