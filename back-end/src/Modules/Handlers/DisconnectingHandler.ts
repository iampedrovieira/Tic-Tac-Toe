import { Socket } from "socket.io";
import Player from "../../Models/Player";
import RoomModel from "./../../../models/room";
import UserModel from "../../../models/user";
import GameModel from "../../../models/game";
import { Sequelize } from "sequelize";

module.exports = (io: any,socket: Socket,sequelize:Sequelize) => {
  const onDisconnecting = async function () {
    console.log("Disconnecting")
    //Create room on DB
    const Room = RoomModel(sequelize);
    const User = UserModel(sequelize);
    const Game = GameModel(sequelize);
    //Trougth the socket ID and User object, find the room on DB
    const userObj = await User.findOne({where :{ SOCKETID : socket.id }});
    if (!userObj) return;
    const roomObj = await Room.findOne({where :{ ID: userObj.getRoomID() }});
    if (!roomObj) return;
    //Get all players in the room
    let playersInRoom = await User.findAll({where :{ ROOMID : roomObj.ID }, order: [['ID', 'ASC']]});
    if (!playersInRoom) return;

    //Get the user position in the playersInRoom
    let playerPosition = 0;
    let existPlayer = false;

    playersInRoom.forEach((player) => {
      if (player.getSocketID() == socket.id) {
        existPlayer = true;
        playerPosition = playersInRoom.indexOf(player) + 1;
        return;
      }
    });
    console.log(existPlayer);
    if (!existPlayer) return;
    console.log(playerPosition);
    if (playerPosition > 2){
      //Delete the player in DB
      await User.destroy({where: { SOCKETID: socket.id }});
    }else{
      //Delete the game in DB
      await Game.destroy({where: { ROOMID: roomObj.ID }});
      
      //Delete the player in DB
      await User.destroy({where: { SOCKETID: userObj.getSocketID() }});

      playersInRoom = await User.findAll({where :{ ROOMID : roomObj.ID }, order: [['ID', 'ASC']]});

        try {
          
          const gameEndStatus = {
            playerWin: playersInRoom[0].getName(),
            isDraw: false,
            playerWinId: playersInRoom[0].getSocketID(),
            playerLossId: "",
            playerNextIds: [playersInRoom[0].getSocketID(),playersInRoom[1].getSocketID()],
            nextPlayers: [playersInRoom[0].getName(),playersInRoom[1].getName()]
          };
          
          io.to(roomObj.NAME).emit("gameEnd", gameEndStatus);
          if(playersInRoom.length >= 2){
            setTimeout(async() => {
              //Update player 1 and player 2 option to -2 on DB 
              playersInRoom[0].setOption(-2);
              playersInRoom[1].setOption(-2);

              await playersInRoom[0].save();
              await playersInRoom[1].save();
              playersInRoom = await User.findAll({where :{ ROOMID : roomObj.ID }, order: [['ID', 'ASC']]});
              const players = playersInRoom.map((player) => {
                const playerObj = new Player(player.SOCKETID, player.NAME);
                playerObj.setOption(player.OPTION);
                return playerObj;
              });

              io.to(roomObj.NAME).emit("onPlayersChange", players);
              io.to(playersInRoom[0].getSocketID()).emit("playerAvailable");
              io.to(playersInRoom[1].getSocketID()).emit("playerAvailable");
            
            }, 2500);
          }else{
            io.emit("waitingPlayer", "Waiting for player");
          }
          
        } catch (error) {
          io.emit("waitingPlayer", "Waiting for player");
        }
    }

    playersInRoom = await User.findAll({where :{ ROOMID : roomObj.ID }, order: [['ID', 'ASC']]});
    const players = playersInRoom.map((player) => {
      const playerObj = new Player(player.SOCKETID, player.NAME);
      playerObj.setOption(player.OPTION);
      return playerObj;
    });

    io.to(roomObj.NAME).emit("onPlayersChange", players);
  };

  return { onDisconnecting };
};
