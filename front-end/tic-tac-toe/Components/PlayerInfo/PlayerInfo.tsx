// * This is a component with player info like [ Name  wins draws losses ]

import { Component, useState } from "react";
import Player from "Types/Player";
import react from 'react'
import styles from './PlayerInfo.module.css'

interface State {
    styleOption:string
}

export default class PlayerInfo extends Component<{player:Player },State> {
    
    constructor(props: { player: Player; } | Readonly<{ player: Player; }>) {
        super(props);
        this.state = {
            styleOption:''
        };
    }
    componentDidMount() {
        if(this.props.player.option==0)this.setState({styleOption:styles.option1});
        if(this.props.player.option==1)this.setState({styleOption:styles.option2});
        if(this.props.player.option==-1)this.setState({styleOption:styles.spectator});
        if(this.props.player.option==-2)this.setState({styleOption:styles.optionWaitting});
        if(this.props.player.option==-3)this.setState({styleOption:styles.optionReady});
    }
    componentWillReceiveProps(_newProps:{ player: Player; }){
        if(_newProps.player.option==0)this.setState({styleOption:styles.option1});
        if(_newProps.player.option==1)this.setState({styleOption:styles.option2});
        if(_newProps.player.option==-1)this.setState({styleOption:styles.spectator});
        if(_newProps.player.option==-2)this.setState({styleOption:styles.optionWaitting});
        if(_newProps.player.option==-3)this.setState({styleOption:styles.optionReady});
    }
    

    render() {

        return(
        <div className={styles.main_box}>
            <div className={styles.name}>
               <p> {this.props.player.name}</p>
            </div>
            <span className={this.state.styleOption}>
            </span>
            
        </div>
        )
    }
}

