
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page, Home_page } from './pages'
import './App.css'
import { useLocation } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'



import Lander from './pages/Lander'
import { changeUser } from './redux/slices/userSlice'
import Workspaces from './pages/Workspaces'
import { Toaster } from 'sonner'
import { RootState } from './redux/store'
import { SocketProvider } from './context/SocketContext'
import { Player } from '@lottiefiles/react-lottie-player'



function App() {
  
  const dispatch = useDispatch();
 
  const [isLoading,setIsLoading] = useState(true);

  
  useEffect(()=>{
    
    const handleUser = async () => {
      const sendreqConfig = {
        method:"POST",
        url:'/api/authenticate',
        withCredentials:true,
      }
      try{
        const result = await axios(sendreqConfig);
        if(result.data.username && result.data.username!==null){
         
          console.log(result);
          dispatch(changeUser(result.data));
        }
        
      }
      catch(err){
        console.log("error : ",err);
      }
      finally{
        setIsLoading(false);
      }
  }
  handleUser();


  },[dispatch]);
  const userdetails = useSelector((state:RootState)=>state.user);
  console.log("user",userdetails);
  const {pathname} = useLocation();
  return (
    <SocketProvider>

  
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     {isLoading?(
       <>
       <Player
     autoplay={true}
     loop={true}
     controls={false}
     src="https://lottie.host/9165917b-1a6a-4db2-b34f-09a69d118a98/hUi8I8l4tZ.json"
     className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
   ></Player>
       </>
     ):(  
      <div className='h-full flex dark:bg-[#1C2025] text-[#2f3a4d] dark:text-[#9EADAC] overflow-hidden'>
    <Toaster richColors/>
        
       
          {(!(userdetails.username!==null && userdetails?.username?.length > 0)) && (pathname !== '/login' && pathname !== '/signup') && <Navigate to="/" />}
    <Routes>
    
      <Route path='/login' element={ userdetails.username!==null && userdetails.username.length > 0 ? <Navigate to="/home" />:<Login_page/>}/>
      <Route path='/signup' element={userdetails.username!==null && userdetails.username.length > 0 ? <Navigate to="/home" />:<Signup_page/>}/>
      <Route path='/home' element={<Home_page/>}/>
      <Route path='/' element={<Lander/>}/>
      <Route path='/workspace' element={<Navigate to="/home" />}/>
      <Route path='/workspace/:workspaceId' element={<Workspaces/>}/>
      <Route path='*' element={<Home_page/>} />
    </Routes>
    </div>
    )
    }
    </ThemeProvider>
    </SocketProvider>
      
  )
}

export default App
