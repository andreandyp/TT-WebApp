$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        //window.location.replace("/");
    }
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
