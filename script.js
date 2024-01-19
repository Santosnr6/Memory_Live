console.log('Hello World!');

//Eventlyssnare som lyssnar efter att webbsidan laddats klart
window.addEventListener('load', () => {
    document.querySelector('#newGame').addEventListener('click', validateForm);
});

function validateForm() {
    //Initierar det globala objektet oGameData
    initGlobalObject();

    //Läser in data från formuläret och sparar i variabler
    oGameData.nickNamePlayerOne = document.querySelector('#nick_1').value;
    oGameData.colorPlayerOne = document.querySelector('#color_1').value;
    oGameData.nickNamePlayerTwo = document.querySelector('#nick_2').value;
    oGameData.colorPlayerTwo = document.querySelector('#color_2').value;

    initGame();
}

function initGame() {
    //Gömmer formuläret
    document.querySelector('#form').classList.add('d-none');
    document.querySelector('#errorMsg').textContent = '';

    generateGameField();

    //Sätter en lyssnare på tabellen
    const tableRef = document.querySelector('#gameTable');
    tableRef.addEventListener('click', executeMove);

    generateStartingPlayer();
}

function generateStartingPlayer() {
    let playerName = '';
    //Slumpar fram tal mellan 0 - 0.99
    const random = Math.random();

    //Kollar vilken spelare som får börja
    if(random < 0.5) {
        oGameData.currentPlayer = 1;
        playerName = oGameData.nickNamePlayerOne;
    } else {
        oGameData.currentPlayer = 2;
        playerName = oGameData.nickNamePlayerTwo;
    }
    //Skriver ut vems tur det är att spela
    document.querySelector('#msg').textContent = 'Aktuell spelare är ' + playerName;
}

function executeMove(event) {

    //Kontrollerar att vi träffat en tabellcell
    if(event.target.tagName === 'TD') {
        //Kontrollerar att kortet är i spel
        if(event.target.firstChild.getAttribute('data-card-inplay')) {
            //Tar bort d-noneklassen på klickat kort
            event.target.firstChild.classList.toggle('d-none');

            if(oGameData.currentMove === 1) {
                //Tilldelar flippedCard det klickade kortet för senare jämförelse
                oGameData.flippedCard = event.target.firstChild;
                oGameData.currentMove = 2;
            } else {
                //Kollar om data-attributet card-id är identiskt på det klickade kortet och det sprade kortet
                if(event.target.firstChild.getAttribute('data-card-id') === oGameData.flippedCard.getAttribute('data-card-id')) {
                    //Sätter båda korten till inaktiva
                    event.target.firstChild.setAttribute('data-card-inplay', false);
                    oGameData.flippedCard.setAttribute('data-card-inplay', false);

                    //Kollar vem som hittar par, uppdaterar poäng, samt sätter en border på båda korten med spelarens färg
                    if(oGameData.currentPlayer === 1) {
                        oGameData.scorePlayerOne++;
                        event.target.firstChild.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerOne + ';');
                        oGameData.flippedCard.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerOne + ';');
                    } else {
                        oGameData.scorePlayerTwo++;
                        event.target.firstChild.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerTwo + ';');
                        oGameData.flippedCard.setAttribute('style', 'border: 3px solid ' + oGameData.colorPlayerTwo + ';');
                    }

                    //Räknar ner remainingCards och ändrar currentMove till 1 igen
                    oGameData.remainingCards -= 2;
                    oGameData.currentMove = 1;
                } else {
                    //Sätter en fördröjning på 1.5s
                    setTimeout(() => {
                        //Gömmer korten igen
                        event.target.firstChild.classList.toggle('d-none');
                        oGameData.flippedCard.classList.toggle('d-none');
                        changePlayer();
                    }, 1500);
                }
                //Winner kommer tilldelas antingen 0, 1, 2 eller 3
                const winner = checkForWinner();

                //Om winner är 0 fortsätter spelet, annars är spelet slut
                if(winner !== 0) {
                    gameOver(winner);
                }
            }
        }
    }
}

