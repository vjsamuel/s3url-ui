package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	port := flag.String("p", "8080", "port to serve on")
	directory := flag.String("d", "./webapp", "the directory of static file to host")
	flag.Parse()

	r := mux.NewRouter()

	r.Path("/go/{surl}").HandlerFunc(redirect).Methods("GET")
	r.Methods("GET").Path("/_ah/health").HandlerFunc(healthCheck)
	fs := http.FileServer(http.Dir(*directory))
        r.Methods("GET").PathPrefix("/").Handler(fs)
	http.ListenAndServe(":8080", r)
	log.Printf("Serving %s on HTTP port: %s\n", *directory, *port)
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}

func redirect(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	surl := vars["surl"]
	http.Redirect(w, r, "https://api.s3url.vjsamuel.me/api/v1/url/" + surl, 301)
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}
