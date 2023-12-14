import AuthWrap from './components/AuthWrap'
import useAuthLogout from '../../hooks/useAuthLogout'

const VerifyRequired = () => {

    // hooks
    const { logout } = useAuthLogout();

    return (
        <AuthWrap>
            <p style={{ textAlign: 'justify' }}>
                Please go to your email account to verify. If you verified try to re-login/refresh the page.
            </p>

            <div className="d-flex justify-content-center">
                <button
                    style={{
                        background: 'white',
                    }}
                    className='info-link mt-0'
                    onClick={() => logout()}
                >
                    Logout
                </button>
            </div>

        </AuthWrap>
    )
}

export default VerifyRequired