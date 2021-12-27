const mongoose = require('mongoose');

const characterSkillSchema = new mongoose.Schema({
    characterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    skillReferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ranks: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("CharacterSkill", characterSkillSchema)