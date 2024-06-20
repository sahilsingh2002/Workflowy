import { useEffect, useState, memo, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Divider } from '@nextui-org/divider';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { Textarea } from '@nextui-org/input';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TaskModal from '@/modals/TaskModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocket } from '@/context/SocketContext';

interface KanbansProps {
  datar: Workspace[];
  boardeId: string | undefined;
}

interface Task {
  _id: string;
  section: string;
  position: number;
  title: string;
  content: string;
}

interface Workspace {
  created_at: number;
  tasks: Task[];
  title: string;
  updated_at: number;
  workspace: string;
  _id: string;
}

let timer: ReturnType<typeof setTimeout>;
const timeOut = 500;

const Kanban = memo(({ datar, boardeId }: KanbansProps) => {
  const { socket } = useSocket();
  const user = useSelector((state: RootState) => state.user);
  const boardId = boardeId;
  const [titleshow, setTitleShow] = useState(false);
  const [data, setdata] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const onDragEnd: OnDragEndResponder = async ({ source, destination }) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex(e => e._id === source.droppableId);
    const destinationColIndex = data.findIndex(e => e._id === destination.droppableId);
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];
    const sourceSectionId = sourceCol._id;
    const destinationSectionId = destinationCol._id;
    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];
    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }
    try {
      socket?.emit('updateposition', {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
        workspaceId: boardId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setdata(datar);
  }, [datar]);

  useEffect(() => {
    const handleGetAll = (datas) => {
      setdata(datas.sections);
    };
    
    const handleGetSections = (datas) => {
      setdata((prevData) => [...prevData, datas.section]);
      toast.success("New section created by: " + datas.user);
    };
    
    const handleRemoveSection = (datas) => { 
      console.log("removed");
      const newData = [...data].filter(e => e._id !== datas.sectId);
      setdata(newData);
    };
    
    const handleUpdateHere = (datas) => {
      const newTitle = datas.changes.title;
      const newData = [...data];
      const index = newData.findIndex(e => e._id === datas.sectId);
      newData[index].title = newTitle;
      setdata(newData);
    };
    const addoneTask = (datas)=>{
      console.log(datas);
      const newTask = datas.task;
      const section = newTask.section;
      console.log(section);
      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex(e => e._id === section);
      console.log(index);
      newData[index].tasks.push(newTask);
      console.log(newData[index]);
      setdata(newData);
    }
    const updatetask = async (datas) => {
      const newData = [...data];
      const sectionIndex = newData.findIndex(e => e._id === datas.task.section);
      console.log(sectionIndex);
      console.log(newData[sectionIndex]);
      const taskIndex = newData[sectionIndex].tasks?.findIndex(e => e._id === datas.task._id);
      newData[sectionIndex].tasks[taskIndex] = datas.task;
      setdata(newData);
    };
    const deletetasker = (datas)=>{
      const newData = [...data];
      const sectionIndex = newData.findIndex(e => e._id === datas.task.section);
      console.log(sectionIndex);
      console.log(newData[sectionIndex]);
      const taskIndex = newData[sectionIndex].tasks?.findIndex(e => e._id === datas.taskId);
      newData[sectionIndex].tasks.splice(taskIndex,1);
      setdata(newData);
    }
  

    if (socket) {
      socket.on("haveData",updatetask);
      socket.on("deleteit",deletetasker);
      socket.on('getAll', handleGetAll);
      socket.on('getSections', handleGetSections);
      socket.on('removesection', handleRemoveSection);
      socket.on('updateHere', handleUpdateHere);
      socket.on('addtask',addoneTask);
    }

    return () => {
      if (socket) {
        socket.off("haveData",updatetask);
        socket.off('getAll', handleGetAll);
        socket.off('getSections', handleGetSections);
        socket.off('removesection', handleRemoveSection);
        socket.off('updateHere', handleUpdateHere);
        socket.off('addtask',addoneTask);
        socket.off('deleteit',deletetasker);
      }
    };
  }, [socket, data]);

  const addSection = async () => {
    try {
      socket?.emit('create', { id: boardId, user: user.username, sections: data }, (response) => {
        if (response.status) {
          setdata([...data, response.section]);
          toast.success('Created a new Section');
        } else {
          console.error('Error creating Section:', response.message);
        }
      });
    } catch (error) {
      toast.error("Failed to add section");
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      socket?.emit('deletesection', { workspaceId: boardId, sectId: sectionId });
      const newData = [...data].filter(e => e._id !== sectionId);
      setdata(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const updateSectionTitle = async (e: ChangeEvent<HTMLInputElement>, sectionId: string) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex(e => e._id === sectionId);
    newData[index].title = newTitle;
    setdata(newData);

    timer = setTimeout(async () => {
      try {
        socket?.emit('updatesection', { workid: boardId, sectId: sectionId, changes: { title: newTitle } });
      } catch (err) {
        console.log(err);
      }
    }, timeOut);
  };

  const addTask = async (sectionId: string) => {
    try {
      socket?.emit('createtask', { sectionId: sectionId, user: user.username, id: boardId }, (response) => {
        if (response.status) {
          toast.success("Created a new Task");
        } else {
          console.error('Error creating Task:', response.message);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateTask = async (task: Task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex(e => e._id === task.section);
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id);
    console.log(task);
    
    newData[sectionIndex].tasks[taskIndex] = task;
    console.log(newData);
    setdata(newData);
  };

  const deleteTask = async (task: Task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex(e => e._id === task.section);
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id);
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setdata(newData);
  };

  return (
    <div>
      <div className='flex items-center justify-between py-3'>
        <Button className='dark:hover:bg-[#22272b]' variant={"ghost"} disabled={user.role === 'reader'} onClick={addSection}>
          Add Section
        </Button>
        <div className='text-sm font-[700]'>
          {data.length} sections 
        </div>
      </div>
      <Divider orientation='horizontal' className='margin-[10px]'/>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex items-start lg:w-[Calc(80vw)] overflow-auto'>
          {data.map(section => (
            <div key={section._id} className='w-[200px] lg:w-[300px] bg-[#F7F8F9] dark:bg-[#161a1d] mr-2 rounded-md'>
              <Droppable isDropDisabled={user.role === 'reader'} key={section._id} droppableId={section._id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className='w-[200px] lg:w-[300px] p-[10px] mr-[10px]'>
                    <div className='flex items-center justify-between mb-[10px]'>
                      <Textarea value={section?.title} disabled={user.role === 'reader'} onChange={(e) => updateSectionTitle(e, section._id)} placeholder='What to do?' minRows={1} size='lg' inputMode='text' color='secondary' className=' font-semibold text-xl flex-grow'/>
                      <Button size={"icon"} variant={"ghost"} disabled={user.role === 'reader'} className='dark:hover:bg-[#22272b]'>
                        <Trash className='h-4 w-4' onClick={() => deleteSection(section._id)}/>
                      </Button>
                    </div>
                    {section.tasks.map((task: Task, index: number) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <Card className='hover:bg-[#E9EBEE] transition duration-200' onClick={() => { setSelectedTask(task); }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <CardHeader>
                              <CardTitle className='text-xl'>{task.title === '' ? 'Untitled' : task.title}</CardTitle>
                            </CardHeader>
                            <CardContent className='text-neutral-500 text-md'>{task?.content === '' ? '(no Content yet)' : task?.content?.slice(0, 30) + '...'}</CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Button variant={"ghost"} onClick={() => addTask(section._id)} className='w-full hover:bg-[#E9EBEE] dark:hover:bg-[#22272b] my-2'>Create task</Button>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <TaskModal currRole={user.role} tasks={selectedTask} boardId={boardId} onClose={() => setSelectedTask(undefined)} onUpdate={updateTask} onDelete={deleteTask}/>
    </div>
  );
});

export default Kanban;
