import { useContext, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
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
  const { currentUser, loading } = useContext(AuthContext);

  const AuthProtection = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
      // Check if auth state is still valid
      const checkAuth = async () => {
        try {
          // Get current auth token
          const token = await auth.currentUser?.getIdToken(true);
          if (!token) {
            navigate('/login');
          }
        } catch (error) {
          console.error('Auth token error:', error);
          navigate('/login');
        }
      };

      checkAuth();
    }, [navigate]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    // For email users, verify email
    if (!currentUser.isAnonymous && !currentUser.emailVerified) {
      signOut(auth).catch(error => {
        console.error('Error during logout:', error);
      });
      return <Navigate to="/login" />;
    }

    return children;
  };

  if (loading) {
    return <div>Loading...</div>;
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
        <Route path='/signup' element={
          currentUser ? <Navigate to="/" /> : <Signup />
        } />
        <Route path='/login' element={
          currentUser ? <Navigate to="/" /> : <Login />
        } />
        <Route path='/*' element={<PageNotFound />} />
      </Routes>
      <FullImg />
    </BrowserRouter>
  );
}

export default App
