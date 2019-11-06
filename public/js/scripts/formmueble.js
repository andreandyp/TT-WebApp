$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        window.location.replace("/");
    }
});

document
    .querySelector(".form-proveedor")
    .addEventListener("submit", async e => {
        console.log("AQUI");
        e.preventDefault();
        console.log("AQUI TAMBIEN");

        const name = document.querySelector("#nombre").value;
        const price = document.querySelector("#precio").value;
        const description = document.querySelector("#desc").value;
        const codigo = document.querySelector("#identificador").value;
        const medidas = document.querySelector("#medidas").value;
        const modelo3d = document.querySelector("#modelo3d");
        const modelo2d = document.querySelector("#captura");

        const formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("codigo", codigo);
        formData.append("medidas", medidas);

        return console.log(modelo3d);

        try {
            await axios.post("/modelos", formData);
            window.location.replace("/proveedores.html");
        } catch (error) {
            alert(error.response);
        }
    });
