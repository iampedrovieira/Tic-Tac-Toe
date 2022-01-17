import { Socket } from "socket.io-client";
import ButtonConfig from "./ButtonConfig";
import Game from "./Game";

export default interface BoardState{
    playerId:string,
    disableButtons:Boolean,
    game:Game,
    message:string,
    socket?:Socket,
    buttonsState:Array<Array<ButtonConfig>>
}