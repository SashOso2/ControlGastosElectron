document.querySelectorAll(".sidebar-link")[0].classList.add("selected");


async function ListaIngresos() {
    const mes=parseInt(document.getElementById("mes").value);
    const año=parseInt(document.getElementById("año").value);
    const lista=await Ingreso.Lista();
    return FiltrarPorFecha(lista,año,mes);
}

async function ListaGastos() {
    const mes=parseInt(document.getElementById("mes").value);
    const año=parseInt(document.getElementById("año").value);
    const lista=await Gasto.Lista();
    return FiltrarPorFecha(lista,año,mes);
}

async function Resumen() {
    const lista_ingresos= await ListaIngresos();
    const lista_gastos=await ListaGastos();;

    let ingresos_monto=0;
    lista_ingresos.forEach(fila => {
        ingresos_monto+=fila.monto
    });

    let gastos_monto=0;

    lista_gastos.forEach(fila => {
        gastos_monto+=fila.monto
    });


    let saldo_disponible=ingresos_monto-gastos_monto;
    

    document.getElementById("ingresos-monto").textContent=FormatoSoles(ingresos_monto);
    document.getElementById("gastos-monto").textContent=FormatoSoles(gastos_monto);
    document.getElementById("saldo-disponible").textContent=FormatoSoles(saldo_disponible);
}


document.getElementById("mes").addEventListener("change",async ()=>{
    await Resumen();
})
document.getElementById("año").addEventListener("change",async ()=>{
    await Resumen();
})
window.addEventListener("load",async ()=>{
    document.getElementById("mes").value=MesActual();
    await Resumen();
})