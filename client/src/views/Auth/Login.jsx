import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { atomIsAuthenticate, atomToken, atomUser } from '../../configs/states/atomState';
import { setOnLocalStorage } from '../../hooks/helpers';
import { axiosPOST } from '../../hooks/axiosMethods';
import AuthWrap from './components/AuthWrap';
import toast from 'react-hot-toast';

const Login = () => {

    // global
    const navigate = useNavigate();

    // states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useAtom(atomToken);
    const [isAuthenticate, setIsAuthenticate] = useAtom(atomIsAuthenticate);
    const [user, setUser] = useAtom(atomUser);

    // if token redirect
    useEffect(() => {
        if (isAuthenticate && token && user) {
            navigate('/chat')
        }
    }, [navigate, isAuthenticate, token, user])

    // login action
    const handleLogin = async () => {
        try {
            // getting data
            const getPOST = await axiosPOST('auth/signin', { username, password }, setLoading);

            // if success
            if (getPOST.success) {
                setToken(getPOST.data.accessToken);
                setUser(getPOST.data.user);
                setIsAuthenticate(true);

                setUsername('');
                setPassword('');

                setOnLocalStorage('token', getPOST.data.accessToken);
            }
        } catch (error) {
            setLoading(false);
            toast.error(`${error.response.data.message}`);
        }
    }

    return (
        <AuthWrap>

            <div className="container">
                <div className="row justify-content-center align-items-center min-vh-100">
                    <div className="col-lg-4 col-md-6 col-sm-8">
                        <div className="card shadow-lg">
                            <div className="card-body">

                                <div className="text-center mb-4">
                                    <img src="/images/fysio_ai_logo2.png" alt="Fysio.AI Logo" className="logo" />
                                </div>

                                <form autoComplete="off" className=''>

                                    <div className="form-group">
                                        <label className="font-weight-bold">Username:</label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control"
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="font-weight-bold">Password:</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-custom btn-block"
                                        onClick={() => handleLogin()}
                                    >
                                        {loading ? 'Loging In...' : 'Login'}
                                    </button>

                                </form>

                                <Link to="/" className="info-link">Terug</Link>

                                <Link to="/signup" className="info-link">Register</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthWrap>

    )
}

export default Login