document.querySelector(".form-signin").addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
        usuario: document.querySelector("#inputuser").value,
        contraseña: document.querySelector("#inputPassword").value,
    };

    try {
        await axios.post("/auth/loginProvider", data);
        window.location.replace("/formproveedor");
    } catch (error) {
        alert(error.response.data);
    }
});
