async function listarProductos() {
    const conexion = await fetch("https://66905812c0a7969efd9bd4dd.mockapi.io/tienda-gamer-api/productos");

    //const conexion = await fetch("https://my-json-server.typicode.com/WillyBurritos/tienda-gamer-api/productos");

    const conexionConvertida = conexion.json();
    // console.log(conexionConvertida);
    return conexionConvertida;
}
export const conexionAPI = {
    listarProductos
}


