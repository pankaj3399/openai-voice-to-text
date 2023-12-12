import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

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

        if (!username || !email || !password || !confirmPassword) {
            toast.error('All fields are required!')
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Password not matched!')
            return;
        }

        try {
            // getting data
            const getPOST = await axiosPOST('auth/signup', { username, email, password }, setLoading);

            // if success
            if (getPOST.success) {
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setEmail('');
                setIsSuccess(true);
                toast.success(getPOST.message)
            }

        } catch (error) {
            setLoading(false);
            setIsSuccess(false);
            toast.error(`${error.response.data.message}`);
        }
    }

    return (
        <AuthWrap authEl>

            {isSuccess ? <p style={{ textAlign: 'justify' }}>You need to verify email. Please check your email </p> : <form autoComplete="off">

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
                    <label className="font-weight-bold">Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                <div className="form-group">
                    <label className="font-weight-bold">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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

            </form>}

        </AuthWrap>

    )
}

export default SignUp