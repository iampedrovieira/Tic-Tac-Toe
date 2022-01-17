import Move from '../Types/Move';
import StatusGame from '../Types/StatusGame';
import Player from './Player';
export default class Game {
    
    gameState:number[][];
    player1:Player;
    player2:Player;
    playerAllowed:string;

    constructor(player1:Player,player2:Player){
        this.gameState=[[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]];
        this.player1=player1;
        this.player2=player2;
        this.playerAllowed=player1.id;
    }
    move(playerMove:Move,playerId:string):StatusGame{

        //Update game state
        // * Verify if player is allowed 
        if(playerId!=this.playerAllowed){
            return  {
                'win':false,
                'playerWin':'',
                'playerWinOpiton':-1,
                'draw':true,
                'message':'Not allowed to play'
            };
        }

        // * Verify if play is possible
        if(this.gameState[playerMove.positionX][playerMove.positionY]!=-1){
            return  {
                'win':false,
                'playerWin':'',
                'playerWinOpiton':-1,
                'draw':true,
                'message':'Not allowed to play'
            };
        }

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
        // * Verify if game is end

        let winOption:number = -1;
        // * Lines 
            // ** 1º line
        if(this.gameState[0][0]==this.gameState[0][1] && this.gameState[0][1]==this.gameState[0][2] && this.gameState[0][2] !=-1)winOption = this.gameState[0][2]
        // ** 2º line 
        if(this.gameState[1][0]==this.gameState[1][1] && this.gameState[1][1]==this.gameState[1][2] && this.gameState[1][2] !=-1)winOption = this.gameState[1][2]
        // ** 3º line 
        if(this.gameState[2][0]==this.gameState[2][1] && this.gameState[2][1]==this.gameState[2][2] && this.gameState[2][2] !=-1)winOption = this.gameState[2][2]
        // * Columns  
            // ** 1º column 
        if(this.gameState[0][0]==this.gameState[1][0] && this.gameState[1][0]==this.gameState[2][0] && this.gameState[2][0] !=-1)winOption = this.gameState[2][0]
            // ** 2º column 
        if(this.gameState[0][1]==this.gameState[1][1] && this.gameState[1][1]==this.gameState[2][1] && this.gameState[2][1] !=-1)winOption = this.gameState[2][1]
            // ** 3º column 
        if(this.gameState[0][2]==this.gameState[1][2] && this.gameState[1][2]==this.gameState[2][2] && this.gameState[2][2] !=-1)winOption = this.gameState[2][2]
        // * Diagonals 
            // ** 1º Diagonal 
        if(this.gameState[0][0]==this.gameState[1][1] && this.gameState[1][1]==this.gameState[2][2] && this.gameState[2][2] !=-1)winOption = this.gameState[2][2]
            // ** 2º Diagonal 
        if(this.gameState[2][0]==this.gameState[1][1] && this.gameState[1][1]==this.gameState[0][2] && this.gameState[0][2] !=-1)winOption = this.gameState[0][2]
        
        // * Draw
        // ! when 1 2 is -1 the draw value is true, and that is wrong
        let isDraw:boolean = true
        for(var i = 0;i<3;i++){
            for(var j = 0;j<3;j++){

                if(this.gameState[i][j]== -1 || winOption != -1) 
                {
                    isDraw = false;
                    break;
                }
            }
            if(!isDraw)break;
        }
        if(isDraw){

            return {
                'win':false,
                'playerWin':'',
                'playerWinOpiton':-1,
                'draw':true,
                'message':''
            }
        }

        if(winOption!=-1){
            return {
                'win':true,
                'playerWin':playerId,
                'playerWinOpiton':playerOption,
                'draw':false,
                'message':''
            }
        }

        return {
            'win':false,
            'playerWin':'',
            'playerWinOpiton':-1,
            'draw':false,
            'message':''
        }
       
    }
    getGameState(){
        return this.gameState;
    }
    getPlayer1(){
        return this.player1;
    }
    getPlayer2(){
        return this.player2;
    }
    getPlayerAllowed(){
        return this.playerAllowed;
    }
    setPlayerAllowed(playerId:string){
        this.playerAllowed=playerId;
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
