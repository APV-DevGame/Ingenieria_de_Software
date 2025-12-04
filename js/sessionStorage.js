// js/sessionStorage.js
// API simple para manejar la sesión del usuario en sessionStorage.
const USER_KEY = 'user';
// Objeto del libro seleccionado
const LIBRO_KEY = 'libroSeleccionado';

// Guarda un objeto usuario { matricula, nombre, apellido, correo, telefono, rol, adeudo, ... }
export function setUser(userObj = {}) {
    try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(userObj));
    } catch (e) {
        console.error('Error guardando user en sessionStorage:', e);
    }
}

// Guarda un objeto libro { ID, Facultad, Unidad, Título, Autor, Genero, Idioma, Editorial, EstadoPrestamo, Portada, Descripción }
export function setLibro(libroObj = {}) {
    try {
        sessionStorage.setItem(LIBRO_KEY, JSON.stringify(libroObj));
    } catch (e) {
        console.error('Error guardando libro en sessionStorage:', e);
    }
}

// Obtiene el usuario guardado en sessionStorage
export function getUser() {
    try {
        const raw = sessionStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error('Error leyendo user de sessionStorage:', e);
        return null;
    }
}

// Obtiene el libro guardado en sessionStorage
export function getLibro() {
    try {
        const raw = sessionStorage.getItem(LIBRO_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error('Error leyendo libro de sessionStorage:', e);
        return null;
    }
}

// Elimina la información del usuario de sessionStorage
export function clearUser() {
    try {
        sessionStorage.removeItem(USER_KEY);
    } catch (e) {
        console.error('Error eliminando user de sessionStorage:', e);
    }
}

//Elimina la información del libro de sessionStorage
export function clearLibro() {
    try {
        sessionStorage.removeItem(LIBRO_KEY);
        } catch (e) {
        console.error('Error eliminando libro de sessionStorage:', e);
    }
}

export function isLoggedIn() {
    return Boolean(getUser());
}

// Getters y setters comodín para compatibilidad con código que quiera acceder a una propiedad
export function setField(key, value) {
    const u = getUser() || {};
    u[key] = value;
    setUser(u);
}

// Setters para el libro
export function setLibroField(key, value) {
    const l = getLibro() || {};
    l[key] = value;
    setLibro(l);
}

// Obtiene un campo específico del usuario
export function getField(key) {
    return getUser()?.[key] ?? null;
}

// Obtiene un campo específico del libro
export function getLibroField(key) {
    return getLibro()?.[key] ?? null;
}

// Convenience: setters individuales (opcional, por compatibilidad)
export function setMatricula(matricula) { setField('matricula', matricula); }
export function setNombre(nombre) { setField('nombre', nombre); }
export function setApellido(apellido) { setField('apellido', apellido); }
export function setCorreo(correo) { setField('correo', correo); }
export function setTelefono(telefono) { setField('telefono', telefono); }
export function setRol(rol) { setField('rol', rol); }
export function setAdeudo(adeudo) { setField('adeudo', adeudo); }
