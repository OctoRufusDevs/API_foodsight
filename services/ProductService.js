const ProductModel = require('../models/Product');
const service = {};

service.verifyFields = ({name, description, price, image}) => {
    let serviceResponse = {
        success : true,
        content: {
            message: "Fields fine",
        }
    }
    if(!name || !description || !price || !image){
        serviceResponse = {
            success: false,
            content: {
                error: "Empty fields"
            }
        }
        return serviceResponse;
    }
    return serviceResponse;
}

service.create = async({name, description, price, image,productsRestaurant} ) => {
    let serviceResponse = {
        success: true,
        content: {
            message: "Product created",
        }
    }

    try{
        const product = new ProductModel({
            name,
            description,
            price,
            image,
            productsRestaurant

        });
        
        const productSaved = await product.save();
        if(!productSaved){
            serviceResponse = {
                success: false,
                content: {
                    error: "Product not created"
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