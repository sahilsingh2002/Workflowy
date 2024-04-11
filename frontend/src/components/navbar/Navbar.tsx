import { Button } from "@/components/ui/button"

import {Link} from "react-router-dom"

import { ModeToggle } from "../mode-toggle"

import { useScrollTop } from "@/hooks/use-scroll-top"
import { cn } from "@/lib/utils"
import Logo from "../logo/Logo"




export default function Component() {
  const scrolled = useScrollTop();
  return (
    <header className={cn("flex-col z-[99999] fixed md:flex sm:flex-row bg-white dark:bg-black  justify-between w-full  items-center dark:text-white px-4 -mt-20 hidden md:px-6 h-20",scrolled && "border-b dark:border-black shadow-sm dark:shadow-white ")}>
      <Link className="mx-6 flex  w-fit justify-center items-center  scale-150" to="/">
        <Logo/>
      </Link>
      
      <div className="flex items-center">
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

