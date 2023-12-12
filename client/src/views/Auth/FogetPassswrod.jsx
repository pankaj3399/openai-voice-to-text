import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { atomIsAuthenticate, atomToken, atomUser } from '../../configs/states/atomState';
import { setOnLocalStorage } from '../../hooks/helpers';
import { axiosPOST } from '../../hooks/axiosMethods';
import AuthWrap from './components/AuthWrap';
import toast from 'react-hot-toast';

const ForgetPassword = () => {

    // global
    const navigate = useNavigate();

    // states
    const [email, setEmail] = useState('');

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
    const handleReset = async () => {
        try {
            // getting data
            const getPOST = await axiosPOST('auth/signin', { email }, setLoading);

            // if success
            if (getPOST.success) {
                setToken(getPOST.data.accessToken);
                setUser(getPOST.data.user);
                setIsAuthenticate(true);

                setEmail('');

                setOnLocalStorage('token', getPOST.data.accessToken);
            }
        } catch (error) {
            setLoading(false);
            toast.error(`${error.response.data.message}`);
        }
    }

    return (
        <AuthWrap>
            <form autoComplete="off" className=''>

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
                    {loading ? 'Reseting...' : 'Reset Password'}
                </button>

            </form>
        </AuthWrap>

    )
}

export default ForgetPassword