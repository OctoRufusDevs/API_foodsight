const productService = require('../../services/ProductService');
const controller = {};

controller.createProduct = async(req, res) => {
    
    const fieldsValidation = productService.verifyFields(req.body);
    if(!fieldsValidation.success){
        return res.status(400).json(fieldsValidation.content);
    }

    try{   
        const createProduct = await productService.create(req.body);
        if(!createProduct.success){
            return res.status(409).json(createProduct.content);
        }
        console.log(req.body);
        return res.status(201).json(createProduct.content);
    }catch(e){
        return res.status(500).json({error: e.message});
    }
}

module.exports = controller;