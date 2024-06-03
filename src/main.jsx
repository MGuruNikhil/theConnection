import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'
import { ImgContextProvider } from './context/ImgContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthContextProvider>
        <ChatContextProvider>
          <ImgContextProvider>
            <App />
          </ImgContextProvider>
        </ChatContextProvider>
      </AuthContextProvider>
    </React.StrictMode>,
)
