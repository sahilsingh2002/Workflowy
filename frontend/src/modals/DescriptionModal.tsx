import { Modal, ModalContent, ModalBody, useDisclosure, Textarea, Divider } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState, useRef, useMemo } from 'react';
import axios from "axios";
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


const timeOut = 500;
let timer;

function DescriptionModal({setColl, boardId, titled, description, isOpened, onClose, currRole }) {
  const user = useSelector((state: RootState) => state.user);

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

  const updateDescription = async (newDesc) => {
   

    setTimeout(async () => {
      try {
        socket.emit('update',{id:boardId, changes:{content:newDesc}},(response)=>{
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
    }, 50);
  };

  const onOpenChanger = () => {
    onOpenChange();
    setColl(false);
  };

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
            socket.emit('update',{id:workspaceId, changes:{name:newTitle}},(response)=>{
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

  const onOpener = () => {
    onOpen();
    setColl(true);
  };

  return (
    <>
      <Button onClick={onOpener} variant={"outline"} className="mx-5 dark:bg-[#161a1d] dark:border-[#1C2025] dark:hover:bg-[#22272b]">Description</Button>
      <Modal placement="center" scrollBehavior="outside" size="full" className="dark:text-white flex z-[9999999]" backdrop="blur" radius="lg" isOpen={isOpen} onOpenChange={onOpenChanger}>
        <ModalContent>
          {(onCloser) => (
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
                        imageUploadURL: '/api/workspace/:workspaceId/tasks/upload_image',
                        imageUploadMethod: 'POST',
                        imageUploadParams: { id: 'filename' },
                        imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                        events: {
                          'contentChanged': function () {
                            const newContent = this.html.get();
                            setDesc(newContent);
                            updateDescription(newContent);
                          },
                          'image.removed': function ($img) {
                            console.log($img);
                          },
                          'image.beforeUpload': function (images) {
                            console.log("uploading");
                          },
                          'image.uploaded': function (response) {
                            console.log(response);
                          },
                          'image.inserted': function ($img, response) {
                            console.log($img, response);
                          },
                          'image.error': function (error, response) {
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
                      onModelChange={(newDesc) => {
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
