import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getExamByLink } from '../controllers/examController.js';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/:link', async (req, res) => {
  try {
    const exam = await getExamByLink(req.params.link);
    if (!exam) {
      return res.status(404).send("Exam not found.");
    }

    res.sendFile(path.join(__dirname, '../../client/views/exam.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

import { saveGrade } from '../controllers/examController.js';

router.post('/grades', saveGrade);

export default router;