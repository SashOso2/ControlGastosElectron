function FormatoFecha(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}
function FormatoSoles(numero) {
    let opciones = { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 };
    return numero.toLocaleString('es-PE', opciones);
}

function Hoy(){
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
    const dia = String(fecha.getDate()).padStart(2, '0');
    
    return `${año}-${mes}-${dia}`;
}

function FiltrarPorFecha(lista, año, mes) {
    return lista.filter(item => {
        const fecha = new Date(item.fecha);
        const esAño = año === 0 || fecha.getFullYear() === año;
        const esMes = mes === 0 || (fecha.getMonth() + 1) === mes;
        
        return esAño && esMes;
    });
}

function MesActual() {
    return new Date().getMonth() + 1; // Los meses son 0-indexed, por eso sumamos 1
}
function DiaActual() {
    return new Date().getDate(); // Devuelve el día del mes
}
function AñoActual() {
    return new Date().getFullYear(); // Devuelve el año actual
}