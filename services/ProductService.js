const ProductModel = require('../models/Product');
const service = {};

service.verifyFields = ({name, description, price, image}) => {
    let serviceResponse = {
        success : true,
        content: {
            message: "Fields fine",
        }
    }
    if(!name && !description && !price && !image){
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

service.verifyUpdateFields = ({name, description, price, image}) => {
    let serviceResponse = {
        success : true,
        content: {
            message: "Fields fine",
        }
    }
    if(!name && !description && !price && !image){
        serviceResponse = {
            success: false,
            content: {
                error: "Empty fields"
            }
        }
        return serviceResponse;
    }
    if(name) serviceResponse.content.name = name;
    if(description) serviceResponse.content.description = description;
    if(price) serviceResponse.content.price = price;
    if(image) serviceResponse.content.image = image;

    return serviceResponse;
}

service.create = async({name, description, price, image}, restaurantID ) => {
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
            restaurant: restaurantID

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

service.findAll = async() => {
    let serviceResponse = {
        success: true,
        content: {}
    }
    try{
        const products = await ProductModel.find({}, undefined, {}).exec();

        serviceResponse.content = {
            products,
            count: products.length,
        }
        return serviceResponse;
    }
    catch(e){
        throw new Error("Internal Server Error");
    }
}

service.findOneById = async (_id) => {
    let serviceResponse = {
        success:  true,
        content: {
            message: "Product Found"
        }
    }
    try{
        const product = await ProductModel.findById(_id).exec();
        if(!product){
            serviceResponse = {
                success: false,
                content: {
                    error: "Product not found",
                },
            };
        }else{
            serviceResponse.content = product;
        }
        return serviceResponse;
    }catch(e){
        throw new Error("Internal Server Error");
    }
}

service.updateOneById= async (product, contentToUpdate) => {
    let serviceResponse = {
        success: true,
        content: {
            message: "Product Updated!"
        }
    }

    try{
        const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, {
            ...contentToUpdate
        });
        if(!updatedProduct){
            serviceResponse = {
                success: false,
                content: {
                    error: "Post not updated"
                }
            }
        }
        return serviceResponse;
    }catch(e){
        throw new Error("Internal Server Error");
    }
}

service.deleteOneById = async(_id) =>{
    let serviceResponse = {
        success:  true,
        content: {
            message: "Product deleted"
        }
    }

    try{
        const productDeleted = await ProductModel.findByIdAndDelete(_id).exec();
        if(!productDeleted){
            serviceResponse = {
                succes: false,
                content: {
                    error: "Product not deleted"
                }
            }
        }
        return serviceResponse;
    }catch(e){
        throw e;
    }
}
module.exports = service;