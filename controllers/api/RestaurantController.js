const restaurantService = require('../../services/RestaurantService');
const controller = {};

controller.createRestaurant = async(req, res) => {
    const {body} = req;
    try{
       
        const prueba = await restaurantService.create(req.body);
        return res.status(201).json(prueba.content);
    }catch(e){
        return res.status(500).json({error: 'Somos tontos'})
    }
}

module.exports = controller;