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