import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <React.StrictMode>
    <div className='dark:bg-black w-full h-full'>

    <App />
    </div>
  </React.StrictMode>
  </BrowserRouter>
)
