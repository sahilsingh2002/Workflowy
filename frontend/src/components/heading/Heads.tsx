import { ArrowRight } from 'lucide-react'

import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Heads() {
  return (
    <div className='max-w-3xl space-y-4 dark:text-white'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your Ideas, Documents, & Plans, Unified. Welcome to <span className='underline'>MindGrid</span>
      </h1>
      
      <h3 className='text-base sm:text-xl md:text-2xl pb-5 font-medium'>MindGrid is the connected workspace where <br/> better, faster work happens</h3>
      <Link to="/signup" >
        
      <Button>Enter MindGrid <ArrowRight className='h-4 w-4 ml-2'/></Button>
      </Link>
     
    </div>
  )
}

export default Heads
