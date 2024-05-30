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
var seccionReservas2 = document.querySelector('.reserva');
var seccionPrecioTotal = document.querySelector('.precio-total');
var seccionVerReservas = document.querySelector('.consultar-reserva');

var botonReservar = document.querySelector('.botonReservar');
var botonVerReservas = document.querySelector('.botonVerReservas');
var botonPrecioTotal = document.querySelector('.botonPrecioTotal');
var botonBusqueda = document.querySelector('.boton-busqueda');
var campoBusqueda = document.querySelector('.campo-busqueda');

seccionReservar.style.display = 'block';
seccionReservas2.style.display = 'none';
seccionPrecioTotal.style.display = 'none';
seccionVerReservas.style.display = 'none';
// Luego, agrega controladores de eventos a los botones
botonReservar.addEventListener("click", () => {
    seccionReservar.style.display = 'block';
    seccionReservas2.style.display = 'none';
    seccionPrecioTotal.style.display = 'none';
    seccionVerReservas.style.display = 'none';
});

botonVerReservas.addEventListener("click", () => {
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }
    var reservas = document.querySelectorAll('.reserva1');
    reservas.forEach(reserva => reserva.remove());
    seccionReservar.style.display = 'none';
    seccionVerReservas.style.display = 'block';
    seccionReservas2.style.display = 'none';
    seccionPrecioTotal.style.display = 'none';

    fetch(`http://localhost:8080/Reservas?usuario=${nombreUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(reserva => {
            fetch(`http://localhost:8080/Autos?id=${reserva.auto_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(autoData => {
                var auto = autoData[0]; // Asumiendo que autoData es un array y estamos interesados en el primer elemento
                var reservaDiv = document.createElement('div');
                reservaDiv.className = 'reserva1';

                var infoReserva = document.createElement('div');
                infoReserva.className = 'info-vehiculo';

                var imagenVehiculo = document.createElement('img');
                imagenVehiculo.className = 'imagen-vehiculo';
                imagenVehiculo.src = auto.imagen_link;
                imagenVehiculo.alt = 'Imagen del Vehículo';
                reservaDiv.appendChild(imagenVehiculo);

                var autoNombreReserva = document.createElement('p');
                autoNombreReserva.className = 'nombre-vehiculo';
                autoNombreReserva.textContent = `Nombre del Auto: ${auto.nombre}`; // Aquí se cambió el ID del auto por el nombre del auto
                infoReserva.appendChild(autoNombreReserva);

                var segurosReserva = document.createElement('p');
                segurosReserva.className = 'caracteristicas-vehiculo';
                segurosReserva.textContent = `Seguros: ${reserva.seguros ? 'Sí' : 'No'}`;
                infoReserva.appendChild(segurosReserva);

                var asistenciaCarreteraReserva = document.createElement('p');
                asistenciaCarreteraReserva.className = 'caracteristicas-vehiculo';
                asistenciaCarreteraReserva.textContent = `Asistencia en Carretera: ${reserva.asistencia_carretera ? 'Sí' : 'No'}`;
                infoReserva.appendChild(asistenciaCarreteraReserva);

                var sillaBebesReserva = document.createElement('p');
                sillaBebesReserva.className = 'caracteristicas-vehiculo';
                sillaBebesReserva.textContent = `Silla para Bebés: ${reserva.silla_bebes ? 'Sí' : 'No'}`;
                infoReserva.appendChild(sillaBebesReserva);

                var equipoLujoReserva = document.createElement('p');
                equipoLujoReserva.className = 'caracteristicas-vehiculo';
                equipoLujoReserva.textContent = `Equipo de Lujo: ${reserva.equipo_lujo ? 'Sí' : 'No'}`;
                infoReserva.appendChild(equipoLujoReserva);

                var precioFinalReserva = document.createElement('p');
                precioFinalReserva.className = 'precio-vehiculo';
                precioFinalReserva.textContent = `Precio Final: $${reserva.precio_final}`;
                infoReserva.appendChild(precioFinalReserva);

                var botonEliminar = document.createElement('button');
                botonEliminar.className = 'boton-quitar';
                botonEliminar.textContent = 'Eliminar Reserva';
                botonEliminar.addEventListener('click', () => {
                    fetch(`http://localhost:8080/Reservas?id=${reserva.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => {
                        if (response.ok) {
                            reservaDiv.remove();
                            alert('Reserva eliminada exitosamente');
                        } else {
                            alert('Error al eliminar la reserva');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                });

                reservaDiv.appendChild(infoReserva);
                reservaDiv.appendChild(botonEliminar);
                seccionVerReservas.appendChild(reservaDiv);
            })
            .catch((error) => {
                alert('No Tienes Reservas')
            });
        });
    })
    .catch((error) => {
        seccionReservar.style.display = 'block';
        seccionReservas2.style.display = 'none';
        seccionPrecioTotal.style.display = 'none';
        seccionVerReservas.style.display = 'none';
        alert('No Tienes Reservas')
        
    });
});



botonBusqueda.addEventListener("click", () => {
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }
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
        if (data == null) {
            return;
        }
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
                var reservas = document.querySelectorAll('.reserva');
                reservas.forEach(reserva => reserva.remove());
                tuFuncion(auto.id);
            });
            reservaDiv.appendChild(botonAgregar);

            document.body.appendChild(reservaDiv);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function tuFuncion(idAuto) {
    var url = `http://localhost:8080/Autos?id=${idAuto}`;
    console.log(url);
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }

    // Realiza la petición GET
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        var nombre = data[0].nombre;
        var imagen = data[0].imagen_link;
        var precio = data[0].precio;

        var reserva = document.createElement('div');
        reserva.className = 'reserva-sup';
        reserva.style.zIndex = '1000';

        var seccionIzquierda = document.createElement('div');
        seccionIzquierda.className = 'seccion-izquierda';

        var imagenVehiculo = document.createElement('img');
        imagenVehiculo.className = 'imagen-vehiculo';
        imagenVehiculo.src = imagen;
        imagenVehiculo.alt = 'Imagen del Vehículo';

        // Crear y añadir la información del vehículo
        var infoVehiculo = document.createElement('div');
        infoVehiculo.className = 'info-vehiculo';

        var nombreVehiculo = document.createElement('h2');
        nombreVehiculo.className = 'nombre-vehiculo';
        nombreVehiculo.textContent = nombre;
        seccionIzquierda.appendChild(nombreVehiculo);
        seccionIzquierda.appendChild(imagenVehiculo);

        var precioVehiculo = document.createElement('p');
        var TextoPrecio = document.createElement('p');
        precioVehiculo.className = 'precio-vehiculo';
        TextoPrecio.className = 'textoPrecio';
        precioVehiculo.textContent = precio;
        TextoPrecio.textContent = "Precio Total";
        infoVehiculo.appendChild(TextoPrecio);
        infoVehiculo.appendChild(precioVehiculo);

        seccionIzquierda.appendChild(infoVehiculo);
        reserva.appendChild(seccionIzquierda);

        var seccionDerecha = document.createElement('div');
        seccionDerecha.className = 'seccion-derecha';

        // Crear y añadir los checkboxes
        var opciones = ['Seguros', 'Asistencia en carretera', 'Silla para bebés', 'Equipo de lujo'];
        var contenedorOpciones = document.createElement('div');
        contenedorOpciones.className = 'contenedor-opciones';

        var estadoReserva = {
            seguros: false,
            asistenciaCarretera: false,
            sillaBebes: false,
            equipoLujo: false
        };

        opciones.forEach(opcion => {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = opcion;
            checkbox.value = opcion;
            checkbox.id = opcion;

            var label = document.createElement('label');
            label.htmlFor = opcion;
            label.appendChild(document.createTextNode(opcion));

            // Agregar evento de escucha al checkbox
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    precio =precio+precio*0.1;
                } else {
                    precio =precio-precio*0.1;
                }
                precioVehiculo.textContent = precio;

                switch (opcion) {
                    case 'Seguros':
                        estadoReserva.seguros = this.checked;
                        break;
                    case 'Asistencia en carretera':
                        estadoReserva.asistenciaCarretera = this.checked;
                        break;
                    case 'Silla para bebés':
                        estadoReserva.sillaBebes = this.checked;
                        break;
                    case 'Equipo de lujo':
                        estadoReserva.equipoLujo = this.checked;
                        break;
                }
            });

            contenedorOpciones.appendChild(checkbox);
            contenedorOpciones.appendChild(label);
        });
        seccionDerecha.appendChild(contenedorOpciones);

        // Crear y añadir el botón para quitar la reservación
        var botonQuitar = document.createElement('button');
        botonQuitar.className = 'boton-quitar';
        botonQuitar.textContent = 'Confirmar Reservación';
        seccionDerecha.appendChild(botonQuitar);
        botonQuitar.addEventListener('click', function() {
            const reserva = {
                usuario: nombreUsuario,
                auto_id: idAuto,
                seguros: estadoReserva.seguros,
                asistencia_carretera: estadoReserva.asistenciaCarretera,
                silla_bebes: estadoReserva.sillaBebes,
                equipo_lujo: estadoReserva.equipoLujo,
                precio_final: precio
            };

            fetch('http://localhost:8080/Reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reserva),
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            })
            alert('Reserva Agregada');
            var divAnterior = document.querySelector('.reserva-sup');
            if (divAnterior) {
                divAnterior.remove();
            }
        });

        reserva.appendChild(seccionDerecha);

        document.body.appendChild(reserva);

    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
