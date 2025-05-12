window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 0) {
    navbar.classList.add('navsha');
  } else {
    navbar.classList.remove('navsha');
  }
});

window.addEventListener("DOMContentLoaded", () => {
  fetch('/client/parts/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("afterbegin", data);
    });
});