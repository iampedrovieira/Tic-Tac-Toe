
import { Component } from "react";
import styles from "./GameButton.module.css";
 
interface propsInput {
  isDisable:boolean,
  playerOption:number,
  option:number,
  event:Function
}

interface buttonState {
  isDisable:boolean,
  option:number,
  playerOption:number,
  style:string,
  event:Function
}

export default class GameButton extends 
  Component<propsInput,buttonState> {

  constructor(props: propsInput){
    super(props);
    this.state = {
      isDisable : props.isDisable,
      option: -1,
      playerOption:this.props.playerOption,
      style:styles.button,
      event: props.event
    }
  }

  UNSAFE_componentWillReceiveProps(_newProps: propsInput){
    let style:string
    
    if(_newProps.option == 0){
      style = styles.player1
       
    }else{
      
      if(_newProps.option == 1){
        style = styles.player2
      }else{
        style = styles.button;
      }
      
    }

    let newState = {
      isDisable : _newProps.isDisable,
      option:_newProps.option,
      playerOption:this.state.playerOption,
      style:style,
      event: this.state.event
    }
    this.setState(newState);
  }

  render(){
    
    let handleButton = () =>{
      if(!this.state.isDisable){
        const a = this.state.event()
        if(this.state.event()){
          let newState:buttonState
          if(this.state.playerOption == 0){
            
            newState = {
              isDisable : this.state.isDisable,
              option:this.state.option,
              playerOption:this.state.playerOption,
              style:styles.player1,
              event: this.state.event
            }
          }else{
            alert('asdasd')
            newState = {
              isDisable : this.state.isDisable,
              option:this.state.option,
              playerOption:this.state.playerOption,
              style:styles.player2,
              event: this.state.event
            }
          }
          this.setState(newState)
        }else{
          console.log('error')
        }
      }
    }

    let onMouseOver = () =>{
      
      if(!this.state.isDisable && this.state.option == -1){
        
        let newState:buttonState

        if(this.state.playerOption == 0){
          newState = {
            isDisable : this.state.isDisable,
            option:this.state.option,
            playerOption:this.state.playerOption,
            style:styles.player1,
            event: this.state.event
          }
        }else{
          newState = {
            isDisable : this.state.isDisable,
            option:this.state.option,
            playerOption:this.state.playerOption,
            style:styles.player2,
            event: this.state.event
          }
        }
        this.setState(newState)
      }
    }
      let onMouseOut = () =>{

        if(!this.state.isDisable && this.state.option == -1){
        
          let newState = {
            isDisable : this.state.isDisable,
            option:this.state.option,
            playerOption:this.state.playerOption,
            style:styles.button,
            event: this.state.event
          }
          this.setState(newState)
        }
    }

    return (
      <div className={this.state.style} 
        onClick={handleButton} 
        onMouseOver={onMouseOver} 
        onMouseOut={onMouseOut}  >
        
      </div>
  );
  }
  
}
