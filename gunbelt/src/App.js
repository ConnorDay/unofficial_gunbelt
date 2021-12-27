import React from 'react';
import './App.css';
import {SkillTable, CharacterSelect} from './components'

const tempList = [
    'thing one',
    'thing two',
    'thing three',
    'thing four',
    'thing five',
    'thing six',
    'thing seven',
    'thing eight',
];


class App extends React.Component{
    constructor( props ){
        super(props);
        this.state = {
            characterId: null
        }
    }

    setCharacterId( id ){
        this.setState({characterId: id});
    }

    render() {
        const {characterId} = this.state;
        if (characterId === null){
            return( 
                <div className="App">
                    <header className="App-header">
                        <CharacterSelect idUpdater={ (id) => this.setCharacterId(id)}/>
                    </header>
                    <div className='App-body'>
                        <p>
                            Please select a character :)
                        </p>
                    </div>
                </div>
            );
        }
        return (
            <div className="App">
                <header className="App-header">
                    <CharacterSelect idUpdater={ (id) => this.setCharacterId(id)}/>
                </header>
                <div className='App-body'>
                    <SkillTable characterId={characterId} />
                </div>
            </div>
        );
    }
}

export default App;
