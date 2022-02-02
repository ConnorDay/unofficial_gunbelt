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

    async buttonChange( increase ){
        const direction = increase ? 'increase' : 'decrease';
        await axios.post(`api/skill/character/${direction}`,{},{
            params:{
                skillId:this.props.skill.characterSkillId
            }
        });
        this.props.update();
    }

    async buttonIncrease(){
        this.buttonChange(true)
    }
    async buttonDecrease(){
        this.buttonChange(false)
    }

    componentDidUpdate(prevProps){
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

    roll(){
        const {skill} = this.props;
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
                <td className='skill-table-data'>
                    {
                        this.ifEdit(
                            <>
                                <button onClick={() => this.buttonDecrease()}>-</button>
                                {skill.ranks}
                                <button onClick={() => this.buttonIncrease()}>+</button>
                            </>,
                            <button onClick={() => this.skill()}>{skill.ranks}</button>
                        )
                    }
                </td>
                {
                    //Cost
                    this.ifEdit(
                        <td className='skill-table-data'>{skill.cost}</td>
                    )
                }
            </>
        )
    }
}

export default SkillRows;