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

// * New player join the game
io.on("newPlayerJoin",(socket:Socket,PlayerName:string)=>{
  const player = new Player(socket.id,PlayerName);
  players.push(player);
  // **[TEMP]
  if(!games[0]&&players.length<2){
    io.emit("waitingPlayer",{
      'message':'Waiting for player'
    });
  }else{
    if(!games[0]&&players.length==2){
      const player1Id=players[0].getId();
      socket.broadcast.to(player1Id).emit('chooseOption', {
        'message':'Choose Option'
      });
      socket.broadcast.to(player1Id).emit('waittingOption', {
        'message':'Waitting Option'
      });
    }else{

      /*
        ! NOT IMPLEMENTED YET
        TODO : Send to new players a spectator mode;
        TODO : Send a gameState like gameStart;  
      */ 
  
    }
  }
});

// * Start new game
io.on("gameStart",(playerOption:number)=>{
  players[0].option=playerOption;

  if(playerOption==1) players[0].option=0;
  if(playerOption==0) players[0].option=1;
  const game = new Game(players[0],players[1]);
  games.push(game);
  
  io.emit("gameStart",{
    "board":game.getGameState(),
    "player1":game.getPlayer1(),
    "player2":game.getPlayer2(),
    "playerAllowed":game.getPlayerAllowed(),  
  });

});

// * Player Move
io.on("playerMove",(socket:Socket,move:Move)=>{

  if(socket.id!=games[0].getPlayerAllowed()) return;

  // TODO : Verify if move is possible [OR INSIDE MOVE METHOD ON CLASS]

  games[0].move(move,socket.id);

  // * [TEMP] Send info to other player and spectators
  io.emit("playerMove",{
    'move':move,
    'playerAllowed':games[0].getPlayerAllowed()
  });
  //if end -wim draw lose 
    //Emit to all
    //If draw stay all
    //ELSE send loser to end

  //Else
    //Emit move to all with next playerAllow
})