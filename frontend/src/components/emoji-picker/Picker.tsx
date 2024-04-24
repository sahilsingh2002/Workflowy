
import {useEffect, useState} from 'react'
import EmojiPicker, { Emoji,EmojiStyle,SkinTones,Theme } from 'emoji-picker-react'; 
interface emoji {
  icon:string,
  onChange:(newIcon:string)=>void;
}
interface emoData {
  activeSkinTone: SkinTones;
  unified: string;
  unifiedWithoutSkinTone: string;
  emoji: string; // the emoji character, for example: '😀'. Emoji ID in custom emojis
  isCustom: boolean; // whether the emoji is a custom emoji or not
  names: string[];
  imageUrl: string; // the url of the emoji image with the current emoji style applied
  getImageUrl: (emojiStyle: EmojiStyle) => string; // a function that receives an emoji style and returns the url of the emoji image with the provided style applied
}
function Picker({icon,onChange}:emoji) {
  const [selectedEmoji, setSelectedEmoji] = useState(icon);
  const [isShowPicker, setIsShowPicker] = useState(false);
  
  

  useEffect(()=>{
    setSelectedEmoji(icon);
  },[icon]);

  const selectEmoji = (e:emoData)=>{
    console.log("here",e);
    const sym = e.unified.split('-');
    console.log(sym);
   
   
    setIsShowPicker(false);
    setSelectedEmoji(sym[0]);
    onChange(sym[0]);
  }
  const showPicker = ()=>setIsShowPicker(!isShowPicker);

  
  

  
  
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