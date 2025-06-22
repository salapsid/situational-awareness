import React from "react";
import Routes from "./Routes.js";
import Header from "./components/parts/Header.js";
import "./App.css";

const App = () => {
  return (
    <>
      <Header />
      <div className="container mt-4 main-container">
        <Routes />
      </div>
    </>
  );
};

export default App;
