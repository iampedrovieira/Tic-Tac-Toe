// * Do logic to connect to socket server with name and other info

import { io, Socket } from "socket.io-client";

//* Connecting to server
export function connectSocket(setSocket:(socket:Socket) =>void,setPlayerId:(playerId:string) =>void,){

    let socket:Socket 
    socket = io("http://localhost:8080");
    socket.on("connect", () => {
        console.log('Conneted');
        setPlayerId(socket.id);
        setSocket(socket);
        return
    });
    return
}

export function sendPlayerInfo(socket:Socket,playerName:string):Boolean{

    socket.emit("newPlayerJoin",playerName);

    return true
}

// * Waitting for player

export function waitingPlayer(socket:Socket,setMessage:(message:string)=>void){

    socket.on('waitingPlayer',(message:string)=>{
        setMessage(message);
        return;
    })
    return;
}