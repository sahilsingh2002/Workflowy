
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page, Home_page } from './pages'
import './App.css'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

import  Navbar  from './components/navbar/Navbar'
import Lander from './pages/Lander'



function App() {
  const axiosInstance = axios.create({
    withCredentials: true // This enables sending cookies with cross-origin requests
  });
  useEffect(()=>{
    const result = axiosInstance.post('/api/auth',)

  },[])

  const {pathname} = useLocation();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* {pathname!='/login' && pathname!='/signup' &&  <Navbar/> } */}
    <Routes>
      <Route path='/login' element={<Login_page/>}/>
      <Route path='/signup' element={<Signup_page/>}/>
      <Route path='/home' element={<Home_page/>}/>
      <Route path='/' element={<Lander/>}/>

    </Routes>

    </ThemeProvider>
      
  )
}

export default App
