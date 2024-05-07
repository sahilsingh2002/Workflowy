
import {cn} from '@/lib/utils';

const IMAGES = {
    icon : new URL('../../assets/MindGrid_icon.png', import.meta.url).href
  }
  
function Logo() {
  return (
    <div id='LogoID' className='hidden md:flex items-center  gap-x-2'>
        <img src={IMAGES.icon} className='w-[40px] h-[40px]' alt="Icon" />
        <p className={cn("font-semibold")}>MindGrid</p>
    </div>
  )
}

export default Logo
