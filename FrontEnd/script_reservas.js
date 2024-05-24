// Primero, obtén referencias a las secciones y los botones
var seccionReservar = document.querySelector('.busqueda');
var seccionVerReservas = document.querySelector('.reserva');
var seccionPrecioTotal = document.querySelector('.precio-total');

var botonReservar = document.querySelector('.botonReservar');
var botonVerReservas = document.querySelector('.botonVerReservas');
var botonPrecioTotal = document.querySelector('.botonPrecioTotal');

seccionReservar.style.display = 'block';
seccionVerReservas.style.display = 'none';
seccionPrecioTotal.style.display = 'none';

// Luego, agrega controladores de eventos a los botones
botonReservar.addEventListener("click", () => {
    seccionReservar.style.display = 'block';
    seccionVerReservas.style.display = 'none';
    seccionPrecioTotal.style.display = 'none';
});

botonVerReservas.addEventListener("click", () => {
    seccionReservar.style.display = 'none';
    seccionVerReservas.style.display = 'block';
    seccionPrecioTotal.style.display = 'none';
});

botonPrecioTotal.addEventListener("click", () => {
    seccionReservar.style.display = 'none';
    seccionVerReservas.style.display = 'none';
    seccionPrecioTotal.style.display = 'block';
});
