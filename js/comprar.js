document.addEventListener('DOMContentLoaded', () => {
    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));

    if (producto) {
        const contenedor = document.querySelector('.producto-seleccionado');
        document.getElementById('imagen-producto').src = producto.imagen;
        document.getElementById('nombre-producto').textContent = producto.nombre;
        document.getElementById('precio-producto').textContent = producto.precio;
 
    } else {
        const contenedor = document.querySelector('.producto-seleccionado');
        contenedor.innerHTML = '<p>No se encontró el producto.</p>';
    }
    const btnComprar = document.getElementById('btn-comprar');
    btnComprar.addEventListener('click', () => {
        alert('¡Tu compra está en proceso!');
    });
});
