import './App.css'
import RequireAuth from './components/shared/RequiredAuth';
import useAuthCheck from './hooks/useAuthCheck';
import Login from './views/Auth/Login';
import Signup from './views/Auth/Signup';
import ChatDashboard from './views/Chat/ChatDashboard';
import Home from './views/Home/Home'
import { Route, Routes } from 'react-router-dom';

function App() {

  // authentication checking
  const authChecked = useAuthCheck();

  // states
  // const [token, setToken] = useAtom(atomToken);
  // const [isAuthenticate, setIsAuthenticate] = useAtom(atomIsAuthenticate);
  // const [user, setUser] = useAtom(atomUser);

  // checking authentication
  if (!authChecked) return <div style={{ textAlign: 'center' }}>Checking authentication....</div>

 
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/chat" element={<RequireAuth>
          <ChatDashboard />
        </RequireAuth>}
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
