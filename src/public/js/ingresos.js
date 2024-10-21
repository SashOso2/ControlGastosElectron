document.querySelectorAll(".sidebar-link")[1].classList.add("selected");
//------------------------------------------------------------------------
async function Listar() {
    const data=await Ingreso.Lista();

    let content="";
    data.forEach((row,index) => {
        content+=`
            <tr>
                <td>${index+1}</td>
                <td>${FormatoFecha(row.fecha)}</td>
                <td>${row.fuente.nombre}</td>
                <td>${row.observacion}</td>
                <td>${FormatoSoles(row.monto)}</td>
                <td>
                    <button class="btn-editar" onclick="Editar(${row.id})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-eliminar" onclick="Eliminar(${row.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    });
    document.querySelector("tbody").innerHTML=content;
}
async function Nuevo(){ 
    let fuentes = await FuenteIngreso.Lista();
    const opciones_fuente = fuentes.map(x => 
        `<option value="${x.id}">${x.nombre}</option>`
    ).join('');

    const{ value: value } =await Swal.fire({
        position: "center",
        title: "Registrar nuevo ingreso",
        showCancelButton: true,
        showCloseButton: true,
        html: `
        <div class="formulario">
            <label for="fecha">Fecha: <span style="color: red;">(*)</span></label>
            <input id="fecha" type="date" class="swal2-input" value="${Hoy()}" required>
            
            <label for="fuente">Fuente: <span style="color: red;">(*)</span></label>
            <select id="fuente" class="swal2-select" required>
                <option value=""></option>
                ${opciones_fuente}
            </select>
            
            <label for="observacion">Observación:</label>
            <input id="observacion" type="text" class="swal2-input" placeholder="Observación">
            
            <label for="monto">Monto: <span style="color: red;">(*)</span></label>
            <input id="monto" type="text" class="swal2-input" placeholder="Monto" required>
        </div>
        `,

        preConfirm:async () => {
            let fecha = document.getElementById('fecha').value;
            let fuente = document.getElementById('fuente').value;
            let observacion = document.getElementById('observacion').value;
            let monto = document.getElementById('monto').value;

            if (!fecha || !fuente || !monto) {
                Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
                return false;
            }
            fuente=await FuenteIngreso.Buscar(parseInt(fuente));
            monto=parseFloat(monto);
            return { fecha, fuente, observacion, monto };
        }
    })

    if (value) {
        const respuesta=await Ingreso.Agregar(value);
        if(respuesta){
            Listar()
            Swal.fire({
                icon: 'success',
                title: 'Agregado!',
                text: 'Agregado correctamente.',
                timer: 3000,
                showCloseButton: true,
            });
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al intentar agregar.',
                timer: 3000,
                showCloseButton: true,
            });
        }
    }
}
async function Editar(id){
    let obj=await Ingreso.Buscar(id)

    let fuentes = await FuenteIngreso.Lista();
    const opciones_fuente = fuentes.map(x => 
        `<option value="${x.id}">${x.nombre}</option>`
    ).join('');

    const{ value: value } =await Swal.fire({
        position: "center",
        title: "Editar ingreso",
        showCancelButton: true,
        showCloseButton: true,
        html: `
        <div class="formulario">
            <label for="fecha">Fecha: <span style="color: red;">(*)</span></label>
            <input id="fecha" type="date" class="swal2-input" value="${obj.fecha}" required>
            
            <label for="fuente">Fuente: <span style="color: red;">(*)</span></label>
            <select id="fuente" class="swal2-select" required>
                <option value=""></option>
                ${opciones_fuente}
            </select>
            
            <label for="observacion">Observación:</label>
            <input id="observacion" value="${obj.observacion}" type="text" class="swal2-input" placeholder="Observación">
            
            <label for="monto">Monto: <span style="color: red;">(*)</span></label>
            <input id="monto" value="${obj.monto}" type="text" class="swal2-input" placeholder="Monto" required>
        </div>
        `,
        didOpen: () => {
            document.getElementById('fuente').value = obj.fuente.id;
        },
        preConfirm:async () => {
            let fecha = document.getElementById('fecha').value;
            let fuente = document.getElementById('fuente').value;
            let observacion = document.getElementById('observacion').value;
            let monto = document.getElementById('monto').value;

            if (!fecha || !fuente || !monto) {
                Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
                return false;
            }
            fuente=await FuenteIngreso.Buscar(parseInt(fuente));
            monto=parseFloat(monto);
            return { id,fecha, fuente, observacion, monto };
        }
    })

    if (value) {
        const respuesta=await Ingreso.Editar(value);
        if(respuesta){
            Listar()
            Swal.fire({
                icon: 'success',
                title: 'Editado!',
                text: 'Editado correctamente.',
                timer: 3000,
                showCloseButton: true,
            });
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al intentar edtar.',
                timer: 3000,
                showCloseButton: true,
            });
        }
    }
}
async function Eliminar(id) {
    const obj = await Ingreso.Buscar(id);
    const { value } = await Swal.fire({
        position: "center",
        title: "¿Deseas eliminar este ingreso?",
        text: `Este ingreso fue registrado el ${FormatoFecha(obj.fecha)} y tiene un monto de ${FormatoSoles(obj.monto)}.`,
        icon: "warning",
        showCancelButton: true,
        showCloseButton: true,
    });

    if (value) {
        const respuesta=await Ingreso.Eliminar(id);
        if(respuesta){
            Listar()
            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'Eliminado correctamente.',
                timer: 3000,
                showCloseButton: true,
            });
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al intentar eliminar.',
                timer: 3000,
                showCloseButton: true,
            });
        }
    }
}
//-------------------------------------------------------------------------
window.addEventListener("load",async function(){
    await Listar();
})