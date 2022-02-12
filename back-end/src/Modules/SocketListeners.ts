import { Socket } from "socket.io"
import Game from "../Models/Game";
import Player from "../Models/Player";
import Move from "../Types/Move";
import StatusGame from "../Types/StatusGame";

module.exports = (io:any,players:Player[],games:Game[],playersCheck:Map<string,boolean>)=>{


    const onConnection = (socket:Socket) =>{
        // * Put here the Listenters
        const {onDisconnecting} = require('./Handlers/SocketDisconnectingHandler')(socket,players);
        socket.on("disconnecting",onDisconnecting);

        // * New player join the game
    socket.on("newPlayerJoin",(playerName:string)=>{
        const player = new Player(socket.id,playerName);
        console.log(playerName);
        players.push(player);
        // **[TEMP]
        if(!games[0]&&players.length<2){
          io.emit("waitingPlayer",'Waiting for player');
        }else{
          // * Send with players
          io.emit('playerAvailable');
        }
      });
      socket.on('playerCheck',()=>{
        
        playersCheck.set(socket.id,true);
        
        if(players.length<2)return;
        
        
        if(playersCheck.get(players[0].getId()) && playersCheck.get(players[1].getId())){
          playersCheck.set(players[0].getId(),false);
          playersCheck.set(players[1].getId(),false);
          // ! TEMP -> Verification
          if(!games[0]){
            // * Start Game
            console.log('GAME START');
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
      });
      socket.on('playerUnCheck',()=>{
        playersCheck.set(socket.id,false);
        console.log('Player uncheck');
        io.emit('updateCheck',playersCheck);
      });
  
      // * Start new game
      // ! REMOVE THIS
     /* socket.on("gameStart",(playerOption:number)=>{
        players[0].option=playerOption;
        console.log('GAME START');
        if(playerOption==1) players[1].option=0;
        if(playerOption==0) players[1].option=1;
        const game = new Game(players[0],players[1]);
        games.push(game);
        
        io.emit("gameStart",{
          "gameState":game.getGameState(),
          "player1":game.getPlayer1(),
          "player2":game.getPlayer2(),
          "playerAllowed":game.getPlayerAllowed(),  
        });
  
      });*/
  
      // * Player Move
      socket.on("playerMove",(move:Move)=>{
  
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
      })
    }
    
    return io.on("connection",onConnection)
}