--Borre las Tablas, sí estas ya existen:
DROP TABLE IF EXISTS usuario_meta, usuario, meta, producto, usuario_meta_valor,  cliente;

--A) TABLA DE USUARIO_META:
CREATE TABLE usuario_meta( 
    id_um            NUMERIC      NOT NULL PRIMARY KEY, 
    id_meta          NUMERIC      NOT NULL,             
    id_usuario       NUMERIC      NOT NULL
);

--B) TABLA DE USUARIO:
CREATE TABLE usuario( 
    id_usuario   NUMERIC        NOT NULL PRIMARY KEY, 
    nombre       VARCHAR (250)  NOT NULL,             
    email        VARCHAR (150)  NOT NULL,             
    clave        VARCHAR (25)   NOT NULL            
);

--C) TABLA DE META:
CREATE TABLE meta( 
    id_meta         NUMERIC       NOT NULL PRIMARY KEY, 
    descripcion     VARCHAR (750) NOT NULL,
    valor_esperado  NUMERIC       NOT NULL,             
    fecha_limite    DATE          NOT NULL,
    id_producto     NUMERiC       NOT NULL
);

--D) TABLA DE PRODUCTO:
CREATE TABLE producto( 
    id_producto      NUMERIC       NOT NULL PRIMARY KEY, 
    descripcion      VARCHAR (750) NOT NULL                 
);

--E) TABLA DEL USUARIO_META_VALOR:
CREATE TABLE usuario_meta_valor( 
    id_umv     NUMERIC NOT NULL PRIMARY KEY, 
    id_um      NUMERIC NOT NULL,             
    id_cliente NUMERIC NOT NULL,
    valor      NUMERIC NOT NULL    
);

--F) TABLA DEL CLIENTE:
CREATE TABLE cliente( 
    id_cliente     NUMERIC       NOT NULL PRIMARY KEY, 
    nombre         VARCHAR (250) NOT NULL,
    email          VARCHAR (150) NOT NULL,             
    telefono       VARCHAR (25)  NOT NULL	
);

--LLAVES FORÁNEAS DE LA BASE DE DATOS--

--A) TABLA USUARIO_META:

--1. CONVERTIR LA VARIABLE "id_meta" EN LA TABLA "meta" EN UNA LLAVE FORÁNEA DE LA TABLA 'usuario_meta'
ALTER TABLE usuario_meta ADD CONSTRAINT id_meta foreign key (id_meta) references meta;

--2. CONVERTIR LA VARIABLE "id_usuario" EN LA TABLA "usuario" EN UNA LLAVE FORÁNEA DE LA 'usuario_meta'
ALTER TABLE usuario_meta ADD CONSTRAINT id_usuario foreign key (id_usuario) references usuario;

--C) TABLA META:

--1. CONVERTIR LA VARIABLE "id_producto" EN LA TABLA "producto" EN UNA LLAVE FORÁNEA DE LA TABLA 'meta'
ALTER TABLE meta ADD CONSTRAINT id_producto foreign key (id_producto) references producto;

--E) TABLA USUARIO_META_VALOR:

--1. CONVERTIR LA VARIABLE "id_um" EN LA TABLA "usuario_meta" EN UNA LLAVE FORÁNEA DE LA TABLA 'usuario_meta_valor'
ALTER TABLE usuario_meta_valor ADD CONSTRAINT id_um foreign key (id_um) references usuario_meta;

--2. CONVERTIR LA VARIABLE "id_cliente" EN LA TABLA "cliente" EN UNA LLAVE FORÁNEA DE LA TABLA 'usuario_meta_valor'
ALTER TABLE usuario_meta_valor ADD CONSTRAINT id_cliente foreign key (id_cliente) references cliente;

---HASTA AQUÍ CREACIÓN DE LAS TABLAS---SE INICIA CON EL RELLENO DE DATOS---

--INSERTAR EN LA TABLA USUARIO:
INSERT INTO usuario (id_usuario,nombre,email,clave) VALUES (1,'AndrewJey','AndrewJey@gmail.com','abc123');
INSERT INTO usuario (id_usuario,nombre,email,clave) VALUES (2,'Jacqui-Sama','jarayar@utn.ac.cr','pajarita2014');
INSERT INTO usuario (id_usuario,nombre,email,clave) VALUES (3,'KumaKun','ofonsecasa@gmail.com','SirKumaF2S');

