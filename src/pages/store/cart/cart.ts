import { checkAuhtUser, logout } from "../../../utils/auth";
import type { CartItem } from "../../../types/Product";

// --- PROTECCIÓN DE RUTA ---
checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/home/home.html",
    "client"
);

// --- LOGOUT ---
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
    logout();
});

// --- OBTENER CARRITO ---
const obtenerCarrito = (): CartItem[] => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
};

// --- GUARDAR CARRITO ---
const guardarCarrito = (carrito: CartItem[]) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

// --- CALCULAR TOTAL ---
const calcularTotal = (carrito: CartItem[]): number => {
    return carrito.reduce((acc, item) => acc + item.product.precio * item.cantidad, 0);
};

// --- RENDERIZAR CARRITO ---
const renderCarrito = () => {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById("contenedor-carrito") as HTMLElement;
    const mensajeVacio = document.getElementById("mensaje-vacio") as HTMLElement;
    const totalContainer = document.getElementById("total-container") as HTMLElement;
    const totalPrecio = document.getElementById("total-precio") as HTMLElement;

    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        mensajeVacio.style.display = "block";
        totalContainer.style.display = "none";
        return;
    }

    mensajeVacio.style.display = "none";
    totalContainer.style.display = "block";

    carrito.forEach((item) => {
        const fila = document.createElement("div");
        fila.classList.add("cart-item"); 
        
        fila.innerHTML = `
            <div>
                <h3>${item.product.nombre}</h3>
                <p>Precio unitario: $${item.product.precio.toLocaleString()}</p>
            </div>
            <div class="cart-item__actions">
                <button class="btn-restar btn-qty" data-id="${item.product.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-sumar btn-qty" data-id="${item.product.id}">+</button>
                <strong>$${(item.product.precio * item.cantidad).toLocaleString()}</strong>
                <button class="btn-eliminar btn-delete" data-id="${item.product.id}">✕</button>
            </div>
        `;
        contenedor.appendChild(fila);
    });

    totalPrecio.textContent = `$${calcularTotal(carrito).toLocaleString()}`;

    // --- EVENTOS BOTONES ---
    document.querySelectorAll(".btn-sumar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLButtonElement).dataset.id);
            const carrito = obtenerCarrito();
            const item = carrito.find((i) => i.product.id === id);
            if (item) item.cantidad += 1;
            guardarCarrito(carrito);
            renderCarrito();
        });
    });

    document.querySelectorAll(".btn-restar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLButtonElement).dataset.id);
            const carrito = obtenerCarrito();
            const item = carrito.find((i) => i.product.id === id);
            if (item) {
                item.cantidad -= 1;
                if (item.cantidad === 0) {
                    const index = carrito.indexOf(item);
                    carrito.splice(index, 1);
                }
            }
            guardarCarrito(carrito);
            renderCarrito();
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLButtonElement).dataset.id);
            const carrito = obtenerCarrito().filter((i) => i.product.id !== id);
            guardarCarrito(carrito);
            renderCarrito();
        });
    });
};

// --- VACIAR CARRITO ---
const btnVaciar = document.getElementById("btn-vaciar") as HTMLButtonElement;
btnVaciar?.addEventListener("click", () => {
    const confirmar = confirm("¿Querés vaciar el carrito?");
    if (confirmar) {
        guardarCarrito([]);
        renderCarrito();
    }
});

// --- INICIO ---
renderCarrito();