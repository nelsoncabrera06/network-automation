# $language = "JScript"
# $interface = "1.0"

// Open the file c:\temp\file.txt, read it line by line sending each
// line to the server. Note, to run this script successfully you may need
// to update your script engines to ensure that the filesystemobject runtime
// is available.

var USUARIO, pass;
var EQUIPO, MARCA, MODELO, IP, COMANDO, INTERFACE, EQUIPO_leido;
USUARIO = "sin datos";
pass = "sin datos";
EQUIPO = "sin datos";
EQUIPO_leido = "sin datos";
var Equipo_gestor;
COMANDO = "sin datos";
MODELO = "sin datos";
INTERFACE = "sin datos";
var ForReading = 1, ForWriting = 2, ForAppending = 8;
var BUTTON_YESNO = 4;		//Yes and No buttons
var IDYES = 6;				//Yes button clicked
var IDNO = 7;				//No button clicked
var ENTER = "\015";
var filas = 0, columnas = 0, indice = 0;
var tabla;
var ESTADO = 0;
var NombreArchivo_Salida = "OUTPUT_Javascript-Configuracion_Actual.txt"
var NombreArchivo_Entrada = "input.txt"
var NombreArchivo_TABLADATOS = "OUTPUT_Javascript-Tabla_de_datos.txt"
//creo el archivo de salida
var FileOpener = new ActiveXObject ( "Scripting.FileSystemObject"); 
var file = FileOpener.OpenTextFile (NombreArchivo_Salida, ForWriting, true);  // puntero de archivo de salida output
var filedatos = FileOpener.OpenTextFile (NombreArchivo_Entrada, ForReading, true);
var fileoutTabladeDatos = FileOpener.OpenTextFile(NombreArchivo_TABLADATOS, ForWriting, true);





function main() 
{
	var fso, f, r, SEGUIR;  
	var IP;
	var linealeida, lineainput;
	fso = new ActiveXObject("Scripting.FileSystemObject");	
	f = fso.OpenTextFile("inventory.txt", ForReading);
	
	var index = 0;
	var CVLAN, SVLAN;
	var cap, result;
	cap = "Analizador Layer 3";

	crt.Screen.Synchronous = true; //sincronizo con el gestor
	
	//ingreso las INTERFACEs a analizar
	SEGUIR = abrirINPUT(file, filedatos, index, CVLAN, SVLAN, ESTADO);
	if (SEGUIR == 1){ 
		crt.Dialog.MessageBox("Salida del script");
		return;
	}
	
	
	var str;
	while ( filedatos.AtEndOfStream != true &&  ESTADO != 7)
	{
		//En que ESTADO estoy? adentro de un equipo huawei, cisco? o fuera de cualquier equipo?
		
		
		leerINTERFACEINPUT();
		
		enqueestadoestoy();
		
		if (EQUIPO_leido == "sin datos") { 
			EQUIPO_leido = crt.Dialog.Prompt("Ingrese el nombre del equipo", "Analizador", "VPNSPROS3", 0);
			ingresarAlEquipo(EQUIPO_leido);
			enable();
		}else if (EQUIPO_leido != EQUIPO) // && EQUIPO != "sin datos")
		{	
			salirdelequipo();
			ingresarAlEquipo(EQUIPO_leido);
			enable();
		}
		
		switch (MARCA) 
		{
			case "HUAWEI":
				ESTADO = 2;
				break;
			case "CISCO":
				ESTADO = 3;	
				break;
			default:
				break;
		}
		
		while ( ESTADO != 6 ){
			switch (ESTADO) 
			{
			case 0: //no estoy en ningun equipo
				// en este punto debería saber que formato tiene el archivo input.txt
				// por ejemplo puede ser solo una INTERFACE ejemplo Te0/6/0/0.613003653
				// o puede ser un formato EQUIPO INTERFACE ejemplo C2PARAGUAY Te0/6/0/0.613003653
				// ojo que tambien puede ser una linea vacia, debería contemplarlo para que no rompa nada
				if (EQUIPO_leido == null){
					EQUIPO_leido = crt.Dialog.Prompt("Ingrese el nombre del equipo");
					verific = crt.Dialog.MessageBox("Desea ingresar a " + EQUIPO_leido , cap, BUTTON_YESNO);
					if (verific != IDYES) {
						crt.Dialog.MessageBox("VUELVA A INTENTAR");
						ESTADO = 7;
						return;
					} 
				} 
				
				ingresarAlEquipo(EQUIPO_leido);
				
				switch (MARCA) {
					case "HUAWEI":
						ESTADO = 2;
						break;
					case "CISCO":
						ESTADO = 3;	
						break;
					default:
						break;
				}	
				
				//crt.Dialog.MessageBox("ESTADO " + ESTADO);
				//el ESTADO 1 quedaría libre asi como lo estoy trabajando
				
				break;
			case 2: // caso HUAWEI
				ESTADO = HUAWEI();
				break;
			case 3: // caso CISCO
				ESTADO = CISCO();//file, filedatos, index, MARCA, EQUIPO, ESTADO, fileoutTabladeDatos);
				break;
			default:
				break;
			}
		}
		 
		/*
		ingresarAlEquipo(f);
		tirarComandos();
		salirdelequipo(); 	*/
	}
	
	file.close(); 
	filedatos.close();
	fileoutTabladeDatos.close();
	
	crt.Dialog.MessageBox("       Fin del script       " + "\015" + "Autor: Nelson Cabrera");
  
	var shell = new ActiveXObject("WScript.Shell");
	shell.Run(NombreArchivo_Salida);
	shell.Run(NombreArchivo_TABLADATOS);
	//shell.Run("armarconfiguracionfutura.html");
	//shell.Run("Analizador.html");
	
  
}

