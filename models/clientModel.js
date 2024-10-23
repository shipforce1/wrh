const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Middleware do automatycznej aktualizacji daty "updatedAt" przy każdej zmianie danych
clientSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
