window.addEventListener("load",async ()=>{
    document.getElementById("mes").value=MesActual();
    await Listar();
})

document.getElementById("mes").addEventListener("change",async ()=>{
    await Listar();
})
document.getElementById("año").addEventListener("change",async ()=>{
    await Listar();
})