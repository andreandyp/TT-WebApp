document.querySelector(".form-signin").addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
        usuario: document.querySelector("#inputuser").value,
        contraseña: document.querySelector("#inputPassword").value,
    };

    try {
        await axios.post("/auth/loginAdmin", data);
        window.location.replace("/misproveedores");
    } catch (error) {
        alert(error.response.data);
    }
});
