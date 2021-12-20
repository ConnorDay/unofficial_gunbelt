const mongoose = require('mongoose');


const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    skills: {
        type: Object,
        required: true
    },
    equipment: {
        type: Array,
        required: true,
        default: []
    },
    stats: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model("Character", characterSchema);