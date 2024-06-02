package main

import "database/sql"

func GetUsuario(db *sql.DB, nombreUsuario string) (Usuario, error) {
	return GetUserByUsername(db, nombreUsuario)
}

func RegistrarUsuario(db *sql.DB, u Usuario) error {
	return CreateUser(db, u)
}

func ListarAutos(db *sql.DB, queryStr string, params []interface{}) ([]Auto, error) {
	return GetAutos(db, queryStr, params)
}

func ActualizarDisponibilidadAuto(db *sql.DB, autoID int, disponible bool) error {
	return UpdateAutoAvailability(db, autoID, disponible)
}

func ListarReservas(db *sql.DB, usuario string) ([]Reserva, error) {
	return GetReservasByUsuario(db, usuario)
}

func CrearReserva(db *sql.DB, r Reserva) error {
	return CreateReserva(db, r)
}

func EliminarReserva(db *sql.DB, id int) error {
	return DeleteReserva(db, id)
}

func ObtenerInforme(db *sql.DB, usuario string) ([]struct {
	AutoID      int `json:"auto_id"`
	PrecioFinal int `json:"precio_final"`
}, error) {
	return GetInformeByUsuario(db, usuario)
}
