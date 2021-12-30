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

    componentDidUpdate(prevProps){
        if (prevProps.editMode !== this.props.editMode){
            this.setState({editMode: this.props.editMode});
        }
    }

    render(){
        const {skills} = this.props;
        const {editMode} = this.state;
        const ret = [];
        let dark = false;
        const keys = Object.keys(skills).sort();
        for (const j in keys){
            const cat = keys[j];
            const list = skills[cat];
            const catTheme = dark ? 'skill-table-dark' : '';
            dark = !dark;
            for (const i in list){
                const skill = list[i];
                ret.push((
                    <tr className='skill-table-row' key={skill.name}>
                        {i==='0' ? <td className={catTheme} rowSpan={list.length}>{cat}</td> : null}
                        <td className='skill-table-data'>{skill.name}</td>
                        { editMode? 
                            <td className='skill-table-data'>{skill.cost}</td>
                        :null}
                        { editMode?
                            <td className='skill-table-data'>
                                <button onClick={() => this.buttonDecrease(skill.characterSkillId)}>-</button>
                            </td>
                        :null}
                        <td className='skill-table-data'>{skill.ranks}</td>
                        { editMode?
                            <td className='skill-table-data'>
                                <button onClick={() => this.buttonIncrease(skill.characterSkillId)} disabled={skill.ranks === skill.maxRank}>+</button>
                            </td>
                        :null}
                    </tr>
                ))
            }
        }
        return ret;
    }
}

export default SkillRows;