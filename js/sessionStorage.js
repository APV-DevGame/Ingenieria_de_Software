// js/sessionStorage.js
// API simple para manejar la sesión del usuario en sessionStorage.

const USER_KEY = 'user';

// Guarda un objeto usuario { matricula, nombre, apellido, correo, telefono, rol, adeudo, ... }
export function setUser(userObj = {}) {
    try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(userObj));
    } catch (e) {
        console.error('Error guardando user en sessionStorage:', e);
    }
}

export function getUser() {
    try {
        const raw = sessionStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error('Error leyendo user de sessionStorage:', e);
        return null;
    }
}

export function clearUser() {
    try {
        sessionStorage.removeItem(USER_KEY);
    } catch (e) {
        console.error('Error eliminando user de sessionStorage:', e);
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

export function getField(key) {
    return getUser()?.[key] ?? null;
}

// Convenience: setters individuales (opcional, por compatibilidad)
export function setMatricula(matricula) { setField('matricula', matricula); }
export function setNombre(nombre) { setField('nombre', nombre); }
export function setApellido(apellido) { setField('apellido', apellido); }
export function setCorreo(correo) { setField('correo', correo); }
export function setTelefono(telefono) { setField('telefono', telefono); }
export function setRol(rol) { setField('rol', rol); }
export function setAdeudo(adeudo) { setField('adeudo', adeudo); }
