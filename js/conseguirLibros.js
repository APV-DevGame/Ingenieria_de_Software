// Elementos del DOM
const TodasLasCategorias = document.getElementById('todas'),
    FiccionCategoria = document.getElementById('ficcion'),
    CienciaCategoria = document.getElementById('ciencia'),
    HistoriaCategoria = document.getElementById('historia'),
    TecnologiaCategoria = document.getElementById('tecnologia');


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
    console.log("Libros obtenidos: ", libros);

    // Aquí iría el código para mostrar las portadas en el DOM

}

async function conseguirLibros(generoSeleccionado, inicio = 0, limite = 10){
    try {
        // Quitamos los espacios del genero y checamos si es nulo
        const generoNormalizado = generoSeleccionado ? String(generoSeleccionado).trim() : '';
        let data, error;
        // Si no hay genero
        if(generoNormalizado === ''){
            console.log("Sin genero");
            ({ data, error } = await supabaseClient
            .from('Libros')
            .select('Titulo, Autor, Genero, Portada')
            .order('Titulo', { ascending : true })
            .range(inicio, inicio + limite - 1));
        }
        else{
            console.log("Con genero: ", generoNormalizado);
            ({ data, error } = await supabaseClient
            .from('Libros')
            .select('Titulo, Autor, Genero, Portada')
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

