console.log('Hello World!');

window.addEventListener('load', () => {
    document.querySelector('#newGame').addEventListener('click', validateForm);
});

function validateForm() {
    initGlobalObject();

    oGameData.nickNamePlayerOne = document.querySelector('#nick_1').value;
    oGameData.colorPlayerOne = document.querySelector('#color_1').value;
    oGameData.nickNamePlayerTwo = document.querySelector('#nick_2').value;
    oGameData.colorPlayerTwo = document.querySelector('#color_2').value;

    initGame();
}

function initGame() {
    document.querySelector('#form').classList.add('d-none');
    document.querySelector('#errorMsg').textContent = '';

    generateGameField();

}

function generateGameField() {
    const gameAreaRef = document.querySelector('#gameArea');
    gameAreaRef.innerHTML = '';
    gameAreaRef.classList.add('row', 'justify-content-center', 'mt-5');

    const tableRef = document.createElement('table');
    tableRef.id = 'gameTable';
    tableRef.classList.add('ml-0', 'mr-0');

    let deck = [];

    for(let i = 1; i < 9; i++) {
        for(let j = 0; j < 2; j++) {
            const card = {
                value : i,
                imageUrl : './images/' + i +'.jpg'
            }
            deck.push(card);
        }
    }

    deck = shuffleDeck(deck);
}

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