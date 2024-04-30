import { Input } from '@/components/ui/input'
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'
import {Listbox, ListboxItem} from "@nextui-org/react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Select, SelectItem} from "@nextui-org/react";
import { FaShare } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


function ShareModal({ onClose, boardId, share, currRole }) {
  const { isOpen } = useDisclosure();
  const timeout = 500;
  const [users, setUsers] = useState([]);
  const [timer, setTimer] = useState(null);
  const [search,setSearch] = useState('');
  const [role, setRole] = useState(null);
  const putUser = async(userid,username)=>{
    const sendReqConfig = {
      method: "POST",
      url: '/api/workspace/filluser',
      data: { boardId: boardId, userid: userid,role:role }
    };
    try {
      const result = await axios(sendReqConfig);
      console.log(result);
      onClose();
      toast.success("shared the workspace with "+username);
    } catch (err) {
      toast.error("error while Sharing!");
      console.log(err, "err occurred");
    }
  }
  

  useEffect(()=>{
    const searchUsers =  (search:string) => {
      console.log(search);
  
      clearTimeout(timer);
  
      const newTimer = setTimeout(async () => {
        const sendReqConfig = {
          method: "POST",
          url: '/api/workspace/finduser',
          data: { user: search }
        };
        try {
          const result = await axios(sendReqConfig);
          console.log(result);
          if(!search || search.length===0){
            setUsers([]);
            
          }
          else{

            setUsers(result.data.hello);
          }
        } catch (err) {
          console.log(err, "err occurred");
        }
      }, timeout);
  
      setTimer(newTimer);
    };
    searchUsers(search);
  },[search]);


  return (
      <Modal backdrop="blur" isOpen={share} onClose={onClose}>
        <ModalContent>
            <ModalBody className="border border-black" >
              <div className="flex items-center justify-start w-[100%]">
                <Input
                  placeholder="Search Username..."
                  className="m-4"
                  onChange={(e) => { setSearch(e.target.value) }}
                />
                <Select className='max-w-xs' placeholder='select role' variant='underlined' onChange={(e)=>{setRole(e.target.value)}}>                  
          <SelectItem variant='bordered' className='bg-white hover:bg-slate-300' key="owner" value="owner">owner</SelectItem>
          <SelectItem variant='bordered' className='bg-white hover:bg-slate-300' key = "editor" value="editor">editor</SelectItem>
          <SelectItem variant='bordered' className='bg-white hover:bg-slate-300' key = "reader" value="reader">reader</SelectItem>
    </Select>
                </div>
                <Listbox >   
                    {users && users?.map((user)=>(
                      <ListboxItem key={user._id} className='z-[99999] cursor-pointer flex '>
                        <div className='flex justify-between items-center'>

                       
                        <div>
                          <p className='font-semibold'>
                        {user.username}
                          </p>
                          <p className='font-thin'>
                        {user.name}
                          </p>
                        </div>
                        <Button size={"icon"} variant={"outline"} onClick={()=>{putUser(user._id,user.username)}}>
                          <FaShare/>
                        </Button>
                        </div>
                      </ListboxItem>
                    )
                    )}
                </Listbox>
              
            </ModalBody>
        </ModalContent>
      </Modal>
  );
}

export default ShareModal;
