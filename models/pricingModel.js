const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    }
}, {
    timestamps: true // Automatyczne dodawanie "createdAt" i "updatedAt"
});

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;
