let score = 0;
let highscore = localStorage.getItem('flagQuizHighscore') || 0;

document.getElementById('highscore').textContent = highscore;

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
  const flags = await loadFlags();
  const entries = Object.entries(flags);

  const [flagPath, correctAnswer] = entries[Math.floor(Math.random() * entries.length)];
  const allCountries = entries.map(e => e[1]);
  const wrongAnswers = getRandomItems(allCountries, 2, correctAnswer);
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
        resultText.textContent = '✅ Richtig!';
      } else {
        score = 0;
        resultText.textContent = `❌ Falsch! Richtige Antwort: ${correctAnswer}`;
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
