const express = require('express');
const router = express.Router();
const Character = require('../models/character');

// Get all or a single character
router.get('/', manageMiddleware(), async (req, res) => {
    if (res.character === undefined){
        //Get all Characters
        try {
            const characters = await Character.find();
            res.json(characters);
        } catch (error) {
            res.status(500).json({message: err.message});
        }
    } else {
        res.json(res.character);
    }
});

//get all names
router.get('/name', manageMiddleware({name:1}), async(req, res) => {
    if (res.character === undefined){
        try{
            const characters = await Character.find( {}, {name: 1});
            res.json(characters);
        } catch (error) {
            res.status(500).json({message: err.message});
        }
    } else {
        res.json(res.character);
    }
});

// Creating one
router.post('/', async (req, res) => {
    const character = new Character({
        name: req.body.name,
        level: req.body.level,
        hp: req.body.hp
    });

    try {
        const newCharacter = await character.save();
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(400).json( { message: error.message } );
    }
});
// Updating one
router.patch('/', manageMiddleware(), async (req, res) => {
    if (res.character === undefined){
        res.status(400).json( {message: "No character provided"} );
        return;
    }

    for (let key in req.body){
        const value = req.body[key];
        res.character[key] = value;
    }

    try {
        let newCharacter = await res.character.save();
        res.json(newCharacter);
    } catch(error) {
        res.status(400).json( {message: error.message} );
    }
});
// Deleting one
router.delete('/', manageMiddleware(), async (req, res) => {
    if (res.character === undefined){
        res.status(400).json( {message: "No character provided"} );
        return;
    }

    try {
        await res.character.remove()
        res.json({message: "Deleted Character"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

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