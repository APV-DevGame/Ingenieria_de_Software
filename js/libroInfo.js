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

            // 2. Crear registro en tabla Prestamos
            const fechaHoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const fechaDevolucion = new Date();
            fechaDevolucion.setDate(fechaDevolucion.getDate() + 14); // 14 días de préstamo
            const fechaDevolucionStr = fechaDevolucion.toISOString().split('T')[0];

            // Debug: mostrar datos que se van a insertar
            const datosPrestamo = {
                IDLibro: idLibro,
                MatriculaUsuario: matriculaUsuario,
                FechaPrestamo: fechaHoy,
                FechaDevolucion: fechaDevolucionStr
            };
            console.log('Datos a insertar en Prestamos:', datosPrestamo);

            const { data: dataPrestamo, error: errorPrestamo } = await client
                .from('Prestamos')
                .insert(datosPrestamo);

            // Debug: mostrar respuesta completa
            console.log('Respuesta INSERT Prestamos:', { data: dataPrestamo, error: errorPrestamo });

            if (errorPrestamo) {
                console.error('Error completo al crear préstamo:', JSON.stringify(errorPrestamo, null, 2));
                // El libro ya se reservó, pero no se pudo crear el préstamo
                alert(`Error al registrar préstamo: ${errorPrestamo.message || errorPrestamo.details || 'Error desconocido'}`);
            } else {
                console.log('Préstamo creado:', dataPrestamo);
                alert('¡Libro reservado exitosamente! Tienes 14 días para devolverlo.');
            }

            // Actualizar el estado del botón
            reservarBtn.disabled = true;
            reservarBtn.textContent = 'No disponible para reserva';

            // Actualizar el estado del libro en sessionStorage
            setLibroField('EstadoPrestamo', 'Reservado');

        } catch (error) {
            console.error('Error al reservar el libro:', error);
            alert('No se pudo reservar el libro. Inténtalo de nuevo más tarde.');
        }
    });
}