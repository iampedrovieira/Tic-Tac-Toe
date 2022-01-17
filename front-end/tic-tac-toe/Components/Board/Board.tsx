import { Component } from "react";
import BoardState from "Types/BoardState";
import ButtonConfig from "Types/ButtonConfig";
import Game from "Types/Game";
import Move from "Types/Move";
import styles from '../styles/Home.module.css'


export default class App extends Component<{ message: string }, BoardState> {
  state:BoardState = {
    playerId:'',
    disableButtons:true,
    game:{},
    message:'',
    buttonsState:
      [
        [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
        [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}],
        [{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true},{'styles':styles.button,'disable':true}]
      ]
  };
  render() {
    
    let handleButton=(positionX:number,positionY:number):void => {
      if(this.state.playerId!=this.state.game?.playerAllowed)alert('Cannot play');
      if(this.state.buttonsState[positionX][positionY].disable) return;
      let newButtonState = this.state.buttonsState;
      let playerOption;
      if(this.state.game?.player1?.Id==this.state.playerId)playerOption=this.state.game?.player1?.Option;newButtonState[positionX][positionY].styles=styles.player1;
      if(this.state.game?.player2?.Id==this.state.playerId)playerOption=this.state.game?.player2?.Option;newButtonState[positionX][positionY].styles=styles.player2;
      newButtonState[positionX][positionY].disable=true;
      console.log('CARREGUEI NO BUTTAO')
      console.log(newButtonState)
      console.log('----------------------') 
      this.state.buttonsState=newButtonState;
      // TODO Change gameState
  
      const move:Move ={positionX,positionY}
      this.state.socket?.emit('playerMove',move);
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