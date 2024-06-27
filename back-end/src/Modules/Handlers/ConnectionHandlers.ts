import { Socket } from "socket.io";

import Player from "../../Models/Player";
import Room from "../../Models/Room";
import RoomModel from "./../../../models/room";
import UserModel from "../../../models/user";
import GameModel from "../../../models/game";
import { Sequelize } from "sequelize";


module.exports = (io: any,socket: Socket,sequelize: Sequelize) => {
  const onNewPlayerJoin = async function (playerName: string, room: string) {
   
    const player = new Player(socket.id, playerName);
    let roomIndex = null;

    //Create room on DB
    const Room = RoomModel(sequelize);
    const User = UserModel(sequelize);
    const Game = GameModel(sequelize);

    //In case received a link to go diretly to a room
    let roomObj = await Room.findOne({ where: { NAME: room }});

    //Create room (after will be a function
    if (roomObj == null) {
      //Create room on DB
      const newRoom = await Room.create({ NAME: room });
      roomObj = newRoom;
    }
 
    const playerObj = await User.create({
      NAME: playerName,
      SOCKETID: socket.id,
      ROOMID: roomObj.ID,
      OPTION: -1,
    });

    //Create room on socket
    socket.join(room);


    //Get game from room
    const gameObj = await Game.findOne({ where: { ROOMID: roomObj.ID } });
    const { count } = await User.findAndCountAll({where: { ROOMID: roomObj.ID}});

    const playersInRoom = await User.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
    //Get game from room
    const game  = await Game.findOne({ where: { ROOMID: roomObj.ID } });
    
    if(playersInRoom.length == 2){
       //Get first 2 players from the room and create a game with them in the DB
       const player1 = playersInRoom[0];
       const player2 = playersInRoom[1];
       player1.setOption(-2);
       player2.setOption(-2);
       await player1.save();
       await player2.save();

       const players = playersInRoom.map((player) => {
        const playerObj = new Player(player.SOCKETID, player.NAME);
        playerObj.setOption(player.OPTION);
        return playerObj;
      });

       io.to(room).emit(
         "onPlayersChange",
         players //Criar metodo no rooms para returnar os players
       );
       //emit to the player 1 and 2 players available
       io.to(player1.SOCKETID).emit('playerAvailable');
       io.to(player2.SOCKETID).emit('playerAvailable');
    }else{
      if(playersInRoom.length > 2 && game != null){
        const player1Info = await User.findOne({ where: { SOCKETID: game.getPlayer1() } });
        const player2Info = await User.findOne({ where: { SOCKETID: game.getPlayer2() } });
        
        const player1InfoJson = {
          id: player1Info!.SOCKETID,
          name: player1Info!.NAME,
          option: player1Info!.OPTION
        };

        const player2InfoJson = {
          id: player2Info!.SOCKETID,
          name: player2Info!.NAME,
          optin: player2Info!.OPTION
        };
        
  
        io.to(room).emit("gameStart", {
          gameState: game.getGameState(),
          player1: player1InfoJson,
          player2: player2InfoJson,
          playerAllowed: game.getPlayerAllowed(),
        });
        const playersObj = playersInRoom.map((player) => {
          const playerObj = new Player(player.SOCKETID, player.NAME);
          playerObj.setOption(player.OPTION);
          return playerObj;
        });
        io.to(room).emit(
          "onPlayersChange",
          playersObj //Criar metodo no rooms para returnar os players
        );
      }else{
        const playersObj = playersInRoom.map((player) => {
          const playerObj = new Player(player.SOCKETID, player.NAME);
          playerObj.setOption(player.OPTION);
          return playerObj;
        });
        io.to(room).emit(
          "onPlayersChange",
          playersObj //Criar metodo no rooms para returnar os players
        );
        socket.emit("waitingPlayer",'Waiting for player');
      }
    }
  };

  const onPlayerCheck = async function (roomName: string) {

  //Find a room on the DB
  const Room = RoomModel(sequelize);
  const User = UserModel(sequelize);
  const Game = GameModel(sequelize);
 
  const roomObj = await Room.findOne({ where: { NAME:roomName} });
  if(roomObj == null) return;
  const playerObj = await User.findOne({ where: { SOCKETID: socket.id } });
  
  //Update the player option to -3
  playerObj?.setOption(-3);
  
  await playerObj?.save();

  

  let playersInRoom = await User.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
  //emit to the room the players
  //This is temporary, need to be fixed when the Models are finished
  let players = playersInRoom.map((player) => {
      const playerObj = new Player(player.SOCKETID, player.NAME);
      playerObj.setOption(player.OPTION);
    return playerObj;
  });
  
  //Check if there are 2 players in the room with the option -3
  const playersReady = players.filter((player) => player.getOption() == -3);
  if(playersReady.length == 2){
    //Create a game on the DB
    const game = await Game.create({ROOMID:roomObj.ID,PLAYER1:playersInRoom[0].SOCKETID,PLAYER2:playersInRoom[1].SOCKETID,PLAYERALLOWED:playersInRoom[0].SOCKETID,DRAWS:0})
    //Update the player1 option to 0
    playersInRoom[0].setOption(0);
    await playersInRoom[0].save();
    //Update the player2 option to 1
    playersInRoom[1].setOption(1);
    await playersInRoom[1].save();

    playersInRoom = await User.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
    //emit to the room the players
    //This is temporary, need to be fixed when the Models are finished
    players = playersInRoom.map((player) => {
        const playerObj = new Player(player.SOCKETID, player.NAME);
        playerObj.setOption(player.OPTION);
      return playerObj;
    });


    //return all info from player on db
    const player1Info = await User.findOne({ where: { SOCKETID: game.getPlayer1() } });
    const player2Info = await User.findOne({ where: { SOCKETID: game.getPlayer2() } });
        
        const player1InfoJson = {
          id: player1Info!.SOCKETID,
          name: player1Info!.NAME,
          option: player1Info!.OPTION
        };

        const player2InfoJson = {
          id: player2Info!.SOCKETID,
          name: player2Info!.NAME,
          optin: player2Info!.OPTION
        };
    io.to(roomName).emit("gameStart", {
      gameState: game.getGameState(),
      player1: player1InfoJson,
      player2: player2InfoJson,
      playerAllowed: game.getPlayerAllowed(),
    });
  }

  io.to(roomName).emit("onPlayersChange", players);

  };

  const onPlayerUnCheck = async function (roomName: string) {

    //Find a room on the DB
    const Room = RoomModel(sequelize);
    const User = UserModel(sequelize);
    const Game = GameModel(sequelize);
  
    const roomObj = await Room.findOne({ where: { NAME:roomName} });
    if(roomObj == null) return;
    const playerObj = await User.findOne({ where: { SOCKETID: socket.id } });
    
    //Update the player option to -2
    playerObj?.setOption(-2);
    
    await playerObj?.save();

    const playersInRoom = await User.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
    //emit to the room the players
    //This is temporary, need to be fixed when the Models are finished
    const players = playersInRoom.map((player) => {
        const playerObj = new Player(player.SOCKETID, player.NAME);
        playerObj.setOption(player.OPTION);
      return playerObj;
  });
  
    io.to(roomName).emit("onPlayersChange", players);

  };
  return {
    onNewPlayerJoin,
    onPlayerCheck,
    onPlayerUnCheck,
  };
};


