# $language = "JScript"
# $interface = "1.0"

// "3 - IP del EQUIPO.js"
// script para ingresar a los equipos
// envia usuario y password automaticamente
// y muestra en pantalla cual es la IP del EQUIPO al que estamos ingresando

var ENTER = "\015"; 
var USUARIO, pass;  
USUARIO = "u564508";	
pass = "Golf0420";	

function main() 
{
	var EQUIPO;	
	var leido; 
	
	crt.Screen.Synchronous = true;
	EQUIPO = crt.Dialog.Prompt("Ingrese el nombre del equipo", "loggearse", "RSC4MU", 0);
		
	var COMANDO = "ttelnet " + EQUIPO;	
	crt.Screen.Send( COMANDO + ENTER );		
	
	
    leido = crt.Screen.WaitForStrings( "Trying " , "$");	// espera hasta que el gestor lea "Trying " o "$"
	if ( leido == 1 ){	// si leido es igual a 1 entonces...
		
		
		var fila = crt.screen.CurrentRow; 		// fila actual donde esta parado el cursor
		crt.Screen.WaitForString( "..." );		// espera leer el string "..."
		var readline = crt.Screen.Get(fila, 1, fila, 200);	
			// captura la linea leida en readline desde la columna 1 hasta la 200
			// y sobre la fila actual donde esta el cursor
		
		var re = /Trying\s(\d+\.\d+\.\d+\.\d+)...\s+/g;	 // creo la expresion regular "re" y le doy un valor particular de lo que quiero capturar
		var DATO = readline.replace(re, "$1");	// extraigo aquello que está entre parentesis "()" de readline y lo guardo en DATO
		crt.Dialog.MessageBox(DATO);			// muestro el dato obtenido en pantalla en este caso la IP
	
		crt.Screen.WaitForString( "Username:" );	
		crt.Screen.Send( USUARIO + ENTER );			
		crt.Screen.WaitForString( "Password:" );	
		crt.Screen.Send( pass + ENTER );			
		
		crt.Screen.WaitForStrings("#",">","$");		
		crt.window.caption = EQUIPO;
	}
	
	crt.Dialog.MessageBox("Fin del script");
}