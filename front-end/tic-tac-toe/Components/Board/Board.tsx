import { Component } from "react";
import { Socket } from "socket.io-client";
import BoardState from "Types/BoardState";

import Game from "Types/Game";
import Move from "Types/Move";
import styles from "../../styles/Home.module.css";

export default class App extends Component<
  {
    game: Game;
    socket: Socket;
    setMessage: Function;
    gameEnd: Boolean;
    handleEmitMove: Function;
  },
  BoardState
> {
  constructor(props: {
    game: Game;
    socket: Socket;
    setMessage: Function;
    gameEnd: Boolean;
    handleEmitMove: Function;
  }) {
    super(props);
    this.state = {
      playerId: props.socket.id,
      game: props.game,
      isGameEnd: false,
      setMessage: props.setMessage,
      socket: props.socket,
      handleEmitMove: props.handleEmitMove,
      buttonsState: [
        [
          { styles: styles.button, disable: true },
          { styles: styles.button, disable: true },
          { styles: styles.button, disable: true },
        ],
        [
          { styles: styles.button, disable: true },
          { styles: styles.button, disable: true },
          { styles: styles.button, disable: true },
        ],
        [
          { styles: styles.button, disable: true },
          { styles: styles.button, disable: true },
          { styles: styles.button, disable: true },
        ],
      ],
    };
  }
  UNSAFE_componentWillReceiveProps(_newProps: {
    game: Game;
    gameEnd: Boolean;
  }) {
    if (_newProps.gameEnd) {
      this.setState({
        buttonsState: [
          [
            { styles: styles.button, disable: true },
            { styles: styles.button, disable: true },
            { styles: styles.button, disable: true },
          ],
          [
            { styles: styles.button, disable: true },
            { styles: styles.button, disable: true },
            { styles: styles.button, disable: true },
          ],
          [
            { styles: styles.button, disable: true },
            { styles: styles.button, disable: true },
            { styles: styles.button, disable: true },
          ],
        ],
      });
    } else {
      let newButtonState = this.state.buttonsState;
      let isAllowed: boolean = false;
      if (_newProps.game.playerAllowed == this.state.playerId) isAllowed = true;
      if (isAllowed) this.state.setMessage("Its your time to play");
      if (!isAllowed) this.state.setMessage("Wait for other player move");

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (_newProps.game.gameState[i][j] == 0) {
            newButtonState[i][j].disable = true;
            newButtonState[i][j].styles = styles.player1;
          }
          if (_newProps.game.gameState[i][j] == 1) {
            newButtonState[i][j].disable = true;
            newButtonState[i][j].styles = styles.player2;
          }
          if (_newProps.game.gameState[i][j] == -1) {
            if (isAllowed) newButtonState[i][j].disable = false;
            if (!isAllowed) newButtonState[i][j].disable = true;
            newButtonState[i][j].styles = styles.button;
          }
        }
      }
      this.setState({ game: _newProps.game });
    }
  }
  render() {
    let handleButton = (positionX: number, positionY: number): void => {
      if (this.state.playerId != this.state.game?.playerAllowed) return;

      if (this.state.buttonsState[positionX][positionY].disable) return;

      let newButtonState = this.state.buttonsState;
      let playerOption;

      if (this.state.game.player1?.id == this.state.playerId)
        playerOption = this.state.game.player1?.option;

      newButtonState[positionX][positionY].styles = styles.player1;

      if (this.state.game.player2?.id == this.state.playerId)
        playerOption = this.state.game.player2?.option;

      newButtonState[positionX][positionY].styles = styles.player2;

      newButtonState[positionX][positionY].disable = true;

      this.setState({ buttonsState: newButtonState });

      const move: Move = { positionX, positionY };
      this.state.handleEmitMove(move);
    };

    return (
      <div className={styles.game}>
        <div className={styles.line}>
          <button
            disabled={this.state.buttonsState[0][0].disable}
            className={this.state.buttonsState[0][0].styles}
            onClick={() => handleButton(0, 0)}
          ></button>
          <button
            disabled={this.state.buttonsState[0][1].disable}
            className={this.state.buttonsState[0][1].styles}
            onClick={() => handleButton(0, 1)}
          ></button>
          <button
            disabled={this.state.buttonsState[0][2].disable}
            className={this.state.buttonsState[0][2].styles}
            onClick={() => handleButton(0, 2)}
          ></button>
        </div>
        <div className={styles.line}>
          <button
            disabled={this.state.buttonsState[1][0].disable}
            className={this.state.buttonsState[1][0].styles}
            onClick={() => handleButton(1, 0)}
          ></button>
          <button
            disabled={this.state.buttonsState[1][1].disable}
            className={this.state.buttonsState[1][1].styles}
            onClick={() => handleButton(1, 1)}
          ></button>
          <button
            disabled={this.state.buttonsState[1][2].disable}
            className={this.state.buttonsState[1][2].styles}
            onClick={() => handleButton(1, 2)}
          ></button>
        </div>
        <div className={styles.line}>
          <button
            disabled={this.state.buttonsState[2][0].disable}
            className={this.state.buttonsState[2][0].styles}
            onClick={() => handleButton(2, 0)}
          ></button>
          <button
            disabled={this.state.buttonsState[2][1].disable}
            className={this.state.buttonsState[2][1].styles}
            onClick={() => handleButton(2, 1)}
          ></button>
          <button
            disabled={this.state.buttonsState[2][2].disable}
            className={this.state.buttonsState[2][2].styles}
            onClick={() => handleButton(2, 2)}
          ></button>
        </div>
      </div>
    );
  }
}
