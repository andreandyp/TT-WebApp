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
            elems: [],
            modelos: [],
            estilo: "",
            habitacion: "",
            nombre: "",
        };
    },
    methods: {
        async subirEstilo() {
            const elems = Array.from(document.querySelectorAll(".añadido"));

            const modelos = elems
                .filter(e => e.checked)
                .map(e => {
                    return e.id.replace("elem-", "");
                });

            return alert("En construcción :P");

            await axios.post("/escenas", {
                name: this.$data.name,
                imagen: null,
                tipo: this.$data.habitacion,
                estilo: this.$data.estilo,
                modelos,
            });
        },
    },
    filters: {},
    async mounted() {
        const modelos = await axios.get("/modelos");
        this.$data.modelos = modelos.data;
    },
});
