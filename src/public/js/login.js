const username = document.getElementById("username");
const password = document.getElementById("password");

async function Login() {
    username.value=username.value.trim();
    password.value=password.value.trim();

    const usuarios = [
        { id: 1, username: "admin", password: "admin" },
        { id: 2, username: "andrestch", password: "123" },
        { id: 3, username: "oso", password: "123" }
    ];

    const usuario = usuarios.find(x => x.username.toLowerCase() === username.value.toLowerCase()) || null;

    if (usuario) {
        if (password.value === usuario.password) {
            window.location.href = 'resumen';
        } else {
            password.style.backgroundColor = "#ffb7b7";
            password.select();
        }
    } else {
        username.style.backgroundColor = "#ffb7b7";
        username.select();
    }
}

username.addEventListener("keyup", () => {
    username.style.backgroundColor = "white";
});
password.addEventListener("keyup", () => {
    password.style.backgroundColor = "white";
});
