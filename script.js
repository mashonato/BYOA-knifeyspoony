let gameState = {
    playerGold: 0,
    middleGold: 3,
    enemyGold: 0,
    goldPieces: []
};

function createGoldPiece(id, container, position) {
    const gold = document.createElement('div');
    gold.id = `gold-${id}`;
    gold.className = 'gold-piece';
    gold.innerHTML = '💰';
    gold.style.left = `${position}%`;
    container.appendChild(gold);
    return gold;
}

function updateDisplay() {
    const playerContainer = document.getElementById('player-gold');
    const middleContainer = document.getElementById('middle-gold');
    const enemyContainer = document.getElementById('enemy-gold');
    
    // Initialize gold pieces if not already done
    if (gameState.goldPieces.length === 0) {
        for (let i = 0; i < 3; i++) {
            const position = 35 + (i * 15); // Use percentages for spacing (35%, 50%, 65%)
            const gold = createGoldPiece(i, middleContainer, position);
            gameState.goldPieces.push({
                element: gold,
                location: 'middle',
                position: position
            });
        }
    }
    
    // Update positions of existing gold pieces
    gameState.goldPieces.forEach((piece, index) => {
        let container;
        
        if (index < gameState.playerGold) {
            container = playerContainer;
            piece.location = 'player';
        } else if (index < gameState.playerGold + gameState.middleGold) {
            container = middleContainer;
            piece.location = 'middle';
        } else {
            container = enemyContainer;
            piece.location = 'enemy';
        }
        
        if (piece.element.parentElement !== container) {
            container.appendChild(piece.element);
        }
    });
}

function checkWinCondition() {
    if (gameState.playerGold === 3) {
        showEndScreen("Congratulations, you win! I see you've played knifey spooney before! 🏆");
        return true;
    }
    if (gameState.enemyGold === 3) {
        showEndScreen("What kind of person can't tell a knife from a spoon? You lose! 😢");
        return true;
    }
    return false;
}

function showEndScreen(message) {
    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('end-message').textContent = message;
}

function resetGame() {
    // Clear existing gold pieces
    gameState.goldPieces.forEach(piece => {
        if (piece.element && piece.element.parentElement) {
            piece.element.parentElement.removeChild(piece.element);
        }
    });
    
    // Reset game state
    gameState = {
        playerGold: 0,
        middleGold: 3,
        enemyGold: 0,
        goldPieces: []
    };
    
    // Reset UI
    document.getElementById('game-ui').style.display = 'flex';
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('message').textContent = '';
    
    // Reinitialize display
    updateDisplay();
}

function moveGold(playerWon) {
    if (gameState.middleGold > 0) {
        gameState.middleGold--;
        if (playerWon) {
            gameState.playerGold++;
        } else {
            gameState.enemyGold++;
        }
    } else {
        if (playerWon) {
            if (gameState.enemyGold > 0) {
                gameState.enemyGold--;
                gameState.playerGold++;
            }
        } else {
            if (gameState.playerGold > 0) {
                gameState.playerGold--;
                gameState.enemyGold++;
            }
        }
    }
    updateDisplay();
}

function flipCoin() {
    return Math.random() < 0.5 ? 'heads' : 'tails';
}

function playTurn(playerChoice) {
    const utensilsContainer = document.querySelector('.utensils-container');
    const message = document.getElementById('message');
    
    if (checkWinCondition()) return;

    utensilsContainer.style.opacity = '0';
    
    setTimeout(() => {
        const result = flipCoin();
        const playerWon = playerChoice === result;
        
        utensilsContainer.innerHTML = `<div class="utensil">${result === 'heads' ? '🔪' : '🥄'}</div>`;
        utensilsContainer.style.opacity = '1';
        
        // Update message text based on guess and result
        if (playerChoice === 'heads') {
            // Player guessed knife
            if (result === 'heads') {
                message.textContent = "Correct, that's a knife";
            } else {
                message.textContent = "Sorry, that's not a knife, it's a spoon";
            }
        } else {
            // Player guessed spoon
            if (result === 'heads') {
                message.textContent = "Sorry, that's a knife";
            } else {
                message.textContent = "Correct, that's not a knife, it's a spoon";
            }
        }
        
        moveGold(playerWon);
        checkWinCondition();
    }, 500);
}

// Initialize the game
updateDisplay();

// Initialize with knife showing
document.addEventListener('DOMContentLoaded', () => {
    const utensilsContainer = document.querySelector('.utensils-container');
    utensilsContainer.innerHTML = '<div class="utensil">🔪</div>';
});

// Update button text
document.querySelector('.primary-button.heads').textContent = 'Knife';
document.querySelector('.primary-button.tails').textContent = 'Spoon'; 