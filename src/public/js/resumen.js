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
    if(saldo_disponible<0){
        document.getElementById("saldo-disponible").style.color="#ff3333";
    }

    ///graficas
    const grupos_gasto_labels = ['Alimentacion', 'educacion',"servicios","servicios","otros"];
    const grupos_gasto_values = [50,1250,200,200,500];

    const fuentes_ingreso_labels = ['Alimentacion', 'educacion',"servicios","servicios","otros"];
    const fuentes_ingreso_values = [50,1250,200,200,500];


    const meses_labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
    const meses_ingresos_values = [3000, 4000, 3500, 5000, 4500,2000, 2500, 3000, 4000, 3500,2324,2135];
    const meses_gastos_values = [2000, 2500, 3000, 4000, 3500,3000, 4000, 3500, 5000, 4500,980,5200];

    createPieChart('canvas_ingresos', fuentes_ingreso_labels, fuentes_ingreso_values);
    createPieChart('canvas_gastos', grupos_gasto_labels,grupos_gasto_values );
    createLineChart('canvas_anual', meses_labels, meses_ingresos_values, meses_gastos_values);
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




