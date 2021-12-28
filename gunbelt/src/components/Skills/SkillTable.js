import React from 'react';
import axios from 'axios';
import './SkillTable.css'
import {default as SkillRows} from './SkillRow';

const API = 'http://localhost:3001/api';

class SkillTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            skills: {}
        };
    }

    componentDidMount(){
        this.updateSkills();
    }

    componentDidUpdate(prevProps){
        if (prevProps.characterId !== this.props.characterId){
            this.updateSkills();
        }
    }

    async updateSkills(){

        let referenceIds = [];

        let result = await axios.get(`${API}/skill`, {
            params:{
                characterId: this.props.characterId
            }
        });

        const categories = {}
        result.data.forEach( (skill) => {
            if (categories[skill.category] === undefined){
                categories[skill.category] = [];
            }

            categories[skill.category].push(skill);
        });
        this.setState({skills: categories});
    }

    render(){
        const {skills} = this.state;
        const {editMode} = this.props;
        return (
            <table className='skill-table'>
                <tbody>
                    <SkillRows update={()=>this.updateSkills()} skills={skills} editMode={editMode}/>
                </tbody>
            </table>
        )
    }
}

export default SkillTable;