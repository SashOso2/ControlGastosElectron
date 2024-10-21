document.querySelectorAll(".sidebar-link")[5].classList.add("selected");
//------------------------------------------------------------------------
async function Listar() {
    const data=await CategoriaGasto.Lista();

    let content="";
    data.forEach((row,index) => {
        content+=`
            <tr>
                <td>${index+1}</td>
                <td>${row.grupo.nombre}</td>
                <td>${row.nombre}</td>
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
    let grupos = await GrupoGasto.Lista();
    const opciones_grupo = grupos.map(x => 
        `<option value="${x.id}">${x.nombre}</option>`
    ).join('');

    const{ value: value } =await Swal.fire({
        position: "center",
        title: "Registrar nuevo ingreso",
        showCancelButton: true,
        showCloseButton: true,
        html: `
        <div class="formulario">
            <label for="grupo">Grupo: <span style="color: red;">(*)</span></label>
            <select id="grupo" class="swal2-select">
                <option value=""></option>
                ${opciones_grupo}
            </select>
            
            <label for="nombre">Nombre: <span style="color: red;">(*)</span></label>
            <input id="nombre" type="text" class="swal2-input" placeholder="Nombre">
        </div>
        `,

        preConfirm:async () => {
            let nombre = document.getElementById('nombre').value;
            let grupo = document.getElementById('grupo').value;

            if (!nombre || !grupo) {
                Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
                return false;
            }
            grupo=await GrupoGasto.Buscar(parseInt(grupo));
            return { grupo, nombre };
        }
    })

    if (value) {
        const respuesta=await CategoriaGasto.Agregar(value);
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
    let obj=await CategoriaGasto.Buscar(id)

    let grupos = await GrupoGasto.Lista();
    const opciones_grupo = grupos.map(x => 
        `<option value="${x.id}">${x.nombre}</option>`
    ).join('');

    const{ value: value } =await Swal.fire({
        position: "center",
        title: "Editar ingreso",
        showCancelButton: true,
        showCloseButton: true,
        html: `
        <div class="formulario">
            <label for="grupo">Grupo: <span style="color: red;">(*)</span></label>
            <select id="grupo" class="swal2-select">
                <option value=""></option>
                ${opciones_grupo}
            </select>
            
            <label for="nombre">Nombre: <span style="color: red;">(*)</span></label>
            <input id="nombre" value="${obj.nombre}" type="text" class="swal2-input" placeholder="Nombre">
        </div>
        `,
        didOpen: () => {
            document.getElementById('grupo').value = obj.grupo.id;
        },
        preConfirm:async () => {
            let nombre = document.getElementById('nombre').value;
            let grupo = document.getElementById('grupo').value;

            if (!nombre || !grupo) {
                Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
                return false;
            }
            grupo=await GrupoGasto.Buscar(parseInt(grupo));
            return { id, grupo, nombre };
        }
    })

    if (value) {
        const respuesta=await CategoriaGasto.Editar(value);
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
async function Eliminar(id){
    const obj = await CategoriaGasto.Buscar(id);

    const { value } = await Swal.fire({
        position: "center",
        title: "¿Deseas eliminar esta fuente ingreso?",
        text: `Fuente de ingreso: ${obj.nombre}.`,
        icon: "warning",
        showCancelButton: true,
        showCloseButton: true,
    });

    if (value) {
        const respuesta=await CategoriaGasto.Eliminar(id);
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