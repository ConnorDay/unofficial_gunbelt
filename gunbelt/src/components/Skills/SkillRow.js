import React from 'react';
import axios from 'axios';

class SkillRows extends React.Component{
    constructor( props ){
        super(props)
        this.state = {
            editMode: props.editMode
        }
        this.updated = false;
    }

    async buttonIncrease(id){
        await axios.post(`api/skill/character/increase`,{},{
            params:{
                skillId:id
            }
        });
        this.props.update();
    }
    async buttonDecrease(id){
        await axios.post(`api/skill/character/decrease`,{},{
            params:{
                skillId:id
            }
        });
        this.props.update();
    }

    componentDid1Update(prevProps){
        if (prevProps.editMode !== this.props.editMode){
            this.setState({editMode: this.props.editMode});
        }
    }

    ifEdit( onEdit, onNotEdit ){
        const {editMode} = this.state;
        if (editMode){
            return onEdit;
        }
        return onNotEdit;
    }

    roll( skill ){
        axios.post('/api/roll', {
            characterId: skill.characterId,
            rolls:[
                {
                    type: "add",
                    name: skill.name,
                    content: [
                        {
                            type: "die",
                            content: 20
                        },
                        {
                            type: "skill",
                            content: skill.characterSkillId
                        }
                    ]
                }
            ]
        });
    }

    render(){
        const {skill} = this.props;
        return (
            <>
                <td className='skill-table-data'>{skill.name}</td>
                <td className='skill-table-data'>{skill.ranks}</td>
            </>
        )
    }
}

export default SkillRows;