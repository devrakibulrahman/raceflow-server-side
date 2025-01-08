import express from 'express';
import mongodb from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

app.use(cors());
app.use(express.json());

const app = express();
const port = process.env.PORT || 2000;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;

app.get('/', (req, res) => {
    res.send('server running on 2000');
});

app.listen(port, (req, res) => {
    console.log(`http://localhost:${port}`);
});