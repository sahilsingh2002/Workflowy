
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Divider } from '@nextui-org/divider'
import {DragDropContext,Draggable,Droppable} from 'react-beautiful-dnd'
import { Textarea } from '@nextui-org/input'
import { Trash, SquarePlus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import TaskModal from '@/modals/TaskModal'


let timer;
const timeOut = 500;
const Kanban = (props) => {
  const boardId = props.boardId;
  const [data, setdata] = useState([]);
  const [loading,setLoading] = useState(false);
  const [selectedTask,setSelectedTask] = useState(undefined);
  const onDragEnd = async({source,destination})=>{
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
    setdata(props.data);
  },[props.data]);
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
  
  const deleteSection = async(sectionId)=>{
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
  const updateSectionTitle=async(e,sectionId)=>{
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
  const addTask = async(sectionId)=>{
    console.log(sectionId);
    const sendReqConfig = {
      method:"POST",
      url:`/api/workspace/${boardId}/tasks?id=${sectionId}`,
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
  const updateTask =async(task)=>{

    const newData = [...data];
    const sectionIndex = newData.findIndex(e=>e._id===task.section);
    const taskIndex = newData[sectionIndex].tasks.findIndex(e=>e._id===task._id);
   
    newData[sectionIndex].tasks[taskIndex] = task;
  };
  const deleteTask = async(task)=>{
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
          <Button variant={"ghost"} onClick={addSection}>
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
              <Droppable key={section._id} droppableId={section._id}>
                {(provided)=>(
                  <div ref={provided.innerRef}{...provided.droppableProps} className='w-[300px] p-[10px] mr-[10px]'>
                    <div className='flex items-center justify-between mb-[10px]'>
                      <Textarea value={section?.title} onChange={(e)=>updateSectionTitle(e,section._id)}  placeholder='Untitled' minRows={1} variant='underlined' className='flex-grow'/>
                      <Button size={"icon"} variant={"ghost"} className='text-gray-600 hover:text-green-500' >
                        <SquarePlus className='h-4 w-4' onClick={()=>addTask(section._id)}/>

                      </Button>
                      <Button size={"icon"} variant={"ghost"} className='text-gray-500 hover:text-red-500'>
                        <Trash className='h-4 w-4' onClick={()=>deleteSection(section._id)}/>

                      </Button>                      
                    </div>
                    {/* tasks */}
                    {
                      section.tasks.map((task,index)=>(
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
        <TaskModal tasks = {selectedTask} boardId={boardId} onClose = {()=>setSelectedTask(undefined)} onUpdate = {updateTask} onDelete = {deleteTask}/>
      
    </div>
  )
}

export default Kanban