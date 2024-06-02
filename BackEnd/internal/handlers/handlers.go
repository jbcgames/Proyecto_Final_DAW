package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/jbcgames/Proyecto_Final_DAW/BackEnd/internal/models"
	"github.com/jbcgames/Proyecto_Final_DAW/BackEnd/internal/service"
)

func UsuarioHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == http.MethodOptions {
			return
		}

		switch r.Method {
		case http.MethodGet:
			nombreUsuario := r.URL.Query().Get("nombreUsuario")
			if nombreUsuario == "" {
				http.Error(w, "Nombre de usuario no proporcionado", http.StatusBadRequest)
				return
			}

			u, err := service.GetUsuario(db, nombreUsuario)
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
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	}
}

func RegistroHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == http.MethodOptions {
			return
		}

		switch r.Method {
		case http.MethodGet:
			nuevoUsuario := models.Usuario{
				Nombre:          "Nombre de prueba",
				Apellido:        "Apellido de prueba",
				FechaNacimiento: "2000-01-01",
				NombreUsuario:   "usuarioDePrueba",
				Password:        "contraseñaDePrueba",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(nuevoUsuario)
		case http.MethodPost:
			var u models.Usuario
			err := json.NewDecoder(r.Body).Decode(&u)
			if err != nil {
				http.Error(w, "Error reading request body", http.StatusInternalServerError)
				return
			}
			err = service.RegistrarUsuario(db, u)
			if err != nil {
				http.Error(w, "Error inserting data into the database", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(u)
		default:
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	}
}

func AutosHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == http.MethodOptions {
			return
		}

		switch r.Method {
		case http.MethodGet:
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

			autos, err := service.ListarAutos(db, queryStr, params)
			if err != nil {
				http.Error(w, "Error querying the database", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(autos)
		case http.MethodPost:
			var auto models.Auto
			err := json.NewDecoder(r.Body).Decode(&auto)
			if err != nil {
				http.Error(w, "Error al decodificar el cuerpo de la solicitud", http.StatusBadRequest)
				return
			}

			err = service.ActualizarDisponibilidadAuto(db, auto.ID, auto.Disponible)
			if err != nil {
				http.Error(w, "Error al actualizar la base de datos", http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "Auto actualizado con éxito")
		default:
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	}
}

func ReservasHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if req.Method == http.MethodOptions {
			return
		}

		switch req.Method {
		case http.MethodGet:
			usuario := req.URL.Query().Get("usuario")
			if usuario == "" {
				http.Error(w, "Usuario no proporcionado", http.StatusBadRequest)
				return
			}

			reservas, err := service.ListarReservas(db, usuario)
			if err != nil {
				http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(reservas)
		case http.MethodPost:
			var r models.Reserva
			err := json.NewDecoder(req.Body).Decode(&r)
			if err != nil {
				http.Error(w, "Error al leer el cuerpo de la solicitud", http.StatusInternalServerError)
				return
			}
			err = service.CrearReserva(db, r)
			if err != nil {
				http.Error(w, "Error al insertar datos en la base de datos", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(r)
		case http.MethodDelete:
			idStr := req.URL.Query().Get("id")
			if idStr == "" {
				http.Error(w, "ID no proporcionado", http.StatusBadRequest)
				return
			}

			id, err := strconv.Atoi(idStr)
			if err != nil {
				http.Error(w, "ID inválido", http.StatusBadRequest)
				return
			}

			err = service.EliminarReserva(db, id)
			if err != nil {
				http.Error(w, "Error al eliminar la fila en la base de datos", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusNoContent)
		default:
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	}
}

func InformeHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
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

		usuario := req.URL.Query().Get("usuario")
		if usuario == "" {
			http.Error(w, "Usuario no proporcionado", http.StatusBadRequest)
			return
		}

		resultados, err := service.ObtenerInforme(db, usuario)
		if err != nil {
			http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resultados)
	}
}
