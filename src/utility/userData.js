import cover from '../assets/images/default-cover-img.jpg'
import default_profile_pic from '../assets/images/icons/default_profile.png'
import { FetchUnreadNotificationCount, MarkNotificationAsRead, MarkNotificationAsSeen, MuteNotification, SearchOnFriendsAPI } from './ApiSet';
import SocketInterface from './SocketInterface';
import { getCurrentTimeInMS, retrieveFromStorage, saveInStorage } from './Utility';
// import { retrieveFromStorage } from './Utility';

let NotificationSocket = null

export const getUserData = () =>{
    let userData = JSON.parse (localStorage.getItem("user_data"));
    return userData
}

export const defaultCoverPic = () =>{
    return cover
}

export const defaultProfilePic = () =>{
    return default_profile_pic
}

export const setNotificationHandler = (username) =>{
    console.log("setNotificationHandler called")
    NotificationSocket = new UserNotificationHandler(username)
    return NotificationSocket
}

export const getNotificationHandler = () =>{
    return NotificationSocket
}

export class UserNotificationHandler{
    constructor(username){
        // class to hadle any private data broadcasted on notification channel
        // received data will have a `key` to distinguish data
        this.username = username;
        this.unreadCount = {NOTIFICATON: 0, CHAT: 0};
        this.onRecvCallback = [];
        this.socket = new SocketInterface('notification')
        this.socket.joinRoom(this.username, this.username,  (error) => {
            if(error) {
                console.log("unable to join room on ns: notification")
                }
            })
        this.socket.receiveMessage(message => {
            // saveInStorage('unreadMsgCount', message.text)
            this.unreadCount[message.text.key] += 1
            this.onRecvCallback.map(cb => cb(message.text))

        });
        FetchUnreadNotificationCount(this.getUnreadNotificationCount.bind(this))
    }


    getUnreadNotificationCount(data){
        // saveInStorage('unreadMsgCount', data.data)
        this.unreadCount["NOTIFICATON"] += data.data
        // console.log("getUnreadCount this", this.unreadCount)
        this.onRecvCallback.map(cb => cb(this.unreadCount["NOTIFICATON"]))
    }

    registerCallbackList = (callBack) =>{
        this.onRecvCallback.push(callBack)
    }
    deregisterCallback = () =>{
        this.onRecvCallback.pop()
    }

    isUnreadExists = (key="NOTIFICATION") =>{
        if(this.unreadCount[key] > 0) return true;
        return false
    }

    markAsSeen = (nidArr) =>{
        // notification specific
        MarkNotificationAsSeen(nidArr, null)
    }

    markAsRead = (nid) =>{
        // notification specific
        MarkNotificationAsRead(nid, null)
    }

    turnOffNotification = (nid)=>{
        // notification specific
        MuteNotification(nid, null)
    }

    
}


// manage recent friends
export const UserRecentFriends =(callBackFunc =null, refresh = false) =>{
    let retrieved =  retrieveFromStorage("recent_friends");
    if(retrieved){
        retrieved =  JSON.parse (retrieved);
        if(refresh && getCurrentTimeInMS() - retrieved["updated_at"]> 1000){
            SeachFriendsFromBackend(callBackFunc) 
        }

        else if (callBackFunc) {
            callBackFunc(retrieved);
        }
        else {
            return retrieved
        }
    }
    else{
        SeachFriendsFromBackend(callBackFunc)
    }
}

const SeachFriendsFromBackend = (callBackFunc)=>{
    SearchOnFriendsAPI(null, (data)=>{
        let resultToStore ={
            totalFriends: data.count,
            results: data.results,
            updated_at: getCurrentTimeInMS()
        }
        saveInStorage('recent_friends', JSON.stringify (resultToStore));
        callBackFunc(resultToStore)
    })

}

export const UpdateRecentFriends = (key, userRecord) =>{
    let retrieved =  retrieveFromStorage("recent_friends");
    if(!retrieved) return false
    retrieved =  JSON.parse (retrieved);
    let resultToStore = {}
    if(key=== "follow"){
        resultToStore ={
            totalFriends: retrieved.totalFriends + 1,
            results: [...retrieved.results, userRecord],
            updated_at: getCurrentTimeInMS()
        }
    }
    else{
        resultToStore ={
            totalFriends: retrieved.totalFriends - 1,
            results: retrieved.results.filter(ele => ele.username !== userRecord.username),
            updated_at: getCurrentTimeInMS()
        }
    }
    saveInStorage('recent_friends', JSON.stringify (resultToStore));
}

export default getUserData;