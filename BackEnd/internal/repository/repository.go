package repository

import (
	"database/sql"

	"github.com/jbcgames/Proyecto_Final_DAW/BackEnd/internal/models"
)

func GetUsuario(db *sql.DB, nombreUsuario string) (*models.Usuario, error) {
	query := `SELECT * FROM usuarios WHERE nombreUsuario=$1`
	row := db.QueryRow(query, nombreUsuario)

	var u models.Usuario
	err := row.Scan(&u.ID, &u.Nombre, &u.Apellido, &u.FechaNacimiento, &u.NombreUsuario, &u.Password)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func RegistrarUsuario(db *sql.DB, u models.Usuario) error {
	query := `INSERT INTO usuarios (nombre, apellido, fechaNacimiento, nombreUsuario, password) VALUES ($1, $2, $3, $4, $5)`
	_, err := db.Exec(query, u.Nombre, u.Apellido, u.FechaNacimiento, u.NombreUsuario, u.Password)
	return err
}

func ListarAutos(db *sql.DB, queryStr string, params []interface{}) ([]models.Auto, error) {
	rows, err := db.Query(queryStr, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var autos []models.Auto
	for rows.Next() {
		var auto models.Auto
		err := rows.Scan(&auto.ID, &auto.Marca, &auto.Modelo, &auto.Anio, &auto.Precio, &auto.Disponible)
		if err != nil {
			return nil, err
		}
		autos = append(autos, auto)
	}
	return autos, nil
}

func ActualizarDisponibilidadAuto(db *sql.DB, id int, disponible bool) error {
	query := `UPDATE autos SET disponible=$1 WHERE id=$2`
	_, err := db.Exec(query, disponible, id)
	return err
}

func ListarReservas(db *sql.DB, usuario string) ([]models.Reserva, error) {
	query := `SELECT * FROM reservas WHERE usuario=$1`
	rows, err := db.Query(query, usuario)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservas []models.Reserva
	for rows.Next() {
		var reserva models.Reserva
		err := rows.Scan(&reserva.ID, &reserva.Usuario, &reserva.AutoID, &reserva.FechaIni, &reserva.FechaFin, &reserva.Total)
		if err != nil {
			return nil, err
		}
		reservas = append(reservas, reserva)
	}
	return reservas, nil
}

func CrearReserva(db *sql.DB, r models.Reserva) error {
	query := `INSERT INTO reservas (usuario, auto_id, fecha_ini, fecha_fin, total) VALUES ($1, $2, $3, $4, $5)`
	_, err := db.Exec(query, r.Usuario, r.AutoID, r.FechaIni, r.FechaFin, r.Total)
	return err
}

func EliminarReserva(db *sql.DB, id int) error {
	query := `DELETE FROM reservas WHERE id=$1`
	_, err := db.Exec(query, id)
	return err
}

func ObtenerInforme(db *sql.DB, usuario string) ([]map[string]interface{}, error) {
	query := `SELECT autos.marca, autos.modelo, autos.anio, reservas.fecha_ini, reservas.fecha_fin 
			  FROM reservas 
			  JOIN autos ON reservas.auto_id = autos.id 
			  WHERE reservas.usuario=$1`
	rows, err := db.Query(query, usuario)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var resultados []map[string]interface{}
	for rows.Next() {
		var marca, modelo string
		var anio int
		var fechaIni, fechaFin string
		err := rows.Scan(&marca, &modelo, &anio, &fechaIni, &fechaFin)
		if err != nil {
			return nil, err
		}
		resultado := map[string]interface{}{
			"marca":    marca,
			"modelo":   modelo,
			"anio":     anio,
			"fechaIni": fechaIni,
			"fechaFin": fechaFin,
		}
		resultados = append(resultados, resultado)
	}
	return resultados, nil
}
