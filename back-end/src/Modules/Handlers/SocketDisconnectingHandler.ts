import { Socket } from "socket.io";
import Player from "../../Models/Player";

module.exports = (socket:Socket,players:Player[])=>{

    const onDisconnecting = function (){
        var playerPosition:number = 0;
        players.filter((player)=>{
            if(player.getId() == socket.id){
                console.log('Player -> '+player.getName()+ ' Left.');
                playerPosition = players.indexOf(player);
                return player
            } 
        });
        // * Verify if the player left was playing
        if (playerPosition<=1){
            // * Start new game with player[0] and player[1]
              
            console.log('era jogador');
        }
        // * Send to all players a list of players on
        // * Put here the Listenters
    }   

    return {onDisconnecting}
}