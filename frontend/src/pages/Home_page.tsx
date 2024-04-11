import Sidebar from '@/components/sidebar/Sidebar'
import  Home  from '@/components/home/Home'

import { useSelector } from 'react-redux';
import  Navbar  from '@/components/navbar/Navbar';

{/* <div className=' h-full flex flex-col items-center text-center -mt-10 justify-center text-white'>
  <h1 className='font-bold text-6xl'>Are you ready for the ultimate showdown????</h1>
  <Button variant={'destructive'} className='p-14 text-6xl my-10 font-serif'>Challenge Now!!</Button>
</div> */}

function Home_page() {

 
  
  return (
    <div className='h-full flex dark:bg-[#1F1F1F]'>
     <Navbar/>
      <Sidebar/>
      <main className='flex-1 h-screen overflow-y-auto'>
      <Home/>
      </main>
      

     
   </div>
    
  )
}

export default Home_page