//crt.Dialog.MessageBox("hasta aca bien!");

function leerINTERFACEINPUT()
{
	lineainput = filedatos.Readline(); //aca lee la INTERFACE
	var res = lineainput.split(" ");
	//var EQUIPO_leido, INTERFACE_leida;
			
	switch (res.length) 
	{	
		case 1:	// si la linea esta vacia entra en este caso tambien revisar
			//INTERFACE_leida = res[0];
			INTERFACE = res[0];
			if (INTERFACE.length == 0){
				//crt.Dialog.MessageBox("La linea leida esta vacia");
			}else{
				//crt.Dialog.MessageBox("EQUIPO " + EQUIPO_leido +" Subint "+ INTERFACE_leida);
			}
			break;
		case 2:
			EQUIPO_leido = res[0];
			//INTERFACE_leida = res[1];
			INTERFACE = res[1];
			//crt.Dialog.MessageBox("EQUIPO " + EQUIPO_leido +" Subint "+ INTERFACE_leida);
			break;
		default:
			crt.Dialog.MessageBox(res + " " + res.length);
			break;
	}
	
	//crt.Dialog.MessageBox("EQUIPO_leido y EQUIPO    " + EQUIPO_leido + "  " + EQUIPO);
	
}


function transformarMascaraABarra(MASCARA){

  switch (MASCARA) {
      case "255.255.255.255":
        MASCARA = "32";
        break;
      case "255.255.255.252":
        MASCARA = "30";
        break;
      case "255.255.255.248":
        MASCARA = "29";
        break;
      case "255.255.255.240":
        MASCARA = "28";
        break;
      case "255.255.255.224":
        MASCARA = "27";
        break;
      case "255.255.255.192":
        MASCARA = "26";
        break;
      case "255.255.255.0":
        MASCARA = "24";
        break;
      default:
        MASCARA = "ERROR_MASCARA_" + MASCARA;
        crt.Dialog.MessageBox(MASCARA);
        break;
      } //final del switch

      return MASCARA;
}

