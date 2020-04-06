# $language = "JScript"
# $interface = "1.0"

// Este Script envia el texto "Network Automation Rules!!!" 

function main() 
{
		// sincronizo con el gestor
	crt.Screen.Synchronous = true;
		// creo la variable COMANDO y le doy el valor "Network Automation Rules!!!"
	var COMANDO = "Network Automation Rules!!!";
		// envia el comando
	crt.Screen.Send( COMANDO );		
		// creo un cuadro de dialogo indicando el fin del script
	crt.Dialog.MessageBox("Fin del script");
  
}



