
import { cn } from '@/lib/utils';
import { LucideIcon, MoreHorizontal, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DropdownMenuContent, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ItemProps {
  Id?:string;
  documentIcon?:string;
  label:string;
  onClick?: ()=>void;
   icon: LucideIcon;
   active?:boolean;
   expanded?:boolean;
   level?:number;
   isSearch?:boolean;
   onExpand?:()=>void;
   onArchive?:()=>void;
  
   
}

function Item({
  Id,
  active,isSearch,onArchive,
  label,onClick, icon:Icon
}:ItemProps) {
  const user = useSelector((state:RootState)=>state.user);
  return (
    <div
    onClick={onClick}
    role='button'
    className={cn('group min-h-[27px] text-sm py-1 my-1 pr-3 w-full hover:bg-neutral-200 rounded flex items-center text-muted-foreground font-medium',
    active && "bg-slate-300 text-semibold"
    )}
    >
          
       <Icon className='shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground'
      />
            <span className='truncate'> 
            {label}
            </span>

      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100'>
          <span className=''>CTRL</span>K
        </kbd>
      )}
      {!!Id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu >
            <DropdownMenuTrigger asChild  onClick={(e) => e.stopPropagation()}>
              <div className="opacity-0 group-hover:opacity-100 ml-auto h-full rounded-sm
              hover:bg-neutral-300 dark:hover:bg-neutral-600" role="button">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 ml-auto bg-white dark:bg-slate-900" align="start" side="right" >
              <DropdownMenuItem  onClick={onArchive}>
                <Trash className="w-4 h-4 mr-2"/>
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <div className="text-xs p-2">
                Last edited by: {user?.name}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export default Item
