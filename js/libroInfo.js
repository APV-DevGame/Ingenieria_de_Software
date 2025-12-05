import { getLibroField, getLibro, setLibroField, getField, isLoggedIn } from './sessionStorage.js';

// Debug: ver qué hay en sessionStorage al cargar
console.log('Libro en sessionStorage:', getLibro());

// Elementos del DOM
const tituloElemento = document.getElementById('title-book');
const libroDesc = document.getElementById('libro-info');
const reservarBtn = document.getElementById('reserved');
const libroImg = document.getElementById('libroImg');

// Titulo del libro
const tituloLibro = getLibroField('Titulo');
const descLibro = getLibroField('Descripcion');
const libroId = getLibroField('ID');

// Reemplazar el titulo del libro en el DOM
if(tituloElemento) {
    tituloElemento.textContent = tituloLibro || 'Información del Libro';
}

// Reemplazar la imagen del libro en el DOM
if(libroImg) {
    const urlImagen = getLibroField('Portada');
    if (urlImagen) {
        libroImg.src = urlImagen;
    } else {
        console.warn('No se encontró URL de imagen para el libro.');
    }
}

// Reemplazar la información del libro en el DOM
if(libroDesc) {
    const autorLibro = getLibroField('Autor') || 'Autor desconocido';
    const facultadLibro = getLibroField('Facultad') || 'Facultad no especificada';
    const generoLibro = getLibroField('Genero') || 'Género no especificado';
    const editorialLibro = getLibroField('Editorial') || 'Editorial no especificada';
    
    libroDesc.innerHTML = `
        <p>${descLibro || 'Descripción no disponible.'}</p>
        <p class="autor"><strong>Autor:</strong> ${autorLibro}</p>
        <p class="Facultad"><strong>Facultad:</strong> ${facultadLibro}</p>
        <p class="genero"><strong>Género:</strong> ${generoLibro}</p>
        <p class="editorial"><strong>Editorial:</strong> ${editorialLibro}</p>
    `;
}

// Detectar si el libro ya fue reservado (consulta a la BD)
async function verificarEstadoLibro() {
    const client = window.supabaseClient;
    if (!client || !libroId) return;

    const { data, error } = await client
        .from('Libros')
        .select('EstadoPrestamo')
        .eq('ID', libroId)
        .single();

    if (error) {
        console.error('Error al obtener estado del libro:', error);
        return;
    }

    console.log('Estado del préstamo del libro:', data?.EstadoPrestamo);
    
    if (data?.EstadoPrestamo !== 'disponible') {
        if (reservarBtn) {
            reservarBtn.disabled = true;
            reservarBtn.textContent = 'No disponible para reserva';
        }
    }
}

// Ejecutar la verificación al cargar
verificarEstadoLibro();

