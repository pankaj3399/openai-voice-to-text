import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { atomIsAuthenticate, atomToken, atomUser } from '../../configs/states/atomState';
import { axiosPOST } from '../../hooks/axiosMethods';
import AuthWrap from './components/AuthWrap';
import toast from 'react-hot-toast';

const ForgetPassword = () => {

    // global
    const navigate = useNavigate();

    // states
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [token] = useAtom(atomToken);
    const [isAuthenticate] = useAtom(atomIsAuthenticate);
    const [user] = useAtom(atomUser);

    // if token redirect
    useEffect(() => {
        if (isAuthenticate && token && user) {
            navigate('/chat')
        }
    }, [navigate, isAuthenticate, token, user])

    // login action
    const handleReset = async () => {
        try {
            // getting data
            const getPOST = await axiosPOST('auth/forget-password', { email }, setLoading);

            // if success
            if (getPOST.success) {
                setEmail('');
                setIsSuccess(true);
            }
        } catch (error) {
            setLoading(false);
            setIsSuccess(false);
            toast.error(`${error.response.data.message}`);
        }
    }

    return (
        <AuthWrap authEl>
            {isSuccess ? <p style={{ textAlign: 'justify' }}>Reset password link sent to your email. Please check your email </p> : <form autoComplete="off" className=''>

                <div className="form-group">
                    <label className="font-weight-bold">Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="button"
                    className="btn btn-custom btn-block"
                    onClick={() => handleReset()}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

            </form>}
        </AuthWrap>
    )
}

export default ForgetPassword