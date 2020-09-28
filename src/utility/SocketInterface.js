import io from "socket.io-client";
import { getBackendHOST } from "./Utility";

const ENDPOINT = getBackendHOST()



export class SocketInterface{
    constructor(namespace) {
        this.namespace = namespace
        this.room = ''
        this.socket = io( ENDPOINT + this.namespace);
        this.connectedUsers = [];
    }

    joinRoom = (name, room, errCallback) =>{
        this.room = room
        this.socket.emit('join', { name, room }, (error) => {
            if(error) {
                errCallback(error);
            }
        });
        console.log("join request sent", this.namespace, name, room)
    }

    receiveMessage = (callBack)=>{
        this.socket.on('getMessage', message => {
            console.log("receiveMessage", this.namespace, this.room, message)
            callBack(message)
        });
    }

    roomUser = (callBack) =>{
        this.socket.on('roomData', ({ users }) => {
            this.connectedUsers = users
            // console.log("roomUser", this.namespace, this.room, users)
            if (callBack) callBack(users)
        });
    }

    getConnectedUsers = () =>{
        return this.connectedUsers
    }

    sendMessage = (message, callBack) =>{
        this.socket.emit('message', message, callBack);
    }

    leaveRoom = (name) =>{
        let room = this.room
        this.socket.emit('leave', () => {});
        console.log("leave request sent", this.namespace, name, room)

    }
    
}


export default SocketInterface