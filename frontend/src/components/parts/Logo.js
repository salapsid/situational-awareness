import React from "react"

import logo from '/public/images/aelios_logo.png'

const imgStyle={
    width: '100%',
    height: '100%',
   
}


const Logo=()=>{
    return(
        <>
       
       <img src={logo} alt="hello" style={imgStyle}></img>
       
       </>
    )
}

export default Logo