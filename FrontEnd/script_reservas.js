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
botonPrecioTotal.addEventListener("click", () => {
    seccionReservar.style.display = 'none';
    seccionReservas2.style.display = 'none';
    seccionPrecioTotal.style.display = 'block';
    seccionVerReservas.style.display = 'none';
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());
    consultarInforme(nombreUsuario)
    
});
function VerReservas(){
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
                            // Primero, elimina la reserva
                            reservaDiv.remove();
                            alert('Reserva eliminada exitosamente');
                            VerReservas();
                
                            // Luego, actualiza la disponibilidad del auto a true
                            fetch(`http://localhost:8080/Autos`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ id: reserva.auto_id, disponible: true }),
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
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
};
botonVerReservas.addEventListener("click", VerReservas)

botonBusqueda.addEventListener("click", mibotonBusqueda);

function mibotonBusqueda() {
    // Eliminar reservas anteriores
    var reservas = document.querySelectorAll('.reserva');
    reservas.forEach(reserva => reserva.remove());

    // Eliminar div anterior si existe
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }

    // Obtener criterio y valor de búsqueda
    var criterio = document.querySelector('.tipo-busqueda').value;
    var valor = document.querySelector('.campo-busqueda').value;

    // Construir URL para la petición GET
    var url = `http://localhost:8080/Autos?${criterio}=${valor}`;
    console.log(url);

    // Realizar la petición GET
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Verificar si hay datos y si hay autos disponibles
        if (data == null || data.length === 0) {
            alert('No hay autos disponibles que cumplan con el criterio de búsqueda.');
            return;
        }
        var autosDisponibles = data.filter(auto => auto.disponible);
        if (autosDisponibles.length === 0) {
            alert('No hay autos disponibles que cumplan con el criterio de búsqueda.');
            return;
        }

        // Crear y mostrar elementos para cada auto disponible
        autosDisponibles.forEach(auto => {
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
}


function obtenerNombreCarro(autoId) {
    return fetch(`http://localhost:8080/Autos?id=${autoId}`)
        .then(response => response.json())
        .then(data => data[0].nombre);
}

// Función para consultar el endpoint /Informe y organizar los resultados en HTML
function rellenarConPuntos(nombreVehiculo, precioVehiculo) {
    // Obtener la resolución de la ventana del navegador
    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;

    // Definir maxLongitud en función de la resolución
    let maxLongitud = Math.round(anchoPantalla / 7.2);

    // Convertir precioVehiculo a cadena para obtener la longitud correcta
    const precioVehiculoStr = precioVehiculo.toString();
    const longitudActual = nombreVehiculo.length + precioVehiculoStr.length;
    const longitudPuntos = maxLongitud - longitudActual;
    return '.'.repeat(longitudPuntos > 0 ? longitudPuntos : 0);
}

// Función para consultar el endpoint /Informe y organizar los resultados en HTML
function consultarInforme(usuario) {
    let costoTotal = 0;
    const contenedorResultados = document.querySelector('.precio-total');
    contenedorResultados.innerHTML = ''; // Limpiar resultados anteriores
    fetch(`http://localhost:8080/Informe?usuario=${usuario}`)
        .then(response => response.json())
        .then(reservas => {
            
            
            // Crear un array de promesas para cada reserva
            const promesas = reservas.map(reserva => {
                return obtenerNombreCarro(reserva.auto_id).then(nombreCarro => {
                    const precioVehiculo = reserva.precio_final;
                    const puntos = rellenarConPuntos(nombreCarro, precioVehiculo);
                    // Crear el HTML para cada línea de precio
                    const lineaPrecio = document.createElement('div');
                    lineaPrecio.className = 'linea-precio';
                    lineaPrecio.innerHTML = `
                        <span class="nombre-vehiculo">${nombreCarro}</span>
                        <span class="puntos">${puntos}</span>
                        <span class="precio-vehiculo">$${precioVehiculo}</span>
                    `;
                    contenedorResultados.appendChild(lineaPrecio);
                    costoTotal += precioVehiculo;
                });
            });

            // Esperar a que todas las promesas se resuelvan
            Promise.all(promesas).then(() => {
                const lineaTotal = document.createElement('div');
                lineaTotal.className = 'linea-precio';
                const puntos = rellenarConPuntos("Precio Total", costoTotal);
                lineaTotal.innerHTML = `
                    <span class="nombre-vehiculo"><strong>Precio Total</strong></span>
                    <span class="puntos">${puntos}</span>
                    <span class="precio-vehiculo"><strong>$${costoTotal}</strong></span>
                `;
                contenedorResultados.appendChild(lineaTotal);
                agregarBotonDescarga();
            });
        })
        .catch((error) => {
            
            
            seccionReservar.style.display = 'block';
            seccionReservas2.style.display = 'none';
            seccionPrecioTotal.style.display = 'none';
            seccionVerReservas.style.display = 'none';
            alert('No Tienes Reservas')
        });
}
function tuFuncion(idAuto) {
    var url = `http://localhost:8080/Autos?id=${idAuto}`;
    console.log(url);

    // Eliminar la reserva anterior si existe
    var divAnterior = document.querySelector('.reserva-sup');
    if (divAnterior) {
        divAnterior.remove();
    }

    // Realizar la petición GET para obtener los detalles del auto
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

        // Crear y añadir la sección de reserva
        var reserva = document.createElement('div');
        reserva.className = 'reserva-sup';
        reserva.style.zIndex = '1000';

        var seccionIzquierda = document.createElement('div');
        seccionIzquierda.className = 'seccion-izquierda';

        var imagenVehiculo = document.createElement('img');
        imagenVehiculo.className = 'imagen-vehiculo';
        imagenVehiculo.src = imagen;
        imagenVehiculo.alt = 'Imagen del Vehículo';
        seccionIzquierda.appendChild(imagenVehiculo);

        var nombreVehiculo = document.createElement('h2');
        nombreVehiculo.className = 'nombre-vehiculo';
        nombreVehiculo.textContent = nombre;
        seccionIzquierda.appendChild(nombreVehiculo);

        var precioVehiculo = document.createElement('p');
        precioVehiculo.className = 'precio-vehiculo';
        precioVehiculo.textContent = `Precio: $${precio}`;
        seccionIzquierda.appendChild(precioVehiculo);

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
                estadoReserva[opcion.toLowerCase().replace(/ /g, '')] = this.checked;
                // Actualizar el precio total
                var precioTotal = calcularPrecioTotal(precio, estadoReserva, opciones.length);
                precioVehiculo.textContent = `Precio: $${precioTotal}`;
            });

            contenedorOpciones.appendChild(checkbox);
            contenedorOpciones.appendChild(label);
        });

        seccionDerecha.appendChild(contenedorOpciones);

        // Crear y añadir el botón para quitar la reservación
        var botonQuitar = document.createElement('button');
        botonQuitar.className = 'boton-quitar';
        botonQuitar.textContent = 'Confirmar Reservación';
        botonQuitar.addEventListener('click', function() {
            // Crear el objeto de la reservación
            const reserva = {
                usuario: nombreUsuario, // Asegúrate de tener esta variable definida en tu código
                auto_id: idAuto,
                seguros: estadoReserva.seguros,
                asistencia_carretera: estadoReserva.asistenciaCarretera,
                silla_bebes: estadoReserva.sillaBebes,
                equipo_lujo: estadoReserva.equipoLujo,
                precio_final: precio
            };

            // Realizar la petición POST para agregar la reservación
            fetch('http://localhost:8080/Reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reserva),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                

                // Cambiar el estado de disponibilidad del auto a no disponible
                fetch(`http://localhost:8080/Autos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: idAuto, disponible: false }),
                })

                .catch((error) => {
                    console.error('Error:', error);
                });

                // Eliminar la interfaz de la reservación
                var divAnterior = document.querySelector('.reserva-sup');
                if (divAnterior) {
                    divAnterior.remove();
                }
                alert('Reserva Agregada');
                mibotonBusqueda(); // Actualizar la lista de autos
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });

        seccionDerecha.appendChild(botonQuitar);
        reserva.appendChild(seccionDerecha);

        document.body.appendChild(reserva);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Función auxiliar para calcular el precio total
function calcularPrecioTotal(precioBase, estadoReserva, numOpciones) {
    var incremento = precioBase * 0.1;
    var precioTotal = precioBase;
    for (var opcion in estadoReserva) {
        if (estadoReserva[opcion]) {
            precioTotal += incremento;
        }
    }
    return Math.round(precioTotal);
}

function descargarComoTxt() {
    const contenedorResultados = document.querySelector('.precio-total');
    let contenido = '';
    const lineasPrecio = contenedorResultados.querySelectorAll('.linea-precio');

    // Construir el contenido con el formato deseado
    lineasPrecio.forEach((linea, index) => {
        const nombreVehiculo = linea.querySelector('.nombre-vehiculo').textContent.trim();
        const precioVehiculo = linea.querySelector('.precio-vehiculo').textContent.trim();
        // Para la última línea, que es el Precio Total, no agregar el salto de línea al final
        if (index === lineasPrecio.length - 1) {
            contenido += `${nombreVehiculo}: ${precioVehiculo}`;
        } else {
            contenido += `${nombreVehiculo}: ${precioVehiculo}\n`;
        }
    });

    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
    elemento.setAttribute('download', 'informe.txt');

    elemento.style.display = 'none';
    document.body.appendChild(elemento);

    elemento.click();

    document.body.removeChild(elemento);
}
function agregarBotonDescarga() {
    const contenedorResultados = document.querySelector('.precio-total');
    const botonDescarga = document.createElement('button');
    botonDescarga.textContent = 'Descargar Informe';
    botonDescarga.className = 'botonDescargar'; // Agregar la clase al botón
    botonDescarga.onclick = descargarComoTxt;
    contenedorResultados.appendChild(botonDescarga);
}