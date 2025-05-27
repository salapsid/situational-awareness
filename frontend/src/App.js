import React from "react"
//import ntwrkDataFromBackEnd  from "./example_networks/case30.json"
import Routes from "./Routes.js"
import Logo from  "./components/parts/Logo.js"
import Header from  "./components/parts/Header.js"
import './App.css'

const App= ()=>{
    return(
        <React.Fragment>
           <div className= "appGrid" >
                <div className="logo">
                    <Logo></Logo>
                </div>
                <div className="header">
                    <Header> </Header>
                </div>
                <div className="appComponent">
                    <Routes></Routes>         
                </div>
               
            </div>
        </React.Fragment>
        )
}
export default App