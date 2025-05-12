import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt, { hashSync } from 'bcryptjs';
import db from '../db.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
let __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);

const router = express.Router();
router.post('/login', async (req, res) => {
    try {
        const body = req.body;
        const database = await db();

        const result = await database.get(`SELECT * FROM users WHERE email = ?`, body.email);
        if (!result) return res.status(401).json({ message: 'Email not found' });

        const match = bcrypt.compareSync(body.password, result.password);
        if (!match) return res.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign(
            {
              id: result.lastID,
              email: result.email,
              role: result.role,
              firstname: result.firstname,
              lastname: result.lastname
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ firstname: result.firstname, lastname: result.lastname, role: result.role });
    } catch (e) {
        console.log(e)
        res.status(503).json({ message: "Error while trying to login!" });
    }
})

router.post('/register', async (req, res) => {
    const body = req.body;
    const hashedPassword = hashSync(body.password, 8);
    try {
        const database = await db();
        const pre = await database.prepare(`INSERT INTO users (firstname, lastname, birth, role, email, password, sem) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        const result = await pre.run(body.firstname, body.lastname, body.birth, body.role, body.email, hashedPassword, body.sem);
        const token = jwt.sign(
            {
              id: result.lastID,
              email: body.email,
              role: body.role,
              firstname: body.firstname,
              lastname: body.lastname
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            role: body.role,
            firstname: body.firstname,
            lastname: body.lastname
        });
        
    } catch(e) {
        console.log(e)
        if (e.code === "SQLITE_CONSTRAINT") {
            res.status(503).json({ message: "Email used!" });
        } else {
            res.status(503).json({ message: "Error while trying to register!" });
        }
    }
})

router.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200)
})


export default router;