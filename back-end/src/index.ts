import { Socket } from "socket.io";
import Game from "./Models/Game";
import Player from "./Models/Player";

const express = require("express");
const app = express();

const io = require('./Connections/SocketConnection')(app,8080);
let players:Player[] = [];
let games:Game[]=[];
let playersCheck:Map<string,boolean> = new Map();
require('./Modules/SocketListeners')(io,players,games,playersCheck);



