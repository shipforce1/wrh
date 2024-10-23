const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Rejestracja nowego użytkownika
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Sprawdź, czy użytkownik już istnieje
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik o takim e-mailu już istnieje' });
        }

        const newUser = new User({
            username,
            email,
            password,
            role,
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas rejestracji użytkownika', error });
    }
};

// Logowanie użytkownika
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Znajdź użytkownika po emailu
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Niepoprawne dane logowania - użytkownik nie znaleziony' });
        }

        // Sprawdź poprawność hasła
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Niepoprawne dane logowania - nieprawidłowe hasło' });
        }

        // Generowanie tokenu JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Błąd podczas logowania użytkownika:', error); // Wyświetlanie błędu w konsoli serwera
        res.status(500).json({ message: 'Błąd podczas logowania użytkownika', error });
    }
};

// Pobieranie listy użytkowników (dla adminów)
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania użytkowników', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
};