function CISCO()
{
	var readline, regular;
	var Salir = 0;
	
	var DESCRIPCION = "NO TIENE";
	var ip_WAN = "NO TIENE";
	var mascara_WAN = "NO TIENE";
	var NEXTHOP = "NO TIENE";
	var BANDWIDTH = "NO TIENE";
	var policy_input = "NO TIENE";
	var policy_output = "NO TIENE";
	var VRF = "NO TIENE";
	var CVLAN = "NO TIENE";
	var SVLAN = "NO TIENE";
	var ESTATICAS = ["NO TIENE"]; // es una array y la posicion 0 le pongo NO TIENE
	var INTERFACE_recortada = "NO TIENE";
	var Estado_Subint = "NO TIENE";
	var RD_import = "NO TIENE";
	var RD_export = "NO TIENE";
	var RD = "NO TIENE";
	var AS_actual = "NO TIENE";
	var neighbor_BGP = "NO TIENE";
	var BGP = "NO TIENE";
	var Trafico_input = 0;
	var Trafico_output = 0;
	var indice = 0;
	var descripcion_BGP = "NO TIENE";
	var PEAKFLOW = "NO TIENE";
	var VLAN;
	var IP_ping = new Array();
	
	/*
	sh int INTERFACE
	sh run int INTERFACE
	sh mac-address-table vlan VLAN
	sh ip arp vlan VLAN
	sh ip arp INTERFACE
	sh standby brief
	ping IP
	ping vrf vpn-rnc-iuu x.x.x.x
	sh ip bgp vpnv4 vrf vpn-rnc-iuu summary 
	sh ip bgp vpnv4 vrf vpn-rnc-iuu neighbors 172.21.35.xx advertised-routes
	
	*/
	
	var comandos = [
		"sh int INTERFACE", 				//posicion 0
		"sh run int INTERFACE",			//posicion 1
		"sh mac-address-table vlan VLAN",
		"sh ip arp vlan VLAN",
		"sh ip arp INTERFACE",
		"sh standby brief",
		"ping IP",
		"ping vrf vpn-rnc-iuu x.x.x.x",
		"sh ip bgp vpnv4 vrf vpn-rnc-iuu summary",
		"sh ip bgp vpnv4 vrf vpn-rnc-iuu neighbors 172.21.35.xx advertised-routes"
	];
	
	var ExpresionesREGULARES = [
		/description ([\s\S]+)/g,
		/bandwidth (\d+)/g,
		/service-policy input ([\s\S]+)/g,
		/ip vrf forwarding (\S+)/g,
		/ipv4 address (\d+.\d+.\d+.\d+) (255.\d+.\d+.\d+)/g,
		/ switchport trunk allowed vlan (\S+)/g,
		/service-policy output ([\s\S]+)/g,
		/[\S]+\sis\s(\w+\s\w+), line protocol is (\w+\s\w+)/g, //TenGigE0/6/0/0.1006410003 is administratively down, line protocol is administratively down 
		/[\S]+\sis\s(\w+), line protocol is (\w+)/g,			//TenGigE0/6/0/0.1703844 is up, line protocol is up  OR down down
		/(\d+:\d+)/g, 		//formato para los RD 7303:594
		/\d+\s\w+\sinput rate (\d+) bits\/sec, \d+ packets\/sec/g,		//10
		/\d+\s\w+\soutput rate (\d+) bits\/sec, \d+ packets\/sec/g,		//11
		/flow ipv4 monitor FMMAP sampler FNF_SAMPLER_MAP ingress/g		//12 para el peakflow
	];
	var PALABRASCLAVE = [
		"INTERFACE", 				
		"VRF",				
		"NEXTHOP", 
		"POLICY_INPUT",				
		"POLICY_OUTPUT",				
		"ESTATICAS"				
	];
	
	var DATOS = [ // DATOS tiene que seguir el mismo orden que las PALABRASCLAVE
		"sin datos 0", 		//INTERFACE
		"sin datos 1",		//VRF
		"sin datos 2",		//NEXTHOP
		"sin datos 3",		//POLICY_INPUT
		"sin datos 4",		//POLICY_OUTPUT
		"sin datos 5"		//ESTATICAS			
	];
	
	DATOS[0] = INTERFACE;

	INTERFACE_recortada = recortarSUBINT();
	
	crt.Screen.Synchronous = true; //sincronizo con el gestor	
	//"sh int INTERFACE"
	
	COMANDO = "sh int " + INTERFACE;
	crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
	Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#");
	while ( Salir != 2 )
	{	
		columnaActual = crt.screen.CurrentColumn;
		screenrow = crt.screen.CurrentRow;			// fila actual
		readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
		readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
		//readline = readline.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // le quito los espacios en blanco
		file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline);
		
		
		Salir = crt.screen.WaitForStrings ( String.fromCharCode(13), "#");
		
		//[\S]+\sis\s(\w+\s\w+), line protocol is (\w+\s\w+) //7
		//[\S]+\sis\s(\w+), line protocol is (\w+)			//8
		//\d+\s\w+\sinput rate (\d+) bits\/sec, \d+ packets\/sec/g,		//10
		//\d+\s\w+\soutput rate (\d+) bits\/sec, \d+ packets\/sec/g,		//11
		//aca PARSEO
		for(var i=0;i<ExpresionesREGULARES.length; i++){ 
			expresion = ExpresionesREGULARES[i];
			hallado = readline.match(expresion);
				
			if ( hallado != null ){
				switch (i) {
					case 7: 
						Estado_Subint = readline.replace(expresion, "admin-down  admin-down");
						Estado_Subint = Estado_Subint.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
						//crt.Dialog.MessageBox("Estado_Subint " + Estado_Subint);
						break;
					case 8: 
						Estado_Subint = readline.replace(expresion, "$1  $2");
						Estado_Subint = Estado_Subint.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
						//crt.Dialog.MessageBox("Estado_Subint " + Estado_Subint);
						break;
					case 10: 
						Trafico_input = readline.replace(expresion, "$1");
						Trafico_input = Trafico_input.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					case 11: 
						Trafico_output = readline.replace(expresion, "$1");
						Trafico_output = Trafico_output.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
						break;
					default:
						break;
				}
			}
		}
		
	}
	Salir = 0;
	Trafico_input = Analizar_TRAFICO(Trafico_input);
	Trafico_output = Analizar_TRAFICO(Trafico_output);
	
	/*
	VPNSPROS3#sh run int Gi1/21
	Building configuration...

	Current configuration : 374 bytes
	!
	interface GigabitEthernet1/21
	 description A BSCROS3 BSC- NWI-E 1 (Gb/A) - Ericsson
	 switchport
	 switchport trunk encapsulation dot1q
	 switchport trunk allowed vlan 200,852
	 switchport mode trunk
	 logging event link-status
	 logging event trunk-status
	 load-interval 30
	 storm-control broadcast level 0.60
	 storm-control multicast level 0.60
	 spanning-tree guard root
	end
	*/
	
	//"sh run int INTERFACE",			
	COMANDO = "sh run int " + INTERFACE;
	crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
	Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#");
	while ( Salir != 2 )
	{
		columnaActual = crt.screen.CurrentColumn;
		screenrow = crt.screen.CurrentRow;			// fila actual
		readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
		readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
		//readline = readline.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // le quito los espacios en blanco
		file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
		Salir = crt.screen.WaitForStrings ( String.fromCharCode(13), "#");
		
		//aca PARSEO
		for(var i=0;i<ExpresionesREGULARES.length; i++){ 
			expresion = ExpresionesREGULARES[i];
			hallado = readline.match(expresion);
				
		if ( hallado != null ){
			//DATO = readline.replace(expresion, "$1");
			//crt.Dialog.MessageBox(readline + " " + DATO);
			switch (i) {
						case 0: 
							DESCRIPCION = readline.replace(expresion, "$1");
							DESCRIPCION = DESCRIPCION.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							//crt.Dialog.MessageBox("DESCRIPCION " + DESCRIPCION);
							break;
						case 1: 
							BANDWIDTH = readline.replace(expresion, "$1");
							BANDWIDTH = BANDWIDTH.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							//crt.Dialog.MessageBox("BANDWIDTH "+ BANDWIDTH);
							break;
						case 2: 
							policy_input = readline.replace(expresion, "$1");
							policy_input = policy_input.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							DATOS[3] = policy_input;
							//crt.Dialog.MessageBox("policy_input " + policy_input);
							break;
						case 3: 
							VRF = readline.replace(expresion, "$1");
							VRF = VRF.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							DATOS[1] = VRF;
							//crt.Dialog.MessageBox("VRF " + VRF);
							break;
						case 4: 
							ip_WAN = readline.replace(expresion, "$1");
							ip_WAN = ip_WAN.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							mascara_WAN = readline.replace(expresion, "$2");
							mascara_WAN = mascara_WAN.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							NEXTHOP = SiguienteIP(ip_WAN);
							DATOS[2] = NEXTHOP;
							//crt.Dialog.MessageBox("WAN y mascara " + ip_WAN + "_" + mascara_WAN);
							//esto no esta perfecto porque la mascara de wan me la muestra en la siguiente linea
							break;
						case 5: 
							SVLAN = readline.replace(expresion, "$1");
							VLAN = SVLAN.split(",");	// si hay varias VLANs las divide por coma
							//crt.Dialog.MessageBox("VLAN " + VLAN);
							break;
						case 6: 
							policy_output = readline.replace(expresion, "$1");
							policy_output = policy_input.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							DATOS[4] = policy_output;
							//crt.Dialog.MessageBox("policy_input " + policy_input);
							break;
						case 12: //flow ipv4 monitor FMMAP sampler FNF_SAMPLER_MAP ingress
							PEAKFLOW = "Si tiene";
						default:
							break;
					}
				}
			}
		//Salir = crt.screen.WaitForStrings ( String.fromCharCode(13), "#");
	}
	Salir = 0;
	
	if (VRF!="NO TIENE"){
		var vrf_estado = "sin datos";
		COMANDO = "sh run vrf " + VRF;		
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "!");
		while ( Salir != 2 )
		{	
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
			//readline = readline.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // le quito los espacios en blanco
			file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
			Salir = crt.screen.WaitForStrings ( String.fromCharCode(13), "#");
			
			re = new RegExp("import route-target");		//crea una regExp a partir de ese string leido
			obtenido = readline.match(re);
			re2 = new RegExp("export route-target");		//crea una regExp a partir de ese string leido
			obtenido2 = readline.match(re2);
			if (obtenido != null) vrf_estado = "import";
			if (obtenido2 != null) vrf_estado = "export";
			//if (vrf_estado != "sin datos") crt.Dialog.MessageBox(vrf_estado);
				
			
			
			//aca PARSEO
			for(var i=0;i<ExpresionesREGULARES.length; i++){ 
				expresion = ExpresionesREGULARES[i];
				hallado = readline.match(expresion);
					
				if ( hallado != null ){
					switch (i) {
						case 9: 
							switch (vrf_estado) {
								case "import":
									if (RD_import=="NO TIENE"){
										RD_import = readline.replace(expresion, "$1");
										RD_import = RD_import.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
									} else {
										RD_import = RD_import + ' ' + readline.replace(expresion, "$1").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
									}
									break;
								case "export":
									if (RD_export=="NO TIENE"){
										RD_export = readline.replace(expresion, "$1");
										RD_export = RD_export.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
									} else {
										RD_export = RD_export + ' ' + readline.replace(expresion, "$1").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
									}
									break;
								default:
									break;
							}
								//crt.Dialog.MessageBox("RD_import " + RD_import);
							break;
						default:
							break;
					}
				}
			}
			
			
		}
		Salir = 0;
	}
	RD = RD_export;
	
	
	
	for(var i=0;i<VLAN.length; i++){ 
		COMANDO = "sh mac-address-table vlan " + VLAN[i];
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
		while ( Salir != 2 )
		{	
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
			file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
			Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
			
			if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
			//crt.Dialog.MessageBox("Salir " + Salir )
		}
		Salir = 0;
	}
		
	
	//sh ip arp vlan VLAN
	for(var i=0;i<VLAN.length; i++){ 
		COMANDO = "sh ip arp vlan " + VLAN[i];
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
		while ( Salir != 2 )
		{	
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
			file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
			Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
			
			if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
			
			//IP,Internet  (\d+.\d+.\d+.\d+)\s+\d+   \w+.\w+.\w+  ARPA   Vlan\d+
			re = /Internet  (\d+.\d+.\d+.\d+)\s+\d+   \w+.\w+.\w+  ARPA   \w+/g		
			obtenido = readline.match(re);
			if (obtenido != null)  {
				IP_ping.push(readline.replace(re,"$1")); // agrego la ip a la lista
				//crt.Dialog.MessageBox("IP_ping " + IP_ping );
			}
			
		}
		Salir = 0;
	}
	
	
	
	COMANDO = "sh ip arp " + INTERFACE; // esto estaria bien pero no trae nada de resultado
	crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
	Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
	while ( Salir != 2 )
	{	
		columnaActual = crt.screen.CurrentColumn;
		screenrow = crt.screen.CurrentRow;			// fila actual
		readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
		readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
		file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
			
		if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
			
	}
	Salir = 0;
	
	COMANDO = "sh standby brief"; 
	crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
	Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
	while ( Salir != 2 )
	{	
		columnaActual = crt.screen.CurrentColumn;
		screenrow = crt.screen.CurrentRow;			// fila actual
		readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
		readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
		file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
			
		if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
			
	}
	Salir = 0;
	
	for(var i=0;i<IP_ping.length; i++){ 
		COMANDO = "ping " + IP_ping[i]; 
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
		while ( Salir != 2 )
		{	
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
			file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
			Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
				
			if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
				
		}
		Salir = 0;
	}
	
	/*
	ping vrf vpn-rnc-iuu x.x.x.x
	sh ip bgp vpnv4 vrf vpn-rnc-iuu summary 
	sh ip bgp vpnv4 vrf vpn-rnc-iuu neighbors 172.21.35.xx advertised-routes
	*/
	
	//for(var i=0;i<IP_ping.length; i++){ 
		COMANDO = "ping vrf vpn-rnc-iuu x.x.x.x"; 
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
		while ( Salir != 2 )
		{	
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
			file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
			Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
				
			if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
				
		}
		Salir = 0;
	//} // final del for
	
	//for(var i=0;i<IP_ping.length; i++){ 
		COMANDO = "sh ip bgp vpnv4 vrf vpn-rnc-iuu summary"; 
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
		while ( Salir != 2 )
		{	
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
			file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
			Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
				
			if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
				
		}
		Salir = 0;
	//} // final del for
	
	//for(var i=0;i<IP_ping.length; i++){ 
		COMANDO = "sh ip bgp vpnv4 vrf vpn-rnc-iuu neighbors 172.21.35.xx advertised-routes"; 
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando	
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
		while ( Salir != 2 )
		{	
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			readline = readline.replace(/\s+$/,''); // le quito los espacios en blanco del final
			file.WriteLine(EQUIPO +" "+ INTERFACE +"	"+ readline); 
			Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#", "--More--");
				
			if(Salir==3) crt.Screen.Send ( " " );		// envia un espacio
				
		}
		Salir = 0;
	//} // final del for
	
	
	file.WriteLine("---------------------------------------" );
	file.WriteLine("DATOS Configuracion Actual: " );
	file.WriteLine("EQUIPO:	" + EQUIPO );
	file.WriteLine("INTERFACE:	" + INTERFACE );
	file.WriteLine("Estado INTERFACE:	" + Estado_Subint );
	file.WriteLine("Trafico input:	" + Trafico_input );
	file.WriteLine("Trafico output:	" + Trafico_output );
	file.WriteLine("Descripcion:	" + DESCRIPCION );
	file.WriteLine("VRF:	" + VRF );
	file.WriteLine("VLAN:	" + VLAN );
	for(var i=0;i<IP_ping.length; i++) file.WriteLine("IP:	" + IP_ping[i] );
	
	//file.WriteLine("Bandwidth:	" + BANDWIDTH );
	//file.WriteLine("Policy input:	" + policy_input );
	//file.WriteLine("Policy output:	" + policy_output );
	//file.WriteLine("Ip de WAN:	" + ip_WAN );
	//file.WriteLine("Mascara WAN:	" + mascara_WAN );
	//file.WriteLine("WAN+1:	" + NEXTHOP );
	//file.WriteLine("CVLAN:	" + CVLAN );
	//file.WriteLine("RD import:	" + RD_import);
	//file.WriteLine("RD export:	" + RD_export);
	//file.WriteLine("RD:	" + RD );
	//file.WriteLine("BGP neighbor:	" + neighbor_BGP );
	//file.WriteLine("BGP:	" + BGP );
	//file.WriteLine("Descripcion BGP:	" + descripcion_BGP);
	//file.WriteLine("AS:	" + AS_actual );
	//file.WriteLine("Peakflow:	" + PEAKFLOW);
	//file.WriteLine("Rutas Aprendidas por BGP:	" + "TODAVIA NO LO SE"); //Cant_rutas_BGP); // este en el caso de CISCO no lo tengo en analizer 1.2
	
	//file.WriteLine("Resultado ping WAN+1:	" + "TODAVIA NO LO SE"); //NEXTHOP + " " + Resultado_pingWAN);
	
	
	file.WriteLine ("--------------------------------------");
	file.WriteLine ("--------------------------------------");
	
	
	fileoutTabladeDatos.WriteLine("---------------------------------------" );
	fileoutTabladeDatos.WriteLine("DATOS Configuracion Actual: " );
	fileoutTabladeDatos.WriteLine("EQUIPO: " + EQUIPO );
	fileoutTabladeDatos.WriteLine("INTERFACE: " + INTERFACE );
	fileoutTabladeDatos.WriteLine("Estado INTERFACE: " + Estado_Subint );
	fileoutTabladeDatos.WriteLine("Trafico input: " + Trafico_input );
	fileoutTabladeDatos.WriteLine("Trafico output: " + Trafico_output );
	fileoutTabladeDatos.WriteLine("Descripcion: " + DESCRIPCION );
	fileoutTabladeDatos.WriteLine("VRF: " + VRF );
	fileoutTabladeDatos.WriteLine("VLAN: " + VLAN );
	for(var i=0;i<IP_ping.length; i++) fileoutTabladeDatos.WriteLine("IP:	" + IP_ping[i] );
	
	return 6; 

}



