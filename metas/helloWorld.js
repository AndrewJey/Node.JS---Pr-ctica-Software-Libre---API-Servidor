var http = require("http");
var manejador = function(solicitud, respuesta){
	console.log("Ṕretición Recibida");
	respuesta.end("HOLA MUNDO");
}
var servidor = http.createServer(manejador);
servidor.listen(3000);