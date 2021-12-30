import React from 'react';
import axios from 'axios';
import './SkillTable.css'
import {default as SkillRows} from './SkillRow';

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

        let result = await axios.get(`api/skill`, {
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
        for (const cat in categories){
            categories[cat].sort( (a, b) => a.name.localeCompare(b.name));
        }
        this.props.onUpdate()
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