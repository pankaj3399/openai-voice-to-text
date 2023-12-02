import { Link } from "react-router-dom"
import useAuthLogout from "../../../../hooks/useAuthLogout";

const ChatNavbar = () => {

    // hooks
    const { logout } = useAuthLogout();

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ padding: '0.8rem 2rem' }}>

                <img src="/images/logo_only_blue.png" alt="Fysio.AI Logo" className="header-logo-navbar" />

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/" style={{ textTransform: "capitalize" }}>Home <span className="sr-only">(current)</span></Link>
                        </li>
                    </ul>
                </div>

                <button
                    className="logout-icon"
                    onClick={() => logout()}
                >
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </nav>
        </>
    )
}

export default ChatNavbar