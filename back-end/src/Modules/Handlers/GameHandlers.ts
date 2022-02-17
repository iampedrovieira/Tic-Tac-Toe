import { Socket } from "socket.io";
import Game from "../../Models/Game";
import Player from "../../Models/Player";
import Move from "../../Types/Move"
import StatusGame from "../../Types/StatusGame";

module.exports = (io:any,socket:Socket,players:Player[],games:Game[],playersCheck:Map<string,boolean>)=>{

    const onPlayerMove = function (move:Move){
        if(socket.id!=games[0].getPlayerAllowed()) return;
        console.log('===========================================');
        console.log('Player '+socket.id);
        console.table(move);
        console.log('===========================================');
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
            if(games[0].draws<=3){
              /* 
                * Restart Game 
                  * Sent to players a button to check again
              */
              io.to(players[0],players[1]).emit('checkReady');
            }else{

               // * Set 2 player to the end of queue/ list;
               // ! CHANGE THIS FOREACH TO A FUNCTION
              players.forEach((player)=>{
                if(players.indexOf(player)<=1 && player.getId() in[games[0].getPlayer1().getId(),player.getId()!=games[0].getPlayer2().getId()]){
                  players.splice(players.indexOf(player),1);
                  players.push(player);
                  return ;
                } 
              });
              games.pop();
              const gameEndStatus ={
                'playerWin':'',
                'isDraw':true,
                'playerWinId':'',
                'playerLossId':'',
                'playerNextId':'',
                'nextPlayer':players[0].getName() + ' and '+ players[1].getName()
              }
              io.emit("gameEnd",gameEndStatus);
            }
          }else{
            console.log(' ACABOU O JOGO');
            /*
              * Remove player loss 
            */
            const gameEndStatus ={
              'playerWin':'teste1',
              'isDraw':false,
              'playerWinId':players[0].getId(),
              'playerLossId':players[1].getId(),
              'playerNextId':players[1].getId(),
              'nextPlayer':'string'
            }
  
            players.forEach((player)=>{
              if(player.getId()!=status.playerWin && players.indexOf(player)<=1){
                players.splice(players.indexOf(player),1);
                players.push(player);
                return ;
              } 
            });
            games.pop();
            io.emit("gameEnd",gameEndStatus);
            
          }
          players.map((players)=>{
            players.setOption(-1);
          });
          io.emit("onPlayersChange",players);
          console.log('Waittting...');
          setTimeout(()=>{
            io.to(players[0].getId()).emit('playerAvailable');
            io.to(players[1].getId()).emit('playerAvailable')
            ;},2500);
   
        }
      }

    return {
        onPlayerMove
    }
}