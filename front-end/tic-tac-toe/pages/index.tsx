import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import { MouseEventHandler, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { io, Socket} from "socket.io-client";



interface Player{
  Id?:String,
  Name?:String,
  Option:Number,
  wins:number;
  losses:number;
}

interface Game{
  'player1'?:Player,
  'player2'?:Player,
  'playerAllowed'?:string
  'gameState'?:number[][];
}
interface Move{
  positionX:number,
  positionY:number
}
interface ButtonConfig{
  'styles':string,
  'disable':boolean
}


interface InitalProps{
  socket:Socket,
  userId:string,
  status:boolean
}

const Home: NextPage = () => {
  

  const [playerId,setPlayerId] = useState<String>();
  const [disabledButtons,setDisabledButtons] = useState<boolean>(true);
  const [game,setGame] = useState<Game>();
  const [message,setMessage] = useState<string>('Connecting to server');
  const [title,setTitle] = useState<string>('xxxxxxx - 3 vs 5 - yyyyyyyy');
  const [socket,setSocket] = useState<Socket|null>(null);

  const [buttonsState,setButtonsState]=useState<ButtonConfig[][]>(
    [
      [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
      [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
      [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}]
    ]);
  
  //On first run
  useEffect(() => {
    setMessage('Connecting...');
    const socket = connectSocket();
    if(socket!=null){
      setSocket(socket)
    }
    
  },[]);

  //This is run when player id changed
  useEffect(() => {
    //This create a listenr to startGame entry.
    if(!socket)return;
    socket.emit("newPlayerJoin",'PlayerName');

    socket.on('waitingPlayer',(message:string)=>{
      console.log(message)
      setMessage(message);
    })
    socket.on('waittingOption',(message:string)=>{
      console.log(message)
      setMessage(message);
    })
    socket.on('chooseOption',(message:string)=>{
      console.log(message)
      setMessage(message);
      
     
      socket.emit("gameStart",0);
  
    })
    socket.on("gameStart",(data:Game)=>{
      //Set data into gameState
      console.log(data);
      console.log(playerId);
      
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

    //player move
    socket.on("playerMove",(gameState:Game)=>{
      //Set data into gameState
      console.log('NEW MOVE');
      const newGameState:Game={
        'player1':gameState.player1,
        'player2':gameState.player2,
        'playerAllowed':gameState.playerAllowed,
        'gameState':gameState.gameState,
      }

      setGame(newGameState);
      console.log('GAME STATE UPDATED----------');
      
      
    })
    // Finish Listener
    socket.on("finish",(winner:string)=>{

      // * [TEMP] Dá restart ao jogo
      // TODO Falta atualzar o gameState
      setButtonsState(
        [
          [{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false}],
          [{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false}],
          [{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false},{'styles':styles.button,'disable':false}]
        ]);
    });
  
  },[socket]);


  useEffect(()=>{
    console.log('GAME UPDATED EFFECT ------------------');
    let newButtonState = buttonsState;

    let isAllowed:boolean = false;
    if(game?.playerAllowed==playerId)isAllowed=true;
    if(isAllowed)setMessage('Its your time to play');
    if(!isAllowed)setMessage('Wait for other player move');

    for(let i = 0;i<3;i++){
      for(let j = 0;j<3;j++){
        
        if(game?.gameState![i][j] == 0){
          newButtonState[i][j].disable=true;
          newButtonState[i][j].styles=styles.player1;
        }
        if(game?.gameState![i][j] == 1){
          newButtonState[i][j].disable=true;
          newButtonState[i][j].styles=styles.player2;
        }
        if(game?.gameState![i][j] == -1){
          if(isAllowed)newButtonState[i][j].disable=false;
          if(!isAllowed)newButtonState[i][j].disable=false;
          newButtonState[i][j].styles=styles.button;
        }
      }
    }
    setButtonsState(newButtonState);
    console.log('Button UPDATED');
    console.log(newButtonState);
  },[game]);
  function handleButton(positionX:number,positionY:number):void{
    if(playerId!=game?.playerAllowed)alert('Cannot play');
    if(buttonsState[positionX][positionY].disable) return;
    let newButtonState = buttonsState;
    let playerOption;
    if(game?.player1?.Id==playerId)playerOption=game?.player1?.Option;newButtonState[positionX][positionY].styles=styles.player1;
    if(game?.player2?.Id==playerId)playerOption=game?.player2?.Option;newButtonState[positionX][positionY].styles=styles.player2;
    newButtonState[positionX][positionY].disable=true;
    console.log('CARREGUEI NO BUTTAO')
    console.log(newButtonState)
    console.log('----------------------')
    setButtonsState(newButtonState);
    // TODO Change gameState

    const move:Move ={positionX,positionY}
    socket?.emit('playerMove',move);
  }

  return (
    <div >
      <Head>
        <title>Tic Tac Toe Game</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title} >{title}</h1>
      <div className={styles.game}>
        <div className={styles.line}>
          <button disabled={buttonsState[0][0].disable} className={buttonsState[0][0].styles} onClick={()=>handleButton(0,0)} ></button>
          <button disabled={buttonsState[0][1].disable} className={buttonsState[0][1].styles} onClick={()=>handleButton(0,1)} ></button>
          <button disabled={buttonsState[0][2].disable} className={buttonsState[0][2].styles} onClick={()=>handleButton(0,2)}></button>
        </div>
        <div className={styles.line}>
          <button disabled={buttonsState[1][0].disable} className={buttonsState[1][0].styles} onClick={()=>handleButton(1,0)} ></button>
          <button disabled={buttonsState[1][1].disable} className={buttonsState[1][1].styles} onClick={()=>handleButton(1,1)} ></button>
          <button disabled={buttonsState[1][2].disable} className={buttonsState[1][2].styles} onClick={()=>handleButton(1,2)}></button>
        </div>
        <div className={styles.line}>
          <button disabled={buttonsState[2][0].disable} className={buttonsState[2][0].styles} onClick={()=>handleButton(2,0)} ></button>
          <button disabled={buttonsState[2][1].disable} className={buttonsState[2][1].styles} onClick={()=>handleButton(2,1)} ></button>
          <button disabled={buttonsState[2][2].disable} className={buttonsState[2][2].styles} onClick={()=>handleButton(2,2)}></button>
        </div>
      </div>
      <h1 className={styles.title}>{message}</h1>
    </div>
  )
}

// This gets called on every request

export const getStaticProps = async () => {
  return {props:{
  } 
  } 
}

export default Home;

function connectSocket() {
  throw new Error('Function not implemented.');
}
