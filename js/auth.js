// Variables de acceso a los usuarios
const Usuarios = supabaseClient.from('Usuarios');
// Referencia al formulario
const formulario = document.getElementById('formacc');

// Funcion para obtener todos los usuarios
async function obtenerUsuarios() {
    const { data, error } = await Usuarios.select('*');
    if (error) {
        console.error("Problema al obtener usuarios: ", error);
        return [];
    }
    return data;
}

// Obtener las matriculas y nombres de los usuarios
async function obtenerMatriculasNombres() {
    const data = await obtenerUsuarios();
    if (data.length === 0) {
        console.error("Problema con Usuarios");
        return [];
    }
    return data;
}   

async function verificarCredenciales(email, password) {
    const data = await obtenerUsuarios();
    if (data.length === 0) {
        console.log("Problema con Usuarios");
        return 0;
    }

    for (const usuario of data) {
        if ((usuario.Matricula === email || usuario.CorreoBUAP === email) && usuario.Contrasenia === password) {
            console.log("Credenciales correctas");
            return true;
        }
    }
    console.log("Credenciales incorrectas");
    return false;
}

async function recibirCredenciales() {
    // Aquí va la lógica del botón y llenado de los campos
}

async function registrarUsuario(nuevoUsuario) {

}


/* Pruebas de conexión a supabase
console.log(supabaseClient); 
console.log("Config: ", CONFIG);
console.log("SDK Supabase: ", typeof supabase);
console.log("Cliente inicializado: ", supabaseClient);

console.log("Prueba de acceso a Supabase.");
console.log("Imprimiendo Usuarios: ");
*/

// En caso de ocupar la 'data', modificar la funcion o hacer una funcion async
obtenerMatriculasNombres();
verificarCredenciales("202326736", "prueba123")
