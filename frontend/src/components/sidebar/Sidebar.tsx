import React from 'react'

function Sidebar() {
  return (
   <>
   <aside className='group/sidebar h-full bg-red text-white overflow-y-auto relative flex w-60 flex-col z-[99999]'>
    <div>
      <p>Action items</p>
    </div>
    <div className="mt-4">
      <p>Documents</p>
    </div>
    <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"></div>
   </aside>
   </>
  )
}

export default Sidebar