import Player from './Player';
import Game from './Game';
export default class Room {
    
    name:string;
    players:Player[];
    game?:Game;
    playersCheck:Map<string,boolean>

    constructor(name:string,player?:Player){
        this.name=name;
        this.playersCheck = new Map()
        this.players = new Array()
    }
    getGame(){
        return this.game;
    }
    getName(){
        return this.name;
    }
    getPlayers(){
        return this.players;
    }
    getPlayersCheck(){
        return this.playersCheck;
    }
    setPlayersCheck(playerId:string,isCheck:boolean){
        this.playersCheck.set(playerId,isCheck);
    }
    addPlayer(player:Player){
        return this.players?.push(player);
    }
    setGame(game:Game){
        return this.game=game;
    }
    removePlayer(player:Player){
        const playerIndex = this.players?.indexOf(player) || 0
        return this.players?.splice(playerIndex,playerIndex);
    }
}