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

type Auto struct {
	ID          int    `json:"id"`
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
				err = rows.Scan(&a.ID, &a.Nombre, &a.Tipo, &a.Color, &a.Modelo, &a.Marca, &a.Transmision, &a.Motor, &a.Precio, &a.ImagenLink)
				if err != nil {
					http.Error(w, "Error scanning row", http.StatusInternalServerError)
					return
				}
				autos = append(autos, a)
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(autos)
		default:
			// Manejar otros métodos
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	})

	http.ListenAndServe(":8080", nil)
}
