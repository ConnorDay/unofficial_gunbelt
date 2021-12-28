import React from 'react';
import axios from 'axios';
const API = 'http://localhost:3001/api';

class SkillRows extends React.Component{
    constructor( props ){
        super(props)
        this.state = {
            editMode: props.editMode
        }
        this.updated = false;
    }

    async buttonIncrease(id){
        await axios.post(`${API}/skill/character/increase`,{},{
            params:{
                skillId:id
            }
        });
        this.props.update();
    }
    async buttonDecrease(id){
        await axios.post(`${API}/skill/character/decrease`,{},{
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
        for (const cat in skills){
            const list = skills[cat];
            const catTheme = dark ? 'skill-table-dark' : '';
            dark = !dark;
            for (const i in list){
                const skill = list[i];
                ret.push((
                    <tr className='skill-table-row' key={skill.skill}>
                        {i==='0' ? <td className={catTheme} rowSpan={list.length}>{cat}</td> : null}
                        <td className='skill-table-data'>{skill.skill}</td>
                        { editMode?
                            <td className='skill-table-data'>
                                <button onClick={() => this.buttonDecrease(skill.skillId)}>-</button>
                            </td>
                        :null}
                        <td className='skill-table-data'>{skill.ranks}</td>
                        { editMode?
                            <td className='skill-table-data'>
                                <button onClick={() => this.buttonIncrease(skill.skillId)}>+</button>
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