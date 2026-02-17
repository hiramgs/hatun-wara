/* =========================================
   LÓGICA ESPECÍFICA PARA script-detalle.js
   ========================================= */

// 1. Configuración de la Galería
// Agrega aquí los nombres de tus archivos de imagen
// Cambia estos nombres por tus archivos reales
const imagenesGaleria = [
    "ramo-goku.jpg",      // Imagen principal
    "flor-angel.jpg",     // Segunda imagen
    "flor-de-conejo.jpg", // Tercera imagen
    "flor-stich.jpg"      // Puedes agregar más si quieres
];

let indiceActual = 0;

// 2. Selección de elementos
const imagenPrincipal = document.getElementById('imagen-principal');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');

// 3. Función para cambiar imagen con efecto Fade (Suave)
function actualizarGaleria(nuevoIndice) {
    if (!imagenPrincipal) return;

    // Efecto de salida: desvanecer
    imagenPrincipal.style.opacity = "0";

    setTimeout(() => {
        // Calcular nuevo índice (ciclo infinito)
        indiceActual = (nuevoIndice + imagenesGaleria.length) % imagenesGaleria.length;
        
        // Cambiar la imagen
        imagenPrincipal.src = imagenesGaleria[indiceActual];
        
        // Efecto de entrada: aparecer
        imagenPrincipal.style.opacity = "1";
    }, 300); // El tiempo debe coincidir con el CSS
}

// 4. Eventos para las flechas
if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        actualizarGaleria(indiceActual - 1);
    });

    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        actualizarGaleria(indiceActual + 1);
    });
}

/* =========================================
   INTEGRACIÓN CON EL CARRITO
   ========================================= */
// Reutilizamos la lógica de compra para esta página
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-comprar')) {
        const contenedor = e.target.closest('.contenedor-detalle-premium');
        
        if (!contenedor) return;

        const nombre = contenedor.querySelector('.nombre-detalle').innerText;
        const precioTexto = contenedor.querySelector('.precio-grande').innerText;
        const imagen = contenedor.querySelector('#imagen-principal').src;

        // Limpieza de precio (solo números)
        const precioLimpio = parseFloat(precioTexto.replace(/[^0-9.]/g, ''));

        // Obtener carrito actual
        let carritoDetalle = JSON.parse(localStorage.getItem('carrito')) || [];

        const producto = {
            id: Date.now(),
            nombre: nombre,
            precio: precioLimpio,
            imagen: imagen
        };

        carritoDetalle.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carritoDetalle));
        
        alert(`✅ ¡${nombre} añadido al carrito!`);
        
        // Si tienes la función de actualizar el número del carrito, la llamamos:
        if (typeof actualizarContador === 'function') {
            actualizarContador();
        }
    }
});
/* =========================================
   LÓGICA DE COMPRA CON FEEDBACK VISUAL
   ========================================= */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-comprar')) {
        const boton = e.target; // Guardamos la referencia al botón
        const contenedor = boton.closest('.contenedor-detalle-premium');
        
        if (!contenedor) return;

        // 1. Capturar datos
        const nombre = contenedor.querySelector('.nombre-detalle').innerText;
        const precioTexto = contenedor.querySelector('.precio-grande').innerText;
        const imagenUrl = contenedor.querySelector('#imagen-principal').src;
        const precioLimpio = parseFloat(precioTexto.replace(/[^0-9.]/g, ''));

        // 2. Guardar en LocalStorage
        let carritoDetalle = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoDetalle.push({
            id: Date.now(),
            nombre: nombre,
            precio: precioLimpio,
            imagen: imagenUrl
        });
        localStorage.setItem('carrito', JSON.stringify(carritoDetalle));

        // 3. CAMBIO DE ESTADO DEL BOTÓN (Aquí está la magia)
        const textoOriginal = boton.innerHTML; // Guardamos "🛒 Añadir al carrito"
        
        boton.innerText = "✅ Añadido"; // Cambiamos el texto
        boton.style.backgroundColor = "#2ecc71"; // Cambiamos a un verde más brillante
        boton.style.pointerEvents = "none"; // Evitamos múltiples clics seguidos

        // 4. Regresar a la normalidad después de 2 segundos
        setTimeout(() => {
            boton.innerHTML = textoOriginal;
            boton.style.backgroundColor = ""; // Regresa al color de tu CSS
            boton.style.pointerEvents = "auto";
        }, 2000);

        // Actualizar contador si existe la función
        if (typeof window.actualizarContador === 'function') {
            window.actualizarContador();
        }
    }
});