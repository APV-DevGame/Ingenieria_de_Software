import { getField, isLoggedIn, clearUser } from "./sessionStorage.js";

// Verificar si está logueado
if (!isLoggedIn()) {
    alert('Debes iniciar sesión para acceder al panel.');
    window.location.href = 'login.html';
}

const nombreBibliotecario = document.getElementById('name-admin');

// Cargar datos del bibliotecario
if(nombreBibliotecario) {
    const nombre = getField('Nombre') || getField('nombre') || 'Bibliotecario';
    nombreBibliotecario.textContent = nombre;
}

// Botón de cerrar sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        clearUser();
        window.location.href = 'index.html';
    });
}