function gameOver(winner) {
    //Visar formuläret igen
    document.querySelector('#form').classList.remove('d-none');
    //Tar bort lyssnaren från tabellen
    const tableRef = document.querySelector('#gameTable');
    tableRef.removeEventListener('click', executeMove);

    let winnerName = '';

    //Kollar vem som vunnit spelet
    if(winner === 1) {
        winnerName = oGameData.nickNamePlayerOne;
    } else if(winner === 2) {
        winnerName = oGameData.nickNamePlayerTwo;
    } else if(winner === 3) {
        winnerName = 'Ingen';
    }

    document.querySelector('#msg').textContent = winnerName + ' har vunnit!';
}

function checkForWinner() {
    //Om spelet inte är slut returneras 0, annars 1, 2 eller 3
    if(oGameData.remainingCards === 0) {
        if(oGameData.scorePlayerOne > oGameData.scorePlayerTwo) {
            return 1;
        } else if(oGameData.scorePlayerOne < oGameData.scorePlayerTwo) {
            return 2;
        } else {
            return 3;
        }
    } else {
        return 0;
    }
}

function changePlayer() {
    //Kollar vilken spelare som jorde senaste draget och byter till den andre
    if(oGameData.currentPlayer === 1) {
        oGameData.currentPlayer = 2;
        document.querySelector('#msg').textContent = 'Aktuell spelare är ' + oGameData.nickNamePlayerTwo;
    } else {
        oGameData.currentPlayer = 1;
        document.querySelector('#msg').textContent = 'Aktuell spelare är ' + oGameData.nickNamePlayerOne;
    }
    oGameData.currentMove = 1;
}

function generateGameField() {
    //Läser in gameArea, tar bort allt eventuellt innehåll och stylar med bootstrap
    const gameAreaRef = document.querySelector('#gameArea');
    gameAreaRef.innerHTML = '';
    gameAreaRef.classList.add('row', 'justify-content-center', 'mt-5');

    //Skapar en tabell och lägger till bootstrapklasser
    const tableRef = document.createElement('table');
    tableRef.id = 'gameTable';
    tableRef.classList.add('ml-0', 'mr-0');

    //Skapar en array som ska innehålla alla kort
    let deck = [];

    //Skapar 16 kort med värden 1 - 8 och lägger till dem i arrayen
    for(let i = 1; i < 9; i++) {
        for(let j = 0; j < 2; j++) {
            //Varje kort får ett värde och en bild
            const card = {
                value : i,
                imageUrl : './images/' + i +'.jpg'
            }
            deck.push(card);
        }
    }

    //Blandar kortleken
    deck = shuffleDeck(deck);
    
    //Skapar 4 rader med 4 kolumner och lägger till korten i tabellen
    for(let i = 0; i < 4; i++) {
        const rowRef = document.createElement('tr');

        for(let j = 0; j < 4; j++) {
            const cellRef = document.createElement('td');
            const imgRef = document.createElement('img');

            //Plockar ut ett kort från arrayen och lägger till det i cellen
            const card = deck.pop();
            cellRef.style = 'width: 100px; height: 160px; border: 1px solid darkgrey; font-size: 50px; text-align: center; background-color: #CCCCCC;';
            imgRef.src = card.imageUrl;
            imgRef.setAttribute('data-card-id', card.value);
            imgRef.setAttribute('data-card-inplay', true);
            imgRef.classList.add('w-100', 'd-none');

            cellRef.appendChild(imgRef);
            rowRef.appendChild(cellRef);
        }
        tableRef.appendChild(rowRef);
    }
    //Lägger till tabellen i gameArea
    gameAreaRef.appendChild(tableRef);
}

//Fisher-Yates shuffle algorithm (https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
function shuffleDeck(deck) {
    let i, j, temp;
    for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }

    return deck;
}