
 let pagina = 1;

 const cita = {
     nombre:'',
     fecha:'',
     hora:'',
     servicios: []
 }


document.addEventListener('DOMContentLoaded', function(){
    iniciarapp();
});


function iniciarapp(){  //Funcion para iniciar funciones 
    mostrarServicios();
    //Resalta el Div Actual segun el tab alque se presiona
    mostrarSeccion ();
    //Oculta o muestra una seccion segun el tab al que se presiona 
    cambiarSeccion();
    //Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();
    //Comprueba la pagina actual para Ocultar o Mostrar la paginacion 
    botonesPaginador();
    //Muestra el mensaje de Validacion de Cita Datos  y servicio en caso d eno pasar la validacion 
    mostrarResumen();
    //Almacenar el nombre de la cita en el objeto 
    nombreCita();
    //Almacenar la fecha del la cita en el Objeto 
    fechaCita();
    //Almacena la hora d ela cita 
    horaCita();
    //Deshabilita dias pasados 
    deshabilitarFechaAnterior();

}

async function mostrarServicios(){
    try {
        const resultado  = await fetch('./servicios.json');
        const db = await resultado.json();
       
        const {servicios} = db;
     
      
        ///Generar  HTML 
        
        servicios.forEach(servicio => {

            const {id, nombre, precio} = servicio; 
            
        //Dom Scripting

        //Generar nombre Servicio 

            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio')
           
         //Generar Precio  Servicio 
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            //console.log(nombreServicio , precioServicio)

        //GENERAR DIV CONTENEDOR 

            const serviciosDiv = document.createElement('DIV');
            serviciosDiv.classList.add('servicios');
            serviciosDiv.dataset.idServicio = id;

        //Selecciona Elemento para la cita 

           serviciosDiv.onclick = seleccionarServicio;



        // Inyectar precio y nombre al DIV de SERVICIO
           serviciosDiv.appendChild(nombreServicio);
           serviciosDiv.appendChild(precioServicio);

           //console.log(serviciosDiv)

        //Inyectarlo al HTML 
          document.querySelector('#servicios').appendChild(serviciosDiv);  


        })
        
    } catch (error) {
         console.log('error')
    }
}


function mostrarSeccion (){

    //Elimina mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Elimina la xclase actula del tab anterior
    const tabAnterior = document.querySelector('.tab .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }


    //Resalta el tab actual 

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}



 function seleccionarServicio(e){
     
    let elemento;
     // Forzar que el elemento al cual dimos click sea el DIV 
     if(e.target.tagName === 'P'){
         elemento = e.target.parentElement;
     }else{
         elemento = e.target;
       
     }

     if(elemento.classList.contains('selecionado')){
         elemento.classList.remove('selecionado');

         const id = parseInt(elemento.dataset.idServicio);
        
         console.log(elemento.dataset.idServicio);

        eliminarServicio(id);

     } else {
         elemento.classList.add('selecionado');

        console.log('');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

         agregarServicio(servicioObj);

         // console.log(servicioObj);
     }
     //console.log(elemento.dataset.idServicio);
 } 

function eliminarServicio(id){
    const  { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj){
    const  { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}



function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace =>{
        enlace.addEventListener('click', e=> {
            e.preventDefault();
            
            pagina = parseInt(e.target.dataset.paso);
            //console.log(pagina);

            //LLamar la funcion d emostrar seccion 
            mostrarSeccion();
            botonesPaginador();


        })
    })
}

function paginaSiguiente(){

    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
    
        console.log(pagina);
        botonesPaginador();
    });
    

}


function paginaAnterior(){

    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
    pagina--;
        
    console.log(pagina);
    botonesPaginador();

    });

}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    
  if(pagina === 1){
     paginaAnterior.classList.add('ocultar');
      
  }else if (pagina === 2 ){
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.remove('ocultar');

  } else if (pagina === 3) {
      paginaSiguiente.classList.add('ocultar');
      paginaAnterior.classList.remove('ocultar');
    
      mostrarResumen(); // stamos en l apagina 3 carga todos los datos 
      
  }
  
  mostrarSeccion(); //Cambia la seccion que se emuestra por la de la pagina

}

 //*****************************FUNCION QUE RECOLECTA TODA LA INFO  */

