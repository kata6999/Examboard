import express from 'express';
import { verifyToken } from '../middlewar/authMiddleware.js';
import {
    createExam,
    getAllExams,
    getExamByLink,
    deleteExam
} from '../controllers/examController.js';
import getDBConnection from '../db.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
let __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);

const router = express.Router();

router.post('/grades', verifyToken, async (req, res) => {
    const db = await getDBConnection();
    const { exam_id, grade } = req.body;
    const student_id = req.user.id;
  
    try {
      await db.run(
        `INSERT INTO grades (student_id, exam_id, grade) VALUES (?, ?, ?)`,
        [student_id, exam_id, grade]
      );
      res.json({ message: 'Grade saved successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Error saving grade: ' + err.message });
    }
  });

router.get('/userinfo', verifyToken, (req, res) => {
    if (req.user) {
        res.json({ loggedIn: true, user: req.user });
    } else {
        res.json({ loggedIn: false });
    }
})

router.post('/exams', verifyToken, createExam);
router.get('/exams', verifyToken, getAllExams);
router.get('/exams/:link', async (req, res) => {
    try {
      const db = await getDBConnection();
      const exam = await db.get(`SELECT * FROM exams WHERE link = ?`, [req.params.link]);
      if (!exam) return res.status(404).json({ error: "Exam not found" });
  
      exam.questions = JSON.parse(exam.questions);
      res.json(exam);
    } catch (err) {
      console.error("Failed to fetch exam:", err);
      res.status(500).json({ error: "Server error while fetching exam" });
    }
  });
router.delete('/exams/:id', verifyToken, deleteExam);


export default router;