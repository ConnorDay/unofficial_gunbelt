import React from 'react';

function SkillRows({skills}){
    return skills.map(skill => (
        <tr className='skill-table-row'>
            <td className='skill-table-data'>{skill}</td>
            <td className='skill-table-data'>0</td>
        </tr>
    ));
}

export default SkillRows;