function SiguienteIP(IP)
{
	//MsgBox "IP " & IP
	
	var re = /(\d+.\d+.\d+.)(\d+)/g
	//primeraparte = IP.replace(re, "$1"); //capturo la primera parte
	ultimoOCTETO = IP.replace(re, "$2"); //capturo el ultimo octeto
	//ultimoOCTETO = parseInt(ultimoOCTETO, 10) + 1; //lo paso a int y le sumo uno
	//PING_PRUEBA = primeraparte + ultimoOCTETO;
	PING_PRUEBA = IP.replace(re, "$1"+(parseInt(ultimoOCTETO, 10) + 1));
	
	IP_resultado = PING_PRUEBA.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	
	//crt.Dialog.MessageBox(IP_resultado); // esto esta perfecto!
	
	return IP_resultado;
}

function recortarSUBINT()
{
	for(var indice = 0; indice < INTERFACE.length; indice++){ 
		var c = INTERFACE.substring(indice, indice+1);
		if (c >= '0' && c <= '9') {
			INTERFACE_recortada = INTERFACE.substring(indice, INTERFACE.length);
			//crt.Dialog.MessageBox("it is a number " + INTERFACE_recortada);
			return INTERFACE_recortada;
			
			// it is a number
		} else {
			//crt.Dialog.MessageBox("it isn't " + c);
			// it isn't
		}
	}
	
	return "error no se encontro numero";
}

