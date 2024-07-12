document.getElementById('formCargarProducto').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagen = document.getElementById('imagen').value;

    // Por simplicidad, usaremos un placeholder para la ruta de la imagen
    // En una aplicación real, manejarías la carga de la imagen y obtendrías la URL de la imagen
    const imagePath =imagen;

    try {
        // Obtener la lista de productos para encontrar el ID más alto
        const response = await fetch('https://66905812c0a7969efd9bd4dd.mockapi.io/tienda-gamer-api/productos');
        const productos = await response.json();

        // Encontrar el ID más alto
        let maxId = 0;
        productos.forEach(producto => {
            const idNumber = parseInt(producto.id, 10);
            if (idNumber > maxId) {
                maxId = idNumber;
            }
        });

        // Crear un nuevo ID que sea un incremento del ID más alto
        const nuevoId = maxId + 1;

        const nuevoProducto = {
            id: nuevoId.toString(), // Asegúrate de que el ID sea una cadena
            nombre: nombre,
            precio: precio,
            imagen: imagePath
        };

        // Enviar el nuevo producto al servidor
        const postResponse = await fetch('https://66905812c0a7969efd9bd4dd.mockapi.io/tienda-gamer-api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        console.log('Respuesta del servidor:', postResponse); // Verificar la respuesta

        if (postResponse.ok) {
            // alert('Producto cargado con éxito');
            window.location.href = 'index.html'; // Redirigir a la página de productos
            
        } else {
            alert('Error al cargar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el producto');
    }
});


