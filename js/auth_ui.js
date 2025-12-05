import { isLoggedIn, getField } from './sessionStorage.js';

function escapeHtml(str) {
    return String(str || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function renderAuthUI() {
    const loginArea = document.getElementById('loginArea');
    if (!loginArea) {
        console.warn('Elemento #loginArea no encontrado');
        return;
    }

    if (isLoggedIn()) {
        // Usuario autenticado: mostrar nombre y botón de cerrar sesión
        const nombre = getField('nombre') || getField('Nombre') || 'Usuario';
        const nombreSeguro = escapeHtml(nombre);
        
        console.log("Matricula " + getField('matricula')); // Línea de depuración
        loginArea.innerHTML = `
            <div id="btnPerfil" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span style="color:white;font-weight:600;">Bienvenido, ${nombreSeguro}</span>
            </div>
        `;

        // Agregar evento al botón para el dashboard según el rol
        const btnPerfil = document.getElementById('btnPerfil');
        if (btnPerfil) {
            btnPerfil.addEventListener('click', () => {
                const rol = getField('Rol') || getField('rol');
                
                if (rol === 'Bibliotecario') {
                    window.location.href = 'panel_bibliotecario.html';
                } else {
                    window.location.href = 'perfilUsuario.html';
                }
            });
        }
    } else {
        // No autenticado: mostrar enlace de inicio de sesión
        loginArea.innerHTML = '<a href="login.html">Iniciar Sesión</a>';
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAuthUI);
} else {
    renderAuthUI();
}