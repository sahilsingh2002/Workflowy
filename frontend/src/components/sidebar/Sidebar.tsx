import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings } from 'lucide-react'
import {ElementRef, useRef, useState, useEffect} from 'react'
import {useMediaQuery} from 'usehooks-ts';
import { useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import UserItem from '../useritem/UserItem';
import Item from '../item/Item';
import { toast } from 'sonner';

import axios from 'axios';
import { set } from 'react-hook-form';
function Sidebar() {
  const user = useSelector(state=>state.user);
  const [loading, setLoading] = useState(false);
  const [createResult, setCreateResult] = useState(null);

  const {pathname} = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [pages,setPages] = useState([]);


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
   
   const handleCreate = async()=>{
    setLoading(false);
    const sendReqConfig = {
      method:"POST",
      url:"/api/workspace/add",
      data:{
        username:user.username,
      }
    }
    try {
      const result = await axios(sendReqConfig);
      
      setCreateResult(result.data);
      toast.success("Workspace created successfully");
      getWork();
    } catch (error) {
      toast.error("Failed to create workspace");
    } finally {
      setLoading(false);
    }
   }

   const handleGetpage = async(id)=>{
    console.log(id);
      const sendReqConfig = {
        method:"POST",
        url:"/api/workspace/getPage",
        data:{
          id:id,
        }

      }
      try {
        const result = await axios(sendReqConfig);
        console.log(result);
      } catch (error) {
        console.log("Error : ",error);
      }
   }
   const getWork = async()=>{
     const sendReqConfig = {
       method:"POST",
       url:"/api/workspace/getworkspaces",
       data:{
         username:user.username,
       }
     }
     try{
       const result = await axios(sendReqConfig);
       const newPages = [...result?.data?.workspacer];
       setPages(newPages);
       console.log(result);
     }
     catch(err){
       console.log("Error : ",err);
     }
     
     
   }
   useEffect(()=>{
    getWork();
   },[]);
   useEffect(() => {
    if (loading) {
      toast.info("Creating workspace...");
    }
  }, [loading]);
  return (
    <div className={`relative h-screen ${isCollapsed ? "w-0":"w-fit"}  bg-white dark:bg-slate-900  dark:text-white `}>

    <aside ref={sidebarRef} id="sidebar"  className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
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
          <Item onClick = {handleCreate} label = "New page" icon = {PlusCircle}/>
        </div>
        <div>
          {pages.map(({name,id})=>(
            <div role='button' className='hover:bg-gray-200' onClick = {()=>handleGetpage(id)}>{name}</div>
          ))}
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