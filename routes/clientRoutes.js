const express = require('express');
const { createClient, getClients, updateClient, deleteClient } = require('../controllers/clientController');
const { createPricing, getPricing, updatePricing, deletePricing } = require('../controllers/pricingController');

const router = express.Router();

// Trasy do zarządzania klientami
router.post('/clients', createClient);
router.get('/clients', getClients);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

// Trasy do zarządzania cennikami
router.post('/clients/:id/pricing', createPricing); // Dodawanie cennika do klienta
router.get('/clients/:id/pricing', getPricing); // Pobieranie cennika klienta
router.put('/pricing/:pricingId', updatePricing); // Aktualizacja cennika
router.delete('/pricing/:pricingId', deletePricing); // Usuwanie cennika

module.exports = router;
