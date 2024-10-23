const Pricing = require('../models/pricingModel');
const Client = require('../models/clientModel');

// Dodawanie nowego cennika dla klienta
const createPricing = async (req, res) => {
    try {
        const clientId = req.params.id;
        const { service, price, quantity, description } = req.body;

        const pricing = new Pricing({
            client: clientId,
            service,
            price,
            quantity,
            description
        });

        const savedPricing = await pricing.save();
        res.status(201).json(savedPricing);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania cennika', error });
    }
};

// Pobieranie cenników dla danego klienta
const getPricing = async (req, res) => {
    try {
        const clientId = req.params.id;
        const pricing = await Pricing.find({ client: clientId });
        res.status(200).json(pricing);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania cennika', error });
    }
};

// Aktualizacja cennika
const updatePricing = async (req, res) => {
    try {
        const pricingId = req.params.pricingId;
        const { service, price, quantity, description } = req.body;

        const updatedPricing = await Pricing.findByIdAndUpdate(
            pricingId,
            { service, price, quantity, description },
            { new: true, runValidators: true }
        );

        if (!updatedPricing) {
            return res.status(404).json({ message: 'Cennik nie znaleziony' });
        }

        res.status(200).json(updatedPricing);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas aktualizacji cennika', error });
    }
};

// Usuwanie cennika
const deletePricing = async (req, res) => {
    try {
        const pricingId = req.params.pricingId;

        const deletedPricing = await Pricing.findByIdAndDelete(pricingId);

        if (!deletedPricing) {
            return res.status(404).json({ message: 'Cennik nie znaleziony' });
        }

        res.status(200).json({ message: 'Cennik usunięty' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania cennika', error });
    }
};

module.exports = {
    createPricing,
    getPricing,
    updatePricing,
    deletePricing
};
