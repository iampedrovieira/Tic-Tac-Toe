export default class Player{
    id:string;
    name:string;
    option:number;
    wins:number;
    losses:number;

    constructor(id:string,name:string){
        this.wins=0;
        this.losses=0;
        this.id=id;
        this.name=name;
        this.option=-1;
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
    lost(){
        this.losses=this.losses+1;
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