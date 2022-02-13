import { Socket } from "socket.io";
import Game from "../../Models/Game";
import Player from "../../Models/Player";
import Move from "../../Types/Move"
import StatusGame from "../../Types/StatusGame";

module.exports = (io:any,socket:Socket,players:Player[],games:Game[],playersCheck:Map<string,boolean>)=>{

    const onPlayerMove = function (move:Move){
        if(socket.id!=games[0].getPlayerAllowed()) return;
        console.log('Player '+socket.id + ' PLay')
        const status:StatusGame = games[0].move(move,socket.id);
        io.emit("playerMove",{
          "gameState":games[0].getGameState(),
          "player1":games[0].getPlayer1(),
          "player2":games[0].getPlayer2(),
          "playerAllowed":games[0].getPlayerAllowed(),  
        });
        console.table(status);
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
               // * Set player to the end of queue/ list;
            }
          }else{
            console.log(' ACABOU O JOGO');
            /*
              * Remove player loss 
            */
            const gameEndStatus ={
              'playerWin':'teste1',
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
          // * If only have 2 players in list send to 2 players a restart
          // * If have more set the loss player to end of queue and send a start new game
          
          // * If draw play again util 3 times after that send 2 player to end of queue.
          
          // * Timer
          console.table(players);
          console.log('Waittting...');
          setTimeout(()=>{io.emit('playerAvailable');},2500);
   
        }
        //if end -wim draw lose 
          //Emit to all
          //If draw stay all
          //ELSE send loser to end
  
        //Else
          //Emit move to all with next playerAllow
      }

    return {
        onPlayerMove
    }
}