function enqueestadoestoy()
{

	crt.Screen.Send( ENTER );		// envia un ENTER
	ESTADO = crt.screen.WaitForStrings("Username:", ">", "#", "$", "...");
	switch (ESTADO) {
	  case 2: //Ya estoy dentro del equipo caso HUAWEI
		ESTADO = 2; //Huawei
		crt.Screen.Send( ENTER );
		crt.screen.WaitForString (">");
		columnaActual = crt.screen.CurrentColumn;
		screenrow = crt.screen.CurrentRow;
		EQUIPO = crt.Screen.Get(screenrow, 2, screenrow, columnaActual-2)
		//crt.Dialog.MessageBox(EQUIPO);
		break;
	  case 3: //estoy dentro de un CISCO
		ESTADO = 3; //Cisco
		columnaActual = crt.screen.CurrentColumn;
		screenrow = crt.screen.CurrentRow;
		linealeida = crt.Screen.Get(screenrow, 1, screenrow, 50);
		var re = /^(\w+)\#/g
		EQUIPO = linealeida.replace(re, "$1");
		EQUIPO = EQUIPO.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		MARCA = "CISCO";
		if (EQUIPO != EQUIPO_leido){
			crt.Dialog.MessageBox("los equipos son diferentes " + EQUIPO + " " + EQUIPO_leido);
		}else{
			//crt.Dialog.MessageBox("los equipos son iguales " + EQUIPO + " " + EQUIPO_leido); // esto anda perfecto!
		}
		break;
	  case 4: //no estoy en ningun equipo
		ESTADO = 0;
		loggearse();
		//USUARIO = crt.Dialog.Prompt("Ingrese su usuario")
		//pass = crt.Dialog.Prompt("Ingrese su password:", "Logon Script", "", True)
		break;
	  default:
		break;
	}
}

