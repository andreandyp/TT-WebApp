$(document).ready(async () => {
    try {
        const res = await axios.get("/auth/activo");
        if (!res.data.completo) {
            return window.location.replace("/formproveedor");
        }
    } catch (error) {
        alert(error.response.data);
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
            modelos: [],
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
        const modelos = await axios.get("/modelos");
        this.$data.modelos = modelos.data;
    },
});
