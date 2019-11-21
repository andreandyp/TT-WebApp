var logoFile;
$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        window.location.replace("/");
    }

    const logoElem = document.querySelector("#logo");

    logoElem.onchange = function() {
        logoFile = logoElem.files[0];
    };

    document
        .querySelector(".form-proveedor")
        .addEventListener("submit", async e => {
            e.preventDefault();

            const razonSocial = document.querySelector("#razonsocial").value;
            const rfc = document.querySelector("#RFC").value;
            const persona = document.querySelector("#persona").value;
            const rango = document.querySelector("#presupuesto").value;

            const category = Array.from(document.querySelectorAll(".categoria"))
                .filter(cat => cat.checked)
                .map(cat => cat.value.toUpperCase());

            const socialNetworks = Array.from(
                document.querySelectorAll(".social")
            ).map(elem => elem.value);

            const addresses = Array.from(document.querySelectorAll(".dir"));

            const telefonos = Array.from(document.querySelectorAll(".tel"));

            const emails = Array.from(document.querySelectorAll(".email"));

            const stores = [];

            for (let i = 0; i < addresses.length; i++) {
                stores.push({
                    address: addresses[i].value,
                    phone: telefonos[i].value,
                    email: emails[i].value,
                });
            }

            const formData = new FormData();
            formData.append("logo", logoFile);

            try {
                alert("Subiendo datos...");
                await axios.put("/proveedor", {
                    razonSocial,
                    rfc,
                    persona,
                    category,
                    socialNetworks,
                    rango,
                    stores,
                });

                alert("Subiendo logo...");
                await axios.post("/uploads/logo", formData);

                window.location.replace("/visualizarinfoproveedor");
            } catch (error) {
                alert(error.response.data);
            }
        });

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
        return {};
    },
});
