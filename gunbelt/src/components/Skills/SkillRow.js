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

    ifEdit( toAdd ){
        const {editMode} = this.state;
        if (editMode){
            return toAdd;
        }
        return null;
    }

    render(){
        const {skills} = this.props;
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
                        <td className='skill-table-data'>
                            {this.ifEdit(<button onClick={() => this.buttonDecrease(skill.characterSkillId)}>-</button>)}
                            {skill.ranks}
                            {this.ifEdit(<button onClick={() => this.buttonIncrease(skill.characterSkillId)} disabled={skill.ranks === skill.maxRank}>+</button>)}
                        </td>
                        {this.ifEdit(<td className='skill-table-data'>{skill.cost}</td>)}
                    </tr>
                ))
            }
        }
        return ret;
    }
}

export default SkillRows;