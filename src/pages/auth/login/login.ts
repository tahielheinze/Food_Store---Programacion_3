import type { IUser } from "../../../types/IUser";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const ADMIN_DEFAULT: IUser = {
    email: "admin@foodstore.com",
    password: "admin1234",
    role: "admin",
    loggedIn: true,
};

const form = document.getElementById("form-login") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (email === ADMIN_DEFAULT.email && password === ADMIN_DEFAULT.password) {
        saveUser(ADMIN_DEFAULT);
        navigate("/src/pages/admin/home/home.html");
        return;
    }

    const usersGuardados = localStorage.getItem("users");
    const users: IUser[] = usersGuardados ? JSON.parse(usersGuardados) : [];

    const usuarioEncontrado = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!usuarioEncontrado) {
        alert("Email o contraseña incorrectos.");
        return;
    }

    const usuarioLogueado: IUser = {
        ...usuarioEncontrado,
        loggedIn: true,
    };
    saveUser(usuarioLogueado);
    navigate("/src/pages/store/home/home.html");
});