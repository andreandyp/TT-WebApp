new Vue({
    el: "#app",
    data() {
        return {
            pinturas: [],
        };
    },
    methods: {
        async eliminarPintura(id) {
            try {
                alert("Eliminando pintura...");
                const { data } = await axios.delete(`/pinturas/${id}`);
                alert(data);
                const paints = this.$data.pinturas;
                this.$data.pinturas = paints.filter(paint => {
                    return paint.idPaint !== id;
                });
            } catch (error) {
                alert(error);
            }
        },
        async salir() {
            const salir = window.confirm("¿Cerrar sesión?");
            if (salir) {
                await axios.get("/auth/salir");
                window.location.replace("/");
            }
        },
    },
    filters: {},
    async mounted() {
        const paints = await axios.get("/pinturas");
        this.$data.pinturas = paints.data;
    },
});
