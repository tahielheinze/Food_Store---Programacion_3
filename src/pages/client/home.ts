import { checkAuhtUser, logout } from "../../utils/auth";

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

const initPage = () => {
  console.log("Inicio de página - Vista Cliente");
  
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/auth/login/login.html",
    "client"
  );
};

initPage();
