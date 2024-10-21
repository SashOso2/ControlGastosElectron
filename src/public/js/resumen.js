document.querySelectorAll(".sidebar-link")[0].classList.add("selected");


async function IngresosMes() {
    const lista = await Ingreso.Lista();
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // 1ro del mes actual

    // Filtrar ingresos del mes actual
    return lista.filter(fila => {
        const fechaIngreso = new Date(fila.fecha); // Suponiendo que fila.fecha es una cadena de fecha
        return fechaIngreso >= inicioMes && fechaIngreso <= hoy;
    });
}

async function GastosMes() {
    const lista = await Gasto.Lista(); // Cambié de Ingreso a Gasto
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // 1ro del mes actual

    // Filtrar gastos del mes actual
    return lista.filter(fila => {
        const fechaGasto = new Date(fila.fecha); // Suponiendo que fila.fecha es una cadena de fecha
        return fechaGasto >= inicioMes && fechaGasto <= hoy;
    });
}


async function Resumen() {
    const lista_ingresos=await IngresosMes();

    let ingresos_monto=0;
    lista_ingresos.forEach(fila => {
        ingresos_monto+=fila.monto
    });

    const lista_gastos=await GastosMes();
    let gastos_monto=0;
    lista_gastos.forEach(fila => {
        gastos_monto+=fila.monto
    });


    let saldo_disponible=ingresos_monto-gastos_monto;
    

    document.getElementById("ingresos-monto").textContent=FormatoSoles(ingresos_monto);
    document.getElementById("gastos-monto").textContent=FormatoSoles(gastos_monto);
    document.getElementById("saldo-disponible").textContent=FormatoSoles(saldo_disponible);
}

window.addEventListener("load",async ()=>{
    Resumen();
})