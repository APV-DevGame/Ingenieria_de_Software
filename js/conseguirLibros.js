import { setLibro, isLoggedIn } from './sessionStorage.js';

// Elementos del DOM
const TodasLasCategorias = document.getElementById('todas'),
    FiccionCategoria = document.getElementById('ficcion'),
    CienciaCategoria = document.getElementById('ciencia'),
    HistoriaCategoria = document.getElementById('historia'),
    TecnologiaCategoria = document.getElementById('tecnologia'),
    // Contenedor de portadas
    ContenedorPortadas = document.getElementById('catalogo'),
    // Barra de búsqueda
    inputBusqueda = document.querySelector('.search-container .input');

// Variable para almacenar el género actual seleccionado
let generoActual = '';

mostrarPortadas('');

// Evento para la barra de búsqueda
if (inputBusqueda) {
    // Búsqueda en tiempo real mientras escribe (con debounce)
    let timeoutBusqueda;
    inputBusqueda.addEventListener('input', (e) => {
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(() => {
            const termino = e.target.value.trim();
            buscarLibros(termino);
        }, 300); // Espera 300ms después de dejar de escribir
    });

    // También buscar al presionar Enter
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(timeoutBusqueda);
            const termino = e.target.value.trim();
            buscarLibros(termino);
        }
    });
}

// Función para buscar libros
async function buscarLibros(termino) {
    if (termino === '') {
        // Si el campo está vacío, mostrar todos los libros (con el género actual si hay)
        mostrarPortadas(generoActual);
        return;
    }

    console.log('Buscando:', termino);
    
    try {
        // Buscar por título (ilike para búsqueda case-insensitive)
        const { data, error } = await supabaseClient
            .from('Libros')
            .select('*')
            .ilike('Titulo', `%${termino}%`)
            .order('Titulo', { ascending: true })
            .limit(20);

        if (error) {
            console.error('Error al buscar libros:', error);
            return;
        }

        console.log('Resultados de búsqueda:', data);
        renderizarLibros(data);

    } catch (err) {
        console.error('Error inesperado al buscar:', err);
    }
}

// add EventListener
document.addEventListener('click', async (e) => {
    switch (e.target) {
        case TodasLasCategorias:
            console.log("Todas las categorias");
            generoActual = '';
            if (inputBusqueda) inputBusqueda.value = ''; // Limpiar búsqueda
            mostrarPortadas('');
            break;
        case FiccionCategoria:
            console.log("Categoria Ficcion");
            generoActual = 'Ficcion';
            if (inputBusqueda) inputBusqueda.value = '';
            mostrarPortadas('Ficcion');
            break;
        case CienciaCategoria:
            console.log("Categoria Ciencia");
            generoActual = 'Ciencia';
            if (inputBusqueda) inputBusqueda.value = '';
            mostrarPortadas('Ciencia');
            break;
        case HistoriaCategoria:
            console.log("Categoria Historia");
            generoActual = 'Historia';
            if (inputBusqueda) inputBusqueda.value = '';
            mostrarPortadas('Historia');
            break;
        case TecnologiaCategoria:
            console.log("Categoria Tecnologia");
            generoActual = 'Tecnologia';
            if (inputBusqueda) inputBusqueda.value = '';
            mostrarPortadas('Tecnologia');
            break;
        default:
            break;
    }
});

async function mostrarPortadas(generoSeleccionado) {
    const libros = await conseguirLibros(generoSeleccionado, 0, 10);
    renderizarLibros(libros);
}

// Función para renderizar libros en el DOM
function renderizarLibros(libros) {
    // Limpiamos el contenedor antes de agregar nuevas portadas
    if (ContenedorPortadas) {
        ContenedorPortadas.innerHTML = '';
    }

    if (!libros || libros.length === 0) {
        ContenedorPortadas.innerHTML = '<p style="text-align: center; color: #6C757D; padding: 20px;">No se encontraron libros.</p>';
        return;
    }

    // Aquí iría el código para mostrar las portadas en el DOM
    for (const libro of libros) {
        // Código para crear elementos en el DOM y mostrar las portadas
        const portada = document.createElement('article');
        portada.className = 'increment';
        portada.innerHTML = `
            <h3 style="color: #003B5C; margin-bottom: 10px;">${libro.Titulo}</h3>
            <p style="color: #6C757D; font-size: 0.9rem;">Autor: ${libro.Autor}</p>
            <p style="color: #6C757D; font-size: 0.9rem;">Categoría: ${libro.Genero}</p>
            <p style="margin-top: 15px; flex-grow: 1;">${libro.Descripcion}</p>
            <button class="infoLibro" style="background: #003B5C; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Ver Detalles</button>
        `;
        
        if (ContenedorPortadas) {
            ContenedorPortadas.appendChild(portada);

            // Agregar evento al botón de ver detalles
            portada.querySelector('.infoLibro').addEventListener('click', () => {
                if(isLoggedIn() === false) {
                    alert("Debes iniciar sesión para ver los detalles del libro.");
                    return;
                }
                setLibro(libro);
                window.location.href = 'info_book.html';
            });
        }
    }
}

async function conseguirLibros(generoSeleccionado, inicio = 0, limite = 10){
    try {
        // Quitamos los espacios del genero y checamos si es nulo
        const generoNormalizado = generoSeleccionado ? String(generoSeleccionado).trim() : '';
        let data, error;
        // Si no hay genero
        if(generoNormalizado === ''){
            ({ data, error } = await supabaseClient
            .from('Libros')
            .select('*')
            .order('Titulo', { ascending : true })
            .range(inicio, inicio + limite - 1));
            console.log("Libros obtenidos sin filtro de género: ", data)
        }
        else{
            ({ data, error } = await supabaseClient
            .from('Libros')
            .select('*')
            .eq('Genero', generoNormalizado)
            .order('Titulo', { ascending : true })
            .range(inicio, inicio + limite - 1));
        }
        
        if(error) {
            console.error("Error al obtener libros: ", error);
            return [];
        }
        
        // Retornamos los libros
        return data;
    }
    catch (err) {
        console.error("Error inesperado al obtener libros: ", err);
        return [];
    }
}

