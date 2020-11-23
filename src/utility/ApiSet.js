import HTTPRequestHandler from '../utility/HTTPRequests';
import { isAuthenticated } from './Utility';

export const LoginAPI = (requestBody, callBackFunc, errCallBack) =>{
    let url = 'api/v1/user-authentication/?r='+ window.innerWidth;
    HTTPRequestHandler.post({url: url, requestBody: requestBody, callBackFunc: callBackFunc,errCallBackFunc:errCallBack, errNotifierTitle: "Authentication failed!"})
}

export const SignupAPI = (requestBody, callBackFunc, errCallBack) =>{
    let url  = 'api/v1/user-registration/';
    HTTPRequestHandler.post({url: url, requestBody: requestBody, callBackFunc: callBackFunc, errCallBackFunc:errCallBack, errNotifierTitle: "Signup failed!"})

}

export const FollowRequestAPI = (username, requestBody, callBackFunc) =>{
    // follow/unfollow user
    let url = 'api/v1/follow-requests/'+ username + '/'
    HTTPRequestHandler.post({url: url, requestBody: requestBody, includeToken:true, callBackFunc: callBackFunc})
}

export const AllFollowingAndFollowers = (callBackFunc) =>{
    let url = 'api/v1/all-friends/'
    HTTPRequestHandler.get({url: url, includeToken:true, callBackFunc: callBackFunc })
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
    HTTPRequestHandler.get({url: url, includeToken:isAuthenticated()?true: false, callBackFunc: callBackFunc })
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

// user-tags
export const ApproveTagAPI = (pid, username, callBackFunc) =>{
    let url = "api/v1/view-tags/"+username+"/?pid="+pid+"&action=approve"
    HTTPRequestHandler.post({url:url, requestBody:{}, includeToken: true, callBackFunc: callBackFunc})
}

export const RemoveTagAPI = (pid, username, callBackFunc) =>{
    let url = "api/v1/view-tags/"+username+"/?pid="+pid+"&action=remove"
    HTTPRequestHandler.post({url:url, requestBody:{}, includeToken: true, callBackFunc: callBackFunc})
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

// User Privacy
export const GetUserPrivacyAPI = (callBackFunc) =>{
    let url = "api/v1/user-privacy/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const UpdateUserPrivacyAPI = (key, value, callBackFunc) =>{
    let url = "api/v1/user-privacy/"

    HTTPRequestHandler.post({url:url, requestBody: {[key]: value}, includeToken: true, callBackFunc: callBackFunc})
}

// Manage mails

export const GetUserMailsAPI = (callBackFunc) =>{
    let url = "api/v1/manage-mails/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const AddMailsAPI = (email, callBackFunc) =>{
    let url = "api/v1/manage-mails/"
    HTTPRequestHandler.post({url:url, requestBody: {email: email}, includeToken: true, callBackFunc: callBackFunc})
}

export const DeleteMailAPI = (email, callBackFunc) =>{
    let url = "api/v1/manage-mails/?q="+email
    HTTPRequestHandler.delete({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const SetEmailAsDefault = (email, callBackFunc) =>{
    let url = "api/v1/manage-mails/"
    HTTPRequestHandler.put({url:url, requestBody: {email: email}, includeToken: true, callBackFunc: callBackFunc})
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
export const FetchUnreadNotificationCount =(callBackFunc) =>{
    let url = "api/v1/notification-action/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}
export const MarkNotificationAsSeen =(nidList, callBackFunc) =>{
    let url = "api/v1/notification-action/"
    HTTPRequestHandler.post({url:url, requestBody:{action: 'markseen', nid: nidList}, includeToken: true, callBackFunc: callBackFunc})
}
export const MarkNotificationAsRead =(nid, callBackFunc) =>{
    let url = "api/v1/notification-action/"
    HTTPRequestHandler.post({url:url, requestBody:{action: 'markread', nid: nid}, includeToken: true, callBackFunc: callBackFunc})
}
export const MuteNotification =(nid, callBackFunc) =>{
    let url = "api/v1/notification-action/"
    HTTPRequestHandler.post({url:url, requestBody:{action: 'turnoff', nid: nid}, includeToken: true, callBackFunc: callBackFunc})
}

export const RemoveNotification =(nid, callBackFunc) =>{
    let url = "api/v1/notification-action/"
    HTTPRequestHandler.post({url:url, requestBody:{action: 'remove', nid: nid}, includeToken: true, callBackFunc: callBackFunc})
}

export const BlockUser = (username, callBackFunc) =>{
    let url = "api/v1/block-profile/"
    HTTPRequestHandler.post({url:url, requestBody:{username: username}, includeToken: true, callBackFunc: callBackFunc})
}

export const UnBlockUserAPI = (username, callBackFunc) =>{
    let url = "api/v1/block-profile/?q="+username
    HTTPRequestHandler.delete({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const GetBlockedUserListAPI = (callBackFunc) =>{
    let url = "api/v1/block-profile/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const ReportContentAPI = (requestBody, callBackFunc) =>{
    let url = "api/v1/report-request/"
    HTTPRequestHandler.post({url:url, requestBody:requestBody, includeToken: true, callBackFunc: callBackFunc})
}

export const SearchOnFriendsAPI = (searchKey, callBackFunc) =>{
    if(!isAuthenticated()) return;
    console.log("SearchOnFriendsAPI", searchKey, callBackFunc)
    let url = searchKey? "api/v1/search-friends/?search="+searchKey : "api/v1/search-friends/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const ChangePasswordAPI = (requestBody, callBackFunc) =>{
    let url = "api/v1/change-password/"
    HTTPRequestHandler.post({url:url, requestBody:requestBody, includeToken: true, callBackFunc: callBackFunc})
}

// Chat APIs
export const ChatListAPI =(callBackFunc) =>{
    let url = "api/v1/chat-list/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const RoomMessagesAPI =(roomName, callBackFunc) =>{
    let url = "api/v1/room-messages/"+roomName+"/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const SearchOnChatListAPI = (searchKey, callBackFunc) =>{
    let url = "api/v1/chat-list/?search="+searchKey
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}

export const CheckIfUnreadChats =(callBackFunc)=>{
    let url = "api/v1/unread-chat/"
    HTTPRequestHandler.get({url:url, includeToken: true, callBackFunc: callBackFunc})
}
export default {LoginAPI}