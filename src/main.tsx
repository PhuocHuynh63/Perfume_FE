import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './app/App.tsx'
import { Provider } from 'react-redux'
import store from '@redux/store/store.ts'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <ToastContainer />
      <App />
    </StrictMode>,
  </Provider>
)
