var connection = require('../lib/conexionbd');

function getFilm(req, res) {
    let sql = 'SELECT * FROM pelicula';
    let sql_;
    let titulo = req.query.titulo;
    let anio = req.query.anio;
    let genero = req.query.genero;
    let orden = req.query.columna_orden;
    let tipoOrden = req.query.tipo_orden;
    let pagina = req.query.pagina;
    let cantidad = req.query.cantidad;
    let total;
    //FILTROS 
    if (titulo && anio && genero) {
        sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND anio = ${anio} AND genero_id = ${genero}`;
        console.log(sql);
    } else if (!titulo && anio && genero) {
        sql += ` WHERE anio = ${anio} AND genero_id = ${genero}`;
    } else if (!anio && titulo && genero) {
        sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND genero_id = ${genero}`;
    } else if (!genero && anio && titulo) {
        sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND anio =  ${anio}`;
    } else if (titulo) {
        sql += ` WHERE titulo LIKE \'\%${titulo}\%\'`;
    } else if (anio) {
        sql += ` WHERE anio = ${anio}`;
    } else if (genero) {
        sql += ` WHERE genero_id = ${genero}`;
    }
    //ORDEN
    if (orden === 'anio') {
        sql += ` ORDER BY fecha_lanzamiento ${tipoOrden}`;
    } else if (orden === 'puntuacion') {
        sql += ` ORDER BY puntuacion ${tipoOrden}`;
    } else if (orden === 'duracion') {
        sql += ` ORDER BY duracion ${tipoOrden}`;
    }
    sql_ = sql;
    //PAGINACIÓN
    sql += ` LIMIT ${(pagina - 1) * cantidad},${cantidad}`;

    connection.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        connection.query(sql_, function (error_, resultado_, fields_) {
            if (error_) {
                console.log("Hubo un error en la consulta", error_.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            total = resultado_.length;

            var response = {
                'peliculas': resultado,
                'total': total

            };
            res.send(JSON.stringify(response));
        });
    });
}
function getGenero(req, res) {
    var sql = "SELECT * FROM genero";
    connection.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Ha ocurrido un error en la consulta", error.message);
            return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        var response = {
            'generos': resultado

        };
        res.send(JSON.stringify(response));
    });
}

function getInfoFilm(req, res) {
    if (req.params.id !== 'recomendacion') {
      let id = req.params.id;      
    

      
      let sql = `SELECT * FROM pelicula INNER JOIN genero ON genero_id = genero.id WHERE pelicula.id = ${id}`
      console.log(`id de película: ${id}`);

      connection.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        } 
        sql = `SELECT * FROM actor_pelicula INNER JOIN actor ON actor_id = actor.id WHERE pelicula_id = ${id}`
        connection.query(sql, function(error_, resultado_, fields_) {
          if (error) {
              console.log("Hubo un error en la consulta", error.message);
              return res.status(404).send("Hubo un error en la consulta");
          } 
          var response = {
              'pelicula': resultado[0],
              'genero': resultado[0].nombre,
              'actores': resultado_         
          };
      
          res.send(JSON.stringify(response));
        }); 
      });
  }
}

function getRecomendarFilm(req, res){
    var genero = req.query.genero;
    var anioInicio = req.query.anio_inicio + "-01-01";
    var anioFin = req.query.anio_fin + "-01-01";
    var puntuacion = req.query.puntuacion;
    
    var sql = createRecommendation(genero, anioInicio, anioFin, puntuacion);
    
    connection.query(sql, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'peliculas': resultado
      };
      res.send(JSON.stringify(response));
    });
  }
  
  function createRecommendation(genero, anioInicio, anioFin, puntuacion){
    var query = '';
    if (genero != undefined && anioInicio != undefined && anioFin != undefined) {
      var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
    }else if(anioInicio != undefined && anioFin != undefined) {
      var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
    }else if(genero != undefined && puntuacion != undefined){
      var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND p.puntuacion >= '" + puntuacion + "'";
    }else if(puntuacion != undefined){
      var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE  p.puntuacion >= '" + puntuacion + "'";
    }else {
      var query = "SELECT * FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "'";
    }
    return query;
  }
  

module.exports = {
    getFilm: getFilm,
    getGenero: getGenero,
    getInfoFilm: getInfoFilm,
    getRecomendarFilm: getRecomendarFilm,
};