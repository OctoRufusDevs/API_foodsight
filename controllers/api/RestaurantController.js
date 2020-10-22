const RestaurantService = require('../../services/RestaurantService');
const controller = {};

controller.createRestaurant = async(req, res) => {
    const {body} = req;
    try{
       
        const prueba = await RestaurantService.create(body);
        console.log(body);
        return res.status(201).json(prueba.content);
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

    const verifyField = RestaurantService.verifyUpdatedFields(req.body);
    if(!verifyField.success){
        return res.status(400).json(verifyField.content);
    }
    // console.log(req.body);
    // if(!restaurant){
    //     return res.status(404).json({
    //         error: "Restaurant not found"
    //     });
    // }

    try {

        const restaurantExists = await RestaurantService.findOneById(_id);
        if(!restaurantExists.success){
            return res.status(404).json(RestaurantExists.content);
        }

        const restaurantUpdated = await RestaurantService.updateById(restaurantExists.content,verifyField.content);
        if(!restaurantUpdated.success){
            return res.status(409).json(restaurantUpdated.content);
        }
        return res.status(200).json(restaurantUpdated.content);
    }catch (e) {
        return res
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


module.exports = controller;