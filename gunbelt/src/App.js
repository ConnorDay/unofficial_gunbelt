import React from 'react';
import './App.css';
import {SkillTable, CharacterSelect, Overview} from './components'


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
                        <p className='App-body-center'>
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
                    <div className='App-body-left'>
                        <SkillTable characterId={characterId} />
                    </div>
                    <div className='App-body-center'>
                        <Overview characterId={characterId} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
