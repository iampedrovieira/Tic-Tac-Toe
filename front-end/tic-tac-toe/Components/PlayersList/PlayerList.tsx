import { Component } from "react";
import Player from "Types/Player";
import PlayerInfo from 'Components/PlayerInfo/PlayerInfo';
import styles from "./PlayerList.module.css";
export default class PlayerListComponent extends Component<{players:Player[] }> {
    constructor(props: { players: Player[]; } | Readonly<{ players: Player[]; }>) {
        super(props);
    }
    render() {
        return(
        <div className={styles.container}>
            <div className={styles.title}>Players</div>
            <div className={styles.list}>
            {this.props.players.map((player,index)=>{
                return(
                  <PlayerInfo key={index} player={player} />
                )
              })}
            </div>
        </div>
        )
    }
}