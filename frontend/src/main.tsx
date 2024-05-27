import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux';
import { store } from './redux/store.ts'
import {NextUIProvider} from '@nextui-org/react'
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <NextUIProvider>
  <BrowserRouter>
    <App />

  </BrowserRouter>
  </NextUIProvider>
  </Provider>
)
