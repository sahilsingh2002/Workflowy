
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import React from 'react'
interface ItemProps {
  Id?:string;
  documentIcon?:string;
  label:string;
  onClick: ()=>void;
   icon: LucideIcon;
   active?:boolean;
   expanded?:boolean;
   level?:number;
   isSearch?:boolean;
   onExpand?:()=>void;
  
   
}

function Item({
  Id,
  active,documentIcon,isSearch,level = 0,onExpand, expanded,
  label,onClick, icon:Icon
}:ItemProps) {
  return (
    <div
    onClick={onClick}
    role='button'
    style={{paddingLeft: level?`${(level*12)+12}px`:"12px"}}
    className={cn('group min-h-[27px] text-sm py-1 my-1 pr-3 w-full hover:bg-neutral-200 rounded flex items-center text-muted-foreground font-medium',
    active && "bg-slate-300 text-semibold"
    )}
    >
      {!!Id && (
        <div role='button' className='h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1' onClick={()=>{}}>
          {expanded?<ChevronDown className='h-4 w-4 shrink-0'/>:<ChevronRight className='h-4 w-4 shrink-0'/>}
        </div>
        
      )}
      {documentIcon?(
        <div className='shrink-0 mr-2 text-[18px]'>
          {documentIcon}
        </div>
      ):(
        
        <Icon className='shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground'
        />
      )}
        <span className='truncate'> 
      {label}
      </span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100'>
          <span className=''>CTRL</span>K
        </kbd>
      )}
    </div>
  )
}

export default Item