function mostrarResumen(){
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //Seleccionar el resumen 
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia el HTML previo
      resumenDiv.innerHTML= '';
//******************************************************************* */
    //Limpia el html Previo segunda opcion y mas rapida 
    
    //while ( resumenDiv.firstChild) {
    //    resumenDiv.removeChild( resumenDiv.firstChild);
    //}
//*******************************************************************/

    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P')
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre'
        
        noServicios.classList.add('invalidar-cita');

        //Agregar a resumen DIV

        resumenDiv.appendChild(noServicios);
      
        return;
        }
        
        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen de Cita';

        const nombreCita = document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre:<span/>  ${nombre}`;
       

        //console.log(nombreCita);

        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:<span/> ${fecha} `;

        const horaCita = document.createElement('P');
        horaCita.classList.add('titulo');
        horaCita.innerHTML = `<span>Hora:<span/> ${hora}`;
      


        // creo varable para poder tomar la info de lo servicios 

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de Servicios';
        serviciosCita.appendChild(headingServicios);


        // Iterar sobre el arreglo de servicios y crear Datos 
        let cantidad = 0;

        servicios.forEach( servicio => {
            
           const { nombre , precio } = servicio;
           const contenedorServicios = document.createElement('DIV');
           contenedorServicios.classList.add('contenedor-servicios');

           const textoServicio = document.createElement('P');
           textoServicio.textContent = nombre;

           const precioServicio = document.createElement('P');
           precioServicio.textContent = precio;
           precioServicio.classList.add('precio');

           // Funcion para sacar el total de los servicios 

           const totalServicios = precio.split('$');
           cantidad += parseInt(totalServicios[1].trim());

          

          // console.log(parseInt(totalServicios[1].trim()));

         //Colocar texto y precio en el Div

         contenedorServicios.appendChild(textoServicio);
         contenedorServicios.appendChild(precioServicio);
         serviciosCita.append(contenedorServicios);

        } );

        console.log(cantidad);


        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);
        resumenDiv.appendChild(serviciosCita);

        const cantidadPagar = document.createElement('P');
        cantidadPagar.classList.add('total');
        cantidadPagar.innerHTML = `<span> Total a pagar $ <span/> ${cantidad}`;
       
        resumenDiv.appendChild(cantidadPagar);
       
   
}

   
function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input',(e) =>{
        const nombreTexto = e.target.value.trim();
        //console.log(nombreTexto);
       //Validacion de que nombreTexto debe tener algo 
       if(nombreTexto === ''|| nombreTexto.length <= 3 ) {
          mostrarAlerta('Nombre No Válido...', 'error');
       }else{
        const alerta = document.querySelector('.alerta');
        if(alerta){
            alerta.remove();
        }
           cita.nombre = nombreTexto;
           console.log(cita);
       }

    });
}

function mostrarAlerta (mensaje, tipo){
   
    //Si hay una alerta previa no crear otra 

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }
   

    console.log('El mensaje es ....', mensaje);

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error' ){
        alerta.classList.add('error');
    }
    //Insertar en el HTML 

    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );
    
    // Eliminar la alerta despues de 3 segundos 
    setTimeout(() => {
        alerta.remove();
    }, 3000);

}

function fechaCita(){

    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input',(e) =>{
        //console.log(e.target.value);

        const dia = new Date(e.target.value).getUTCDay();
        if([0].includes(dia)){
           e.preventDefault();
           fechaInput.value = '';
           mostrarAlerta('Fines de Semana no tomamos citas', 'error');
           //alert('No Toamamos turnos los domingos ')
        }else{
            cita.fecha = fechaInput.value;
            console.log(cita);
        }
       
    } );
   
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;

    console.log(fechaDeshabilitar);

}


function horaCita () {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        
        if (hora[0] < 10 || hora [0] > 18){   //Rango horario 
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';

            }, 3000);
        }else{
            cita.hora = horaCita;

           
        }
        console.log(horaCita);

    });
}