import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form-registro") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    const usersGuardados = localStorage.getItem("users");
    const users: IUser[] = usersGuardados ? JSON.parse(usersGuardados) : [];

    const yaExiste = users.find((u) => u.email === email);
    if (yaExiste) {
        alert("Ya existe una cuenta con ese email.");
        return;
    }

    const nuevoUsuario: IUser = {
        email: email,
        password: password,
        role: "client",
        loggedIn: false,
    };

    users.push(nuevoUsuario);
    localStorage.setItem("users", JSON.stringify(users));

    alert("¡Cuenta creada correctamente! Ahora podés iniciar sesión.");
    navigate("../login/login.html");
});