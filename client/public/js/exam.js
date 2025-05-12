const link = window.location.pathname.split('/').pop();

fetch(`/api/exams/${link}`)
  .then(res => res.json())
  .then(startExam)
  .catch(err => {
    console.error("Failed to fetch exam:", err);
    document.getElementById('exam-container').innerHTML = "<h2>Erreur de chargement de l'examen.</h2>";
  });

  function similarity(a, b) {
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : (1 - distance / maxLen);
  }
  
  function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= a.length; j++) matrix[0][j] = j;
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, 
            matrix[i][j - 1] + 1,    
            matrix[i - 1][j] + 1     
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  }
  

async function submitGrade(examId, grade) {
  try {
    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ exam_id: examId, grade })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    console.log('✅ Grade saved successfully');
  } catch (error) {
    console.error('❌ Error saving grade:', error);
  }
}

function startExam(exam) {
    console.log("Loaded questions:", exam.questions);
  document.getElementById('exam-title').textContent = exam.title;
  document.getElementById('exam-description').textContent = exam.description;

  let current = 0;
  let correct = 0;
  const container = document.getElementById('question-container');
  const timerDiv = document.getElementById('timer');

  function showQuestion() {
    if (current >= exam.questions.length) {
        const total = exam.questions.length;
        const score = Math.round((correct / total) * 100);
      
        container.innerHTML = `
          <h2>Examen terminé ✅</h2>
          <p class="final-score" style="font-size: 1.5rem; font-weight: bold; color: green;">
            Votre score: ${score}% (${correct} / ${total} correct)
          </p>
        `;
      
        timerDiv.textContent = '';
      
        submitGrade(exam.id, score);
        return;
      }
      

    const q = exam.questions[current];
    container.innerHTML = `
      <h3>Question ${current + 1}</h3>
      <p>${q.questionText}</p>
      ${q.type === "qcm" ? q.options.map((opt, i) =>
        `<div><label><input name="answer" type="radio" value="${i}"/> ${opt}</label></div>`
      ).join("") : `<input type="text" id="answer" placeholder="Votre réponse ici..."/>`}
      <button id="next-btn">Suivant</button>
    `;

    let seconds = q.timer || 60;
    timerDiv.textContent = `⏳ Temps restant: ${seconds} secondes`;

    const interval = setInterval(() => {
      seconds--;
      timerDiv.textContent = `⏳ Temps restant: ${seconds} secondes`;
      if (seconds <= 0) {
        clearInterval(interval);
        document.getElementById('next-btn').click();
      }
    }, 1000);

    document.getElementById('next-btn').addEventListener('click', () => {
      clearInterval(interval);

      let userAnswer;
      if (q.type === 'qcm') {
        const selected = document.querySelector('input[name="answer"]:checked');
        userAnswer = selected ? parseInt(selected.value) : null;
        if (userAnswer === q.correctOption) correct++;
      } else {
        userAnswer = document.getElementById('answer').value.trim().toLowerCase();
        const similarityScore = similarity(userAnswer, q.correctAnswer?.toLowerCase());
if (similarityScore >= 0.8) correct++;

      }

      current++;
      showQuestion();
    });
  }

  showQuestion();
}