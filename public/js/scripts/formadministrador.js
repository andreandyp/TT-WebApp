$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        window.location.replace("/");
    }
});

document
    .querySelector(".needs-validation")
    .addEventListener("submit", async e => {
        e.preventDefault();
        const expregUsuario = /^[a-zA-Z0-9ñÑ_-]+$/;

        const username = document.querySelector("#usuario").value;
        if (!expregUsuario.test(username)) {
            return alert("El usuario no es válido");
        }

        const password = document.querySelector("#contraseña").value;
        const name = document.querySelector("#nombre").value;

        const data = {
            username,
            password,
            name,
        };

        try {
            await axios.post("/proveedor", data);
            window.location.replace("/proveedores.html");
        } catch (error) {
            alert(error.response);
        }
    });
