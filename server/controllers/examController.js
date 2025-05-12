import getDBConnection from '../db.js';

import crypto from 'crypto';

export async function createExam(req, res) {
  const { title, description, user_id, questions, sem } = req.body;
  const examLink = crypto.randomBytes(16).toString('hex');
  try {
    const db = await getDBConnection();
    const result = await db.run(
      `INSERT INTO exams (user_id, title, description, questions, sem, link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, JSON.stringify(questions), sem, examLink]
    );
    res.status(201).json({ id: result.lastID, link: examLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllExams(req, res) {
  try {
    const db = await getDBConnection();
    const userId = req.user.id;
    const exams = await db.all(`SELECT * FROM exams WHERE user_id = ?`, [userId]);
    exams.forEach(exam => {
      exam.link = `${req.protocol}://${req.get('host')}/exams/${exam.link}`;
    });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function getExamByLink(link) {
  const db = await getDBConnection();
  const exam = await db.get('SELECT * FROM exams WHERE link = ?', [link]);
  if (exam) {
    exam.questions = JSON.parse(exam.questions);
    return exam;
  }
  return null;
}

export async function deleteExam(req, res) {
    const db = await getDBConnection();
    await db.run(`DELETE FROM exams WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Exam deleted' });
  }

  export async function saveGrade(req, res) {
    const { student_email, exam_id, grade } = req.body;
  
    if (!student_email || !exam_id || grade == null) {
      return res.status(400).json({ error: 'Missing data' });
    }
  
    try {
      const db = await getDBConnection();
      await db.run(
        `INSERT INTO grades (student_email, exam_id, grade) VALUES (?, ?, ?)`,
        [student_email, exam_id, grade]
      );
      res.status(201).json({ message: 'Grade saved' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }