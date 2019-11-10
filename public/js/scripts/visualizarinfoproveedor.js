$(document).ready(async () => {
    try {
        const res = await axios.get("/auth/activo");
        if (!res.data.completo) {
            return window.location.replace("/formproveedor");
        }
    } catch (error) {
        alert(error.response.data);
        window.location.replace("/");
    }

    document
        .querySelector("#cerrarSesion")
        .addEventListener("click", async e => {
            e.preventDefault();
            const salir = window.confirm("¿Cerrar sesión?");
            if (salir) {
                await axios.get("/auth/salir");
                window.location.replace("/");
            }
        });
});

new Vue({
    el: "#app",
    data() {
        return {
            datosProveedor: {
                stores: [],
                categories: [],
            },
        };
    },
    filters: {
        verCategorias(categorias) {
            return categorias.map(e => e.category).join(", ");
        },
    },
    async mounted() {
        try {
            const datos = await axios.get("/proveedor");
            this.$data.datosProveedor = datos.data;
        } catch (error) {
            console.log(error);
        }
    },
});
