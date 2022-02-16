// * This is a component with list of players using a component PlayerInfo

import { Component } from "react";
import Player from "Types/Player";

export default class PlayerListComponent extends Component<{players:Player[] }> {
    
    render() {
        return(
        <div>
                <ol>
                    Players 
                    {this.props.players.map((player,index)=>{
                        
                        return(<li key={index}> 
                        {player.name} </li>)
                    })}
                </ol>
        </div>
        )
    }
}