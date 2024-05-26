// Primero, obtén referencias a las secciones y los botones
var seccionReservar = document.querySelector('.busqueda');
var seccionVerReservas = document.querySelector('.reserva');
var seccionPrecioTotal = document.querySelector('.precio-total');

var botonReservar = document.querySelector('.botonReservar');
var botonVerReservas = document.querySelector('.botonVerReservas');
var botonPrecioTotal = document.querySelector('.botonPrecioTotal');
var botonBusqueda = document.querySelector('.boton-busqueda');
var campoBusqueda =document.querySelector('.campo-busqueda');


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

botonBusqueda.addEventListener("click", ()=>{
    var teo =campoBusqueda.value;
    fetch('http://localhost:5000/mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: teo }),
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });

})