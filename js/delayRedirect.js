//EL MENU DEL BOTON HAMBURGUESA TARDARA 0.5 SEGUNDOS EN REDIRIGIR PARA QUE SE APRECIE EL EFECTO

document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('#hamburgerMenu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {  // Solo en vistas Moviles
                e.preventDefault();
                const href = link.getAttribute('href');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
});
