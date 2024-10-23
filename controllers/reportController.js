const Client = require('../models/clientModel');
const Pricing = require('../models/pricingModel');

// Generowanie raportu dla klienta
const generateReport = async (req, res) => {
    try {
        const { id } = req.params; // ID klienta

        // Znajdź klienta
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: 'Klient nie znaleziony' });
        }

        // Znajdź cenniki dla tego klienta
        const pricings = await Pricing.find({ client: id });

        if (pricings.length === 0) {
            return res.status(404).json({ message: 'Brak cenników dla tego klienta' });
        }

        // Oblicz całkowity koszt
        let totalCost = 0;
        pricings.forEach(pricing => {
            totalCost += pricing.price * pricing.quantity;
        });

        // Stwórz raport
        const report = {
            client: {
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address,
            },
            tasks: pricings.map(pricing => ({
                service: pricing.service,
                price: pricing.price,
                quantity: pricing.quantity,
                total: pricing.price * pricing.quantity
            })),
            totalCost,
        };

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas generowania raportu', error });
    }
};

module.exports = {
    generateReport,
};
