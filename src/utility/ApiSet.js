import HTTPRequestHandler from '../utility/HTTPRequests';
import { isAuthenticated } from './Utility';

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

export const LikePostAPI = (requestBody, callBackFunc) =>{
    let url = 'api/v1/like-post/';
    HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: callBackFunc})    
}

export const PostLikedByUsers = (pid, callBackFunc) =>{
    let url = 'api/v1/like-post/?pid='+pid;
    HTTPRequestHandler.get({url:url, includeToken: false, callBackFunc: callBackFunc})
}

export const SavePostAPI = (requestBody, callBackFunc) =>{
    let url = 'api/v1/save-post/';
    HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: callBackFunc})    

}

export const RegularShotsAPI = (callBackFunc) =>{
    let url = 'api/v1/regular-shots/'
    HTTPRequestHandler.get({url: url, includeToken:false, callBackFunc: callBackFunc })
}

export const AddCommentAPI = (requestBody, callBackFunc) =>{
    let url = 'api/v1/post-comments/'
    HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: callBackFunc})
}

export const GetCommentsAPI = (pid, callBackFunc) =>{
    let url = 'api/v1/post-comments/?pid='+pid
    let includeToken = isAuthenticated()? true: false
    HTTPRequestHandler.get({url:url, includeToken: includeToken, callBackFunc: callBackFunc})
}

export const GetRepliesAPI = (pid, parent, callBackFunc) =>{
    let url = 'api/v1/post-comments/?pid='+ pid + '&parent='+parent
    let includeToken = isAuthenticated()? true: false
    HTTPRequestHandler.get({url:url, includeToken: includeToken, callBackFunc: callBackFunc})
}

export const LikeCommentAPI = (requestBody, callBackFunc) =>{
    let url = 'api/v1/like-comment/';
    HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: callBackFunc})

}

export const CommentLikedByUsersAPI = (pid, cid, callBackFunc) =>{
    let url = 'api/v1/like-comment/?pid='+pid +'&cid='+cid;
    HTTPRequestHandler.get({url:url, includeToken: false, callBackFunc: callBackFunc})
}

// user - reviews
export const UserReviewsAPI = (username, callBackFunc) =>{
    let url = "api/v1/user-review/"+username+'/'
    let includeToken = isAuthenticated()? true: false
    HTTPRequestHandler.get({url:url, includeToken: includeToken, callBackFunc: callBackFunc})
}

export const AddUserReviewsAPI = (username, requestBody, callBackFunc) =>{
    let url = "api/v1/user-review/"+username +'/'
    HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: callBackFunc})
}

export const UpdateUserReviewsAPI = (username, requestBody, callBackFunc) =>{
    let url = "api/v1/user-review/"+username+'/'
    HTTPRequestHandler.put({url:url, requestBody: requestBody, includeToken: true, callBackFunc: callBackFunc})
}

export const DeleteUserReviewsAPI = (username, revID, callBackFunc) =>{
    let url = "api/v1/user-review/"+username+"/?rid="+revID
    HTTPRequestHandler.delete({url:url, includeToken: true, callBackFunc: callBackFunc})
}

// platform suggestions
export const UserSuggestionAPI = (callBackFunc) =>{
    let url = "api/v1/user-suggestion/"
    let includeToken = isAuthenticated()? true: false
    HTTPRequestHandler.get({url:url, includeToken: includeToken, callBackFunc: callBackFunc})
}

export const AddSuggestionAPI = (requestBody, callBackFunc) =>{
    let url = "api/v1/user-suggestion/"
    HTTPRequestHandler.post({url:url, requestBody: requestBody, includeToken: true, callBackFunc: callBackFunc})
}

export const DeleteSuggestionAPI = (revID, callBackFunc) =>{
    let url = "api/v1/user-suggestion/?rid="+revID
    HTTPRequestHandler.delete({url:url, includeToken: true, callBackFunc: callBackFunc})
}

// fetch notifications
export const FetchNotifications = (callBackFunc) =>{
    let url = "api/v1/user-notifications/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})

}
export default {LoginAPI}