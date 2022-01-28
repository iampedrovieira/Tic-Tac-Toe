// * All socket functions used in game
import styles from '../styles/Home.module.css'
import { Socket } from "socket.io-client";
import ButtonConfig from "Types/ButtonConfig";
import Game from "Types/Game";

export function waitingPlayerOption(socket:Socket,setMessage:(message:string)=>void){

    socket.on('waittingOption',(message:string)=>{
        setMessage(message)
        return ;
    })
    return ;
}

export function chooseOption(socket:Socket,setMessage:(message:string)=>void){

    socket.on('chooseOption',(message:string)=>{
        setMessage(message);
        console.log('o player '+socket.id +' escolheu mensagem');
        socket.emit("gameStart",0);
        console.log('emitio');
        return;
        //socket.emit("gameStart",0);
    })
    return ;
}

export function gameStart(socket:Socket,setMessage:(message:string)=>void,setGame:(game:Game)=>void,setButtonsState:(buttonsState:ButtonConfig[][])=>void,playerId?:String) {
    socket.on("gameStart",(data:Game)=>{
        //Set data into gameState
        setGame(data);
        
        //Verify if the user
        if(data.playerAllowed==playerId){
          setMessage("It's your time to play");
          setButtonsState(
            [
              [{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false}],
              [{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false}],
              [{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false}]
            ])
          //Block the buttons when exist in data
  
        }else{
          //Block all buttons
          setButtonsState(
            [
              [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
              [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
              [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}]
            ])
          setMessage("Wait for other player move");
        }
      })
    
}