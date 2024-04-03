
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { Login_page, Signup_page } from './pages'

// import  Navbar  from './components/navbar/Navbar'



function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <Navbar/> */}
    <Routes>
      <Route path='/login' element={<Login_page/>}/>
      <Route path='/signup' element={<Signup_page/>}/>
    </Routes>

    </ThemeProvider>
      
  )
}

export default App
