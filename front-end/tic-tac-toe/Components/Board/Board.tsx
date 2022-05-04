
import { Component } from "react";
import { Socket } from "socket.io-client";
import BoardState from "Types/BoardState";
import ButtonConfig from "Types/ButtonConfig";
import Game from "Types/Game";
import Move from "Types/Move";
import styles from '../../styles/Home.module.css'


export default class App extends Component<{ game: Game,socket:Socket,setMessage:Function }, BoardState> {
  constructor(props:{game:Game,socket:Socket,setMessage:Function}){
    super(props)
    this.state={
      playerId:props.socket.id,
      game:props.game,
      message:'',
      socket:props.socket,
      buttonsState:
        [
          [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
          [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
          [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}]
        ],
      setMessage:props.setMessage
    };

    this.state.socket.on("gameEnd", (winner: string) => {
      // * [TEMP] Dá restart ao jogo
      console.log('FIM DO JOGO----------------------------')
      // TODO Falta atualzar o gameState
      const newState:BoardState ={
        playerId:this.state.playerId,
        game:this.state.game,
        socket:this.state.socket,
        message:'',
        buttonsState:[[
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
        ]],
        setMessage:this.state.setMessage,
      };
      this.setState(newState);
  })
}
  
  UNSAFE_componentWillReceiveProps(_newProps: { game: Game }) {
  

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
      const newState:BoardState ={
        playerId:this.state.playerId,
        game:_newProps.game,
        socket:this.state.socket,
        message:'',
        buttonsState:newButtonState,
        setMessage:this.state.setMessage,
      };
      this.setState(newState);
  }
  render() {
    
    let handleButton=(positionX:number,positionY:number):void => {
     
    if (this.state.playerId != this.state.game?.playerAllowed)return;
    
    if (this.state.buttonsState[positionX][positionY].disable) return;
    
    let newButtonState = this.state.buttonsState;
    let playerOption;
    
    if (this.state.game.player1?.id == this.state.playerId) playerOption = this.state.game.player1?.option;
    
    newButtonState[positionX][positionY].styles = styles.player1;
    
    if (this.state.game.player2?.id == this.state.playerId) playerOption = this.state.game.player2?.option;
    
    newButtonState[positionX][positionY].styles = styles.player2;
    
    newButtonState[positionX][positionY].disable = true;
    
    const newState:BoardState ={
      playerId:this.state.playerId,
      game:this.props.game,
      socket:this.state.socket,
      message:'',
      buttonsState:newButtonState,
      setMessage:this.state.setMessage,
    };
    this.setState(newState);
    const move: Move = { positionX, positionY };
    this.state.socket.emit("playerMove", move);
    }

    return (
      <div className={styles.game}>
        <div className={styles.line}>
          <button disabled={this.state.buttonsState[0][0].disable} className={this.state.buttonsState[0][0].styles} onClick={()=>handleButton(0,0)} ></button>
          <button disabled={this.state.buttonsState[0][1].disable} className={this.state.buttonsState[0][1].styles} onClick={()=>handleButton(0,1)} ></button>
          <button disabled={this.state.buttonsState[0][2].disable} className={this.state.buttonsState[0][2].styles} onClick={()=>handleButton(0,2)}></button>
        </div>
        <div className={styles.line}>
          <button disabled={this.state.buttonsState[1][0].disable} className={this.state.buttonsState[1][0].styles} onClick={()=>handleButton(1,0)} ></button>
          <button disabled={this.state.buttonsState[1][1].disable} className={this.state.buttonsState[1][1].styles} onClick={()=>handleButton(1,1)} ></button>
          <button disabled={this.state.buttonsState[1][2].disable} className={this.state.buttonsState[1][2].styles} onClick={()=>handleButton(1,2)}></button>
        </div>
        <div className={styles.line}>
          <button disabled={this.state.buttonsState[2][0].disable} className={this.state.buttonsState[2][0].styles} onClick={()=>handleButton(2,0)} ></button>
          <button disabled={this.state.buttonsState[2][1].disable} className={this.state.buttonsState[2][1].styles} onClick={()=>handleButton(2,1)} ></button>
          <button disabled={this.state.buttonsState[2][2].disable} className={this.state.buttonsState[2][2].styles} onClick={()=>handleButton(2,2)}></button>
        </div>
      </div>
    );
  }
  
}