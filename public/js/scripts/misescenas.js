$(document).ready(async () => {
    try {
        const res = await axios.get("/auth/activo");
        if (!res.data.completo) {
            return window.location.replace("/formproveedor");
        }
    } catch (error) {
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
            estilo: "",
            habitacion: "",
            nombre: "",
        };
    },
    methods: {
        subirEstilo() {
            console.log(this.$data);
        },
    },
    filters: {
        verEstilos(estilos) {
            return estilos.map(e => e.style).join(", ");
        },
    },
    async mounted() {
        const modelos = await axios.get("/modelos");
        this.$data.modelos = modelos.data;
    },
});