--INSERTAR EN LA TABLA CLIENTE:
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (1,'Andrés Jiménez','AndrewJey@gmail.com','89651446');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (2,'Jorge Vega','jevegate@mep.go.cr','70415865');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (3,'Maria Montoya','mamont@yahoo.es','50660418256');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (4,'Dannia María Carrillo','damacar@crautos.co.cr','24476543');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (5,'Luis Gonzáles Gómez','lugogo@gmail.com','24605983');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (6,'Denniss Castillo López','decalo@hotmail.mx','+50687457234');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (7,'Alberto Madrigal','amadrigal@msn.jp','87457234');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (8,'Adriana Zapata','azapat@aol.us','+17834905343');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (9,'Marcos Aranjuez Castrillo','marcarancas@gmail.com','70345634');
INSERT INTO cliente (id_cliente,nombre,email,telefono) VALUES (10,'Gloria del Jesús Araya','sangloja@catholic.net','60485345');

--INSERTAR EN LA TABLA PRODUCTO:
INSERT INTO producto (id_producto,descripcion) VALUES (1,'Desayuno Sano');
INSERT INTO producto (id_producto,descripcion) VALUES (2,'Batido Nutricional');
INSERT INTO producto (id_producto,descripcion) VALUES (3,'Paquete de LiftOff');
INSERT INTO producto (id_producto,descripcion) VALUES (4,'Envase de Proteina');
INSERT INTO producto (id_producto,descripcion) VALUES (5,'Tarro de Sábila de aloe vera Original');
INSERT INTO producto (id_producto,descripcion) VALUES (6,'Tarro de Te Verde con Naranja Pekoe');
INSERT INTO producto (id_producto,descripcion) VALUES (7,'Pastillas NRG de Guaraná');

--INSERTAR EN LA TABLA META:
INSERT INTO meta (id_meta,descripcion,valor_esperado,fecha_limite,id_producto) VALUES (1,'Vender 100 desayunos sanos',100,'2017-07-25',1);
INSERT INTO meta (id_meta,descripcion,valor_esperado,fecha_limite,id_producto) VALUES (2,'Vender 500 batidos nutricionales',500,'2017-06-15',2);
INSERT INTO meta (id_meta,descripcion,valor_esperado,fecha_limite,id_producto) VALUES (3,'Vender 50 paquetes de LiftOff',50,'2017-05-31',3);
INSERT INTO meta (id_meta,descripcion,valor_esperado,fecha_limite,id_producto) VALUES (4,'Vender 250 envases de proteina',250,'2017-06-28',4);
INSERT INTO meta (id_meta,descripcion,valor_esperado,fecha_limite,id_producto) VALUES (5,'Vender 750 tarros de sábila de aloe vera original',750,'2017-07-31',5);
INSERT INTO meta (id_meta,descripcion,valor_esperado,fecha_limite,id_producto) VALUES (6,'Vender 50 paquetes de LiftOff',50,'2017-04-30',3);

--INSERTAR EN LA TABLA USUARIO_META:
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (1,1,1);
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (2,2,2);
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (3,3,3);
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (4,4,1);
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (5,5,3);
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (6,1,2);
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (7,4,3);
INSERT INTO usuario_meta (id_um,id_meta,id_usuario) VALUES (8,6,3);

--INSERTAR EN LA TABLA USUARIO_META_VALOR:
INSERT INTO usuario_meta_valor (id_umv,id_um,id_cliente,valor) VALUES (1,1,1,1000000);
INSERT INTO usuario_meta_valor (id_umv,id_um,id_cliente,valor) VALUES (2,2,2,5000000);
INSERT INTO usuario_meta_valor (id_umv,id_um,id_cliente,valor) VALUES (3,3,3,2500000);
INSERT INTO usuario_meta_valor (id_umv,id_um,id_cliente,valor) VALUES (4,4,4,75000000);

---HASTA AQUÍ LAS INSERCIONES A LAS TABLAS---SE INICIA CON LAS SELECCIONES DE DATOS---

