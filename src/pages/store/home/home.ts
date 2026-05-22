import { logout } from "../../../utils/auth";
import { getUSer } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product } from "../../../types/Product";
import type { CartItem } from "../../../types/Product";
import type { IUser } from "../../../types/IUser";

// --- RENDERIZADO DE CATEGORÍAS ---
const cargarCategorias = () => {
    const lista = document.getElementById("lista-categorias") as HTMLUListElement;
    const categories = getCategories();

    lista.innerHTML = ""; // Limpieza por seguridad

    // Opción "Todas"
    const liTodas = document.createElement("li");
    liTodas.innerHTML = `<a href="#" data-categoria="todas">Todas</a>`;
    lista.appendChild(liTodas);

    categories.forEach((cat) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" data-categoria="${cat.nombre}">${cat.nombre}</a>`;
        lista.appendChild(li);
    });

    // Evento click en categorías
    lista.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const categoria = target.dataset.categoria;
        if (!categoria) return;

        if (categoria === "todas") {
            cargarProductos(PRODUCTS);
        } else {
            const filtrados = PRODUCTS.filter((p) =>
                p.categorias.some((c) => c.nombre === categoria)
            );
            cargarProductos(filtrados);
        }
    });
};

// --- BÚSQUEDA EN TIEMPO REAL ---
const inicializarBuscador = () => {
    const inputBuscar = document.getElementById("input-busqueda") as HTMLInputElement;
    const formBusqueda = document.getElementById("form-busqueda") as HTMLFormElement;

    // Evitar que el formulario recargue la pagina al darle al Enter.
    formBusqueda?.addEventListener("submit", (e: Event) => {
        e.preventDefault();
    });

    // Escuchar el teclado en tiempo real.
    inputBuscar?.addEventListener("input", () => {
        const texto = inputBuscar.value.trim().toLowerCase();

        // Si el usuario borra lo que escribio, se vuelve a mostrar todo.
        if (texto === "") {
            cargarProductos(PRODUCTS);
            return;
        }

        // Filtrar el array global comparando los nombres
        const filtrados = PRODUCTS.filter((producto) =>
            producto.nombre.toLowerCase().includes(texto)
        );

        // Redibujar las tarjetas con el producto filtrado.
        cargarProductos(filtrados);
    });
};

// --- RENDERIZADO DE LOS PRODUCTOS ---
const cargarProductos = (lista: Product[]) => {
    const contenedor = document.getElementById("contenedor-productos") as HTMLElement;
    const mensajeVacio = document.getElementById("mensaje-vacio") as HTMLElement;

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    mensajeVacio.style.display = "none";

    lista.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("card-producto");
        card.innerHTML = `
            <img src="../../../../assets/img/${producto.imagen}" alt="${producto.nombre}" onerror="this.classList.add('img-hidden')">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>$${producto.precio.toLocaleString()}</strong></p>
            <div class="botones-container">
                <button class="btn-agregar" ${!producto.disponible ? "disabled" : ""}>
                    ${producto.disponible ? "Agregar al carrito" : "Sin stock"}
                </button>
            </div>
        `;

        if (producto.disponible) {
            const btn = card.querySelector(".btn-agregar") as HTMLButtonElement;
            btn.addEventListener("click", () => agregarAlCarrito(producto));
        }

        contenedor.appendChild(card);
    });
};

// --- Actualizar contador del CARRITO ---
const actualizarContadorCarrito = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    const carrito: CartItem[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const span = document.getElementById("carrito-count") as HTMLSpanElement;
    if (span) span.textContent = String(count);
};

// --- Agregar el producto al carrito, con el control del rol. ---
const agregarAlCarrito = (product: Product) => {
    const userRaw = getUSer();

    // Si el usuario no esta autenticado entre los roles (cliente / admin) se le redirecciona al login.
    if (!userRaw) {
        alert("¡Hola! Para empezar a armar tu carrito necesitas iniciar sesión. 🍔");
        navigate("/src/pages/auth/login/login.html");
        return;
    }

    const carritoGuardado = localStorage.getItem("carrito");
    const carrito: CartItem[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    const itemExistente = carrito.find((item) => item.product.id === product.id);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ product, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`"${product.nombre}" agregado al carrito.`);
};

// --- PROTECCIÓN DEL ACCESO AL CARRITO DESDE EL NAVBAR ---
const protegerEnlaceCarrito = () => {
    const linkCarrito = document.querySelector('a[href="../cart/cart.html"]') as HTMLAnchorElement;
    
    linkCarrito?.addEventListener("click", (e: MouseEvent) => {
        const userRaw = getUSer();
        // Si el usuario no esta autenticado, se le redirecciona al login.
        if (!userRaw) {
            e.preventDefault();
            alert("Por favor, inicia sesión para visualizar tu carrito");
            navigate("/src/pages/auth/login/login.html");
        }
    });
};

// --- CONTROL DINÁMICO DEL BOTÓN ADMIN EN EL NAVBAR ---
const gestionarNavbar = () => {
    const userRaw = getUSer();
    const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
    
    // Si el usuario no esta autenticado
    if (!userRaw) {
        if (buttonLogout) {
            buttonLogout.textContent = "Iniciar Sesión";
            buttonLogout.addEventListener("click", (e) => {
                e.preventDefault();
                navigate("/src/pages/auth/login/login.html");
            });
        }
        return;
    }

    // Si el usuario esta autenticado, independientemente de si es Admin o Cliente
    const user: IUser = JSON.parse(userRaw);
    
    if (buttonLogout) {
        buttonLogout.textContent = "Cerrar Sesión";
        buttonLogout.addEventListener("click", () => {
            logout();
        });
    }

    // Si el usuario esta autenticado y tiene el rol de Admin le aparece el boton "panel admin"
    if (user.role === "admin") {
        const adminContainer = document.getElementById("admin-nav-item");
        if (adminContainer) {
            adminContainer.className = "nav__item";
            adminContainer.innerHTML = `
                <a href="/src/pages/admin/home.html" class="nav__link nav__link--panel-admin">PANEL ADMIN</a>
            `;
        }
    }
};

// --- INICIO ---
cargarCategorias();
cargarProductos(PRODUCTS);
actualizarContadorCarrito();
protegerEnlaceCarrito();
gestionarNavbar();
inicializarBuscador();