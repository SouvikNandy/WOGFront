import React, { useState, useEffect } from "react";
import queryString from 'query-string';
// import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import '../../../assets/css/ChatClient/Chat.css';
import { getBackendHOST } from "../../../utility/Utility";
import SocketInterface from "../../../utility/SocketInterface";

let socket = null;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    // const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = getBackendHOST();

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        // socket = io(ENDPOINT+'chat');
        socket = new SocketInterface('chat')

        setRoom(room);
        setName(name)
        console.log(socket)

        socket.joinRoom(name, room,  (error) => {
            if(error) {
                alert(error);
                }
            })
    }, [ENDPOINT, location.search]);
  
    useEffect(() => {
        socket.receiveMessage(message => {setMessages(messages => [ ...messages, message ]);});
        socket.roomUser(()=>{});
    
        // socket.on("roomData", ({ users }) => {
        //     setUsers(users);
        //     });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
            socket.sendMessage(message, () => setMessage(''));
        }
    }
    if(!socket) return(<React.Fragment></React.Fragment>);
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={socket.getConnectedUsers()}/>
        </div>
  );
}

export default Chat;
