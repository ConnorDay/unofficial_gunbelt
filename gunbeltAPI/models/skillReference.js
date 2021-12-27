const mongoose = require('mongoose');

const skillReferenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        default: 1
    },
    maxRank: {
        type: Number,
        required: true,
        default: -3
    }
});

module.exports = mongoose.model("SkillReference", skillReferenceSchema)