document.addEventListener('DOMContentLoaded', (event) => {

    let selectedCard = null;
    let correctOrder = [];

    const resetActivityButton = document.getElementById('resetActivity');
    const checkAnswerButton = document.getElementById('checkAnswer');
    const cardContainer = document.getElementById('cardContainer');
    const feedbackEl = document.getElementById('feedback');

    if (resetActivityButton) {
        resetActivityButton.addEventListener('click', function() {
            location.reload();
        });
    } else {
        console.error("resetActivity button not found in DOM");
    }

    if (checkAnswerButton) {
        checkAnswerButton.addEventListener('click', checkAnswer);
    } else {
        console.error("checkAnswer button not found in DOM");
    }

    // Function to swap two cards
    function swapCards(card1, card2) {
        let tempContent = card1.innerHTML;
        card1.innerHTML = card2.innerHTML;
        card2.innerHTML = tempContent;
    }

    function fetchCardData() {
        fetch('cards.json')
            .then(response => response.json())
            .then(data => {
                correctOrder = data.correctOrder.map(card => card.content);
                console.log("Fetched correct order:", correctOrder);
                populateCards(data.initialOrder);
            })
            .catch(error => {
                console.error("Error loading card data:", error);
            });
    }

    function populateCards(cardsData) {
        cardsData.forEach(card => {
            let div = document.createElement('div');
            div.className = 'card';
            div.dataset.id = card.id;
            div.innerHTML = card.content;
            div.setAttribute('tabindex', '0');
            addCardListeners(div);
            cardContainer.appendChild(div);
        });
    }

    function addCardListeners(div) {
        // Using touchend for mobile responsiveness
        div.addEventListener('touchend', cardInteractionHandler);
        
        // For non-touch devices
        div.addEventListener('click', cardInteractionHandler);
        
        // Keyboard controls
        div.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                cardInteractionHandler.call(div, e);
            }
        });
    }

    function cardInteractionHandler(e) {
        if (e.type === 'touchend') {
            e.preventDefault();
        }
        if (!selectedCard) {
            selectedCard = this;
            this.classList.add('selected');
            console.log("Card selected:", this.innerHTML.trim());
        } else {
            swapCards(selectedCard, this);
            selectedCard.classList.remove('selected');
            console.log("Cards swapped.");
            selectedCard = null;
        }
    }
   
 //remove italics tags
function stripHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}


function checkAnswer() {
    let cards = document.querySelectorAll('.card');
    let isCorrect = true;

    cards.forEach((card, index) => {
        card.classList.remove('green', 'red');  // Reset previous feedback

        // Remove existing icons (if any)
        let existingTickIcon = card.querySelector('.icon.tick');
        let existingCrossIcon = card.querySelector('.icon.cross');

        if (existingTickIcon) existingTickIcon.remove();
        if (existingCrossIcon) existingCrossIcon.remove();

        // Get the clean content of the card for comparison
        let cardContent = stripHtml(card.innerHTML).trim();

        // Add the tick and cross icons back
        let tickIcon = document.createElement('span');
        tickIcon.classList.add('icon', 'tick');
        tickIcon.innerHTML = '✓';
        card.appendChild(tickIcon);

        let crossIcon = document.createElement('span');
        crossIcon.classList.add('icon', 'cross');
        crossIcon.innerHTML = '✗';
        card.appendChild(crossIcon);

        if (cardContent !== correctOrder[index]) {
            card.classList.add('red');
            console.log(`Card at index ${index} is incorrect. Expected: ${correctOrder[index]}, Found: ${cardContent}`);
            isCorrect = false;
        } else {
            card.classList.add('green');
            console.log(`Card at index ${index} is correct.`);
        }
    });

    const feedbackEl = document.getElementById('feedback');
    if (isCorrect) {
        feedbackEl.textContent = "Correct! Well done.";
    } else {
        feedbackEl.textContent = "Incorrect. Please try again.";
    }
}


    fetchCardData();

});
