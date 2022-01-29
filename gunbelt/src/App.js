import React from 'react';
import './App.css';
import {SkillTable, CharacterSelect, Overview} from './components'


class App extends React.Component{
    constructor( props ){
        super(props);
        this.state = {
            characterId: null,
            editMode: false,
            skillsUpdated: false,
            levelUpdated: false
        }
    }

    setCharacterId( id ){
        this.setState({characterId: id});
    }
    toggleEditMode(){
        const {editMode} = this.state;
        this.setState({editMode: !editMode});
    }

    setSkillsUpdated( value ){
        this.setState({skillsUpdated: value});
    }
    setLevelUpdated( value ){
        this.setState({levelUpdated: value});
    }

    render() {
        const {characterId, skillsUpdated, editMode, levelUpdated} = this.state;
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
                                <SkillTable characterId={characterId} onUpdate={() => this.setSkillsUpdated( true )} onFinishUpdate={() => this.setLevelUpdated(false)} levelUpdated={levelUpdated} editMode={editMode}/>
                            </div>
                            <div className='App-body-center'>
                                <Overview characterId={characterId} onUpdate={() => this.setLevelUpdated( true )} onFinishUpdate={() => this.setSkillsUpdated(false)} skillsUpdated={skillsUpdated} editMode={editMode}/>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }

}

export default App;
