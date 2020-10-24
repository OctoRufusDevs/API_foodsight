const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
    },
    savedProducts: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }]
    },
    savedRestaurants: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        }]
    }
    
});

UserSchema
    .virtual("password")
    .set(function (password) {
        this.hashedPassword = crypto.createHmac("sha256", password).digest("hex");
    });

UserSchema.methods = {
    comparePassword: function (password) {
        return (
            crypto.createHmac("sha256",password).digest("hex")===this.hashedPassword
        );
    }
}
module.exports = mongoose.model("User", UserSchema);
