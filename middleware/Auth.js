const {verifyID} = require("../utils/MongoUtils");
const RestaurantService = require("../services/RestaurantService");
const middleware = {};

middleware.verifyAuth = async (req, res, next) => {
    
    const {_id} =req.headers;
    if (!verifyID(_id)) {
        return res.status(400).json({
            error: "Error in ID"
        })
    }

    const restaurantExists = await RestaurantService.findOneById(_id);
    if (!restaurantExists.success) {
        return res.status(404).json(restaurantExists.content);
    }

    req.restaurant = restaurantExists.content;

    next();
}

module.exports = middleware;