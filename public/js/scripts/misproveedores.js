$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
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
            proveedores: [],
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
    methods: {
        async eliminarProveedor(id) {
            try {
                const { data } = await axios.delete(`/proveedor/${id}`);
                alert(data);
                const provs = this.$data.proveedores;
                this.$data.proveedores = provs.filter(prov => {
                    return prov.idProvider !== id;
                });
            } catch (error) {
                alert(error);
            }
        },
    },
    async mounted() {
        var url = new URL(window.location.href);
        var nuevo = url.searchParams.get("nuevo");
        if (nuevo) {
            document.querySelector("#saludo").style.display = "none";
        } else {
            document.querySelector("#anuncioNuevo").style.display = "none";
        }

        url.searchParams.delete("nuevo");
        window.history.replaceState({ page: 1 }, "Mis proveedores", url);

        try {
            const datos = await axios.get("/proveedor");
            this.$data.proveedores = datos.data;
        } catch (error) {
            alert(error.response.data);
        }
    },
});
