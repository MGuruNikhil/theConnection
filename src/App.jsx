import { useContext, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Chat from './pages/Chat'
import { AuthContext } from './context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import Profile from './pages/Profile'
import PageNotFound from './pages/pageNotFound'
import FullImg from './components/FullImg'

function App() {

  const {currentUser} = useContext(AuthContext);

  const AuthProtection = ({children}) => {
    if(currentUser != null && currentUser != {} && currentUser != undefined) {
      if(!(currentUser.emailVerified)) {
        signOut(auth)
        .then(() => {
            console.log('User logged out successfully');
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
      }
    }
    else {
      return <Navigate to={"/login"} />
    }
    return children;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <AuthProtection>
            <Chat />
          </AuthProtection>
        } />
        <Route path='/profile' element={
          <AuthProtection>
            <Profile />
          </AuthProtection>
        }/>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<PageNotFound />} />
      </Routes>
      <FullImg />
    </BrowserRouter>
  )
}

export default App
