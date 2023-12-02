import { Link } from "react-router-dom";
import { navItems } from "../../configs/constants";
import NavItem from "./partials/NavItem";
// import { useState } from "react";

const Navbar = () => {

    // const [openMenu, setOpenMenu] = useState(false);

    // const handleOpenMenu = () => setOpenMenu(true);
    // const handleCloseMenu = () => setOpenMenu(false);

    return (
        <div
            data-animation="default"
            className="navbar section-left-and-right-padding w-nav"
            data-easing2="ease"
            data-easing="ease"
            data-collapse="medium"
            data-w-id="30306952-503a-76c3-e360-6894065db957"
            role="banner"
            data-duration="400"
            id="navbar"
        >
            <nav className="custom-container">
                <div className="navbar-wrapper">

                    <Link to="/" aria-current="page" className="navbar-logo-wrapper w-nav-brand w--current">
                        <img
                            src="/images/together-logo-fysio.png"
                            loading="lazy"
                            sizes="(max-width: 479px) 100vw, (max-width: 767px) 31vw, (max-width: 991px) 28vw, (max-width: 1279px) 19vw, 228px"
                            srcSet="/images/together-logo-fysio-p-500.png 500w, /images/together-logo-fysio-p-800.png 800w, /images/together-logo-fysio-p-1080.png 1080w, /images/together-logo-fysio-p-1600.png 1600w, /images/together-logo-fysio.png 1778w"
                            alt=""
                        />
                    </Link>

                    <nav role="navigation" className="nav-menu-wrapper w-nav-menu">
                        <ul role="list" className="nav-menu w-list-unstyled">
                            {navItems.map((item) => <NavItem
                                key={item.id}
                                item={item}
                            />)}
                            <li className="nav-button-list">
                                <a href="#" className="secondary-button w-button">
                                    Enroll Now
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="menu-button w-nav-button">
                        <div className="hamburger-icon-wrapper">
                            <div data-w-id="30306952-503a-76c3-e360-6894065db977" className="hamburger-icon w-icon-nav-menu"></div>
                            <div data-w-id="5eee9d42-41ef-3f09-ebb0-8207f292eb1d" className="cross-icon">
                                <em className="cross-icon-text"></em>
                            </div>
                        </div>
                    </div>

                    <Link to="/login" className="secondary-button hidden w-button" style={{ fontSize: '16px' }}>
                        Login
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;