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
