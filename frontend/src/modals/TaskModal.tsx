import { Modal, ModalContent, ModalBody, useDisclosure, Textarea, Divider } from "@nextui-org/react";

import { Trash } from "lucide-react";
import  { useEffect, useState } from 'react'
import Moment from 'moment'

import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import FroalaEditor from 'react-froala-wysiwyg'

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/themes/dark.min.css';
import 'froala-editor/css/themes/royal.min.css';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/save.min.js';
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

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
      setTask(null);
      onCloser();
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
    isModalClosed = false;
    clearTimeout(timer);

    const ndata = e;
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

  

  
  return (
    <>
  
   <Modal size="3xl" className="flex" backdrop="blur" radius="lg" isOpen={task !== undefined } onClose={onCloser}>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalBody className="border border-black rounded-lg dark:bg-[#1C2025] dark:text-[#9EADAC]"   onClick={e=>e.stopPropagation()}>
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
            {task !== undefined ? Moment(task?.updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''}
            {task!== undefined ? <div>Last updated by : {task?.updated_by}</div>:''}
          </div>
          <Divider />
          <div className="relative h-52 overflow-x-hidden overflow-y-auto" >
            {/* <CKEditor id="ckeditor"
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
              
            /> */}
          {currRole==='reader'?
           <FroalaEditorView
           
           
            config={{
            

            placeholderText:"Start Writing",
            
           
          
            
            
           }}
           
          
           model={content}
           

           />
           :
           <FroalaEditor
           
           
           
           
           config={{
            // theme: "dark",
            
            
            

            placeholderText:"Start Writing",
           
            saveInterval:100,
            
            imageUploadParam: 'filename',
            imageUploadURL: '/api/workspace/:workspaceId/tasks/upload_image',
            imageUploadMethod: 'POST',
            imageUploadParams: {id: 'filename'},
            imageAllowedTypes: ['jpeg', 'jpg', 'png'],
            events:{
              'image.removed': function ($img) {
                console.log($img);
              },
              "save.before":function(html:string){
                updateContent(html);
              },
              'image.beforeUpload': function (images) {
                console.log("uploading");
              },
              'image.uploaded': function (response) {
                console.log(response);
                
              },
              'image.inserted': function ($img, response) {
                console.log($img,response);
              },
              'image.error': function (error, response) {
                // Bad link.
                if (error.code == 1) { console.log("1",error) }
        
                // No link in upload response.
                else if (error.code == 2) { console.log("2",error) }
        
                // Error during image upload.
                else if (error.code == 3) { console.log("3",error) }
        
                // Parsing response failed.
                else if (error.code == 4) { console.log("4",error) }
        
                // Image too text-large.
                else if (error.code == 5) { console.log("5",error) }
        
                // Invalid image type.
                else if (error.code == 6) { console.log("6",error) }
        
                // Image can be uploaded only to same domain in IE 8 and IE 9.
                else if (error.code == 7) { console.log("7",error) }
             
              
             
            }
             
              
             
            }
           }}
           
          
           model={content}
           onModelChange={updateContent}

           />
}

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