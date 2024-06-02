package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	_ "github.com/lib/pq"
)

type Usuario struct {
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	FechaNacimiento string `json:"fechaNacimiento"`
	NombreUsuario   string `json:"nombreUsuario"`
	Password        string `json:"password"`
}

// Estructura para los resultados con etiquetas JSON
var resultados []struct {
	AutoID      int `json:"auto_id"`
	PrecioFinal int `json:"precio_final"`
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

var db *sql.DB
var nuevoUsuario = Usuario{
	Nombre:          "Nombre de prueba",
	Apellido:        "Apellido de prueba",
	FechaNacimiento: "2000-01-01",
	NombreUsuario:   "usuarioDePrueba",
	Password:        "contraseñaDePrueba",
}

func main() {
	var err error
	psqlconn := fmt.Sprintf("host=db port=5432 user=%s password=%s dbname=%s sslmode=disable", "postgres", "postgres", "test_db")
	db, err = sql.Open("postgres", psqlconn)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	http.HandleFunc("/Usuario", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == http.MethodOptions {
			return
		}

		switch r.Method {
		case http.MethodGet:
			// Manejar método GET
			nombreUsuario := r.URL.Query().Get("nombreUsuario")
			if nombreUsuario == "" {
				http.Error(w, "Nombre de usuario no proporcionado", http.StatusBadRequest)
				return
			}

			row := db.QueryRow("SELECT nombre, apellido, fecha_nacimiento, password FROM usuarios WHERE nombre_usuario = $1", nombreUsuario)
			var u Usuario
			err := row.Scan(&u.Nombre, &u.Apellido, &u.FechaNacimiento, &u.Password)
			if err != nil {
				if err == sql.ErrNoRows {
					http.Error(w, "Usuario no encontrado", http.StatusNotFound)
				} else {
					http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
				}
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(u)
		default:
			// Manejar otros métodos
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/Registro", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == http.MethodOptions {
			return
		}

		switch r.Method {
		case http.MethodGet:
			// Manejar método GET
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(nuevoUsuario)
		case http.MethodPost:
			// Manejar método POST
			var u Usuario
			err := json.NewDecoder(r.Body).Decode(&u)
			if err != nil {
				http.Error(w, "Error reading request body", http.StatusInternalServerError)
				return
			}
			_, err = db.Exec("INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, nombre_usuario, password) VALUES ($1, $2, $3, $4, $5)", u.Nombre, u.Apellido, u.FechaNacimiento, u.NombreUsuario, u.Password)
			if err != nil {
				http.Error(w, "Error inserting data into the database", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(u)
		default:
			// Manejar otros métodos
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/Autos", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == http.MethodOptions {
			return
		}

		switch r.Method {
		case http.MethodGet:
			// Manejar método GET
			queryValues := r.URL.Query()
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
				http.Error(w, "Error querying the database", http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			var autos []Auto
			for rows.Next() {
				var a Auto
				err = rows.Scan(&a.ID, &a.Disponible, &a.Nombre, &a.Tipo, &a.Color, &a.Modelo, &a.Marca, &a.Transmision, &a.Motor, &a.Precio, &a.ImagenLink)
				if err != nil {
					http.Error(w, "Error scanning row", http.StatusInternalServerError)
					return
				}
				autos = append(autos, a)
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(autos)
		case http.MethodPost:
			// Parsear el cuerpo de la solicitud para obtener los datos del auto
			var auto Auto
			err := json.NewDecoder(r.Body).Decode(&auto)
			if err != nil {
				http.Error(w, "Error al decodificar el cuerpo de la solicitud", http.StatusBadRequest)
				return
			}

			// Preparar la sentencia SQL para actualizar la disponibilidad del auto
			stmt, err := db.Prepare("UPDATE autos SET disponible = $1 WHERE id = $2")
			if err != nil {
				http.Error(w, "Error al preparar la consulta", http.StatusInternalServerError)
				return
			}
			defer stmt.Close()

			// Ejecutar la sentencia SQL con los datos proporcionados
			_, err = stmt.Exec(auto.Disponible, auto.ID)
			if err != nil {
				http.Error(w, "Error al actualizar la base de datos", http.StatusInternalServerError)
				return
			}

			// Enviar una respuesta de éxito
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "Auto actualizado con éxito")

		default:
			// Manejar otros métodos
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/Reservas", func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if req.Method == http.MethodOptions {
			return
		}

		switch req.Method {
		case http.MethodGet:
			// Manejar método GET
			usuario := req.URL.Query().Get("usuario")
			if usuario == "" {
				http.Error(w, "Usuario no proporcionado", http.StatusBadRequest)
				return
			}

			rows, err := db.Query("SELECT * FROM reservas WHERE usuario = $1", usuario)
			if err != nil {
				http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			var reservas []Reserva
			for rows.Next() {
				var r Reserva
				err = rows.Scan(&r.ID, &r.Usuario, &r.AutoID, &r.Seguros, &r.AsistenciaCarretera, &r.SillaBebes, &r.EquipoLujo, &r.PrecioFinal)
				if err != nil {
					http.Error(w, "Error al escanear la fila", http.StatusInternalServerError)
					return
				}
				reservas = append(reservas, r)
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(reservas)
		case http.MethodPost:
			// Manejar método POST
			var r Reserva
			err := json.NewDecoder(req.Body).Decode(&r)
			if err != nil {
				http.Error(w, "Error al leer el cuerpo de la solicitud", http.StatusInternalServerError)
				return
			}
			_, err = db.Exec("INSERT INTO reservas (usuario, auto_id, seguros, asistencia_carretera, silla_bebes, equipo_lujo, precio_final) VALUES ($1, $2, $3, $4, $5, $6, $7)", r.Usuario, r.AutoID, r.Seguros, r.AsistenciaCarretera, r.SillaBebes, r.EquipoLujo, r.PrecioFinal)
			if err != nil {
				http.Error(w, "Error al insertar datos en la base de datos", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(r)
		case http.MethodDelete:
			// Manejar método DELETE
			id := req.URL.Query().Get("id")
			if id == "" {
				http.Error(w, "ID no proporcionado", http.StatusBadRequest)
				return
			}

			_, err := db.Exec("DELETE FROM reservas WHERE id = $1", id)
			if err != nil {
				http.Error(w, "Error al eliminar la fila en la base de datos", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusNoContent)
		default:
			// Manejar otros métodos
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/Informe", func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if req.Method == http.MethodOptions {
			return
		}

		if req.Method != http.MethodGet {
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
			return
		}

		// Manejar método GET
		usuario := req.URL.Query().Get("usuario")
		if usuario == "" {
			http.Error(w, "Usuario no proporcionado", http.StatusBadRequest)
			return
		}

		// Consulta SQL modificada para seleccionar solo auto_id y precio_final
		rows, err := db.Query("SELECT auto_id, precio_final FROM reservas WHERE usuario = $1", usuario)
		if err != nil {
			http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		// Estructura para los resultados
		var resultados []struct {
			AutoID      int `json:"auto_id"`
			PrecioFinal int `json:"precio_final"`
		}

		// Escanear y almacenar los resultados
		for rows.Next() {
			var r struct {
				AutoID      int `json:"auto_id"`
				PrecioFinal int `json:"precio_final"`
			}
			err = rows.Scan(&r.AutoID, &r.PrecioFinal)
			if err != nil {
				http.Error(w, "Error al escanear la fila", http.StatusInternalServerError)
				return
			}
			resultados = append(resultados, r)
		}

		// Establecer el tipo de contenido y enviar la respuesta
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resultados)
	})

	http.ListenAndServe(":8080", nil)
}
