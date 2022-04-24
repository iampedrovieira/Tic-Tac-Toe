import { Socket } from "socket.io";
import Game from "../../Models/Game";
import Player from "../../Models/Player";
import Move from "../../Types/Move"
import StatusGame from "../../Types/StatusGame";

module.exports = (io:any,socket:Socket,players:Player[],games:Game[],playersCheck:Map<string,boolean>)=>{

    const onPlayerMove = function (move:Move){
       
        if(socket.id!=games[0].getPlayerAllowed()){
          socket.emit('cannotPlay','cannotPlay')
          return;
        } 
        const status:StatusGame = games[0].move(move,socket.id);
        io.emit("playerMove",{
          "gameState":games[0].getGameState(),
          "player1":games[0].getPlayer1(),
          "player2":games[0].getPlayer2(),
          "playerAllowed":games[0].getPlayerAllowed(),  
        });
        if(status.draw || status.win){
          if(status.draw){
         
            games[0].draws++;
            if(games[0].draws<3){
              
              const gameEndStatus ={
                'playerWin':'',
                'isDraw':true,
                'playerWinId':'',
                'playerLossId':'',
                'playerNextId':'',
                'nextPlayer':''
              }
              io.emit('newGame',gameEndStatus)
            }else{
              
               const player1 = players[0];
               const player2 = players[1];
               players.splice(0,1);
                players.push(player1);
                players.splice(0,1);
                players.push(player2);

              games.pop();
              const gameEndStatus ={
                'playerWin':'',
                'isDraw':true,
                'playerWinId':'',
                'playerLossId':'',
                'playerNextIds':[players[0].getId(),players[1].getId()],
                'nextPlayers':[players[0].getName(),players[1].getName()]
              }
              io.emit("gameEnd",gameEndStatus);
            }
          }else{

            let lostPlayerId:String = '';
            try{
              players.forEach((player)=>{
                if(player.getId()!=status.playerWin && players.indexOf(player)<=1){
                  lostPlayerId = player.getId();
                  players.splice(players.indexOf(player),1);
                 
                  players.push(player);
               
                  throw 'breakException';  
                } 
              });
            }catch(e){
              if(e != 'breakException') throw e;
            }
            
            const gameEndStatus ={
              'playerWin':players[0].getName() ,
              'isDraw':false,
              'playerWinId':socket.id,
              'playerLossId':lostPlayerId,
              'playerNextIds':[players[1].getId()],
              'nextPlayers':[players[1].getName()]
            }
            games.pop();
            io.emit("gameEnd",gameEndStatus);
            
          }
          players.map((players)=>{
            players.setOption(-1);
          });
          players[0].setOption(-2);
          players[1].setOption(-2);
          io.emit("onPlayersChange",players);
          
          setTimeout(()=>{
            if(players.length>=2){
              io.to(players[0].getId()).emit('playerAvailable');
              io.to(players[1].getId()).emit('playerAvailable');
            }
            },2500);
        }
      }

    return {
        onPlayerMove
    }
}