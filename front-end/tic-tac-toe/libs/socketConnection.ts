// * Do logic to connect to socket server with name and other info

import { io, Socket } from "socket.io-client";
import BoardState from "Types/BoardState";
const customParser = require('socket.io-json-parser');
import ButtonConfig from "Types/ButtonConfig";
import Player from "Types/Player";
import styles from '../styles/Home.module.css'

//* Connecting to server
export async function connectSocket():Promise<Socket>{

    let socket = io("http://localhost:8080",{
        parser:customParser
    });
  
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
        console.log('NEW PLAYER JOIN INTO SERVER')
        console.table(players);
        setPlayersList(players);
    })
}
    