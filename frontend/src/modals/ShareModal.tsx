import { Input } from '@/components/ui/input'
import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import {Listbox, ListboxItem} from "@nextui-org/react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Select, SelectItem} from "@nextui-org/react";
import { FaShare } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface UserInterface {
  _id:string;
  username:string;
  name:string;
}
interface ShareModalInterface{
  onClose:()=>void;
  boardId:string;
  share:boolean;
}


function ShareModal({ onClose, boardId, share }:ShareModalInterface) {
  const user = useSelector((state:RootState)=>state.user);
  const timeout = 500;
  const [users, setUsers] = useState([]);
  let timer: string | number | NodeJS.Timeout | undefined;
  const [search,setSearch] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const putUser = async(userid: string,username: string)=>{
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
    const searchUsers =  (search:string,username:string | null=user.username ) => {
      console.log(search);
  
      clearTimeout(timer);
  
      timer = setTimeout(async () => {
        const sendReqConfig = {
          method: "POST",
          url: '/api/workspace/finduser',
          data: { user: search,
            username:username,
           }
        };
        try {
          const result = await axios(sendReqConfig);
          console.log(result);
          if(!search || search.length===0){
            setUsers([]);
            
          }
          else{

           const newArr = result.data.hello;
          


            setUsers(newArr);
          }
        } catch (err) {
          console.log(err, "err occurred");
        }
      }, timeout);
  
    };
    searchUsers(search);
  },[search]);


  return (
      <Modal backdrop="blur" placement='center' isOpen={share} onClose={onClose}>
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
                    {users && users?.map((user:UserInterface)=>(
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
