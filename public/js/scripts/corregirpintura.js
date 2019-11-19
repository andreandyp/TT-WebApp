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
                pintura: {},
                idPaint: 0,
            };
        },
        methods: {
            async subir() {
                try {
                    alert("Subiendo pintura, espera un poco...");
                    await axios.put("/pinturas", {
                        idPaint: this.$data.idPaint,
                        name: this.$data.pintura.name,
                        vendorCode: this.$data.pintura.vendorCode,
                        rgbCode: this.$data.pintura.rgbCode,
                        hexCode: this.$data.pintura.hexCode,
                        price: this.$data.pintura.price,
                        presentacion: this.$data.pintura.presentacion,
                    });
                    window.location.replace("/visualizarpinturas");
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
        },
        filters: {},
        async mounted() {
            var url = new URL(window.location.href);
            var diagonal = url.pathname.lastIndexOf("/");
            var idPaint = url.pathname.slice(diagonal + 1);
            this.$data.idPaint = idPaint;
            const pintura = await axios.get("/pinturas/" + idPaint);
            this.$data.pintura = pintura.data;
        },
    });
});
