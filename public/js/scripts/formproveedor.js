var logo;
$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        window.location.replace("/");
    }

    const logoElem = document.querySelector("#logo");

    logoElem.onchange = function() {
        logo = logoElem.files[0];
    };

    document
        .querySelector(".form-proveedor")
        .addEventListener("submit", async e => {
            e.preventDefault();

            const razonSocial = document.querySelector("#razonsocial").value;
            const RFC = document.querySelector("#RFC").value;
            const tipo;
            const persona;
            const categoria

            const formData = new FormData();

            formData.append("razonSocial", razonSocial);
            formData.append("rfc", RFC);

            const categorias = Array.from(
                document.querySelectorAll(".categoria")
            )
                .filter(cat => cat.checked)
                .map(cat => cat.value.toUpperCase());
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
