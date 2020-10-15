const Restaurant = require('../models/Restaurant');
const service = {};

service.create = async({name, email, password, description, phone, rating}) => {
    let serviceResponse = {
        success: true,
        content: {
            message: "Restaurant created",
        }
    }

    try{
        const restaurant = new Restaurant({
            name,
            email,
            password,
            description,
            phone,
            rating
        });
        
        const restaurantSaved = await restaurant.save();
        if(!restaurantSaved){
            serviceResponse = {
                success: false,
                content: {
                    error: "Post not created"
                }
            }
        }

        return serviceResponse;
    }catch(error){
        throw new Error("Internal Server Error")
    }finally{
        return serviceResponse;
    }
};

module.exports = service;