package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jbcgames/Proyecto_Final_DAW/internal/handlers"
	_ "github.com/lib/pq"
)

func main() {
	var err error

	psqlconn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"))

	db, err := sql.Open("postgres", psqlconn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	http.HandleFunc("/Usuario", handlers.HandleUsuario(db))
	http.HandleFunc("/Registro", handlers.HandleRegistro(db))
	http.HandleFunc("/Autos", handlers.HandleAutos(db))
	http.HandleFunc("/Reservas", handlers.HandleReservas(db))
	http.HandleFunc("/Informe", handlers.HandleInforme(db))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
