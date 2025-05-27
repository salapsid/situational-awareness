import React from 'react'
import {HashRouter,Link} from 'react-router-dom'
class RouteNotFound extends React.Component{
    render(){
        return(
            <div> 
                <h2> Route Not Found; are you looking for </h2>
             <HashRouter>
                 <ul> 
                     <li><Link to='/'> Home </Link> </li>
                     <li><Link  to="/setup"> Setup </Link> </li>
                     <li><Link to='/analytics'> Analytics</Link> </li>
                     </ul>
             </HashRouter>
             
                
            </div>
            
        )
    }
}
export default RouteNotFound