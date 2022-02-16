import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import { MouseEventHandler, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { io, Socket} from "socket.io-client";
import {connectSocket, emitSendPlayerInfo, onPlayersChange, onWaitingPlayer} from "./../libs/socketConnection";
import { onGameEnd, onGameStart, onPlayerAvailable} from './../libs/SocketGame';
import PlayerListComponent from "./../Components/PlayersList/PlayerList";
import Player from 'Types/Player';

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
  const [title,setTitle] = useState<string>('xxxxxxx - 3 vs 5 - asdasdas');
  const [socket,setSocket] = useState<Socket|null>(null);
  const [name,setName] = useState<string>('');
  const [hideNameBox,setHideNameBox] = useState<string>(styles.input_hide);
  const [hideCheckReadyBox,setHideCheckReadyBox] = useState<string>(styles.input_hide);
  const [checkBox,setCheckBox] = useState<boolean>(false);
  const[playersList,setPlayersList] = useState<Player[]>([]);

  const [buttonsState,setButtonsState]=useState<ButtonConfig[][]>(
    [
      [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
      [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
      [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}]
    ]);
  
  //On first run
  useEffect(() => {
    setMessage('Connecting...');
    connectSocket(setSocket,setPlayerId);
  },[1]);

  //This is run when player is connected to server
  useEffect(() => {
    //This create a listener to startGame entry.
    if(!socket)return;
    onPlayerAvailable(socket,setHideCheckReadyBox,setCheckBox);
    setHideNameBox(styles.input);
    onWaitingPlayer(socket,setMessage,setButtonsState);
    onPlayersChange(socket,setPlayersList);
    console.table(playersList)
    onGameEnd(socket,setMessage,setButtonsState);
    // ! Esta abordagem não é a melhor porque os estados nao ficam atualizados
    onGameStart(socket,setMessage,setGame,setButtonsState,setHideCheckReadyBox,playerId);
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
    console.log('--- DEU UPDATE AO STATE DO GAME ---');
    console.table(game);
    console.log(': -> '+playerId +' estado do playerid');
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
    if(game?.player1?.id==playerId)playerOption=game?.player1?.option;newButtonState[positionX][positionY].styles=styles.player1;
    if(game?.player2?.id==playerId)playerOption=game?.player2?.option;newButtonState[positionX][positionY].styles=styles.player2;
    newButtonState[positionX][positionY].disable=true;
    console.log('CARREGUEI NO BUTTAO')
    console.log(newButtonState)
    console.log('----------------------')
    setButtonsState(newButtonState);
    // TODO Change gameState

    const move:Move ={positionX,positionY}
    socket?.emit('playerMove',move);
  }

  function handleName():void{
    
    /*  
    //* Send name to sever and change the flow on back end to only stay in 'waiting' when name have been sended
    */
    if(!socket) return;
    console.log(name)
    emitSendPlayerInfo(socket,name);
    setHideNameBox(styles.input_hide);
  }

  function handleCheckBox(){
    if(!checkBox){
      setCheckBox(!checkBox)
      socket?.emit('playerCheck');
    }else{
      setCheckBox(!checkBox)
      socket?.emit('playerUnCheck');
    }
    
  }

  return (
    <div >
      <Head>
        <title>Tic Tac Toe Game</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title} >{title}</h1>
      <PlayerListComponent players={playersList}/>
      <div className={hideNameBox}>
        <p> Insert your name </p>
        <input type="text" value={name} onChange={(event)=>setName(event.target.value)} />
        <button onClick={()=>handleName()}> DONE </button>
      </div>
      <div  className={hideCheckReadyBox}> 
      <input
          type="checkbox"
          checked={checkBox}
          onChange={handleCheckBox}
        />
      </div>
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

