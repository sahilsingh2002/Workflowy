
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Divider } from '@nextui-org/divider'
import {DragDropContext,Draggable,Droppable, OnDragEndResponder} from 'react-beautiful-dnd'
import { Textarea } from '@nextui-org/input'
import { Trash } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import TaskModal from '@/modals/TaskModal'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

import { useSocket } from '@/context/SocketContext'

interface kanbans  {
  datar:Workspace[];
  boardeId:string | undefined;
}

interface Task {
  _id: string;
  section: string; // Assuming section is an identifier
  position: number;
  title: string;
  content: string;
  // Add more properties if needed
}

interface Workspace {
  created_at: number;
  tasks: Task[];
  title: string;
  updated_at: number;
  workspace: string;
  _id: string;
}
let timer:ReturnType<typeof setTimeout>;
const timeOut = 500;
const Kanban = ({datar,boardeId}:kanbans) => {
  const {socket} = useSocket();
  

  const user = useSelector((state:RootState)=>state.user);
  const boardId = boardeId;
  const [titleshow,setTitleShow] = useState(false);
  const [data, setdata] = useState<Workspace[]>([]);
  const [loading,setLoading] = useState(false);
  const [selectedTask,setSelectedTask] = useState<Task | undefined>(undefined);
 
  
  const onDragEnd:OnDragEndResponder = async({source,destination})=>{
    if(!destination) return;
    const sourceColIndex = data.findIndex(e=>e._id===source.droppableId);
    const destinationColIndex = data.findIndex(e=>e._id===destination.droppableId);
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];
    const sourceSectionId = sourceCol._id;
    const destinationSectionId = destinationCol._id;
    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];
    if(source.droppableId!==destination.droppableId){
      const [removed] = sourceTasks.splice(source.index,1);
      destinationTasks.splice(destination.index,0,removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    }
    else{
      const [removed] = destinationTasks.splice(source.index,1);
      destinationTasks.splice(destination.index,0,removed);
      data[destinationColIndex].tasks = destinationTasks;
    }
    try{
      // const sendReqConfig = {
      //   method:"PUT",
      //   url:`/api/workspace/${boardId}/tasks/update-position`,
      //   data:{
          // resourceList:sourceTasks,
          // destinationList:destinationTasks,
          // resourceSectionId:sourceSectionId,
          // destinationSectionId:destinationSectionId
      //   }
      // }
      // const result = await axios(sendReqConfig);
     
      socket?.emit('updateposition',({resourceList:sourceTasks,
        destinationList:destinationTasks,
        resourceSectionId:sourceSectionId,
        destinationSectionId:destinationSectionId,
      workspaceId:boardId}));

      
      // setdata(data);
    }
    catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{
    setdata(datar);
    
  },[datar]);

  console.log(data);
  const addSection = async()=>{
    
    // const sendReqConfig = {
    //   method:"POST",
    //   url:`/api/workspace/${boardId}/sections?id=${boardId}`,
    // }
    try {
      
      // setLoading(true);
      // const result = await axios(sendReqConfig);
      // console.log(result);
     socket?.emit('create',({id:boardId}),(response)=>{
       if(response.status){
         
        //  setdata([...data,response.section]);
         toast.success('created a new Section');
       }
       else{
         console.error('Error creating Section:', response.message);
       }
     })
     
    } catch (error) {
      toast.error("Failed to add section");
    }
    

  }
  
  const deleteSection = async(sectionId:string)=>{
    // const sendReqConfig = {
    //   method:"DELETE",
    //   url:`/api/workspace/${boardId}/sections?id=${sectionId}`,
    // }
    try {
      
      
      // await axios(sendReqConfig);
      socket?.emit('deletesection',{workspaceId:boardId,sectId:sectionId});
      // const newData = [...data].filter(e=>e._id!==sectionId);
      // setdata(newData);
    } catch (err) {
      console.log(err);
    }
  }
  const updateSectionTitle=async(e,sectionId:string)=>{
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index =newData.findIndex(e=>e._id === sectionId);
    newData[index].title = newTitle;
    setdata(newData);
    
    timer = setTimeout(async()=>{
      // const sendReqConfig = {
      //   method:"PUT",
      //   url:`/api/workspace/${boardId}/sections?id=${sectionId}`,
      //   data:{
      //     title:newTitle
      //   }
      // }
      try {
        
       socket?.emit('updatesection',({workid:boardId,sectId:sectionId,changes:{title:newTitle}}));
       
      } catch (err) {
        console.log(err);
      }
    },timeOut);
  }
  const addTask = async(sectionId:string)=>{
    // console.log(sectionId);
    // const sendReqConfig = {
    //   method:"POST",
    //   url:`/api/workspace/${boardId}/tasks?id=${sectionId}`,
    //   data:{user:user.username},
    // }
    try {
      
      console.log("here");
      // const result = await axios(sendReqConfig);
      socket?.emit('createtask',({sectionId:sectionId,user:user.username,id:boardId}),(response)=>{
        if(response.status){
          console.log(response);
          toast.success("created a new Task");
          // const newData = [...data];
          // const index = newData.findIndex(e=>e._id===sectionId);
          // newData[index].tasks.unshift(response.task);
          // setdata(newData);
        }
        else{
          console.error('Error creating Task:', response.message);
        }
      })
      
    } catch (err) {
      console.log(err);
    }
  }
  console.log(data);
  const updateTask =async(task:Task)=>{

    const newData = [...data];
    console.log(data);
    const sectionIndex = newData.findIndex(e=>e._id===task.section);
    const taskIndex = newData[sectionIndex].tasks.findIndex(e=>e._id===task._id);
    
    
   
    newData[sectionIndex].tasks[taskIndex] = task;
  };
  const deleteTask = async(task:Task)=>{
    const newData = [...data];
    const sectionIndex = newData.findIndex(e=>e._id===task.section);
    const taskIndex = newData[sectionIndex].tasks.findIndex(e=>e._id===task._id);
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setdata(newData);

  };
  console.log(selectedTask);
  return (
    <div >
      <div className='flex items-center justify-between py-3 '>
          <Button className='dark:hover:bg-[#22272b]' variant={"ghost"} disabled={user.role==='reader'} onClick={addSection}>
            Add Section
          </Button>
        <div className='text-sm font-[700]'>
           {data.length} sections 
        </div>
        </div>
        <Divider orientation='horizontal' className='margin-[10px]'/>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex items-start  lg:w-[Calc(80vw)] overflow-auto'>
            {data.map(section=>(
              <div key={section._id} className='w-[200px] lg:w-[300px] bg-[#F7F8F9]  dark:bg-[#161a1d] mr-2 rounded-md'>
              <Droppable isDropDisabled={user.role==='reader'} key={section._id} droppableId={section._id}>
                {(provided)=>(
                  <div ref={provided.innerRef}{...provided.droppableProps} className='w-[200px] lg:w-[300px] p-[10px] mr-[10px]'>
                    <div className='flex items-center justify-between mb-[10px]'>
                      
                      <Textarea value={section?.title} disabled={user.role==='reader'}  onChange={(e)=>updateSectionTitle(e,section._id)}  placeholder='What to do?' minRows={1} size='lg' inputMode='text' color='secondary' className=' font-semibold text-xl  flex-grow'/>
                      
                

                    
                      <Button size={"icon"} variant={"ghost"} disabled={user.role==='reader'}  className='dark:hover:bg-[#22272b]'>
                        <Trash className='h-4 w-4' onClick={()=>deleteSection(section._id)}/>

                      </Button>                      
                    </div>
                    
                    {
                      section.tasks.map((task:Task,index:number)=>(
                        <Draggable key = {task._id} draggableId={task._id} index = {index}>
                          {(provided,snapshot)=>(
                            <Card className='hover:bg-[#E9EBEE] transition duration-200' onClick={()=>{setSelectedTask(task)}} ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}>
                            <CardHeader>
          <CardTitle className='text-xl'>{task.title===''?'Untitled':task.title}</CardTitle>
        </CardHeader>
        <CardContent className='text-neutral-500  text-md'>{task.content===''?'(no Content yet)':task.content.slice(3,30)+'...'}</CardContent>
                            </Card>
                          )
                          }
                        </Draggable>
                      )
                    )
                    }
                    {provided.placeholder}
                    <Button variant={"ghost"} onClick={()=>addTask(section._id)} className='w-full hover:bg-[#E9EBEE] dark:hover:bg-[#22272b] my-2'>create task</Button>
                  </div>
                )}
              </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
        <TaskModal  currRole = {user.role} tasks = {selectedTask} boardId={boardId} onClose = {()=>setSelectedTask(undefined)} onUpdate = {updateTask} onDelete = {deleteTask}/>
      
    </div>
  )
}

export default Kanban