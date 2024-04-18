import axios from 'axios';
import React,{useEffect, useState} from 'react'
import EmojiPicker, { Emoji,Theme } from 'emoji-picker-react'; 


function Picker({icon,onChange}) {
  const [selectedEmoji, setSelectedEmoji] = useState(icon);
  const [isShowPicker, setIsShowPicker] = useState(false);
  
  

  useEffect(()=>{
    setSelectedEmoji(icon);
  },[icon]);

  const selectEmoji = (e)=>{
    console.log(e);
    const sym = e.unified.split('-');
    console.log(sym);
   
   
    setIsShowPicker(false);
    setSelectedEmoji(sym);
    onChange(sym[0]);
  }
  const showPicker = ()=>setIsShowPicker(!isShowPicker);

  
  
  // const updateMain = async(id)=>{
  
  
  return ( 
    <div className='relative w-max'>
      <h3 className='font-semibold cursor-pointer text-5xl' onClick={showPicker}>
        <Emoji unified={selectedEmoji?selectedEmoji:"14f32"} size={50}/>
        
      </h3>
      
      <div className={`${isShowPicker?'block':'none'} absolute top-[100%] my-2 z-[99999]`}>
        <EmojiPicker  open={isShowPicker} onEmojiClick={selectEmoji} theme={Theme.AUTO}/>

      </div>

    </div>
  )
}

export default Picker