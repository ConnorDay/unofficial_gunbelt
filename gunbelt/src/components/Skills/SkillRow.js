import React from 'react';

function SkillRows({skills}){
    const ret = [];
    let dark = false;
    for (const cat in skills){
        const list = skills[cat];
        const catTheme = dark ? 'skill-table-dark' : '';
        dark = !dark;
        for (const i in list){
            const skill = list[i];
            if (i === '0'){
                ret.push((
                    <tr className='skill-table-row' key={skill.skill}>
                        <td className={catTheme} rowSpan={list.length}>{cat}</td>
                        <td className='skill-table-data'>{skill.skill}</td>
                        <td className='skill-table-data'>{skill.ranks}</td>
                    </tr>
                ))
            } else{
                ret.push((
                    <tr className='skill-table-row' key={skill.skill}>
                        <td className='skill-table-data'>{skill.skill}</td>
                        <td className='skill-table-data'>{skill.ranks}</td>
                    </tr>
                ))
            }
        }
    }
    return ret;
}

export default SkillRows;