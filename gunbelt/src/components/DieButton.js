import React from 'react';
import axios from 'axios';

/*
    props:
        @sides (int): number of sides the die should roll
        @characterId (id): the id of the currently selected character.
*/
class DieButton extends React.Component{
    roll(){
        axios.post('/api/roll', {
            characterId: this.props.characterId,
            rolls: [
                {
                    name: `d${this.props.sides}`,
                    type: "die",
                    content: this.props.sides
                }
            ]
        })
    }

    render(){
        console.log('rendering button');
        return (
            <button onClick={() => this.roll()}>{this.props.sides}</button>
        )
    }
}

export default DieButton;