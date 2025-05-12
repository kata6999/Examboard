import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import getDBConnection from './db.js';

import { verifyToken, requireEnseignant } from './middlewar/authMiddleware.js';
import authRoutes from './routes/authRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import examsRoutes from './routes/examsRoutes.js'

const app = express();
const PORT = process.env.PORT || 8888;

let __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);



app.get('/', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/register.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/signin.html'));
})

app.get('/management/:name', verifyToken, requireEnseignant, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/management.html'));
});

app.get('/aide', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/aide.html'));
});

app.get('/apropos', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/apropos.html'));
});

app.use('/exams', examsRoutes);

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})