const express = require('express');
const router = express.Router();
const Character = require('../models/character');

// Get all
router.get('/', async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (error) {
        res.status(500).json({message: err.message});
    }
});
// Getting one
router.get('/:id', getCharacter, (req, res) => {
    res.json(res.character);
});
// Creating one
router.post('/', async (req, res) => {
    const character = new Character({
        name: req.body.name,
        skills: req.body.skills,
        stats: req.body.stats
    });

    try {
        const newCharacter = await character.save();
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(400).json( { message: error.message } );
    }
});
// Updating one
router.patch('/:id', getCharacter, (req, res) => {

});
// Deleting one
router.delete('/:id', getCharacter, async (req, res) => {
    try {
        await res.character.remove()
        res.json({message: "Deleted Character"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

async function getCharacter(req, res, next) {
    try {
       character = await Character.findById(req.params.id);
       if ( character === null){
           return res.status(404).json({message: "Cannot find subscriber"});
       }
    } catch (error) {
        return res.status(500).json( {message: error.message} );
    }

    res.character = character;
    next();
}

module.exports = router;