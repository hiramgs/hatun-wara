// 1. Cargar el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
actualizarContador();

// 2. Escuchar clics
document.addEventListener('click', (e) => {
    
    if (e.target.classList.contains('btn-comprar')) {
        const boton = e.target;
        let tarjeta = boton.closest('.tarjeta-producto') || boton.closest('.seccion-derecha') || boton.closest('.contenedor-detalle-premium');
        
        if (!tarjeta) return;

        // Extraer datos de forma segura
        const nombre = tarjeta.querySelector('h1, h2, h3').innerText;
        const precioTexto = tarjeta.querySelector('.precio, .precio-grande').innerText;
        const imagen = tarjeta.querySelector('img').src;

        // LIMPIEZA DE PRECIO (Quita S/, $, comas y espacios)
        const precioLimpio = parseFloat(precioTexto.replace(/[^0-9.]/g, ''));

        const producto = {
            id: Date.now(),
            nombre: nombre,
            precio: precioLimpio,
            imagen: imagen
        };

        // Guardar
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Ejecutar Animación y actualizar
        crearAnimacionVuelo(e);
        setTimeout(() => {
            actualizarContador();
        }, 800);
    }

    // Ir al carrito
    if (e.target.id === 'boton-carrito' || e.target.closest('#boton-carrito')) {
        window.location.href = 'carrito.html';
    }
});

// FUNCIÓN DE LA ANIMACIÓN
function crearAnimacionVuelo(e) {
    const particula = document.createElement('div');
    particula.classList.add('particula-voladora');
    
    // Posición inicial (donde el usuario hizo clic)
    particula.style.left = e.clientX + 'px';
    particula.style.top = e.clientY + 'px';
    document.body.appendChild(particula);

    const carritoIcono = document.getElementById('boton-carrito');
    const rect = carritoIcono.getBoundingClientRect();

    // Movimiento hacia el carrito
    setTimeout(() => {
        particula.style.left = (rect.left + rect.width / 2) + 'px';
        particula.style.top = (rect.top + rect.height / 2) + 'px';
        particula.style.transform = 'scale(0.1)';
        particula.style.opacity = '0';
    }, 50);

    // Borrar partícula y sacudir carrito
    setTimeout(() => {
        particula.remove();
        carritoIcono.classList.add('animar-sacudida');
        setTimeout(() => carritoIcono.classList.remove('animar-sacudida'), 400);
    }, 850);
}

function actualizarContador() {
    const contador = document.getElementById('contador-carrito');
    if (contador) contador.innerText = carrito.length;
}

// Lógica para mostrar productos en carrito.html
if (window.location.pathname.includes('carrito.html')) {
    renderizarCarrito();
}
function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const totalTxt = document.getElementById('total-final');
    
    if (!contenedor) return; // Si no existe el div, no hace nada

    let carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
    let sumaTotal = 0;

    contenedor.innerHTML = ''; 

    if (carritoLocal.length === 0) {
        contenedor.innerHTML = '<p style="color:white; text-align:center; padding:20px;">Tu carrito está vacío</p>';
    } else {
        carritoLocal.forEach((prod, index) => {
            // Aseguramos que el precio sea número para sumar
            let precioNum = parseFloat(prod.precio);
            sumaTotal += precioNum;

            contenedor.innerHTML += `
                <div class="item-carrito">
                    <img src="${prod.imagen}">
                    <div class="info-item">
                        <h4>${prod.nombre}</h4>
                        <p>S/ ${precioNum.toFixed(2)}</p>
                    </div>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                </div>
            `;
        });
    }

    if(totalTxt) {
        totalTxt.innerText = `S/ ${sumaTotal.toFixed(2)}`;
    }
}

