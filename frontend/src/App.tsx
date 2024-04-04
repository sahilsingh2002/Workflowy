
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page, Home_page } from './pages'
import './App.css'
import { useLocation } from 'react-router-dom'

import  Navbar  from './components/navbar/Navbar'



function App() {
  const {pathname} = useLocation();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* {pathname!='/login' && pathname!='/signup' &&  <Navbar/> } */}
    <Routes>
      <Route path='/login' element={<Login_page/>}/>
      <Route path='/signup' element={<Signup_page/>}/>
      <Route path='/home' element={<Home_page/>}/>
      <Route path='/' element={<Navigate to="/home"/>}/>

    </Routes>

    </ThemeProvider>
      
  )
}

export default App
