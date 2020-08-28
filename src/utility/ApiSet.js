import HTTPRequestHandler from '../utility/HTTPRequests';

export const LoginAPI = (requestBody, callBackFunc) =>{
    let url = 'api/v1/user-authentication/?r='+ window.innerWidth;
    HTTPRequestHandler.post({url: url, requestBody: requestBody, callBackFunc: callBackFunc, errNotifierTitle: "Authentication failed!"})
}

export const SignupAPI = (requestBody, callBackFunc) =>{
    let url  = 'api/v1/user-registration/';
    HTTPRequestHandler.post({url: url, requestBody: requestBody, callBackFunc: callBackFunc, errNotifierTitle: "Signup failed!"})

}

export const FollowRequestAPI = (username, requestBody, callBackFunc) =>{
    // follow/unfollow user
    let url = 'api/v1/follow-requests/'+ username + '/'
    HTTPRequestHandler.post({url: url, requestBody: requestBody, includeToken:true, callBackFunc: callBackFunc})
}

export const DiscoverPeopleAPI = (callBackFunc) =>{
    let url = 'api/v1/discover-people/'
    HTTPRequestHandler.get({url: url, includeToken:true, callBackFunc: callBackFunc })
}

export const UserFeedsAPI = (callBackFunc) =>{
    let url = 'api/v1/feeds/'
    HTTPRequestHandler.get({url: url, includeToken:true, callBackFunc: callBackFunc })
}

export default {LoginAPI}