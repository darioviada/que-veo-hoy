CREATE DATABASE que_peli_veo; 

USE que_peli_veo;

CREATE TABLE pelicula(
 	id int NOT NULL auto_increment,
 	titulo varchar(100) NOT NULL,
 	duracion int NOT NULL,
 	director varchar(400) NOT NULL,
 	anio int NOT NULL,
 	fecha_lanzamiento date NOT NULL,
 	puntuacion int ,
 	poster varchar(300) NOT NULL,
    trama varchar(700) NOT NULL, 
 	PRIMARY KEY (id)
);

CREATE TABLE genero(
 	id int NOT NULL auto_increment,
 	nombre varchar(30) NOT NULL,
 	PRIMARY KEY (id)
);

ALTER TABLE pelicula
ADD COLUMN genero_id int;


CREATE TABLE actor(
 	id int NOT NULL auto_increment,
 	nombre varchar(70) NOT NULL,
 	PRIMARY KEY (id)
);

CREATE TABLE actor_pelicula(
 	id int NOT NULL auto_increment,
 	actor_id int NOT NULL,
	pelicula_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(actor_id) REFERENCES actor (id),
	FOREIGN KEY(pelicula_id) REFERENCES pelicula (id)
 	
);