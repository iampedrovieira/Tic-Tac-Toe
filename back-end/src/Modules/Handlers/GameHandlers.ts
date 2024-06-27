import { Socket } from "socket.io";

import Player from "../../Models/Player";
import Move from "../../Types/Move"
import StatusGame from "../../Types/StatusGame";
import { Sequelize } from "sequelize";
import RoomModel from "./../../../models/room";
import UserModel from "../../../models/user";
import GameModel from "../../../models/game";

module.exports = (io:any,socket:Socket,sequelize:Sequelize)=>{

    const onPlayerMove = async function (move:Move,roomName:string){
      //Get the room from DB
       //Find a room on the DB
      const Room = RoomModel(sequelize);
      const User = UserModel(sequelize);
      const Game = GameModel(sequelize);
      const roomObj = await Room.findOne({ where: { NAME: roomName }});
      if (!roomObj) return;
      //Get Room game from db
      const gameObj = await Game.findOne({ where: { ROOMID: roomObj.ID } });
      if (!gameObj) return;

      //Check if player is allowed to play
      if(gameObj.getPlayerAllowed()!=socket.id){
        socket.emit('cannotPlay','cannotPlay')
        return;
      }
      
      const status:StatusGame = gameObj.move(move,socket.id);
      await gameObj.save();

      const player1Info = await User.findOne({ where: { SOCKETID: gameObj.getPlayer1() } });
      if (!player1Info) return;
      const player2Info = await User.findOne({ where: { SOCKETID: gameObj.getPlayer2() } });
      if (!player2Info) return;
      
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

      io.to(roomName).emit("playerMove",{
        gameState: gameObj.getGameState(),
        player1: player1InfoJson,
        player2: player2InfoJson,
        playerAllowed: gameObj.getPlayerAllowed(), 
      });

      if(status.draw){
        const gameEndStatus ={
          'playerWin':'',
          'isDraw':status.draw,
          'playerWinId':'',
          'playerLossId':'',
          'playerNextId':'',
          'nextPlayers':[player1Info,player2Info]
        }

        io.to(roomName).emit('gameEnd',gameEndStatus)
      }
      if(status.win){
        let playerWinName =  await User.findOne({ where: { SOCKETID: status.playerWin } })
        const gameEndStatus ={
          'playerWin':playerWinName?.getName(),
          'isDraw':'',
          'playerWinId':'',
          'playerLossId':'',
          'playerNextId':'',
          'nextPlayers':[player1Info,player2Info]
        }
        io.to(roomName).emit('gameEnd',gameEndStatus)
      }

      if(status.draw || status.win){
        //Delete the game in DB
        await Game.destroy({where: { ROOMID: roomObj.ID }});
        
        setTimeout(async() => {
          //Update player 1 and player 2 option to -2 on DB 
          player1Info.setOption(-2);
          player2Info.setOption(-2);

          await player1Info.save();
          await player2Info.save();
          let playersInRoom = await User.findAll({where :{ ROOMID : roomObj.ID }, order: [['ID', 'ASC']]});
          const players = playersInRoom.map((player) => {
            const playerObj = new Player(player.SOCKETID, player.NAME);
            playerObj.setOption(player.OPTION);
            return playerObj;
          });

          io.to(roomObj.NAME).emit("onPlayersChange", players);
          io.to(playersInRoom[0].getSocketID()).emit("playerAvailable");
          io.to(playersInRoom[1].getSocketID()).emit("playerAvailable");
        
        }, 2500);
      }
    }

    return {
        onPlayerMove
    }
}