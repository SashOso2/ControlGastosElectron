document.querySelectorAll(".sidebar-link")[0].classList.add("selected");


async function Resumen() {
    const mes=parseInt(document.getElementById("mes").value);
    const año=parseInt(document.getElementById("año").value);

    const lista_ingresos_total=await Ingreso.Lista();
    const lista_gastos_total=await Gasto.Lista();
    const lista_ingresos_mes= await FiltrarPorFecha(lista_ingresos_total,año,mes);
    const lista_gastos_mes=await FiltrarPorFecha(lista_gastos_total,año,mes);;
    const lista_grupos_gasto=await GrupoGasto.Lista();
    const lista_fuentes_ingreso=await FuenteIngreso.Lista();
    const lista_ingresos_año= await FiltrarPorFecha(lista_ingresos_total,año,0);
    const lista_gastos_año=await FiltrarPorFecha(lista_gastos_total,año,0);;

    let ingresos_mes_monto=0;
    lista_ingresos_mes.forEach(fila => {
        ingresos_mes_monto+=fila.monto
    });

    let gastos_mes_monto=0;

    lista_gastos_mes.forEach(fila => {
        gastos_mes_monto+=fila.monto
    });


    let saldo_mes_disponible=ingresos_mes_monto-gastos_mes_monto;
    

    document.getElementById("ingresos-monto").textContent=FormatoSoles(ingresos_mes_monto);
    document.getElementById("gastos-monto").textContent=FormatoSoles(gastos_mes_monto);
    document.getElementById("saldo-disponible").textContent=FormatoSoles(saldo_mes_disponible);
    if(saldo_mes_disponible<0){
        document.getElementById("saldo-disponible").style.color="#ff3333";
    }

    ///graficas
    const grupos_gasto_labels = lista_grupos_gasto.map(item => item.nombre);
    const grupos_gasto_values = grupos_gasto_labels.map(() => 0);
    for (let i = 0; i < grupos_gasto_labels.length; i++) {
        const label=grupos_gasto_labels[i]
        const agrupar=lista_gastos_mes.filter(item=>item.categoria.grupo.nombre===label)
        agrupar.forEach(item => {
            grupos_gasto_values[i]+=item.monto
        });
    }
    const fuentes_ingreso_labels = lista_fuentes_ingreso.map(item => item.nombre);
    const fuentes_ingreso_values = fuentes_ingreso_labels.map(() => 0);
    for (let i = 0; i < fuentes_ingreso_labels.length; i++) {
        const label=fuentes_ingreso_labels[i]
        const agrupar=lista_ingresos_mes.filter(item=>item.fuente.nombre===label)
        agrupar.forEach(item => {
            fuentes_ingreso_values[i]+=item.monto
        });
    }
    
    const meses_labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
    const meses_ingresos_values = [0,0,0,0,0,0,0,0,0,0,0,0];
    const meses_gastos_values = [0,0,0,0,0,0,0,0,0,0,0,0];
    for (let i = 1; i < meses_labels.length; i++) {
        const lista_ingresos_año_mes=FiltrarPorFecha(lista_ingresos_año,0,i+1)
        const lista_gastos_año_mes=FiltrarPorFecha(lista_gastos_año,0,i+1)
        
        lista_ingresos_año_mes.forEach(item => {
            meses_ingresos_values[i]+=item.monto
        });
        lista_gastos_año_mes.forEach(item => {
            meses_gastos_values[i]+=item.monto
        });
        
    }

    createPieChart('canvas_ingresos', fuentes_ingreso_labels, fuentes_ingreso_values);
    createPieChart('canvas_gastos', grupos_gasto_labels,grupos_gasto_values );
    createBarChart('canvas_anual', meses_labels, meses_ingresos_values, meses_gastos_values);
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




