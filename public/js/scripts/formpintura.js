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

document
    .querySelector(".form-proveedor")
    .addEventListener("submit", async e => {
        e.preventDefault();

        const name = document.querySelector("#nombre").value;
        const price = document.querySelector("#precio").value;
        const vendorCode = document.querySelector("#identificador").value;
        const presentacion = document.querySelector("#presentacion").value;
        const hexCode = document.querySelector("#colorhex").value;
        const rgbCode = document.querySelector("#colorrgba").value;

        try {
            await axios.post("/pinturas", {
                name,
                price,
                vendorCode,
                presentacion,
                hexCode,
                rgbCode,
            });
            window.location.replace("/visualizarpinturas");
        } catch (error) {
            alert(error.response.data);
        }
    });
