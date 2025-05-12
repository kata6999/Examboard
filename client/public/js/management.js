const tabs = document.querySelectorAll('.tab-button');
const panes = document.querySelectorAll('.tab-pane');

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const questionTypeSelect = document.getElementById('question-type');
  const qcmFields = document.getElementById('qcm-fields');
  const directFields = document.getElementById('direct-fields');
  const addQuestionBtn = document.getElementById('add-question');
  const questionList = document.getElementById('question-list');
  const saveExamBtn = document.getElementById('save-exam-btn');

  let questions = [];
  let editingExamId = null;

  function updateFormDisplay() {
    const type = questionTypeSelect.value;
    qcmFields.classList.toggle('d-none', type !== 'qcm');
    directFields.classList.toggle('d-none', type !== 'directe');
  }

  questionTypeSelect.addEventListener('change', updateFormDisplay);
  updateFormDisplay();

  addQuestionBtn.addEventListener('click', () => {
    const type = questionTypeSelect.value;
    const questionText = document.getElementById('question-text').value.trim();
    const correctAnswer = document.getElementById('correct-answer')?.value.trim();
    const options = [];

    if (!questionText) return alert('Enter a question.');

    if (type === 'qcm') {
      document.querySelectorAll('.qcm-option').forEach(input => {
        const val = input.value.trim();
        if (val) options.push(val);
      });

      if (options.length < 2) {
        return alert('Enter at least two non-empty options.');
      }

      if (!correctAnswer) {
        return alert('Enter the correct answer.');
      }
    }

    questions.push({ type, questionText, options, correctAnswer });

    const col = document.createElement('div');
    col.className = 'col-md-6 mb-3';
    col.innerHTML = `
      <div class="card p-3">
        <h6>${type.toUpperCase()}</h6>
        <p>${questionText}</p>
      </div>
    `;
    document.getElementById('questions').appendChild(col);
  });

  saveExamBtn.addEventListener('click', async () => {
    let userId;
    try {
      const info = await axios.get('/api/userinfo');
      const data = info.data;
      if (data.loggedIn) {
        userId = data.user.id;
      }
      console.log(userId)
    } catch (e) {
      console.error("Error while trying to fetch user info!");
      console.log(e);
    }
    const title = document.getElementById('exam-title').value.trim();
    const description = document.getElementById('exam-description').value.trim();
    const sem = document.getElementById('sem').value.trim();

    if (!title || !description || questions.length === 0) {
      return alert('Fill all exam info and add at least one question.');
    }

    const payload = {
      title,
      description,
      user_id: userId,
      questions: questions,
      sem
    };
    console.log({
      userId, title, description, questions, sem
    });

    try {
    const res = await axios.post('/api/exams', payload);
    alert('Exam saved successfully!');
    loadExams();
    questions = [];
    questionList.innerHTML = '';
    editingExamId = null;
  } catch (err) {
    alert('Failed to save exam.');
    console.error('Create Exam Error:', err);
    res.status(500).json({ error: err.message });
  }
  });

  async function loadExams() {
    const res = await fetch('/api/exams');
    const exams = await res.json();
    const examContainer = document.getElementById('exam-list');
    examContainer.innerHTML = '';

    if (exams.length === 0) {
      document.getElementById('no-exams-msg').classList.remove('d-none');
      return;
    }

    document.getElementById('no-exams-msg').classList.add('d-none');

    exams.forEach(exam => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-3';
      card.innerHTML = `
        <div class="card p-3">
          <h5 class="card-title">${exam.title}</h5>
          <p class="card-text">${exam.description}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm generate-link-btn" data-id="${exam.id}">Obtenir le lien</button>
          </div>
          <input type="text" readonly class="form-control mt-2 d-none exam-link" value="${exam.link}" id="link-${exam.id}">
        </div>
      `;
      examContainer.appendChild(card);
    });

    document.querySelectorAll('.generate-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const linkInput = document.getElementById(`link-${id}`);
        linkInput.classList.toggle('d-none');
      });
    });
  }

  loadExams();
});
