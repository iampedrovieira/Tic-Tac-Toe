import { Socket } from "socket.io";
import Game from "../../Models/Game";
import Player from "../../Models/Player";

module.exports = (io:any,socket:Socket,players:Player[],games:Game[],playersCheck:Map<string,boolean>)=>{

    const onNewPlayerJoin = function (playerName:string){
        const player = new Player(socket.id,playerName);
        players.push(player);
        if(!games[0]&&players.length<2){
          socket.emit("waitingPlayer",'Waiting for player');
        }else{
          if(games[0] && players.length>2){
            socket.emit("gameStart",{
              "gameState":games[0].getGameState(),
              "player1":games[0].getPlayer1(),
              "player2":games[0].getPlayer2(),
              "playerAllowed":games[0].getPlayerAllowed(),  
            });
          }else{
            io.to(players[0].getId()).emit('playerAvailable');
            io.to(players[1].getId()).emit('playerAvailable');
            players[0].setOption(-2);
            players[1].setOption(-2);
          }
        }
        
        io.emit("onPlayersChange",players);
        
    }
    
    const onPlayerCheck = function (){  
      playersCheck.set(socket.id,true);
      players.map((player)=>{
        if(player.getId()==socket.id)player.setOption(-3);
      });
      if(players.length>=2){
        
        if(playersCheck.get(players[0].getId()) && playersCheck.get(players[1].getId())){
          playersCheck.set(players[0].getId(),false);
          playersCheck.set(players[1].getId(),false);
          if(!games[0]){
            // * Start Game
            const game = new Game(players[0],players[1]);
            games.push(game);
            io.emit("gameStart",{
              "gameState":game.getGameState(),
              "player1":game.getPlayer1(),
              "player2":game.getPlayer2(),
              "playerAllowed":game.getPlayerAllowed(),  
            });
          }else{
            players[0].setOption(0);
            players[1].setOption(1);
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
      io.emit("onPlayersChange",players);
    }

    const onPlayerUnCheck = function (){   
        playersCheck.set(socket.id,false);
        players.map((player)=>{
          if(player.getId()==socket.id)player.setOption(-2);
        });
        io.emit("onPlayersChange",players);
    }
    return {
        onNewPlayerJoin,
        onPlayerCheck,
        onPlayerUnCheck
    }
}