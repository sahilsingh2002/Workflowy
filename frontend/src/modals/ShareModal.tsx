import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input'
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import axios from 'axios';
import { useEffect, useState } from 'react';


function ShareModal({ onClose, boardId, share, currRole }) {
  const { isOpen } = useDisclosure();
  const timeout = 500;
  const [users, setUsers] = useState([]);
  const [timer, setTimer] = useState(null);
  const [search,setSearch] = useState('');

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
          setUsers(result.data.hello);
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
            <ModalBody className="border border-black">
              <div className="flex items-center justify-start w-[100%]">
                <Input
                  placeholder="Search Username..."
                  className="m-4"
                  onChange={(e) => { setSearch(e.target.value) }}
                />
                </div>
                <Popover open>
                  <PopoverTrigger></PopoverTrigger>

                  <PopoverContent className='z-[99999]'>
                   
                    {users?.map((user)=>(
                      <div>
                        jkl
                      </div>
                    )

                    )}
                  </PopoverContent>

                </Popover>
              
            </ModalBody>
        </ModalContent>
      </Modal>
  );
}

export default ShareModal;
