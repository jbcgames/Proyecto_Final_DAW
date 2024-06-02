package repository

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/jbcgames/Proyecto_Final_DAW/internal/models"
)

func GetUsuario(db *sql.DB, nombreUsuario string) (models.Usuario, error) {
	var u models.Usuario
	row := db.QueryRow("SELECT nombre, apellido, fecha_nacimiento, password FROM usuarios WHERE nombre_usuario = $1", nombreUsuario)
	err := row.Scan(&u.Nombre, &u.Apellido, &u.FechaNacimiento, &u.Password)
	return u, err
}

func CreateUsuario(db *sql.DB, u models.Usuario) error {
	_, err := db.Exec("INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, nombre_usuario, password) VALUES ($1, $2, $3, $4, $5)",
		u.Nombre, u.Apellido, u.FechaNacimiento, u.NombreUsuario, u.Password)
	return err
}

func GetAutos(db *sql.DB, queryValues map[string][]string) ([]models.Auto, error) {
	queryStr := "SELECT * FROM autos"
	params := []interface{}{}

	if len(queryValues) > 0 {
		filters := []string{}
		for key, value := range queryValues {
			if key == "precio" {
				filters = append(filters, fmt.Sprintf("%s < $%d", key, len(params)+1))
			} else {
				filters = append(filters, fmt.Sprintf("%s = $%d", key, len(params)+1))
			}
			params = append(params, value[0])
		}
		queryStr += " WHERE " + strings.Join(filters, " AND ")
	}

	rows, err := db.Query(queryStr, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var autos []models.Auto
	for rows.Next() {
		var a models.Auto
		err = rows.Scan(&a.ID, &a.Disponible, &a.Nombre, &a.Tipo, &a.Color, &a.Modelo, &a.Marca, &a.Transmision, &a.Motor, &a.Precio, &a.ImagenLink)
		if err != nil {
			return nil, err
		}
		autos = append(autos, a)
	}
	return autos, nil
}

func UpdateAutoDisponibilidad(db *sql.DB, auto models.Auto) error {
	stmt, err := db.Prepare("UPDATE autos SET disponible = $1 WHERE id = $2")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(auto.Disponible, auto.ID)
	return err
}

func GetReservas(db *sql.DB, usuario string) ([]models.Reserva, error) {
	rows, err := db.Query("SELECT * FROM reservas WHERE usuario = $1", usuario)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservas []models.Reserva
	for rows.Next() {
		var r models.Reserva
		err = rows.Scan(&r.ID, &r.Usuario, &r.AutoID, &r.Seguros, &r.AsistenciaCarretera, &r.SillaBebes, &r.EquipoLujo, &r.PrecioFinal)
		if err != nil {
			return nil, err
		}
		reservas = append(reservas, r)
	}
	return reservas, nil
}

func CreateReserva(db *sql.DB, r models.Reserva) error {
	_, err := db.Exec("INSERT INTO reservas (usuario, auto_id, seguros, asistencia_carretera, silla_bebes, equipo_lujo, precio_final) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		r.Usuario, r.AutoID, r.Seguros, r.AsistenciaCarretera, r.SillaBebes, r.EquipoLujo, r.PrecioFinal)
	return err
}

func DeleteReserva(db *sql.DB, id string) error {
	_, err := db.Exec("DELETE FROM reservas WHERE id = $1", id)
	return err
}

func GetInforme(db *sql.DB, usuario string) ([]struct {
	AutoID      int `json:"auto_id"`
	PrecioFinal int `json:"precio_final"`
}, error) {
	rows, err := db.Query("SELECT auto_id, precio_final FROM reservas WHERE usuario = $1", usuario)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var resultados []struct {
		AutoID      int `json:"auto_id"`
		PrecioFinal int `json:"precio_final"`
	}

	for rows.Next() {
		var r struct {
			AutoID      int `json:"auto_id"`
			PrecioFinal int `json:"precio_final"`
		}
		err = rows.Scan(&r.AutoID, &r.PrecioFinal)
		if err != nil {
			return nil, err
		}
		resultados = append(resultados, r)
	}
	return resultados, nil
}
