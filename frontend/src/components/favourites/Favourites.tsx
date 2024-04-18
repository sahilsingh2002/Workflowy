
import { ChevronDownIcon, File } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useDispatch,useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { setFav } from '@/redux/slices/favouriteSlice'

function Favourites() {
  const dispatch = useDispatch()
  const list = useSelector((state)=>state.favourite.value);
  const [activeIndex, setActiveIndex] = useState(0);
  const {workspaceId} = useParams();
  useEffect(()=>{
    const getfaves = async()=>{
      const sendReqConfig = {
        method : "GET",
        url:"/api/workspace/getfav"
      }
      try {
        const result = await axios(sendReqConfig);
        console.log("HERE",result);
        dispatch(setFav(result.data));
      } catch (err) {
        console.log(err);
      }
    }
    getfaves();
  },[])
  return (
    <>
      <p className='text-sm font-medium text-muted-foreground/80 flex justify-between items-center gap-2'>
          <span className='flex gap-2'>
          <File/>Favourites
          </span>
          
          </p>
      </>
  )
}

export default Favourites