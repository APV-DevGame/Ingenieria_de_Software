import { getUser, getField, isLoggedIn } from './sessionStorage.js';

// Verificar si el usuario está logueado
if (!isLoggedIn()) {
    alert('Debes iniciar sesión para ver tu perfil.');
    window.location.href = 'login.html';
}

// Debug: ver datos del usuario
console.log('Usuario en sesión:', getUser());

// Elementos del DOM
const nombreElemento = document.getElementById('name-data');
const emailElemento = document.getElementById('email-data');
const tablaBody = document.querySelector('.info table tbody');

// Cargar datos del usuario desde sessionStorage
function cargarDatosUsuario() {
    const nombre = getField('Nombre') || getField('nombre') || 'Usuario';
    const apellido = getField('ApellidoPaterno') || getField('apellidoPaterno') || '';
    const apellidoM = getField('ApellidoMaterno') || getField('apellidoMaterno') || '';
    const correo = getField('CorreoBUAP') || getField('correoBUAP') || 'correo@ejemplo.com';
    
    if (nombreElemento) {
        nombreElemento.textContent = `${nombre} ${apellido} ${apellidoM}`.trim();
    }
    
    if (emailElemento) {
        emailElemento.textContent = correo;
    }
}

// Cargar historial de préstamos desde Supabase
async function cargarHistorialPrestamos() {
    const client = window.supabaseClient;
    if (!client) {
        console.error('supabaseClient no está disponible');
        return;
    }

    // Obtener matrícula del usuario actual
    const matricula = getField('Matricula') || getField('matricula');
    if (!matricula) {
        console.error('No se encontró la matrícula del usuario');
        mostrarMensajeSinPrestamos('No se pudo identificar al usuario.');
        return;
    }

    console.log('Buscando préstamos para matrícula:', matricula);

    try {
        // Consultar préstamos del usuario con información del libro
        const { data: prestamos, error } = await client
            .from('Prestamos')
            .select(`
                IDPrestamo,
                IDLibro,
                FechaPrestamo,
                FechaDevolucion,
                Libros (
                    Titulo,
                    EstadoPrestamo
                )
            `)
            .eq('MatriculaUsuario', matricula)
            .order('FechaPrestamo', { ascending: false });

        if (error) {
            console.error('Error al obtener préstamos:', error);
            mostrarMensajeSinPrestamos('Error al cargar el historial.');
            return;
        }

        console.log('Préstamos obtenidos:', prestamos);

        if (!prestamos || prestamos.length === 0) {
            mostrarMensajeSinPrestamos('No tienes préstamos registrados.');
            return;
        }

        // Renderizar préstamos en la tabla
        renderizarPrestamos(prestamos);

    } catch (err) {
        console.error('Error inesperado:', err);
        mostrarMensajeSinPrestamos('Error al cargar el historial.');
    }
}

// Renderizar préstamos en la tabla
function renderizarPrestamos(prestamos) {
    if (!tablaBody) return;

    // Limpiar tabla
    tablaBody.innerHTML = '';

    prestamos.forEach(prestamo => {
        const tr = document.createElement('tr');
        
        // Título del libro
        const tituloLibro = prestamo.Libros?.Titulo || `Libro #${prestamo.IDLibro}`;
        
        // Estado del préstamo
        const estado = determinarEstadoPrestamo(prestamo);
        const estadoClase = obtenerClaseEstado(estado);
        
        // Fecha de devolución o expiración
        const fechaDevolucion = prestamo.FechaDevolucion 
            ? formatearFecha(prestamo.FechaDevolucion)
            : 'Pendiente';

        tr.innerHTML = `
            <td>${tituloLibro}</td>
            <td><span class="${estadoClase}">${estado}</span></td>
            <td>${fechaDevolucion}</td>
        `;

        tablaBody.appendChild(tr);
    });
}

// Determinar estado del préstamo
function determinarEstadoPrestamo(prestamo) {
    if (prestamo.FechaDevolucion) {
        const fechaDevolucion = new Date(prestamo.FechaDevolucion);
        const hoy = new Date();
        
        if (fechaDevolucion < hoy) {
            return 'Devuelto';
        }
    }
    
    // Usar estado del libro si está disponible
    const estadoLibro = prestamo.Libros?.EstadoPrestamo;
    if (estadoLibro === 'Reservado') return 'Reservado';
    if (estadoLibro === 'Prestado') return 'Prestado';
    
    return 'Activo';
}

// Obtener clase CSS según estado
function obtenerClaseEstado(estado) {
    switch (estado.toLowerCase()) {
        case 'disponible':
        case 'devuelto':
            return 'estado-disponible';
        case 'prestado':
        case 'activo':
            return 'estado-prestado';
        case 'reservado':
            return 'estado-reservado';
        default:
            return '';
    }
}

// Formatear fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Mostrar mensaje cuando no hay préstamos
function mostrarMensajeSinPrestamos(mensaje) {
    if (!tablaBody) return;
    
    tablaBody.innerHTML = `
        <tr>
            <td colspan="3" class="no-prestamos">${mensaje}</td>
        </tr>
    `;
}

// Inicializar
cargarDatosUsuario();
cargarHistorialPrestamos();
