import { clearUser } from './sessionStorage.js';

// Botón para cerrar sesión
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Limpiar la sesión del usuario
        clearUser();
        console.log('Sesión cerrada correctamente.');
        // Redirigir a la página de inicio de sesión
        window.location.href = 'index.html';
    });
} else {
    console.warn('Botón #logoutBtn no encontrado');
}
