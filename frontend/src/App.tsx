import { Login } from './components/login/Login'
import { Signup } from './components/signup/Signup'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"
import { useLocation } from 'react-router-dom'





function App() {
  const {pathname} = useLocation();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Routes>

    </ThemeProvider>
      
  )
}

export default App
