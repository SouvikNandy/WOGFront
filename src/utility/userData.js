import cover from '../assets/images/default-cover-img.jpg'
import { FetchUnreadNotificationCount, MarkNotificationAsRead, MarkNotificationAsSeen, MuteNotification } from './ApiSet';
import SocketInterface from './SocketInterface';
// import { retrieveFromStorage } from './Utility';

let NotificationSocket = null

export const getUserData = () =>{
    let userData = JSON.parse (localStorage.getItem("user_data"));
    return userData
}

export const defaultCoverPic = () =>{
    return cover
}


export const setNotificationHandler = (username) =>{
    NotificationSocket = new UserNotificationHandler(username)
    return NotificationSocket
}

export const getNotificationHandler = () =>{
    return NotificationSocket
}

export class UserNotificationHandler{
    constructor(username){
        this.username = username;
        this.unreadCount = 0;
        this.onRecvCallback = [];
        this.socket = new SocketInterface('notification')
        this.socket.joinRoom(this.username, this.username,  (error) => {
            if(error) {
                console.log("unable to join room on ns: notification")
                }
            })
        this.socket.receiveMessage(message => {
            // saveInStorage('unreadMsgCount', message.text)
            this.unreadCount += message.text
            this.onRecvCallback.map(cb => cb(message.text))

        });
        FetchUnreadNotificationCount(this.getUnreadCount.bind(this))
    }


    getUnreadCount(data){
        // saveInStorage('unreadMsgCount', data.data)
        this.unreadCount += data.data
        // console.log("getUnreadCount this", this.unreadCount)
        this.onRecvCallback.map(cb => cb(this.unreadCount))
    }

    registerCallbackList = (callBack) =>{
        this.onRecvCallback.push(callBack)
    }
    deregisterCallback = () =>{
        this.onRecvCallback.pop()
    }

    isUnreadExists = () =>{
        if(this.unreadCount > 0) return true;
        return false
    }

    markAsSeen = (nidArr) =>{
        MarkNotificationAsSeen(nidArr, null)
    }

    markAsRead = (nid) =>{
        MarkNotificationAsRead(nid, null)
    }

    turnOffNotification = (nid)=>{
        MuteNotification(nid, null)
    }

    
}
export default getUserData;