import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import { toast } from "react-toastify";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

function NavBar() {
  const navigate = useNavigate();
  const { setLoggedUser } = useContext(UserContext)
  const { loggedUser } = useContext(UserContext);

  const logout = (e) => {
    e.preventDefault();
    window.sessionStorage.removeItem("tkn");
    setLoggedUser(null);
    toast.success("Logged out")
  }

  return (
    <nav className="navbar shadow navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand header-media-logo" to="/">
          <div data-testid="logo" className="media p-1">
            <img src="/logo.png" alt=""></img>
          </div>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Listings
              </NavLink>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/">
                    Live listings
                  </Link>
                </li>


                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/results">
                    Ended listings
                  </Link>
                </li>
              </ul>
            </li>
            
            {loggedUser && <li className="nav-item">
                <NavLink className="nav-link" to="/listing/create">
                  Sell a property
                </NavLink>
              </li>
            }
             
            
          </ul>
          {
            loggedUser && <ul className="navbar-nav me-5">
              <div className="dropdown text-end" id="profileDropdown">
                <Link
                  className="d-block link-dark text-decocation-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  area-aria-expanded="false"
                >
                  <img
                    src="/default-user-image.png"
                    alt="profile pic"
                    width="32"
                    height="32"
                    className="rounded-circle"
                  ></img>
                </Link>
                <ul className="dropdown-menu text-small shadow">
                  <li>
                    <span className="mx-3 my-1 fw-bold">Welcome, {loggedUser.username}</span>
                  </li>
                  <li>
                    <Link data-bs-toggle="tooltip" data-bs-title="Default tooltip" className="dropdown-item" to="/profile">
                      My profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                  <Tooltip title={<Typography fontSize={14}>Logout</Typography>} placement="bottom">
                    <Link id="logoutButton" className="dropdown-item" onClick={logout}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                      </svg>
                    </Link>
                    </Tooltip>
                  </li>
                </ul>
              </div>
            </ul>
          }
          {
            loggedUser === null &&
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="btn btn-outline-dark mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right me-2" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                  <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                </svg>
                Log in
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="btn btn-dark"
              >
                Register
              </button>
            </>
          }

        </div>
      </div>
    </nav>
  );
}

export default NavBar;
