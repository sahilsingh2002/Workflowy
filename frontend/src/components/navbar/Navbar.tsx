import { Button } from "@/components/ui/button"

import {Link} from "react-router-dom"

import { ModeToggle } from "../mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const IMAGES = {
  image1 : new URL('../../assets/Workflowy_icon.png', import.meta.url).href
}


export default function Component() {
  return (
    <header className="flex-col flex sm:flex-row  justify-between w-full  dark:bg-black items-center dark:text-white px-4 md:px-6">
      <Link className="mr-6 flex w-fit justify-center items-center" to="#">
        <Avatar className="lg:scale-150 my-4 ">
  <AvatarImage src={IMAGES.image1} />
  <AvatarFallback>WF</AvatarFallback>
</Avatar>
  <span className=" dark:text-white font-sans text-lg">Workflowy</span>
      </Link>
      
      <div className="flex items-center ">
        <Link to="/login">
          <Button variant={"outline"} className="mr-3">Login</Button>
        </Link>
        <Link to="/signup">
          <Button variant={"outline"} className="mr-3">Sign up</Button>
        </Link>
        <ModeToggle />  

      </div>
    </header>
  )
}

