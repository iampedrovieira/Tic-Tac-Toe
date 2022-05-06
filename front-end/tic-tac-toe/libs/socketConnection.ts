// * Do logic to connect to socket server with name and other info

import { io, Socket } from "socket.io-client";
import Player from "Types/Player";
//* Connecting to server
export async function connectSocket():Promise<Socket>{

    let socket = io("http://localhost:8080");
  
    const promiseSocketConnection = new Promise<Socket>((resolve, reject) => {
        socket.on("connect", () => {
     
            resolve(socket);
        });
     
        //Colocar aqui para o reject
    });

    await promiseSocketConnection;

    return socket

}

export function emitSendPlayerInfo(socket:Socket,playerName:string):void{

    socket.emit("newPlayerJoin",playerName);
    return
}

// * Waitting for player

export function onWaitingPlayer(socket:Socket,setMessage:(message:string)=>void,){

    socket.on('waitingPlayer',(msg:string)=>{
        setMessage(msg)
        return;
    })
    return;
}

export function onPlayersChange(socket:Socket,setPlayersList:(players:Player[])=>void){

    socket.on('onPlayersChange',(players:Player[])=>{
        setPlayersList(players);
    })
}
    