import { Modal, ModalContent, ModalBody, Textarea, Divider } from "@nextui-org/react";
import { Trash } from "lucide-react";
import {  SetStateAction, useEffect, useState } from 'react';
import Moment from 'moment';

import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/themes/dark.min.css';
import 'froala-editor/css/themes/royal.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/save.min.js';
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { useSocket } from "@/context/SocketContext";

interface Task{
  _id: string;
  section: string;
  position: number;
  title: string;
  content: string;
  updated_at?:number;
  created_at?:number;
  updated_by?:string | null;
  updatedAt?:number;
}
interface TaskModalInterface {
  boardId:string | undefined;
  currRole:"owner" | "editor" | "reader" | null;
  onClose:()=>void;
  tasks : Task | undefined;
  onUpdate:(task:Task | undefined)=>Promise<void>;
  onDelete:(task:Task | undefined)=>void;

}
let timer: string | number | NodeJS.Timeout | undefined;
const timeOut = 500;
let isModalClosed = false;

function TaskModal({ boardId, tasks, onClose, onUpdate, onDelete, currRole }:TaskModalInterface) {
  const user = useSelector((state: RootState) => state.user);
  const {socket} = useSocket();
 
  const [task, setTask] = useState<Task | undefined>(tasks);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState("");

  useEffect(() => {
    setTask(tasks);
    console.log(tasks);
    setTitle(tasks !== undefined ? tasks.title : '');
    setContent(tasks !== undefined ? tasks.content : '');
  }, [tasks]);
  useEffect(()=>{
    const getdata = (data:{task:Task,boardId:string})=>{

      setTask(data.task);
      setTitle(data.task !== undefined ? data.task.title : '');
    setContent(data.task !== undefined ? data.task.content : '');
    }
    const deleteit = (data:{boardId:string,taskId:string})=>{
      // TODO don't send task, only taskid
      if(task && task._id === data.taskId){
        onDelete(task);
        setTask(undefined);
        onCloser();
      }
    }
if(socket){
  socket.on("haveData",getdata);
  socket.on("deleteit",deleteit);

}
    return ()=>{
      if(socket){
        socket.off("haveData",getdata);
        socket.off("deleteit",deleteit);
      }
    }
  },[socket]);

  const onCloser = () => {
    isModalClosed = true;
    onUpdate(task);
    onClose();
  };

  const deleteTask = async () => {
    
    try {
      // const result = await axios(sendReqConfig);
      socket?.emit("deleteTask",({taskId:task?._id,boardId:boardId}))
      onDelete(task);
      setTask(undefined);
      onCloser();
    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async () => {
      // const sendReqConfig = {
      //   method: "PUT",
      //   url: `/api/workspace/${boardId}/tasks/${task._id}`,
      //   data: {
      //     title: newTitle,
      //     updated_by: user.username,
      //   },
      // };
      const changes = {
        title: newTitle,
        updated_by: user.username
      }
      try {
        socket?.emit("updatetask",({taskId:task?._id,workspaceId:boardId,changes:changes}),(response: { status: boolean; message?: string; })=>{
          if(response.status){
            
            const newTask = task;
            if(newTask){
              newTask.title = newTitle;
              newTask.updated_by = user.username;
            }
            setTask(newTask);
            onUpdate(newTask);
            socket?.emit("sendData",({task:newTask,boardId:boardId}));
          }
          else{
            console.error('Error updating task:', response.message);
          }
        });
        // const result = await axios(sendReqConfig);
        // console.log("res", result);

        // const newTask = { ...task, updated_by: user.username };
        // setTask(newTask);
        // onUpdate(newTask);

      } catch (err) {
        console.log(err);
      } 
    }, timeOut);
    const thisTask = task;
    if(thisTask){
      thisTask.title = newTitle;
    }
    setTask(thisTask);
    setTitle(newTitle);
  };

  const updateContent = async (newContent: string) => {
    isModalClosed = false;
    setTask(tasks);
    clearTimeout(timer);

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        // console.log(task);
        // const sendReqConfig = {
        //   method: "PUT",
        //   url: `/api/workspace/${boardId}/tasks/${task._id}`,
        //   data: {
        //     content: newContent,
        //     updated_by: user.username,
        //   },
        // };
        const changes = { 
          content: newContent,
          updated_by: user.username
        }
        try {
          socket?.emit("updatetask",({taskId:task?._id,workspaceId:boardId,changes:changes}),(response: { status: boolean; message?: string; })=>{
            if(response.status){
              
              const newTask = task;
              if(newTask){
                newTask.content = newContent;
                newTask.updated_by = user.username;
              }
              console.log(newTask);
              setTask(newTask);
              onUpdate(newTask);
              socket?.emit("sendData",({task:newTask,boardId:boardId}));
            }
            else{
              console.error('Error updating task:', response.message);
            }
          });
        } catch (err) {
          console.log(err);
        }
      
      }, timeOut);
      const thisTask = task;
      if(thisTask) thisTask.content = newContent; 
      setTask(thisTask);
      setContent(newContent);
      onUpdate(task);
    }
  };

  return (
    <>
      <Modal size="3xl" placement="center" className="flex dark:text-white" backdrop="blur" radius="lg" isOpen={tasks !== undefined} onClose={onCloser}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="border border-black rounded-lg dark:bg-[#1C2025] dark:text-[#9EADAC]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-end w-[100%]">
                  <Button size="icon" className="-mt-2 mx-3" disabled={currRole === 'reader'} variant="ghost" onClick={deleteTask}>
                    <Trash />
                  </Button>
                </div>
                <div className="flex h-[100%]  flex-col py-[2rem] px-[5rem]">
                  <Textarea
                    placeholder='Untitled'
                    value={title}
                    onChange={updateTitle}
                    disabled={currRole === 'reader'}
                    minRows={1}
                    className='w-full h-fit p-0 border-0 text-[2rem] resize-none border-neutral-300'
                  />
                </div>
                <div className="font-semibold flex justify-between">
                  {task !== undefined ? Moment(task?.updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''}
                  {task !== undefined ? <div>Last updated by: {task?.updated_by}</div> : ''}
                </div>
                <Divider />
                <div className="relative h-52 overflow-x-hidden overflow-y-auto">
                  {currRole === 'reader' ?
                    <FroalaEditorView
                      config={{ placeholderText: "Start Writing" }}
                      model={content}
                    />
                    :
                    <FroalaEditor
                      config={{
                        placeholderText: "Start Writing",
                        saveInterval: 100,
                        imageUploadParam: 'filename',
                        imageUploadURL: '/api/workspace/upload_image',
                        imageUploadMethod: 'POST',
                        imageUploadParams: { id: 'filename' },
                        imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                        events: {
                          // 'contentChanged': function () {
                          //   const newContent = this.html.get();
                          //   updateContent(newContent);
                          // },
                          
                          'image.error': function (error: { code: number; }, response: {message:string,code:number}) {
                            // Handle image errors here
                            if (error.code == 1) { console.log("1", error); }
                            else if (error.code == 2) { console.log("2", error); }
                            else if (error.code == 3) { console.log("3", error); }
                            else if (error.code == 4) { console.log("4", error); }
                            else if (error.code == 5) { console.log("5", error); }
                            else if (error.code == 6) { console.log("6", error); }
                            else if (error.code == 7) { console.log("7", error); }
                          }
                        }
                      }}
                      model={content}
                      onModelChange={(newContent: any) => updateContent(newContent)}
                    />
                  }
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default TaskModal;
