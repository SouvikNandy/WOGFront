import io from "socket.io-client";
import { getBackendHOST } from "./Utility";

const ENDPOINT = getBackendHOST()



export class SocketInterface{
    constructor(namespace) {
        this.socket = io( ENDPOINT + namespace);
        this.connectedUsers = [];
    }

    joinRoom = (name, room, errCallback) =>{
        this.socket.emit('join', { name, room }, (error) => {
            if(error) {
                errCallback(error);
            }
        });
    }

    receiveMessage = (callBack)=>{
        this.socket.on('getMessage', message => {
            callBack(message)
        });
    }

    roomUser = (callBack) =>{
        this.socket.on('getMessage', ({ users }) => {
            this.connectedUsers = users
            if (callBack) callBack(users)
        });
    }

    getConnectedUsers = () =>{
        return this.connectedUsers
    }

    sendMessage = (callBack) =>{
        socket.emit('message', message, callBack);
    }
    
}


export default SocketInterface