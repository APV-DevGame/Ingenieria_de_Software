// Metodo para la sesión actual
import { setUser } from './sessionStorage.js';

// Variables de acceso a los usuarios
const Usuarios = supabaseClient.from('Usuarios');

// Referencias del login.html
const formulario = document.getElementById('formacc');
const inputEmail = document.getElementById('corr');
const inputPassword = document.getElementById('contrasenia');
const botonLogin = document.getElementById('btnlogin');

// Event listener
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Valores
    const email = inputEmail.value.trim();
    const password = inputPassword.value;

    // Deshabilitar boton
    botonLogin.disabled = true;
    botonLogin.value = "Verificando...";

    // Verficar credenciales
    const resultado = await verificarCredenciales(email, password);

    // Habilitar boton
    botonLogin.disabled = false;
    botonLogin.value = "Iniciar Sesión";

    if (resultado) {
        // Credenciales correctas
        alert("Inicio de sesión exitoso.");
        
        // Armamos el objeto usuario
        const { data: usuario, error } = await supabaseClient
            .from('Usuarios')
            .select('*')
            .eq('CorreoBUAP', email)
            .maybeSingle();

        if(error) console.error("Error obteniendo datos del usuario: ", error);
        else if(!usuario) console.error("No se encontró el usuario después de verificar credenciales.");
        else {
            delete usuario.Contrasenia; // No guardar la contraseña
            setUser(usuario);
        }
        console.log("Usuario guardado en sessionStorage: ", usuario);

        // Redirigir a la página principal
        window.location.href = "index.html";
    }
    else {
        // Credenciales incorrectas
        alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
        inputPassword.value = "";
        inputPassword.focus();
    }
});

// Funcion para obtener todos los usuarios
async function obtenerUsuarios() {
    const { data, error } = await Usuarios.select('*');
    if (error) {
        console.error("Problema al obtener usuarios: ", error);
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




/* Pruebas de conexión a supabase
console.log(supabaseClient); 
console.log("Config: ", CONFIG);
console.log("SDK Supabase: ", typeof supabase);
console.log("Cliente inicializado: ", supabaseClient);

console.log("Prueba de acceso a Supabase.");
console.log("Imprimiendo Usuarios: ");
*/

// En caso de ocupar la 'data', modificar la funcion o hacer una funcion async
