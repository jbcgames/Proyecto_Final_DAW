package models

type Usuario struct {
	ID              int    `json:"id"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	FechaNacimiento string `json:"fechaNacimiento"`
	NombreUsuario   string `json:"nombreUsuario"`
	Password        string `json:"password"`
}

type Auto struct {
	ID         int     `json:"id"`
	Marca      string  `json:"marca"`
	Modelo     string  `json:"modelo"`
	Anio       int     `json:"anio"`
	Precio     float64 `json:"precio"`
	Disponible bool    `json:"disponible"`
}

type Reserva struct {
	ID       int     `json:"id"`
	Usuario  string  `json:"usuario"`
	AutoID   int     `json:"auto_id"`
	FechaIni string  `json:"fecha_ini"`
	FechaFin string  `json:"fecha_fin"`
	Total    float64 `json:"total"`
}
