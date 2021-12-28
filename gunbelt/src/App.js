import React from 'react';
import './App.css';
import {SkillTable, CharacterSelect, Overview} from './components'


class App extends React.Component{
    constructor( props ){
        super(props);
        this.state = {
            characterId: null,
            editMode: false
        }
    }

    setCharacterId( id ){
        this.setState({characterId: id});
    }
    toggleEditMode(){
        const {editMode} = this.state;
        this.setState({editMode: !editMode});
    }

    render() {
        const {characterId, editMode} = this.state;
        return( 
            <div className="App">
                <header className="App-header">
                    <CharacterSelect idUpdater={ (id) => this.setCharacterId(id)}/>
                    <button onClick={() => this.toggleEditMode()}>Edit</button>
                </header>
                <div className='App-body'>
                    { characterId === null ?
                        <p className='App-body-center'>
                            Please select a character :)
                        </p> 
                        :
                        <>
                            <div className='App-body-left'>
                                <SkillTable characterId={characterId} editMode={editMode}/>
                            </div>
                            <div className='App-body-center'>
                                <Overview characterId={characterId} editMode={editMode}/>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

export default App;
