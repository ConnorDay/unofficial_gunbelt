require('dotenv').config();


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true} );
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const charcterRouter = require('./routes/character');
app.use('/api/character', charcterRouter);

const skillRouter = require('./routes/skill.js');
app.use('/api/skill', skillRouter);


app.listen(3001, () => console.log('Server has started'));