import React from "react";
import { HashRouter, Link } from "react-router-dom";
import Logo from "./Logo";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <HashRouter>
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <Logo height={40} />
            <span className="ml-2">Situational Awareness</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/setup">
                  Setup
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/analytics">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
        </HashRouter>
      </div>
    </nav>
  );
};

export default Header;
