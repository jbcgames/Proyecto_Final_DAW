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
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }
    seccionReservar.style.display = 'none';
    seccionVerReservas.style.display = 'block';
    seccionPrecioTotal.style.display = 'none';
});

botonPrecioTotal.addEventListener("click", () => {
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }
    seccionReservar.style.display = 'none';
    seccionVerReservas.style.display = 'none';
    seccionPrecioTotal.style.display = 'block';
});

botonBusqueda.addEventListener("click", ()=>{
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
        if(data==null){
            return
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
})

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
        TextoPrecio.className ='textoPrecio';
        precioVehiculo.textContent = precio;
        TextoPrecio.textContent ="Precio Total"
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
                    precio += 10000;
                } else {
                    precio -= 10000;
                }
                precioVehiculo.textContent = precio;
            });

            contenedorOpciones.appendChild(checkbox);
            contenedorOpciones.appendChild(label);
        });
        seccionDerecha.appendChild(contenedorOpciones);

        // Crear y añadir el botón para quitar la reservación
        var botonQuitar = document.createElement('button');
        botonQuitar.className = 'boton-quitar';
        botonQuitar.textContent = 'Conformar Reservación';
        seccionDerecha.appendChild(botonQuitar);
        botonQuitar.addEventListener('click', function() {
            const reserva = {
                usuario: nombreUsuario,
                auto_id: idAuto,
                seguros: true,
                asistencia_carretera: false,
                silla_bebes: true,
                equipo_lujo: false,
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
            });
            
            
        });

        reserva.appendChild(seccionDerecha);

        // Añadir el div de reserva al cuerpo del documento
        document.body.appendChild(reserva);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
