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
            name: "",
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

            try {
                const formData = new FormData();
                if (!this.$data.imagen) {
                    return alert("Falta la imagen");
                }

                alert("Subiendo datos...");
                const nuevaEscena = await axios.post("/escenas", {
                    name: this.$data.name,
                    tipo: this.$data.habitacion,
                    estilo: this.$data.estilo,
                    modelos,
                });

                formData.append("imagen", this.$data.imagen);
                formData.append("idARScene", nuevaEscena.data.idARScene);

                alert("Subiendo logo...");
                await axios.post("/uploads/imagen-escena", formData);

                window.location.replace("/visualizarescenas");
            } catch (error) {
                alert(error.response.data);
            }
        },
        subirImagen() {
            this.$data.imagen = this.$refs.imagenf.files[0];
        },
    },
    filters: {},
    async mounted() {
        const modelos = await axios.get("/modelos");
        this.$data.modelos = modelos.data;
    },
});
