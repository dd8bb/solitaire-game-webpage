



			/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

			// Array de palos
      let palos = ["corazones", "picas", "rombos", "treboles"];
      
			// Array de número de cartas
		let numeros = ["as", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jota", "reina", "rey"];
			// En las pruebas iniciales solo se trabará con cuatro cartas por palo:
			// let numeros = [10, "jota", "reina", "rey"];

      // paso (top y left) en pixeles de una carta a la anterior en un mazo
      let paso = 10;
	  // init_top indica en pixeles el paso de una carta a la anterior (top) para la representación en los tapetes inferiores
	  let init_top = 50;

			// Tapetes				
			let tapete_inicial   = document.getElementById("inicial");
			let tapete_sobrantes = document.getElementById("sobrantes");
			let tapete_receptor1 = document.getElementById("receptor1");
			let tapete_receptor2 = document.getElementById("receptor2");
			let tapete_receptor3 = document.getElementById("receptor3");
			let tapete_receptor4 = document.getElementById("receptor4");
			let tapete_inferior1 = document.getElementById("inferior1");
			let tapete_inferior2 = document.getElementById("inferior2");
			let tapete_inferior3 = document.getElementById("inferior3");
			let tapete_inferior4 = document.getElementById("inferior4");
			let tapete_inferior5 = document.getElementById("inferior5");
			let tapete_inferior6 = document.getElementById("inferior6");
			let tapete_inferior7 = document.getElementById("inferior7");

			// Mazos
			let mazo_inicial   = [];
			let mazo_sobrantes = [];
			let mazo_receptor1 = [];
			let mazo_receptor2 = [];
			let mazo_receptor3 = [];
			let mazo_receptor4 = [];
			let mazo_inferior1 = [];
			let mazo_inferior2 = [];
			let mazo_inferior3 = [];
			let mazo_inferior4 = [];
			let mazo_inferior5 = [];
			let mazo_inferior6 = [];
			let mazo_inferior7 = [];

			// Contadores de movimientos
			let cont_movimientos = document.getElementById("cont_movimientos");
			
			

			// Tiempo
			let cont_tiempo  = document.getElementById("cont_tiempo"); // span cuenta tiempo
			let segundos 	   = 0;    // cuenta de segundos
			let temporizador = null; // manejador del temporizador

			/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

			 

			// Rutina asociada a boton reset: comenzar_juego
			document.getElementById("reset").onclick = comenzar_juego;
			

			// Inicio juego
			comenzar_juego();
			// Evento asociado a hacer click en el mazo inicial: pasar_carta
			tapete_inicial.onclick = pasar_carta;


			/************************************* FUNCIONES ***********************************************/
			
			function pasar_carta(){
			/* Esta función es activada cuando se hace click sobre el tapete inicial, pasa la carta top del mazo inicial al de sobrantes , la hace visible y draggable.*/
				
				if (tapete_inicial.mazo.length == 0){// Evaluamos si quedan cartas en el mazo inicial
					mover_mazo(tapete_sobrantes,tapete_inicial); // Pasa todas las cartas de sobrantes al mazo inicial.
				}
				else {
					carta = tapete_inicial.mazo[tapete_inicial.mazo.length-1]; //cogemos carta top

					quitar_carta(tapete_inicial,carta); // La quitamos del mazo inicial y la añadimos al de sobrantes
					colocar_carta(tapete_sobrantes,carta);

					carta.setAttribute("data-visible", true); // Mostramos la carta
					CARTA = carta.id;
					PATH = "img/baraja/" + CARTA + ".png";
					carta.setAttribute("src",PATH);
				

					configurar_carta(tapete_sobrantes.mazo); // Hacemos a ésta carta draggable
					inc_contador(cont_movimientos);

				}
				
			}

			function se_puede_añadir(carta,tapete_receptor){
				/* Esta función evalúa si es posible incluir la carta en el mazo receptor en función de las condiciones
				   del solitario.
				   Se entiende que la primera carta a dejar es el as y se van añadiendo la carta siguiente
				   en el orden correspondiente hasta el rey.
				*/

				num = carta.dataset["nombre"]; // Obtenemos el número de la carta
				palo_carta = carta.dataset["palo"]; // Y el palo

				if (tapete_receptor.mazo.length == 0 && num == "as"){
					return true 
				}
				else if (tapete_receptor.mazo.length > 0){

					carta_anterior = tapete_receptor.mazo[tapete_receptor.mazo.length-1]; // Obtenemos la última carta en ese mazo
					num_anterior = carta_anterior.dataset["nombre"];
					palo_mazo = carta_anterior.dataset["palo"]; //Obtenemos el palo del mazo y número de la carta

					if (palo_mazo == palo_carta){
						//La carta es del mismo palo que el mazo
						if (numeros.indexOf(num) == numeros.indexOf(num_anterior) + 1) {
							// Si la carta a dejar es la siguiente en el orden indicado en el array números
							return true
						}
						else {
							// En cualquier otro caso no se puede añadir
							return false
						}
					}
					

				}
			}

			function se_puede_añadir_inferior(carta,tapete_receptor) {
			/* Esta función evalúa si es posible incluir la carta en un mazo inferior en función de las condiciones
				   del solitario para los mazos inferiores.
				   Se entiende que si el tapete inferior está vacio se puede dejar un rey, si no la carta a dejar tiene que ser de color contrarior al color de la última carta y de valor inferior consecutivo.
				*/
				color_carta = carta.dataset["color"];
				num_carta = carta.dataset["nombre"];

				if (tapete_receptor.mazo.length == 0 && num_carta == "rey"){
					return true ;
				}
				else if (tapete_receptor.mazo.length > 0){

					carta_inferior = tapete_receptor.mazo[tapete_receptor.mazo.length-1]; // Obtenemos la última carta en ese mazo
					color_inferior = carta_inferior.dataset["color"]; // Obtenemos color carta y número
					num_inferior = carta_inferior.dataset["nombre"];

					if (color_carta != color_inferior && numeros.indexOf(num_carta) == numeros.indexOf(num_inferior) - 1){
						return true;
					}
					else {
						return false;
					}	
				}
			}		
			

			function ha_acabado(){
				/* Esta función evalúa si se ha acabado el juego, siendo cuando se han colocoado los 4 mazos completos en cada mazo receptor*/

				if (mazo_receptor1.length == 13 && mazo_receptor2.length == 13 && mazo_receptor3.length == 13 && mazo_receptor4.length ==13) {
					return true
				}
				else {
					return false
				}
			}

			function colocar_carta(tapete,carta){
				/* Esta función se encarga de añadir la carta al mazo y al tapete para que sea visualizada correctamente,
				   además asigna la nueva procedencia de la carta. Es utilizada en los tapetes superiores.
				*/
				

				carta.setAttribute("data-procedencia",tapete.id);
				tapete.mazo.push(carta);
				carta.style.top = "50%"; 
				carta.style.left = "50%";
				carta.style.transform="translate(-50%, -50%)";
				tapete.appendChild(carta);
			}

			function colocar_carta_inferior(tapete,carta){
				/* Esta función se encarga de añadir la carta al mazo de los tapetes inferiores para que sea visualizada correctamente,
				   además asigna la nueva procedencia de la carta.
				*/
				
				var length= tapete.mazo.length;
				carta.setAttribute("data-procedencia",tapete.id);
				tapete.mazo.push(carta);
				
				var top = init_top + length*paso;
				top += "px";
				carta.style.top = top;
				carta.style.left = "50%";
				tapete.appendChild(carta);

			}
			function colocar_multiples_cartas(tapete_procedencia,tapete_destino,index_carta){
				/*Esta función mueve múltiples cartas entre tapetes inferiores*/
					cartas = [];			
				for(i=index_carta;i > 0;i--){
					carta = tapete_procedencia.mazo[tapete_procedencia.mazo.length - i];
					console.log(carta);
					cartas.push(carta);
				}
				for(i=0; i < cartas.length; i++){
					carta = cartas[i];
					quitar_carta(tapete_procedencia,carta);
					colocar_carta_inferior(tapete_destino,carta);
				}
			}

			function quitar_carta(tapete,carta){
				/* Esta función quita una carta del mazo del tapete además de decrementar en uno su contador
				*/
				tapete.mazo.pop(carta);
				tapete.removeChild(carta);

			}

			function al_mover(e) {
				/* Esta función transfiere los atributos indicados por la carta cogida al evento para que éstos
					puedan ser utilizados posteriormente por el evento.
				*/
				carta_jugada = this;

				e.dataTransfer.setData( "text/plain/id", e.target.id); 
				e.dataTransfer.setData( "text/plain/procedencia", e.target.dataset["procedencia"]);

			}

			function soltar(e){

				e.preventDefault(); // Evitamos cualquier acción por defecto

				//Obtenemos los parámetros de la carta a través del evento y los guardamos en variables para su uso
				id_carta = e.dataTransfer.getData("text/plain/id")
				procedencia_carta = e.dataTransfer.getData("text/plain/procedencia");


				/*console.log(id_carta);
				console.log(procedencia_carta);
				console.log(carta_jugada);*/

				/* Comprobamos si se ha seleccionado una carta que no es top y obtenemos su index, esto es para mover múltiples cartas en los tapetes inferiores.*/
				if (procedencia_carta == "inferior1"){
					index_carta = tapete_inferior1.mazo.length - tapete_inferior1.mazo.indexOf(carta_jugada);
				}
				else if (procedencia_carta == "inferior2"){
					index_carta = tapete_inferior2.mazo.length - tapete_inferior2.mazo.indexOf(carta_jugada);
				}
				else if (procedencia_carta == "inferior3"){
					index_carta = tapete_inferior3.mazo.length - tapete_inferior3.mazo.indexOf(carta_jugada);
				}
				else if (procedencia_carta == "inferior4"){
					index_carta = tapete_inferior4.mazo.length - tapete_inferior4.mazo.indexOf(carta_jugada);
				}
				else if (procedencia_carta == "inferior5"){
					index_carta = tapete_inferior5.mazo.length - tapete_inferior5.mazo.indexOf(carta_jugada);
				}
				else if (procedencia_carta == "inferior6"){
					index_carta = tapete_inferior6.mazo.length - tapete_inferior6.mazo.indexOf(carta_jugada);
				}
				else if (procedencia_carta == "inferior7"){
					index_carta = tapete_inferior7.mazo.length - tapete_inferior7.mazo.indexOf(carta_jugada);
				}
				else {
					index_carta = 1;
				}
				
				//Después realizamos las condiciones para dejar la carta
				tapete_destino = this; //soltar es llamada por el evento ondrop asignado a los tapetes, por lo que el elemento this es el tapete receptor.
				
				
				
				if (tapete_destino.id == "receptor1" || tapete_destino.id == "receptor2" || tapete_destino.id == "receptor3" || tapete_destino.id == "receptor4") {
					//Condición para dejar cartas en los tapetes receptores

						if (procedencia_carta != "receptor1" || procedencia_carta != "receptor2" || procedencia_carta != "receptor3" || procedencia_carta != "receptor4") { // Si no proviene de ningun mazo receptor.

						
							if (se_puede_añadir(carta_jugada,tapete_destino)) {

								
								if (procedencia_carta == "sobrantes"){
									quitar_carta(tapete_sobrantes,carta_jugada);
								}
								else if (procedencia_carta == "inferior1" && index_carta == 1){
									quitar_carta(tapete_inferior1,carta_jugada);
								}
								else if (procedencia_carta == "inferior2" && index_carta == 1){
									quitar_carta(tapete_inferior2,carta_jugada);
								}
								else if (procedencia_carta == "inferior3" && index_carta == 1){
									quitar_carta(tapete_inferior3,carta_jugada);
								}
								else if (procedencia_carta == "inferior4" && index_carta == 1){
									quitar_carta(tapete_inferior4,carta_jugada);
								}
								else if (procedencia_carta == "inferior5" && index_carta == 1){
									quitar_carta(tapete_inferior5,carta_jugada);
								}
								else if (procedencia_carta == "inferior6" && index_carta == 1){
									quitar_carta(tapete_inferior6,carta_jugada);
								}
								else if (procedencia_carta == "inferior7" && index_carta == 1){
									quitar_carta(tapete_inferior7,carta_jugada);
								}
								

								
								
								colocar_carta(tapete_destino,carta_jugada);
								inc_contador(cont_movimientos);
							}
						}
						
				}
				else {
				/* Si el tapete destino no es ninguno de los receptores significa que el tapete destino es uno de los inferiores*/
					
					if (procedencia_carta != tapete_destino.id){ // Si no proviene del mismo tapete.
						
						if (se_puede_añadir_inferior(carta_jugada,tapete_destino)){ // Si se cumple las condicion para dejar en tapete inferior

							
							if (procedencia_carta == "sobrantes"){
								quitar_carta(tapete_sobrantes,carta_jugada);
							}
							else if (procedencia_carta == "receptor1"){
								quitar_carta(tapete_receptor1,carta_jugada);
							}
							else if (procedencia_carta == "receptor2"){
								quitar_carta(tapete_receptor2,carta_jugada);
							}
							else if (procedencia_carta == "receptor3"){
								quitar_carta(tapete_receptor3,carta_jugada);
							}
							else if (procedencia_carta == "receptor4"){
								quitar_carta(tapete_receptor4,carta_jugada);
							}
							else if (procedencia_carta == "inferior1"){
								if (index_carta == 1){
									quitar_carta(tapete_inferior1,carta_jugada);
								}
								else {
									colocar_multiples_cartas(tapete_inferior1,tapete_destino,index_carta);
								}
								
							}
							else if (procedencia_carta == "inferior2"){
								if (index_carta == 1){
									quitar_carta(tapete_inferior2,carta_jugada);
								}
								else {
									colocar_multiples_cartas(tapete_inferior2,tapete_destino,index_carta);
								}
							}
							else if (procedencia_carta == "inferior3"){
								if (index_carta == 1){
									quitar_carta(tapete_inferior3,carta_jugada);
								}
								else {
									colocar_multiples_cartas(tapete_inferior3,tapete_destino,index_carta);
								}
							}
							else if (procedencia_carta == "inferior4"){
								if (index_carta == 1){
									quitar_carta(tapete_inferior4,carta_jugada);
								}
								else {
									colocar_multiples_cartas(tapete_inferior4,tapete_destino,index_carta);
								}
							}
							else if (procedencia_carta == "inferior5"){
								if (index_carta == 1){
									quitar_carta(tapete_inferior5,carta_jugada);
								}
								else {
									colocar_multiples_cartas(tapete_inferior5,tapete_destino,index_carta);
								}
							}
							else if (procedencia_carta == "inferior6"){
								if (index_carta == 1){
									quitar_carta(tapete_inferior6,carta_jugada);
								}
								else {
									colocar_multiples_cartas(tapete_inferior6,tapete_destino,index_carta);
								}
							}
							else if (procedencia_carta == "inferior7"){
								if (index_carta == 1){
									quitar_carta(tapete_inferior7,carta_jugada);
								}
								else {
									colocar_multiples_cartas(tapete_inferior7,tapete_destino,index_carta);
								}
							}

							if (index_carta == 1){
								colocar_carta_inferior(tapete_destino,carta_jugada);
							}
							inc_contador(cont_movimientos);
						}


					}
				}
				
				
				// actualizamos los parámetros draggable de las cartas de los mazos inicial y sobrante para que
				// solo se pueda coger la última carta depositada.
				//configurar_carta(tapete_inicial.mazo);
				configurar_carta(tapete_sobrantes.mazo);
				configurar_carta_inferior(tapete_inferior1.mazo);
				configurar_carta_inferior(tapete_inferior2.mazo);
				configurar_carta_inferior(tapete_inferior3.mazo);
				configurar_carta_inferior(tapete_inferior4.mazo);
				configurar_carta_inferior(tapete_inferior5.mazo);
				configurar_carta_inferior(tapete_inferior6.mazo);
				configurar_carta_inferior(tapete_inferior7.mazo);

				

				// Finalmente evaluamos si el juego ha acabado, en ese caso indicamos que se ha ganado y reiniciamos el juego
				if (ha_acabado()){
					message = `Felicidades has ganado!!. \n Duración: ${cont_tiempo.textContent}.\n Movimientos realizados: ${cont_movimientos.textContent}.`;
					alert( message ) ;
					setTimeout(function(){
						comenzar_juego(); // Esperamos dos segundos para reiniciar el juego y que se vea completado.
					}, 2000);	
				}


			}

			function mover_mazo(tapete_procedencia, tapete_destino){
				/* Esta función mueve las cartas del mazo de sobrantes al inicial, ocultando las cartas y haciendo a éstas no draggables*/

				var len = tapete_procedencia.mazo.length;
				for (i=0; i< len  ; i++){
					carta = tapete_procedencia.mazo[tapete_procedencia.mazo.length - 1];
					quitar_carta(tapete_procedencia,carta);
					carta_top.draggable = false;	
					carta.setAttribute("data-visible", false);
					PATH = "img/baraja/back-card.png";
					carta.setAttribute("src",PATH);
					colocar_carta(tapete_destino,carta);
				}
			}

			function configurar_carta(mazo){
				/* Esta función indica las acciones a realizar sobre la carta top de un mazo,
				indicando primero que ésta es draggable y configurando después los eventos
				Drag&Drop para que al ser cogida se llame a la función al_mover().
				*/

				if(mazo.length != 0){ //Evitamos realizar cualquier acción si el mazo está vacío.

					if (mazo.length != 1){
						for (i = 0; i < mazo.length - 1; i++){ //Hacemos todas las cartas que no sea top no draggable
							mazo[i].draggable = false;
						}
						
					}

					carta_top = mazo[mazo.length - 1];
					carta_top.draggable = true;
					carta_top.ondrag = function(e) { };
					carta_top.ondragend = function(e) { };
					carta_top.ondragstart = al_mover;
				}

			}

			function configurar_carta_inferior(mazo){
			/* Esta funcion configura la opcion dragable de las cartas de los mazos inferiores, permitiendo coger la última carta de un mazo o un conjunto de cartas que estén en orden en ese mazo. */

				if(mazo.length != 0){ //Evitamos realizar cualquier acción si el mazo está vacío.

					if (mazo.length != 1){

						for (i = 0; i < mazo.length - 1; i++){ //Hacemos todas las cartas que no sea top no draggable
							mazo[i].draggable = false;
						}
					}
					
					carta_top = mazo[mazo.length - 1];
					carta_top.draggable = true;
					carta_top.ondrag = function(e) { };
					carta_top.ondragend = function(e) { };
					carta_top.ondragstart = al_mover;

					es_visible = carta_top.dataset["visible"]

					if (es_visible == "false"){ // Si la carta top está tapada se cambia para que sea visible.

						carta_top.setAttribute("data-visible", true);
						CARTA = carta_top.id;
						PATH = "img/baraja/" + CARTA + ".png";
						carta_top.setAttribute("src",PATH);
						
					}

					if (mazo.length > 1){ // Condicion para hacer draggable cartas en orden
						
						
						carta_top_num = carta_top.dataset["nombre"];
						carta_top_color = carta_top.dataset["color"];
						cont = -2;

						while (mazo.length + cont != -1){
							carta_anterior = mazo[mazo.length + cont];
							num_anterior = carta_anterior.dataset["nombre"];
							color_anterior = carta_anterior.dataset["color"];
							
							if (numeros.indexOf(carta_top_num) == numeros.indexOf(num_anterior) - 1 && carta_top_color != color_anterior) {
								
								carta_anterior.draggable = true;
								carta_anterior.ondrag = function(e) { };
								carta_anterior.ondragend = function(e) { };
								carta_anterior.ondragstart = al_mover;
								carta_top = carta_anterior;
								carta_top_num = num_anterior;
								carta_top_color = color_anterior;
								cont += -1;
							}
							else {
								cont = - mazo.length -1;
							}		
						}					
					}
				}
			} // configurar_carta_inferior

			function configurar_tapete(destino){
				/*  Esta función ajusta la configuración de los parámetros de 
					los eventos Drag & Drop para los tapetes de manera que se 
					actúe según el evento ocurrido. 
					(solo vamos a utilizar el evento drop)  
				*/

				// Los eventos ondragenter, ondragover, ondraleave son omitidos.
				destino.ondragenter = function(e) { e.preventDefault(); };

				destino.ondragover = function(e) { e.preventDefault(); };

				destino.ondraleave = function(e) { e.preventDefault(); };

				destino.ondrop = soltar;  // Se llama a la función soltar on drop.

			}

			function vaciar_tapete(tapete){
				/* Esta función elimina todas las cartas que tiene añadidas el tapete 
				*/
				
				while(tapete.hasChildNodes()){
					tapete.removeChild(tapete.firstChild); // Elimina del elemento tapete el primer hijo anidado a él.
				}
			}

			function comenzar_juego() {

				/* Crear el mazo inicial con toda la baraja. Este será un array cuyos 
				elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
				Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
				oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
				el path correcto en la URL asociada al atributo src de <img>). Una vez creado
				el elemento img, inclúyase como elemento del array mazo_inicial. 
				*/
				/* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	
				var i,j
				
				/* Eliminamos todas las cartas de los tapetes */
				vaciar_tapete(tapete_inicial);
				vaciar_tapete(tapete_sobrantes);
				vaciar_tapete(tapete_receptor1);
				vaciar_tapete(tapete_receptor2);
				vaciar_tapete(tapete_receptor3);
				vaciar_tapete(tapete_receptor4);
				vaciar_tapete(tapete_inferior1);
				vaciar_tapete(tapete_inferior2);
				vaciar_tapete(tapete_inferior3);
				vaciar_tapete(tapete_inferior4);
				vaciar_tapete(tapete_inferior5);
				vaciar_tapete(tapete_inferior6);
				vaciar_tapete(tapete_inferior7);




				/*Vaciamos el array mazo_inicial para cada vez que reiniciemos el juego ,
				 también vaciamos el resto de arrays que representan los otros mazos */
				mazo_inicial = []; 
				mazo_receptor1 = [];
				mazo_receptor2 = [];
				mazo_receptor3 = [];
				mazo_receptor4 = [];
				mazo_sobrantes = [];
				mazo_inferior1 = [];
				mazo_inferior2 = [];
				mazo_inferior3 = [];
				mazo_inferior4 = [];
				mazo_inferior5 = [];
				mazo_inferior6 = [];
				mazo_inferior7 = [];


				//Asignamos a cada tapete su mazo.
				tapete_inicial.mazo = mazo_inicial;
				tapete_receptor1.mazo = mazo_receptor1;
				tapete_receptor2.mazo = mazo_receptor2;
				tapete_receptor3.mazo = mazo_receptor3;
				tapete_receptor4.mazo = mazo_receptor4;
				tapete_sobrantes.mazo = mazo_sobrantes;
				tapete_inferior1.mazo = mazo_inferior1;
				tapete_inferior2.mazo = mazo_inferior2;
				tapete_inferior3.mazo = mazo_inferior3;
				tapete_inferior4.mazo = mazo_inferior4;
				tapete_inferior5.mazo = mazo_inferior5;
				tapete_inferior6.mazo = mazo_inferior6;
				tapete_inferior7.mazo = mazo_inferior7;


				
				/* Rellenamos el mazo con las cartas*/
				for (i = 0; i < palos.length; i++){
					for (j = 0;j < numeros.length; j++){
						let carta = document.createElement("img");
						NOMBRE = numeros[j];
						PALO = palos[i];
						CARTA = NOMBRE + "-" + PALO
						//PATH = "img/baraja/" + CARTA + ".png";
						PATH = "img/baraja/back-card.png";
						carta.setAttribute("src",PATH);
						carta.setAttribute("id",CARTA);
						carta.setAttribute("data-nombre",NOMBRE);
						carta.setAttribute("data-palo",PALO);
						carta.setAttribute("data-procedencia","inicial"); // Añadimos atributo procedencia, fijado inicialmente a "inicial"
						carta.setAttribute("data-visible", false); // Indicamos si la carta es visible.

						if (PALO == "corazones" || PALO == "rombos"){
							carta.setAttribute("data-color","rojo");
						}
						else {
							carta.setAttribute("data-color","negro");
						}
						mazo_inicial.push(carta)

					}
				}
				/*console.log(mazo_inicial)*/
        /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        

				// Barajar
				barajar(mazo_inicial);

				// Dejar mazo_inicial en tapete inicial
				cargar_tapete_inicial(mazo_inicial);

				// Puesta a cero de contador de movimientos
				set_contador(cont_movimientos, 0)
				
				

				//  Se inicializa la configuración de los tapetes y la carta top del mazo inicial
				// para los eventos Drag&Drop
				//configurar_tapete(tapete_inicial);
				configurar_tapete(tapete_sobrantes);
				configurar_tapete(tapete_receptor1);
				configurar_tapete(tapete_receptor2);
				configurar_tapete(tapete_receptor3);
				configurar_tapete(tapete_receptor4);
				configurar_tapete(tapete_inferior1);
				configurar_tapete(tapete_inferior2);
				configurar_tapete(tapete_inferior3);
				configurar_tapete(tapete_inferior4);
				configurar_tapete(tapete_inferior5);
				configurar_tapete(tapete_inferior6);
				configurar_tapete(tapete_inferior7);
				//configurar_carta(tapete_inicial.mazo);
				configurar_carta_inferior(tapete_inferior1.mazo);
				configurar_carta_inferior(tapete_inferior2.mazo);
				configurar_carta_inferior(tapete_inferior3.mazo);
				configurar_carta_inferior(tapete_inferior4.mazo);
				configurar_carta_inferior(tapete_inferior5.mazo);
				configurar_carta_inferior(tapete_inferior6.mazo);
				configurar_carta_inferior(tapete_inferior7.mazo);
			

				
				// Arrancar el conteo de tiempo
				arrancar_tiempo();

			} // comenzar_juego






			/**
				Se debe encargar de arrancar el temporizador: cada 1000 ms se
				debe ejecutar una función que a partir de la cuenta autoincrementada
				de los segundos (segundos totales) visualice el tiempo oportunamente con el 
				format hh:mm:ss en el contador adecuado.

				Para descomponer los segundos en horas, minutos y segundos pueden emplearse
				las siguientes igualdades:

				segundos = truncar (   segundos_totales % (60)                 )
				minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
				horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

				donde % denota la operación módulo (resto de la división entre los operadores)

				Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
				   00:02:14

				Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
				evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
				el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
				a clearInterval en su caso.   
			*/
			function arrancar_tiempo(){ // Ya completamente implementado: estúdiese
				if (temporizador) clearInterval(temporizador);
        let hms = function (){
          let seg = Math.trunc( segundos % 60 );
          let min = Math.trunc( (segundos % 3600) / 60 );
          let hor = Math.trunc( (segundos % 86400) / 3600 );
          let tiempo =  ( (hor<10)? "0"+hor : ""+hor ) 
                + ":" + ( (min<10)? "0"+min : ""+min )  
                + ":" + ( (seg<10)? "0"+seg : ""+seg );
          set_contador(cont_tiempo, tiempo);
          segundos++;
        }
        segundos = 0;
        hms(); // Primera visualización 00:00:00
        temporizador = setInterval(hms, 1000); // hms() será invocado cada segundo               	
			} // arrancar_tiempo

			



			
			/**
				Si mazo es un array de elementos <img>, en esta rutina debe ser
				reordenado aleatoriamente. Al ser un array un objeto, se pasa
				por referencia, de modo que si se altera el orden de dicho array
				dentro de la rutina, esto aparecerá reflejado fuera de la misma.
				Para reordenar el array puede emplearse el siguiente pseudo código:

				- Recorramos con i todos los elementos del array
					- Sea j un indice cuyo valor sea un número aleatorio comprendido 
						entre 0 y la longitud del array menos uno. Este valor aleatorio
						puede conseguirse, por ejemplo con la instrucción JavaScript
							Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
					- Se intercambia el contenido de la posición i-ésima con el de la j-ésima

			*/
			function barajar(mazo) {
			  /* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	
				
			 	var i;
				for (i=0;i < mazo.length; i++){
					let j = Math.floor( Math.random()* mazo.length);
					var aux = mazo[j];
					mazo[j] = mazo[i];
					mazo[i] = aux;
				}
				/*console.log(mazo)*/
        /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
			} // barajar


			
			/**
			 	En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
				se deben añadir como hijos de DOM todos los elementos <img> del array mazo actual.
				Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
				coordenadas top y left, algun atributo de tipo data-...
				Al final se debe ajustar el contador de cartas a la cantidad oportuna
			*/
			function cargar_tapete_inicial(mazo) {
			  /* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	
				var i;
				var init_left = 10;

				/* Configurar estilo cartas  del mazo */
				for (i=0;i<mazo.length;i++){
					carta = mazo[i];
					carta.style.width = "50px";
					carta.style.position = "absolute"
					carta.style.top = "50%"; 
					carta.style.left = "50%";
					carta.style.transform="translate(-50%, -50%)";
					
				}

				/* Colocar cartas en tapetes inferiores */
				cargar_tapete_inferior(mazo,tapete_inferior1,1);
				cargar_tapete_inferior(mazo,tapete_inferior2,2);
				cargar_tapete_inferior(mazo,tapete_inferior3,3);
				cargar_tapete_inferior(mazo,tapete_inferior4,4);
				cargar_tapete_inferior(mazo,tapete_inferior5,5);
				cargar_tapete_inferior(mazo,tapete_inferior6,6);
				cargar_tapete_inferior(mazo,tapete_inferior7,7);
				
				
				function cargar_tapete_inferior(mazo_ini, tapete_destino,num_cartas){
					/*Esta funcion coloca las cartas tapadas en un tapete inferior de acuerdo al estilo dado para la colocacion de cartas en estos tapetes*/
					


						
					for (i=0; i<num_cartas; i++){
						carta = mazo_ini.pop();
						tapete_destino.mazo.push(carta);
						carta.setAttribute("data-procedencia",tapete_destino.id);
						carta.setAttribute("data-visible", false);
						carta.setAttribute("src","img/baraja/back-card.png");
						var top = init_top + i*paso;
						top += "px";
						carta.style.top = top;
						tapete_destino.appendChild(carta);
					}
					

				}
				

				/* Colocar cartas sobrantes  en mazo inicial */
				for (i=0;i<mazo.length;i++){
					carta = mazo[i];
					
					tapete_inicial.appendChild(carta);
				}

				

				
        /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */	
			} // cargar_tapete_inicial


			/**
			 	Esta función debe incrementar el número correspondiente al contenido textual
			   	del elemento que actúa de contador
			*/
			function inc_contador(contador){
        contador.innerHTML = +contador.innerHTML + 1; // Obsérvese el operador + antes de contador.innerHTML
			} // inc_contador




			/**
				Idem que anterior, pero decrementando 
			*/
			function dec_contador(contador){
			  /* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	
                contador.innerHTML = +contador.innerHTML - 1;
        /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */	
			} // dec_contador



			/**
				Similar a las anteriores, pero ajustando la cuenta al
				valor especificado
			*/
			function set_contador(contador, valor) {
			  /* !!!!!!!!!!!!!!!!!!!!!! CODIGO !!!!!!!!!!!!!!!!!!!! */	
                contador.textContent = valor;
        /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */	
			} // set_contador



