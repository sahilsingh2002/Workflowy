import React from 'react'
import Navbar from '@/components/navbar/Navbar'
import Heads from '@/components/heading/Heads'
import Heroes from '@/components/heroes/Heroes'
import Footer from '@/components/footer/Footer'





function Lander() {
  return (
    <div className='min-h-full flex flex-col'>
      <div className='flex flex-col items-center pt-20 justify-center md:justify-start text-center gap-y-8 flex-1'>
      <Navbar/>
      <Heads/>
      <Heroes/>
      </div>
      <Footer/>

      
    </div>
  )
}

export default Lander
