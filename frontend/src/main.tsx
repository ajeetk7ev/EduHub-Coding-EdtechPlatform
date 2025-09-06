import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
    <App />
  </BrowserRouter>

)
