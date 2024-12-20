document.querySelectorAll(".sidebar-link")[2].classList.add("selected");
//------------------------------------------------------------------------
async function Listar() {
    const mes=parseInt(document.getElementById("mes").value);
    const año=parseInt(document.getElementById("año").value);
    let data=await Gasto.Lista();
    data=FiltrarPorFecha(data,año,mes)
    //------filtro-----------//
    const busqueda=document.getElementById("busqueda").value.trim();
    const data_filtrado=data.filter(item=>
        item.observacion.toLowerCase().includes(busqueda.toLowerCase())
        ||
        item.categoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
        ||
        item.categoria.grupo.nombre.toLowerCase().includes(busqueda.toLowerCase())
        ||
        FormatoFecha(item.fecha).toLowerCase().includes(busqueda.toLowerCase())
        ||
        parseInt(item.monto)===parseInt(busqueda)
    );
    //-----------------------//
    let content="";
    data_filtrado.forEach((row,index) => {
        content+=`
            <tr>
                <td>${index+1}</td>
                <td>${FormatoFecha(row.fecha)}</td>
                <td>${row.categoria.grupo.nombre}</td>
                <td>${row.categoria.nombre}</td>
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
    let grupos = await GrupoGasto.Lista();
    const opciones_grupos = grupos.map(x => 
        `<option value="${x.id}">${x.nombre}</option>`
    ).join('');

    let categorias = await CategoriaGasto.Lista();
    const opciones_categorias = categorias.map(x => 
        `<option value="${x.id}">${x.nombre}</option>`
    ).join('');


    const{ value: value } =await Swal.fire({
        position: "center",
        title: "Registrar nuevo gasto",
        showCancelButton: true,
        showCloseButton: true,
        html: `
        <div class="formulario">
            <label for="fecha">Fecha: <span style="color: red;">(*)</span></label>
            <input id="fecha" type="date" class="swal2-input" value="${Hoy()}" required>
            
            <label for="grupo">Grupo: <span style="color: red;">(*)</span></label>
            <select id="grupo" class="swal2-select" required>
                <option value=""></option>
                ${opciones_grupos}
            </select>

            <label for="categoria">Caregoria: <span style="color: red;">(*)</span></label>
            <select id="categoria" class="swal2-select" required>
            </select>
            
            <label for="observacion">Observación:</label>
            <input id="observacion" type="text" class="swal2-input" placeholder="Observación">
            
            <label for="monto">Monto: <span style="color: red;">(*)</span></label>
            <input id="monto" type="text" class="swal2-input" placeholder="Monto" required>
        </div>
        `,
        didOpen:() => {
            const cb_categoria=document.getElementById('categoria');
            const cb_grupo=document.getElementById('grupo');
            
            cb_grupo.addEventListener("change",function (){
                cb_categoria.innerHTML=`<option value=""></option>`;
                categorias.forEach(item => {
                    if(item.grupo.id===parseInt(cb_grupo.value)){
                        cb_categoria.innerHTML+=`<option value="${item.id}">${item.nombre}</option>`;
                    }
                });
            });

            document.getElementById('monto').addEventListener('input', function() {
                this.value = this.value
                    .replace(/[^0-9.]/g, '') // Permitir solo números y punto
                    .replace(/(\..*?)\..*/g, '$1'); // Permitir solo un punto
            });

        },

        preConfirm:async () => {
            const input_observacion=document.getElementById('observacion');
            input_observacion.value=input_observacion.value.trim();
            let observacion = input_observacion.value;

            let monto = document.getElementById('monto').value;

            let fecha = document.getElementById('fecha').value;
            let categoria = document.getElementById('categoria').value;

            if (!fecha || !categoria || !monto) {
                Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
                return false;
            }
            categoria=await CategoriaGasto.Buscar(parseInt(categoria));
            monto=parseFloat(monto);
            return { fecha, categoria, observacion, monto };
        }
    })

    if (value) {
        console.log(value);
        
        const respuesta=await Gasto.Agregar(value);
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
    let obj=await Gasto.Buscar(id)
    
    let categorias = await CategoriaGasto.Lista();

    let grupos = await GrupoGasto.Lista();
    const opciones_grupos = grupos.map(x => 
        `<option value="${x.id}">${x.nombre}</option>`
    ).join('');

    

    const{ value: value } =await Swal.fire({
        position: "center",
        title: "Editar gasto",
        showCancelButton: true,
        showCloseButton: true,
        html: `
        <div class="formulario">
            <label for="fecha">Fecha: <span style="color: red;">(*)</span></label>
            <input id="fecha" type="date" class="swal2-input" value="${obj.fecha}" required>
            
            <label for="grupo">Grupo: <span style="color: red;">(*)</span></label>
            <select id="grupo" class="swal2-select" required>
                <option value=""></option>
                ${opciones_grupos}
            </select>

            <label for="categoria">Categoria: <span style="color: red;">(*)</span></label>
            <select id="categoria" class="swal2-select" required>
                
            </select>
            
            <label for="observacion">Observación:</label>
            <input id="observacion" value="${obj.observacion}" type="text" class="swal2-input" placeholder="Observación">
            
            <label for="monto">Monto: <span style="color: red;">(*)</span></label>
            <input id="monto" value="${obj.monto}" type="text" class="swal2-input" placeholder="Monto" required>
        </div>
        `,
        didOpen:() => {
            const cb_categoria=document.getElementById('categoria');
            const cb_grupo=document.getElementById('grupo');
            cb_grupo.value = obj.categoria.grupo.id;
            
            function LoadCategoria(){
                cb_categoria.innerHTML=`<option value=""></option>`;
                categorias.forEach(item => {
                    if(item.grupo.id===parseInt(cb_grupo.value)){
                        cb_categoria.innerHTML+=`<option value="${item.id}">${item.nombre}</option>`;
                    }
                });
            }
            cb_grupo.addEventListener("change",LoadCategoria);

            LoadCategoria();
            cb_categoria.value = obj.categoria.id;

            document.getElementById('monto').addEventListener('input', function() {
                this.value = this.value
                    .replace(/[^0-9.]/g, '') // Permitir solo números y punto
                    .replace(/(\..*?)\..*/g, '$1'); // Permitir solo un punto
            });
        },
        preConfirm:async () => {
            const input_observacion=document.getElementById('observacion');
            input_observacion.value=input_observacion.value.trim();
            let observacion = input_observacion.value;

            let monto = document.getElementById('monto').value;

            let fecha = document.getElementById('fecha').value;
            let categoria = document.getElementById('categoria').value;

            if (!fecha || !categoria || !monto) {
                Swal.showValidationMessage('Por favor, complete todos los campos obligatorios');
                return false;
            }
            categoria=await CategoriaGasto.Buscar(parseInt(categoria));
            monto=parseFloat(monto);
            return { id,fecha, categoria, observacion, monto };
        }
    })

    if (value) {
        const respuesta=await Gasto.Editar(value);
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
                title: 'Error!',
                text: 'Error al intentar edtar.',
                timer: 3000,
                showCloseButton: true,
            });
        }
    }
}
async function Eliminar(id){
    const obj = await Gasto.Buscar(id);
    const { value } = await Swal.fire({
        position: "center",
        title: "¿Deseas eliminar este gasto?",
        text: `Este gasto fue registrado el ${FormatoFecha(obj.fecha)} y tiene un monto de ${FormatoSoles(obj.monto)}.`,
        icon: "warning",
        showCancelButton: true,
        showCloseButton: true,
    });

    if (value) {
        const respuesta=await Gasto.Eliminar(id);
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