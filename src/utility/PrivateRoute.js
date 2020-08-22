import React from 'react';
import {Route, Redirect } from 'react-router-dom';
import {isAuthenticaed} from '../utility/Utility'


export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        let auth = isAuthenticaed();
        if (auth){
            console.log("rest in private route" , rest)
            return (<Component {...rest} {...props}  isAuthenticated={true} />) 
        }
        else{
            return (<Redirect to={{ pathname: "/signin/" }} />)
        }
        
    }
        
    
    }/>
    );

export default PrivateRoute;