function abrirINPUT(file, filedatos, index, CVLAN, SVLAN, ESTADO)
{
	crt.Dialog.MessageBox("FORMATO DE EJEMPLO: Gi1/21");
	var cap, result;
	cap = "Analizador Layer 3";
	
	var g_shell = new ActiveXObject("WScript.Shell");
	g_shell.Run(NombreArchivo_Entrada); //abro el Input.txt cargo los datos, guardo y cierro
	
	crt.Screen.Send( "" + "\015" );		// envia un comando
	verific = crt.Dialog.MessageBox("Continuar?", cap, BUTTON_YESNO);
 
	if (verific == IDYES){
		return 0;
	}else return 1; //considero 1 para salir
	
}

function salirdelequipo()
{	
	if ( MARCA == "HUAWEI" )
	{
		crt.Screen.Send( "quit" + "\015" );
	}else crt.Screen.Send( "exit" + "\015" );
	
	crt.Screen.WaitForString( "$" );
		
	crt.Screen.Synchronous = true;
	
}



function tirarComandos()
{	
	var fso2, comandos, fila, salir, obtenido, DATO, regular, linealeida, lngPos, variable;
	
	fso2 = new ActiveXObject("Scripting.FileSystemObject");
	fsoRegEx = new ActiveXObject("Scripting.FileSystemObject");
	
	switch(MARCA) {
	  case "HUAWEI":
		comandos = fso2.OpenTextFile("comandos HUAWEI.txt", ForReading);
		regexFile = fsoRegEx.OpenTextFile("regex HUAWEI.txt", ForReading);
		break;
	  case "CISCO":
		comandos = fso2.OpenTextFile("comandos CISCO.txt", ForReading);
		regexFile = fsoRegEx.OpenTextFile("regex CISCO.txt", ForReading);
		break;
	  default:
		// code block
	}
	

	
	crt.Screen.Synchronous = true;
	while ( comandos.AtEndOfStream != true )
	{
		COMANDO = comandos.Readline(); //lee una linea
		crt.Screen.Send( COMANDO + "\015" );		// envia el comando
		//crt.Screen.WaitForString( "#" );
		
		//aca PARSEO
		linealeida = regexFile.Readline();
		lngPos = linealeida.indexOf(",");
		if (lngPos!=-1) { //  encontré una coma ,
		  	variable = linealeida.substring(0, lngPos);
			regular =  linealeida.substring(lngPos+1, linealeida.length-1); //lee la linea de la expresion regular
			//crt.Dialog.MessageBox(regular);
		}else crt.Dialog.MessageBox("ERROR");	
		re = new RegExp(regular);		//crea una regExp a partir de ese string leido
		fila = crt.screen.CurrentRow; //fila actual
		readline = crt.Screen.Get(fila, 1, fila, 200);
		
		switch(MARCA) {
		  case "HUAWEI":
						
			obtenido = readline.match(re);
			if (obtenido != null){	
				crt.Dialog.MessageBox(obtenido);
			}else{
				while ( salir != 2 ){ // si salir = 2 llegue al final del comando
					salir = crt.Screen.WaitForStrings("\015", ">");
					fila = crt.screen.CurrentRow; //fila actual
					readline = crt.Screen.Get(fila, 1, fila, 200);
					obtenido = readline.match(re);
					if (obtenido != null) {
						//crt.Dialog.MessageBox(obtenido[1]); // si coindice con la RegExp muestra la variable
						DATO = obtenido[1]; // DATO es lo que queria encontrar
					}
				}
				salir = 0;
			}
			
			break;
		  case "CISCO":
						
			obtenido = readline.match(re);
			if (obtenido != null){	
				crt.Dialog.MessageBox(obtenido);
			}else{
				while ( salir != 2 ){ // si salir = 2 llegue al final del comando
					salir = crt.Screen.WaitForStrings("\015", "#");
					fila = crt.screen.CurrentRow; //fila actual
					readline = crt.Screen.Get(fila, 1, fila, 200);
					obtenido = readline.match(re);
					if (obtenido != null) {
						//crt.Dialog.MessageBox(obtenido[1]); // si coindice con la RegExp muestra la variable
						DATO = obtenido[1]; // DATO es lo que queria encontrar
					}
				}
				salir = 0;
			}
		  
			/*
			var re = /(ASR\s\d+)\s\d+[\s\S+]+/g
			crt.Screen.WaitForString( "PEM" );
			fila = crt.screen.CurrentRow; //fila actual
			readline = crt.Screen.Get(fila, 1, fila, 200);
			MODELO = readline.replace(re, "$1");*/
			break;
		  default:
			// code block
		}
		
		//crt.Screen.WaitForStrings("#", ">");
		//WriteToFile(EQUIPO, IP, MARCA, DATO);
		EscribirEnArchivo(EQUIPO, IP, COMANDO, variable, DATO);
		
		DATO = "sin datos";
		//obtenido = [];
	}
	crt.Screen.Synchronous = true;
	
	comandos.close();
	
	//crt.Dialog.MessageBox("Termine de tirar los comandos");
	//crt.Dialog.MessageBox(MODELO);
	//WriteToFile(EQUIPO, IP, MARCA, MODELO);
	
}

