import { conexionAPI } from "./conexionAPI.js";

const lista = document.querySelector("[data-lista]");
const editModal = document.getElementById('editModal');
const spanClose = document.querySelectorAll(".close");
const formEditarProducto = document.getElementById('formEditarProducto');
const searchBar = document.getElementById('searchBar');
let currentEditingProductId = null;
let productos = [];

//#region CREAR TARJETAS
// Función para crear una tarjeta de producto
function crearCard(id, imagen, nombre, precio) {
    const producto = document.createElement("div");
    producto.className = "section-index";
    producto.innerHTML = `
    <div class="contenedor-producto" data-id="${id}">
        <div class="producto">
            <img class="imagen-producto" src="${imagen}" alt="">
            <div>
                <h2 class="nombreProducto">${nombre}</h2>
                <div class="precio-iconoDelete">
                    <p class="precioProducto">${'$' + precio}</p>
                    <button class="btn-edit" data-id="${id}"><img src="Img/iconos/editar.png" alt="Editar"></button>
                    <button class="btn-delete" data-id="${id}"><img src="Img/iconos/delete.png" alt="Eliminar"></button>
                </div>
            </div>
        </div>
     </div> 
    `;
    return producto;
}
//#region LISTAR PRODUCTOS
// Función para listar los productos
async function listarProductos() {
    try {
        productos = await conexionAPI.listarProductos();
        console.log('Datos a procesar:', productos);
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al obtener los datos de los productos: ", error);
    }
}

function mostrarProductos(productos) {
    lista.innerHTML = '';
    if (productos.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay productos disponibles.";
        mensaje.classList.add("no-productos");
        lista.appendChild(mensaje);
    } else {
        productos.forEach(producto => {
            const card = crearCard(producto.id, producto.imagen, producto.nombre, producto.precio);
            lista.appendChild(card);
        });
        agregarEventListeners();
    }
}

//#region ELIMINAR PRODUCTO
// Función para agregar el evento al boton de ELIMINAR
function agregarEventListeners() {
    const botonesEliminar = document.querySelectorAll(".btn-delete");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", async (event) => {
            const id = event.target.closest(".btn-delete").dataset.id;

            // Mostrar la ventana de confirmación
            const confirmacion = confirm("¿Seguro deseas eliminar el producto?");

            if (confirmacion) {
                try {
                    const response = await fetch(`https://66905812c0a7969efd9bd4dd.mockapi.io/tienda-gamer-api/productos/${id}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        //Producto eliminado
                        const productoElement = document.querySelector(`.contenedor-producto[data-id="${id}"]`);
                        productoElement.remove();

                        // Verificar si quedan productos en la lista
                        const remainingProducts = document.querySelectorAll(".contenedor-producto");
                        if (remainingProducts.length === 0) {
                            const mensaje = document.createElement("p");
                            mensaje.textContent = "No hay productos disponibles.";
                            mensaje.classList.add("no-productos");
                            lista.appendChild(mensaje);
                        }
                    } else {
                        alert('Error al eliminar el producto');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al eliminar el producto');
                }
            }
        });
    });
    //#region EDITAR PRODUCTO
    // Función para agregar el evento al boton de EDITAR
    const botonesEditar = document.querySelectorAll(".btn-edit");
    botonesEditar.forEach(boton => {
        boton.addEventListener("click", (event) => {
            event.preventDefault();

            currentEditingProductId = event.target.closest(".btn-edit").dataset.id;
            const productoElement = document.querySelector(`.contenedor-producto[data-id="${currentEditingProductId}"]`);
            const nombre = productoElement.querySelector('.nombreProducto').textContent;
            const precio = productoElement.querySelector('.precioProducto').textContent.replace('$', '');
            const imagen = productoElement.querySelector('.imagen-producto').src;

            document.getElementById('editNombre').value = nombre;
            document.getElementById('editPrecio').value = precio;
            document.getElementById('editImagen').value = imagen;
            document.getElementById('editId').value = currentEditingProductId;

            editModal.style.display = "block";
        });
    });
    //#region COMPRAR PRODUCTO
    // Función para seleccionar un producto y redireccionar a otra vista
    const imagenesProducto = document.querySelectorAll(".contenedor-producto .imagen-producto");
    imagenesProducto.forEach(imagen => {
        imagen.addEventListener("click", (event) => {
            const productoElement = event.target.closest(".contenedor-producto");
            const id = productoElement.dataset.id;
            const nombre = productoElement.querySelector('.nombreProducto').textContent;
            const precio = productoElement.querySelector('.precioProducto').textContent;
            const imagen = productoElement.querySelector('.imagen-producto').src;

            const productoSeleccionado = {
                id: id,
                nombre: nombre,
                precio: precio,
                imagen: imagen
            };

            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
            window.location.href = 'comprar.html'; // Redirigir a la página de compra
        });
    });

    spanClose.forEach(span => {
        span.addEventListener("click", () => {
            editModal.style.display = "none";
        });
    });

    window.addEventListener("click", (event) => {
        if (event.target === editModal) {
            editModal.style.display = "none";
        }
    });

    //#region FUNCION EDITAR
    formEditarProducto.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.getElementById('editId').value;
        const nombre = document.getElementById('editNombre').value;
        const precio = document.getElementById('editPrecio').value;
        const imagen = document.getElementById('editImagen').value;

        const productoActualizado = {
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen
        };

        try {
            const response = await fetch(`https://66905812c0a7969efd9bd4dd.mockapi.io/tienda-gamer-api/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoActualizado)
            });

            if (response.ok) {
                alert('Producto actualizado con éxito');

                // Actualizo el producto en el DOM sin recargar la página
                const productoElement = document.querySelector(`.contenedor-producto[data-id="${id}"]`);
                productoElement.querySelector('.nombreProducto').textContent = nombre;
                productoElement.querySelector('.precioProducto').textContent = `$${precio}`;
                productoElement.querySelector('.imagen-producto').src = imagen;

                editModal.style.display = "none";
            } else {
                alert('Error al actualizar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el producto');
        }
    });
}

// Función de búsqueda
function buscarProductos() {
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const productosFiltrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(searchTerm)
        );
        mostrarProductos(productosFiltrados);
    });
}

buscarProductos();
listarProductos();

