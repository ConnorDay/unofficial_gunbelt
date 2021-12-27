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

        let result = await axios.get(`${API}/skill/character`, {
            params:{
                characterId: this.props.characterId
            }
        });

        result.data.forEach( (e) => {
            referenceIds.push( {
                referenceId: e.skillReferenceId,
                ranks: e.ranks
            });
        });

        const categories = {};

        for (const i in referenceIds){
            const e = referenceIds[i];
            const response = await axios.get(`${API}/skill/reference`, {
                params: {
                    referenceId: e.referenceId
                }
            });
            const reference = response.data;

            if (categories[reference.category] === undefined){
                categories[reference.category] = [];
            }
            categories[reference.category].push({
                ranks: e.ranks,
                skill: reference.name,
            });
        };

        this.setState({skills: categories})

    }

    render(){
        const {skills} = this.state;
        return (
            <table className='skill-table'>
                <tbody>
                    <SkillRows skills={skills} />
                </tbody>
            </table>
        )
    }
}

export default SkillTable;