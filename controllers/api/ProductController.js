const cloudinary = require('../../config/cloudinary');
const Product = require('../../models/Product');
const { verifyFields } = require('../../services/ProductService');
const productService = require('../../services/ProductService');
const { verifyID } = require('../../utils/MongoUtils');
const controller = {};
const upload = require('../../utils/multer');

controller.createProduct = async(req, res) => {
    console.log(req.file,"xd");
    
    const fieldsValidation = productService.verifyFields(req);
    if(!fieldsValidation.success){
        return res.status(400).json(fieldsValidation.content);
    }
    const {restaurant} = req;
    try{   
        const result = await cloudinary.uploader.upload(req.file.path);
        const createProduct = await productService.create(req.body,result.secure_url,restaurant._id);
        if(!createProduct.success){
            return res.status(409).json(createProduct.content);
        }
        
        return res.status(201).json(createProduct.content);
    }catch(e){
        return res.status(500).json({error: e.message});
    }
}

controller.findOneById = async (req, res) => {
    const {_id} = req.params;
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error in ID",
        });
    }
    try{
        const productExists = await productService.findOneById(_id);
        if(!productExists){
            return res.status(404).json(productExists.content);
        }
        return res.status(200).json(productExists.content)
    }catch(e){
        return res.status(500).json({
            error: e.message
        })
    }
}

controller.findAll = async(req, res) => {
    try{
        const productResponse = await productService.findAll();
        console.log(productResponse.content);
        res.status(200).json(productResponse.content);

    }catch(e){
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

controller.updateProduct = async (req, res) => {

    const {_id} = req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error in ID"
        });
    }
    
    const fieldVerified = productService.verifyUpdateFields(req);
    if(!fieldVerified.success){
        return res.status(400).json(fieldVerified.content);
    }
    let result;
    try{
        const productExists = await productService.findOneById(_id);
        if(!productExists){
            return res.status(404).json(productExists.content);
        }
        if(req.file){
            
         result = await cloudinary.uploader.upload(req.file.path);
        }
        const productUpdated = await productService.updateOneById(
            productExists.content,
            fieldVerified.content,
            req.file ? result.secure_url : null
        );
        if(!productUpdated.success){
            return res.status(409).json(productUpdated.content);
        }
        return res.status(200).json(productUpdated.content);
    }catch(e){
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

controller.deleteOneById = async (req, res) => {
    const {_id} = req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error in ID"
        });
    }
    try{
        const productExists = await productService.findOneById(_id);
        if(!productExists.success){
            return res.status(404).json(productExists.content);
        }
        const deleted = await productService.deleteOneById(_id);
        if(!deleted.success){
            return res.status(409).json(deleted.content);
        }
        return res.status(200).json(deleted.content);
    }catch(e){
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


module.exports = controller;