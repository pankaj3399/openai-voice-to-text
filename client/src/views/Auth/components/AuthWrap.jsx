import '../styles/login.css'

const AuthWrap = ({ children }) => {
    return (
        <>

            {/* Include the Bootstrap CSS link directly in the component */}
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" />

            {children}
        </>
    )
}

export default AuthWrap