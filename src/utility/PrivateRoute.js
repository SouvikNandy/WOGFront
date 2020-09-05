import React from 'react';
import {Route, Redirect } from 'react-router-dom';
import {isAuthenticated} from '../utility/Utility'


export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        let auth = isAuthenticated();
        if (auth){
            return (<Component {...rest} {...props}  isAuthenticated={true} />) 
        }
        else{
            return (<Redirect to={{ pathname: "/signin/" }} />)
        }
        
    }
        
    
    }/>
    );

export default PrivateRoute;
