var nombreField = document.querySelector('.Nombre');
var apellidoField = document.querySelector('.Apellido');
var fechaNacimientoField = document.querySelector('.FechaNacimiento');
var nombreUsuarioField = document.querySelector('.NombreUsuario');
var passwordField = document.querySelector('.Password');
var confirmPasswordField = document.querySelector('.ConfirmPassword');
var registerButton = document.querySelector('.Registrar');
registerButton.style.backgroundColor = "#8C8C8C";

function checkPasswords() {
    var nombre = nombreField.value;
    var apellido = apellidoField.value;
    var fechaNacimiento = fechaNacimientoField.value;
    var nombreUsuario = nombreUsuarioField.value;
    var password = passwordField.value;
    var confirmPassword = confirmPasswordField.value;

    var regex = /^[a-zA-Z0-9]+$/;

    if (password !== confirmPassword || !nombre || !apellido || !fechaNacimiento || !nombreUsuario || !password || !regex.test(nombreUsuario) || !regex.test(password)) {
        registerButton.style.backgroundColor = "#8C8C8C";
    } else if (password.length < 8 || nombreUsuario.length < 8) {
        registerButton.style.backgroundColor = "#8C8C8C";
    } else {
        registerButton.style.backgroundColor = "#4CAF50";
    }
}

nombreField.addEventListener('input', checkPasswords);
apellidoField.addEventListener('input', checkPasswords);
fechaNacimientoField.addEventListener('input', checkPasswords);
nombreUsuarioField.addEventListener('input', checkPasswords);
passwordField.addEventListener('input', checkPasswords);
confirmPasswordField.addEventListener('input', checkPasswords);

registerButton.addEventListener('click', function() {
    var nombre = nombreField.value;
    var apellido = apellidoField.value;
    var fechaNacimiento = fechaNacimientoField.value;
    var nombreUsuario = nombreUsuarioField.value;
    var password = passwordField.value;
    var confirmPassword = confirmPasswordField.value;


    var regex = /^[a-zA-Z0-9]+$/;

    if (!nombre || !apellido || !fechaNacimiento || !nombreUsuario || !password) {
        alert('Completa todos los campos');
        return;
    } else if (password !== confirmPassword) {
        alert('Las Contraseñas no coinciden');
        return;
    } else if (nombreUsuario.length < 8 || password.length < 8) {
        alert('El Nombre de usuario y la Contraseña deben tener al menos 8 caracteres');
        return;
    } else if (!regex.test(nombreUsuario) || !regex.test(password)) {
        alert('El Nombre de usuario y la Contraseña no pueden contener caracteres especiales');
        return;
    }


    fetch(`http://localhost:8080/Usuario?nombreUsuario=${nombreUsuario}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.status === 404) {

            var data = {
                nombre: nombre,
                apellido: apellido,
                fechaNacimiento: fechaNacimiento,
                nombreUsuario: nombreUsuario,
                password: password
            };
            console.log(data)
            fetch('http://localhost:8080/Registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });
            alert('Registro Creado Exitosamente')
            window.location.href = 'index.html';
        } else if (response.ok) {

            alert('El nombre de usuario ya existe');
        } else {

            console.error('Error:', response.status);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
