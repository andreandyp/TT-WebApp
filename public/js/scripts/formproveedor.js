$(document).ready(async () => {
    try {
        await axios.get("/auth/activo");
    } catch (error) {
        window.location.replace("/");
    }
});
