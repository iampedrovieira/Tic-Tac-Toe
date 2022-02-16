import { Socket } from "socket.io";
import Game from "../../Models/Game";
import Player from "../../Models/Player";

module.exports = (io:any,socket:Socket,players:Player[],games:Game[],playersCheck:Map<string,boolean>)=>{

    const onNewPlayerJoin = function (playerName:string){
        const player = new Player(socket.id,playerName);
        players.push(player);
        io.emit("onPlayersChange",players);
        if(!games[0]&&players.length<2){
          io.emit("waitingPlayer",'Waiting for player');
        }else{
          if(games[0] && players.length>2){
            io.emit("gameStart",{
              "gameState":games[0].getGameState(),
              "player1":games[0].getPlayer1(),
              "player2":games[0].getPlayer2(),
              "playerAllowed":games[0].getPlayerAllowed(),  
            });


          }else{
            io.to(players[0].getId()).emit('playerAvailable');
            io.to(players[1].getId()).emit('playerAvailable');
          }
         
        }
    }
    
    const onPlayerCheck = function (){  
      playersCheck.set(socket.id,true);
      if(players.length<2)return;
    
      if(playersCheck.get(players[0].getId()) && playersCheck.get(players[1].getId())){
        playersCheck.set(players[0].getId(),false);
        playersCheck.set(players[1].getId(),false);
        
        if(!games[0]){
          // * Start Game
          players[0].option=0;
          players[1].option=1;
          const game = new Game(players[0],players[1]);
          games.push(game);
          
          io.emit("gameStart",{
            "gameState":game.getGameState(),
            "player1":game.getPlayer1(),
            "player2":game.getPlayer2(),
            "playerAllowed":game.getPlayerAllowed(),  
          });
        }else{
          console.log('New Game Restart');
          games[0].restart();
          io.emit("gameStart",{
            "gameState":games[0].getGameState(),
            "player1":games[0].getPlayer1(),
            "player2":games[0].getPlayer2(),
            "playerAllowed":games[0].getPlayerAllowed(),  
          });
        }
      }
    }

    const onPlayerUnCheck = function (){   
        playersCheck.set(socket.id,false);
        io.emit('updateCheck',playersCheck);
    }
    return {
        onNewPlayerJoin,
        onPlayerCheck,
        onPlayerUnCheck
    }
}