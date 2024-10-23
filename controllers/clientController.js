const Joi = require('joi');
const Client = require('../models/clientModel');

// Schemat walidacji dla klientów
const clientSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).max(15).required(),
    address: Joi.string().min(5).max(100).required(),
});

// Dodawanie nowego klienta
const createClient = async (req, res) => {
    try {
        // Walidacja danych
        const { error } = clientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, email, phone, address } = req.body;

        const newClient = new Client({
            name,
            email,
            phone,
            address,
        });

        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania klienta', error });
    }
};

// Pobieranie klientów z paginacją i opcją filtrowania
const getClients = async (req, res) => {
    try {
        const { page = 1, limit = 10, name } = req.query;

        // Jeśli podano parametr `name`, filtruj klientów według nazwy
        const query = name ? { name: { $regex: name, $options: 'i' } } : {};

        // Znajdź klientów spełniających kryteria, z paginacją
        const clients = await Client.find(query)
            .limit(limit * 1) // Ograniczenie liczby wyników
            .skip((page - 1) * limit) // Pominięcie wyników poprzednich stron
            .exec();

        const count = await Client.countDocuments(query); // Liczba wszystkich klientów spełniających kryteria

        res.status(200).json({
            clients,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania klientów', error });
    }
};

// Aktualizacja danych klienta
const updateClient = async (req, res) => {
    try {
        const { id } = req.params; // Pobranie ID klienta z parametrów URL

        // Walidacja danych
        const { error } = clientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, email, phone, address } = req.body;

        // Znajdź klienta po ID i zaktualizuj jego dane
        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { name, email, phone, address },
            { new: true, runValidators: true } // Opcja `new: true` zwróci zaktualizowany obiekt
        );

        if (!updatedClient) {
            return res.status(404).json({ message: 'Klient nie znaleziony' });
        }

        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas aktualizacji klienta', error });
    }
};

// Usuwanie klienta
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        // Znajdź klienta po ID i usuń go
        const deletedClient = await Client.findByIdAndDelete(id);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Klient nie znaleziony' });
        }

        res.status(200).json({ message: 'Klient usunięty' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania klienta', error });
    }
};

module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient,
};
