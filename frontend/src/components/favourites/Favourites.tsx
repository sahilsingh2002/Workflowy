
import {  File } from 'lucide-react'
import React, {  useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useDispatch,useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setFav } from '@/redux/slices/favouriteSlice'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import { Emoji } from 'emoji-picker-react'
import LoadingSpinner from '../LoadingSpinner'

function Favourites() {
  const navigate = useNavigate();
  const [isLoading,setIsLoading]=useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch()
  const list = useSelector((state)=>state.favourite);
  console.log(list.value);
  const [activeIndex, setActiveIndex] = useState(0);
  const {workspaceId} = useParams();
  useEffect(()=>{
    const getfaves = async()=>{
      setIsLoading(true);
      const sendReqConfig = {
        method : "GET",
        url:"/api/workspace/favourites"
      }
      try {
        const result = await axios(sendReqConfig);
        console.log(result);
        dispatch(setFav([...result.data.favourites]));
      } catch (err) {
        console.log(err);
      }
      finally{
        setIsLoading(false);
      }
    }
    getfaves();
  },[dispatch]);
  const onDragEnd = async ({source,destination})=>{
    setIsDragging(false);
    const newList = [...list.value];
    const [removed] = newList.splice(source.index,1);
    newList.splice(destination.index,0,removed);

    const activeItem = newList.findIndex(e=>e._id===workspaceId);
    setActiveIndex(activeItem);
    dispatch(setFav(newList));
    try{
      const sendReqConfig = {
        method:"PATCH",
        url:`/api/workspace/favourites`,
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
  useEffect(()=>{
    const updateActive = (listWork:[])=>{
      const activeItem = listWork.findIndex(e=>e._id===workspaceId);
     
      setActiveIndex(activeItem);
    }
    updateActive(list.value);
  },[list.value,workspaceId]);

 
  const handleDragStart = () => {
    setIsDragging(true);
  };
  return (
    <>
   
    {isLoading? (<>
      <LoadingSpinner/>
      </>)
      :
      <>
      <p className='text-sm font-medium text-muted-foreground/80 flex justify-between items-center gap-2'>
          <span className='flex gap-2'>
          <File/>Favourites
          </span>
          </p>
          
      <DragDropContext onDragEnd = {onDragEnd} onDragStart={handleDragStart}>
     

     
     <Droppable key = {'list-favorite-droppable'} droppableId = {'list-favorite-droppable'}>
       {(provided)=>(
         <div ref = {provided.innerRef} {...provided.droppableProps}>
           {
             list.value.map((item,index)=>(
               <Draggable key = {item._id} draggableId = {item._id} index = {index}>
                 {(provided,snapshot)=>(
                   <div  onClick={() => {
                    
                     navigate(`/workspace/${item._id}`);
                   }} ref = {provided.innerRef}{...provided.dragHandleProps}{...provided.draggableProps} className={`${index==activeIndex && 'bg-slate-400 dark:bg-slate-600'} pl-[20px] ${snapshot.isDragging?'cursor-grab':'cursor-pointer!important'} py-2  w-full hover:bg-neutral-400 dark:hover:bg-neutral-500  flex items-center text-sm font-medium text-muted-foreground/80`}>
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
     
    
   </DragDropContext>
      </>}
      </>
  )
}

export default Favourites