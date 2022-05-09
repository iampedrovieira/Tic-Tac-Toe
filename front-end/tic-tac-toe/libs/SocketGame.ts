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

export function onGameStart(socket:Socket,setMessage:(message:string)=>void,setGame:(game:Game)=>void,setHideCheckReadyBox:(visible:boolean)=>void,setGameEnd:(gameEnde:Boolean)=>void,playerId?:String) {
    socket.on("gameStart",(data:Game)=>{
      
        setHideCheckReadyBox(false);
        setGame(data);
        setGameEnd(false);
        // * Set title with who plays 
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
    setMessage('Player -> '+ endGameStatus.playerWin +'|| Next Player -> '+endGameStatus.nextPlayer);

  });
}