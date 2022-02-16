import { Socket } from "socket.io";
import { io } from "socket.io-client";
import Game from "../../Models/Game";
import Player from "../../Models/Player";

module.exports = (io:any,socket:Socket,players:Player[],games:Game[])=>{

    const onDisconnecting = function (){
        var playerPosition:number = 0;
        players.forEach((player)=>{
            if(player.getId() == socket.id){
                playerPosition = players.indexOf(player);
                players.splice(players.indexOf(player),1);
                return;
            } 
        });
        io.emit("onPlayersChange",players);
        // * Verify if the player left was playing
        if (playerPosition<=1){
            // * Start new game with player[0] and player[1]
            games.pop();

            if(players.length>=2){
                const gameEndStatus ={
                    'playerWin':players[0].getName(),
                    'isDraw':false,
                    'playerWinId':players[0].getId(),
                    'playerLossId':'',
                    'playerNextId':players[1].getId(),
                    'nextPlayer':players[1].getName()
                }
                io.emit("gameEnd",gameEndStatus);
                console.log('Waittting...');
                setTimeout(()=>{
                    io.to(players[0].getId()).emit('playerAvailable');
                    io.to(players[1].getId()).emit('playerAvailable')
                },2500);
            }else{
                io.emit("waitingPlayer",'Waiting for player');
            }
            
            
        }

        
        // * Send to all players a list of players on
        // * Put here the Listenters
    }   

    return {onDisconnecting}
}