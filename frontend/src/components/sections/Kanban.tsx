
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Divider } from '@nextui-org/divider'
import {DragDropContext,Draggable,Droppable, OnDragEndResponder} from 'react-beautiful-dnd'
import { Textarea } from '@nextui-org/input'
import { Trash, SquarePlus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle } from '../ui/card'
import TaskModal from '@/modals/TaskModal'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

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
  const user = useSelector((state:RootState)=>state.user);
  const boardId = boardeId;
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
      const sendReqConfig = {
        method:"PUT",
        url:`/api/workspace/${boardId}/tasks/update-position`,
        data:{
          resourceList:sourceTasks,
          destinationList:destinationTasks,
          resourceSectionId:sourceSectionId,
          destinationSectionId:destinationSectionId
        }
      }
      const result = await axios(sendReqConfig);
      console.log(result);
      setdata(data);
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
    const sendReqConfig = {
      method:"POST",
      url:`/api/workspace/${boardId}/sections?id=${boardId}`,
    }
    try {
      setLoading(true);
      const result = await axios(sendReqConfig);
      console.log(result);
      setdata([...data,result.data.section]);
      toast.success('created a new Section');
     
    } catch (error) {
      toast.error("Failed to add section");
    }
    finally{
      setLoading(false);
    }

  }
  
  const deleteSection = async(sectionId:string)=>{
    const sendReqConfig = {
      method:"DELETE",
      url:`/api/workspace/${boardId}/sections?id=${sectionId}`,
    }
    try {
      
      await axios(sendReqConfig);
      const newData = [...data].filter(e=>e._id!==sectionId);
      setdata(newData);
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
      const sendReqConfig = {
        method:"PUT",
        url:`/api/workspace/${boardId}/sections?id=${sectionId}`,
        data:{
          title:newTitle
        }
      }
      try {
        await axios(sendReqConfig);
       
      } catch (err) {
        console.log(err);
      }
    },timeOut);
  }
  const addTask = async(sectionId:string)=>{
    console.log(sectionId);
    const sendReqConfig = {
      method:"POST",
      url:`/api/workspace/${boardId}/tasks?id=${sectionId}`,
      data:{user:user.username},
    }
    try {
      const result = await axios(sendReqConfig);
      const newData = [...data];
      const index = newData.findIndex(e=>e._id===sectionId);
      newData[index].tasks.unshift(result.data.task);
      setdata(newData);
      
    } catch (err) {
      console.log(err);
    }
  }
  console.log(data);
  const updateTask =async(task:Task)=>{

    const newData = [...data];
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
  console.log(data);
  return (
    <div>
      <div className='flex items-center justify-between py-3'>
          <Button variant={"ghost"} disabled={user.role==='reader'} onClick={addSection}>
            Add Section
          </Button>
        <div className='text-sm font-[700]'>
           {data.length} sections 
        </div>
        </div>
        <Divider orientation='horizontal' className='margin-[10px]'/>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex items-start w-[80%] lg:w-[calc(100vw-400px)] overflow-x-auto'>
            {data.map(section=>(
              <div key={section._id} className='w-[300px]'>
              <Droppable isDropDisabled={user.role==='reader'} key={section._id} droppableId={section._id}>
                {(provided)=>(
                  <div ref={provided.innerRef}{...provided.droppableProps} className='w-[300px] p-[10px] mr-[10px]'>
                    <div className='flex items-center justify-between mb-[10px]'>
                      <Textarea value={section?.title} disabled={user.role==='reader'}  onChange={(e)=>updateSectionTitle(e,section._id)}  placeholder='Untitled' minRows={1} variant='underlined' className='flex-grow'/>
                      <Button size={"icon"} variant={"ghost"} disabled={user.role==='reader'}  className='text-gray-600 hover:text-green-500' >
                        <SquarePlus className='h-4 w-4' onClick={()=>addTask(section._id)}/>

                      </Button>
                      <Button size={"icon"} variant={"ghost"} disabled={user.role==='reader'}  className='text-gray-500 hover:text-red-500'>
                        <Trash className='h-4 w-4' onClick={()=>deleteSection(section._id)}/>

                      </Button>                      
                    </div>
                    {/* tasks */}
                    {
                      section.tasks.map((task:Task,index:number)=>(
                        <Draggable key = {task._id} draggableId={task._id} index = {index}>
                          {(provided,snapshot)=>(
                            <Card onClick={()=>{setSelectedTask(task)}} ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}>
                            <CardHeader>
          <CardTitle className='text-md'>{task.title===''?'Untitled':task.title}</CardTitle>
        </CardHeader>
                            </Card>
                          )
                          }
                        </Draggable>
                      )
                    )
                    }
                    {provided.placeholder}
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