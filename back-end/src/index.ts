import { Socket } from "socket.io";
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

var totalPlayers = 0;

interface Player{
  Id?:String,
  Name?:String,
  Option:Number
}

interface Game{
  'Player1':Player,
  'Player2':Player,
  'Play':String,
  '1x1':Number,
  '1x2':Number,
  '1x3':Number,
  '2x1':Number,
  '2x2':Number,
  '2x3':Number,
  '3x1':Number,
  '3x2':Number,
  '3x3':Number
}

var gameState:Game={} as Game;
var player1:Player={} as Player;
var player2:Player={} as Player;

io.on("connection", (socket:Socket) => {
  totalPlayers++;
  if(totalPlayers==2){
    console.log('Player '+socket.id+ ' is ready to play');
    console.log("Start Game");
    
    gameState["3x2"]=1
    player2.Id=socket.id;
    player2.Name="Vieira";
    player2.Option=1;

    gameState.Player1=player1;
    gameState.Player2=player2;

    gameState.Play=player2.Id;

    io.emit("data",gameState);
  }else{
    if(totalPlayers>2){
      socket.emit("data","Tens de aguardar pela proxima vez");
    }else{
      player1.Id=socket.id;
      player1.Name="Pedro";
      player1.Option=0;
      console.log('Player '+socket.id+ ' is ready to play');
      socket.emit("data","Waiting for players");
    }
    
  }
  socket.on("disconnect", () => {
    totalPlayers--;
    console.log('Player '+socket.id+ ' Leave the game');
    socket.disconnect;
  });
  
});

