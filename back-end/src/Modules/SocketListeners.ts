import { Socket } from "socket.io"
import Game from "../Models/Game";
import Player from "../Models/Player";

module.exports = (io:any,players:Player[],games:Game[],playersCheck:Map<string,boolean>)=>{

    const onConnection = (socket:Socket) =>{
        // * Put here the Listenters
      const {onDisconnecting} = require('./Handlers/DisconnectingHandler')(io,socket,players,games);
      socket.on("disconnecting",onDisconnecting);
        // * New player join the game
      const {onNewPlayerJoin,onPlayerCheck,onPlayerUnCheck} = require('./Handlers/ConnectionHandlers')(io,socket,players,games,playersCheck);
      socket.on("newPlayerJoin",onNewPlayerJoin);
      socket.on('playerCheck',onPlayerCheck);
      socket.on('playerUnCheck',onPlayerUnCheck);  
      
      const {onPlayerMove} = require('./Handlers/GameHandlers')(io,socket,players,games,playersCheck);
      socket.on("playerMove",onPlayerMove);

    }
    
    return io.on("connection",onConnection)
}