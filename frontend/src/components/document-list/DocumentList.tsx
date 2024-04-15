
import { cn } from "@/lib/utils"
import Item from "../item/Item"
import { FileIcon, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner';


function DocumentList() {
  const [loading, setLoading] = useState(false);
  const [createResult, setCreateResult] = useState(null);
  const user = useSelector(state=>state.user);
  const [pages,setPages] = useState([]);

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
      
    }
    catch(err){
      console.log("Error : ",err);
    }
  }
  useEffect(()=>{
   getWork();
  },[]);
  const Archived = async(id)=>{
    const sendReqConfig = {
      method:"POST",
      url:"/api/workspace/archive",
      data:{
        id:id,
      }
    }
    try{
      const result = await axios(sendReqConfig);
      console.log(result);
      getWork();
    }
    catch(err){
      console.log("Error : ",err);
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
  return (
    <>
   <p className={cn(`hidden text-sm font-medium text-muted-foreground/80 last:block`)}>
        No pages available
      </p>
     
      <DropdownMenu >
      <DropdownMenuTrigger className="w-full flex">Pages</DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">

      {pages.map(({name,id})=>(
            <DropdownMenuItem key={id} className='hover:bg-gray-200' onClick={()=>{handleGetpage(id)}}>
              <Item Id={id} label={name} icon={FileIcon} onArchive = {()=>{Archived(id)}}>
                </Item>
                </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
      <DropdownMenuSeparator/>

      <Item onClick = {handleCreate} label = "New page" icon = {PlusCircle}/>

      </DropdownMenu>
      
     
    </>
  )
}

export default DocumentList