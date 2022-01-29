import React from 'react';
import {default as DieButton} from './DieButton';

class DiceTable extends React.Component{
    genDice(){
    }

    render(){
        console.log('rendering this bullshit');
        const dice = [4, 6, 8, 10, 12, 20, 100];
        return (
            <div>
                {dice.map((sides) => (
                    <DieButton characterId={this.props.characterId} sides={sides} />
                ))}
            </div>
        )
    }
}

export default DiceTable;