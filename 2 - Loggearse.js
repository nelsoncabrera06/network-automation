# $language = "JScript"
# $interface = "1.0"

// "2 - Loggearse.js"
// script para ingresar a los equipos
// el usuario y password estan guardados en variables globales
// deben ser modificados cada vez que cambiamos nuestra clave de LAN


var ENTER = "\015"; // varible global ENTER para indicar cuando enviar un enter
var USUARIO, pass;  // creo las variables globales USUARIO y pass 
	// las variables globales pueden ser vistas por todas las funciones del código
USUARIO = "u564508";	// le asigno el valor de mi u564508 a USUARIO
pass = "Pass_de_LAN";		// le asigno el valor clave de LAN a pass

function main() 
{
	var EQUIPO;	// creo la variable EQUIPO, esta variable es local a main()
	var leido; // creo la variable leido
	
	crt.Screen.Synchronous = true;	// sincronizo con el gestor
		// pregunto por el equipo a ingresar
	EQUIPO = crt.Dialog.Prompt("Ingrese el nombre del equipo", "loggearse", "RSC4MU", 0);
		// los argumentos son ("texto del cuadro", "titulo", "ejemplo", tipo 0 sin ocultar)
		// tipo 1 oculto
	
	var COMANDO = "ttelnet " + EQUIPO;	// creo la variable COMANDO con el valor "ttelnet " y concateno el EQUIPO
	crt.Screen.Send( COMANDO + ENTER );		// envia el COMANDO y tambien un ENTER
	
    leido = crt.Screen.WaitForStrings( "Username:" , "$");	// espera hasta que el gestor lea "Username:" o "$"
	if ( leido != 2){
		crt.Screen.Send( USUARIO + ENTER );			// entonces envia el USUARIO y un ENTER 
		crt.Screen.WaitForString( "Password:" );	// espera hasta que el gestor lea "Password:"
		crt.Screen.Send( pass + ENTER );			// entonces envia la pass y un ENTER 
		
		crt.Screen.WaitForStrings("#",">","$");		// espera por algunos de los siguientes "#",">","$"
		crt.window.caption = EQUIPO;		// le pone el nombre del equipo a la solapa del gestor
	}
	
}



