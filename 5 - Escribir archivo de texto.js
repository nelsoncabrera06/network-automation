# $language = "JScript"
# $interface = "1.0"

/* "5 - Escribir archivo de texto.js"
	script para ingresar a los equipos HUAWEI a partir de una lista de equipos en un archivo
	envia usuario y password automaticamente
	y pregunta que version de equipo es
	y guarda esa información en un archivo de texto llamado "output.txt" */


//variables globales
var USUARIO = "u564508";
var pass = "Golf0420";
var ENTER = "\015";

var NombreArchivo_Entrada = "inventory.txt";     // nombre de donde lee los datos
var NombreArchivo_Salida = "output.txt";     // nombre de donde escribe los datos

var ForReading = 1, ForWriting = 2, ForAppending = 8;	//constantes para archivos
var FileOpener = new ActiveXObject ("Scripting.FileSystemObject"); 	// creo un Objecto ActiveXObject

var filedatos = FileOpener.OpenTextFile (NombreArchivo_Entrada, ForReading, true); // puntero de archivo de entrada
var fileSalida = FileOpener.OpenTextFile (NombreArchivo_Salida, ForWriting, true); // puntero de archivo de Salida

function main() 
{
	var EQUIPO, COMANDO;	//variables locales a main
	crt.Screen.Synchronous = true; 
	
	while ( filedatos.AtEndOfStream != true) // mientras no llegue al final del archivo...
	{
		EQUIPO = filedatos.Readline(); 				// leo el siguiente equipo
		ingresarAlEquipo(EQUIPO); 		//llamo a la funcion ingresar al equipo, paso el EQUIPO como un argumento 
		COMANDO = "disp version | inc CX"; 
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando
		capturaryescribir(EQUIPO);				// llamo a la función capturar y escribir
		crt.Screen.Send ( "quit " + ENTER );		// saliendo del equipo
		crt.screen.WaitForString ("$");
	}
	
	crt.Dialog.MessageBox("Fin del script");
	
	filedatos.close(); // cierro el archivo
	fileSalida.close();
}

function capturaryescribir(EQUIPO)
{
	var Salir = 0;
	var re = /HUAWEI (\w+-\w+) uptime is [\S\s]+/g;	 // mi expresion regular "re"
	
	Salir = crt.screen.WaitForStrings (String.fromCharCode(13), ">"); // espera un \n (ENTER) o ">"
	while ( Salir != 2 )
	{	
		fila = crt.screen.CurrentRow;			// fila actual
		readline = crt.Screen.Get(fila, 1, fila, 200);
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), ">");
		
		hallado = readline.match(re); // hay coincidencia entre mi re y readline?
				
		if ( hallado != null ){ 	// si hay coincidencia…
			var DATO = readline.replace(re, "$1");	// extraigo aquello que está entre parentesis "()" de readline y lo guardo en DATO
			// escribo en el archivo de salida el EQUIPO junto con el DATO en este caso el modelo
			fileSalida.WriteLine(EQUIPO +"	"+ DATO);
		}
		
	}
	Salir = 0;
}

function ingresarAlEquipo(Equipoaingresar)
{	
	var COMANDO = "ttelnet " + Equipoaingresar;	
	crt.Screen.Send( COMANDO + ENTER );		
	
		crt.Screen.WaitForString( "Username:" );		
		crt.Screen.Send( USUARIO + ENTER );			
		crt.Screen.WaitForString( "Password:" );	
		crt.Screen.Send( pass + ENTER );			
		
		crt.Screen.WaitForStrings("#",">","$");		
		crt.window.caption = Equipoaingresar;
}