import { ChevronDownIcon, ChevronsLeft, File, MenuIcon,  Search, Settings } from 'lucide-react'
import {ElementRef, useRef, useState, useEffect} from 'react'
import {useMediaQuery} from 'usehooks-ts';

import {DragDropContext, Draggable, Droppable, OnDragEndResponder} from 'react-beautiful-dnd'
import {Skeleton} from "@nextui-org/react";



import UserItem from '../useritem/UserItem';

import { cn } from "@/lib/utils"
import Item from "../item/Item"


import axios from "axios"
import { useSelector,useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"


import { toast } from 'sonner';
import { ContentDataArray, setWork } from "@/redux/slices/workspaceSlice"
import { Button } from '../ui/button';
import { Emoji } from 'emoji-picker-react';
import Favourites from '../favourites/Favourites';
import { RootState } from '@/redux/store';
import LoadingSpinner from '../LoadingSpinner';

import { useSocket } from '@/context/SocketContext';



function Sidebar({modal}:{modal:boolean}) {
  const {socket,disconnectSocket} = useSocket();
  const [workLoad, setWorkLoad] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [activeIndex,setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  
  const user = useSelector((state:RootState)=>state.user);
  const workspace = useSelector((state:RootState)=>state.workspace);
 
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
 useEffect(() => {
  if(socket){

  
  socket.on('getWorkspaces', (data) => {
    getWork();
    console.log("here",data);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    toast.error('Socket connection error');
  });

  socket.on('disconnect', () => {
    console.warn('Socket disconnected');
    toast.error('Socket disconnected');
    disconnectSocket();
  });

  return () => {
    socket.off('getWorkspaces');
    socket.off('connect_error');
    socket.off('disconnect');
  };
}

}, [socket]);
 useEffect(()=>{

   if(modal){
    collapse();
   }
   else if(!isMobile){
    resetWidth();
   }
 },[modal]);
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
    const updateActive = (listWork:ContentDataArray)=>{
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
   
   const onDragEnd:OnDragEndResponder = async ({source,destination})=>{
    setIsDragging(false);
    setWorkLoad(true);
    const newList = [...workspace.value];
    if(destination && destination!==null){
      const [removed] = newList.splice(source.index,1);
      newList.splice(destination.index,0,removed);
    }
    

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
    finally{
      setWorkLoad(false);
    }

   }

   


  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleOnWorkspace=(roomid: string)=>{
    socket?.emit('getroom',roomid);
    navigate(`/workspace/${roomid}`);
  }
  
  return (
    
    <>
   
   {loading?
   <LoadingSpinner/>:
   <div className={`relative h-screen ${isCollapsed ? "w-0":"w-fit"}  bg-white dark:bg-[#1C2025] `}>
    <aside ref={sidebarRef} id="sidebar"  className={cn(
          "group/sidebar h-screen bg-secondary overflow-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}>
      <div className="flex h-full flex-col overflow-hidden border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-[#1C2025]">
      <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-[#E8F2FE] dark:hover:bg-[#4E77BA] absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6 " />
        </div>
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
         <Favourites/>
         <p className='text-sm font-medium text-muted-foreground/80 flex justify-between items-center gap-2'>
          <span className='flex gap-2'>
          <File/>pages
          </span>
          <Button variant={"ghost"} onClick={handleCreate}>
          <ChevronDownIcon/>
          </Button>
          </p>
        <div className='overflow-auto'>
         <>
   <p className={cn(`hidden text-sm font-medium text-muted-foreground/80 last:block`)}>
        No pages available
      </p>



         

          
      <DragDropContext onDragEnd = {onDragEnd} onDragStart={handleDragStart}>
     

          {!workLoad?
        <Droppable key = {'list-workspace-droppable'} droppableId = {'list-workspace-droppable'}>
          {(provided)=>(
            <div ref = {provided.innerRef} {...provided.droppableProps}>
              {
                workspace.value.map((item,index)=>(
                  
                  <Draggable key = {item._id} draggableId = {item._id} index = {index}>
                    {(provided,snapshot)=>(
                   
                      <div onClick={() => {
                       handleOnWorkspace(item._id);
                      }} ref = {provided.innerRef}{...provided.dragHandleProps}{...provided.draggableProps} className={`${index==activeIndex && 'bg-[#E8F2FE] text-[#0D66E5] dark:text-[#579dff] dark:bg-[#1c2b41]'} pl-[20px] ${snapshot.isDragging?'cursor-grab':'cursor-pointer!important'} py-2  w-full hover:bg-[#E8F2FE] dark:hover:bg-[#1c2b41] rounded-md  flex items-center text-sm font-medium text-muted-foreground/80`}>
                        <Emoji unified={item.icon} size={25}/>
                        <div className='mx-2'>
                         {item.name}
                        </div>
                      </div>
                    
                    )}
                  </Draggable>

                ))
              }
              {provided.placeholder}
            </div>
          )}

        </Droppable>
        :
        <LoadingSpinner/>
        }
        
       
      </DragDropContext>
      
   
     
    </>
        </div>
        
      </div>
      <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 hover:opacity-100 transition cursor-ew-resize absolute h-[100vh] w-2  bg-[#282e34] right-0 top-0 bottom-0"
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
            {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6" />}
          </nav>
      </div>
  </div>}
  </>
  )
}

export default Sidebar