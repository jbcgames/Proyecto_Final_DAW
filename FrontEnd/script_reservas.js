// Primero, obtén referencias a las secciones y los botones
var urlParams = new URLSearchParams(window.location.search);
var nombreUsuario = urlParams.get('nombreUsuario');
var Nombre = document.querySelector('.saludo')
fetch(`http://localhost:8080/Usuario?nombreUsuario=${nombreUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
      if (!response.ok) {
          window.location.href = 'index.html';
      }
      return response.json();
     })
    .then(data => {
       Nombre.innerText = 'Hola, ' + data.nombre;
        }
    )

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
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());
    seccionReservar.style.display = 'none';
    seccionVerReservas.style.display = 'block';
    seccionPrecioTotal.style.display = 'none';
});

botonPrecioTotal.addEventListener("click", () => {
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());
    seccionReservar.style.display = 'none';
    seccionVerReservas.style.display = 'none';
    seccionPrecioTotal.style.display = 'block';
});

botonBusqueda.addEventListener("click", ()=>{
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());

    var criterio = document.querySelector('.tipo-busqueda').value;
    var valor = document.querySelector('.campo-busqueda').value;
    var url = `http://localhost:8080/Autos?${criterio}=${valor}`;
    console.log(url);

    // Realiza la petición GET
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(auto => {
            var reservaDiv = document.createElement('div');
            reservaDiv.className = 'reserva';

            var imagenVehiculo = document.createElement('img');
            imagenVehiculo.className = 'imagen-vehiculo';
            imagenVehiculo.src = auto.imagen_link;
            imagenVehiculo.alt = 'Imagen del Vehículo';
            reservaDiv.appendChild(imagenVehiculo);

            var infoVehiculo = document.createElement('div');
            infoVehiculo.className = 'info-vehiculo';

            var nombreVehiculo = document.createElement('h2');
            nombreVehiculo.className = 'nombre-vehiculo';
            nombreVehiculo.textContent = auto.nombre;
            infoVehiculo.appendChild(nombreVehiculo);

            var caracteristicasVehiculo = document.createElement('p');
            caracteristicasVehiculo.className = 'caracteristicas-vehiculo';
            caracteristicasVehiculo.textContent = `Tipo: ${auto.tipo}, Color: ${auto.color}, Modelo: ${auto.modelo}, Marca: ${auto.marca}, Transmisión: ${auto.transmision}, Motor: ${auto.motor}`;
            infoVehiculo.appendChild(caracteristicasVehiculo);

            var precioVehiculo = document.createElement('p');
            precioVehiculo.className = 'precio-vehiculo';
            precioVehiculo.textContent = `Precio: $${auto.precio}`;
            infoVehiculo.appendChild(precioVehiculo);

            reservaDiv.appendChild(infoVehiculo);

            var botonAgregar = document.createElement('button');
            botonAgregar.className = 'boton-agregar';
            botonAgregar.textContent = 'Agregar Reservación';
            botonAgregar.addEventListener('click', function() {
                tuFuncion(auto.nombre);
            });
            reservaDiv.appendChild(botonAgregar);

            document.body.appendChild(reservaDiv);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
})

function tuFuncion(nombreAuto) {
    // Aquí puedes implementar lo que quieras que haga tu función
    console.log(`El botón del auto ${nombreAuto} fue presionado.`);
}
