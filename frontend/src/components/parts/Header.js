import React from "react"
import {HashRouter,Link} from 'react-router-dom'


const headerStyle={
    padding: '40px',
    display: 'grid',
    gridTemplateColumns: '180px auto 100px 100px 100px',
    
}


const Header = ()=>{
    return(
    <>
      <div style={headerStyle}>
          <div >
              <h1> </h1>
          </div>
          <div >

          </div>
          <div>
          <HashRouter> <Link to='/'> <h2> HOME   </h2> </Link>  </HashRouter> 
          </div>
          <div  >
                <HashRouter> <Link to='/setup'>  <h2> SETUP </h2> </Link>  </HashRouter> 
            </div>
            <div >
                <HashRouter> <Link to='/analytics'> <h2> ANALYTICS</h2> </Link>  </HashRouter> 
            </div>
       </div>
          
        
    </>
    )
    
}

export default Header