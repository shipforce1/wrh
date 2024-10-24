require('dotenv').config(); // Ładowanie zmiennych z pliku .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Dodaj CORS

const app = express();

// Middleware do obsługi danych JSON
app.use(express.json());

// Middleware CORS – umożliwia połączenia między frontendem a backendem
app.use(cors());

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

// Trasa główna
app.get('/', (req, res) => {
    res.send('Welcome to the Warehouse App!'); // Możesz zmienić tę wiadomość na dowolną treść
});

// Obsługa dla tras, które nie istnieją (404 Not Found)
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