function loggearse()
{
	USUARIO = crt.Dialog.Prompt("Ingrese su usuario", "loggearse", "uXXXXXX", 0);
	pass = crt.Dialog.Prompt("Ingrese su password", "Login", "", 1);
	//para loggearse automaticamente
	//USUARIO = "u564508";
	//pass = "PASS_DE_LAN";
	
}


function ingresarAlEquipo(Equipoaingresar)
{	
	var fila, readline, esperado;
	
	//EQUIPO = f.Readline();
	//COMANDO = "ttelnet " + EQUIPO + "\015";
	COMANDO = "ttelnet " + Equipoaingresar + ENTER;
    crt.Screen.Send( COMANDO );

	crt.Screen.WaitForString( "Trying" );
	fila = crt.screen.CurrentRow; //fila actual
	crt.Screen.WaitForString( "..." );
	readline = crt.Screen.Get(fila, 1, fila, 200);
	
	//aca PARSEO
	var re = /Trying\s(\d+\.\d+\.\d+\.\d+)...\s+/g;
	IP = readline.replace(re, "$1");
	//crt.Dialog.MessageBox(DATO);
	
	
	//[A-Z]\w+\s\d+\s\w+\s\w+\s\w+:\s(\d+)\s\w+/\w+,\s\d+\s\w+/\w+ // trafico
	
    // wait for the prompt before continuing with the next send.
    crt.Screen.WaitForString( "Username:" );
	crt.Screen.Send( USUARIO + "\015" );
	crt.Screen.WaitForString( "Password:" );
	crt.Screen.Send( pass + "\015" );
	//crt.Screen.WaitForString( "#" );
	esperado = crt.Screen.WaitForStrings("#", ">");
	switch (esperado) {
		case 1: 
			MARCA = "CISCO";
			fila = crt.screen.CurrentRow; //fila actual
			readline = crt.Screen.Get(fila, 1, fila, 200);
			re = /(\w+)#/g;
			EQUIPO = readline.replace(re, "$1").replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // le quito los espacios en blanco;
			Equipo_gestor = EQUIPO + "#";
			break;
		case 2: 
			MARCA = "HUAWEI";
			fila = crt.screen.CurrentRow; //fila actual
			readline = crt.Screen.Get(fila, 1, fila, 200);
			re = /<(\w+)>/g;
			EQUIPO = readline.replace(re, "$1").replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // le quito los espacios en blanco;
			Equipo_gestor = "<"+ EQUIPO + ">";
			break;
		default:
			crt.Dialog.MessageBox("Error al ingresar al EQUIPO " + esperado);
			EQUIPO = "ERROR";
			break;
	}
	
	//WriteToFile(EQUIPO, IP, MARCA, "MODELO");
	
	//crt.Dialog.MessageBox("hasta aca esta bien ");
}


function armarFILA(EQUIPO, IP)
{
	tabla[indice] = [EQUIPO, IP];
	indice++;	
}

function tablaCSV()
{
	var A = [['n','sqrt(n)']];  // initialize array of rows with header row as 1st item
		  
	for(var j=1;j<10;++j){ 
		A.push([j, Math.sqrt(j)]) 
	}
	 
	var csvRows = [];
	for(var i=0,l=A.length; i<l; ++i){
			csvRows.push(A[i].join(','));   // unquoted CSV row
	}
	var csvString = csvRows.join('\n');
	 
	var a = document.createElement('a');
	a.href     = 'data:attachment/csv,' + csvString;
	a.target   ='_blank';
	a.download = 'myFile.csv,' + encodeURIComponent(csvString); ;
	a.innerHTML = "Click me to download the file.";
	document.body.appendChild(a);
}

function WriteToFile(texto1, texto2, tex3, t4) 
{ 	
	//el orden correcto sería EQUIPO IP Marca Modelo
	FileOUT.WriteLine(texto1 + "," + texto2 +","+ tex3 +","+ t4); 
}

function EscribirEnArchivo(t1, t2, t3, t4, t5) 
{ 	
	//el orden correcto sería EQUIPO IP Marca Modelo
	//FileOUT.WriteLine(t1 +"	"+ t2 +"	"+ t3 +"	"+ t4 +"	"+ t5); 
	FileOUT.WriteLine(t1 +","+ t2 +","+ t3 +","+ t4 +","+ t5); 
}


