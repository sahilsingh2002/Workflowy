
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page, Home_page } from './pages'
import './App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'

import  Navbar  from './components/navbar/Navbar'
import Lander from './pages/Lander'



function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const axiosInstance = axios.create({
    withCredentials: true // This enables sending cookies with cross-origin requests
  });
  useEffect(()=>{
    const handleUser = async () => {
    const result =await axiosInstance.post('/api/auth');
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
      {/* {pathname!='/login' && pathname!='/signup' &&  <Navbar/> } */}
    <Routes>
      <Route path='/login' element={<Login_page/>}/>
      <Route path='/signup' element={<Signup_page/>}/>
      <Route path='/home' element={user?<Home_page/>:<Navigate to='/login'/>}/>

      <Route path='/' element={user?<Lander/>:<Navigate to='/login'/>}/>

    </Routes>

    </ThemeProvider>
      
  )
}

export default App
