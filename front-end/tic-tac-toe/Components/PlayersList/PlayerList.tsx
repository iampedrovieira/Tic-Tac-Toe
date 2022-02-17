// * This is a component with list of players using a component PlayerInfo

import { Component } from "react";
import Player from "Types/Player";
import PlayerInfo from 'Components/PlayerInfo/PlayerInfo';

export default class PlayerListComponent extends Component<{players:Player[] }> {
    
    render() {
        return(
        <div>
                <ol>
                    Players 
                    {this.props.players.map((player,index)=>{
                        
                        return(
                            <PlayerInfo key={index} player={player} />
                        )
                    })}
                </ol>
        </div>
        )
    }
}