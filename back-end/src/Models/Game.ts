import Move from '../Types/Move';
import Player from './Player';
export default class Game {
    
    gameState:number[][];
    player1:Player;
    player2:Player;
    playerAllowed:string;

    constructor(player1:Player,player2:Player){
        this.gameState=[];
        this.player1=player1;
        this.player2=player2;
        this.playerAllowed=player1.id;
    }
    move(playerMove:Move,playerId:string){

        //Update game state
        if(playerId!=this.playerAllowed)return;
        let playerOption:number = -1;
        if(this.player1.id==playerId){
            playerOption=this.player1.getOption();
            this.gameState[playerMove.positionX][playerMove.positionY] = playerOption;
            this.playerAllowed=this.player2.id
        }else{
            if(this.player2.id==playerId){
                playerOption=this.player2.getOption();
                this.gameState[playerMove.positionX][playerMove.positionY] = playerOption;
                this.playerAllowed=this.player1.id
            }
        }
        
        /*
        const verifyMove=verifyWin(this.gameState);
        if(verifyMove.win){

            //Return  {isWin:true,playerWin:string,nextPlayer:null}
            return
        }else{

            //Return {isWin:false,playerWin:null,nextPlayer:string}
            return
        }
        */
       
    }
    restart(){

        return
    }
}


//Auxiliar fuctions
function verifyWin(gameState:Game){

    //return {win:true||false,player:null||string}
    return
}
