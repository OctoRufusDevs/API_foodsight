const ProductModel = require('../models/Product');
const service = {};

service.verifyFields = ({body: {name, description, price}, file}) => {

    let serviceResponse = {
        success : true,
        content: {
            message: "Fields fine",
        }
    }
    
    if(!name || !description || !price || !file){
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

service.verifyUpdateFields = ({body: {name, description, price, image}, file}) => {
    let serviceResponse = {
        success : true,
        content: {
            message: "Fields fine",
        }
    }
    if(!name && !description && !price && !file ){
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

service.create = async({name, description, price}, imageurl, restaurantID ) => {
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
            image: imageurl,
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
        }else{
            serviceResponse = {
                success: true,
                content: {
                    id: productSaved._id,
                    photo: productSaved.image,
                    message: "Product created",
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

service.updateOneById= async (product, contentToUpdate,image) => {
    let serviceResponse = {
        success: true,
        content: {
            message: "Product Updated!"
        }
    }
    
    try{
        Object.keys(contentToUpdate).forEach(
            key =>{
                product[key] =contentToUpdate[key];
            }
            
        );
        if(image){
            product['image'] = image;
        }
        // const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, {
        //     ...contentToUpdate
        // });
        const updatedProduct = await product.save();
        if(!updatedProduct){
            serviceResponse = {
                success: false,
                content: {
                    error: "Post not updated"
                }
            }
        }else{
            serviceResponse = {
                success: true,
                message: 'product updated',
                photo: updatedProduct.image,
            }
        }
        return serviceResponse;
    }catch(e){
        throw  e;
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