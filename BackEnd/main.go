package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

var db *sql.DB

func main() {
	var err error
	psqlconn := fmt.Sprintf("host=db port=5432 user=%s password=%s dbname=%s sslmode=disable", "postgres", "postgres", "test_db")
	db, err = sql.Open("postgres", psqlconn)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	http.HandleFunc("/Usuario", handlers.UsuarioHandler(db))
	http.HandleFunc("/Registro", handlers.RegistroHandler(db))
	http.HandleFunc("/Autos", handlers.AutosHandler(db))
	http.HandleFunc("/Reservas", handlers.ReservasHandler(db))
	http.HandleFunc("/Informe", handlers.InformeHandler(db))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
