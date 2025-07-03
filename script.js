let score = 0;
let highscore = localStorage.getItem('flagQuizHighscore') || 0;
document.getElementById('highscore').textContent = highscore;

let lang = 'de';
let flagsData = {};

const translations = {
  de: {
    correct: "✅ Richtig!",
    wrong: "❌ Falsch! Richtige Antwort: {answer}",
    scoreLabel: "Punkte",
    highscoreLabel: "Highscore"
  },
  en: {
    correct: "✅ Correct!",
    wrong: "❌ Wrong! Correct answer: {answer}",
    scoreLabel: "Score",
    highscoreLabel: "Highscore"
  }
};

document.getElementById('lang-select').addEventListener('change', (e) => {
  lang = e.target.value;
  updateLabels();
  startQuiz();
});

function updateLabels() {
  document.getElementById('score-label').textContent = translations[lang].scoreLabel;
  document.getElementById('highscore-label').textContent = translations[lang].highscoreLabel;
}

async function loadFlags() {
  const res = await fetch('./flags.json');
  const data = await res.json();
  return data;
}

function getRandomItems(array, count, exclude) {
  const filtered = array.filter(item => item !== exclude);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

async function startQuiz() {
  updateLabels();

  if (!Object.keys(flagsData).length) {
    flagsData = await loadFlags();
  }

  const entries = Object.entries(flagsData);
  const [flagPath, namesObj] = entries[Math.floor(Math.random() * entries.length)];
  const correctAnswer = namesObj[lang];

  const allNames = entries.map(e => e[1][lang]);
  const wrongAnswers = getRandomItems(allNames, 2, correctAnswer);
  const options = shuffle([correctAnswer, ...wrongAnswers]);

  document.getElementById('flag-img').src = flagPath;
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => {
      const resultText = document.getElementById('result');
      if (option === correctAnswer) {
        score++;
        resultText.textContent = translations[lang].correct;
      } else {
        score = 0;
        resultText.textContent = translations[lang].wrong.replace('{answer}', correctAnswer);
      }

      if (score > highscore) {
        highscore = score;
        localStorage.setItem('flagQuizHighscore', highscore);
      }

      document.getElementById('score').textContent = score;
      document.getElementById('highscore').textContent = highscore;

      setTimeout(startQuiz, 2000);
    };
    optionsDiv.appendChild(button);
  });

  document.getElementById('result').textContent = '';
}

startQuiz();
