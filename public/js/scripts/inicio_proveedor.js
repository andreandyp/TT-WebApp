document.querySelector(".form-signin").addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
        usuario: document.querySelector("#inputuser").value,
        contraseña: document.querySelector("#inputPassword").value,
    };

    try {
        const res = await axios.post("/auth/loginProvider", data);
        if (res.data.completo) {
            return window.location.replace("/visualizarmodelos");
        }

        window.location.replace("/formproveedor");
    } catch (error) {
        alert(error.response.data);
    }
});
