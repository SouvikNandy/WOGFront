import React from 'react';
import {Route, Redirect } from 'react-router-dom';
import {retrieveAuthToken} from '../utility/Utility'


export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        let auth = retrieveAuthToken();
        console.log("protected route", auth);
        if (auth){
            return (<Component {...props}  isAuthenticated={true} username={auth[1]}/>) 
        }
        else{
            return (<Redirect to={{ pathname: "/signin/" }} />)
        }
        
    }
        
    
    }/>
    );

export default PrivateRoute;
