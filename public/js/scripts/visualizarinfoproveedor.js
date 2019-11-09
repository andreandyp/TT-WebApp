$(document).ready(async () => {
    try {
        /*const res = await axios.get("/auth/activo");
        if (!res.data.completo) {
            return window.location.replace("/formproveedor");
        }*/
    } catch (error) {
        window.location.replace("/");
    }
});

new Vue({
    el: "#app",
    data() {
        return {
            datosProveedor: [],
        };
    },
    filters: {
        verEstilos(estilos) {
            return estilos.map(e => e.style).join(", ");
        },
        verTipos(tipos) {
            return tipos.map(t => t.nameType).join(", ");
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
