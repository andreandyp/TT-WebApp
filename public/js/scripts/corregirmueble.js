$(document).ready(async () => {
    try {
        const res = await axios.get("/auth/activo");
        if (!res.data.completo) {
            return window.location.replace("/formproveedor");
        }
    } catch (error) {
        window.location.replace("/");
    }

    new Vue({
        el: "#app",
        data() {
            return {
                modelo: {
                    categories: [],
                    types: [],
                    styles: [],
                },
                idModel: 0,
                file2D: null,
                file3D: null,
            };
        },
        methods: {
            async subir() {
                const name = document.querySelector("#nombre").value;
                const price = document.querySelector("#precio").value;
                const description = document.querySelector("#desc").value;
                const codigo = document.querySelector("#identificador").value;
                const medidas = document.querySelector("#medidas").value;
                const color = document.querySelector("#color").value;
                const disponibilidad = Array.from(
                    document.querySelectorAll(".dispo")
                ).filter(e => e.checked)[0].value;

                const formData = new FormData();

                formData.append("idModel", this.$data.idModel);
                formData.append("name", name);
                formData.append("price", price);
                formData.append("description", description);
                formData.append("codigo", codigo);
                formData.append("medidas", medidas);
                formData.append("modelo3d", this.$data.file3D);
                formData.append("modelo2d", this.$data.file2D);
                formData.append("color", color);
                formData.append("disponibilidad", disponibilidad);

                const categorias = Array.from(
                    document.querySelectorAll(".categoria")
                )
                    .filter(cat => cat.checked)
                    .map(cat => cat.value.toUpperCase());

                const estilos = Array.from(document.querySelectorAll(".estilo"))
                    .filter(estilo => estilo.checked)
                    .map(estilo => estilo.value.toUpperCase());

                const tipos = Array.from(document.querySelectorAll(".tipo"))
                    .filter(tipo => tipo.checked)
                    .map(tipo => tipo.value.toUpperCase());

                formData.append("type", tipos.join(","));
                formData.append("category", categorias.join(","));
                formData.append("style", estilos.join(","));

                try {
                    alert("Subiendo modelo, espera un poco...");
                    await axios.patch("/modelos", formData);
                    window.location.replace("/visualizarmodelos");
                } catch (error) {
                    alert(error.response.data);
                }
            },
            async salir() {
                const salir = window.confirm("¿Cerrar sesión?");
                if (salir) {
                    await axios.get("/auth/salir");
                    window.location.replace("/");
                }
            },
            subir2D() {
                this.$data.file2D = this.$refs.f2d.files[0];
            },
            subir3D() {
                this.$data.file3D = this.$refs.f3d.files[0];
            },
        },
        filters: {},
        async mounted() {
            var url = new URL(window.location.href);
            var diagonal = url.pathname.lastIndexOf("/");
            var idModel = url.pathname.slice(diagonal + 1);
            this.$data.idModel = idModel;
            const mueble = await axios.get("/modelos/" + idModel);
            this.$data.modelo = mueble.data;
            this.$data.modelo.categories = mueble.data.categories.map(e => {
                return e.category;
            });

            this.$data.modelo.types = mueble.data.types.map(e => {
                return e.nameType;
            });

            this.$data.modelo.styles = mueble.data.predefinedstyles.map(e => {
                return e.style;
            });
        },
    });
});
