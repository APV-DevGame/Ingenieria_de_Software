//Con esta funcion mostramos o quitamos elementos
function mostrardashboard() {
    // Muestra los datos de los dashboard
    document.getElementById("mostrar-dashboard").className = "visible";
    // Muestra los datos de los prestamos
    document.getElementById("datos-prestamos").className = "oculto";
    // Oculta los datos del libro
    document.getElementById("datos-libros").className = "oculto";
    //Oculta los datos de las reservas
    document.getElementById("datos-usuario").className = "oculto";
    //Ocultamos soporte
    document.getElementById("datos-soporte").className = "oculto";
}
function mostrarprestamos() {
    // Muestra los datos de los prestamos
    document.getElementById("datos-prestamos").className = "visible";
    // Oculta los datos del libro
    document.getElementById("datos-libros").className = "oculto";
    //Oculta los datos de las reservas
    document.getElementById("datos-usuario").className = "oculto";
    //Ocultamos soporte
    document.getElementById("datos-soporte").className = "oculto";
    // oculta los datos de los dashboard
    document.getElementById("mostrar-dashboard").className = "oculto";
}
function mostrarlibros() {
    // Oculta prestamos
    document.getElementById("datos-prestamos").className = "oculto";
    //oculta reservas
    document.getElementById("datos-usuario").className = "oculto";
    // Muestra los libros
    document.getElementById("datos-libros").className = "visible";
    //Ocultamos soporte
    document.getElementById("datos-soporte").className = "oculto";
    // oculta los datos de los dashboard
    document.getElementById("mostrar-dashboard").className = "oculto";
}
function mostrarusuario() {
    // Oculta prestamos
    document.getElementById("datos-prestamos").className = "oculto";
    //oculta reservas
    document.getElementById("datos-usuario").className = "visible";
    // Muestra los libros
    document.getElementById("datos-libros").className = "oculto";
    //Ocultamos soporte
    document.getElementById("datos-soporte").className = "oculto";
    // oculta los datos de los dashboard
    document.getElementById("mostrar-dashboard").className = "oculto";
}
function mostrarsoporte() {
    // Oculta prestamos
    document.getElementById("datos-prestamos").className = "oculto";
    //oculta reservas
    document.getElementById("datos-usuario").className = "oculto";
    // Muestra los libros
    document.getElementById("datos-libros").className = "oculto";
    //Mostramos el soporte
    document.getElementById("datos-soporte").className = "visible";
    // oculta los datos de los dashboard
    document.getElementById("mostrar-dashboard").className = "oculto";
}