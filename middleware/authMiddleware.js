const jwt = require('jsonwebtoken');

// Middleware do weryfikacji tokenu JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Brak dostępu, token wymagany' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Przypisanie danych użytkownika do req
        next();
    } catch (error) {
        res.status(400).json({ message: 'Nieprawidłowy token' });
    }
};

// Middleware do weryfikacji, czy użytkownik jest adminem
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Dostęp tylko dla adminów' });
        }
        next();
    });
};

module.exports = {
    verifyToken,
    verifyAdmin,
};
