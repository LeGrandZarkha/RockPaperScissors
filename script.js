const mapChoix = {
  "pierre": "pierre",
  "feuille": "feuille",
  "ciseaux": "ciseaux"
};

const emojiChoix = {
  "pierre": "✊",
  "feuille": "✋",
  "ciseaux": "✌️"
};

let resultat = '';

let playerWin = 0;
let computerWin = 0;
let drawWin = 0;
let totalGames = playerWin + computerWin + drawWin;

function updateStats(playerWin, computerWin, drawWin, totalGames){
  const playerStatsSpan = document.querySelector('#playerStats');
  const computerStatsSpan = document.querySelector('#computerStats');
  const drawStatsSpan = document.querySelector('#drawStats');

  let calculStats = adjustPercentage(playerWin, computerWin, drawWin);

  playerStatsSpan.innerHTML = `Player : ${calculStats.player.toFixed(0)}%`+ '  |  ';
  drawStatsSpan.innerHTML = `Draw : ${calculStats.draw.toFixed(0)}%` + '  |  ';
  computerStatsSpan.innerHTML = `Computer : ${calculStats.computer.toFixed(0)}%`;
}

function adjustPercentage(playerWin,computerWin,drawWin){

  let totalGames = playerWin + computerWin + drawWin;

  let playerStats = (playerWin / totalGames) * 100;
  let computerStats= (computerWin / totalGames) * 100;
  let drawStats = (drawWin / totalGames) * 100;

  let playerStatsRounded = Math.round((playerWin / totalGames) * 100);
  let computerStatsRounded = Math.round((computerWin / totalGames) * 100);
  let drawStatsRounded = Math.round((drawWin / totalGames) * 100);

  let totalRounded = playerStatsRounded + computerStatsRounded + drawStatsRounded;

  if (totalRounded === 100) {
    return {
        player: playerStats,
        computer: computerStats,
        draw: drawStats
    };
  }

    let difference = 100 - totalRounded;

    let percentage = [
      {name:'player', value: playerStats, rounding: playerStatsRounded},
      {name:'computer', value: computerStats, rounding: computerStatsRounded},
      {name:'draw', value: drawStats, rounding: drawStatsRounded}
    ]

    percentage.sort((a, b) => (b.value - b.rounding) - (a.value - a.rounding));

    for (let i = 0; i < Math.abs(difference); i++){
      percentage[i].rounding += Math.sign(difference);
    }

    return {
      player: percentage.find(p => p.name === 'player').rounding,
      computer: percentage.find(p => p.name === 'computer').rounding,
      draw: percentage.find(p => p.name === 'draw').rounding,
    };
}

function updateHistory(choixJoueur, choixAdversaire, resultat){

  const playerHistory = document.querySelector('.results-left');
  const computerHistory = document.querySelector('.results-right');
  const playerSpan = document.createElement('span');
  const computerSpan = document.createElement('span');

  if (resultat === 'draw'){
    playerSpan.style.opacity = '1';
    playerSpan.style.fontSize = '3rem';
    computerSpan.style.opacity = '1';
    computerSpan.style.fontSize = '3rem';
  } else {
    if(resultat === 'win'){
      playerSpan.style.opacity = '1';
      playerSpan.style.fontSize = '3rem';

      computerSpan.style.opacity = '0.3';
      computerSpan.style.fontSize = '2rem';
    } else {
      playerSpan.style.opacity = '0.3';
      playerSpan.style.fontSize = '2rem';

      computerSpan.style.opacity = '1';
      computerSpan.style.fontSize = '3rem';
    }
  }

  playerSpan.innerText = emojiChoix[choixJoueur];
  computerSpan.innerText = emojiChoix[choixAdversaire];

  playerHistory.appendChild(playerSpan);
  computerHistory.appendChild(computerSpan);

  const playerHistoryItems = playerHistory.querySelectorAll('span');
  const computerHistoryItems = computerHistory.querySelectorAll('span');
  if (playerHistoryItems.length > 10) {
    playerHistory.removeChild(playerHistory.firstChild);
  }
  if (computerHistoryItems.length > 10) {
    computerHistory.removeChild(computerHistory.firstChild);
  }
}

let playerScore = 0;
let computerScore = 0;

const matchResult = document.querySelector('.match-result');
const matchVS = document.querySelector('.match-vs');

// Sélectionner tous les boutons une seule fois
const boutons = document.querySelectorAll('.selection');

// Cette boucle ajoute les écouteurs d'événements une seule fois, lorsque le jeu se charge
boutons.forEach((bouton) => {
  bouton.addEventListener('click', () => {
      const choixJoueur = mapChoix[bouton.id];  // Récupère la valeur associée à l'ID du bouton cliqué

      // Générer le choix de l'adversaire
      const choixAdversaire = getAdversaryChoice();

      // Vérifier qui a gagné
      const resultat = checkDuel(choixJoueur, choixAdversaire);   


      matchResult.innerHTML = "<P>" + resultat  + "</p>";
      matchVS.innerHTML = "<P>" + emojiChoix[choixJoueur] + '<span> VS </span>' + emojiChoix[choixAdversaire] + "</p>";
  });
});

function getAdversaryChoice(){
  const adversaryChoice = ['pierre','feuille','ciseaux'];
  const randomIndex = Math.floor(Math.random() * adversaryChoice.length);
  return adversaryChoice[randomIndex];
}


function checkDuel(choixJoueur, choixAdversaire) {
  const regles = {
      "pierre": "ciseaux",  // Pierre bat ciseaux
      "ciseaux": "feuille", // Ciseaux bat feuille
      "feuille": "pierre"   // Feuille bat pierre
  };


  if (choixJoueur === choixAdversaire) {
    resultat = 'draw';
      updateHistory(choixJoueur,choixAdversaire,resultat);
      drawWin += 1;
      updateStats(playerWin, computerWin, drawWin, totalGames);
      return "Draw";
  } else if (regles[choixJoueur] === choixAdversaire) {
    resultat = 'win';
    playerScore += 1;
    playerWin += 1;
    updateHistory(choixJoueur,choixAdversaire,resultat);
    document.querySelector('.computer-score').innerHTML = computerScore;
    document.querySelector('.player-score').innerHTML = playerScore;
    updateStats(playerWin, computerWin, drawWin, totalGames);
      return "Player wins";
  } else {
    resultat = 'lose';
    updateHistory(choixJoueur,choixAdversaire,resultat);
    computerScore += 1;
    computerWin += 1;
    document.querySelector('.computer-score').innerHTML = computerScore;
    document.querySelector('.player-score').innerHTML = playerScore;
    updateStats(playerWin, computerWin, drawWin, totalGames);
      return "Computer wins";
  }
}