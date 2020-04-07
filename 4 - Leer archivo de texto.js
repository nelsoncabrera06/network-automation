# $language = "JScript"
# $interface = "1.0"

// "4 - Leer archivo de texto.js"
// script para ingresar a los equipos HUAWEI a partir de una lista de equipos en un archivo
// envia usuario y password automaticamente
// y pregunta que version de equipo es

//variables globales
var USUARIO = "u564508";
var pass = "Golf0420";
var ENTER = "\015";

var NombreArchivo_Entrada = "inventory.txt";     // nombre de donde lee los datos
var ForReading = 1, ForWriting = 2, ForAppending = 8;	//constantes para archivos
var FileOpener = new ActiveXObject ("Scripting.FileSystemObject"); 	// creo un Objecto ActiveXObject
var filedatos = FileOpener.OpenTextFile (NombreArchivo_Entrada, ForReading, true); // puntero de archivo de entrada

function main() 
{
	var EQUIPO, COMANDO;	//variables locales a main
	crt.Screen.Synchronous = true; 
	
	EQUIPO = filedatos.Readline(); //aca leo el EQUIPO
	
	while ( filedatos.AtEndOfStream != true) // mientras no llegue al final del archivo...
	{
		ingresarAlEquipo(EQUIPO); 		//llamo a la funcion ingresar al equipo, paso el EQUIPO como un argumento 
		COMANDO = "disp version | inc CX"; 
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		crt.screen.WaitForString (">");
		crt.Screen.Send ( "quit " + ENTER );		// saliendo del equipo
		crt.screen.WaitForString ("$");
		EQUIPO = filedatos.Readline(); 				// leo el siguiente equipo
	}
	
	crt.Dialog.MessageBox("Fin del script");
	
	filedatos.close(); // cierro el archivo
  
}

function ingresarAlEquipo(Equipoaingresar)
{	
	var COMANDO = "ttelnet " + Equipoaingresar;	
	crt.Screen.Send( COMANDO + ENTER );		
	
    leido = crt.Screen.WaitForStrings( "Username:" , "$");	// espera hasta que el gestor lea "Username:" o "$"
	if ( leido == 1 ){	// si leido es igual a 1 entonces...
		
		crt.Screen.Send( USUARIO + ENTER );			
		crt.Screen.WaitForString( "Password:" );	
		crt.Screen.Send( pass + ENTER );			
		
		crt.Screen.WaitForStrings("#",">","$");		
		crt.window.caption = Equipoaingresar;
	}
}
