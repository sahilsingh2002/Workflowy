
import { Button } from '../ui/button'
import { PlusCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store';

const IMAGES = {
  empty : new URL("../../assets/home/empty.png" , import.meta.url).href,
  empty_dark : new URL("../../assets/home/empty-dark.png" , import.meta.url).href,
 

  
}
function Home() {
  const user = useSelector((state:RootState) => state.user);
  return (
    <div className='h-full flex flex-col items-center justify-center'>
      <img src={IMAGES.empty} alt="empty" className='h-[300px] w-fit dark:hidden' />
      <img src={IMAGES.empty_dark} alt="empty_dark" className='h-[300px] w-fit hidden dark:block' />
      <h2 className='text-lg font-medium'>Welcome to {user.name}&apos;s Workflowy</h2>
      <Button>
        <PlusCircle className='h-4 w-4 mr-2'/>
        Create a note
      </Button>
    </div>
  )
}

export default Home