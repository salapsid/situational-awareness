import React from "react";
import logo from "../../../public/images/aelios_logo.png";

const Logo = ({ height = 50 }) => {
  return <img src={logo} alt="logo" style={{ height }} />;
};

export default Logo;
