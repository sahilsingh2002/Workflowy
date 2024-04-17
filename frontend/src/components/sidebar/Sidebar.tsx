import { ChevronDownIcon, ChevronsLeft, File, MenuIcon,  Search, Settings } from 'lucide-react'
import {ElementRef, useRef, useState, useEffect, useCallback} from 'react'
import {useMediaQuery} from 'usehooks-ts';

// import {DragDropContext, Draggable,Droppable} from 'react-beautiful-dnd'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'



import UserItem from '../useritem/UserItem';

import { cn } from "@/lib/utils"
import Item from "../item/Item"


import axios from "axios"
import { useSelector,useDispatch } from "react-redux"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate, useParams } from "react-router-dom"


import { toast } from 'sonner';
import { setWork } from "@/redux/slices/workspaceSlice"
import { Button } from '../ui/button';


function Sidebar() {
  const [isDragging, setIsDragging] = useState(false);
  let { workspaceId } = useParams();
  const navigate = useNavigate();
  const [activeIndex,setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  
  const user = useSelector(state=>state.user);
  const workspace = useSelector(state=>state.workspace);
 
  const dispatch = useDispatch();
  

 
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
 

  


useEffect(()=>{
  if(isMobile) collapse();
  else resetWidth();
},[isMobile]);
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
      event.preventDefault();
      event.stopPropagation();
      isResizingRef.current = true;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  const handleMouseMove = (event:MouseEvent) =>{
    if(!isResizingRef.current) return;
    let newWidth = event.clientX;
    if(newWidth<240) newWidth = 240;
    if(newWidth >480) newWidth = 480;
    if(sidebarRef.current && navbarRef.current){
      sidebarRef.current.style.width = newWidth + "px";
      navbarRef.current.style.width = newWidth + "px";
     
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100%-${newWidth}px)`);
    }
     
  }

  const handleMouseUp = ()=>{
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  const resetWidth = ()=>{
    if(sidebarRef.current && navbarRef.current){
      setIsCollapsed(false);
      setIsResetting(true);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("width", isMobile ?"0":"Calc(100%-480px)");
      navbarRef.current.style.setProperty("left", isMobile ? "100%":"240px");
      setTimeout(()=>setIsResetting(false),300);
    }
  }
   const collapse = ()=>{
    if(sidebarRef.current && navbarRef.current){
      setIsCollapsed(true);
      setIsResetting(true);
      sidebarRef.current.style.width="0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(()=>setIsResetting(false),300);
    }
   }

  
 
   const getWork = async()=>{
    const sendReqConfig = {
      method:"GET",
      url:`/api/workspace/getworkspaces?username=${user.username}`,
    }
    try{
      const result = await axios(sendReqConfig);
      console.log(result);
      dispatch(setWork([...result.data]));
      
      
      
      
    }
    catch(err){
      console.log("Error : ",err);
    }
  }
  useEffect(()=>{
    
    getWork();
    
  },[]);
  useEffect(()=>{
    const updateActive = (listWork:[])=>{
      const activeItem = listWork.findIndex(e=>e._id===workspaceId);
      if(listWork.length>0 && workspaceId===undefined){
        navigate(`/workspace/${listWork[0]._id}`);
      }
      console.log(activeItem,listWork,workspaceId);
      setActiveIndex(activeItem);
    }
    updateActive(workspace.value);
  },[workspace.value,workspaceId,navigate]);
  
  
  
 
   const handleCreate = async()=>{
    setLoading(true);
    const sendReqConfig = {
      method:"POST",
      url:"/api/workspace/add",
      data:{
        username:user.username,
      }
    }
    try {
      const result = await axios(sendReqConfig);

   
      
      toast.success("Workspace created successfully");
      const newList = [result?.data.board,...workspace.value];
      dispatch(setWork(newList));
     

      // getWork();
      navigate(`/workspace/${result.data.board._id}`)
    } catch (error) {
      toast.error("Failed to create workspace");
    } finally {
      setLoading(false);
    }
   }
   
   const onDragEnd = async ({source,destination})=>{
    setIsDragging(false);
    const newList = [...workspace.value];
    const [removed] = newList.splice(source.index,1);
    newList.splice(destination.index,0,removed);

    const activeItem = newList.findIndex(e=>e._id===workspaceId);
    setActiveIndex(activeItem);
    dispatch(setWork(newList));
    try{
      const sendReqConfig = {
        method:"PATCH",
        url:`/api/workspace/`,
        data:{
          workspaces:newList,
        }
      }
      const result = await axios(sendReqConfig);
      console.log(result);
    }
    catch(err){
      console.log("Error : ",err);
    }

   }
   console.log(activeIndex);
   
   const debounce = (func, delay) => {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const debouncedHandleDragEnd = useCallback(
    debounce(onDragEnd, 300),
    [workspace]
  );
  const handleDragStart = () => {
    setIsDragging(true);
  };
  return (
    <div className={`relative h-screen ${isCollapsed ? "w-0":"w-fit"}  bg-white dark:bg-slate-900  dark:text-white `}>

    <aside ref={sidebarRef} id="sidebar"  className={cn(
          "group/sidebar h-screen bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}>
      <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
      <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6 " />
        </div>
        <div>
        <UserItem/>
          <Item
          label='search'
          icon={Search}
          isSearch
          onClick={()=>{}}/>
          <Item
          label='settings'
          icon={Settings}
          
          onClick={()=>{}}/>
         <>


         <p className='text-sm font-medium text-muted-foreground/80 flex justify-between items-center gap-2'>
          <span className='flex gap-2'>
          <File/>pages
          </span>
          <Button variant={"ghost"} onClick={handleCreate}>
          <ChevronDownIcon/>
          </Button>
          </p>
   <p className={cn(`hidden text-sm font-medium text-muted-foreground/80 last:block`)}>
        No pages available
      </p>



    
      <DragDropContext onDragEnd = {onDragEnd} onDragStart={handleDragStart}>
     

     
        <Droppable key = {'list-workspace-droppable'} droppableId = {'list-workspace-droppable'}>
          {(provided)=>(
            <div ref = {provided.innerRef} {...provided.droppableProps}>
              {
                workspace.value.map((item,index)=>(
                  <Draggable key = {item._id} draggableId = {item._id} index = {index}>
                    {(provided,snapshot)=>(
                      <div  onClick={() => {
                       
                        navigate(`/workspace/${item._id}`);
                      }} ref = {provided.innerRef}{...provided.dragHandleProps}{...provided.draggableProps} className={`${index==activeIndex && 'bg-slate-400 dark:bg-slate-600'} pl-[20px] ${snapshot.isDragging?'cursor-grab':'cursor-pointer!important'} py-2  w-full hover:bg-neutral-400 dark:hover:bg-neutral-500  flex items-center text-sm font-medium text-muted-foreground/80`}>
                        {item.icon} {item.name}
                      </div>
                    )}
                  </Draggable>
                ))
              }
              {provided.placeholder}
            </div>
          )}

        </Droppable>
        
       
      </DragDropContext>
   
     
    </>
        </div>
        
      </div>
      <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
    </aside>
    <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
          </nav>
      </div>
  </div>
  )
}

export default Sidebar