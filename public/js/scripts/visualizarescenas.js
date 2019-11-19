new Vue({
    el: "#app",
    data() {
        return {
            escenas: [],
        };
    },
    methods: {
        async eliminarEscena(id) {
            try {
                alert("Eliminando escena...");
                const { data } = await axios.delete(`/escenas/${id}`);
                alert(data);
                const scenes = this.$data.escenas;
                this.$data.escenas = scenes.filter(scene => {
                    return scene.idARScene !== id;
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
        try {
            const scenes = await axios.get("/escenas");
            this.$data.escenas = scenes.data;
        } catch (error) {
            alert(error.response.data);
        }
    },
});
