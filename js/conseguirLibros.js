import { setLibro } from './sessionStorage.js';

// Elementos del DOM
const TodasLasCategorias = document.getElementById('todas'),
    FiccionCategoria = document.getElementById('ficcion'),
    CienciaCategoria = document.getElementById('ciencia'),
    HistoriaCategoria = document.getElementById('historia'),
    TecnologiaCategoria = document.getElementById('tecnologia'),
    // Contenedor de portadas
    ContenedorPortadas = document.getElementById('catalogo');
mostrarPortadas('');

// add EventListener
document.addEventListener('click', async (e) => {
    switch (e.target) {
        case TodasLasCategorias:
            console.log("Todas las categorias");
            mostrarPortadas('');
            break;
        case FiccionCategoria:
            console.log("Categoria Ficcion");
            mostrarPortadas('Ficcion');
            break;
        case CienciaCategoria:
            console.log("Categoria Ciencia");
            mostrarPortadas('Ciencia');
            break;
        case HistoriaCategoria:
            console.log("Categoria Historia");
            mostrarPortadas('Historia');
            break;
        case TecnologiaCategoria:
            console.log("Categoria Tecnologia");
            mostrarPortadas('Tecnologia');
            break;
        default:
            break;
    }
});

async function mostrarPortadas(generoSeleccionado) {
    const libros = await conseguirLibros(generoSeleccionado, 0, 10);

    // Limpiamos el contenedor antes de agregar nuevas portadas
    if (ContenedorPortadas) {
        ContenedorPortadas.innerHTML = '';
    }

    // Aquí iría el código para mostrar las portadas en el DOM
    for (const libro of libros) {
        //console.log(`Título: ${libro.Titulo}, Autor: ${libro.Autor}, Género: ${libro.Genero}, Portada: ${libro.Portada}, Descripcion: ${libro.Descripcion}`);
        // Código para crear elementos en el DOM y mostrar las portadas
        const portada = document.createElement('libroN');
        portada.innerHTML = `
            <article class="increment">
                <h3 style="color: #003B5C; margin-bottom: 10px;">${libro.Titulo}</h3>
                <p style="color: #6C757D; font-size: 0.9rem;">Autor: ${libro.Autor}</p>
                <p style="color: #6C757D; font-size: 0.9rem;">Categoría: ${libro.Genero}</p>
                <p style="margin-top: 15px; flex-grow: 1;">${libro.Descripcion}</p>
                <button class="infoLibro" style="background: #003B5C; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Ver Detalles</button>
            </article>
        `;
        
        if (ContenedorPortadas) {
            ContenedorPortadas.appendChild(portada);

            // Aregar evento al boton de ver detalles
            portada.querySelector('.infoLibro').addEventListener('click', () => {
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

