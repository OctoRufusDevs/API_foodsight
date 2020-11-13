const cloudinary = require('../../config/cloudinary');
const RestaurantService = require('../../services/RestaurantService');
const controller = {};
const upload = require('../../utils/multer');
const { verifyID } = require('../../utils/MongoUtils');
const Restaurant = require('../../models/Restaurant');



controller.createRestaurant = async(req, res) => {
    const {body} = req;
    try{
       
        const check = await RestaurantService.verifyRegisterFields(req);
        if(!check.success){
            return res.status(400).json( check.content);
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const createRestaurant = await RestaurantService.create(body, result.secure_url);
        if(!createRestaurant.success){
            return res.status(409).json(createRestaurant.content);
        }
        return res.status(201).json(createRestaurant.content);
    }catch(e){
        return res.status(500).json({error: 'Somos tontos'})
    }

}

controller.finOneById = async (req, res) =>{
    const {_id} = req.params;
    try{
        const restaurantExists = await RestaurantService.findOneById(_id);
        if(!restaurantExists.success){
            return res.status(404).json(restaurantExists.content);
        }
        return res.status(200).json(restaurantExists.content);
    }catch (e) {
        return res.status(500).json({error: "Internal Server error"});
    }
};

controller.updateById = async (req, res) =>{
    const {_id} = req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error in IDc"
        });
    }
    const verifyField = RestaurantService.verifyUpdatedFields(req);
    if(!verifyField.success){
        return res.status(400).json(verifyField.content);
    }
    let result;
    try {
        const restaurantExists = await RestaurantService.findOneById(_id);
        if(!restaurantExists.success){
            return res.status(404).json(RestaurantExists.content);
        }
        if(req.file){
            result = await cloudinary.uploader.upload(req.file.path);
           }
        const restaurantUpdated = await RestaurantService.updateById(
            restaurantExists.content,
            verifyField.content,
            req.file ? result.secure_url : null
        );
        if(!restaurantUpdated.success){
            return res.status(409).json(restaurantUpdated.content);
        }
        return res.status(200).json(restaurantUpdated.content);
    }catch (e) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

}

controller.findAll = async (req,res) => {
    
    try {
        const restaurantsResponse = await RestaurantService.findAll();
        res.status(200).json(restaurantsResponse.content);
    } catch(e){
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

};

controller.deleteOneByID = async (req,res) =>{
    const {_id} = req.body;
    try {
        const restaurantExists = await RestaurantService.findOneById(_id);
        if(!restaurantExists.success){
            return res.status(404).json(restaurantExists.content);
        }

        const deleted = await RestaurantService.deleteOneById(_id);
        if(!deleted.success){
            return res.status(409).json(deleted.content);
        }
        res.status(200).json(deleted.content);
    }catch (e) {
        return res.status(500).json({
            error: "Internal Server Error",
        })
    }

};

controller.rateRestaurant = async (req, res) => {
    const {_id, rate} = req.body;
    
    if(!verifyID(_id)){
        return res.status(400).json({
            error: "Error en id",
        });
    }
    try{
        const restaurantExists = await RestaurantService.findOneById(_id);
        if(!restaurantExists.success){
            return res.status(404).json(restaurantExists.content);
        }
        const restaurantRated = await RestaurantService.rateRestaurant(restaurantExists.content, rate);
        if(!restaurantRated.success){
            return res.status(409).json(restaurantRated.content);
        }
        return res.status(200).json(restaurantRated.content);
    } catch(e){
        console.log(e);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};


module.exports = controller;