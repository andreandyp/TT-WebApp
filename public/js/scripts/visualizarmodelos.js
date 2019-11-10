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
            modelos: [],
        };
    },
    methods: {
        async eliminarModelo(id) {
            try {
                alert("Eliminando modelo...");
                const { data } = await axios.delete(`/modelos/${id}`);
                alert(data);
                const models = this.$data.modelos;
                this.$data.modelos = models.filter(model => {
                    return model.idModel !== id;
                });
            } catch (error) {
                alert(error);
            }
        },
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
