const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: String,
    email: String,
    password: String,
    photo: String,
    location: String,
    description: String,
    phone: String,
    address: String,
    facebook: String,
    instagram: String,
    rating: Number,


});

module.exports = mongoose.model("Restaurant", RestaurantSchema);

