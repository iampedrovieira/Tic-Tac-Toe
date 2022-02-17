// * This is a component with player info like [ Name  wins draws losses ]

import { Component, useState } from "react";
import Player from "Types/Player";
import react from 'react'
import styles from './PlayerInfo.module.css'

export default class PlayerInfo extends Component<{player:Player }> {
    
    render() {

        //const [option,setOption] = useState<string>('')

        return(
        <div className={styles.main_box}>
            <div className={styles.name}>
               <p> {this.props.player.name}</p>
            </div>
            <span className={styles.option1}>
            </span>
            
        </div>
        )
    }
}

