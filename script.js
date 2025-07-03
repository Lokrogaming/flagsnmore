let score = 0;
let highscore = localStorage.getItem('flagQuizHighscore') || 0;
let language = 'de';
let mode = 'easy';
let blacklist = [
  "./russia.png",
  "./israel.png",
];

document.getElementById('highscore').textContent = highscore;
document.getElementById('languageSelect').addEventListener('change', (e) => {
  language = e.target.value;
  startQuiz();
});
document.getElementById('modeSelect').addEventListener('change', (e) => {
  mode = e.target.value;
  startQuiz();
});

async function loadFlags() {
  const res = await fetch('./flags.json');
  const data = await res.json();
  return Object.entries(data).filter(([path]) => !blacklist.includes(path));
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function getRandomItems(array, count, exclude = null) {
  const filtered = array.filter(item => item !== exclude);
  return shuffle(filtered).slice(0, count);
}

async function startQuiz() {
  const entries = await loadFlags();
  if (entries.length < 3) {
    document.getElementById('result').textContent = '⚠️ Zu wenige Flaggen!';
    return;
  }

  const [flagPath, names] = entries[Math.floor(Math.random() * entries.length)];
  const correctName = names[language];

  const optionsDiv = document.getElementById('options');
  const img = document.getElementById('flag-img');
  const input = document.getElementById('textInput');
  const submitBtn = document.getElementById('submitBtn');
  const result = document.getElementById('result');
  optionsDiv.innerHTML = '';
  input.style.display = 'none';
  submitBtn.style.display = 'none';
  img.style.display = 'none';
  result.textContent = '';

  if (mode === 'easy') {
    img.src = flagPath;
    img.style.display = 'block';
    const allNames = entries.map(e => e[1][language]);
    const wrong = getRandomItems(allNames, 2, correctName);
    const options = shuffle([correctName, ...wrong]);
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(opt, correctName);
      optionsDiv.appendChild(btn);
    });

  } else if (mode === 'medium') {
    img.src = flagPath;
    img.style.display = 'block';
    input.value = '';
    input.style.display = 'inline-block';
    submitBtn.style.display = 'inline-block';
    submitBtn.onclick = () => {
      const userGuess = input.value.trim();
      checkAnswer(userGuess, correctName);
    };

  } else if (mode === 'hard') {
    const allFlags = entries.map(([path, data]) => ({ path, name: data[language] }));
    const wrongFlags = getRandomItems(allFlags, 2, { path: flagPath });
    const flagOptions = shuffle([{ path: flagPath, correct: true }, ...wrongFlags.map(f => ({ ...f, correct: false }))]);

    const question = document.createElement('p');
    question.textContent = correctName;
    optionsDiv.appendChild(question);

    flagOptions.forEach((flag, idx) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'flagChoice';
      input.value = flag.path;
      label.appendChild(input);
      const img = document.createElement('img');
      img.src = flag.path;
      img.className = 'flag-option';
      label.appendChild(img);
      optionsDiv.appendChild(label);
    });

    const submit = document.createElement('button');
    submit.textContent = language === 'de' ? 'Antwort überprüfen' : 'Submit';
    submit.onclick = () => {
      const selected = document.querySelector('input[name="flagChoice"]:checked');
      if (!selected) return;
      const selectedFlag = selected.value;
      checkAnswer(selectedFlag, flagPath);
    };
    optionsDiv.appendChild(submit);
  }
}

function checkAnswer(given, correct) {
  const result = document.getElementById('result');
  if (given.toLowerCase() === correct.toLowerCase()) {
    score++;
    result.textContent = '✅ Richtig!';
  } else {
    result.textContent = `❌ Falsch! Richtige Antwort: ${correct}`;
    score = 0;
  }

  if (score > highscore) {
    highscore = score;
    localStorage.setItem('flagQuizHighscore', highscore);
  }

  document.getElementById('score').textContent = score;
  document.getElementById('highscore').textContent = highscore;

  setTimeout(startQuiz, 2500);
}

startQuiz();
