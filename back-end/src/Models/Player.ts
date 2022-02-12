export default class Player{
    id:string;
    name:string;
    option:number;
    wins:number;
    losses:number;
    draws:number;

    constructor(id:string,name:string){
        this.wins=0;
        this.losses=0;
        this.id=id;
        this.name=name;
        this.option=-1;
        this.draws=0;
    }
    getOption(){
        return this.option;
    }
    setOption(option:number){
        this.option=option;
    }
    getWins(){
        return this.wins;
    }
    won(){
        this.wins=this.wins+1;
    }
    getLosses(){
        return this.losses;
    }
    lost(){
        this.losses=this.losses+1;
    }
    getDraws(){
        return this.draw;
    }
    draw(){
        this.draws=this.draws+1;
    }
    getName(){
        return this.name;
    }
    setName(name:string){
        this.name=name
    }
    getId(){
        return this.id;
    }
}