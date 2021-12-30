require('dotenv').config();


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'gunbelt', 'build')));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true} );
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const charcterRouter = require('./routes/character');
app.use('/api/character', charcterRouter);

const skillRouter = require('./routes/skill.js');
app.use('/api/skill', skillRouter);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..","gunbelt","build", "index.html"))
})


app.listen(3000, () => console.log('Server has started'));