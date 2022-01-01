const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const rand = require('random-seed');
require('dotenv').config();

const CharacterSkill = require('../models/characterSkill');
const Character = require('../models/character');

async function constant( content ){
    const obj = {
        crit: false,
        fumble: false,
        amount: parseFloat(content),
        string: content + ""
    };
    return obj;
}
async function die( content ){
    const max = parseInt(content)
    const roll = Math.floor(Math.random() * max) + 1;
    const obj = {
        crit: roll == max,
        fumble: roll == 1,
        amount: roll,
        string: `{${roll}}`
    };
    return obj;
}
async function operator( content, start, operation){
    const obj = {
        crit: false,
        fumble: false,
        amount: start,
        string: []
    };
    for (const i in content){
        const response = await evaluateRoll(content[i]);
        obj.crit = obj.crit || response.crit;
        obj.fumble = obj.fumble || response.fumble;
        obj.amount = operation(obj.amount, response.amount);
        obj.string.push(response.string);
    }
    return obj;
}
async function add( content ){
    const obj = await operator( content, 0, (a, b) => a+b);
    obj.string = `(${obj.string.join(' + ')})`;
    return obj;
}
async function mul( content ){
    const obj = await operator( content, 1, (a, b) => a*b);
    obj.string = `(${obj.string.join(' * ')})`;
    return obj;
}
async function skill( content ){
    const skill = await CharacterSkill.findById(content);
    const obj = {
        crit: false,
        fumble: false,
        amount: skill.ranks,
        string: `[${skill.ranks}]`
    };
    return obj;
}

async function evaluateRoll( roll ){
    const types = {
        'const': constant,
        'die': die,
        'add': add,
        'mul': mul,
        'skill': skill
    }

    const func = types[roll.type];
    if (func === undefined){
        throw new Error("Roll type not defined");
    }

    return await func(roll.content);
}

router.post('/', async (req, res) => {

    try{
        let char = await Character.findById(req.body.characterId);
        const rolls = [];
        const rollNames = [];
        const rollStrings = [];
        const rollValues = [];
        for (const roll of req.body.rolls){
            const eval = await evaluateRoll(roll)
            rolls.push( eval );
            rollNames.push(roll.name === undefined ? 'N/A' : `${roll.name}`);
            rollStrings.push(eval.string);
            rollValues.push(eval.amount);
        }

        const gen = new rand(char._id);
        let color = "";
        for (let i =0; i<3; i++){
            color += gen(100).toString();
        }

        await axios.post(`https://discord.com/api/webhooks/${process.env.DISCORD_TOKEN}`,{
            embeds:[
                {
                    title: `${char.name} Rolled`,
                    color: color,
                    fields: [
                        {
                            name: "***Roll Name***\t\t\t-",
                            value: rollNames.join('\n'),
                            inline: true
                        },
                        {
                            name: "***Roll Value***\t\t\t-",
                            value: rollValues.join('\n'),
                            inline: true
                        },
                        {
                            name: "***Roll String***",
                            value: rollStrings.join('\n'),
                            inline: true
                        },
                    ]
                }
            ]
        });

        res.json(rolls);
    } catch (error) {
        res.json({message: error.message});
    }
});

module.exports = router;