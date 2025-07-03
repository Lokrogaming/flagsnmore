let score = 0;

async function loadFlags() {
  const res = await fetch('./flags.json');
  return await res.json();
}

function getRandomItems(array, count, exclude) {
  const filtered = array.filter(item => item !== exclude);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function updateScore() {
  document.getElementById('score').textContent = `Punkte: ${score}`;
}

async function startQuiz() {
  const flags = await loadFlags();
  const entries = Object.entries(flags);
  const [flagPath, correctAnswer] = entries[Math.floor(Math.random() * entries.length)];
  const allCountries = entries.map(e => e[1]);

  const isHard = Math.random() < 0.3; // 30% schwerer Modus

  document.getElementById('flag-img').src = flagPath.startsWith('./') ? flagPath : `.${flagPath}`;
  document.getElementById('result').textContent = '';
  updateScore();

  const optionsDiv = document.getElementById('options');
  const inputContainer = document.getElementById('input-container');
  const textInput = document.getElementById('text-answer');

  optionsDiv.innerHTML = '';
  textInput.value = '';
  inputContainer.classList.add('hidden');

  if (isHard) {
    inputContainer.classList.remove('hidden');
    document.getElementById('submit-answer').onclick = () => {
      const userAnswer = textInput.value.trim().toLowerCase();
      if (userAnswer === correctAnswer.toLowerCase()) {
        document.getElementById('result').textContent = '✅ Richtig!';
        score++;
      } else {
        document.getElementById('result').textContent = `❌ Falsch! Richtige Antwort: ${correctAnswer}`;
      }
      updateScore();
      setTimeout(startQuiz, 2000);
    };
  } else {
    const wrongAnswers = getRandomItems(allCountries, 2, correctAnswer);
    const options = shuffle([correctAnswer, ...wrongAnswers]);

    options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.onclick = () => {
        if (option === correctAnswer) {
          document.getElementById('result').textContent = '✅ Richtig!';
          score++;
        } else {
          document.getElementById('result').textContent = `❌ Falsch! Richtige Antwort: ${correctAnswer}`;
        }
        updateScore();
        setTimeout(startQuiz, 2000);
      };
      optionsDiv.appendChild(button);
    });
  }
}

startQuiz();
