window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
      navbar.classList.add('navsha');
    } else {
      navbar.classList.remove('navsha');
    }
});
  
fetch('/parts/navbar.html')
  .then(response => response.text())
  .then(async data => {
    document.body.insertAdjacentHTML("afterbegin", data);
    try {
      const info = await axios.get('/api/userinfo');
      const data = info.data;
      if (data.loggedIn) {
        const username = document.createElement("p");
        username.innerText = data.user.firstname;
        username.id = "username";
        document.getElementById("changeable").appendChild(username);
        document.getElementById("loginbtn").remove();
        document.getElementById("signupbtn").innerText = "Se déconnecter";
        document.getElementById("signupbtn").removeAttribute('href');
        if (data.user.role === "enseignant") {
          document.getElementById("aprop").remove();
          document.getElementById("aides").innerText = "Tableau de bord";
          document.getElementById("aides").setAttribute('href', `/management/${data.user.firstname}-${data.user.lastname}`)
        }
      }
    } catch (e) {
      console.error("Error while trying to fetch user info!");
      console.log(e);
    }

    const btn = document.getElementById("signupbtn");

    btn.addEventListener('click', async e => {
      if (btn.innerText === "Se déconnecter") {
        try {
          e.preventDefault();
          await axios.post('/auth/logout');
          console.log("logged oit")
          window.location.href = '/';
        } catch (e) {
          console.log(e.response)
        }
      }
    })
});