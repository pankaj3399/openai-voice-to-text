import { useNavigate, useParams } from 'react-router-dom';
import AuthWrap from './components/AuthWrap';
import { useEffect, useState } from 'react';
import { axiosPatch } from '../../hooks/axiosMethods';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const VerifyAccount = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const [laoding, setLoading] = useState(false);
    const [isSuccess, setIsSuccss] = useState(false);

    // if success
    useEffect(() => {
        if (isSuccess) {
            navigate('/login');
            toast.success('Email is verified you can login')
        }
    }, [isSuccess, navigate])

    // calling api to update isActive
    useEffect(() => {
        const verifyAcc = async () => {

            const decodedToken = jwtDecode(token);

            if (decodedToken.exp * 1000 > new Date().getTime()) {
                try {
                    // getting data
                    const getPOST = await axiosPatch(`auth/verify/${decodedToken.email}`, {}, setLoading, undefined);

                    // if success
                    if (getPOST.success) {
                        setIsSuccss(true);
                    }

                } catch (error) {
                    setLoading(false);
                    setIsSuccss(false);
                }
            } else {
                toast.error('Token expired! Contact Admin')
            }

        }
        verifyAcc();
    }, [token])

    return (
        <AuthWrap>
            <div style={{ textAlign: 'center' }}>{laoding ? 'Loading....' : isSuccess && 'Verified'}</div>
        </AuthWrap>
    )
}

export default VerifyAccount