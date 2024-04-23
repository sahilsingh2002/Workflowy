import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux';
import { store } from './redux/store.ts'
import {NextUIProvider} from '@nextui-org/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <NextUIProvider>

  <BrowserRouter>

    <div className='dark:bg-black h-full'> 
   
    <App />
    
    </div>
  </BrowserRouter>
  </NextUIProvider>
  </Provider>
)