// IMPORTANTE: Esta función debe estar afuera para que el botón "Eliminar" la encuentre
window.eliminarDelCarrito = function(index) {
    let carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoLocal.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carritoLocal));
    renderizarCarrito(); // Actualiza la vista sin recargar
    if (typeof actualizarContador === 'function') actualizarContador(); 
};

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', renderizarCarrito);
// HACEMOS LA FUNCIÓN GLOBAL PARA QUE EL BOTÓN SIEMPRE LA ENCUENTRE
window.enviarPedidoWhatsApp = function() {
    // 1. Obtenemos los productos actuales del LocalStorage
    let productosParaEnviar = JSON.parse(localStorage.getItem('carrito')) || [];

    // 2. Si no hay nada, avisamos al usuario
    if (productosParaEnviar.length === 0) {
        alert("⚠️ Tu carrito está vacío. ¡Añade algunos ramos antes de pedir!");
        return;
    }

    // 3. Construimos el mensaje con estilo
    let mensaje = "¡Hola *Hatun Wara*! 👋\n";
    mensaje += "Deseo realizar el siguiente pedido:\n\n";
    
    let totalPedido = 0;

    productosParaEnviar.forEach((p, index) => {
        let precio = parseFloat(p.precio) || 0;
        mensaje += `*${index + 1}.* ${p.nombre} - _S/ ${precio.toFixed(2)}_\n`;
        totalPedido += precio;
    });

    mensaje += `\n*Total a pagar: S/ ${totalPedido.toFixed(2)}* 💵`;
    mensaje += "\n\n¿Me confirman la disponibilidad?";

    // 4. Tu número de Hatun Wara (asegúrate de incluir el código de país 51)
    const telefono = "51947971838"; 
    
    // 5. Creamos la URL y abrimos WhatsApp
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
};
// Función para limpiar precios y sumar
function obtenerPrecioNumerico(texto) {
    return parseFloat(texto.replace(/[^0-9.]/g, ''));
}

// Lógica de WhatsApp mejorada
window.enviarPedidoWhatsApp = function() {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carritoActual.length === 0) return alert("Tu carrito está vacío");

    let mensaje = "¡Hola *Hatun Wara*! Deseo realizar este pedido:\n\n";
    let total = 0;

    carritoActual.forEach((p, i) => {
        mensaje += `*${i+1}.* ${p.nombre} - S/ ${p.precio.toFixed(2)}\n`;
        total += p.precio;
    });

    mensaje += `\n*Total a pagar: S/ ${total.toFixed(2)}*`;
    
    const url = `https://wa.me/51947971838?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
};
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
/* =========================================
   COMPRA CON BOTÓN "VOLVER" DINÁMICO
   ========================================= */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-comprar')) {
        const boton = e.target;
        const contenedorAcciones = boton.parentElement; // La caja donde están los botones
        const contenedorDetalle = boton.closest('.contenedor-detalle-premium');
        
        if (!contenedorDetalle) return;

        // 1. Guardar en el carrito (Lógica anterior)
        const nombre = contenedorDetalle.querySelector('.nombre-detalle').innerText;
        const precioTexto = contenedorDetalle.querySelector('.precio-grande').innerText;
        const imagenUrl = contenedorDetalle.querySelector('#imagen-principal').src;
        const precioLimpio = parseFloat(precioTexto.replace(/[^0-9.]/g, ''));

        let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoActual.push({ id: Date.now(), nombre, precio: precioLimpio, imagen: imagenUrl });
        localStorage.setItem('carrito', JSON.stringify(carritoActual));

        // 2. Feedback del botón principal
        boton.innerHTML = "✅ ¡Añadido!";
        boton.style.backgroundColor = "#27ae60";
        boton.style.pointerEvents = "none"; // Bloquear para evitar spam

        // 3. Crear el botón "Seguir Comprando" si no existe ya
        if (!document.getElementById('btn-volver-dinamico')) {
            const btnVolver = document.createElement('a');
            btnVolver.href = "index.html"; // Ruta a tu página principal
            btnVolver.id = "btn-volver-dinamico";
            btnVolver.innerText = "⬅ Seguir comprando";
            
            // Añadir el botón después del botón de comprar
            contenedorAcciones.appendChild(btnVolver);
        }

        // 4. Actualizar contador si tienes la función
        if (typeof window.actualizarContador === 'function') {
            window.actualizarContador();
        }
    }
});