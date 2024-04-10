
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page, Home_page } from './pages'
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'


import Lander from './pages/Lander'




function App() {
  const isUser = useSelector(state=>state.user);
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  console.log("here");
  const axiosInstance = axios.create({
    withCredentials: true // This enables sending cookies with cross-origin requests
  });
  useEffect(()=>{
    const handleUser = async () => {
    const result =await axiosInstance.post('/api/authenticate');
    
    if(result){
      setUser(true);
    }
    console.log(result);
  }
  handleUser();


  },[]);

  const {pathname} = useLocation();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

    <Routes>
      <Route path='/login' element={<Login_page/>}/>
      <Route path='/signup' element={<Signup_page/>}/>
      <Route path='/home' element={user || isUser.name?<Home_page/>:<Navigate to='/login'/>}/>
      

      <Route path='/' element={<Lander/>}/>

    </Routes>

    </ThemeProvider>
      
  )
}

export default App
