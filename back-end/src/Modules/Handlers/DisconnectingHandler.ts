import { Socket } from "socket.io";
import { io } from "socket.io-client";
import Game from "../../Models/Game";
import Player from "../../Models/Player";

module.exports = (
  io: any,
  socket: Socket,
  players: Player[],
  games: Game[]
) => {
  const onDisconnecting = function () {
    var playerPosition: number = 0;
    let existPlayer = false
    players.forEach((player) => {
      if (player.getId() == socket.id) {
        existPlayer=true;
        playerPosition = players.indexOf(player);
        players.splice(players.indexOf(player), 1);
        return;
      }
    });
    if(!existPlayer)return;

    // * Verify if the player left was playing
    if (playerPosition <= 1) {
      // * Start new game with player[0] and player[1]
      games.pop();
      players.map((player) => {
        player.setOption(-1);
      });
      if (players.length >= 2) {
        try {
          const gameEndStatus = {
            playerWin: players[0].getName(),
            isDraw: false,
            playerWinId: players[0].getId(),
            playerLossId: "",
            playerNextIds: [players[0].getId(),players[1].getId()],
            nextPlayers: [players[0].getName(),players[1].getName()]
          };
          
          io.emit("gameEnd", gameEndStatus);

          setTimeout(() => {
            if (players.length >= 2) {
              io.to(players[0].getId()).emit("playerAvailable");
              io.to(players[1].getId()).emit("playerAvailable");
            } else {
              io.emit("waitingPlayer", "Waiting for player");
            }
          }, 2500);
        } catch (error) {
          io.emit("waitingPlayer", "Waiting for player");
        }
      } else {
        io.emit("waitingPlayer", "Waiting for player");
      }
    }
    io.emit("onPlayersChange", players);

    // * Send to all players a list of players on
    // * Put here the Listenters
  };

  return { onDisconnecting };
};
