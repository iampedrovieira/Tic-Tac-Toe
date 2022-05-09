// * All socket functions used in game
import { Socket } from "socket.io-client";

import Game from "./../Types/Game";
import EndGameStatus from 'Types/EndGameStatus';

export function onPlayerAvailable(socket:Socket,setHideCheckReadyBox:(visible:boolean)=>void,setCheckBox:(visible:boolean)=>void){

  socket.on('playerAvailable',()=>{
    setCheckBox(false);
    setHideCheckReadyBox(true);
      return;
  });
  return;
}

export function onPlayerMove(socket:Socket,setGame:(game:Game)=>void,setMessage:(message:string)=>void){

  socket.on("playerMove", (gameState: Game) => {
    
    const newGameState: Game = {
      player1: gameState.player1,
      player2: gameState.player2,
      playerAllowed: gameState.playerAllowed,
      gameState: gameState.gameState,
    };

    setGame(newGameState);
    
    if(socket.id == gameState.playerAllowed) setMessage("It's your time to play");
    if(socket.id != gameState.playerAllowed) setMessage("Wait for other player move");

  });
}

export function onGameStart(socket:Socket,setMessage:(message:string)=>void,setGame:(game:Game)=>void,setHideCheckReadyBox:(visible:boolean)=>void,setGameEnd:(gameEnde:Boolean)=>void,setTitle:(message:string)=>void,playerId?:String) {
    socket.on("gameStart",(data:Game)=>{
      
        setHideCheckReadyBox(false);
        setGame(data);
        setGameEnd(false);
        const title = data.player1?.name + " VS " + data.player2?.name; 
        setTitle(title);
        
        // * Set a time out with 'Game Will Start in ...';

        if(data.playerAllowed==playerId){

          setMessage("It's your time to play");
        
        }else{

          setMessage("Wait for other player move");
        
        }
      })
    
}

export function onGameEnd(socket:Socket,setMessage:(message:string)=>void,setGameEnd:(gameEnde:Boolean)=>void){

  socket.on("gameEnd",(endGameStatus:EndGameStatus)=>{
  
    // * end game animatino were
    setGameEnd(true);
    console.log(endGameStatus)
    if(endGameStatus.isDraw){
      if(endGameStatus.nextPlayers.length==0){
        setMessage('Its a draw. Other game with same players');
      }else{
        setMessage('Its a draw. Next Players -> '+endGameStatus.nextPlayers[0]+ ' and '+ endGameStatus.nextPlayers[1]);
      }
    }else{
      setMessage(endGameStatus.playerWin+ ' Win the game. Next Player is '+ endGameStatus.nextPlayers[0]);
    }
    

  });
}