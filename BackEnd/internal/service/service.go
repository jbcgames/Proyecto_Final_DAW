package service

import (
	"database/sql"

	"github.com/jbcgames/Proyecto_Final_DAW/BackEnd/internal/models"
	"github.com/jbcgames/Proyecto_Final_DAW/BackEnd/internal/repository"
)

func GetUsuario(db *sql.DB, nombreUsuario string) (*models.Usuario, error) {
	return repository.GetUsuario(db, nombreUsuario)
}

func RegistrarUsuario(db *sql.DB, u models.Usuario) error {
	return repository.RegistrarUsuario(db, u)
}

func ListarAutos(db *sql.DB, queryStr string, params []interface{}) ([]models.Auto, error) {
	return repository.ListarAutos(db, queryStr, params)
}

func ActualizarDisponibilidadAuto(db *sql.DB, id int, disponible bool) error {
	return repository.ActualizarDisponibilidadAuto(db, id, disponible)
}

func ListarReservas(db *sql.DB, usuario string) ([]models.Reserva, error) {
	return repository.ListarReservas(db, usuario)
}

func CrearReserva(db *sql.DB, r models.Reserva) error {
	return repository.CrearReserva(db, r)
}

func EliminarReserva(db *sql.DB, id int) error {
	return repository.EliminarReserva(db, id)
}

func ObtenerInforme(db *sql.DB, usuario string) ([]map[string]interface{}, error) {
	return repository.ObtenerInforme(db, usuario)
}
