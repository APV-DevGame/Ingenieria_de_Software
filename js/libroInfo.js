import { getLibroField, getLibro, setLibroField } from './sessionStorage.js';

// Debug: ver qué hay en sessionStorage al cargar
console.log('Libro en sessionStorage:', getLibro());

// Elementos del DOM
const tituloElemento = document.getElementById('title-book');
const libroDesc = document.getElementById('libro-info');
const reservarBtn = document.getElementById('reserved');

// Titulo del libro
const tituloLibro = getLibroField('Titulo');
const descLibro = getLibroField('Descripcion');
const libroId = getLibroField('ID');

// Reemplazar el titulo del libro en el DOM
if(tituloElemento) {
    tituloElemento.textContent = tituloLibro || 'Información del Libro';
}

// Reemplazar la descripción del libro en el DOM
if(libroDesc) {
    libroDesc.textContent = descLibro || 'Descripción no disponible.';
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

            console.log('Intentando reservar libro ID =', idLibro);

            const { data, error } = await client
                .from('Libros')
                .update({ EstadoPrestamo: 'Reservado' })
                .eq('ID', idLibro);

            console.log('Respuesta de Supabase:', { data, error });

            if (error) {
                console.error('Error al reservar el libro:', error);
                alert('No se pudo reservar el libro. Inténtalo de nuevo más tarde.');
            } else {
                alert('Libro reservado exitosamente.');
                // Actualizar el estado del botón
                reservarBtn.disabled = true;
                reservarBtn.textContent = 'No disponible para reserva';

                // Actualizar el estado del libro en sessionStorage
                setLibroField('EstadoPrestamo', 'Reservado');
            }
        } catch (error) {
            console.error('Error al reservar el libro:', error);
            alert('No se pudo reservar el libro. Inténtalo de nuevo más tarde.');
        }
    });
}