import React from 'react'
import {Switch, HashRouter,Link,Route} from 'react-router-dom'
import Home from './pages/Home'
import Setup from './pages/Setup.js'
import Analytics from './pages/Analytics'
import Database from './pages/Database'
import RouteNotFound from './components/parts/routeNotFound404'

class Routes extends React.Component{
    render(){
        return(
            <HashRouter> 
               <Switch>
                    <Route exact path="/" render={() =><Home  /> } />
                    <Route exact path="/setup" render={() =><Setup/> } />
                    <Route exact path="/analytics" render={() =><Analytics {...this.props} /> } />
                    <Route exact path="/database" render={() => <Database /> } />
                    <Route render={() =><RouteNotFound /> } />
               </Switch>
                
            </HashRouter>
            
        )
    }

}
export default Routes