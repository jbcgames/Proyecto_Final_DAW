var Usuario = document.querySelector('.User');
var Contraseña = document.querySelector('.Password');
var Boton = document.querySelector('.Ingresar');

Boton.addEventListener('click', function() {
    var Ingreso = Usuario.value;
    console.log("Into")
    var Contra = Contraseña.value;
    fetch(`http://localhost:8080/Usuario?nombreUsuario=${Ingreso}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Nombre de usuario o contraseña incorrecta');
        }
        return response.json();
    })
    .then(data => {
        if (data.password === Contra) {
            window.location.href = 'reservas.html?nombreUsuario=' + encodeURIComponent(Ingreso);
        } else {
            alert('Nombre de usuario o contraseña incorrecta');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Nombre de usuario o contraseña incorrecta');
    });
});
