import React from 'react';
import './SkillTable.css'
import {default as SkillRows} from './SkillRow';

function SkillTable({skills}){
    return (
        <table className='skill-table'>
            <tr className='skill-table-row'>
                <th className='skill-table-header'>Skill</th>
                <th>Value</th>
            </tr>
            <SkillRows skills={skills} />
        </table>
    )
}

export default SkillTable;