const messagebox = document.getElementById("messagebox");
const type = document.getElementById("role");
const num = document.getElementById("num");

document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.password.value.trim() !== form.passwordrepeat.value.trim()) {
        messagebox.innerText = "Passwords don't match!";
        return;
    }
    const data = {
        firstname: form.firstname.value.trim(),
        lastname: form.lastname.value.trim(),
        birth: form.birth.value.trim(),
        role: form.role.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value.trim(),
        sem: form.sem.value.trim()
    }
    try {
        const res = await axios.post("/auth/register", data);
        if (res.status == 200 || res.status == 201) {
            if (res.role === "enseignant") {
                window.location.href = `/management/${data.firstname}-${data.lastname}`.toLowerCase();
            } else {
                window.location.href = '/';
            }
            
        } else {
            messagebox.innerText = res.data.message || "Registration error, please try again!";
        }
    } catch(e) {
        messagebox.innerText = e.response.data.message || "We have some connection issues, please try again later!";
    }
})

type.addEventListener('change', e => {
    if (type.value === "enseignant") {
        num.value = 0;
        num.setAttribute('disabled', "true");
    } else {
        num.removeAttribute('disabled');
    }
})