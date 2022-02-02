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
        if (prevProps.characterId !== this.props.characterId || this.props.levelUpdated){
            this.props.levelUpdated = false;
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
        this.props.onFinishUpdate();
        this.setState({skills: categories});
    }

    getRows(){
        const {skills} = this.state;
        const {editMode} = this.props;

        const ret =[];
        let dark = false;
        //This is so that categories show up alphabetically
        const keys = Object.keys(skills).sort(); 

        //Iterate over each category
        keys.forEach( (category) => {
            //create the category
            const theme = dark ? 'skill-table-dark' : '';
            dark = !dark;
            let cat = (<td className={theme} rowSpan={skills[category].length}>{category}</td>);

            //Iterate over each skill in the category
            for (const skill of skills[category]){
                ret.push((
                    <tr className='skill-table-row' key={skill.name}>
                        {cat}
                        <SkillRows skill={skill}/>
                    </tr>
                ));
                //Make category a one-shot
                cat = (<></>);
            }
        });

        return ret;
    }

    render(){
        const {skills} = this.state;
        const {editMode} = this.props;
        return (
            <table className='skill-table'>
                <tbody>
                    {this.getRows()}
                </tbody>
            </table>
        )
    }
}

export default SkillTable;