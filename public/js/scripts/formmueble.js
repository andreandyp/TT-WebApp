var file3D, file2D;

$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        window.location.replace("/");
    }

    const modelo3d = document.querySelector("#modelo3d");
    const modelo2d = document.querySelector("#captura");

    modelo3d.onchange = function() {
        file3D = modelo3d.files[0];
    };

    modelo2d.onchange = function() {
        file2D = modelo2d.files[0];
    };
});

document
    .querySelector(".form-proveedor")
    .addEventListener("submit", async e => {
        e.preventDefault();
        if (!file2D) {
            return alert("Falta la captura/miniatura del modelo");
        }

        const name = document.querySelector("#nombre").value;
        const price = document.querySelector("#precio").value;
        const description = document.querySelector("#desc").value;
        const codigo = document.querySelector("#identificador").value;
        const medidas = document.querySelector("#medidas").value;
        const color = document.querySelector("#color").value;

        const formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("codigo", codigo);
        formData.append("medidas", medidas);
        formData.append("modelo3d", file3D);
        formData.append("modelo2d", file2D);
        formData.append("color", color);

        const categorias = Array.from(document.querySelectorAll(".categoria"))
            .filter(cat => cat.checked)
            .map(cat => cat.value.toUpperCase());

        if (!file3D && !categorias.includes("PISOS")) {
            return alert("Falta el modelo en 3D");
        }

        const estilos = Array.from(document.querySelectorAll(".estilo"))
            .filter(estilo => estilo.checked)
            .map(estilo => estilo.value.toUpperCase());

        const tipos = Array.from(document.querySelectorAll(".tipo"))
            .filter(tipo => tipo.checked)
            .map(tipo => tipo.value.toUpperCase());

        formData.append("type", tipos.join(","));
        formData.append("category", categorias.join(","));
        formData.append("style", estilos.join(","));

        try {
            await axios.post("/modelos", formData);
            alert("Subiendo modelo...");
            window.location.replace("/visualizarmodelos");
        } catch (error) {
            alert(error.response.data);
        }
    });
