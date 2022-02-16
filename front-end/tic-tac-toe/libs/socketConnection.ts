// * Do logic to connect to socket server with name and other info

import { io, Socket } from "socket.io-client";
import ButtonConfig from "Types/ButtonConfig";
import Player from "Types/Player";
import styles from '../styles/Home.module.css'

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

export function emitSendPlayerInfo(socket:Socket,playerName:string):void{

    socket.emit("newPlayerJoin",playerName);
    return
}

// * Waitting for player

export function onWaitingPlayer(socket:Socket,setMessage:(message:string)=>void,setButtonsState:(buttonsState:ButtonConfig[][])=>void){

    socket.on('waitingPlayer',(message:string)=>{
        setMessage(message);
        setButtonsState(
            [
            [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
            [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
            [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}]
          ]);
        return;
    })
    return;
}

export function onPlayersChange(socket:Socket,setPlayersList:(players:Player[])=>void){

    socket.on('onPlayersChange',(players:Player[])=>{
        setPlayersList(players);
    })
}
    