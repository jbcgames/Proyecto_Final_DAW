package main

import (
	"encoding/json"
	"net/http"
)

type Mensaje struct {
	Texto string `json:"texto"`
}
type Usuario struct {
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
	FechaNacimiento string `json:"fechaNacimiento"`
	NombreUsuario   string `json:"nombreUsuario"`
	Password        string `json:"password"`
}

var nuevoUsuario Usuario

func main() {
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

			err := json.NewDecoder(r.Body).Decode(&nuevoUsuario)
			if err != nil {
				http.Error(w, "Error reading request body", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(nuevoUsuario)
		default:
			// Manejar otros métodos
			http.Error(w, "Método no soportado", http.StatusMethodNotAllowed)
		}
	})

	http.ListenAndServe(":8080", nil)
}
