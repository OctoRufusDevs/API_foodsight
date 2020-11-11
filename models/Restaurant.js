const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const RestaurantSchema = new Schema({
    name: String,
    email: String,
    hashedPassword: String,
    photo: String,
    location: String,
    description: String,
    phone: String,
    address: String,
    facebook: String,
    instagram: String,
    rating: {
        type: Number,
        default: 0,
    },
    sumVotes: {
        type: Number,
        default: 0,
    },
    numVotes: {
        type: Number,
        default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

RestaurantSchema
    .virtual("password")
    .set(function(password){
        this.hashedPassword = crypto.createHmac("sha256", password).digest("hex");
    });
    RestaurantSchema.methods = {
        comparePassword: function(password){
            return (crypto.createHmac("sha256", password).digest("hex") === this.hashedPassword);
        }
    }

module.exports = mongoose.model("Restaurant", RestaurantSchema);

