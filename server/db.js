import sqlite3 from 'sqlite3'
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.resolve('server', 'data', 'app.db');

export default async function getDBConnection() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      birth TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      sem TEXT NOT NULL
    );
  `);

  await db.exec(`CREATE TABLE IF NOT EXISTS exams (
    id INTEGEXR PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    questions TET NOT NULL,
    sem TEXT NOT NULL,
    link TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        exam_id INTEGER NOT NULL,
        grade INTEGER NOT NULL,
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(exam_id) REFERENCES exams(id)
      );
    `);

  return db;
}