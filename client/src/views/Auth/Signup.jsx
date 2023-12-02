import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { atomIsAuthenticate, atomToken, atomUser } from '../../configs/states/atomState';
import { axiosPOST } from '../../hooks/axiosMethods';
import AuthWrap from './components/AuthWrap';
import toast from 'react-hot-toast';

const SignUp = () => {

    // global
    const navigate = useNavigate();

    // states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [token] = useAtom(atomToken);
    const [isAuthenticate] = useAtom(atomIsAuthenticate);
    const [user] = useAtom(atomUser);

    // if token redirect
    useEffect(() => {
        if (isAuthenticate && token && user) {
            navigate('/chat')
        }
    }, [navigate, isAuthenticate, token, user])

    // signup action
    const handleSignup = async () => {
        try {
            // getting data
            const getPOST = await axiosPOST('auth/signup', { username, password }, setLoading);

            // if success
            if (getPOST.success) {
                setUsername('');
                setPassword('');
                toast.success(getPOST.message)
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
                                            value={username}
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
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-custom btn-block"
                                        onClick={() => handleSignup()}
                                    >
                                        {loading ? 'Signing Up...' : 'Singup'}
                                    </button>

                                </form>

                                <Link to="/" className="info-link">Terug</Link>

                                <Link to="/login" className="info-link">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthWrap>

    )
}

export default SignUp