$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        window.location.replace("/");
    }

    document
        .querySelector(".form-proveedor")
        .addEventListener("submit", async e => {
            e.preventDefault();

            const razonSocial = document.querySelector("#razonsocial").value;
            const RFC = document.querySelector("#RFC").value;
            const description = document.querySelector("#desc").value;
            const codigo = document.querySelector("#identificador").value;
            const medidas = document.querySelector("#medidas").value;
            const color = document.querySelector("#color").value;

            const formData = new FormData();

            formData.append("razonSocial", razonSocial);
            formData.append("rfc", RFC);
            formData.append("description", description);
            formData.append("codigo", codigo);
            formData.append("medidas", medidas);
            formData.append("color", color);

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
