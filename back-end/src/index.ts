import { Socket } from "socket.io";
import Game from "./Models/Game";
import Player from "./Models/Player";
import Move from "./Types/Move";
import StatusGame from "./Types/StatusGame";

const express = require("express");
const app = express();

const io = require('./Connections/SocketConnection')(app);
let players:Player[] = [];
let games:Game[]=[];
var gameState:Game={} as Game;
var player1:Player={} as Player;
var player2:Player={} as Player;
let playersCheck:Map<string,boolean> = new Map();

require('./Modules/SocketListeners')(io,players,games,playersCheck);



