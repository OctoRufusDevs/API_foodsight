const Restaurant = require('../models/Restaurant');
const service = {};

service.create = async({title, description}) => {
    let serviceResponse = {
        success: true,
        content: {
            message: "Restaurant created",
        }
    }

    try{
        const restaurant = new Restaurant({
            title,
            description
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