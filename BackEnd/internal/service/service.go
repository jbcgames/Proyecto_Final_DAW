package service

import (
	"database/sql"
	"net/url"

	"github.com/jbcgames/Proyecto_Final_DAW/internal/models"
	"github.com/jbcgames/Proyecto_Final_DAW/internal/repository"
)

func GetUsuario(db *sql.DB, nombreUsuario string) (models.Usuario, error) {
	return repository.GetUsuario(db, nombreUsuario)
}

func CreateUsuario(db *sql.DB, u models.Usuario) error {
	return repository.CreateUsuario(db, u)
}

func GetAutos(db *sql.DB, queryValues url.Values) ([]models.Auto, error) {
	return repository.GetAutos(db, queryValues)
}

func UpdateAutoDisponibilidad(db *sql.DB, auto models.Auto) error {
	return repository.UpdateAutoDisponibilidad(db, auto)
}

func GetReservas(db *sql.DB, usuario string) ([]models.Reserva, error) {
	return repository.GetReservas(db, usuario)
}

func CreateReserva(db *sql.DB, r models.Reserva) error {
	return repository.CreateReserva(db, r)
}

func DeleteReserva(db *sql.DB, id string) error {
	return repository.DeleteReserva(db, id)
}

func GetInforme(db *sql.DB, usuario string) ([]struct {
	AutoID      int `json:"auto_id"`
	PrecioFinal int `json:"precio_final"`
}, error) {
	return repository.GetInforme(db, usuario)
}
