import { Socket } from "socket.io";
import Game from "./Models/Game";
import Player from "./Models/Player";
import Move from "./Types/Move";

const express = require( "express" );
const cors = require('cors')
const app = express();
const port = 8080;

//app.use(cors);

const server = app.listen(port);

const io = require("socket.io")(server, {cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }});

let players:Player[];
let games:Game[];
var gameState:Game={} as Game;
var player1:Player={} as Player;
var player2:Player={} as Player;
/*d
io.on("connection", (socket:Socket) => {
  

  socket.emit("yourId",socket.id);
  if(totalPlayers==2){
    console.log('Player '+socket.id+ ' is ready to play');
    console.log("Start Game");
    
    player2.Id=socket.id;
    player2.Name="Vieira";
    player2.Option=1;

    gameState.Player1=player1;
    gameState.Player2=player2;

    gameState.Play=player2.Id;

    io.emit("startGame",gameState);
  }else{
    if(totalPlayers>2){
      //socket.emit("data","Tens de aguardar pela proxima vez");
    }else{
      player1.Id=socket.id;
      player1.Name="Pedro";
      player1.Option=0;
      console.log('Player '+socket.id+ ' is ready to play');
      //socket.emit("data","Waiting for players");
    }
  }
  socket.on("disconnect", () => {
    totalPlayers--;
    console.log('Player '+socket.id+ ' Left the game');
    socket.disconnect;
  });

  socket.on('gamePlay',(gameState:Game,playerId:string)=>{
    
    //Vai receber a jogada e o socket id
    
    //Verifica se o socket id era o do player certo

    //Atualiza o gamestate

    //emit para o outro player jogar
    
  });


});
*/
//New player join the game
io.on("newPlayerJoin",(socket:Socket,PlayerName:string)=>{
  const player = new Player(socket.id,PlayerName);
  players.push(player);
  //[TEMP]
  if(!games[0]&&players.length<2){
      //WAITING FOR PLAYERS
  }else{
    if(!games[0]&&players.length==2){
      //Send a message to player 1 to choose the option X or O
    }else{
      //The new players are spectaters, send a spectator mode;
      //Send a gamestate
    }
  }
});

//Start new game
io.on("gameStart",(playerOption:number)=>{
  players[0].option=playerOption;
  let player2Option:number;
  if(playerOption==1) players[0].option=0;
  if(playerOption==0) players[0].option=1;
  const game = new Game(players[0],players[1]);
  games.push(game);
  //Send message to all players with game state
})

//Player Move
io.on("playerMove",(socket:Socket,move:Move)=>{
  //Verify if player can move
  
  //Update gameState
  //if end -wim draw lose 
    //Emit to all
    //If draw stay all
    //ELSE send loser to end

  //Else
    //Emit move to all with next playerAllow
})