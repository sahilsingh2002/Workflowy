
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page, Home_page } from './pages'
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import LoadingSpinner from './components/LoadingSpinner'


import Lander from './pages/Lander'
import { changeUser } from './redux/slices/userSlice'




function App() {
  
  const dispatch = useDispatch();

  const navigate = useNavigate();
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
        if(result.data.username && result.data.username.length>0){
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
  const userdetails = useSelector(state=>state.user);
  console.log("user",userdetails);
  const {pathname} = useLocation();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     {isLoading?(
       <>
       <LoadingSpinner/>
       </>
     ):(  
      <>
    
       {userdetails.username.length > 0 && <Navigate to="/home" />}
          {(!(userdetails.username.length > 0)) && (pathname !== '/login' && pathname !== '/signup') && <Navigate to="/login" />}
    <Routes>
      <Route path='/login' element={<Login_page/>}/>
      <Route path='/signup' element={<Signup_page/>}/>
      <Route path='/home' element={<Home_page/>}/>
      <Route path='/' element={<Lander/>}/>

    </Routes>
    </>
    )
    }
    </ThemeProvider>
      
  )
}

export default App
