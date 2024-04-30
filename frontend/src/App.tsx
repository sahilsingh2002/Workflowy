
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page, Home_page } from './pages'
import './App.css'
import { useLocation } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import LoadingSpinner from './components/LoadingSpinner'


import Lander from './pages/Lander'
import { changeUser } from './redux/slices/userSlice'
import Workspaces from './pages/Workspaces'
import { Toaster } from 'sonner'
import { RootState } from './redux/store'




function App() {
  
  const dispatch = useDispatch();
  const [user, setUser] = useState(false);
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
          setUser(true);
          console.log(result);
          dispatch(changeUser(result.data));
        }
        else{
          setUser(false);
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     {isLoading?(
       <>
       <LoadingSpinner/>
       </>
     ):(  
      <div className='h-full flex dark:bg-[#1F1F1F]'>
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
      
  )
}

export default App
