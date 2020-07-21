import React from 'react';
import {Route, Redirect } from 'react-router-dom';
import {retrieveAuthToken} from '../utility/Utility'


export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => retrieveAuthToken() ? 
        (<Component {...props} />) 
        : 
        (<Redirect to={{ pathname: "/signin/" }} />)
        }/>
    );

export default PrivateRoute;
