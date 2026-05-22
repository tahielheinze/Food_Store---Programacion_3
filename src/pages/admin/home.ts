import { checkAuhtUser, logout } from "../../utils/auth";
import { PRODUCTS } from "../../data/data";
import type { Product } from "../../types/Product";

// --- LOGOUT ---
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
    logout();
});

// --- ELIMINAR PRODUCTO ---
const eliminarProducto = (id: number) => {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar el producto con ID #${id}?`);
    if (confirmar) {
        alert("Producto eliminado correctamente.");
    }
};

// --- EDITAR PRODUCTO ---
const editarProducto = (producto: Product) => {
    alert(`Abriendo panel de edición para:\n"${producto.nombre}"\n\nPrecio actual: $${producto.precio.toLocaleString()}`);
};

// --- RENDERIZADO DE PRODUCTOS PARA EL ADMINISTRADOR ---
const cargarProductosAdmin = (lista: Product[]) => {
    const tabla = document.getElementById("tabla-productos") as HTMLTableSectionElement;
    if (!tabla) return;

    tabla.innerHTML = "";

    lista.forEach((producto) => {
        // Creamos una fila de tabla en lugar de un div
        const fila = document.createElement("tr");
        
        // Mapeamos la lista de categorías a un string separado por comas
        const categoriasStr = producto.categorias.map(cat => cat.nombre).join(", ");

        fila.innerHTML = `
            <td><strong>#${producto.id}</strong></td>
            <td>
                <img src="../../../../assets/img/${producto.imagen}" alt="${producto.nombre}" class="admin-table-img" onerror="this.classList.add('img-hidden')">
            </td>
            <td>${producto.nombre}</td>
            <td>${categoriasStr}</td>
            <td><strong>$${producto.precio.toLocaleString()}</strong></td>
            <td>${producto.disponible ? "Con Stock" : "Sin Stock"}</td>
            <td>
                <div class="admin-actions-container">
                    <button class="btn-editar">Editar</button>
                    <button class="btn-delete">Eliminar</button>
                </div>
            </td>
        `;

        // Vincular los eventos a los botones de la fila
        const btnEditar = fila.querySelector(".btn-editar") as HTMLButtonElement;
        btnEditar.addEventListener("click", () => editarProducto(producto));

        const btnEliminar = fila.querySelector(".btn-delete") as HTMLButtonElement;
        btnEliminar.addEventListener("click", () => eliminarProducto(producto.id));

        tabla.appendChild(fila);
    });
};

// --- INICIALIZACIÓN Y CONTROL DE ACCESO ---
const initPage = () => {
    console.log("Inicio de página - Vista Administrador Activa");
    
    // Si no hay sesión iniciada va al login.
    // Si un usuario con rol distinto al "admin" entra por URL se lo redirecciona a la tienda.
    checkAuhtUser(
        "/src/pages/auth/login/login.html",
        "/src/pages/store/home/home.html",
        "admin"
    );

    cargarProductosAdmin(PRODUCTS);
};

initPage();