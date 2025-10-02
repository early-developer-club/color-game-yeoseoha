document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const stageDisplay = document.getElementById('stage');
    const timerDisplay = document.getElementById('timer');
    const modal = document.getElementById('modal');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const resultContainer = document.getElementById('result-container');
    const finalStageDisplay = document.getElementById('final-stage');
    const finalCorrectDisplay = document.getElementById('final-correct');
    const finalIncorrectDisplay = document.getElementById('final-incorrect');

    let currentStage = 1;
    let timeLeft = 60;
    let incorrectCount = 0;
    let timerInterval = null;
    let isGameActive = false;
    let lastHue = null; // Store hue for smooth color transition

    function startGame() {
        isGameActive = true;
        currentStage = 1;
        timeLeft = 60;
        incorrectCount = 0;
        lastHue = null; // Reset hue at the start of a new game
        
        stageDisplay.textContent = currentStage;
        timerDisplay.textContent = timeLeft;
        
        resultContainer.style.display = 'none';
        startButton.style.display = 'none';
        modal.classList.remove('active');

        generateStage();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }

    function endGame() {
        isGameActive = false;
        clearInterval(timerInterval);
        
        const totalStagesPlayed = currentStage - 1;
        const correctCount = totalStagesPlayed - incorrectCount;

        finalStageDisplay.textContent = totalStagesPlayed;
        finalCorrectDisplay.textContent = correctCount;
        finalIncorrectDisplay.textContent = incorrectCount;
        
        resultContainer.style.display = 'block';
        restartButton.style.display = 'block';
        modal.classList.add('active');
        gameBoard.innerHTML = '';
    }

    function generateStage() {
        gameBoard.innerHTML = '';
        stageDisplay.textContent = currentStage;

        const gridSize = Math.min(10, Math.floor(currentStage / 4) + 2);
        const totalBlocks = gridSize * gridSize;
        
        const [baseColor, diffColor] = generateColorsHSL();
        const correctIndex = Math.floor(Math.random() * totalBlocks);

        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        for (let i = 0; i < totalBlocks; i++) {
            const block = document.createElement('div');
            block.classList.add('color-block');
            if (i === correctIndex) {
                block.style.backgroundColor = diffColor;
                block.dataset.correct = 'true';
            } else {
                block.style.backgroundColor = baseColor;
            }
            block.addEventListener('click', handleBlockClick);
            gameBoard.appendChild(block);
        }
    }

    function generateColorsHSL() {
        if (lastHue === null) {
            lastHue = Math.random() * 360;
        } else {
            lastHue = (lastHue + 15 + Math.random() * 20) % 360;
        }
        
        const saturation = 70 + Math.random() * 20; // 70-90%
        const lightness = 50 + Math.random() * 10;  // 50-60%

        // Difficulty scaling for lightness difference
        const lightnessDiff = Math.max(2, 15 - Math.floor(currentStage / 2));

        const diffLightness = lightness + (Math.random() < 0.5 ? -lightnessDiff : lightnessDiff);

        const baseColor = `hsl(${lastHue}, ${saturation}%, ${lightness}%)`;
        const diffColor = `hsl(${lastHue}, ${saturation}%, ${diffLightness}%)`;

        return [baseColor, diffColor];
    }

    function handleBlockClick(e) {
        if (!isGameActive) return;

        if (!e.target.dataset.correct) {
            incorrectCount++;
        }
        
        currentStage++;
        generateStage();
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', () => {
        modal.classList.remove('active');
        // A brief delay to let the modal fade out before starting
        setTimeout(startGame, 300);
    });
});