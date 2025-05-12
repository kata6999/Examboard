let cards = document.querySelectorAll('.card');
let dots = document.querySelectorAll('.dot');
let index = 1;

function showCard(i) {
  cards.forEach(card => card.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  cards[i].classList.add('active');
  dots[i].classList.add('active');
}

function nextCard() {
  index = (index + 1) % cards.length;
  showCard(index);
}

setInterval(nextCard, 3000); 