function formaPROdetirarcomandosqueandamal()
{
	for(var j=0;j<comandos.length; j++){ 
		
		for(var k=0;k<PALABRASCLAVE.length; k++){ 
			//aca PARSEO
			/*
			var regular =  "INTERFACE";
			var re = new RegExp(regular);		//crea una regExp a partir de ese string leido
			COMANDO = comandos[j].replace(re, INTERFACE);
			*/
			
			regular = PALABRASCLAVE[k];
			var mireexp = new RegExp(regular);
			hallado = comandos[j].match(mireexp);
			if ( hallado != null ){
				//COMANDO = comandos[j].replace(mireexp, INTERFACE);
				COMANDO = comandos[j].replace(mireexp, DATOS[k]);
				//sh int Te0/6/0/0.613003653 // ok!
				//sh run int Te0/6/0/0.613003653 // ok!
				//sh run vrf diaarg-vpn //ok
				//sh run router bgp 7303 vrf VRF neighbor 192.168.251.54 // comandos 3
				//sh bgp vrf VRF neighbors 192.168.251.54 routes 		// comandos 4
				//sh arp  vrf RP/0/8/CPU0:C2PARAGUAY#sh bgp VRF neighbors 192.168.251.54 routes INTERFACE
				//sh bgp vrf VRF summary | inc 192.168.251.54
				//sh run router static vrf RP/0/8/CPU0:C2PARAGUAY#sh arp  RP/0/8/CPU0:C2PARAGUAY#sh bgp VRF neighbors 192.168.251.54 routes INTERFACE
				//ping vrf VRF 192.168.251.54
				
				//no lo esta haciendo bien no puede reemplazar mas de una palabra por comando parece
			}
		}
		crt.Screen.Send ( COMANDO + ENTER );		// envia el comando
		
		Salir = crt.screen.WaitForStrings (String.fromCharCode(13), "#");
		while ( Salir != 2 )
		{
			columnaActual = crt.screen.CurrentColumn;
			screenrow = crt.screen.CurrentRow;			// fila actual
			readline = crt.Screen.Get(screenrow, 1, screenrow, 200);
			
			//aca PARSEO
			for(var i=0;i<ExpresionesREGULARES.length; i++){ 
				expresion = ExpresionesREGULARES[i];
				hallado = readline.match(expresion);
				
				if ( hallado != null ){
					//DATO = readline.replace(expresion, "$1");
					//crt.Dialog.MessageBox(readline + " " + DATO);
					switch (i) {
						case 0: 
							DESCRIPCION = readline.replace(expresion, "$1");
							DESCRIPCION = DESCRIPCION.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							//crt.Dialog.MessageBox("DESCRIPCION " + DESCRIPCION);
							break;
						case 1: 
							BANDWIDTH = readline.replace(expresion, "$1");
							BANDWIDTH = BANDWIDTH.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							//crt.Dialog.MessageBox("BANDWIDTH "+ BANDWIDTH);
							break;
						case 2: 
							policy_input = readline.replace(expresion, "$1");
							policy_input = policy_input.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							DATOS[3] = policy_input;
							//crt.Dialog.MessageBox("policy_input " + policy_input);
							break;
						case 3: 
							VRF = readline.replace(expresion, "$1");
							VRF = VRF.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							DATOS[1] = VRF;
							//crt.Dialog.MessageBox("VRF " + VRF);
							break;
						case 4: 
							ip_WAN = readline.replace(expresion, "$1");
							ip_WAN = ip_WAN.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							mascara_WAN = readline.replace(expresion, "$2");
							mascara_WAN = mascara_WAN.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							NEXTHOP = SiguienteIP(ip_WAN);
							DATOS[2] = NEXTHOP;
							//crt.Dialog.MessageBox("WAN y mascara " + ip_WAN + "_" + mascara_WAN);
							//esto no esta perfecto porque la mascara de wan me la muestra en la siguiente linea
							break;
						case 5: 
							SVLAN = readline.replace(expresion, "$1");
							SVLAN = SVLAN.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							CVLAN = readline.replace(expresion, "$2");
							CVLAN = CVLAN.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							break;
						default:
							break;
					}
				}
			}
			
			
			Salir = crt.screen.WaitForStrings ( String.fromCharCode(13), "#");
		}
		Salir = 0;
	}
}


function Analizar_TRAFICO(trafico)
{	
	//var resultado;
	
	if (trafico >= 1000000000){
		trafico = trafico / 1000000000 + " Gbps" ;
	}else if (trafico >= 1000000 ) {
		trafico = trafico / 1000000 + " Mbps" ;
	}else if (trafico >= 1000) {
		trafico = trafico / 1000 + " kbps";
	}else trafico = trafico + " bps";
	
	//crt.Dialog.MessageBox("trafico " + trafico);
	return trafico;
}	

function enable()
{	
	ENTER = "\015";
	COMANDO = "enable" + ENTER;
    crt.Screen.Send( COMANDO );
	
	crt.Screen.WaitForString( "Password:" );
	crt.Screen.Send( pass + ENTER );
	crt.Screen.WaitForStrings(Equipo_gestor);
	
}

function podar(texto) // mi propia funcion trim
{
	textorecortado = texto.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // le quito los espacios en blanco
	return textorecortado;
}

function podarderecha(texto) // mi propia funcion trim
{
	textorecortado = texto.replace(/\s\s*$/, ''); // le quito los espacios en blanco
	return textorecortado;
}