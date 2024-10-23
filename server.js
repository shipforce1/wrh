require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Ładowanie zmiennych z pliku .env

const app = express();

// Middleware do obsługi danych JSON
app.use(express.json());

// Połączenie z MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Połączono z MongoDB');
}).catch((error) => {
    console.error('Błąd połączenia z MongoDB:', error);
});

// Import tras
const clientRoutes = require('./routes/clientRoutes');

// Używanie tras (wszystkie trasy będą zaczynać się od /api)
app.use('/api', clientRoutes);

// Trasa testowa
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
