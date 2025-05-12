const form = document.getElementById("loginform");
const messagebox = document.getElementById("messagebox");

form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
        email: form.email.value.trim(),
        password: form.password.value.trim()
    }
    try {
        const res = await axios.post("/auth/login", data);
        if (res.status == 200 || res.status == 201) {
            if (res.data.role === "enseignant") {
                window.location.href = `/management/${res.data.firstname}-${res.data.lastname}`.toLowerCase();
            } else {
                window.location.href = '/';
            }
        } else {
            messagebox.innerText = res.data.message || "Login error, please try again!";
        }
    } catch(e) {
        messagebox.innerText = e.response.data.message || "We have some connection issues, please try again later!";
    }
})