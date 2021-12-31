const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const CharacterSkill = require('../models/characterSkill');
const Character = require('../models/character');

async function constant( content ){
    return parseFloat(content);
}
async function die( content ){
    const max = parseInt(content)
    return Math.floor(Math.random() * max) + 1
}
async function add( content ){
    let total = 0;
    for (const i in content){
        total += await evaluateRoll(content[i]);
    }
    return total;
}
async function mul( content ){
    let total = 1;
    for (const i in content){
        total *= await evaluateRoll(content[i]);
    }
    return total;
}
async function skill( content ){
    const skill = await CharacterSkill.findById(content);
    return skill.ranks
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
    /*await axios.post(`https://discord.com/api/webhooks/${process.env.DISCORD_TOKEN}`,{
    });*/

    

    try{
        const rolls = [];
        for (const roll of req.body.rolls){
            rolls.push( await evaluateRoll(roll) );
        }

        res.json(rolls);
    } catch (error) {
        res.json({message: error.message});
    }
});

module.exports = router;