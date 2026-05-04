import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import store, { persistor } from './Store/store'
import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'react-datepicker/dist/react-datepicker.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ToastContainer autoClose={3000} className="zIndex99999" />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
