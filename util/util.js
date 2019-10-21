const esAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).send("No puedes entrar aquí");
    }

    return next();
};

const esProveedor = (req, res, next) => {
    if (req.user.role !== "provider") {
        return res.status(401).send("No puedes entrar aquí");
    }

    return next();
};

const estaAutentificado = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send("No has iniciado sesión");
    }

    return next();
};

module.exports = {
    esAdmin,
    esProveedor,
    estaAutentificado,
};
