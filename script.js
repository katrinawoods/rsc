document.addEventListener('DOMContentLoaded', (event) => {

    let selectedCard = null;
    let correctOrder = [];

    document.getElementById('resetActivity').addEventListener('click', function() {
        location.reload();
    });

    document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

    // Function to swap two cards
    function swapCards(card1, card2) {
        let tempContent = card1.innerHTML;
        card1.innerHTML = card2.innerHTML;
        card2.innerHTML = tempContent;
    }

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

    function populateCards(cardsData) {
        let cardContainer = document.getElementById('cardContainer');

        cardsData.forEach(card => {
            let div = document.createElement('div');
            div.className = 'card';
            div.dataset.id = card.id;
            div.innerHTML = card.content;

            // Make each card tabbable
            div.setAttribute('tabindex', '0');

            // Using touchend for mobile responsiveness
            div.addEventListener('touchend', function(e) {
                e.preventDefault();

                if (!selectedCard) {
                    selectedCard = this;
                    this.classList.add('selected');
                    console.log("Card selected (touchend):", this.innerHTML.trim());
                } else {
                    swapCards(selectedCard, this);
                    selectedCard.classList.remove('selected');
                    console.log("Cards swapped (touchend).");
                    selectedCard = null;
                }
            });

            // For non-touch devices
            div.addEventListener('click', function() {
                if (!selectedCard) {
                    selectedCard = this;
                    this.classList.add('selected');
                    console.log("Card selected (click):", this.innerHTML.trim());
                } else {
                    swapCards(selectedCard, this);
                    selectedCard.classList.remove('selected');
                    console.log("Cards swapped (click).");
                    selectedCard = null;
                }
            });

            // Keyboard controls
            div.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    if (!selectedCard) {
                        selectedCard = div;
                        div.classList.add('selected');
                    } else {
                        swapCards(selectedCard, div);
                        selectedCard.classList.remove('selected');
                        selectedCard = null;
                    }
                }
            });

            cardContainer.appendChild(div);
        });
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

        // Add the tick and cross icons
        let tickIcon = document.createElement('span');
        tickIcon.classList.add('icon', 'tick');
        tickIcon.innerHTML = '✓';
        card.appendChild(tickIcon);

        let crossIcon = document.createElement('span');
        crossIcon.classList.add('icon', 'cross');
        crossIcon.innerHTML = '✗';
        card.appendChild(crossIcon);

        if (card.innerHTML.trim() !== correctOrder[index]) {
            card.classList.add('red');
            console.log(`Card at index ${index} is incorrect. Expected: ${correctOrder[index]}, Found: ${card.innerHTML.trim()}`);
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

