//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var peliculaController = require('./controladores/peliculaController');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas', peliculaController.getFilm);
app.get('/generos', peliculaController.getGenero);
app.get('/peliculas/recomendacion', peliculaController.getRecomendarFilm);
app.get('/peliculas/:id', peliculaController.getInfoFilm);



//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