--SELECCIONAR Y DESPLEGAR LOS DATOS DE LAS TABLAS:
SELECT * FROM usuario_meta;
SELECT * FROM usuario;
SELECT * FROM meta; 
SELECT * FROM producto;
SELECT * FROM usuario_meta_valor; 
SELECT * FROM cliente; 

-- usuarios y metas
select u.nombre, m.descripcion, m.valor_esperado
from usuario u
left join usuario_meta um on (um.id_usuario = u.id_usuario)
left join meta m on (um.id_meta = m.id_meta);

select u.nombre, m.descripcion, m.valor_esperado
from usuario u, usuario_meta um, meta m
where um.id_usuario = u.id_usuario and um.id_meta = m.id_meta;

---AQUÍ INICIA LA: "Práctica de Consultas SQL"---

-- 1.1 Listado de usuarios asignados a una meta X = 1:

select u.nombre, m.descripcion
from usuario_meta um
left join usuario u on (u.id_usuario = um.id_usuario)
left join meta m on (um.id_meta = m.id_meta)
where um.id_meta = 1;

-- 1.2 Listado de usuarios asignados a una meta X = 4:

select u.nombre, m.descripcion
from usuario_meta um
left join usuario u on (u.id_usuario = um.id_usuario)
left join meta m on (um.id_meta = m.id_meta)
where um.id_meta = 4;

-- 2. Reporte de cumplimiento de metas por usuario en orden descendente:

SELECT u.nombre as usuario, m.descripcion, m.valor_esperado, m.fecha_limite
FROM usuario as u 
left join usuario_meta as um on (um.id_usuario = u.id_usuario)
left join meta as m on (m.id_meta = um.id_meta)
where m.fecha_limite <= CURRENT_DATE
order by m.valor_esperado desc;

-- 3. Reporte de cumplimiento de metas por meta en orden descendente:

SELECT m.descripcion as meta, m.valor_esperado, m.fecha_limite
FROM meta as m
where m.fecha_limite <= CURRENT_DATE 
order by m.valor_esperado desc;

-- 4. Listado de usuarios más constantes en el sistema (los que tienen más datos en la tabla usuario_meta_valor)

SELECT c.nombre as usuario, umv.valor
FROM cliente as c 
left join usuario_meta_valor as umv on (umv.id_cliente = c.id_cliente)
where umv.id_cliente = c.id_cliente
order by umv.valor desc;

-- 5. Listado de usuario sin actividad en el sistema.

SELECT c.nombre as usuario
FROM cliente as c 
left join usuario_meta_valor as umv on (umv.id_cliente = c.id_cliente)
where umv.valor is null;

-- 6. Listado de los productos más vendidos por usuario.. 

SELECT p.descripcion as producto, m.valor_esperado as cantidad, u.nombre as usuario
FROM usuario as u 
left join usuario_meta as um on (um.id_usuario = u.id_usuario)
left join meta as m on (m.id_meta = um.id_meta)
left join producto as p on (p.id_producto = m.id_producto)
order by m.valor_esperado desc;

-- 7. Listado de los productos más vendidos por cliente.

SELECT p.descripcion as producto, m.valor_esperado as cantidad, c.nombre as cliente 
FROM cliente as c 
left join usuario_meta_valor as umv on (umv.id_cliente = c.id_cliente)
left join meta as m on (m.id_meta = umv.id_um)
left join producto as p on (p.id_producto = m.id_producto)
where umv.id_cliente = c.id_cliente
order by m.valor_esperado desc;

-- 8. Listado de productos que no estén asignados a ninguna meta.

SELECT p.descripcion as producto
FROM producto as p 
left join meta as m on (m.id_producto = p.id_producto)
where m.valor_esperado is null;

-- 9. Listado de clientes por usuario.

SELECT c.nombre
FROM cliente as c
order by c.nombre;

-- 10. Listado de clientes más importantes por el número de productos comprados.

SELECT c.nombre as cliente, p.descripcion as producto, m.valor_esperado as cantidad
FROM cliente as c 
left join usuario_meta_valor as umv on (umv.id_cliente = c.id_cliente)
left join meta as m on (m.id_meta = umv.id_um)
left join producto as p on (p.id_producto = m.id_producto)
where umv.id_cliente = c.id_cliente
order by m.valor_esperado desc;