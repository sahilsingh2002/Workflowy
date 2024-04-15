
import {
  Avatar,
  AvatarImage
} from '@/components/ui/avatar';

import axios from 'axios';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useSelector } from 'react-redux';
import { ChevronsLeftRight } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';

function UserItem() {
  const user = useSelector((state) =>state.user);
  const Logout = async()=>{
    const sendReqConfig = {
      method:"GET",
      url:"/api/logout",
      
    }
  try{
      const result = await axios(sendReqConfig);
      window.location.reload();
  }
  catch(err){
    console.log("Error : ",err);
  }
   }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
<div role='button' className='flex items-center text-sm p-3 w-full hover:bg-slate-100 dark:hover:bg-slate-700'>
<div className='gap-x-2 flex items-center max-w-[150px'>
  <Avatar className='h-8 w-8'>
    <AvatarImage src="https://github.com/shadcn.png" alt='avatar'/>
  </Avatar>
  <span className='text-start font-semibold text-[15px] line-clamp-1'>
    {user?.name}&apos;s Workflowy 
  </span>
</div>
<ChevronsLeftRight className='rotate-90 ml-2 text-muted-foreground h-4 w-4'/>
</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align='start' alignOffset={11} forceMount>
        <div className='flex flex-col space-y-4 p-2'>
          <p className='text-xs font-medium leading-none text-muted-foreground'>
            {user?.email}
          </p>
          <div className='flex items-center justify-between gap-x-2'>
            <div className='rounnded-md flex gap-2 bg-secondary p-1'>
              <Avatar className='h-8 w-8'>
              <AvatarImage src="https://github.com/shadcn.png" alt='avatar'/>
              </Avatar>
            <div className='space-y-1'>
              <p className='tex-sm line-clamp-1'>
                {user?.name}&apos;s Workflowy
              </p>
            </div>
            </div>
        <div>
          <ModeToggle/>
        </div>
          </div>
        </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild className='w-full cursor-pointer text-muted-foreground'>
          <div onClick={Logout}>Log Out</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserItem