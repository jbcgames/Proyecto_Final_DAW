package models

type Usuario struct {
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	FechaNacimiento string `json:"fechaNacimiento"`
	NombreUsuario   string `json:"nombreUsuario"`
	Password        string `json:"password"`
}

type Reserva struct {
	ID                  int    `json:"id"`
	Usuario             string `json:"usuario"`
	AutoID              int    `json:"auto_id"`
	Seguros             bool   `json:"seguros"`
	AsistenciaCarretera bool   `json:"asistencia_carretera"`
	SillaBebes          bool   `json:"silla_bebes"`
	EquipoLujo          bool   `json:"equipo_lujo"`
	PrecioFinal         int    `json:"precio_final"`
}

type Auto struct {
	ID          int    `json:"id"`
	Disponible  bool   `json:"disponible"`
	Nombre      string `json:"nombre"`
	Tipo        string `json:"tipo"`
	Color       string `json:"color"`
	Modelo      string `json:"modelo"`
	Marca       string `json:"marca"`
	Transmision string `json:"transmision"`
	Motor       string `json:"motor"`
	Precio      int    `json:"precio"`
	ImagenLink  string `json:"imagen_link"`
}