// Agregar evento al botón de reservar
if(reservarBtn) {
    reservarBtn.addEventListener('click', async () => {
        try {
            // Verificar si el usuario está logueado
            if (!isLoggedIn()) {
                alert('Debes iniciar sesión para reservar un libro.');
                window.location.href = 'login.html';
                return;
            }

            const client = window.supabaseClient;
            if (!client) {
                console.error('supabaseClient no está disponible en window');
                alert('Error: conexión a base de datos no disponible.');
                return;
            }

            // Obtener el ID del libro en el momento del click
            const idLibro = getLibroField('ID');
            console.log('ID del libro obtenido:', idLibro);
            console.log('Libro completo:', getLibro());
            
            if (!idLibro) {
                console.error('ID del libro no está definido:', idLibro);
                alert('Error: identificador del libro no encontrado.');
                return;
            }

            // Obtener matrícula del usuario
            const matriculaUsuario = getField('Matricula') || getField('matricula');
            if (!matriculaUsuario) {
                console.error('Matrícula del usuario no encontrada');
                alert('Error: no se pudo identificar al usuario.');
                return;
            }

            console.log('Intentando reservar libro ID =', idLibro, 'para usuario:', matriculaUsuario);

            // VERIFICAR LÍMITE DE 3 RESERVAS ACTIVAS
            // Solo contar reservas (duración de 1 día), no préstamos normales (más días)
            const { data: prestamosUsuario, error: errorReservas } = await client
                .from('Prestamos')
                .select('FechaPrestamo, FechaDevolucion')
                .eq('MatriculaUsuario', matriculaUsuario);

            if (errorReservas) {
                console.error('Error al verificar reservas:', errorReservas);
            } else {
                // Filtrar solo las reservas (diferencia de 1 día entre FechaPrestamo y FechaDevolucion)
                const reservasActivas = prestamosUsuario?.filter(prestamo => {
                    const fechaPrestamo = new Date(prestamo.FechaPrestamo);
                    const fechaDevolucion = new Date(prestamo.FechaDevolucion);
                    const diffDias = Math.round((fechaDevolucion - fechaPrestamo) / (1000 * 60 * 60 * 24));
                    
                    // Es reserva si la diferencia es de 1 día y aún no ha expirado
                    const hoy = new Date();
                    const noExpirada = fechaDevolucion >= hoy;
                    
                    return diffDias <= 1 && noExpirada;
                }) || [];

                console.log('Reservas activas del usuario (solo 24h):', reservasActivas.length);
                
                if (reservasActivas.length >= 3) {
                    alert('Has alcanzado el límite máximo de 3 reservas activas.\n\nRecoge tus libros pendientes o espera a que expiren para poder reservar más.');
                    return;
                }
            }

            // 1. Actualizar estado del libro
            const { data: dataLibro, error: errorLibro } = await client
                .from('Libros')
                .update({ EstadoPrestamo: 'Reservado' })
                .eq('ID', idLibro);

            if (errorLibro) {
                console.error('Error al reservar el libro:', errorLibro);
                alert('No se pudo reservar el libro. Inténtalo de nuevo más tarde.');
                return;
            }

            // 2. Crear registro en tabla Prestamos (reserva de 24 horas)
            const ahora = new Date();
            const fechaReserva = ahora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            
            // La reserva expira en 24 horas (fecha límite para recoger)
            const fechaExpiracion = new Date(ahora);
            fechaExpiracion.setHours(fechaExpiracion.getHours() + 24);
            const fechaExpiracionStr = fechaExpiracion.toISOString().split('T')[0];

            // Debug: mostrar datos que se van a insertar
            const datosPrestamo = {
                MatriculaUsuario: matriculaUsuario,
                FechaPrestamo: fechaReserva,
                FechaDevolucion: fechaExpiracionStr,
                IDLibro: idLibro
            };
            console.log('Datos a insertar en Prestamos:', datosPrestamo);

            const { data: dataPrestamo, error: errorPrestamo } = await client
                .from('Prestamos')
                .insert(datosPrestamo);

            // Debug: mostrar respuesta completa
            console.log('Respuesta INSERT Prestamos:', { data: dataPrestamo, error: errorPrestamo });

            if (errorPrestamo) {
                console.error('Error completo al crear préstamo:', JSON.stringify(errorPrestamo, null, 2));
                alert(`Error al registrar reserva: ${errorPrestamo.message || errorPrestamo.details || 'Error desconocido'}`);
            } else {
                console.log('Reserva creada:', dataPrestamo);
                
                // Calcular hora límite para mostrar al usuario
                const horaLimite = fechaExpiracion.toLocaleString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                alert(`¡Libro reservado exitosamente!\n\n📚 Tienes 24 horas para recogerlo en la biblioteca.\n\n⏰ Fecha límite: ${horaLimite}\n\n⚠️ Si no lo recoges, la reserva se cancelará automáticamente.`);
            }

            // Actualizar el estado del botón
            reservarBtn.disabled = true;
            reservarBtn.textContent = 'Reservado - Recoger en 24h';

            // Actualizar el estado del libro en sessionStorage
            setLibroField('EstadoPrestamo', 'Reservado');

        } catch (error) {
            console.error('Error al reservar el libro:', error);
            alert('No se pudo reservar el libro. Inténtalo de nuevo más tarde.');
        }
    });
}