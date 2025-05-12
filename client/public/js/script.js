window.addEventListener("scroll", function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  if (window.scrollY > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("scrollTopBtn");
  if (btn) {
    btn.onclick = function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
})