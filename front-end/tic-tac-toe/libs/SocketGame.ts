// * All socket functions used in game
import styles from '../styles/Home.module.css'
import { Socket } from "socket.io-client";
import ButtonConfig from "./../Types/ButtonConfig";
import Game from "./../Types/Game";
import EndGameStatus from 'Types/EndGameStatus';

export function onPlayerAvailable(socket:Socket,setHideCheckReadyBox:(visible:boolean)=>void,setCheckBox:(visible:boolean)=>void){

  socket.on('playerAvailable',()=>{
    setCheckBox(false);
    setHideCheckReadyBox(true);
      return;
  })
  return;
}

export function onReadyStatus(socket:Socket,setReadyBox:(visible:boolean)=>void){

  // * This is used to change a ready and unReady status of all players.


}

export function onGameStart(socket:Socket,setMessage:(message:string)=>void,setGame:(game:Game)=>void,setHideCheckReadyBox:(visible:boolean)=>void,setGameEnd:(gameEnde:Boolean)=>void,playerId?:String) {
    socket.on("gameStart",(data:Game)=>{
        //Set data into gameState
        setHideCheckReadyBox(false);
        setGame(data);
        setGameEnd(false);
        // * Set a time out with 'Game Will Start in ...';

        //Verify if the user
        if(data.playerAllowed==playerId){
          setMessage("It's your time to play");
        
  
        }else{
          //Block all buttons
          setMessage("Wait for other player move");
        }
      })
    
}

export function onGameEnd(socket:Socket,setMessage:(message:string)=>void,setGameEnd:(gameEnde:Boolean)=>void){

  // ! On back end, when game is end verify if have more players on lobby, and set loser to end.
  // ! Send to front end (all players) a json with winner, loser and next player.
  socket.on("gameEnd",(endGameStatus:EndGameStatus)=>{
  
    setGameEnd(true);
    setMessage('Player -> '+ endGameStatus.playerWin +'|| Next Player -> '+endGameStatus.nextPlayer);
  });
}

// ! ISTO VAI SAIR DAQUI, VAI SER A LOGICA USADA NO BACKEND
export function onGameRestart(){
 // * Will have 2 options, restart with same players/game, when is draw<3 or only have 2 players in lobby.
 // *                    , restart wiht news players/game, and repeat the inital flow. In this case, only 'clear' the board and on back end emit the onPlayerAvailable

 /* 
  TODO: clear board/game
 */
}