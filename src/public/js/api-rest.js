function CrearApi(url) {
    return {
        async Lista() {
            const response = await fetch(url);
            return response.json();
        },
        
        async Agregar(obj) {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });
            if (!response.ok) {
                throw new Error('Error al agregar el registro');
            }
            return response.json();
        },
        
        async Buscar(id) {
            const response = await fetch(`${url}/${id}`);
            return response.json();
        },

        async Eliminar(id) {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
            });
            return response.ok;
        },

        async Editar(obj) {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });
            if (!response.ok) {
                throw new Error('Error al editar el registro');
            }
            return response.json();
        }
    };
}

// Crear instancias de la API
const Ingreso = CrearApi("http://localhost:3000/api/ingresos");
const Gasto = CrearApi("http://localhost:3000/api/gastos");
const FuenteIngreso = CrearApi("http://localhost:3000/api/fuentes-ingreso");
const GrupoGasto = CrearApi("http://localhost:3000/api/grupos-gasto");
const CategoriaGasto = CrearApi("http://localhost:3000/api/categorias-gasto");
