import { Modal, ModalContent, ModalBody, useDisclosure, Textarea, Divider } from "@nextui-org/react";
import {  useEffect, useState, useRef } from 'react';

import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
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
import { setWork } from "@/redux/slices/workspaceSlice";
import { useSocket } from "@/context/SocketContext";

interface DescriptionModalInterface {
  titled:string;
  description:string;
  currRole: "owner" | "editor" | "reader" | null;
  boardId:string | undefined;
  setColl:(setcol:boolean)=>void;
}
const timeOut = 500;
let timer: string | number | NodeJS.Timeout | undefined;


function DescriptionModal({setColl, boardId, titled, description, currRole }:DescriptionModalInterface) {
  const {socket} = useSocket();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [desc, setDesc] = useState(description);
  const [title, setTitle] = useState(titled);
  const workspaces = useSelector((state: RootState) => state.workspace.value);
  const dispatch = useDispatch();
  const editorRef = useRef(null);


  useEffect(() => {
    setDesc(description);
    setTitle(titled);
  }, [titled, description]);
useEffect(() => {
  if(socket){
    socket.on("getnewContent",(data)=>{
      setDesc(data.content);
    })
  }
},[socket]);
  const updateDescription = async (newDesc: string) => {
   
    clearTimeout(timer);
     timer = setTimeout(async () => {
      try {
        socket?.emit('update',{id:boardId, changes:{content:newDesc}},(response: { status: boolean; message?: string; })=>{
          if(response.status){
             console.log(response);

          }
          else{
            console.error('Error creating workspace:', response.message);
          }
        });
        setDesc(newDesc);
        const temp = [...workspaces];
        const index = temp.findIndex(e => e._id === boardId);
        temp[index] = { ...temp[index], content: newDesc };
        dispatch(setWork(temp));
      } catch (err) {
        console.error(err);
      }
    }, timeOut);
  };

  const onOpenChanger = () => {
    onOpenChange();
    setColl(false);
  };


  const onOpener = () => {
    onOpen();
    setColl(true);
  };

  return (
    <>
      <Button onClick={onOpener} variant={"outline"} className="mx-5 dark:bg-[#161a1d] dark:border-[#1C2025] dark:hover:bg-[#22272b]">Description</Button>
      <Modal placement="center" scrollBehavior="outside" size="full" className="dark:text-white flex z-[9999999]" backdrop="blur" radius="lg" isOpen={isOpen} onOpenChange={onOpenChanger}>
        <ModalContent>
          {() => (
            <>
              <ModalBody
                className="border border-black rounded-lg dark:bg-[#1C2025] dark:text-[#9EADAC]"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex flex-col py-[2rem] px-[5rem]">
                  <Textarea
                    placeholder='Untitled'
                    value={title}
                    
                    disabled
                    minRows={1}
                    className='w-full h-fit p-0 border-0 text-[2rem] resize-none border-neutral-300'
                  />
                </div>
                <Divider />
                <div className="flex-1 w-full h-[calc(100vh-6rem)] overflow-x-hidden overflow-y-auto">
                  {currRole === 'reader' ? (
                    <FroalaEditorView
                      config={{
                        placeholderText: "Start Writing",
                      }}
                      model={desc}
                    />
                  ) : (
                    <FroalaEditor
                      ref={editorRef}
                      config={{
                        placeholderText: "Start Writing",
                        saveInterval: 100,
                        imageUploadParam: 'filename',
                        imageUploadURL: '/api/workspace/upload_image',
                        imageUploadMethod: 'POST',
                        imageUploadParams: { id: 'filename' },
                        imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                        events: {
                          'contentChanged': function () {
                            const newContent:string = this.html.get();
                            setDesc(newContent);
                            updateDescription(newContent);
                          },
                          'image.error': function (error: { code: number, message:string }) {
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
                      model={desc}
                      onModelChange={(newDesc: string) => {
                        setDesc(newDesc);
                      }}
                    />
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DescriptionModal;
