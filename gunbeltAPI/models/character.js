const mongoose = require('mongoose');


const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    hp: {
        type: Number,
        required: true,
        default: 32
    }
});

module.exports = mongoose.model("Character", characterSchema);