import React from 'react';
import axios from 'axios';

const API = 'http://localhost:3001/api';

class CharacterSelect extends React.Component{
    constructor( props ){
        super( props )
        this.state = {
            characters: [],
            updated: false
        };
    }
    componentDidMount(){
        axios.get(`${API}/character/name`)
        .then( (result) => {
            this.setState({characters: result.data});
        })
    }

    selected(event){
        const {idUpdater} = this.props;
        idUpdater(event.target.value);
        this.setState({updated: true});
    }

    render() {
        let {characters,updated} = this.state;
        if (!updated){
            characters = [{name:'Select a character', _id: -1}].concat(characters);
        }
        return (
            <select onChange={(e) => this.selected(e)}>
                {characters.map(item => (
                    <option value={item._id} key={item._id}>
                        {item.name}
                    </option>
                ))}
            </select>
        )
    }
}

export default CharacterSelect;