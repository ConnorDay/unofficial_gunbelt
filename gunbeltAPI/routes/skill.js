const express = require('express');
const router = express.Router();
const SkillReference = require('../models/skillReference');
const CharacterSkill = require('../models/characterSkill');
const Character = require('../models/character');

////////////////////
//SKILL REFERENCES//
////////////////////

//Get all skill references
router.get('/reference', getEntryById(SkillReference, 'referenceId'), async (req, res) => {
    if (res.entry === undefined){
        try {
            const references = await SkillReference.find();
            res.json(references);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    } else {
        res.json(res.entry);
    }
});

router.post('/reference', async (req, res) => {
    const reference = new SkillReference({
        name: req.body.name,
        category: req.body.category,
        cost: req.body.cost,
        maxRank: req.body.maxRank
    });

    try {
        const newReference = await reference.save();
        res.status(201).json(newReference);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.patch('/reference', getEntryById(SkillReference, 'referenceId'), async (req, res) => {
    if (res.entry === undefined){
        res.status(400).json( {message: "No reference provided"} );
        return;
    }

    for (let key in req.body){
        const value = req.body[key];
        res.entry[key] = value;
    }

    try {
        let updatedReference = await res.entry.save();
        res.json(updatedReference);
    } catch(error) {
        res.status(400).json( {message: error.message} );
    }
});

router.delete('/reference', getEntryById(SkillReference, 'referenceId'), async(req, res) => {
    if (res.entry === undefined){
        res.status(400).json( {message: "No reference provided"} );
        return;
    }

    try {
        await res.entry.remove();
        res.json({message: "Deleted Reference"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//////////////////////
//CHARARACTER SKILLS//
//////////////////////

router.get('/character', getEntryById(CharacterSkill, 'skillId'), async (req, res) => {
    if (res.entry === undefined){
        const query = {};
        if (req.query.characterId != undefined){
            query['characterId'] = req.query.characterId;
        }
        try {
            const references = await CharacterSkill.find(query);
            res.json(references);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    } else {
        res.json(res.entry);
    }
});

router.post('/character', async (req, res) => {
    const charSkill = new CharacterSkill({
        characterId: req.body.characterId,
        skillReferenceId: req.body.skillReferenceId,
        ranks: req.body.ranks
    });

    try{
        const newCharSkill = await charSkill.save();
        res.status(201).json(newCharSkill);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

router.post('/character/increase', getEntryById(CharacterSkill, 'skillId'), async (req, res) => {

    //Check that a skill was provided
    if (res.entry === undefined){
        res.status(400).json({message: "No skillId provided"});
        return;
    }

    //Get total skill points
    let char;
    try {
        char = await Character.findById(res.entry.characterId);
    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }
    const totalSkillPoints = 42 + 6 * (char.level - 1);

    //Check if the skill is max level
    let chosenReference;
    try{
        chosenReference = await SkillReference.findById(res.entry.skillReferenceId);
        let maxRank = chosenReference.maxRank;
        maxRank = maxRank < 0 ? -maxRank + char.level : maxRank;
        if (res.entry.ranks >= maxRank){
            //Change nothing
            res.json(res.entry);
            return;
        }
    } catch (error){
        res.status(500).json({message: error.message});
        return;
    }

    //Get spent skill points
    let skills;
    try {
        skills = await CharacterSkill.find({characterId: res.entry.characterId});
    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }

    let spentSkillPoints = 0;
    for (const i in skills){
        const skill = skills[i];
        try{
            const reference = await SkillReference.findById(skill.skillReferenceId);
            spentSkillPoints += skill.ranks * reference.cost;
        } catch (error) {
            res.status(500).json({message: error.message});
            return;
        }
    }

    //Check if the player has enough points to upgrade
    const availablePoints = totalSkillPoints - spentSkillPoints;
    if (chosenReference.cost > availablePoints){
        //not enough points, change nothing
        res.json(res.entry);
        return;
    }

    //increment skill rank and send response
    try {
        res.entry.ranks++;
        const newSkill = await res.entry.save();
        res.json(newSkill);
    } catch (error) {
        res.status(500).json({message: error.message});
        return;
    }

})

router.patch('/character', getEntryById(CharacterSkill, 'skillId'), async (req, res) => {
    if (res.entry === undefined){
        res.status(400).json({message: "No skillId provided"});
        return;
    }

    for (let key in req.body){
        const value = req.body[key];
        res.entry[key] = value;
    }

    try {
        let updatedSkill = await res.entry.save();
        res.json(updatedSkill);
    } catch(error) {
        res.status(400).json( {message: error.message} );
    }
});

router.delete('/character', getEntryById(CharacterSkill, 'skillId'), async (req, res) => {
    if (res.entry === undefined){
        res.status(400).json( {message: "No reference provided"} );
        return;
    }

    try {
        await res.entry.remove();
        res.json({message: "Deleted Reference"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//////////////
//MIDDLEWARE//
//////////////

function getEntryById( db, id, query ){
    async function queryById( req, res, next ) {
        if ( req.query[id] != undefined ){
            let entry;
            try {
                entry = await db.findById(req.query[id], query);
                if (entry === null){
                    return res.status(400).json({message: `Cannot find entry for id: ${req.query[id]}`})
                }
            } catch (error) {
                return res.status(500).json( {message: error.message} )
            }

            res.entry = entry;
        }
        next();
    }

    return queryById;
}

function manageMiddleware(query){
    async function getCharacter(req, res, next) {
        if ( req.query.character != undefined){
            try {
                character = await Character.findById(req.query.character, query);
                if ( character === null){
                    return res.status(400).json({message: "Cannot find character"});
                }
            } catch (error) {
                return res.status(500).json( {message: error.message} );
            }

            res.character = character;
        }
        next();
    }

    return getCharacter;
}

module.exports = router;